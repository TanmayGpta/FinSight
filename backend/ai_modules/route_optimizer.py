# route_optimizer.py
import math
import random
import requests
import time
import os
from math import ceil

try:
    import polyline as polyline_decoder
except Exception:
    polyline_decoder = None

# --------------------------
# Constants & Config
# --------------------------
GOOGLE_MATRIX_MAX = 25   # conservative chunk size per request (adjust if you know your account limits)
DEFAULT_TORTUOSITY = 1.4  # factor to approximate road distance from straight-line when falling back
REQUEST_TIMEOUT = 10      # seconds per HTTP request
MAX_RETRIES = 3           # retries for Google API calls


# --------------------------
# 1) Geometry utils
# --------------------------
def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Haversine great-circle distance in kilometers.
    """
    lat1, lon1, lat2, lon2 = map(float, [lat1, lon1, lat2, lon2])
    R = 6371.0  # Earth radius in km
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (math.sin(d_lat / 2) ** 2 +
         math.cos(math.radians(lat1)) *
         math.cos(math.radians(lat2)) *
         math.sin(d_lon / 2) ** 2)
    a = min(1.0, max(0.0, a))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


# --------------------------
# 2) Google Distance Matrix (robust, batched)
# --------------------------
def _call_distance_matrix(origins_coords, destinations_coords, api_key, timeout=REQUEST_TIMEOUT):
    """
    Single request to Google Distance Matrix for the given origins/destinations.
    origins_coords/destinations_coords are lists of "lat,lon" strings.
    Returns JSON dict (raises requests exceptions on HTTP issues).
    """
    url = "https://maps.googleapis.com/maps/api/distancematrix/json"
    params = {
        "origins": "|".join(origins_coords),
        "destinations": "|".join(destinations_coords),
        "key": api_key,
        "mode": "driving",
        "units": "metric"
    }
    resp = requests.get(url, params=params, timeout=timeout)
    resp.raise_for_status()
    return resp.json()


def get_google_distance_matrix(locations, api_key, max_retries=MAX_RETRIES):
    """
    Build a full distance matrix using Google Maps Distance Matrix API.
    - locations: list of dicts { 'id', 'lat', 'lon' }
    - api_key: Google Maps API Key (string)
    Returns: dict matrix[from_id][to_id] = distance_km (float)
    Guarantees a filled matrix: uses haversine fallback when needed.
    """
    n = len(locations)
    print(f"[DistanceMatrix] preparing distances for {n} locations...")

    if n == 0:
        return {}

    coords = [f"{loc['lat']},{loc['lon']}" for loc in locations]
    ids = [str(loc['id']) for loc in locations]

    # Initialize matrix with empty dicts
    matrix = {loc_id: {} for loc_id in ids}

    # Create origin chunks to respect Google limits
    chunk_size = GOOGLE_MATRIX_MAX
    origin_chunks = [coords[i:i+chunk_size] for i in range(0, n, chunk_size)]
    origin_index_chunks = [list(range(i, min(i+chunk_size, n))) for i in range(0, n, chunk_size)]

    destinations_coords = coords  # we send full destinations set each request

    for chunk_idx, origin_chunk in enumerate(origin_chunks):
        origin_indices = origin_index_chunks[chunk_idx]
        attempt = 0
        success = False

        while not success and attempt < max_retries:
            attempt += 1
            try:
                if attempt > 1:
                    backoff = 0.5 * (2 ** (attempt - 2))
                    print(f"[DistanceMatrix] retry {attempt}/{max_retries} for chunk {chunk_idx}, sleeping {backoff}s")
                    time.sleep(backoff)

                resp_json = _call_distance_matrix(origin_chunk, destinations_coords, api_key)
                status = resp_json.get("status", "")
                if status != "OK":
                    raise RuntimeError(f"Distance Matrix top-level status: {status} ({resp_json.get('error_message')})")

                rows = resp_json.get("rows", [])
                # Parse rows for this chunk
                for ri, row in enumerate(rows):
                    origin_global_index = origin_indices[ri]
                    from_id = ids[origin_global_index]
                    elements = row.get("elements", [])
                    for j, elem in enumerate(elements):
                        to_id = ids[j]
                        if elem.get("status") == "OK" and "distance" in elem and "value" in elem["distance"]:
                            dist_km = float(elem["distance"]["value"]) / 1000.0
                            matrix[from_id][to_id] = dist_km
                        else:
                            # fallback to Haversine with penalty factor to discourage these routes
                            fallback = haversine_distance(
                                locations[origin_global_index]["lat"], locations[origin_global_index]["lon"],
                                locations[j]["lat"], locations[j]["lon"]
                            )
                            matrix[from_id][to_id] = float(round(fallback * DEFAULT_TORTUOSITY, 6))
                success = True

            except Exception as e:
                print(f"[DistanceMatrix] chunk {chunk_idx} attempt {attempt} error: {e}")
                if attempt >= max_retries:
                    print(f"[DistanceMatrix] max retries reached for chunk {chunk_idx}; filling fallback distances for these origins.")
                    # Fill fallback haversine for this chunk
                    for origin_global_index in origin_indices:
                        from_id = ids[origin_global_index]
                        for j in range(n):
                            to_id = ids[j]
                            fallback = haversine_distance(
                                locations[origin_global_index]["lat"], locations[origin_global_index]["lon"],
                                locations[j]["lat"], locations[j]["lon"]
                            )
                            matrix[from_id][to_id] = float(round(fallback * DEFAULT_TORTUOSITY, 6))
                    success = True
                else:
                    # retry loop continues
                    continue

    # Ensure diagonal zero and all entries present
    for i_idx, i_id in enumerate(ids):
        matrix[i_id][i_id] = 0.0
        for j_idx, j_id in enumerate(ids):
            if j_id not in matrix[i_id]:
                fallback = haversine_distance(locations[i_idx]["lat"], locations[i_idx]["lon"], locations[j_idx]["lat"], locations[j_idx]["lon"])
                matrix[i_id][j_id] = float(round(fallback * DEFAULT_TORTUOSITY, 6))

    print("[DistanceMatrix] matrix build completed.")
    return matrix


# --------------------------
# 3) Google Directions helper (optional) - produces polyline coords
# --------------------------
def get_directions_polyline_coords(ordered_coords, api_key):
    """
    Given an ordered list of (lat, lon) pairs [origin, waypoint..., destination],
    call Google Directions (overview_polyline) and return decoded list of (lat, lon).
    - ordered_coords: list of (lat, lon) tuples in route order
    - api_key: Google Maps API Key
    Returns: list of [lat, lon] pairs (floats). If Directions fails, returns straight-line coords.
    """
    if not api_key:
        print("[Directions] No API key provided; skipping Directions call.")
        return ordered_coords

    if not polyline_decoder:
        print("[Directions] polyline package not installed; returning ordered_coords directly.")
        return ordered_coords

    if len(ordered_coords) < 2:
        return ordered_coords

    try:
        origin = f"{ordered_coords[0][0]},{ordered_coords[0][1]}"
        destination = f"{ordered_coords[-1][0]},{ordered_coords[-1][1]}"
        waypoints = ordered_coords[1:-1]
        waypoints_str = "|".join([f"{lat},{lon}" for lat, lon in waypoints]) if waypoints else None

        url = "https://maps.googleapis.com/maps/api/directions/json"
        params = {
            "origin": origin,
            "destination": destination,
            "key": api_key,
            "mode": "driving",
            "departure_time": "now",  # can be 'now' or omitted
            "units": "metric"
        }
        if waypoints_str:
            params["waypoints"] = waypoints_str

        resp = requests.get(url, params=params, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        j = resp.json()
        if j.get("status") != "OK":
            print(f"[Directions] Directions API returned status {j.get('status')}: {j.get('error_message')}")
            return ordered_coords

        points = j["routes"][0]["overview_polyline"]["points"]
        coords = polyline_decoder.decode(points)  # list of (lat, lon)
        # polyline returns lat/lon pairs as floats already
        return coords

    except Exception as e:
        print(f"[Directions] Failed to get directions polyline: {e}")
        return ordered_coords


# --------------------------
# 4) Mock data generator
# --------------------------
def generate_mock_coordinates(center_lat, center_lon, num_points, radius_km=10):
    """
    Generate num_points random coordinates roughly within radius_km of center.
    Returns list of dicts: { 'lat', 'lon' }.
    """
    print(f"Generating {num_points} mock coordinates...")
    points = []
    for _ in range(num_points):
        r = radius_km * math.sqrt(random.random())
        theta = random.random() * 2 * math.pi
        dy = r * math.sin(theta)
        dx = r * math.cos(theta)
        new_lat = center_lat + (dy / 110.574)
        new_lon = center_lon + (dx / (111.320 * math.cos(math.radians(center_lat))))
        points.append({"lat": new_lat, "lon": new_lon})
    return points


# --------------------------
# 5) Greedy optimizer (nearest neighbor) - supports real matrix
# --------------------------
def optimize_route_greedy(start_node, clients, api_key=None, include_polyline=True):
    """
    Greedy nearest-neighbour route generation.
    - start_node: dict { 'id','name','lat','lon' }
    - clients: list of dicts { 'id', 'name', 'lat', 'lon' }
    - api_key: optional Google Maps API key string; if provided the function
               will attempt to use real driving distances from Google Maps.
    - include_polyline: if True and Google Directions available, returns 'polyline' in result
    Returns dict:
      {
        "optimized_route": [ {step, id, name, lat, lon, distance_from_last, type}, ... ],
        "total_distance_km": float,
        "client_count": int,
        "estimated_fuel_cost": int,
        "data_source": "Google Maps API" | "Haversine Math (Simulated)",
        "polyline": [[lat, lon], ...]   # optional
      }
    """
    print("Starting Route Optimization...")
    all_nodes = [start_node] + clients

    distance_matrix = None
    data_source = "Haversine Math (Simulated)"

    # Attempt Google Matrix if api_key provided
    if api_key:
        try:
            distance_matrix = get_google_distance_matrix(all_nodes, api_key)
            if distance_matrix:
                data_source = "Google Maps API"
        except Exception as e:
            print(f"[optimize_route_greedy] Google matrix retrieval failed: {e}. Falling back to Haversine.")
            distance_matrix = None
            data_source = "Haversine Math (Simulated)"

    # Defensive: ensure ids are strings for consistent lookups
    for node in all_nodes:
        node['id'] = str(node.get('id', node.get('name', '')))

    # Make a shallow copy of clients for mutation
    unvisited = [dict(c) for c in clients]
    current_node = dict(start_node)
    current_node['id'] = str(current_node.get('id', 'BRANCH'))

    path = []
    total_distance = 0.0

    # Add start node
    path.append({
        "step": 1,
        "id": current_node['id'],
        "name": current_node.get('name', 'Branch Office'),
        "lat": current_node['lat'],
        "lon": current_node['lon'],
        "type": "branch",
        "distance_from_last": 0.0
    })

    step_counter = 2

    while unvisited:
        nearest_client = None
        nearest_index = -1
        min_dist = float('inf')

        for i, candidate in enumerate(unvisited):
            cand_id = str(candidate['id'])
            cur_id = str(current_node['id'])

            # Prefer distance from matrix if present and keys exist
            dist = None
            if distance_matrix and cur_id in distance_matrix and cand_id in distance_matrix[cur_id]:
                try:
                    dist = float(distance_matrix[cur_id][cand_id])
                except Exception:
                    dist = None

            if dist is None:
                # fallback to straight-line
                dist = haversine_distance(current_node['lat'], current_node['lon'],
                                          candidate['lat'], candidate['lon'])

            if dist < min_dist:
                min_dist = dist
                nearest_client = candidate
                nearest_index = i

        if nearest_index == -1 or nearest_client is None:
            print("[optimize_route_greedy] Could not find next node, breaking.")
            break

        # Update totals & path
        total_distance += min_dist
        current_node = dict(nearest_client)
        current_node['id'] = str(current_node['id'])

        path.append({
            "step": step_counter,
            "id": current_node['id'],
            "name": current_node.get('name', ''),
            "lat": current_node['lat'],
            "lon": current_node['lon'],
            "distance_from_last": round(min_dist, 2),
            "type": "client"
        })

        # remove visited
        unvisited.pop(nearest_index)
        step_counter += 1

    # Return to branch
    return_dist = None
    cur_id = str(current_node['id'])
    branch_id = str(start_node['id'])

    if distance_matrix and cur_id in distance_matrix and branch_id in distance_matrix[cur_id]:
        try:
            return_dist = float(distance_matrix[cur_id][branch_id])
        except Exception:
            return_dist = None

    if return_dist is None:
        return_dist = haversine_distance(current_node['lat'], current_node['lon'],
                                         start_node['lat'], start_node['lon'])

    total_distance += return_dist

    path.append({
        "step": step_counter,
        "id": "BRANCH_RETURN",
        "name": "Return to Branch",
        "lat": start_node['lat'],
        "lon": start_node['lon'],
        "distance_from_last": round(return_dist, 2),
        "type": "branch"
    })

    # Optionally obtain a directions polyline for the ordered route (real road path)
    polyline_coords = None
    if include_polyline and data_source == "Google Maps API":
        try:
            ordered_coords = [(p['lat'], p['lon']) for p in path if p.get('lat') is not None and p.get('lon') is not None]
            polyline_coords = get_directions_polyline_coords(ordered_coords, api_key)
        except Exception as e:
            print(f"[optimize_route_greedy] Directions polyline failed: {e}")
            polyline_coords = None

    print(f"Optimization complete. Total Dist: {total_distance} km. Source: {data_source}")

    return {
        "optimized_route": path,
        "total_distance_km": round(total_distance, 2),
        "client_count": len(clients),
        "estimated_fuel_cost": round(total_distance * 5.5),
        "data_source": data_source,
        "polyline": polyline_coords  # may be None if not available
    }


# --------------------------
# 6) Example quick-run (if executed directly) - helpful for local dev
# --------------------------
if __name__ == "__main__":
    # Quick local sanity test (no API key)
    center_lat, center_lon = 23.1815, 85.3055
    clients = []
    mock_coords = generate_mock_coordinates(center_lat, center_lon, 6, radius_km=5)
    for i, c in enumerate(mock_coords):
        clients.append({"id": f"C{i+1}", "name": f"Client {i+1}", "lat": c['lat'], "lon": c['lon']})

    branch = {"id": "BRANCH", "name": "Branch Demo", "lat": center_lat, "lon": center_lon}
    print("Running local optimizer (no API key)...")
    res = optimize_route_greedy(branch, clients, api_key=None)
    print(res)

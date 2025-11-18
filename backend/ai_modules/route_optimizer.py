import math
import random
import requests

# --- 1. GEOMETRY UTILS (Fallback) ---

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculates the great-circle distance between two points 
    on the Earth using the Haversine formula.
    Returns distance in Kilometers.
    """
    # Ensure inputs are floats
    lat1, lon1, lat2, lon2 = map(float, [lat1, lon1, lat2, lon2])
    
    R = 6371  # Earth radius in km
    
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    
    a = (math.sin(d_lat / 2) * math.sin(d_lat / 2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(d_lon / 2) * math.sin(d_lon / 2))
    
    # Protect against float errors making 'a' > 1
    a = min(1.0, a)
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

# --- 2. GOOGLE MAPS INTEGRATION ---

def get_google_distance_matrix(locations, api_key):
    """
    Calls Google Maps Distance Matrix API to get real driving distances.
    """
    print("Fetching real driving distances from Google Maps...")
    
    # Google Maps API expects string format "lat,lon"
    coords = [f"{loc['lat']},{loc['lon']}" for loc in locations]
    
    # Join with pipes for the API
    origins = "|".join(coords)
    destinations = "|".join(coords)
    
    url = "https://maps.googleapis.com/maps/api/distancematrix/json"
    params = {
        "origins": origins,
        "destinations": destinations,
        "key": api_key,
        "mode": "driving"
    }
    
    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        if data.get("status") != "OK":
            print(f"Google Maps API Error: {data.get('status')}")
            return None
            
        # Parse the response into a friendly matrix format
        # matrix[from_id][to_id] = distance_in_km
        matrix = {}
        
        for i, row in enumerate(data["rows"]):
            from_id = locations[i]["id"]
            matrix[from_id] = {}
            
            for j, element in enumerate(row["elements"]):
                to_id = locations[j]["id"]
                
                if element.get("status") == "OK":
                    # Value is in meters, convert to km
                    dist_km = element["distance"]["value"] / 1000.0
                    matrix[from_id][to_id] = dist_km
                else:
                    # Fallback if no route found (e.g. random point in water)
                    # Use Haversine as backup for this specific link
                    print(f"No route found between {from_id} and {to_id}, using fallback.")
                    dist_fallback = haversine_distance(
                        locations[i]['lat'], locations[i]['lon'],
                        locations[j]['lat'], locations[j]['lon']
                    )
                    matrix[from_id][to_id] = dist_fallback * 1.5 # Penalty for bad route
                    
        return matrix
        
    except Exception as e:
        print(f"Failed to connect to Google Maps: {e}")
        return None

# --- 3. DATA SIMULATION ---

def generate_mock_coordinates(center_lat, center_lon, num_points, radius_km=10):
    print(f"Generating {num_points} mock coordinates...")
    points = []
    for _ in range(num_points):
        # Random offset logic ensuring points are scattered
        r = radius_km * math.sqrt(random.random())
        theta = random.random() * 2 * math.pi
        
        dy = r * math.sin(theta)
        dx = r * math.cos(theta)
        
        new_lat = center_lat + (dy / 110.574)
        new_lon = center_lon + (dx / (111.320 * math.cos(math.radians(center_lat))))
        
        points.append({"lat": new_lat, "lon": new_lon})
    return points

# --- 4. STATE SPACE SEARCH (Greedy with Matrix Support) ---

def optimize_route_greedy(start_node, clients, api_key=None):
    """
    Implements a Greedy Best-First Search (Nearest Neighbor).
    Capable of using real Google Maps data if api_key is provided.
    """
    print("Starting Route Optimization...")
    
    # Prepare list of all nodes for the matrix request
    all_nodes = [start_node] + clients
    
    # Try to get real distances
    distance_matrix = None
    if api_key:
        distance_matrix = get_google_distance_matrix(all_nodes, api_key)
    
    # If API failed or no key, distance_matrix remains None (will use Haversine)
    
    # Create a copy to avoid modifying the original list
    unvisited = clients.copy()
    
    current_node = start_node
    path = [] 
    total_distance = 0
    
    # Add start node
    path.append({
        "step": 1,
        "id": "BRANCH",
        "name": "Branch Office",
        "lat": start_node["lat"],
        "lon": start_node["lon"],
        "type": "branch",
        "distance_from_last": 0
    })
    
    step_counter = 2

    while len(unvisited) > 0:
        nearest_client = None
        min_dist = float('inf')
        nearest_index = -1
        
        # Iterate through unvisited clients to find the closest one
        for i, client in enumerate(unvisited):
            dist = 0
            
            # OPTION A: Use Google Maps Matrix
            if distance_matrix:
                dist = distance_matrix[current_node['id']][client['id']]
            
            # OPTION B: Use Haversine (Fallback)
            else:
                dist = haversine_distance(
                    current_node["lat"], current_node["lon"], 
                    client["lat"], client["lon"]
                )
            
            if dist < min_dist:
                min_dist = dist
                nearest_client = client
                nearest_index = i
        
        if nearest_index == -1:
            print("Error: Could not find nearest neighbor. Breaking loop.")
            break
            
        # Update stats
        total_distance += min_dist
        current_node = nearest_client
        
        # Add to path
        path.append({
            "step": step_counter,
            "id": nearest_client["id"],
            "name": nearest_client["name"],
            "lat": nearest_client["lat"],
            "lon": nearest_client["lon"],
            "distance_from_last": round(min_dist, 2),
            "type": "client"
        })
        
        unvisited.pop(nearest_index)
        step_counter += 1

    # Return to branch
    return_dist = 0
    if distance_matrix:
        return_dist = distance_matrix[current_node['id']][start_node['id']]
    else:
        return_dist = haversine_distance(
            current_node["lat"], current_node["lon"], 
            start_node["lat"], start_node["lon"]
        )
        
    total_distance += return_dist
    
    path.append({
        "step": step_counter,
        "id": "BRANCH_RETURN",
        "name": "Return to Branch",
        "lat": start_node["lat"],
        "lon": start_node["lon"],
        "distance_from_last": round(return_dist, 2),
        "type": "branch"
    })

    print(f"Optimization complete. Total Dist: {total_distance} km")
    return {
        "optimized_route": path,
        "total_distance_km": round(total_distance, 2),
        "client_count": len(clients),
        "estimated_fuel_cost": round(total_distance * 5.5)
    }
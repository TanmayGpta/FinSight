import React, { useState, useEffect } from "react";
import {
  MapPin,
  Loader,
  Navigation,
  Building2,
  Users,
  Zap,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import Sidebar from "../components/ui/SideBar";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet marker icons in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// Helper to re-center map when route changes
const MapRecenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

const branchOptions = [
  { id: "087:Deogarh", name: "087:Deogarh" },
  { id: "254:Mungra Badshahpur", name: "254:Mungra Badshahpur" },
  { id: "167:Gwalior", name: "167:Gwalior" },
];

export default function TSP() {
  const [selectedBranch, setSelectedBranch] = useState("087:Deogarh");
  const [visitCount, setVisitCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [routeData, setRouteData] = useState(null); // Start null to show empty state
  const [error, setError] = useState(null);

  const handleOptimizeRoute = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Call the State-Space Search API
      const response = await fetch(
        `http://127.0.0.1:8080/api/planning/route?branch=${encodeURIComponent(selectedBranch)}&num_clients=${visitCount}`
      );

      if (!response.ok) {
        throw new Error("Failed to calculate optimal route");
      }

      const data = await response.json();
      setRouteData(data);
      
    } catch (err) {
      console.error("Route optimization failed:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate map center (default or based on first stop)
  const mapCenter = routeData?.optimized_route?.length > 0 
    ? [routeData.optimized_route[0].lat, routeData.optimized_route[0].lon]
    : [23.1815, 85.3055]; // Default center

  // Extract just the [lat, lon] pairs for the Polyline
  const polylinePositions = routeData?.optimized_route?.map(stop => [stop.lat, stop.lon]) || [];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header Section */}
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Field Operations Planner
              </h1>
              <p className="text-sm text-slate-600">
                AI-Optimized Route Planning
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1">
              <Zap className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">
                State-Space Search Algorithm
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel */}
          <div className="flex w-1/2 flex-col border-r border-slate-200 bg-white overflow-y-auto">
            {/* Control Panel */}
            <div className="border-b border-slate-200 p-6">
              <h2 className="mb-4 text-sm font-semibold text-slate-800">
                Route Configuration
              </h2>

              <div className="space-y-4">
                {/* Branch Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Branch
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  >
                    {branchOptions.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Daily Visit Target */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Daily Visit Target
                  </label>
                  <input
                    type="number"
                    value={visitCount}
                    onChange={(e) => setVisitCount(parseInt(e.target.value) || 0)}
                    min="1"
                    max="50"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                {/* Optimize Button */}
                <button
                  onClick={handleOptimizeRoute}
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-white font-medium hover:bg-emerald-700 disabled:bg-slate-300 transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>Optimizing Route...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5" />
                      <span>Optimize Route</span>
                    </>
                  )}
                </button>
                
                {error && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Statistics Summary */}
            {routeData && (
              <div className="border-b border-slate-200 p-6 bg-slate-50">
                <h2 className="mb-4 text-sm font-semibold text-slate-800">
                  Route Summary
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {/* Total Distance */}
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                    <p className="text-xs text-slate-500">Total Distance</p>
                    <p className="mt-1 text-lg font-bold text-emerald-600">
                      {routeData.total_distance_km} km
                    </p>
                  </div>

                  {/* Stops */}
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                    <p className="text-xs text-slate-500">Stops</p>
                    <p className="mt-1 text-lg font-bold text-emerald-600">
                      {routeData.client_count}
                    </p>
                  </div>

                  {/* Est. Fuel Cost (Approx calculation) */}
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                    <p className="text-xs text-slate-500">Est. Fuel Cost</p>
                    <p className="mt-1 text-lg font-bold text-emerald-600">
                      ₹{Math.round(routeData.total_distance_km * 5.5)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Itinerary List */}
            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="mb-4 text-sm font-semibold text-slate-800">
                Optimized Itinerary
              </h2>
              
              {!routeData ? (
                 <div className="text-center text-slate-400 py-10">
                   <Navigation className="h-12 w-12 mx-auto mb-2 opacity-20" />
                   <p>Select a branch and optimize to view route</p>
                 </div>
              ) : (
                <div className="space-y-2">
                  {routeData.optimized_route.map((stop, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 hover:bg-slate-50 transition-colors"
                    >
                      {/* Step Number and Icon */}
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white",
                            stop.type === "branch"
                              ? "bg-slate-800"
                              : "bg-emerald-600",
                          )}
                        >
                          {index + 1}
                        </div>
                        {index < routeData.optimized_route.length - 1 && (
                          <div className="h-full w-0.5 bg-slate-200 my-1" />
                        )}
                      </div>

                      {/* Stop Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {stop.type === "branch" ? (
                            <Building2 className="h-4 w-4 flex-shrink-0 text-slate-600" />
                          ) : (
                            <Users className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                          )}
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {stop.name}
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {stop.distance_from_last === 0
                            ? "Starting point"
                            : `${stop.distance_from_last} km from previous`}
                        </p>
                      </div>

                      {/* Distance Badge */}
                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-300" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Map Container */}
          <div className="w-1/2 bg-slate-100 relative">
            {/* Render Leaflet Map */}
            <MapContainer 
              center={mapCenter} 
              zoom={13} 
              scrollWheelZoom={true} 
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapRecenter center={mapCenter} />

              {/* Render Route Lines */}
              {routeData && (
                <Polyline 
                  positions={polylinePositions} 
                  color="#059669" // emerald-600
                  weight={4}
                  opacity={0.7}
                  dashArray="10, 10" 
                />
              )}

              {/* Render Markers */}
              {routeData && routeData.optimized_route.map((stop, idx) => (
                <Marker 
                  key={idx} 
                  position={[stop.lat, stop.lon]}
                >
                  <Popup>
                    <div className="text-sm font-bold">{stop.name}</div>
                    <div className="text-xs text-slate-500">Stop #{idx + 1}</div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            
            {/* Floating badge on map */}
            {!routeData && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50 z-[1000] pointer-events-none">
                     <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-slate-200 flex items-center gap-2 text-slate-500 text-sm">
                        <MapPin className="h-4 w-4" />
                        Visualize client locations here
                     </div>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
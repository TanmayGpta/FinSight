// src/pages/TSP.jsx  (or wherever your file lives — replace the file contents)
import React, { useState } from "react";
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
import GoogleMapView from "../components/ui/GoogleMapView";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const branchOptions = [
  { id: "087:Deogarh", name: "087:Deogarh" },
  { id: "254:Mungra Badshahpur", name: "254:Mungra Badshahpur" },
  { id: "167:Gwalior", name: "167:Gwalior" },
];

export default function TSP() {
  const [selectedBranch, setSelectedBranch] = useState("087:Deogarh");
  const [visitCount, setVisitCount] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [error, setError] = useState(null);

  const handleOptimizeRoute = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // backend expects branch suffix maybe; send only part after colon if present
      const branchParam = selectedBranch.includes(":") ? selectedBranch.split(":")[1] : selectedBranch;
      const response = await fetch(
        `http://127.0.0.1:8080/api/planning/route?branch=${encodeURIComponent(branchParam)}&num_clients=${visitCount}`
      );

      if (!response.ok) {
        throw new Error("Failed to calculate optimal route");
      }

      const data = await response.json();
      setRouteData(data);
    } catch (err) {
      console.error("Route optimization failed:", err);
      setError(err.message || String(err));
      setRouteData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // compute default center (first stop or branch fallback)
  const mapCenter = routeData?.polyline?.length > 0
    ? [routeData.polyline[0][0], routeData.polyline[0][1]]
    : routeData?.optimized_route?.length > 0
      ? [routeData.optimized_route[0].lat, routeData.optimized_route[0].lon]
      : [23.1815, 85.3055];
  console.log("Loaded Map ID →", import.meta.env.VITE_GOOGLE_MAP_ID, " | Key →", !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Field Operations Planner</h1>
              <p className="text-sm text-slate-600">AI-Optimized Route Planning</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1">
              <Zap className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">State-Space Search Algorithm</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel */}
          <div className="flex w-1/2 flex-col border-r border-slate-200 bg-white overflow-y-auto">
            <div className="border-b border-slate-200 p-6">
              <h2 className="mb-4 text-sm font-semibold text-slate-800">Route Configuration</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Select Branch</label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  >
                    {branchOptions.map((branch) => (
                      <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Daily Visit Target</label>
                  <input
                    type="number"
                    value={visitCount}
                    onChange={(e) => setVisitCount(parseInt(e.target.value) || 0)}
                    min="1"
                    max="50"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

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

            {routeData && (
              <div className="border-b border-slate-200 p-6 bg-slate-50">
                <h2 className="mb-4 text-sm font-semibold text-slate-800">Route Summary</h2>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                    <p className="text-xs text-slate-500">Total Distance</p>
                    <p className="mt-1 text-lg font-bold text-emerald-600">{routeData.total_distance_km} km</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                    <p className="text-xs text-slate-500">Stops</p>
                    <p className="mt-1 text-lg font-bold text-emerald-600">{routeData.client_count}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                    <p className="text-xs text-slate-500">Est. Fuel Cost</p>
                    <p className="mt-1 text-lg font-bold text-emerald-600">₹{Math.round(routeData.total_distance_km * 5.5)}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="mb-4 text-sm font-semibold text-slate-800">Optimized Itinerary</h2>

              {!routeData ? (
                <div className="text-center text-slate-400 py-10">
                  <Navigation className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Select a branch and optimize to view route</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {routeData.optimized_route.map((stop, index) => (
                    <div key={index} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 hover:bg-slate-50 transition-colors">
                      <div className="flex flex-col items-center gap-1">
                        <div className={cn("flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white",
                          stop.type === "branch" ? "bg-slate-800" : "bg-emerald-600")}>
                          {index + 1}
                        </div>
                        {index < routeData.optimized_route.length - 1 && <div className="h-full w-0.5 bg-slate-200 my-1" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {stop.type === "branch" ? (
                            <Building2 className="h-4 w-4 flex-shrink-0 text-slate-600" />
                          ) : (
                            <Users className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                          )}
                          <p className="text-sm font-medium text-slate-800 truncate">{stop.name}</p>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {stop.distance_from_last === 0 ? "Starting point" : `${stop.distance_from_last} km from previous`}
                        </p>
                      </div>

                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-300" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Map: Google Map */}
          <div className="w-1/2 bg-slate-100 relative">
            <div className="h-full rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-stretch">
              <div className="flex-1">
                <GoogleMapView routeData={routeData} defaultCenter={mapCenter} />
              </div>
            </div>

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

import React, { useState, useMemo, useEffect } from "react";
import { Map, Building2, DollarSign, Target, Zap, Filter, Download } from "lucide-react";
import Sidebar from "../components/ui/SideBar";
// Sample branch data
const branchData = [
  { id: 1, name: "Mumbai Central", state: "Maharashtra", city: "Mumbai", portfolio: 15200000, loans: 842, collections: 96.8, performance: 96.8 },
  { id: 2, name: "Delhi NCR", state: "Delhi", city: "New Delhi", portfolio: 12800000, loans: 720, collections: 94.2, performance: 94.2 },
  { id: 3, name: "Bangalore Tech", state: "Karnataka", city: "Bangalore", portfolio: 11500000, loans: 650, collections: 95.6, performance: 95.6 },
  { id: 4, name: "Chennai Main", state: "Tamil Nadu", city: "Chennai", portfolio: 10200000, loans: 580, collections: 93.8, performance: 93.8 },
  { id: 5, name: "Hyderabad Central", state: "Telangana", city: "Hyderabad", portfolio: 9800000, loans: 520, collections: 92.5, performance: 92.5 },
  { id: 6, name: "Pune West", state: "Maharashtra", city: "Pune", portfolio: 8900000, loans: 485, collections: 91.2, performance: 91.2 },
  { id: 7, name: "Kolkata East", state: "West Bengal", city: "Kolkata", portfolio: 8500000, loans: 465, collections: 89.8, performance: 89.8 },
  { id: 8, name: "Ahmedabad North", state: "Gujarat", city: "Ahmedabad", portfolio: 7800000, loans: 420, collections: 88.5, performance: 88.5 },
  { id: 9, name: "Jaipur Central", state: "Rajasthan", city: "Jaipur", portfolio: 6500000, loans: 350, collections: 87.2, performance: 87.2 },
  { id: 10, name: "Lucknow Main", state: "Uttar Pradesh", city: "Lucknow", portfolio: 6200000, loans: 340, collections: 86.8, performance: 86.8 },
  { id: 11, name: "Kochi Marine", state: "Kerala", city: "Kochi", portfolio: 5800000, loans: 320, collections: 85.5, performance: 85.5 },
  { id: 12, name: "Indore Trade", state: "Madhya Pradesh", city: "Indore", portfolio: 5500000, loans: 300, collections: 84.2, performance: 84.2 },
  { id: 13, name: "Nagpur Orange", state: "Maharashtra", city: "Nagpur", portfolio: 5200000, loans: 285, collections: 83.8, performance: 83.8 },
  { id: 14, name: "Bhopal Lake", state: "Madhya Pradesh", city: "Bhopal", portfolio: 4900000, loans: 270, collections: 82.5, performance: 82.5 },
  { id: 15, name: "Visakhapatnam Port", state: "Andhra Pradesh", city: "Visakhapatnam", portfolio: 4600000, loans: 255, collections: 81.2, performance: 81.2 },
  { id: 16, name: "Surat Diamond", state: "Gujarat", city: "Surat", portfolio: 4300000, loans: 240, collections: 80.8, performance: 80.8 },
  { id: 17, name: "Kanpur Industrial", state: "Uttar Pradesh", city: "Kanpur", portfolio: 4000000, loans: 220, collections: 79.5, performance: 79.5 },
  { id: 18, name: "Coimbatore Textile", state: "Tamil Nadu", city: "Coimbatore", portfolio: 3800000, loans: 210, collections: 78.2, performance: 78.2 },
  { id: 19, name: "Vadodara Refinery", state: "Gujarat", city: "Vadodara", portfolio: 3500000, loans: 195, collections: 77.8, performance: 77.8 },
  { id: 20, name: "Agra Heritage", state: "Uttar Pradesh", city: "Agra", portfolio: 3200000, loans: 180, collections: 76.5, performance: 76.5 },
  { id: 21, name: "Patna Central", state: "Bihar", city: "Patna", portfolio: 2800000, loans: 160, collections: 75.2, performance: 75.2 },
  { id: 22, name: "Bhubaneswar Tech", state: "Odisha", city: "Bhubaneswar", portfolio: 2600000, loans: 145, collections: 74.8, performance: 74.8 },
  { id: 23, name: "Guwahati Gateway", state: "Assam", city: "Guwahati", portfolio: 2400000, loans: 135, collections: 73.5, performance: 73.5 },
  { id: 24, name: "Chandigarh Modern", state: "Punjab", city: "Chandigarh", portfolio: 2200000, loans: 125, collections: 72.1, performance: 72.1 },
  { id: 25, name: "Thiruvananthapuram Capital", state: "Kerala", city: "Thiruvananthapuram", portfolio: 2000000, loans: 115, collections: 71.8, performance: 71.8 },
  { id: 26, name: "Ranchi Industrial", state: "Jharkhand", city: "Ranchi", portfolio: 1800000, loans: 105, collections: 70.5, performance: 70.5 },
  { id: 27, name: "Raipur Commerce", state: "Chhattisgarh", city: "Raipur", portfolio: 1600000, loans: 95, collections: 69.2, performance: 69.2 },
  { id: 28, name: "Gurgaon Tech", state: "Haryana", city: "Gurgaon", portfolio: 1400000, loans: 85, collections: 68.8, performance: 68.8 },
  { id: 29, name: "Dehradun Hills", state: "Uttarakhand", city: "Dehradun", portfolio: 1200000, loans: 75, collections: 67.5, performance: 67.5 },
  { id: 30, name: "Shimla Valley", state: "Himachal Pradesh", city: "Shimla", portfolio: 1000000, loans: 65, collections: 66.1, performance: 66.1 }
];

// Simple React Maps components (simplified implementation)
const ComposableMap = ({ children, ...props }) => (
  <svg width="100%" height="600" viewBox="0 0 800 600" {...props}>
    {children}
  </svg>
);

const Geographies = ({ geography, children }) => {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    // Use a proper India GeoJSON source
    fetch("https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson")
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(() => {
        // Fallback minimal India shape
        setGeoData({
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            properties: { NAME: "India" },
            geometry: {
              type: "Polygon",
              coordinates: [[
                [68.1, 8.0], [97.4, 8.0], 
                [97.4, 35.5], [68.1, 35.5], 
                [68.1, 8.0]
              ]]
            }
          }]
        });
      });
  }, []);

  if (!geoData) return <text x="400" y="300">Loading map...</text>;

  return (
    <>
      {geoData.features.map((geo, i) => children(geo, i))}
    </>
  );
};

const GEOJSON_URL = "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson";

// Optimized Geography Component
const Geography = React.memo(({ geography, fill, stroke, strokeWidth, onMouseEnter, onMouseLeave }) => {
  const generatePath = (geometry) => {
    if (!geometry?.coordinates) return "";
    
    const scaleX = 800 / (97 - 68);
    const scaleY = 600 / (35 - 8);
    const offsetX = -68 * scaleX;
    const offsetY = 35 * scaleY;

    const project = (lon, lat) => [
      lon * scaleX + offsetX,
      offsetY - lat * scaleY
    ];

    if (geometry.type === "Polygon") {
      return geometry.coordinates[0].map(([lon, lat], i) => {
        const [x, y] = project(lon, lat);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(' ') + ' Z';
    }

    if (geometry.type === "MultiPolygon") {
      return geometry.coordinates.map(polygon => 
        polygon[0].map(([lon, lat], i) => {
          const [x, y] = project(lon, lat);
          return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ') + ' Z'
      ).join(' ');
    }

    return "";
  };

  const path = generatePath(geography.geometry);

  return path ? (
    <path
      d={path}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="cursor-pointer transition-all duration-100"
    />
  ) : null;
});

// India Map Component using real geography data
const IndiaMap = ({ branches }) => {
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState(null);
  // Create a normalized state name mapping
  const normalizeStateName = (name) => {
    if (!name) return "";
    return name.toLowerCase().replace(/\s+/g, ' ');
  };

  // Memoized state data with normalized names
  const stateData = useMemo(() => {
    const data = {};
    branches.forEach(branch => {
      const stateName = normalizeStateName(branch.state);
      if (!data[stateName]) {
        data[stateName] = {
          portfolio: 0,
          branches: 0,
          totalPerformance: 0,
          branchList: []
        };
      }
      data[stateName].portfolio += branch.portfolio;
      data[stateName].branches += 1;
      data[stateName].totalPerformance += branch.performance;
      data[stateName].branchList.push(branch);
    });

    Object.keys(data).forEach(state => {
      data[state].avgPerformance = data[state].totalPerformance / data[state].branches;
    });

    return data;
  }, [branches]);

  // Load GeoJSON data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(GEOJSON_URL);
        const data = await response.json();
        setGeoData(data);
      } catch (error) {
        console.error("Error loading map data:", error);
        setGeoData({
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            properties: { NAME: "India" },
            geometry: {
              type: "Polygon",
              coordinates: [[
                [68.1, 8.0], [97.4, 8.0],
                [97.4, 35.5], [68.1, 35.5],
                [68.1, 8.0]
              ]]
            }
          }]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStateColor = (geo) => {
    // Normalize both GeoJSON state name and branch state names
    const geoStateName = normalizeStateName(geo.properties.NAME || geo.properties.ST_NM);
    
    // Find matching state data (case insensitive)
    const matchedState = Object.keys(stateData).find(state => 
      normalizeStateName(state) === geoStateName
    );
    
    if (!matchedState) return "#f1f5f9"; // Default color if no match
    
    const performance = stateData[matchedState].avgPerformance;
    if (performance >= 90) return "#059669";
    if (performance >= 85) return "#10b981";
    if (performance >= 80) return "#34d399";
    if (performance >= 75) return "#fbbf24";
    if (performance >= 70) return "#f59e0b";
    return "#ef4444";
  };

  if (loading) {
    return <div className="text-center py-10">Loading map data...</div>;
  }

  return (
    <div className="relative bg-blue-50 rounded-lg">
      <ComposableMap className="w-full">
        <rect width="100%" height="100%" fill="#f0f9ff" />
        {geoData.features.map((geo, i) => (
          <Geography
            key={`geo-${i}`}
            geography={geo}
            fill={getStateColor(geo)}
            stroke="#1e293b"
            strokeWidth={1}
          />
        ))}
      </ComposableMap>
        
      {/* Enhanced Legend */}
      <div className="mt-6 bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
        <h4 className="font-semibold text-slate-800 mb-3">Performance Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-800 rounded shadow-sm"></div>
            <span className="text-sm">90%+ Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded shadow-sm"></div>
            <span className="text-sm">85-89% Very Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-300 rounded shadow-sm"></div>
            <span className="text-sm">80-84% Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-300 rounded shadow-sm"></div>
            <span className="text-sm">75-79% Fair</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded shadow-sm"></div>
            <span className="text-sm">70-74% Poor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded shadow-sm"></div>
            <span className="text-sm">Below 70%</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-200 rounded shadow-sm"></div>
            <span className="text-sm text-slate-600">No branches present</span>
          </div>
        </div>
      </div>

      {/* Enhanced Tooltip */}
      {tooltip && (
        <div
          className="fixed bg-white border border-gray-300 rounded-lg shadow-xl p-4 z-50 pointer-events-none max-w-sm"
          style={{
            left: tooltip.x + 15,
            top: tooltip.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="font-bold text-lg text-slate-800 mb-2 border-b pb-2">{tooltip.state}</div>
          {tooltip.data ? (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-slate-600">Branches:</div>
                <div className="font-semibold text-right">{tooltip.data.branches}</div>
                <div className="text-slate-600">Total Portfolio:</div>
                <div className="font-semibold text-right">₹{(tooltip.data.portfolio / 1000000).toFixed(1)}M</div>
                <div className="text-slate-600">Avg Performance:</div>
                <div className={`font-semibold text-right ${
                  tooltip.data.avgPerformance >= 85 ? 'text-green-600' : 
                  tooltip.data.avgPerformance >= 75 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {tooltip.data.avgPerformance.toFixed(1)}%
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200">
                <div className="text-slate-600 text-xs mb-2 font-medium">Branch Locations:</div>
                <div className="max-h-32 overflow-y-auto">
                  {tooltip.data.branchList.map((branch, idx) => (
                    <div key={idx} className="flex justify-between text-xs py-1 hover:bg-slate-50 px-1 rounded">
                      <span className="truncate">{branch.name}</span>
                      <span className={`ml-2 font-medium ${
                        branch.performance >= 85 ? 'text-green-600' : 
                        branch.performance >= 75 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {branch.performance.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-600">No branches in this state</div>
          )}
        </div>
      )}

      {/* Alternative Simple Map Notice */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> This is a simplified map implementation. For production use, consider installing <code className="bg-blue-100 px-1 rounded">react-simple-maps</code> or <code className="bg-blue-100 px-1 rounded">@react-map/india</code> packages for accurate geographical boundaries.
        </p>
      </div>
    </div>
  );
};


// Main Component
const RegionalMapPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const totalBranches = branchData.length;
  const avgPerformance = branchData.reduce((sum, branch) => sum + branch.performance, 0) / totalBranches;
  const topPerformer = branchData.reduce((best, branch) =>
    branch.performance > best.performance ? branch : best
  );
  const totalPortfolio = branchData.reduce((sum, branch) => sum + branch.portfolio, 0);
  
  const stateStats = useMemo(() => {
    const stats = {};
    branchData.forEach(branch => {
      if (!stats[branch.state]) {
        stats[branch.state] = { branches: 0, portfolio: 0, performance: 0 };
      }
      stats[branch.state].branches += 1;
      stats[branch.state].portfolio += branch.portfolio;
      stats[branch.state].performance += branch.performance;
    });
    
    Object.keys(stats).forEach(state => {
      stats[state].avgPerformance = stats[state].performance / stats[state].branches;
    });
    
    return stats;
  }, []);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        currentPage="branches"
      />
      
      <main className="flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white px-6 py-4 rounded-xl shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Regional Network Map
              </h1>
              <p className="text-slate-600 mt-1">
                Interactive visualization of branch performance across India
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                <Filter className="h-4 w-4" />
                Filters
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Key Metrics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">Total Branches</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-800">{totalBranches}</span>
                  <span className="text-sm text-slate-500">across {Object.keys(stateStats).length} states</span>
                </div>
              </div>
              <div className="rounded-lg bg-emerald-100 p-3">
                <Building2 className="h-6 w-6 text-emerald-700" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-blue-50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">Network Performance</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-800">{avgPerformance.toFixed(1)}%</span>
                  <span className="text-sm text-slate-500">avg collection</span>
                </div>
              </div>
              <div className="rounded-lg bg-blue-100 p-3">
                <Target className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-yellow-50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">Top Branch</h3>
                <div className="mt-2">
                  <span className="text-lg font-bold text-slate-800">{topPerformer.name}</span>
                  <div className="text-sm text-emerald-600 font-medium">{topPerformer.performance.toFixed(1)}% performance</div>
                </div>
              </div>
              <div className="rounded-lg bg-yellow-100 p-3">
                <Zap className="h-6 w-6 text-yellow-700" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-purple-50 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-slate-600">Total Portfolio</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-800">
                    ₹{(totalPortfolio / 1000000).toFixed(0)}M
                  </span>
                  <span className="text-sm text-slate-500">managed</span>
                </div>
              </div>
              <div className="rounded-lg bg-purple-100 p-3">
                <DollarSign className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Regional Map */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">
                India Regional Performance Map
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Interactive map showing branch distribution and performance by state. Hover over states for detailed information.
              </p>
            </div>
            <div className="rounded-lg bg-blue-50 p-2">
              <Map className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <IndiaMap branches={branchData} />
        </div>
      </main>
    </div>
  );
};

export default RegionalMapPage;
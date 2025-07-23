import React, { useState } from "react";
import Sidebar from "../components/ui/SideBar";
import {
  BarChart3,
  Building2,
  CreditCard,
  DollarSign,
  FileText,
  Home,
  PieChart,
  Settings,
  TrendingUp,
  Users,
  Brain,
  Map,
  BarChart,
  Plus,
  X,
  MapPin,
  Target,
  TrendingDown,
  Filter,
  Download,
  Layers,
  Zap,
} from "lucide-react";
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
  Legend,
  CartesianGrid,
  Cell,
  Pie,
  PieChart as RechartsPieChart,
} from "recharts";

// Utility function for className merging
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// Sample branch data for 200 branches across India
const branchData = [
  // Major Cities
  { id: 1, name: "Mumbai Central", state: "Maharashtra", city: "Mumbai", portfolio: 15200000, loans: 842, collections: 96.8, lat: 19.0760, lng: 72.8777, performance: 96.8 },
  { id: 2, name: "Delhi NCR", state: "Delhi", city: "New Delhi", portfolio: 12800000, loans: 720, collections: 94.2, lat: 28.6139, lng: 77.2090, performance: 94.2 },
  { id: 3, name: "Bangalore Tech", state: "Karnataka", city: "Bangalore", portfolio: 11500000, loans: 650, collections: 95.6, lat: 12.9716, lng: 77.5946, performance: 95.6 },
  { id: 4, name: "Chennai Main", state: "Tamil Nadu", city: "Chennai", portfolio: 10200000, loans: 580, collections: 93.8, lat: 13.0827, lng: 80.2707, performance: 93.8 },
  { id: 5, name: "Hyderabad Central", state: "Telangana", city: "Hyderabad", portfolio: 9800000, loans: 520, collections: 92.5, lat: 17.3850, lng: 78.4867, performance: 92.5 },
  { id: 6, name: "Pune West", state: "Maharashtra", city: "Pune", portfolio: 8900000, loans: 485, collections: 91.2, lat: 18.5204, lng: 73.8567, performance: 91.2 },
  { id: 7, name: "Kolkata East", state: "West Bengal", city: "Kolkata", portfolio: 8500000, loans: 465, collections: 89.8, lat: 22.5726, lng: 88.3639, performance: 89.8 },
  { id: 8, name: "Ahmedabad North", state: "Gujarat", city: "Ahmedabad", portfolio: 7800000, loans: 420, collections: 88.5, lat: 23.0225, lng: 72.5714, performance: 88.5 },

  // Tier 2 Cities
  { id: 9, name: "Jaipur Central", state: "Rajasthan", city: "Jaipur", portfolio: 6500000, loans: 350, collections: 87.2, lat: 26.9124, lng: 75.7873, performance: 87.2 },
  { id: 10, name: "Lucknow Main", state: "Uttar Pradesh", city: "Lucknow", portfolio: 6200000, loans: 340, collections: 86.8, lat: 26.8467, lng: 80.9462, performance: 86.8 },
  { id: 11, name: "Kochi Marine", state: "Kerala", city: "Kochi", portfolio: 5800000, loans: 320, collections: 85.5, lat: 9.9312, lng: 76.2673, performance: 85.5 },
  { id: 12, name: "Indore Trade", state: "Madhya Pradesh", city: "Indore", portfolio: 5500000, loans: 300, collections: 84.2, lat: 22.7196, lng: 75.8577, performance: 84.2 },
  { id: 13, name: "Nagpur Orange", state: "Maharashtra", city: "Nagpur", portfolio: 5200000, loans: 285, collections: 83.8, lat: 21.1458, lng: 79.0882, performance: 83.8 },
  { id: 14, name: "Bhopal Lake", state: "Madhya Pradesh", city: "Bhopal", portfolio: 4900000, loans: 270, collections: 82.5, lat: 23.2599, lng: 77.4126, performance: 82.5 },
  { id: 15, name: "Visakhapatnam Port", state: "Andhra Pradesh", city: "Visakhapatnam", portfolio: 4600000, loans: 255, collections: 81.2, lat: 17.6868, lng: 83.2185, performance: 81.2 },

  // Additional branches for variety
  { id: 16, name: "Surat Diamond", state: "Gujarat", city: "Surat", portfolio: 4300000, loans: 240, collections: 80.8, lat: 21.1702, lng: 72.8311, performance: 80.8 },
  { id: 17, name: "Kanpur Industrial", state: "Uttar Pradesh", city: "Kanpur", portfolio: 4000000, loans: 220, collections: 79.5, lat: 26.4499, lng: 80.3319, performance: 79.5 },
  { id: 18, name: "Coimbatore Textile", state: "Tamil Nadu", city: "Coimbatore", portfolio: 3800000, loans: 210, collections: 78.2, lat: 11.0168, lng: 76.9558, performance: 78.2 },
  { id: 19, name: "Vadodara Refinery", state: "Gujarat", city: "Vadodara", portfolio: 3500000, loans: 195, collections: 77.8, lat: 22.3072, lng: 73.1812, performance: 77.8 },
  { id: 20, name: "Agra Heritage", state: "Uttar Pradesh", city: "Agra", portfolio: 3200000, loans: 180, collections: 76.5, lat: 27.1767, lng: 78.0081, performance: 76.5 },
];

// Additional branches to reach 200 total (simplified for demonstration)
const generateMoreBranches = () => {
  const states = ["Bihar", "Odisha", "Jharkhand", "Chhattisgarh", "Assam", "Punjab", "Haryana", "Himachal Pradesh"];
  const cities = ["Patna", "Bhubaneswar", "Ranchi", "Raipur", "Guwahati", "Chandigarh", "Gurgaon", "Shimla"];
  const moreBranches = [];

  for (let i = 21; i <= 50; i++) {
    const stateIndex = (i - 21) % states.length;
    const performance = Math.random() * 30 + 70; // 70-100% performance
    moreBranches.push({
      id: i,
      name: `${cities[stateIndex]} Branch ${i - 20}`,
      state: states[stateIndex],
      city: cities[stateIndex],
      portfolio: Math.random() * 3000000 + 1000000,
      loans: Math.floor(Math.random() * 200 + 100),
      collections: performance,
      lat: Math.random() * 10 + 20,
      lng: Math.random() * 20 + 70,
      performance: performance
    });
  }
  return moreBranches;
};

const allBranches = [...branchData, ...generateMoreBranches()];


// View Toggle Component
const ViewToggle = ({ activeView, onViewChange }) => {
  return (
    <div className="flex rounded-lg border border-slate-200 bg-white p-1">
      <button
        onClick={() => onViewChange("comparison")}
        className={cn(
          "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
          activeView === "comparison"
            ? "bg-emerald-600 text-white"
            : "text-slate-600 hover:text-slate-800",
        )}
      >
        <BarChart className="h-4 w-4" />
        Branch Comparison
      </button>
      <button
        onClick={() => onViewChange("regional")}
        className={cn(
          "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
          activeView === "regional"
            ? "bg-emerald-600 text-white"
            : "text-slate-600 hover:text-slate-800",
        )}
      >
        <Map className="h-4 w-4" />
        Regional Map
      </button>
    </div>
  );
};

// Branch Selection Component
const BranchSelector = ({ selectedBranches, onBranchChange, availableBranches }) => {
  const [isOpen, setIsOpen] = useState(false);

  const addBranch = (branch) => {
    if (selectedBranches.length < 6 && !selectedBranches.find(b => b.id === branch.id)) {
      onBranchChange([...selectedBranches, branch]);
    }
    setIsOpen(false);
  };

  const removeBranch = (branchId) => {
    onBranchChange(selectedBranches.filter(b => b.id !== branchId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">
          Selected Branches ({selectedBranches.length}/6)
        </h3>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            disabled={selectedBranches.length >= 6}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
              selectedBranches.length >= 6
                ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
            )}
          >
            <Plus className="h-4 w-4" />
            Add Branch
          </button>

          {isOpen && (
            <div className="absolute right-0 top-12 z-10 w-64 rounded-lg border border-slate-200 bg-white shadow-lg">
              <div className="max-h-64 overflow-y-auto p-2">
                {availableBranches
                  .filter(branch => !selectedBranches.find(b => b.id === branch.id))
                  .map((branch) => (
                    <button
                      key={branch.id}
                      onClick={() => addBranch(branch)}
                      className="flex w-full items-center justify-between rounded-md p-2 text-left text-sm hover:bg-slate-50"
                    >
                      <div>
                        <div className="font-medium text-slate-800">{branch.name}</div>
                        <div className="text-xs text-slate-500">{branch.city}, {branch.state}</div>
                      </div>
                      <div className="text-xs text-emerald-600">
                        {branch.collections.toFixed(1)}%
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedBranches.map((branch) => (
          <div
            key={branch.id}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
          >
            <div className="text-sm">
              <div className="font-medium text-slate-800">{branch.name}</div>
              <div className="text-xs text-slate-500">{branch.city}</div>
            </div>
            <button
              onClick={() => removeBranch(branch.id)}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Branch Comparison Visualization
const BranchComparisonChart = ({ branches, metric }) => {
  const formatValue = (value, metricType) => {
    if (metricType === 'portfolio') return `₹${(value / 1000000).toFixed(1)}M`;
    if (metricType === 'collections' || metricType === 'performance') return `${value.toFixed(1)}%`;
    return value.toLocaleString();
  };

  const getPerformanceColor = (value, metricType) => {
    if (metricType === 'collections' || metricType === 'performance') {
      if (value >= 95) return "emerald";
      if (value >= 85) return "blue";
      if (value >= 75) return "yellow";
      return "red";
    }
    return "emerald";
  };

  const getColorClasses = (color) => {
    const colors = {
      emerald: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", gauge: "#059669" },
      blue: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200", gauge: "#3b82f6" },
      yellow: { bg: "bg-yellow-50", text: "text-yellow-700", ring: "ring-yellow-200", gauge: "#eab308" },
      red: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200", gauge: "#ef4444" },
    };
    return colors[color] || colors.emerald;
  };

  // Multi-metric radar chart data for comprehensive comparison
  const radarData = [
    { metric: "Portfolio", ...branches.reduce((acc, branch, index) => ({
      ...acc,
      [`branch${index}`]: (branch.portfolio / 15000000) * 100 // Normalize to 100
    }), {}) },
    { metric: "Loans", ...branches.reduce((acc, branch, index) => ({
      ...acc,
      [`branch${index}`]: (branch.loans / 1000) * 100 // Normalize to 100
    }), {}) },
    { metric: "Collections", ...branches.reduce((acc, branch, index) => ({
      ...acc,
      [`branch${index}`]: branch.collections
    }), {}) },
    { metric: "Performance", ...branches.reduce((acc, branch, index) => ({
      ...acc,
      [`branch${index}`]: branch.performance
    }), {}) },
  ];

  return (
    <div className="space-y-8">
      {/* Branch Comparison Cards */}
      <div className={cn(
        "grid gap-6",
        branches.length === 2 ? "grid-cols-1 lg:grid-cols-2" :
        branches.length === 3 ? "grid-cols-1 lg:grid-cols-3" :
        branches.length === 4 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" :
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}>
        {branches.map((branch, index) => {
          const value = metric === 'portfolio' ? branch.portfolio :
                       metric === 'loans' ? branch.loans :
                       metric === 'collections' ? branch.collections : branch.performance;
          const color = getPerformanceColor(value, metric);
          const colorClasses = getColorClasses(color);

          return (
            <div key={branch.id} className="space-y-4">
              {/* Branch Header */}
              <div className="text-center">
                <h4 className="text-lg font-semibold text-slate-800">{branch.name}</h4>
                <p className="text-sm text-slate-600">{branch.city}, {branch.state}</p>
              </div>

              {/* Main Metric Gauge */}
              <div className="relative flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="#e2e8f0"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke={colorClasses.gauge}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - (metric === 'collections' || metric === 'performance' ? value / 100 :
                      metric === 'portfolio' ? Math.min(value / 15000000, 1) : Math.min(value / 1000, 1)))}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-800">
                    {formatValue(value, metric)}
                  </span>
                  <span className="text-xs text-slate-500 capitalize">{metric}</span>
                </div>
              </div>

              {/* Mini Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className={cn("rounded-lg border p-3", colorClasses.bg, colorClasses.ring)}>
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-600">Portfolio</div>
                    <div className={cn("text-lg font-bold", colorClasses.text)}>
                      ₹{(branch.portfolio / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </div>
                <div className={cn("rounded-lg border p-3", colorClasses.bg, colorClasses.ring)}>
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-600">Loans</div>
                    <div className={cn("text-lg font-bold", colorClasses.text)}>
                      {branch.loans.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className={cn("rounded-lg border p-3", colorClasses.bg, colorClasses.ring)}>
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-600">Collections</div>
                    <div className={cn("text-lg font-bold", colorClasses.text)}>
                      {branch.collections.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className={cn("rounded-lg border p-3", colorClasses.bg, colorClasses.ring)}>
                  <div className="text-center">
                    <div className="text-sm font-medium text-slate-600">Performance</div>
                    <div className={cn("text-lg font-bold", colorClasses.text)}>
                      {branch.performance.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Indicator */}
              <div className="text-center">
                <span className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                  colorClasses.bg,
                  colorClasses.text
                )}>
                  {color === 'emerald' ? 'Excellent' :
                   color === 'blue' ? 'Good' :
                   color === 'yellow' ? 'Average' : 'Needs Attention'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multi-Metric Radar Comparison */}
      {branches.length >= 2 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4 text-center">
            Multi-Metric Performance Radar
          </h4>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={radarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="metric"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  domain={[0, 100]}
                />
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value.toFixed(1)}${props.payload.metric.includes('Collections') || props.payload.metric.includes('Performance') ? '%' : ''}`,
                    branches[parseInt(name.replace('branch', ''))].name
                  ]}
                />
                <Legend
                  formatter={(value) => branches[parseInt(value.replace('branch', ''))].name}
                />
                {branches.map((branch, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={`branch${index}`}
                    stroke={index === 0 ? "#059669" : index === 1 ? "#3b82f6" : index === 2 ? "#8b5cf6" :
                            index === 3 ? "#f59e0b" : index === 4 ? "#ef4444" : "#6b7280"}
                    strokeWidth={3}
                    dot={{ fill: index === 0 ? "#059669" : index === 1 ? "#3b82f6" : index === 2 ? "#8b5cf6" :
                                index === 3 ? "#f59e0b" : index === 4 ? "#ef4444" : "#6b7280", strokeWidth: 0, r: 6 }}
                    name={`branch${index}`}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Side-by-Side Metric Bars for Direct Comparison */}
      {branches.length === 2 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-6 text-center">
            Head-to-Head Comparison
          </h4>

          <div className="space-y-6">
            {['portfolio', 'loans', 'collections', 'performance'].map((metricType) => {
              const branch1Value = metricType === 'portfolio' ? branches[0].portfolio :
                                  metricType === 'loans' ? branches[0].loans :
                                  metricType === 'collections' ? branches[0].collections : branches[0].performance;
              const branch2Value = metricType === 'portfolio' ? branches[1].portfolio :
                                  metricType === 'loans' ? branches[1].loans :
                                  metricType === 'collections' ? branches[1].collections : branches[1].performance;

              const maxValue = Math.max(branch1Value, branch2Value);
              const branch1Percentage = (branch1Value / maxValue) * 100;
              const branch2Percentage = (branch2Value / maxValue) * 100;

              return (
                <div key={metricType} className="space-y-3">
                  <h5 className="text-sm font-medium text-slate-700 capitalize">{metricType}</h5>

                  <div className="space-y-2">
                    {/* Branch 1 */}
                    <div className="flex items-center gap-4">
                      <div className="w-32 text-sm text-slate-600 text-right">
                        {branches[0].name.split(' ')[0]}
                      </div>
                      <div className="flex-1 relative">
                        <div className="h-6 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${branch1Percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-24 text-sm font-medium text-slate-800">
                        {formatValue(branch1Value, metricType)}
                      </div>
                    </div>

                    {/* Branch 2 */}
                    <div className="flex items-center gap-4">
                      <div className="w-32 text-sm text-slate-600 text-right">
                        {branches[1].name.split(' ')[0]}
                      </div>
                      <div className="flex-1 relative">
                        <div className="h-6 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${branch2Percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-24 text-sm font-medium text-slate-800">
                        {formatValue(branch2Value, metricType)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// India Map Component (Simplified SVG representation)
const IndiaMap = ({ branches }) => {
  const getPerformanceColor = (performance) => {
    if (performance >= 90) return "#059669"; // Dark green
    if (performance >= 80) return "#10b981"; // Medium green
    if (performance >= 70) return "#34d399"; // Light green
    return "#fbbf24"; // Yellow for poor performance
  };

  // Simplified India map with major states
  const statePerformance = branches.reduce((acc, branch) => {
    if (!acc[branch.state]) {
      acc[branch.state] = { total: 0, count: 0 };
    }
    acc[branch.state].total += branch.performance;
    acc[branch.state].count += 1;
    return acc;
  }, {});

  const stateColors = Object.keys(statePerformance).reduce((acc, state) => {
    const avgPerformance = statePerformance[state].total / statePerformance[state].count;
    acc[state] = getPerformanceColor(avgPerformance);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Map Visualization */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-2xl">
          {/* Simplified India Map SVG */}
          <svg viewBox="0 0 800 600" className="w-full h-96 border border-slate-200 rounded-lg bg-slate-50">
            {/* Simplified state outlines - using rectangles/shapes to represent major states */}

            {/* Maharashtra */}
            <rect x="150" y="300" width="80" height="60"
                  fill={stateColors["Maharashtra"] || "#e2e8f0"}
                  stroke="#64748b" strokeWidth="1" />
            <text x="190" y="335" textAnchor="middle" className="text-xs fill-white font-medium">MH</text>

            {/* Karnataka */}
            <rect x="120" y="380" width="70" height="50"
                  fill={stateColors["Karnataka"] || "#e2e8f0"}
                  stroke="#64748b" strokeWidth="1" />
            <text x="155" y="410" textAnchor="middle" className="text-xs fill-white font-medium">KA</text>

            {/* Tamil Nadu */}
            <rect x="160" y="450" width="60" height="60"
                  fill={stateColors["Tamil Nadu"] || "#e2e8f0"}
                  stroke="#64748b" strokeWidth="1" />
            <text x="190" y="485" textAnchor="middle" className="text-xs fill-white font-medium">TN</text>

            {/* Gujarat */}
            <rect x="80" y="250" width="70" height="70"
                  fill={stateColors["Gujarat"] || "#e2e8f0"}
                  stroke="#64748b" strokeWidth="1" />
            <text x="115" y="290" textAnchor="middle" className="text-xs fill-white font-medium">GJ</text>

            {/* Rajasthan */}
            <rect x="120" y="180" width="90" height="70"
                  fill={stateColors["Rajasthan"] || "#e2e8f0"}
                  stroke="#64748b" strokeWidth="1" />
            <text x="165" y="220" textAnchor="middle" className="text-xs fill-white font-medium">RJ</text>

            {/* Uttar Pradesh */}
            <rect x="240" y="180" width="100" height="60"
                  fill={stateColors["Uttar Pradesh"] || "#e2e8f0"}
                  stroke="#64748b" strokeWidth="1" />
            <text x="290" y="215" textAnchor="middle" className="text-xs fill-white font-medium">UP</text>

            {/* West Bengal */}
            <rect x="380" y="220" width="60" height="80"
                  fill={stateColors["West Bengal"] || "#e2e8f0"}
                  stroke="#64748b" strokeWidth="1" />
            <text x="410" y="265" textAnchor="middle" className="text-xs fill-white font-medium">WB</text>

            {/* Delhi */}
            <circle cx="270" cy="160" r="15"
                    fill={stateColors["Delhi"] || "#e2e8f0"}
                    stroke="#64748b" strokeWidth="1" />
            <text x="270" y="165" textAnchor="middle" className="text-xs fill-white font-medium">DL</text>

            {/* Kerala */}
            <rect x="100" y="480" width="40" height="80"
                  fill={stateColors["Kerala"] || "#e2e8f0"}
                  stroke="#64748b" strokeWidth="1" />
            <text x="120" y="525" textAnchor="middle" className="text-xs fill-white font-medium">KL</text>

            {/* Andhra Pradesh */}
            <rect x="200" y="380" width="70" height="70"
                  fill={stateColors["Andhra Pradesh"] || "#e2e8f0"}
                  stroke="#64748b" strokeWidth="1" />
            <text x="235" y="420" textAnchor="middle" className="text-xs fill-white font-medium">AP</text>

            {/* Telangana */}
            <rect x="220" y="320" width="60" height="50"
                  fill={stateColors["Telangana"] || "#e2e8f0"}
                  stroke="#64748b" strokeWidth="1" />
            <text x="250" y="350" textAnchor="middle" className="text-xs fill-white font-medium">TS</text>

            {/* Branch markers */}
            {branches.slice(0, 20).map((branch, index) => (
              <circle
                key={branch.id}
                cx={branch.lng * 5 + 100}
                cy={600 - branch.lat * 15}
                r="3"
                fill="#dc2626"
                stroke="#ffffff"
                strokeWidth="1"
                className="cursor-pointer"
                title={`${branch.name} - ${branch.performance.toFixed(1)}%`}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Performance Legend */}
      <div className="flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-red-400"></div>
          <span className="text-sm text-slate-600">70-80%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-emerald-300"></div>
          <span className="text-sm text-slate-600">80-90%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-emerald-500"></div>
          <span className="text-sm text-slate-600">90-95%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-emerald-700"></div>
          <span className="text-sm text-slate-600">95%+</span>
        </div>
      </div>

      {/* Regional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.keys(statePerformance).slice(0, 6).map((state) => {
          const avgPerformance = statePerformance[state].total / statePerformance[state].count;
          return (
            <div key={state} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-800">{state}</h4>
                  <p className="text-sm text-slate-600">{statePerformance[state].count} branches</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-800">
                    {avgPerformance.toFixed(1)}%
                  </div>
                  <div className={cn(
                    "text-xs font-medium",
                    avgPerformance >= 90 ? "text-emerald-600" : avgPerformance >= 80 ? "text-yellow-600" : "text-red-600"
                  )}>
                    {avgPerformance >= 90 ? "Excellent" : avgPerformance >= 80 ? "Good" : "Needs Attention"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Branches Component
const Branches = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeView, setActiveView] = useState("comparison");
  const [selectedBranches, setSelectedBranches] = useState([
    allBranches[0], // Mumbai Central
    allBranches[1], // Delhi NCR
  ]);
  const [comparisonMetric, setComparisonMetric] = useState("portfolio");

  const totalBranches = allBranches.length;
  const avgPerformance = allBranches.reduce((sum, branch) => sum + branch.performance, 0) / totalBranches;
  const topPerformer = allBranches.reduce((best, branch) =>
    branch.performance > best.performance ? branch : best
  );
  const totalPortfolio = allBranches.reduce((sum, branch) => sum + branch.portfolio, 0);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        currentPage="branches"
      />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Branch Network
              </h1>
              <p className="text-slate-600">
                Performance analysis and regional insights across {totalBranches} branches
              </p>
            </div>

            <div className="flex items-center gap-4">
              <ViewToggle activeView={activeView} onViewChange={setActiveView} />

              <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                <Filter className="h-4 w-4" />
                Filters
              </button>

              <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                <Download className="h-4 w-4" />
                Export
              </button>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-600"></div>
                <div className="text-sm">
                  <div className="font-medium text-slate-800">Admin User</div>
                  <div className="text-slate-500">Branch Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-600">Total Branches</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-800">{totalBranches}</span>
                    <span className="text-sm text-slate-500">active</span>
                  </div>
                </div>
                <div className="rounded-lg bg-emerald-50 p-3">
                  <Building2 className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-600">Avg Performance</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-800">{avgPerformance.toFixed(1)}%</span>
                    <span className="text-sm text-slate-500">collection rate</span>
                  </div>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-600">Top Performer</h3>
                  <div className="mt-2">
                    <span className="text-lg font-bold text-slate-800">{topPerformer.name}</span>
                    <div className="text-sm text-emerald-600">{topPerformer.performance.toFixed(1)}%</div>
                  </div>
                </div>
                <div className="rounded-lg bg-yellow-50 p-3">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-slate-600">Total Portfolio</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-800">
                      ₹{(totalPortfolio / 1000000000).toFixed(1)}B
                    </span>
                    <span className="text-sm text-slate-500">managed</span>
                  </div>
                </div>
                <div className="rounded-lg bg-purple-50 p-3">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* View-specific Content */}
          {activeView === "comparison" ? (
            <div className="space-y-6">
              {/* Branch Selection */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <BranchSelector
                  selectedBranches={selectedBranches}
                  onBranchChange={setSelectedBranches}
                  availableBranches={allBranches}
                />
              </div>

              {/* Comparison Charts */}
              {selectedBranches.length > 0 && (
                <div className="space-y-6">
                  {/* Metric Selector */}
                  <div className="flex gap-2">
                    {["portfolio", "loans", "collections"].map((metric) => (
                      <button
                        key={metric}
                        onClick={() => setComparisonMetric(metric)}
                        className={cn(
                          "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                          comparisonMetric === metric
                            ? "bg-emerald-600 text-white"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                        )}
                      >
                        {metric.charAt(0).toUpperCase() + metric.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">
                          Branch {comparisonMetric.charAt(0).toUpperCase() + comparisonMetric.slice(1)} Comparison
                        </h3>
                        <p className="text-sm text-slate-600">
                          Comparing {comparisonMetric} across selected branches
                        </p>
                      </div>
                      <div className="rounded-lg bg-emerald-50 p-2">
                        <BarChart className="h-5 w-5 text-emerald-600" />
                      </div>
                    </div>
                    <BranchComparisonChart branches={selectedBranches} metric={comparisonMetric} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Regional Map */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      Regional Performance Map
                    </h3>
                    <p className="text-sm text-slate-600">
                      Geographic distribution of branch performance across India
                    </p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-2">
                    <Map className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <IndiaMap branches={allBranches} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Branches;

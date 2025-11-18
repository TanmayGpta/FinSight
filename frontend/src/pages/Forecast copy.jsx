import React, { useState } from "react";
import Sidebar from "../components/ui/SideBar";
import {
  BarChart3,
  Building2,
  CreditCard,
  IndianRupee,
  FileText,
  Home,
  PieChart,
  Settings,
  TrendingUp,
  Users,
  Brain,
  Calendar,
  Target,
  Zap,
  ChevronDown,
  Play,
  RotateCcw,
  Download,
  Info,
  TrendingDown,
} from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from "recharts";



// Utility function for className merging
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// Sample forecast data for different prediction types
const forecastData = {
  disbursement: {
    historical: [
      { month: "Jan 2025", actual: 33000000,predicted: null },
      { month: "Feb 2025", actual: 35000000,predicted: null },
      { month: "Mar 2025", actual: 30000000,predicted: null },
      { month: "Apr 2025", actual: 40000000,predicted: null},
      { month: "May 2025", actual: 55000000,predicted: null },
      { month: "Jun 2025", actual: 48000000,predicted: null },
    ],
    forecast: [
      { month: "Jul 2025", actual: null, predicted: 50000000,},
      { month: "Aug 2025", actual: null, predicted: 58000000,},
      { month: "Sep 2025", actual: null, predicted: 54200000,},
      { month: "Oct 2025", actual: null, predicted: 60800000,},
      { month: "Nov 2025", actual: null, predicted: 62500000,},
      { month: "Dec 2025", actual: null, predicted: 68200000,},
    ],
  },
  collections: {
    historical: [
      { month: "Jan 2025", actual: 92.2, predicted: null },
      { month: "Feb 2025", actual: 95.1, predicted: null },
      { month: "Mar 2025", actual: 93.8, predicted: null },
      { month: "Apr 2025", actual: 96.2, predicted: null },
      { month: "May 2025", actual: 97.9, predicted: null },
      { month: "Jun 2025", actual: 86.7, predicted: null },
    ],
    forecast: [
      { month: "Jul 2025", actual: null, predicted: 90.1, confidence: 0.94 },
      { month: "Aug 2025", actual: null, predicted: 93.8, confidence: 0.91 },
      { month: "Sep 2025", actual: null, predicted: 96.4, confidence: 0.88 },
      { month: "Oct 2025", actual: null, predicted: 95.9, confidence: 0.85 },
      { month: "Nov 2025", actual: null, predicted: 98.2, confidence: 0.82 },
      { month: "Dec 2025", actual: null, predicted: 98.6, confidence: 0.79 },
    ],
  },
  customers: {
    historical: [
      { month: "Jan 2025", actual: 2650, predicted: null },
      { month: "Feb 2025", actual: 2720, predicted: null },
      { month: "Mar 2025", actual: 2847, predicted: null },
      { month: "Apr 2025", actual: 2910, predicted: null },
      { month: "May 2025", actual: 3120, predicted: null },
      { month: "Jun 2025", actual: 2980, predicted: null },
    ],
    forecast: [
      { month: "Jul 2025", actual: null, predicted: 3250,},
      { month: "Aug 2025", actual: null, predicted: 3380,},
      { month: "Sep 2025", actual: null, predicted: 3510,},
      { month: "Oct 2025", actual: null, predicted: 3640,},
      { month: "Nov 2025", actual: null, predicted: 3770,},
      { month: "Dec 2025", actual: null, predicted: 3900,},
    ],
  },
  delinquency: {
    historical: [
      { month: "Jan 2025", actual: 5.2, predicted: null },
      { month: "Feb 2025", actual: 4.8, predicted: null },
      { month: "Mar 2025", actual: 6.1, predicted: null },
      { month: "Apr 2025", actual: 5.5, predicted: null },
      { month: "May 2025", actual: 4.9, predicted: null },
      { month: "Jun 2025", actual: 5.3, predicted: null },
    ],
    forecast: [
      { month: "Jul 2025", actual: null, predicted: 5.1,},
      { month: "Aug 2025", actual: null, predicted: 4.6,},
      { month: "Sep 2025", actual: null, predicted: 3.4,},
      { month: "Oct 2025", actual: null, predicted: 5.0,},
      { month: "Nov 2025", actual: null, predicted: 4.7,},
      { month: "Dec 2025", actual: null, predicted: 5.2,},
    ],
  },
};

// Forecast options
const forecastOptions = [
  {
    id: "disbursement",
    title: "Loan Disbursement",
    description: "Predict future loan disbursement amounts",
    icon: IndianRupee,
    color: "emerald",
    unit: "₹",
    format: (val) => `₹${(val / 1000000).toFixed(1)}M`,
  },
  {
    id: "collections",
    title: "Collection Rate",
    description: "Forecast EMI collection performance",
    icon: Target,
    color: "blue",
    unit: "%",
    format: (val) => `${val.toFixed(1)}%`,
  },
  {
    id: "customers",
    title: "Customer Growth",
    description: "Predict customer base expansion",
    icon: Users,
    color: "purple",
    unit: "",
    format: (val) => val.toLocaleString(),
  },
  {
    id: "delinquency",
    title: "Delinquency Rate",
    description: "Forecast payment default trends",
    icon: TrendingDown,
    color: "red",
    unit: "%",
    format: (val) => `${val.toFixed(1)}%`,
  },
];

// Forecast Configuration Panel
const ForecastConfig = ({
  selectedOption,
  onOptionChange,
  onRunForecast,
  isLoading,
}) => {
  
  

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-purple-50 p-3">
          <Brain className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            ML Forecast Configuration
          </h3>
          <p className="text-sm text-slate-600">
            Select data type and parameters for prediction
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Forecast Type Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Select Data to Forecast
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {forecastOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedOption?.id === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => onOptionChange(option)}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-4 text-left transition-colors",
                    isSelected
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg p-2",
                      option.color === "emerald" && "bg-emerald-100",
                      option.color === "blue" && "bg-blue-100",
                      option.color === "purple" && "bg-purple-100",
                      option.color === "red" && "bg-red-100",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        option.color === "emerald" && "text-emerald-600",
                        option.color === "blue" && "text-blue-600",
                        option.color === "purple" && "text-purple-600",
                        option.color === "red" && "text-red-600",
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-800">
                      {option.title}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Horizon and Confidence
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Forecast Horizon
            </label>
            <select
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
              <option value="24">24 months</option>
            </select>
          </div>

        
        </div> */}

        {/* Run Forecast Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRunForecast}
            disabled={!selectedOption || isLoading}
            className={cn(
              "flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-colors",
              !selectedOption || isLoading
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700",
            )}
          >
            {isLoading ? (
              <RotateCcw className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isLoading ? "Running Forecast..." : "Run Forecast"}
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="h-4 w-4" />
            <span>Uses advanced ML algorithms for prediction</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Forecast Results Chart
const ForecastChart = ({ data, option, isLoading }) => {
  if (!data || !option) return null;

  const combinedData = [...data.historical, ...data.forecast];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="rounded-lg border bg-white p-3 shadow-md">
          <p className="font-semibold text-slate-800 mb-2">{label}</p>
          <div className="space-y-1">
            {dataPoint.actual !== null && (
              <p className="text-sm text-slate-600">
                Actual: {option.format(dataPoint.actual)}
              </p>
            )}
            {dataPoint.predicted !== null && (
              <div>
                <p className="text-sm text-emerald-600">
                  Predicted: {option.format(dataPoint.predicted)}
                </p>
                
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            {option.title} Forecast
          </h3>
          <p className="text-sm text-slate-600">
            Historical data vs ML predictions with confidence intervals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-80 items-center justify-center">
          <div className="text-center">
            <RotateCcw className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-2" />
            <p className="text-sm text-slate-600">Generating forecast...</p>
          </div>
        </div>
      ) : (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={combinedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={option.format}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#059669"
                strokeWidth={3}
                dot={{ fill: "#059669", strokeWidth: 0, r: 4 }}
                connectNulls={false}
                name="Historical Data"
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#3b82f6"
                strokeWidth={3}
                strokeDasharray="8 4"
                dot={{ fill: "#3b82f6", strokeWidth: 0, r: 4 }}
                connectNulls={false}
                name="ML Prediction"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Forecast Summary */}
      {!isLoading && data && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.forecast.slice(0, 3).map((item, index) => (
            <div key={index} className="rounded-lg bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-600">
                {item.month}
              </div>
              <div className="text-lg font-bold text-slate-800">
                {option.format(item.predicted)}
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Forecast Component
const Forecast = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [forecastResults, setForecastResults] = useState(null);

  const handleRunForecast = async () => {
    if (!selectedOption) return;

    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setForecastResults(forecastData[selectedOption.id]);
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        currentPage="forecast"
      />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                ML Forecasting
              </h1>
              <p className="text-slate-600">
                Advanced machine learning predictions for financial metrics
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-50 px-3 py-1">
                <span className="text-sm font-medium text-purple-700">
                  AI Powered
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-600"></div>
                <div className="text-sm">
                  <div className="font-medium text-slate-800">Admin User</div>
                  <div className="text-slate-500">Data Scientist</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Configuration Panel */}
          <ForecastConfig
            selectedOption={selectedOption}
            onOptionChange={setSelectedOption}
            onRunForecast={handleRunForecast}
            isLoading={isLoading}
          />

          {/* Forecast Results */}
          {(forecastResults || isLoading) && (
            <ForecastChart
              data={forecastResults}
              option={selectedOption}
              isLoading={isLoading}
            />
          )}

          {/* Model Information */}
          {selectedOption && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Model Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">Algorithm</h4>
                  <p className="text-sm text-slate-600">
                    Prophet Time Series Model
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">
                    Training Data
                  </h4>
                  <p className="text-sm text-slate-600">
                    8 months of historical data with seasonal adjustments
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">Accuracy</h4>
                  <p className="text-sm text-slate-600">
                    92.5% accuracy on validation set (MAPE: 7.5%)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Forecast;

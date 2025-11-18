import React, { useState } from "react";
// --- FIX: Using 'SideBar' casing as per user's file structure ---
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
  MessageSquare
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

// Forecast options
const forecastOptions = [
  {
    id: "disbursement",
    title: "Loan Disbursement",
    description: "Predict future loan disbursement amounts",
    icon: IndianRupee,
    color: "emerald",
    unit: "₹",
    format: (val) => {
      if (val === null || val === undefined) return "";
      if (val > 1000000) return `₹${(val / 1000000).toFixed(1)}M`;
      if (val > 1000) return `₹${(val / 1000).toFixed(1)}K`;
      return `₹${val}`;
    },
    apiEndpoint: "/api/forecast/disbursement?branch=087:Deogarh",
    actualKey: "actual",
    predictedKey: "predicted",
  },
  {
    id: "collections",
    title: "Collection Rate",
    description: "Forecast EMI collection performance",
    icon: Target,
    color: "blue",
    unit: "%",
    format: (val) => {
      if (val === null || val === undefined) return "";
      return `${val.toFixed(1)}%`;
    },
    apiEndpoint: "/api/forecast/collections?branch=254:Mungra Badshahpur",
    actualKey: "actual",
    predictedKey: "predicted",
  },
  {
    id: "customers",
    title: "Customer Growth",
    description: "Predict customer base expansion",
    icon: Users,
    color: "purple",
    unit: "",
    format: (val) => {
      if (val === null || val === undefined) return "";
      return val.toLocaleString();
    },
    apiEndpoint: "/api/forecast/growth?branch=167:Gwalior",
    actualKey: "actual",
    predictedKey: "predicted",
  },
  {
    id: "delinquency",
    title: "Delinquency Rate",
    description: "Forecast payment default trends",
    icon: TrendingDown,
    color: "red",
    unit: "%",
    format: (val) => {
      if (val === null || val === undefined) return "";
      return `${val.toFixed(1)}%`;
    },
    apiEndpoint: null, // No API, will use static data
    actualKey: "actual",
    predictedKey: "predicted",
  },
];

// --- HELPER FUNCTION: Converts '2025-09-14' to 'Sep 25' ---
const formatApiDate = (dateString) => {
  const date = new Date(dateString);
  // Using UTC to avoid timezone issues
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  });
};

// --- Static data for Delinquency fallback ---
const delinquencyStaticData = {
  historical: [
    { month: "Jan 2025", actual: 5.2, predicted: null },
    { month: "Feb 2025", actual: 4.8, predicted: null },
    { month: "Mar 2025", actual: 6.1, predicted: null },
    { month: "Apr 2025", actual: 5.5, predicted: null },
    { month: "May 2025", actual: 4.9, predicted: null },
    { month: "Jun 2025", actual: 5.3, predicted: null },
  ],
  forecast: [
    { month: "Jul 2025", actual: null, predicted: 5.1 },
    { month: "Aug 2025", actual: null, predicted: 4.6 },
    { month: "Sep 2025", actual: null, predicted: 3.4 },
    { month: "Oct 2025", actual: null, predicted: 5.0 },
    { month: "Nov 2025", actual: null, predicted: 4.7 },
    { month: "Dec 2025", actual: null, predicted: 5.2 },
  ],
};

// --- NEW XAI EXPLANATION COMPONENT ---
const ForecastExplanation = ({ option }) => {
  const getExplanationText = (id) => {
    switch (id) {
      case "disbursement":
        return "This disbursement forecast exhibits high volatility, characterized by sharp peaks and valleys. The AI model is predicting that the current 'boom-and-bust' operational cycle will continue. **The dips suggest periods of lower activity**, likely due to internal monthly reporting, large loan processing delays, or external factors like local holidays. The forecast respects the financial floor and upper capacity (cap).";
      case "collections":
        return "The collections forecast shows a strong underlying trend but with recurring, predictable weekly dips. **These dips primarily correlate with weekends or local holiday cycles**, indicating that field staff collection efforts are consistently affected by these periodic events. The model accounts for this seasonality to give a realistic cash flow expectation.";
      case "customers":
        return "This cumulative customer growth curve is highly reliable. The forecast correctly identifies a period of **explosive growth** (late 2023/2024) followed by a predicted **leveling-off** phase. This 'S-curve' indicates the branch is approaching market saturation (hitting its capacity cap) and management should focus on retention rather than pure acquisition.";
      case "delinquency":
        return "Note: This is a static placeholder forecast. In the live system, a successful model would predict increases in delinquency rates 60-90 days out, allowing us to launch proactive intervention campaigns.";
      default:
        return "Select a forecast type to generate an AI-driven explanation of the observed patterns.";
    }
  };

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2 mb-3">
        <MessageSquare className="h-5 w-5 text-blue-600" />
        AI Narrative: Understanding the Forecast
      </h3>
      <p className="text-sm text-blue-700 leading-relaxed">
        {getExplanationText(option.id)}
      </p>
    </div>
  );
};

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
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg p-2",
                      option.color === "emerald" && "bg-emerald-100",
                      option.color === "blue" && "bg-blue-100",
                      option.color === "purple" && "bg-purple-100",
                      option.color === "red" && "bg-red-100"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        option.color === "emerald" && "text-emerald-600",
                        option.color === "blue" && "text-blue-600",
                        option.color === "purple" && "text-purple-600",
                        option.color === "red" && "text-red-600"
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

        {/* Run Forecast Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRunForecast}
            disabled={!selectedOption || isLoading}
            className={cn(
              "flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-colors",
              !selectedOption || isLoading
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
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
  // === FIX: Use 'option' and 'data' props inside this component (not parent variables) ===
  if (!data || !option) return null;

  // Combine historical and forecast arrays for the chart
  const combinedData = [...(data.historical || []), ...(data.forecast || [])];
  const { format, actualKey, predictedKey } = option;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Find the payload for each line
      const actualPayload = payload.find((p) => p.dataKey === actualKey || p.dataKey === "actual");
      const predictedPayload = payload.find((p) => p.dataKey === predictedKey || p.dataKey === "predicted");

      return (
        <div className="rounded-lg border bg-white p-3 shadow-md">
          <p className="font-semibold text-slate-800 mb-2">{label}</p>
          <div className="space-y-1">
            {actualPayload && actualPayload.value !== null && (
              <p className="text-sm text-slate-600">
                Actual: {format(actualPayload.value)}
              </p>
            )}
            {predictedPayload && predictedPayload.value !== null && (
              <p className="text-sm text-emerald-600">
                Predicted: {format(predictedPayload.value)}
              </p>
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
                tickFormatter={format}
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

              {/* Confidence lines (will work if data has them) */}
              {data.forecast && data.forecast.length > 0 &&
                data.forecast[0].confidence_low && (
                  <Line
                    type="monotone"
                    dataKey="confidence_low"
                    stroke="#a5f3fc"
                    strokeWidth={1}
                    dot={false}
                    activeDot={false}
                    connectNulls={false}
                    name="Confidence Low"
                    legendType="none"
                  />
                )}
              {data.forecast && data.forecast.length > 0 &&
                data.forecast[0].confidence_high && (
                  <Line
                    type="monotone"
                    dataKey="confidence_high"
                    stroke="#a5f3fc"
                    strokeWidth={1}
                    dot={false}
                    activeDot={false}
                    connectNulls={false}
                    name="Confidence High"
                    legendType="none"
                  />
                )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Forecast Summary */}
     {/* Forecast Summary – hidden for Collection Rate */}
{!isLoading && data && option.id !== "collections" && (
  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
    {data.forecast.slice(0, 3).map((item, index) => (
      <div key={index} className="rounded-lg bg-slate-50 p-4">
        <div className="text-sm font-medium text-slate-600">
          {item.month}
        </div>
        <div className="text-lg font-bold text-slate-800">
          {format(item.predicted)}
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
  // --- Back to original state structure ---
  const [forecastResults, setForecastResults] = useState(null);

  // --- THIS IS THE UPDATED FUNCTION ---
  const handleRunForecast = async () => {
    if (!selectedOption) return;

    setIsLoading(true);
    setForecastResults(null); // Clear previous chart

    const { id, apiEndpoint, actualKey, predictedKey } = selectedOption;

    try {
      let results;

      if (id === "delinquency" || !apiEndpoint) {
        // --- CASE 1: Delinquency (use static data) ---
        console.log("Using static data for Delinquency");
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay
        results = delinquencyStaticData; // Use the static object
      } else {
        // --- CASE 2: Fetch REAL data from API ---
        console.log(`Fetching data for ${id} from ${apiEndpoint}`);

        const API_HOST = "http://127.0.0.1:8080";

        const response = await fetch(`${API_HOST}${apiEndpoint}`);
        if (!response.ok) {
          const err = await response.json();
          throw new Error(
            `API Error: ${response.status} - ${err.detail || "Failed to fetch"}`
          );
        }

        const apiData = await response.json(); // This is { branch: "...", historical: [...], forecast: [...] }

        // --- The API now sends data in the *exact* format we need ---
        // We just need to rename the keys to 'actual' and 'predicted'
        // based on the option selected.

        const formattedHistorical = (apiData.historical || []).map((item) => ({
          month: item.month,
          actual: item.actual,
          predicted: null,
        }));

        const formattedForecast = (apiData.forecast || []).map((item) => ({
          month: item.month,
          actual: null,
          predicted: item.predicted,
          confidence_low: item.confidence_low,
          confidence_high: item.confidence_high,
        }));

        results = {
          historical: formattedHistorical,
          forecast: formattedForecast,
        };
      }

      setForecastResults(results); // Set the {historical, forecast} object
    } catch (error) {
      console.error(`Failed to run forecast: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        currentPage="forecast"
      />

      <main className="flex-1 overflow-auto">
        {/* Header (Unchanged) */}
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

        {/* Main Content (Unchanged) */}
        <div className="p-6 space-y-6">
          {/* Configuration Panel */}
          <ForecastConfig
            selectedOption={selectedOption}
            onOptionChange={setSelectedOption}
            onRunForecast={handleRunForecast}
            isLoading={isLoading}
          />

          {/* Forecast Results */}
          {selectedOption && (forecastResults || isLoading) && (
            <ForecastChart
              data={forecastResults}
              option={selectedOption}
              isLoading={isLoading}
            />
          )}

          {/* --- NEW: AI EXPLANATION SECTION (kept in parent if you prefer) --- */}
          {selectedOption && !isLoading && forecastResults && (
            <ForecastExplanation option={selectedOption} />
          )}

          {/* Model Information (Unchanged) */}
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

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
  Calendar,
  Target,
  User,
  Clock,
  Filter,
  Download,
  UserCheck,
  AlertCircle,
  TrendingDown,
} from "lucide-react";
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  Legend,
  CartesianGrid,
} from "recharts";

// Utility function for className merging
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// Sample data for client analytics
const delinquencyByAgeData = [
  { ageGroup: "18-25", total: 450, delinquent: 65, rate: 14.4 },
  { ageGroup: "26-35", total: 820, delinquent: 78, rate: 9.5 },
  { ageGroup: "36-45", total: 920, delinquent: 82, rate: 8.9 },
  { ageGroup: "46-55", total: 550, delinquent: 38, rate: 6.9 },
  { ageGroup: "56-65", total: 280, delinquent: 22, rate: 7.9 },
  { ageGroup: "65+", total: 120, delinquent: 15, rate: 12.5 },
];

const clientTimelineData = [
  { month: "Jan 2023", newClients: 45, totalClients: 2450 },
  { month: "Feb 2023", newClients: 52, totalClients: 2502 },
  { month: "Mar 2023", newClients: 67, totalClients: 2569 },
  { month: "Apr 2023", newClients: 58, totalClients: 2627 },
  { month: "May 2023", newClients: 73, totalClients: 2700 },
  { month: "Jun 2023", newClients: 89, totalClients: 2789 },
  { month: "Jul 2023", newClients: 95, totalClients: 2884 },
  { month: "Aug 2023", newClients: 82, totalClients: 2966 },
  { month: "Sep 2023", newClients: 78, totalClients: 3044 },
  { month: "Oct 2023", newClients: 91, totalClients: 3135 },
  { month: "Nov 2023", newClients: 105, totalClients: 3240 },
  { month: "Dec 2023", newClients: 118, totalClients: 3358 },
  { month: "Jan 2024", newClients: 123, totalClients: 3481 },
  { month: "Feb 2024", newClients: 134, totalClients: 3615 },
  { month: "Mar 2024", newClients: 142, totalClients: 3757 },
  { month: "Apr 2024", newClients: 156, totalClients: 3913 },
  { month: "May 2024", newClients: 168, totalClients: 4081 },
  { month: "Jun 2024", newClients: 175, totalClients: 4256 },
];

const delinquencyByGenderData = [
  { gender: "Male", total: 1806, delinquent: 198, rate: 8.1 },
  { gender: "Female", total: 2450, delinquent: 102, rate: 5.6 },
];

const loanPurposeData = [
  {
    purpose: "Small Business",
    count: 1456,
    percentage: 34.2,
    color: "#059669",
  },
  { purpose: "Agriculture", count: 982, percentage: 23.1, color: "#0891b2" },
  { purpose: "Education", count: 654, percentage: 15.4, color: "#7c3aed" },
  { purpose: "Healthcare", count: 412, percentage: 9.7, color: "#dc2626" },
  {
    purpose: "Home Improvement",
    count: 398,
    percentage: 9.3,
    color: "#ea580c",
  },
  { purpose: "Emergency", count: 354, percentage: 8.3, color: "#db2777" },
];

const clientTenureData = [
  { tenure: "0-6 months", count: 456, percentage: 10.7 },
  { tenure: "6-12 months", count: 623, percentage: 14.6 },
  { tenure: "1-2 years", count: 891, percentage: 20.9 },
  { tenure: "2-3 years", count: 734, percentage: 17.2 },
  { tenure: "3-5 years", count: 987, percentage: 23.2 },
  { tenure: "5+ years", count: 565, percentage: 13.3 },
];


// Metric Card Component
const MetricCard = ({ title, value, subtitle, icon: Icon, className }) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-6 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-600">{title}</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">{value}</span>
            {subtitle && (
              <span className="text-sm text-slate-500">{subtitle}</span>
            )}
          </div>
        </div>
        {Icon && (
          <div className="rounded-lg bg-emerald-50 p-3">
            <Icon className="h-6 w-6 text-emerald-600" />
          </div>
        )}
      </div>
    </div>
  );
};

// Delinquency by Age Chart
const DelinquencyByAgeChart = () => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-white p-3 shadow-md">
          <p className="font-semibold text-slate-800 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-slate-600">
              Total Clients: {data.total.toLocaleString()}
            </p>
            <p className="text-sm text-red-600">
              Delinquent: {data.delinquent.toLocaleString()}
            </p>
            <p className="text-sm text-red-700 font-medium">
              Rate: {data.rate.toFixed(1)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={delinquencyByAgeData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="ageGroup"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="total"
            fill="#e2e8f0"
            radius={[0, 0, 0, 0]}
            name="Total Clients"
          />
          <Bar
            dataKey="delinquent"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
            name="Delinquent"
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Client Timeline Chart
const ClientTimelineChart = () => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-white p-3 shadow-md">
          <p className="font-semibold text-slate-800 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-emerald-600">
              New Clients: {data.newClients.toLocaleString()}
            </p>
            <p className="text-sm text-slate-600">
              Total Clients: {data.totalClients.toLocaleString()}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={clientTimelineData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="clientGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#64748b" }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="newClients"
            stroke="#059669"
            strokeWidth={2}
            fill="url(#clientGradient)"
            name="New Clients"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Delinquency by Gender Chart
const DelinquencyByGenderChart = () => {
  const data = delinquencyByGenderData.map((item) => ({
    ...item,
    current: item.total - item.delinquent,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-white p-3 shadow-md">
          <p className="font-semibold text-slate-800 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-slate-600">
              Total: {data.total.toLocaleString()}
            </p>
            <p className="text-sm text-emerald-600">
              Current: {data.current.toLocaleString()}
            </p>
            <p className="text-sm text-red-600">
              Delinquent: {data.delinquent.toLocaleString()} (
              {data.rate.toFixed(1)}%)
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="gender"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="current" stackId="a" fill="#059669" name="Current" />
          <Bar
            dataKey="delinquent"
            stackId="a"
            fill="#ef4444"
            name="Delinquent"
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Loan Purpose Pie Chart
const LoanPurposeChart = () => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-white p-3 shadow-md">
          <p className="font-semibold text-slate-800">{data.purpose}</p>
          <p className="text-sm text-slate-600">
            {data.count.toLocaleString()} clients ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-80 items-center justify-between">
      <div className="h-full w-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={loanPurposeData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="count"
            >
              {loanPurposeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-1 space-y-3">
        {loanPurposeData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-slate-700">
                {item.purpose}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-800">
                {item.percentage}%
              </div>
              <div className="text-xs text-slate-500">
                {item.count.toLocaleString()} clients
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Client Tenure Chart
const ClientTenureChart = () => {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={clientTenureData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          layout="horizontal"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <YAxis
            type="category"
            dataKey="tenure"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <Tooltip
            formatter={(value, name) => [
              `${value.toLocaleString()} clients`,
              "Count",
            ]}
          />
          <Bar dataKey="count" fill="#059669" radius={[0, 4, 4, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Main Client Analytics Component
const Client = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const totalClients = 4256;
  const delinquentClients = 300;
  const delinquencyRate = (delinquentClients / totalClients) * 100;
  const avgTenure = 2.8;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        currentPage="clients"
      />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Client Analytics
              </h1>
              <p className="text-slate-600">
                Comprehensive insights into client demographics and behavior
              </p>
            </div>

            <div className="flex items-center gap-4">
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
                  <div className="text-slate-500">Analytics Manager</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Clients"
              value={totalClients.toLocaleString()}
              subtitle="active accounts"
              icon={Users}
            />

            <MetricCard
              title="Delinquent Clients"
              value={delinquentClients.toLocaleString()}
              subtitle={`${delinquencyRate.toFixed(1)}% rate`}
              icon={AlertCircle}
            />

            <MetricCard
              title="Average Tenure"
              value={`${avgTenure} years`}
              subtitle="client lifetime"
              icon={Clock}
            />

            <MetricCard
              title="Gender Split"
              value="57% / 43%"
              subtitle="male / female"
              icon={UserCheck}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Delinquency by Age */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Delinquency by Age Group
                  </h3>
                  <p className="text-sm text-slate-600">
                    Client delinquency rates across different age brackets
                  </p>
                </div>
                <div className="rounded-lg bg-red-50 p-2">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
              </div>
              <DelinquencyByAgeChart />
            </div>

            {/* Client Timeline */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Client Onboarding Timeline
                  </h3>
                  <p className="text-sm text-slate-600">
                    New client acquisitions over time
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <ClientTimelineChart />
            </div>
          </div>

          {/* Second Row Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Delinquency by Gender */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Delinquency Rate by Gender
                  </h3>
                  <p className="text-sm text-slate-600">
                    Payment performance comparison between genders
                  </p>
                </div>
                <div className="rounded-lg bg-purple-50 p-2">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <DelinquencyByGenderChart />
            </div>

            {/* Loan Purpose */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Loan Purpose Breakdown
                  </h3>
                  <p className="text-sm text-slate-600">
                    Distribution of loan purposes across client base
                  </p>
                </div>
                <div className="rounded-lg bg-blue-50 p-2">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <LoanPurposeChart />
            </div>
          </div>

          {/* Client Tenure Distribution */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Client Tenure Distribution
                </h3>
                <p className="text-sm text-slate-600">
                  How long clients have been active with the organization
                </p>
              </div>
              <div className="rounded-lg bg-orange-50 p-2">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <ClientTenureChart />
          </div>

          {/* Summary Insights */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
              Key Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-lg bg-emerald-50 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium text-emerald-800">
                    Growth Trend
                  </span>
                </div>
                <p className="text-sm text-emerald-700">
                  Client onboarding has increased by 45% over the last 12
                  months, showing strong market penetration.
                </p>
              </div>

              <div className="rounded-lg bg-amber-50 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <span className="font-medium text-amber-800">
                    Risk Factor
                  </span>
                </div>
                <p className="text-sm text-amber-700">
                  Younger clients (18-25) show higher delinquency rates (14.4%),
                  requiring enhanced support programs.
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">
                    Business Focus
                  </span>
                </div>
                <p className="text-sm text-blue-700">
                  Small business loans dominate (34.2%) followed by agriculture
                  (23.1%), aligning with microfinance mission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Client;

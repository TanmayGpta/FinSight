import React, { useState } from "react";
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
  AlertTriangle,
  Banknote,
  Bell,
  CheckCircle,
  Filter,
  Search,
  TrendingDown,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  Bar,
  BarChart as RechartsBarChart,
} from "recharts";

// Utility function for className merging
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// Sample data for charts
const disbursementData = [
  { month: "Jan", amount: 245000, loans: 45 },
  { month: "Feb", amount: 380000, loans: 67 },
  { month: "Mar", amount: 320000, loans: 58 },
  { month: "Apr", amount: 450000, loans: 82 },
  { month: "May", amount: 520000, loans: 95 },
  { month: "Jun", amount: 480000, loans: 89 },
  { month: "Jul", amount: 590000, loans: 108 },
  { month: "Aug", amount: 670000, loans: 125 },
  { month: "Sep", amount: 720000, loans: 134 },
  { month: "Oct", amount: 850000, loans: 156 },
  { month: "Nov", amount: 920000, loans: 172 },
  { month: "Dec", amount: 1050000, loans: 195 },
];

const delinquencyData = [
  { name: "Current", value: 82.5, count: 1650, color: "#059669" },
  { name: "1-30 Days", value: 9.2, count: 184, color: "#f59e0b" },
  { name: "31-60 Days", value: 5.1, count: 102, color: "#ef4444" },
  { name: "60+ Days", value: 3.2, count: 64, color: "#dc2626" },
];

const acceptanceData = [
  { month: "Jan", accepted: 145, rejected: 89, total: 234 },
  { month: "Feb", accepted: 189, rejected: 67, total: 256 },
  { month: "Mar", accepted: 156, rejected: 78, total: 234 },
  { month: "Apr", accepted: 203, rejected: 95, total: 298 },
  { month: "May", accepted: 234, rejected: 112, total: 346 },
  { month: "Jun", accepted: 187, rejected: 89, total: 276 },
  { month: "Jul", accepted: 267, rejected: 134, total: 401 },
  { month: "Aug", accepted: 289, rejected: 156, total: 445 },
  { month: "Sep", accepted: 298, rejected: 178, total: 476 },
  { month: "Oct", accepted: 334, rejected: 189, total: 523 },
  { month: "Nov", accepted: 378, rejected: 203, total: 581 },
  { month: "Dec", accepted: 412, rejected: 234, total: 646 },
];

// Sidebar Component
const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigationItems = [
    { title: "Dashboard", href: "/", icon: Home, active: true },
    {
      title: "Loan Management",
      href: "/loans",
      icon: CreditCard,
      active: false,
    },
    { title: "Customers", href: "/customers", icon: Users, active: false },
    { title: "Branches", href: "/branches", icon: Building2, active: false },
    { title: "Reports", href: "/reports", icon: FileText, active: false },
    { title: "Analytics", href: "/analytics", icon: BarChart3, active: false },
    {
      title: "Collections",
      href: "/collections",
      icon: TrendingUp,
      active: false,
    },
    { title: "Settings", href: "/settings", icon: Settings, active: false },
  ];

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-slate-200 px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-800">
                FinSight
              </span>
              <span className="text-xs text-slate-500">Microfinance</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                item.active
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-800",
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.title}</span>}
            </a>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-slate-200 p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex w-full items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-50"
        >
          <PieChart className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3 text-sm">Collapse</span>}
        </button>
      </div>
    </div>
  );
};

// Search Bar Component
const SearchBar = ({ onSearch, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (onSearch) onSearch(value);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search branches, customers, loans..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* Filter Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={cn(
          "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
          showFilters
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
        )}
      >
        <Filter className="h-4 w-4" />
        Filters
      </button>

      {/* Quick Filter Chips */}
      <div className="hidden md:flex items-center gap-2">
        {["All Branches", "Active", "Overdue", "New Applications"].map(
          (filter) => (
            <button
              key={filter}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filter === "All Branches"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              {filter}
            </button>
          ),
        )}
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({
  title,
  value,
  change,
  icon: Icon,
  subtitle,
  children,
}) => {
  const formatValue = (val) => {
    if (typeof val === "number") {
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
      return val.toLocaleString();
    }
    return val;
  };

  const getTrendIcon = () => {
    if (!change) return null;
    if (change.type === "increase") {
      return <TrendingUp className="h-4 w-4 text-emerald-600" />;
    } else if (change.type === "decrease") {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  const getTrendColor = () => {
    if (!change) return "";
    if (change.type === "increase") return "text-emerald-600";
    else if (change.type === "decrease") return "text-red-600";
    return "text-slate-600";
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-600">{title}</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-800">
              {formatValue(value)}
            </span>
            {subtitle && (
              <span className="text-sm text-slate-500">{subtitle}</span>
            )}
          </div>

          {change && (
            <div
              className={cn(
                "mt-2 flex items-center gap-1 text-sm",
                getTrendColor(),
              )}
            >
              {getTrendIcon()}
              <span className="font-medium">
                {change.value > 0 ? "+" : ""}
                {change.value}%
              </span>
              <span className="text-slate-500">vs {change.period}</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className="rounded-lg bg-emerald-50 p-3">
            <Icon className="h-6 w-6 text-emerald-600" />
          </div>
        )}
      </div>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

// Loan Disbursement Chart Component
const LoanDisbursementChart = () => {
  const formatCurrency = (value) => {
    if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
    return `₹${value}`;
  };

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={disbursementData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient
              id="disbursementGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            tickFormatter={formatCurrency}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
            formatter={(value, name) => [
              name === "amount" ? formatCurrency(value) : value,
              name === "amount" ? "Amount Disbursed" : "Number of Loans",
            ]}
            labelStyle={{ color: "#374151", fontWeight: "600" }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#059669"
            strokeWidth={2}
            fill="url(#disbursementGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Delinquency Chart Component
const DelinquencyChart = () => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-white p-3 shadow-md">
          <p className="font-semibold text-slate-800">{data.name}</p>
          <p className="text-sm text-slate-600">
            {data.value}% ({data.count} customers)
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
              data={delinquencyData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {delinquencyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-1 space-y-3">
        {delinquencyData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-slate-700">
                {item.name}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-800">
                {item.value}%
              </div>
              <div className="text-xs text-slate-500">
                {item.count} customers
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Acceptance Chart Component
const AcceptanceChart = () => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const acceptanceRate = ((data.accepted / data.total) * 100).toFixed(1);

      return (
        <div className="rounded-lg border bg-white p-3 shadow-md">
          <p className="font-semibold text-slate-800 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-emerald-600">
              Accepted: {data.accepted} ({acceptanceRate}%)
            </p>
            <p className="text-sm text-red-600">
              Rejected: {data.rejected} (
              {(100 - parseFloat(acceptanceRate)).toFixed(1)}%)
            </p>
            <p className="text-sm text-slate-600 border-t pt-1">
              Total Applications: {data.total}
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
          data={acceptanceData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
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
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="accepted"
            stackId="a"
            fill="#059669"
            radius={[0, 0, 0, 0]}
            name="Accepted"
          />
          <Bar
            dataKey="rejected"
            stackId="a"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
            name="Rejected"
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const recentActivities = [
    {
      type: "approval",
      message: "Loan application #LA-2024-0156 approved for ₹25,000",
      time: "2 minutes ago",
      color: "emerald",
    },
    {
      type: "collection",
      message: "EMI payment received from customer ID: CU-2024-0892",
      time: "5 minutes ago",
      color: "blue",
    },
    {
      type: "overdue",
      message: "Payment overdue alert for loan #LA-2024-0134",
      time: "12 minutes ago",
      color: "red",
    },
    {
      type: "new_application",
      message: "New loan application submitted from Bangalore branch",
      time: "18 minutes ago",
      color: "purple",
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Dashboard Overview
              </h1>
              <p className="text-slate-600">{currentDate}</p>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
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

          <div className="mt-4">
            <SearchBar />
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Key Metrics Row */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Portfolio"
              value="₹12.5M"
              change={{ value: 8.2, type: "increase", period: "last month" }}
              icon={DollarSign}
            />

            <MetricCard
              title="Active Loans"
              value={2847}
              change={{ value: 5.3, type: "increase", period: "last month" }}
              icon={CreditCard}
            />

            <MetricCard
              title="Collection Rate"
              value="94.2%"
              change={{ value: 2.1, type: "increase", period: "last month" }}
              icon={CheckCircle}
            />

            <MetricCard
              title="New Customers"
              value={234}
              change={{ value: -3.8, type: "decrease", period: "last month" }}
              icon={Users}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Loan Disbursement Chart */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Loan Disbursement Trend
                  </h3>
                  <p className="text-sm text-slate-600">
                    Monthly disbursement amounts over the past year
                  </p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <LoanDisbursementChart />
            </div>

            {/* Delinquency Chart */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    EMI Delinquency Status
                  </h3>
                  <p className="text-sm text-slate-600">
                    Customer payment status breakdown
                  </p>
                </div>
                <div className="rounded-lg bg-amber-50 p-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <DelinquencyChart />
            </div>
          </div>

          {/* Additional Metrics and Charts */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Loan Acceptance Rate Chart */}
            <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Loan Application Status
                  </h3>
                  <p className="text-sm text-slate-600">
                    Acceptance vs rejection rates over time
                  </p>
                </div>
                <div className="rounded-lg bg-blue-50 p-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <AcceptanceChart />
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <MetricCard
                title="Avg Loan Amount"
                value="₹45,300"
                subtitle="per customer"
                icon={Banknote}
              />

              <MetricCard
                title="Monthly Collections"
                value="₹2.8M"
                change={{ value: 12.5, type: "increase", period: "last month" }}
                icon={TrendingUp}
              />

              <MetricCard
                title="Branches Active"
                value={237}
                subtitle="across regions"
                icon={CheckCircle}
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-800">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-slate-100 p-3"
                >
                  <div
                    className={`h-2 w-2 rounded-full ${
                      activity.color === "emerald"
                        ? "bg-emerald-500"
                        : activity.color === "blue"
                          ? "bg-blue-500"
                          : activity.color === "red"
                            ? "bg-red-500"
                            : "bg-purple-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-800">{activity.message}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

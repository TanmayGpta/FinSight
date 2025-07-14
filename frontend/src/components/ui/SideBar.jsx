import {
  BarChart3,  Building2,CreditCard,DollarSign,FileText,Home,PieChart,Settings,TrendingUp,Users
} from "lucide-react";

const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigationItems = [
    { title: "Dashboard", href: "/", icon: Home, active: true },
    { title: "Forecast", href: "/forecast", icon: BarChart3, active: false },
    {title: "Loan Management",href: "/loans",icon: CreditCard,active: false,},   
    { title: "Customers", href: "/customers", icon: Users, active: false },
    { title: "Branches", href: "/branches", icon: Building2, active: false },
    { title: "Reports", href: "/reports", icon: FileText, active: false }, 
    {title: "Collections",href: "/collections",icon: TrendingUp,active: false,},
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

export default Sidebar;
import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Receipt,
  FileText,
  Repeat,
  CreditCard,
  ScrollText,
  BarChart3,
  BookOpen,
  BookMarked,
  Settings,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  User,
  UserCircle2,
  Bell,
  Shield,
  Palette,
  Database,
  Package,
  Building2,
  Zap,
  CheckSquare,
  Calendar,
  Wallet,
  Tags,
  Truck,
  Landmark,
  PanelLeftClose,
  PanelLeftOpen,
  Wifi,
  Globe,
  UserPlus,
  Ticket,
  DollarSign,
  Network,
  Router,
  Banknote,
  ClipboardList,
  Cog,
  Search,
  Map,
  ListFilter,
  BarChart2,
  Wrench,
} from "lucide-react";
import { cn } from "../../lib/utils";

export const SIDEBAR_NAV = [
  { type: "item", to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },

  { type: "section", label: "CRM" },
  {
    type: "group", label: "Customers", icon: Users,
    children: [
      { to: "/isp-customers", label: "Search" },
      { to: "/customers", label: "List" },
    ],
  },
  {
    type: "group", label: "Leads", icon: UserPlus,
    children: [
      { to: "/isp-customers?tab=leads", label: "All Leads" },
    ],
  },
  {
    type: "group", label: "Tickets", icon: Ticket,
    children: [
      { to: "/tasks", label: "Tasks" },
      { to: "/scheduler", label: "Scheduler" },
      { to: "/automation", label: "Automation" },
    ],
  },
  {
    type: "group", label: "Finance", icon: DollarSign,
    children: [
      { to: "/invoices", label: "Invoices" },
      { to: "/quotes", label: "Quotes" },
      { to: "/recurring", label: "Recurring" },
      { to: "/payments", label: "Payments" },
      { to: "/statements", label: "Statements" },
      { to: "/items", label: "Products & Services" },
      { to: "/suppliers", label: "Suppliers" },
      { to: "/bills", label: "Bills" },
      { to: "/expenses", label: "Expenses" },
      { to: "/expense-categories", label: "Categories" },
      { to: "/loans", label: "Loans Given" },
    ],
  },

  { type: "section", label: "Company" },
  {
    type: "group", label: "Networking", icon: Globe,
    children: [
      { to: "/network", label: "Network Monitor" },
      { to: "/isp-billing", label: "ISP Billing" },
      { to: "/isp-notifications", label: "Notifications" },
    ],
  },
  {
    type: "group", label: "Scheduling", icon: Calendar,
    children: [
      { to: "/scheduler", label: "Calendar" },
      { to: "/tasks", label: "Task Board" },
    ],
  },

  { type: "section", label: "System" },
  {
    type: "group", label: "Administration", icon: Settings,
    children: [
      { to: "/settings", label: "General Settings" },
      { to: "/settings/users", label: "Users" },
      { to: "/settings/roles", label: "Roles" },
      { to: "/reports", label: "Reports" },
    ],
  },
  {
    type: "group", label: "Config", icon: Wrench,
    children: [
      { to: "/chart-of-accounts", label: "Chart of Accounts" },
      { to: "/journal", label: "Journal" },
      { to: "/recurring-journal", label: "Recurring Journal" },
      { to: "/accounting-periods", label: "Period Close" },
      { to: "/currencies", label: "Currencies" },
      { to: "/bank-accounts", label: "Bank Accounts" },
      { to: "/bank-reconciliation", label: "Reconciliation" },
      { to: "/fixed-assets", label: "Fixed Assets" },
      { to: "/payroll", label: "Payroll" },
    ],
  },
];

export const SETTINGS_NAV = [
  { type: "item", to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { type: "section", label: "Settings" },
  { type: "item", to: "/settings", section: "general", label: "General", icon: Settings },
  { type: "item", to: "/settings", section: "profile", label: "Profile", icon: User },
  { type: "item", to: "/settings", section: "account", label: "Account", icon: UserCircle2 },
  { type: "item", to: "/settings", section: "billing", label: "Billing", icon: CreditCard },
  { type: "item", to: "/settings", section: "data", label: "Data", icon: Database },
  { type: "item", to: "/settings", section: "notifications", label: "Notifications", icon: Bell },
  { type: "item", to: "/settings", section: "security", label: "Security", icon: Shield },
  { type: "item", to: "/settings", section: "appearance", label: "Appearance", icon: Palette },
];

export default function Sidebar({ onNavigate, showBrand = true, collapsed = false, onToggleCollapsed }) {
  const location = useLocation();
  const isSettingsPage = location.pathname === "/settings" || location.pathname.startsWith("/settings/");

  const findActiveGroup = () => {
    const navItems = isSettingsPage ? SETTINGS_NAV : SIDEBAR_NAV;
    for (const item of navItems) {
      if (item.type === "group" && item.children) {
        for (const child of item.children) {
          const childPath = child.to.split("?")[0];
          if (location.pathname === childPath || location.pathname.startsWith(childPath + "/")) {
            return item.label;
          }
        }
      }
    }
    return null;
  };

  const [expandedGroups, setExpandedGroups] = React.useState(() => {
    const active = findActiveGroup();
    return active ? { [active]: true } : {};
  });

  React.useEffect(() => {
    const active = findActiveGroup();
    if (active && !expandedGroups[active]) {
      setExpandedGroups((prev) => ({ ...prev, [active]: true }));
    }
  }, [location.pathname]);

  const toggleGroup = (label) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const navItems = isSettingsPage ? SETTINGS_NAV : SIDEBAR_NAV;
  const useSettingsNav = isSettingsPage;

  const getSettingsItemTo = (item) => {
    if (item.section) {
      return { pathname: "/settings", search: `?section=${item.section}` };
    }
    return item.to;
  };

  const isSettingsItemActive = (item) => {
    if (item.to === "/dashboard") return location.pathname === "/dashboard";
    if (item.section) {
      const sp = new URLSearchParams(location.search);
      const currentSection = sp.get("section") || "general";
      if (location.pathname === "/settings" && currentSection === item.section) return true;
      if ((location.pathname === "/settings/users" || location.pathname === "/settings/roles") && item.section === "account") return true;
      return false;
    }
    return false;
  };

  const isGroupActive = (group) => {
    return group.children?.some((child) => {
      const childPath = child.to.split("?")[0];
      return location.pathname === childPath || location.pathname.startsWith(childPath + "/");
    });
  };

  const isChildActive = (child) => {
    const childPath = child.to.split("?")[0];
    return location.pathname === childPath || location.pathname.startsWith(childPath + "/");
  };

  const renderGroup = (group) => {
    const Icon = group.icon;
    const isExpanded = expandedGroups[group.label] || false;
    const active = isGroupActive(group);

    if (collapsed) {
      const firstChild = group.children[0];
      return (
        <NavLink
          key={group.label}
          to={firstChild?.to || "/"}
          className={cn(
            "flex items-center justify-center rounded-lg h-10 w-10 mx-auto transition-all duration-150",
            active
              ? "bg-violet-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          )}
          title={group.label}
          onClick={onNavigate}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </NavLink>
      );
    }

    return (
      <div key={group.label} className="relative">
        <button
          onClick={() => toggleGroup(group.label)}
          className={cn(
            "w-full flex items-center px-3 py-2.5 text-[13.5px] font-medium gap-3 transition-all duration-150 rounded-lg",
            active
              ? "bg-violet-600 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          )}
        >
          <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-white" : "text-slate-400")} strokeWidth={1.8} />
          <span className="flex-1 text-left">{group.label}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              active ? "text-white/70" : "text-slate-400",
              isExpanded ? "" : "-rotate-90"
            )}
            strokeWidth={2}
          />
        </button>
        {isExpanded && (
          <div className="relative ml-6 mt-0.5 mb-1 border-l-2 border-violet-100">
            {group.children.map((child) => {
              const childActive = isChildActive(child);
              return (
                <NavLink
                  key={child.to}
                  to={child.to}
                  className={cn(
                    "block pl-4 pr-3 py-[6px] text-[13px] font-medium transition-all duration-150 relative",
                    childActive
                      ? "text-violet-700 font-semibold before:absolute before:left-[-2px] before:top-1 before:bottom-1 before:w-[2px] before:bg-violet-600 before:rounded-full"
                      : "text-slate-400 hover:text-slate-700"
                  )}
                  onClick={onNavigate}
                >
                  {child.label}
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {showBrand ? (
        <div
          className={cn(
            "relative h-16 flex items-center border-b border-slate-100 shrink-0",
            collapsed ? "px-2 justify-center" : "px-4"
          )}
        >
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center font-semibold tracking-tight text-slate-900 hover:opacity-90 transition-opacity flex-1 min-w-0",
              collapsed ? "gap-0 justify-center" : "gap-2.5"
            )}
            onClick={onNavigate}
          >
            <div className={cn(
              "rounded-xl bg-white flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-slate-200/60 shadow-sm",
              collapsed ? "h-9 w-9 p-0.5" : "h-10 w-10 p-1"
            )}>
              <img
                src="/bretune-logo.png"
                alt="Bretune"
                className="h-full w-full object-contain"
              />
            </div>
            {!collapsed ? (
              <div className="leading-tight min-w-0">
                <div className="text-[15px] font-bold text-slate-800 truncate tracking-tight">Bretune</div>
                <div className="text-[10px] font-medium text-slate-400 truncate">ISP & Accounting</div>
              </div>
            ) : null}
          </Link>
          {!collapsed && typeof onToggleCollapsed === "function" ? (
            <button
              type="button"
              onClick={() => onToggleCollapsed()}
              className="ml-auto shrink-0 h-7 w-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="h-[14px] w-[14px]" strokeWidth={1.5} />
            </button>
          ) : null}
        </div>
      ) : null}

      {collapsed && typeof onToggleCollapsed === "function" ? (
        <div className="px-2 pt-2 shrink-0">
          <button
            type="button"
            onClick={() => onToggleCollapsed()}
            className="w-full h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Expand sidebar"
          >
            <PanelLeftOpen className="h-[14px] w-[14px]" strokeWidth={1.5} />
          </button>
        </div>
      ) : null}

      <nav
        className={cn("flex-1 overflow-y-auto py-3", collapsed ? "px-2" : "px-3")}
        aria-label={isSettingsPage ? "Settings navigation" : "Primary navigation"}
      >
        <div className={cn("space-y-0.5", collapsed && "space-y-1")}>
          {navItems.map((item, idx) => {
            if (item.type === "section") {
              if (collapsed) return null;
              return (
                <div
                  key={`section-${item.label}-${idx}`}
                  className="px-3 pt-6 pb-2 text-[11px] font-bold uppercase tracking-widest text-emerald-500"
                >
                  {item.label}
                </div>
              );
            }

            if (item.type === "group") {
              return renderGroup(item);
            }

            if (item.type === "item") {
              const Icon = item.icon;
              if (!Icon) return null;
              const to = useSettingsNav ? getSettingsItemTo(item) : item.to;
              const isActive = useSettingsNav
                ? isSettingsItemActive(item)
                : location.pathname === item.to;

              if (collapsed) {
                return (
                  <NavLink
                    key={item.to + (item.section || "")}
                    to={to}
                    className={cn(
                      "flex items-center justify-center rounded-lg h-10 w-10 mx-auto transition-all duration-150",
                      isActive
                        ? "bg-violet-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    )}
                    end={item.to === "/" || item.to === "/dashboard"}
                    onClick={onNavigate}
                    title={item.label}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  </NavLink>
                );
              }

              return (
                <NavLink
                  key={item.to + (item.section || "")}
                  to={to}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-[13.5px] font-medium gap-3 rounded-lg transition-all duration-150",
                    isActive
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                  end={item.to === "/" || item.to === "/dashboard"}
                  onClick={onNavigate}
                >
                  <Icon className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-white" : "text-slate-400")} strokeWidth={1.8} />
                  <span className="flex-1 truncate">{item.label}</span>
                </NavLink>
              );
            }

            return null;
          })}
        </div>
      </nav>
    </div>
  );
}

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
} from "lucide-react";
import { cn } from "../../lib/utils";

export const SIDEBAR_NAV = [
  { type: "item", to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },

  { type: "section", label: "CRM" },
  {
    type: "group", label: "Customers", icon: Users,
    children: [
      { to: "/customers", label: "List" },
      { to: "/invoices", label: "Invoices" },
      { to: "/quotes", label: "Quotes" },
      { to: "/recurring", label: "Recurring" },
      { to: "/statements", label: "Statements" },
    ],
  },
  {
    type: "group", label: "Leads", icon: UserPlus,
    children: [
      { to: "/isp-customers", label: "ISP Leads & Customers" },
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
      { to: "/payments", label: "Payments" },
      { to: "/suppliers", label: "Suppliers" },
      { to: "/bills", label: "Bills" },
      { to: "/expenses", label: "Expenses" },
      { to: "/expense-categories", label: "Categories" },
      { to: "/loans", label: "Loans Given" },
      { to: "/items", label: "Products & Services" },
    ],
  },

  { type: "section", label: "ISP" },
  {
    type: "group", label: "Networking", icon: Globe,
    children: [
      { to: "/network", label: "Network Monitor" },
    ],
  },
  {
    type: "group", label: "Billing", icon: Banknote,
    children: [
      { to: "/isp-billing", label: "Invoices & Payments" },
      { to: "/isp-notifications", label: "Notifications" },
    ],
  },

  { type: "section", label: "Accounting" },
  {
    type: "group", label: "Bookkeeping", icon: BookOpen,
    children: [
      { to: "/chart-of-accounts", label: "Chart of Accounts" },
      { to: "/journal", label: "Journal" },
      { to: "/recurring-journal", label: "Recurring Journal" },
      { to: "/accounting-periods", label: "Period Close" },
      { to: "/currencies", label: "Currencies" },
    ],
  },
  {
    type: "group", label: "Banking", icon: Building2,
    children: [
      { to: "/bank-accounts", label: "Accounts" },
      { to: "/bank-reconciliation", label: "Reconciliation" },
    ],
  },
  {
    type: "group", label: "Assets & Payroll", icon: Package,
    children: [
      { to: "/fixed-assets", label: "Fixed Assets" },
      { to: "/payroll", label: "Payroll" },
    ],
  },
  { type: "item", to: "/reports", label: "Reports", icon: BarChart3 },

  { type: "section", label: "System" },
  { type: "item", to: "/settings", label: "Administration", icon: Settings },
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

  // Auto-expand group that contains the current path
  const findActiveGroup = () => {
    const navItems = isSettingsPage ? SETTINGS_NAV : SIDEBAR_NAV;
    for (const item of navItems) {
      if (item.type === "group" && item.children) {
        for (const child of item.children) {
          if (location.pathname === child.to || location.pathname.startsWith(child.to + "/")) {
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

  // Keep active group expanded when navigating
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
    return group.children?.some(
      (child) => location.pathname === child.to || location.pathname.startsWith(child.to + "/")
    );
  };

  const renderItem = (item, indent = false) => {
    if (!item.icon && !indent) return null;
    const Icon = item.icon;
    const to = useSettingsNav
      ? getSettingsItemTo(item)
      : item.to;

    return (
      <NavLink
        key={item.to + (item.section || "")}
        to={to}
        className={({ isActive }) => {
          const active = useSettingsNav ? isSettingsItemActive(item) : isActive;
          return cn(
            "flex items-center font-medium transition-all duration-150",
            collapsed
              ? "justify-center rounded-lg h-9 w-9 mx-auto text-[0px]"
              : indent
                ? "rounded-lg pl-10 pr-2.5 py-[6px] text-[12.5px] gap-2"
                : "rounded-lg px-2.5 py-[7px] text-[13px] gap-2.5",
            active
              ? "bg-violet-50 text-violet-700 font-semibold"
              : indent
                ? "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/60"
          );
        }}
        end={item.to === "/" || item.to === "/dashboard"}
        onClick={onNavigate}
        title={collapsed ? item.label : undefined}
      >
        {Icon && (
          <Icon
            className={cn("shrink-0", collapsed ? "h-[17px] w-[17px]" : "h-[15px] w-[15px]")}
            strokeWidth={collapsed ? 1.6 : 1.7}
          />
        )}
        {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
      </NavLink>
    );
  };

  const renderGroup = (group) => {
    const Icon = group.icon;
    const isExpanded = expandedGroups[group.label] || false;
    const active = isGroupActive(group);

    if (collapsed) {
      // In collapsed mode, show only the icon, link to first child
      return (
        <NavLink
          key={group.label}
          to={group.children[0]?.to || "/"}
          className={cn(
            "flex items-center justify-center rounded-lg h-9 w-9 mx-auto transition-all duration-150",
            active
              ? "bg-violet-100/80 text-violet-700"
              : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/40"
          )}
          title={group.label}
          onClick={onNavigate}
        >
          <Icon className="h-[17px] w-[17px]" strokeWidth={1.6} />
        </NavLink>
      );
    }

    return (
      <div key={group.label}>
        <button
          onClick={() => toggleGroup(group.label)}
          className={cn(
            "w-full flex items-center rounded-lg px-2.5 py-[7px] text-[13px] font-medium gap-2.5 transition-all duration-150",
            active
              ? "bg-violet-50 text-violet-700 font-semibold"
              : "text-slate-600 hover:text-slate-800 hover:bg-slate-100/60"
          )}
        >
          <Icon className="h-[15px] w-[15px] shrink-0" strokeWidth={1.7} />
          <span className="flex-1 truncate text-left">{group.label}</span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200",
              isExpanded ? "" : "-rotate-90"
            )}
            strokeWidth={2}
          />
        </button>
        {isExpanded && (
          <div className="mt-0.5 space-y-0.5">
            {group.children.map((child) => (
              <NavLink
                key={child.to}
                to={child.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center rounded-lg pl-10 pr-2.5 py-[5px] text-[12.5px] font-medium transition-all duration-150",
                    isActive
                      ? "text-violet-700 font-semibold"
                      : "text-slate-400 hover:text-slate-600"
                  )
                }
                onClick={onNavigate}
              >
                <span className="truncate">{child.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50/70 backdrop-blur-sm">
      {showBrand ? (
        <div
          className={cn(
            "relative h-16 flex items-center border-b border-slate-200/50 shrink-0",
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
                alt="Bretune Accounting"
                className="h-full w-full object-contain"
              />
            </div>
            {!collapsed ? (
              <div className="leading-tight min-w-0">
                <div className="text-sm font-bold text-slate-800 truncate tracking-tight">Bretune</div>
                <div className="text-[11px] font-medium text-slate-400 truncate">Accounting</div>
              </div>
            ) : null}
          </Link>
          {!collapsed && typeof onToggleCollapsed === "function" ? (
            <button
              type="button"
              onClick={() => onToggleCollapsed()}
              className="ml-auto shrink-0 h-7 w-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
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
            className="w-full h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
            title="Expand sidebar"
          >
            <PanelLeftOpen className="h-[14px] w-[14px]" strokeWidth={1.5} />
          </button>
        </div>
      ) : null}

      <nav
        className={cn("flex-1 overflow-y-auto py-2", collapsed ? "px-1.5" : "px-2.5")}
        aria-label={isSettingsPage ? "Settings navigation" : "Primary navigation"}
      >
        <div className={cn("space-y-0.5", collapsed && "space-y-1")}>
          {navItems.map((item, idx) => {
            if (item.type === "section") {
              if (collapsed) return null;
              return (
                <div
                  key={`section-${item.label}-${idx}`}
                  className="px-2.5 pt-5 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-violet-500/70"
                >
                  {item.label}
                </div>
              );
            }

            if (item.type === "group") {
              return renderGroup(item);
            }

            if (item.type === "item") {
              return renderItem(item);
            }

            return null;
          })}
        </div>
      </nav>
    </div>
  );
}

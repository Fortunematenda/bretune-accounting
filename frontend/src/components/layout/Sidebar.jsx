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
} from "lucide-react";
import { cn } from "../../lib/utils";

export const SIDEBAR_NAV = [
  { type: "item", to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },

  { type: "section", label: "Sales" },
  { type: "item", to: "/customers", label: "Customers", icon: Users },
  { type: "item", to: "/items", label: "Items", icon: Package },
  { type: "item", to: "/quotes", label: "Quotes", icon: FileText },
  { type: "item", to: "/invoices", label: "Invoices", icon: Receipt },
  { type: "item", to: "/recurring", label: "Recurring", icon: Repeat },
  { type: "item", to: "/payments", label: "Payments", icon: CreditCard },
  { type: "item", to: "/statements", label: "Statements", icon: ScrollText },

  { type: "section", label: "Purchases" },
  { type: "item", to: "/suppliers", label: "Suppliers", icon: Truck },
  { type: "item", to: "/bills", label: "Bills", icon: Receipt },
  { type: "item", to: "/expenses", label: "Expenses", icon: Wallet },
  { type: "item", to: "/expense-categories", label: "Expense Categories", icon: Tags },
  { type: "item", to: "/loans", label: "Loans Given", icon: Landmark },

  { type: "section", label: "Work" },
  { type: "item", to: "/tasks", label: "Tasks", icon: CheckSquare },
  { type: "item", to: "/scheduler", label: "Scheduler", icon: Calendar },
  { type: "item", to: "/automation", label: "Automation", icon: Zap },

  { type: "section", label: "Banking" },
  { type: "item", to: "/bank-accounts", label: "Bank Accounts", icon: Building2 },
  { type: "item", to: "/bank-reconciliation", label: "Bank Reconciliation", icon: Wallet },

  { type: "section", label: "Accounting" },
  { type: "item", to: "/chart-of-accounts", label: "Chart of Accounts", icon: BookOpen },
  { type: "item", to: "/journal", label: "Journal", icon: BookMarked },
  { type: "item", to: "/recurring-journal", label: "Recurring Journal", icon: Repeat },
  { type: "item", to: "/accounting-periods", label: "Period Close", icon: Calendar },
  { type: "item", to: "/currencies", label: "Currencies", icon: Wallet },
  { type: "item", to: "/fixed-assets", label: "Fixed Assets", icon: Package },
  { type: "item", to: "/payroll", label: "Payroll", icon: Users },

  { type: "section", label: "Analytics" },
  { type: "item", to: "/reports", label: "Reports", icon: BarChart3 },

  { type: "section", label: "ISP" },
  { type: "item", to: "/network", label: "Network Monitor", icon: Wifi },

  { type: "section", label: "Administration" },
  { type: "item", to: "/settings", label: "Settings", icon: Settings },
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

  const sectionLabels = React.useMemo(
    () =>
      (isSettingsPage ? SETTINGS_NAV : SIDEBAR_NAV || [])
        .filter((i) => i.type === "section")
        .map((i) => i.label),
    [isSettingsPage]
  );

  const [expandedSections, setExpandedSections] = React.useState(() => {
    const map = {};
    for (const label of sectionLabels) map[label] = true;
    return map;
  });

  const toggleSection = (label) => {
    setExpandedSections((prev) => ({
      ...prev,
      [label]: !(prev?.[label] ?? true),
    }));
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
    if (item.to === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    if (item.section) {
      const sp = new URLSearchParams(location.search);
      const currentSection = sp.get("section") || "general";
      if (location.pathname === "/settings" && currentSection === item.section) return true;
      if ((location.pathname === "/settings/users" || location.pathname === "/settings/roles") && item.section === "account") return true;
      return false;
    }
    return false;
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
          {(() => {
            let currentSection = null;
            return navItems.flatMap((item, idx) => {
              if (item.type === "section") {
                currentSection = item.label;
                if (collapsed) return [];
                const isExpanded = expandedSections?.[item.label] === true;
                return [
                  <div
                    key={`section-${item.label}-${idx}`}
                    className="px-2.5 pt-5 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400/70"
                  >
                    {item.label}
                  </div>,
                ];
              }

              if (!item.icon) return [];
              const Icon = item.icon;
              const to = useSettingsNav
                ? getSettingsItemTo(item)
                : (item.hash ? { pathname: item.to, search: `?section=${item.hash}` } : item.to);

              if (!collapsed && currentSection) {
                const isExpanded = expandedSections?.[currentSection] === true;
                if (!isExpanded) return [];
              }

              return [
                <NavLink
                  key={(item.to || item.label) + (item.hash || item.section || "")}
                  to={to}
                  className={({ isActive }) => {
                    const active = useSettingsNav ? isSettingsItemActive(item) : isActive;
                    return cn(
                      "group flex items-center font-medium transition-all duration-150",
                      collapsed
                        ? "justify-center rounded-lg h-9 w-9 mx-auto text-[0px]"
                        : "rounded-lg px-2.5 py-[7px] text-[13px] gap-2.5",
                      active
                        ? collapsed
                          ? "bg-violet-100/80 text-violet-700"
                          : "bg-violet-50/80 text-violet-700 font-semibold"
                        : collapsed
                          ? "text-slate-400 hover:text-slate-600 hover:bg-slate-200/40"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/60"
                    );
                  }}
                  end={item.to === "/" || item.to === "/dashboard"}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={cn(
                    "shrink-0 transition-colors",
                    collapsed ? "h-[17px] w-[17px]" : "h-[15px] w-[15px]"
                  )} strokeWidth={collapsed ? 1.6 : 1.7} />
                  {!collapsed ? <span className="flex-1 truncate">{item.label}</span> : null}
                </NavLink>,
              ];
            });
          })()}
        </div>
      </nav>

    </div>
  );
}

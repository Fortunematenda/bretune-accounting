import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Receipt,
  X,
  MoreHorizontal,
  Package,
} from "lucide-react";
import { cn } from "../../lib/utils";
import Button from "../ui/button";
import { useAuth } from "../../features/auth/auth-context";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import { getAccessToken } from "../../features/auth/token-store";

export default function AppShell({ children }) {
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const hasToken = Boolean(getAccessToken());

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem("sidebar_collapsed");
      if (v == null) return;
      setSidebarCollapsed(v === "1");
    } catch {
      // ignore
    }
  }, []);

  function setCollapsed(v) {
    const next = Boolean(v);
    setSidebarCollapsed(next);
    try {
      window.localStorage.setItem("sidebar_collapsed", next ? "1" : "0");
    } catch {
      // ignore
    }
  }

  return (
    <div className="h-screen overflow-hidden flex bg-slate-50/80">
      <aside
        className={cn(
          "hidden md:flex md:flex-col border-r border-slate-200/50 transition-[width] duration-200 overflow-hidden",
          sidebarCollapsed ? "md:w-[72px]" : "md:w-64"
        )}
      >
        <Sidebar
          showBrand
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setCollapsed(!sidebarCollapsed)}
        />
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!mobileOpen}
      >
        <div
          className={cn(
            "absolute inset-0 bg-slate-900/30 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />

        <aside
          className={cn(
            "absolute left-0 top-0 h-full w-64 flex flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-200",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
            <div className="text-sm font-semibold text-slate-900">Menu</div>
            <Button type="button" variant="outline" className="h-9 w-9 p-0" onClick={() => setMobileOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Sidebar onNavigate={() => setMobileOpen(false)} showBrand />
        </aside>
      </div>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <TopNav
          onOpenMobileMenu={() => setMobileOpen(true)}
          user={user}
          isUserLoading={hasToken && !user}
          onLogout={logout}
        />

        <div className="flex-1 overflow-y-auto px-4 sm:px-5 lg:px-6 py-3 sm:py-4 pb-24 md:pb-4">
          <div className="w-full">{children}</div>
        </div>

        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 md:hidden">
          <div className="grid grid-cols-5">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  isActive ? "text-violet-600 bg-violet-50/50" : "text-slate-500"
                )
              }
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </NavLink>
            <NavLink
              to="/customers"
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  isActive ? "text-violet-600 bg-violet-50/50" : "text-slate-500"
                )
              }
            >
              <Users className="h-5 w-5" />
              Customers
            </NavLink>
            <NavLink
              to="/invoices"
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  isActive ? "text-violet-600 bg-violet-50/50" : "text-slate-500"
                )
              }
            >
              <Receipt className="h-5 w-5" />
              Invoices
            </NavLink>
            <NavLink
              to="/items"
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  isActive ? "text-violet-700" : "text-slate-600 hover:text-slate-900"
                )
              }
            >
              <Package className="h-5 w-5" />
              Items
            </NavLink>
            <button
              type="button"
              className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium text-slate-500"
              onClick={() => setMobileOpen(true)}
              aria-label="More menu"
            >
              <MoreHorizontal className="h-5 w-5" />
              More
            </button>
          </div>
        </nav>
      </main>
    </div>
  );
}

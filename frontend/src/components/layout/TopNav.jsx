import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, FileText, Menu } from "lucide-react";
import Button from "../ui/button";
import { cn } from "../../lib/utils";
import GlobalSearch from "./GlobalSearch";
import QuickActionMenu from "./QuickActionMenu";
import NotificationPanel from "./NotificationPanel";
import { api } from "../../lib/api";
import { getDismissed } from "../../lib/notification-dismissed";

function resolveUserName(user) {
  if (!user) return "";
  const direct = user.fullName || user.displayName || user.name;
  if (direct && String(direct).trim() && !/^account$/i.test(String(direct).trim())) {
    return String(direct).trim();
  }
  const composed = (user.firstName || user.lastName)
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "";
  if (composed) return composed;
  if (user.email) {
    const local = user.email.split("@")[0] || "";
    if (local) {
      return local.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return String(user.email);
  }
  return "";
}

function resolveCompanyName(user) {
  if (!user) return "";
  const direct = user.companyName || user.businessName || user.organisationName || user.organizationName;
  if (direct) return String(direct);
  const c = user.company || user.activeCompany || user.organisation || user.organization;
  if (!c) return "";
  if (typeof c === "string") return c;
  return c.name || c.companyName || c.legalName || "";
}

function initialsFrom(text) {
  return String(text || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default function TopNav({
  onOpenMobileMenu,
  user,
  isUserLoading,
  onLogout,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const notifyBtnRef = useRef(null);

  const fetchNotificationCount = useCallback(() => {
    const dismissed = getDismissed();
    Promise.all([
      api.notifications(),
      api.tasksDashboardSummary().catch(() => null),
    ])
      .then(([notif, tasks]) => {
        const overdueInvoices = (notif?.overdueInvoices ?? []).filter((inv) => !dismissed.invoices.has(inv.id));
        const allTasks = [
          ...(tasks?.overdue?.items || []),
          ...(tasks?.today?.items || []),
        ];
        const tasksDue = allTasks.filter((t) => !dismissed.tasks.has(t.id)).length;
        const emailPending = notif?.emailOutbox?.pending ?? 0;
        const emailFailed = notif?.emailOutbox?.failed ?? 0;
        setNotificationCount(overdueInvoices.length + emailPending + emailFailed + tasksDue);
      })
      .catch(() => setNotificationCount(0));
  }, []);

  useEffect(() => {
    fetchNotificationCount();
    const interval = setInterval(fetchNotificationCount, 60000);
    const onDismissed = () => fetchNotificationCount();
    window.addEventListener("notifications-dismissed", onDismissed);
    return () => {
      clearInterval(interval);
      window.removeEventListener("notifications-dismissed", onDismissed);
    };
  }, [fetchNotificationCount]);

  const prevNotifCountRef = useRef(0);
  useEffect(() => {
    if (
      notificationCount > 0 &&
      notificationCount > prevNotifCountRef.current &&
      typeof Notification !== "undefined" &&
      Notification.permission === "granted" &&
      document.hidden
    ) {
      try {
        const n = new Notification("Bretune Accounting", {
          body: `${notificationCount} notification${notificationCount !== 1 ? "s" : ""} need your attention`,
          icon: "/favicon.ico",
          tag: "bretune-notification",
          requireInteraction: false,
        });
        n.onclick = () => {
          window.focus();
          n.close();
        };
      } catch {
        // ignore
      }
    }
    prevNotifCountRef.current = notificationCount;
  }, [notificationCount]);

  const userName = useMemo(() => resolveUserName(user), [user]);
  const companyName = useMemo(() => resolveCompanyName(user), [user]);

  const avatarUrl = user && (user.avatarUrl || user.photoUrl || user.profilePictureUrl);
  const initials = initialsFrom(userName || user?.email || "U");

  useEffect(() => {
    setOpen(false);
    setOpenPopover(null);
    setNotificationsOpen(false);
  }, [location?.pathname]);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (!open) return;
      const t = e.target;
      if (btnRef.current && btnRef.current.contains(t)) return;
      if (menuRef.current && menuRef.current.contains(t)) return;
      setOpen(false);
    }

    function onKeyDown(e) {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const menuEl = menuRef.current;
        if (!menuEl) return;
        const items = Array.from(menuEl.querySelectorAll("[data-topnav-menuitem]"));
        if (items.length === 0) return;

        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;

        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function openMenu() {
    setOpen(true);
    window.requestAnimationFrame(() => {
      const first = menuRef.current?.querySelector("[data-topnav-menuitem]");
      if (first) first.focus();
    });
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70 border-b border-slate-200/60 px-4 sm:px-5 lg:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <Button
          type="button"
          variant="outline"
          className="md:hidden h-9 w-9 p-0"
          onClick={onOpenMobileMenu}
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <Link to="/dashboard" className="md:hidden flex items-center gap-2" aria-label="Home">
          <div className="h-8 w-8 rounded-lg bg-violet-600 text-white flex items-center justify-center shadow-sm">
            <FileText className="h-4 w-4" />
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden sm:block">
          <QuickActionMenu
            open={openPopover === "actions"}
            onOpenChange={(v) => setOpenPopover(v ? "actions" : null)}
          />
        </div>
        <GlobalSearch
          open={openPopover === "search"}
          onOpenChange={(v) => setOpenPopover(v ? "search" : null)}
          iconOnly
        />
        <div className="relative" ref={notifyBtnRef}>
          <Button
            type="button"
            variant="outline"
            className="h-9 w-9 p-0 relative"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={() => {
              setOpenPopover(null);
              setOpen(false);
              setNotificationsOpen((v) => {
                const next = !v;
                if (!next) fetchNotificationCount();
                return next;
              });
            }}
          >
            <Bell className="h-4 w-4" />
            {notificationCount > 0 ? (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-medium text-white">
                {notificationCount > 99 ? "99+" : notificationCount}
              </span>
            ) : null}
          </Button>
          {notificationsOpen ? (
            <div className="absolute right-0 top-full pt-1 z-50">
              <NotificationPanel
                open={notificationsOpen}
                onOpenChange={(v) => {
                  setNotificationsOpen(v);
                  if (!v) fetchNotificationCount();
                }}
                triggerRef={notifyBtnRef}
              />
            </div>
          ) : null}
        </div>

        <div className="relative ml-1">
          <button
            ref={btnRef}
            type="button"
            className={cn(
              "flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300",
              open && "bg-slate-50"
            )}
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => {
              setOpenPopover(null);
              open ? setOpen(false) : openMenu();
            }}
          >
            <div className="flex flex-col items-end leading-tight max-w-[120px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[280px]">
              {isUserLoading ? (
                <>
                  <div className="h-3.5 w-40 rounded bg-slate-100" />
                  <div className="mt-1 h-3 w-24 rounded bg-slate-100" />
                </>
              ) : companyName ? (
                <>
                  <div className="text-sm font-semibold text-slate-900 truncate">{companyName}</div>
                  <div className="text-xs text-slate-500 truncate">{userName || "—"}</div>
                </>
              ) : (
                <div className="text-sm font-medium text-slate-900 truncate">{userName || user?.email || "—"}</div>
              )}
            </div>

            <div className="h-9 w-9 rounded-full border border-violet-100 bg-violet-50 overflow-hidden flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt={userName || "Profile"} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs font-semibold text-violet-700">{initials || "U"}</span>
              )}
            </div>

            <ChevronDown className="h-4 w-4 text-slate-500" />
          </button>

          {open ? (
            <div
              ref={menuRef}
              role="menu"
              className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
            >
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-xs text-slate-500">Signed in as</div>
                <div className="text-sm font-medium text-slate-900 truncate">{userName || user?.email || "—"}</div>
              </div>

              <button
                type="button"
                role="menuitem"
                data-topnav-menuitem
                className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 focus:outline-none"
                onClick={() => navigate("/account")}
              >
                Account / Profile
              </button>

              <button
                type="button"
                role="menuitem"
                data-topnav-menuitem
                className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 focus:outline-none"
                onClick={() => navigate("/settings")}
              >
                Company Settings
              </button>

              <div className="h-px bg-slate-100" />

              <button
                type="button"
                role="menuitem"
                data-topnav-menuitem
                className="w-full px-3 py-2 text-left text-sm text-red-700 hover:bg-slate-50 focus:outline-none"
                onClick={() => {
                  setOpen(false);
                  onLogout?.();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Receipt, Mail, ClipboardList } from "lucide-react";
import { api } from "../../lib/api";
import Money from "../common/money";
import { formatDateForDisplay } from "../../lib/dateFormat";
import { addDismissedInvoice, addDismissedTask, getDismissed } from "../../lib/notification-dismissed";

function formatDate(d) {
  if (!d) return "—";
  try {
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "—";
  }
}

export default function NotificationPanel({ open, onOpenChange, triggerRef }) {
  const navigate = useNavigate();
  const location = useLocation();
  const panelRef = useRef(null);
  const prevPathRef = useRef(location?.pathname);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [tasksData, setTasksData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const current = location?.pathname;
    if (prevPathRef.current !== current) {
      prevPathRef.current = current;
      onOpenChange?.(false);
    }
  }, [location?.pathname, onOpenChange]);

  useEffect(() => {
    if (!open) return;

    function onDocMouseDown(e) {
      const t = e.target;
      if (triggerRef?.current?.contains(t) || panelRef.current?.contains(t)) return;
      onOpenChange?.(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      api.notifications(),
      api.tasksDashboardSummary().catch(() => null),
    ])
      .then(([notif, tasks]) => {
        if (cancelled) return;
        setData(notif);
        setTasksData(tasks);
        setError(null);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e?.message || "Failed to load notifications");
        setData(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  const dismissed = getDismissed();
  const unpaid = (data?.overdueInvoices ?? []).filter((inv) => !dismissed.invoices.has(inv.id));
  const displayedTasks = [...(tasksData?.overdue?.items || []), ...(tasksData?.today?.items || [])].filter(
    (t) => !dismissed.tasks.has(t.id)
  );

  const overdue = unpaid.length;
  const emailPending = data?.emailOutbox?.pending ?? 0;
  const emailFailed = data?.emailOutbox?.failed ?? 0;
  const tasksDue = displayedTasks.length;
  const totalCount = overdue + emailPending + emailFailed + tasksDue;

  if (!open) return null;

  return (
    <div className="relative" ref={panelRef}>
      <div className="absolute right-0 mt-2 w-80 max-h-[420px] overflow-hidden rounded-xl border border-violet-200 bg-white shadow-lg flex flex-col">
        <div className="px-4 py-3 border-b border-slate-100 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-semibold text-slate-900">Notifications</span>
              {totalCount > 0 ? (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-violet-100 text-xs font-medium text-violet-700">
                  {totalCount}
                </span>
              ) : null}
            </div>
          </div>
          {typeof Notification !== "undefined" && Notification.permission === "default" ? (
            <button
              type="button"
              className="text-left text-xs text-slate-600 hover:text-violet-600"
              onClick={() => Notification.requestPermission()}
            >
              Enable system notifications
            </button>
          ) : null}
        </div>

        <div className="overflow-y-auto flex-1 max-h-[360px]">
          {loading ? (
            <div className="px-4 py-8 text-center text-sm text-slate-500">Loading…</div>
          ) : error ? (
            <div className="px-4 py-8 text-center text-sm text-red-600">{error}</div>
          ) : (
            <div className="py-2">
              {overdue > 0 ? (
                <div className="px-4 py-2">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Receipt className="h-3.5 w-3.5" />
                    Overdue invoices ({overdue})
                  </div>
                  <div className="space-y-1">
                    {unpaid.slice(0, 5).map((inv) => (
                      <button
                        key={inv.id}
                        type="button"
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-200"
                        onClick={() => {
                          addDismissedInvoice(inv.id);
                          onOpenChange?.(false);
                          navigate(`/invoices/${inv.id}`);
                        }}
                      >
                        <div className="text-sm font-medium text-slate-900 truncate">
                          {inv.invoiceNumber} — {inv.customerName}
                        </div>
                        <div className="text-xs text-slate-500">
                          Due {formatDate(inv.dueDate)} · <Money value={Number(inv.amountDue || 0)} className="text-slate-700" />
                        </div>
                      </button>
                    ))}
                  </div>
                  {unpaid.length > 5 ? (
                    <button
                      type="button"
                      className="mt-2 w-full text-center text-xs text-violet-600 hover:text-violet-700 font-medium"
                      onClick={() => {
                        onOpenChange?.(false);
                        navigate("/invoices?status=OVERDUE");
                      }}
                    >
                      View all {overdue} overdue
                    </button>
                  ) : null}
                </div>
              ) : null}

              {emailPending > 0 ? (
                <div className="px-4 py-2">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" />
                    Pending emails ({emailPending})
                  </div>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-200"
                    onClick={() => {
                      onOpenChange?.(false);
                      navigate("/automation");
                    }}
                  >
                    <div className="text-sm text-slate-700">{emailPending} email(s) queued for delivery</div>
                  </button>
                </div>
              ) : null}

              {emailFailed > 0 ? (
                <div className="px-4 py-2">
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#FFE3A6] bg-[#FFFBEB] text-[#8A5502] hover:bg-amber-100/80 focus:outline-none focus:ring-2 focus:ring-amber-200 transition-colors"
                    onClick={() => {
                      onOpenChange?.(false);
                      navigate("/automation");
                    }}
                  >
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">{emailFailed} failed</span>
                  </button>
                </div>
              ) : null}

              {displayedTasks.length > 0 ? (
                <div className="px-4 py-2">
                  <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ClipboardList className="h-3.5 w-3.5" />
                    Scheduled tasks ({displayedTasks.length} due)
                  </div>
                  <div className="space-y-1">
                    {displayedTasks.slice(0, 3).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-200"
                        onClick={() => {
                          addDismissedTask(t.id);
                          onOpenChange?.(false);
                          navigate(`/tasks?edit=${t.id}`);
                        }}
                      >
                          <div className="text-sm font-medium text-slate-900 truncate">{t.title}</div>
                          <div className="text-xs text-slate-500">
                            Due {formatDateForDisplay(t.dueDate)} · {t.priority}
                          </div>
                        </button>
                      ))}
                  </div>
                  <button
                    type="button"
                    className="mt-2 w-full text-center text-xs text-violet-600 hover:text-violet-700 font-medium"
                    onClick={() => {
                      onOpenChange?.(false);
                      navigate("/tasks");
                    }}
                  >
                    View all tasks
                  </button>
                </div>
              ) : null}

              {overdue === 0 && emailPending === 0 && emailFailed === 0 && displayedTasks.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-slate-500">No notifications</div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { NotificationPanel };

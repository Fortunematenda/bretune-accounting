import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Link } from "react-router-dom";
import { ChevronRight, ClipboardList } from "lucide-react";
import { formatDateForDisplay } from "../../lib/dateFormat";

function formatTaskDue(d) {
  if (!d) return "—";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "—";
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const taskDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (taskDay.getTime() < today.getTime()) return "Overdue";
  if (taskDay.getTime() === today.getTime()) return "Today";
  return formatDateForDisplay(d);
}

export default function TasksCard({ overdueInvoices, overdueBills, reconcileCount, scheduledTasks }) {
  const actionItems = [
    {
      label: "Items to reconcile",
      count: reconcileCount ?? 0,
      sub: "Bank reconciliation",
      to: "/bank-reconciliation",
    },
    {
      label: "Overdue invoices",
      count: overdueInvoices ?? 0,
      sub: "Invoices",
      to: "/invoices",
    },
    {
      label: "Overdue bills",
      count: overdueBills ?? 0,
      sub: "Bills",
      to: "/bills",
    },
  ];

  const overdueTaskItems = Array.isArray(scheduledTasks?.overdue?.items) ? scheduledTasks.overdue.items : [];
  const todayTaskItems = Array.isArray(scheduledTasks?.today?.items) ? scheduledTasks.today.items : [];
  const upcomingTaskItems = Array.isArray(scheduledTasks?.upcoming?.items) ? scheduledTasks.upcoming.items : [];

  const allScheduledTasks = [...overdueTaskItems, ...todayTaskItems, ...upcomingTaskItems].slice(0, 5);

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Tasks</CardTitle>
          <Link
            to="/tasks"
            className="text-xs font-medium text-violet-600 hover:text-violet-700"
          >
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {actionItems.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="flex items-center justify-between py-3 border-b border-slate-100 hover:bg-slate-50/50 -mx-1 px-2 rounded transition-colors"
            >
              <div>
                <div className="text-sm font-medium text-slate-900">{t.count} {t.label}</div>
                <div className="text-xs text-slate-500">{t.sub}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
          ))}
        </div>

        {allScheduledTasks.length > 0 ? (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="h-4 w-4 text-slate-500" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Scheduled tasks</span>
            </div>
            <div className="space-y-1.5">
              {allScheduledTasks.map((task) => (
                <Link
                  key={task.id}
                  to={`/tasks?edit=${task.id}`}
                  className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-violet-50/50 transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-900 truncate group-hover:text-violet-700">{task.title}</div>
                    <div className="text-xs text-slate-500">{formatTaskDue(task.dueDate)} · {task.priority}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

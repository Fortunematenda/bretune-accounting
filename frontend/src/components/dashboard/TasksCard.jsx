import React from "react";
import { Card, CardContent } from "../ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ChevronRight, ClipboardList, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";
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

const PRIORITY_DOT = {
  high: "bg-rose-400",
  medium: "bg-amber-400",
  low: "bg-slate-300",
};

export default function TasksCard({ overdueInvoices, overdueBills, reconcileCount, scheduledTasks }) {
  const actionItems = [
    {
      label: "Items to reconcile",
      count: reconcileCount ?? 0,
      sub: "Bank reconciliation",
      to: "/bank-reconciliation",
      color: "text-blue-600 bg-blue-500/10",
    },
    {
      label: "Overdue invoices",
      count: overdueInvoices ?? 0,
      sub: "Invoices",
      to: "/invoices",
      color: "text-amber-600 bg-amber-500/10",
    },
    {
      label: "Overdue bills",
      count: overdueBills ?? 0,
      sub: "Bills",
      to: "/bills",
      color: "text-rose-600 bg-rose-500/10",
    },
  ];

  const overdueTaskItems = Array.isArray(scheduledTasks?.overdue?.items) ? scheduledTasks.overdue.items : [];
  const todayTaskItems = Array.isArray(scheduledTasks?.today?.items) ? scheduledTasks.today.items : [];
  const upcomingTaskItems = Array.isArray(scheduledTasks?.upcoming?.items) ? scheduledTasks.upcoming.items : [];

  const allScheduledTasks = [...overdueTaskItems, ...todayTaskItems, ...upcomingTaskItems].slice(0, 5);

  return (
    <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-sm">
      <div className="p-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-500/20">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" strokeWidth={1.8} />
          </div>
          <span className="text-[13px] font-semibold text-slate-800">Action items</span>
        </div>
        <Link to="/tasks" className="inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 font-semibold transition-colors">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {actionItems.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="flex items-center justify-between py-2.5 px-3 -mx-1 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className={cn("h-8 min-w-[32px] rounded-lg flex items-center justify-center text-sm font-bold", t.color)}>
                  {t.count}
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-800 group-hover:text-slate-900">{t.label}</div>
                  <div className="text-[11px] text-slate-400">{t.sub}</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </Link>
          ))}
        </div>

        {allScheduledTasks.length > 0 ? (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Scheduled</span>
            </div>
            <div className="space-y-1">
              {allScheduledTasks.map((task) => {
                const dueLabel = formatTaskDue(task.dueDate);
                const isOverdue = dueLabel === "Overdue";
                return (
                  <Link
                    key={task.id}
                    to={`/tasks?edit=${task.id}`}
                    className="flex items-center justify-between py-2 px-3 -mx-1 rounded-xl hover:bg-violet-50/50 transition-all duration-200 group"
                  >
                    <div className="min-w-0 flex-1 flex items-center gap-2.5">
                      <div className={cn("h-2 w-2 rounded-full shrink-0", PRIORITY_DOT[task.priority] || "bg-slate-300")} />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-800 truncate group-hover:text-violet-700 transition-colors">{task.title}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {isOverdue ? <AlertCircle className="h-3 w-3 text-rose-500" /> : null}
                          <span className={cn("text-[11px] font-medium", isOverdue ? "text-rose-500" : "text-slate-400")}>{dueLabel}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 shrink-0 ml-2 group-hover:text-violet-500 transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

function startOfMonth(d) {
  const dt = new Date(d);
  dt.setDate(1);
  dt.setHours(0, 0, 0, 0);
  return dt;
}

function endOfMonth(d) {
  const dt = new Date(d);
  dt.setMonth(dt.getMonth() + 1);
  dt.setDate(0);
  dt.setHours(23, 59, 59, 999);
  return dt;
}

function formatDayLabel(d) {
  const dt = new Date(d);
  return dt.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "2-digit" });
}

function dateKey(d) {
  const dt = new Date(d);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function SchedulerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const monthParam = searchParams.get("month");
  const baseMonth = useMemo(() => {
    if (!monthParam) return new Date();
    const dt = new Date(`${monthParam}-01T00:00:00`);
    return Number.isNaN(dt.getTime()) ? new Date() : dt;
  }, [monthParam]);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const start = useMemo(() => startOfMonth(baseMonth), [baseMonth]);
  const end = useMemo(() => endOfMonth(baseMonth), [baseMonth]);

  const monthLabel = useMemo(() => {
    return baseMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  }, [baseMonth]);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);

    api
      .tasksCalendar({ start: start.toISOString(), end: end.toISOString() })
      .then((r) => setData(r))
      .catch((e) => setError(e.message || "Failed to load calendar"))
      .finally(() => setLoading(false));
  }, [start, end]);

  useEffect(() => {
    load();
  }, [load]);

  function setMonth(dt) {
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const next = new URLSearchParams(searchParams);
    next.set("month", `${yyyy}-${mm}`);
    setSearchParams(next, { replace: true });
  }

  const grouped = useMemo(() => {
    const items = data?.data || [];
    const map = new Map();

    for (const t of items) {
      const key = dateKey(t.dueDate);
      const list = map.get(key) || [];
      list.push(t);
      map.set(key, list);
    }

    const keys = Array.from(map.keys()).sort((a, b) => (a < b ? -1 : 1));
    return keys.map((k) => ({
      key: k,
      label: formatDayLabel(k),
      items: map.get(k) || [],
    }));
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Scheduler</h1>
              <p className="mt-1 text-sm text-slate-500">View tasks by date and upcoming workload.</p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-9"
                onClick={() => {
                  const prev = new Date(baseMonth);
                  prev.setMonth(prev.getMonth() - 1);
                  setMonth(prev);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 h-9">
                <CalendarDays className="h-4 w-4 text-slate-500" />
                <div className="text-sm font-medium text-slate-700">{monthLabel}</div>
              </div>
              <Button
                variant="outline"
                className="h-9"
                onClick={() => {
                  const next = new Date(baseMonth);
                  next.setMonth(next.getMonth() + 1);
                  setMonth(next);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {error ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="py-12 text-center text-sm text-slate-500">Loading…</div>
          ) : grouped.length === 0 ? (
            <div className="py-12 text-center">
              <div className="inline-flex flex-col items-center gap-3">
                <div className="rounded-full bg-slate-100 p-4">
                  <CalendarDays className="h-8 w-8 text-slate-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-700">No scheduled tasks</div>
                  <div className="text-sm text-slate-500">Tasks with due dates will appear here.</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {grouped.map((g) => (
                <div key={g.key} className="rounded-xl border border-slate-200 bg-white">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="text-sm font-semibold text-slate-900">{g.label}</div>
                    <div className="text-xs text-slate-500">{g.items.length} task(s)</div>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {g.items.map((t) => {
                      const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && (t.status === "PENDING" || t.status === "IN_PROGRESS");
                      const tone =
                        t.priority === "CRITICAL" ? "bg-red-100 text-red-800" :
                        t.priority === "HIGH" ? "bg-amber-100 text-amber-800" :
                        t.priority === "MEDIUM" ? "bg-violet-100 text-violet-800" :
                        "bg-slate-100 text-slate-700";

                      return (
                        <div
                          key={t.id}
                          className="px-4 py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50"
                          onClick={() => navigate(`/tasks?edit=${t.id}`)}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-slate-900 truncate">{t.title}</div>
                              {isOverdue ? (
                                <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                                  Overdue
                                </span>
                              ) : null}
                            </div>
                            <div className="mt-0.5 text-xs text-slate-500 truncate">
                              {t.status} • {t.type}
                            </div>
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${tone}`}>
                              {t.priority}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

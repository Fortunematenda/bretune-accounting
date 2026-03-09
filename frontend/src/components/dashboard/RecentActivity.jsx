import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Bell, Mail, Receipt, CreditCard } from "lucide-react";
import { cn } from "../../lib/utils";
import Button from "../ui/button";

function iconFor(type) {
  if (type === "INVOICE_SENT") return Receipt;
  if (type === "PAYMENT_RECEIVED" || type === "PAYMENT_APPLIED") return CreditCard;
  if (type === "STATEMENT_EMAILED") return Mail;
  return Bell;
}

function formatWhen(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return d.toISOString();
  }
}

export default function RecentActivity({ items }) {
  const rows = Array.isArray(items) ? items : [];

  const collapsedCount = 4;
  const pageSize = 6;
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(0);

  const recent = useMemo(() => rows.slice(0, collapsedCount), [rows]);
  const older = useMemo(() => rows.slice(collapsedCount), [rows]);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(older.length / pageSize)), [older.length]);

  const olderPage = useMemo(() => {
    const p = Math.min(Math.max(0, page), Math.max(0, totalPages - 1));
    const start = p * pageSize;
    return older.slice(start, start + pageSize);
  }, [older, page, pageSize, totalPages]);

  function toggleExpanded() {
    setExpanded((v) => {
      const next = !v;
      if (next) setPage(0);
      return next;
    });
  }

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="text-sm text-slate-600">No recent activity.</div>
        ) : (
          <div className="space-y-3">
            <div className="divide-y divide-slate-100">
              {recent.map((a, idx) => {
                const Icon = iconFor(a.type);
                return (
                  <div key={`${a.type}-${a.timestamp}-${idx}`} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="h-9 w-9 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-violet-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-900 truncate">{a.description}</div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                        <span className="truncate">{a.clientName}</span>
                        <span className={cn("hidden sm:inline", "text-slate-300")}>•</span>
                        <span>{formatWhen(a.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {older.length > 0 ? (
              <div className="pt-1">
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={toggleExpanded}>
                    {expanded ? "Show less" : `Show more (${older.length})`}
                  </Button>
                  {expanded ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page <= 0}
                      >
                        Prev
                      </Button>
                      <div className="text-xs text-slate-500">
                        Page {Math.min(page, totalPages - 1) + 1} / {totalPages}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                      >
                        Next
                      </Button>
                    </div>
                  ) : null}
                </div>

                {expanded ? (
                  <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50/40">
                    {olderPage.length === 0 ? (
                      <div className="p-3 text-sm text-slate-600">No more activity.</div>
                    ) : (
                      <div className="divide-y divide-slate-200">
                        {olderPage.map((a, idx) => {
                          const Icon = iconFor(a.type);
                          return (
                            <div key={`${a.type}-${a.timestamp}-${idx}`} className="flex items-start gap-3 p-3">
                              <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                                <Icon className="h-4 w-4 text-slate-700" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-slate-900 truncate">{a.description}</div>
                                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                                  <span className="truncate">{a.clientName}</span>
                                  <span className={cn("hidden sm:inline", "text-slate-300")}>•</span>
                                  <span>{formatWhen(a.timestamp)}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

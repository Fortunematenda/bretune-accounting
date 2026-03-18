import React, { useMemo, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Activity, Bell, Mail, Receipt, CreditCard, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../lib/utils";
import Button from "../ui/button";

const TYPE_CONFIG = {
  INVOICE_SENT: { icon: Receipt, bg: "bg-violet-500/10", text: "text-violet-600", ring: "ring-violet-500/20" },
  PAYMENT_RECEIVED: { icon: CreditCard, bg: "bg-emerald-500/10", text: "text-emerald-600", ring: "ring-emerald-500/20" },
  PAYMENT_APPLIED: { icon: CreditCard, bg: "bg-emerald-500/10", text: "text-emerald-600", ring: "ring-emerald-500/20" },
  STATEMENT_EMAILED: { icon: Mail, bg: "bg-blue-500/10", text: "text-blue-600", ring: "ring-blue-500/20" },
};
const DEFAULT_TYPE = { icon: Bell, bg: "bg-slate-500/10", text: "text-slate-600", ring: "ring-slate-500/20" };

function formatWhen(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  try {
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "2-digit" }).format(d);
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

  function renderRow(a, idx, isOlder) {
    const cfg = TYPE_CONFIG[a.type] || DEFAULT_TYPE;
    const Icon = cfg.icon;
    return (
      <div key={`${a.type}-${a.timestamp}-${idx}-${isOlder ? "o" : "r"}`} className="flex items-start gap-3 group">
        <div className="flex flex-col items-center">
          <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ring-1 transition-transform duration-200 group-hover:scale-105", cfg.bg, cfg.ring)}>
            <Icon className={cn("h-3.5 w-3.5", cfg.text)} strokeWidth={1.8} />
          </div>
          {idx < (isOlder ? olderPage.length : recent.length) - 1 ? (
            <div className="w-px h-6 bg-slate-200/60 mt-1" />
          ) : null}
        </div>
        <div className="min-w-0 flex-1 pb-4">
          <div className="text-sm font-medium text-slate-800 truncate">{a.description}</div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400">
            <span className="truncate font-medium">{a.clientName}</span>
            <span className="text-slate-200">·</span>
            <span>{formatWhen(a.timestamp)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-sm">
      <div className="p-5 pb-3 flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-xl bg-violet-500/10 flex items-center justify-center ring-1 ring-violet-500/20">
          <Activity className="h-4 w-4 text-violet-600" strokeWidth={1.8} />
        </div>
        <span className="text-[13px] font-semibold text-slate-800">Recent Activity</span>
      </div>
      <CardContent className="pt-0">
        {rows.length === 0 ? (
          <div className="py-8 text-center">
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Activity className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">No recent activity.</p>
          </div>
        ) : (
          <div>
            <div className="space-y-0">
              {recent.map((a, idx) => renderRow(a, idx, false))}
            </div>

            {older.length > 0 ? (
              <div className="pt-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                  onClick={toggleExpanded}
                >
                  {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  {expanded ? "Show less" : `Show ${older.length} more`}
                </button>

                {expanded ? (
                  <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                    {olderPage.length === 0 ? (
                      <div className="text-sm text-slate-500">No more activity.</div>
                    ) : (
                      <div className="space-y-0">
                        {olderPage.map((a, idx) => renderRow(a, idx, true))}
                      </div>
                    )}
                    {totalPages > 1 ? (
                      <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-100 mt-2">
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page <= 0}>
                          Prev
                        </Button>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {Math.min(page, totalPages - 1) + 1} / {totalPages}
                        </span>
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                          Next
                        </Button>
                      </div>
                    ) : null}
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

import React, { useMemo } from "react";
import { Card, CardContent } from "../ui/card";
import Money from "../common/money";
import { Clock } from "lucide-react";
import { cn } from "../../lib/utils";

const BUCKET_CONFIG = [
  { key: "bucket_0_30", label: "0–30 days", color: "emerald", gradient: "from-emerald-500/10 to-emerald-500/[0.02]", accent: "bg-emerald-500", dot: "bg-emerald-400" },
  { key: "bucket_31_60", label: "31–60 days", color: "amber", gradient: "from-amber-500/10 to-amber-500/[0.02]", accent: "bg-amber-500", dot: "bg-amber-400" },
  { key: "bucket_61_90", label: "61–90 days", color: "orange", gradient: "from-orange-500/10 to-orange-500/[0.02]", accent: "bg-orange-500", dot: "bg-orange-400" },
  { key: "bucket_90_plus", label: "90+ days", color: "rose", gradient: "from-rose-500/10 to-rose-500/[0.02]", accent: "bg-rose-500", dot: "bg-rose-400" },
];

export default function AgingSummary({ buckets }) {
  const b = buckets || {};

  const total = useMemo(() => {
    return BUCKET_CONFIG.reduce((acc, c) => acc + Number(b[c.key] || 0), 0);
  }, [b]);

  return (
    <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-sm">
      <div className="p-5 pb-3 flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-xl bg-slate-500/10 flex items-center justify-center ring-1 ring-slate-500/20">
          <Clock className="h-4 w-4 text-slate-600" strokeWidth={1.8} />
        </div>
        <div>
          <span className="text-[13px] font-semibold text-slate-800 block">AR Aging Buckets</span>
          <span className="text-[11px] text-slate-400">Receivables by days past due</span>
        </div>
      </div>
      <CardContent className="pt-0">
        {total > 0 ? (
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100/80 mb-4">
            {BUCKET_CONFIG.map((c) => {
              const val = Number(b[c.key] || 0);
              const pct = total > 0 ? (val / total) * 100 : 0;
              if (pct <= 0) return null;
              return (
                <div
                  key={c.key}
                  className={cn("h-full first:rounded-l-full last:rounded-r-full transition-all duration-500", c.accent)}
                  style={{ width: `${pct}%` }}
                  title={`${c.label}: ${Math.round(pct)}%`}
                />
              );
            })}
          </div>
        ) : null}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BUCKET_CONFIG.map((c) => (
            <div
              key={c.key}
              className={cn("relative overflow-hidden rounded-xl p-4 bg-gradient-to-br border border-slate-100", c.gradient)}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <div className={cn("h-2 w-2 rounded-full", c.dot)} />
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{c.label}</div>
              </div>
              <div className="text-lg font-bold tracking-tight text-slate-900 animate-count-up">
                <Money value={b[c.key] || 0} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import React from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils";

function trendText(trend) {
  if (!trend) return null;
  const dir = String(trend.direction || "flat");
  const pct = Number(trend.percent || 0);
  if (dir === "flat" || pct === 0) return { label: "0%", tone: "muted", arrow: "" };
  return {
    label: `${pct}%`,
    tone: dir === "up" ? "up" : "down",
    arrow: dir === "up" ? "↑" : "↓",
  };
}

const TONE_STYLES = {
  violet: "border-l-violet-600 bg-white",
  amber: "border-l-amber-500 bg-white",
  emerald: "border-l-emerald-500 bg-white",
  blue: "border-l-violet-600 bg-white",
};

const ICON_BG = {
  violet: "bg-violet-100 text-violet-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-sky-50 text-sky-600",
};

export default function KpiCard({ title, value, label, trend, icon: Icon, tone = "violet" }) {
  const t = trendText(trend);
  const borderStyle = TONE_STYLES[tone] || TONE_STYLES.violet;
  const iconStyle = ICON_BG[tone] || ICON_BG.violet;

  return (
    <Card className={cn(
      "border border-slate-200 border-l-4 shadow-sm overflow-hidden",
      borderStyle,
      "hover:shadow-md transition-shadow duration-200"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="text-xs font-medium uppercase tracking-wide truncate text-slate-500">
                {title}
              </div>
              {t ? (
                <div
                  className={cn(
                    "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium",
                    t.tone === "muted" && "bg-slate-100 text-slate-500",
                    t.tone === "up" && "bg-emerald-100 text-emerald-700",
                    t.tone === "down" && "bg-red-50 text-red-600"
                  )}
                  aria-label="Month over month trend"
                >
                  {t.arrow} {t.label}
                </div>
              ) : null}
            </div>

            <div className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
              {value}
            </div>

            <div className="mt-1 text-xs text-slate-500">
              {label}
            </div>
          </div>

          {Icon ? (
            <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", iconStyle)}>
              <Icon className="h-5 w-5" />
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

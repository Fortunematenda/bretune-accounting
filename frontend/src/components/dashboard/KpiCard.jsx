import React from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
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

const TONE_CONFIG = {
  violet: {
    gradient: "from-violet-500/[0.08] via-violet-500/[0.03] to-transparent",
    iconBg: "bg-violet-500/10",
    iconText: "text-violet-600",
    accent: "bg-violet-500",
    ring: "ring-violet-500/20",
  },
  amber: {
    gradient: "from-amber-500/[0.08] via-amber-500/[0.03] to-transparent",
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-600",
    accent: "bg-amber-500",
    ring: "ring-amber-500/20",
  },
  emerald: {
    gradient: "from-emerald-500/[0.08] via-emerald-500/[0.03] to-transparent",
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-600",
    accent: "bg-emerald-500",
    ring: "ring-emerald-500/20",
  },
  blue: {
    gradient: "from-blue-500/[0.08] via-blue-500/[0.03] to-transparent",
    iconBg: "bg-blue-500/10",
    iconText: "text-blue-600",
    accent: "bg-blue-500",
    ring: "ring-blue-500/20",
  },
};

const SPARKLINE_COLORS = {
  violet: "#8b5cf6",
  amber: "#f59e0b",
  emerald: "#10b981",
  blue: "#3b82f6",
  rose: "#f43f5e",
};

export default function KpiCard({ title, value, label, trend, icon: Icon, tone = "violet", sparklineData }) {
  const t = trendText(trend);
  const cfg = TONE_CONFIG[tone] || TONE_CONFIG.violet;
  const sparkColor = SPARKLINE_COLORS[tone] || SPARKLINE_COLORS.violet;
  const sparkPoints = Array.isArray(sparklineData) && sparklineData.length > 1 ? sparklineData : null;

  return (
    <div className={cn(
      "card-glow group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 ease-out",
      "hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
    )}>
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-100", cfg.gradient)} />
      <div className="absolute top-0 left-0 right-0 h-[2px]">
        <div className={cn("h-full w-full", cfg.accent, "opacity-60")} />
      </div>

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {title}
            </div>

            <div className="mt-3 text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-none animate-count-up">
              {value}
            </div>

            <div className="mt-3 flex items-center gap-2">
              {t ? (
                <div
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    t.tone === "muted" && "bg-slate-100 text-slate-500",
                    t.tone === "up" && "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20",
                    t.tone === "down" && "bg-red-50 text-red-600 ring-1 ring-red-500/20"
                  )}
                  aria-label="Month over month trend"
                >
                  <span>{t.arrow}</span>
                  <span>{t.label}</span>
                </div>
              ) : null}
              <span className="text-[11px] text-slate-400 truncate">{label}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            {Icon ? (
              <div className={cn(
                "h-11 w-11 rounded-xl flex items-center justify-center ring-1 transition-transform duration-300 group-hover:scale-105",
                cfg.iconBg, cfg.iconText, cfg.ring
              )}>
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </div>
            ) : null}
            {sparkPoints ? (
              <div className="w-20 h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparkPoints} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`spark-${tone}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={sparkColor} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={sparkColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke={sparkColor}
                      strokeWidth={1.5}
                      fill={`url(#spark-${tone})`}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

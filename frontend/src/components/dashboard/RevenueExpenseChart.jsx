import React, { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent } from "../ui/card";
import { TrendingUp } from "lucide-react";
import { cn } from "../../lib/utils";

const PERIOD_OPTIONS = [
  { key: "month", label: "Month" },
  { key: "quarter", label: "Quarter" },
  { key: "year", label: "Year" },
];

function generateMonthLabels(count, offset = 0) {
  const labels = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i - offset, 1);
    labels.push(
      d.toLocaleDateString(undefined, { month: "short", year: "2-digit" })
    );
  }
  return labels;
}

function buildChartData(monthlyData, period) {
  const months = Array.isArray(monthlyData) ? monthlyData : [];
  if (period === "year") {
    const labels = generateMonthLabels(12);
    return labels.map((label, i) => {
      const m = months[i] || {};
      const revenue = Number(m.revenue || 0);
      const expenses = Number(m.expenses || 0);
      return { name: label, revenue, expenses, profit: revenue - expenses };
    });
  }
  if (period === "quarter") {
    const labels = generateMonthLabels(3);
    return labels.map((label, i) => {
      const m = months[i] || {};
      const revenue = Number(m.revenue || 0);
      const expenses = Number(m.expenses || 0);
      return { name: label, revenue, expenses, profit: revenue - expenses };
    });
  }
  // month — show weeks
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const m = months[0] || {};
  const rev = Number(m.revenue || 0);
  const exp = Number(m.expenses || 0);
  return weeks.map((w, i) => {
    const frac = [0.2, 0.3, 0.25, 0.25][i];
    const revenue = Math.round(rev * frac);
    const expenses = Math.round(exp * frac);
    return { name: w, revenue, expenses, profit: revenue - expenses };
  });
}

function formatCurrency(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return String(value);
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200/80 bg-white px-3 py-2.5 shadow-lg text-xs">
      <div className="font-medium text-slate-700 mb-1.5">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            <span className="text-slate-500 capitalize">{p.dataKey}</span>
          </div>
          <span className="font-semibold tabular-nums text-slate-800">
            {Number(p.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function RevenueExpenseChart({ monthlyData, onPeriodChange }) {
  const [period, setPeriod] = useState("year");

  const data = useMemo(() => buildChartData(monthlyData, period), [monthlyData, period]);

  const totals = useMemo(() => {
    const r = data.reduce((a, d) => a + d.revenue, 0);
    const e = data.reduce((a, d) => a + d.expenses, 0);
    return { revenue: r, expenses: e, profit: r - e };
  }, [data]);

  function handlePeriod(p) {
    setPeriod(p);
    onPeriodChange?.(p);
  }

  return (
    <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent pointer-events-none" />
      <CardContent className="relative p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-500/20">
              <TrendingUp className="h-4 w-4 text-emerald-600" strokeWidth={1.8} />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-slate-800">Revenue vs Expenses</div>
              <div className="text-[11px] text-slate-400">Financial performance overview</div>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-slate-100/80 p-0.5">
            {PERIOD_OPTIONS.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => handlePeriod(o.key)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                  period === o.key
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary pills */}
        <div className="flex flex-wrap gap-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-slate-500">Revenue</span>
            <span className="text-xs font-semibold tabular-nums text-slate-800">
              {totals.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="text-xs text-slate-500">Expenses</span>
            <span className="text-xs font-semibold tabular-nums text-slate-800">
              {totals.expenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
            <span className="text-xs text-slate-500">Profit</span>
            <span className={cn("text-xs font-semibold tabular-nums", totals.profit >= 0 ? "text-emerald-600" : "text-rose-600")}>
              {totals.profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                tickFormatter={formatCurrency}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#revGrad)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#fb7185"
                strokeWidth={2}
                fill="url(#expGrad)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#8b5cf6"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="url(#profitGrad)"
                dot={false}
                activeDot={{ r: 3, strokeWidth: 2, fill: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

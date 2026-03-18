import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Line,
  ComposedChart,
} from "recharts";
import { Card, CardContent } from "../ui/card";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { cn } from "../../lib/utils";

function formatCurrency(value) {
  if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return String(value);
}

function generateMonthLabels(count) {
  const labels = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(
      d.toLocaleDateString(undefined, { month: "short" })
    );
  }
  return labels;
}

function buildCashFlowData(cashFlowData, showProjected) {
  const data = Array.isArray(cashFlowData) ? cashFlowData : [];
  const labels = generateMonthLabels(6);

  const rows = labels.map((label, i) => {
    const m = data[i] || {};
    const cashIn = Number(m.cashIn || 0);
    const cashOut = Number(m.cashOut || 0);
    return {
      name: label,
      cashIn,
      cashOut: -Math.abs(cashOut),
      net: cashIn - Math.abs(cashOut),
      projected: null,
    };
  });

  if (showProjected) {
    const now = new Date();
    const projectedLabels = [];
    for (let i = 1; i <= 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      projectedLabels.push(d.toLocaleDateString(undefined, { month: "short" }));
    }

    const lastNet = rows.length > 0 ? rows[rows.length - 1].net : 0;
    const avgIn = rows.reduce((a, r) => a + r.cashIn, 0) / Math.max(rows.length, 1);
    const avgOut = rows.reduce((a, r) => a + Math.abs(r.cashOut), 0) / Math.max(rows.length, 1);

    projectedLabels.forEach((label, i) => {
      const decay = 1 - i * 0.05;
      const projIn = Math.round(avgIn * decay);
      const projOut = -Math.round(avgOut * decay);
      rows.push({
        name: label,
        cashIn: null,
        cashOut: null,
        net: null,
        projected: projIn + projOut,
        projectedIn: projIn,
        projectedOut: projOut,
        isProjected: true,
      });
    });
  }

  return rows;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  const isProjected = row?.isProjected;
  return (
    <div className="rounded-lg border border-slate-200/80 bg-white px-3 py-2.5 shadow-lg text-xs">
      <div className="font-medium text-slate-700 mb-1.5">
        {label} {isProjected ? "(Projected)" : ""}
      </div>
      {isProjected ? (
        <>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Est. In</span>
            <span className="font-semibold tabular-nums text-emerald-600">
              {Number(row.projectedIn || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500">Est. Out</span>
            <span className="font-semibold tabular-nums text-rose-600">
              {Number(Math.abs(row.projectedOut || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between gap-4 border-t border-slate-100 pt-1 mt-1">
            <span className="text-slate-500">Est. Net</span>
            <span className={cn("font-semibold tabular-nums", row.projected >= 0 ? "text-emerald-600" : "text-rose-600")}>
              {Number(row.projected || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </>
      ) : (
        payload.filter((p) => p.value != null).map((p) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full" style={{ background: p.color }} />
              <span className="text-slate-500 capitalize">
                {p.dataKey === "cashIn" ? "Cash In" : p.dataKey === "cashOut" ? "Cash Out" : "Net"}
              </span>
            </div>
            <span className="font-semibold tabular-nums text-slate-800">
              {Math.abs(Number(p.value)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default function CashFlowChart({ cashFlowData }) {
  const [showProjected, setShowProjected] = useState(true);

  const data = useMemo(
    () => buildCashFlowData(cashFlowData, showProjected),
    [cashFlowData, showProjected]
  );

  const totals = useMemo(() => {
    const actual = data.filter((d) => !d.isProjected);
    const totalIn = actual.reduce((a, d) => a + (d.cashIn || 0), 0);
    const totalOut = actual.reduce((a, d) => a + Math.abs(d.cashOut || 0), 0);
    return { totalIn, totalOut, net: totalIn - totalOut };
  }, [data]);

  return (
    <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.03] to-transparent pointer-events-none" />
      <CardContent className="relative p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center ring-1 ring-blue-500/20">
              <Wallet className="h-4 w-4 text-blue-600" strokeWidth={1.8} />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-slate-800">Cash Flow</div>
              <div className="text-[11px] text-slate-400">6 months + projections</div>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs text-slate-500">Show projected</span>
            <input
              type="checkbox"
              checked={showProjected}
              onChange={(e) => setShowProjected(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
            />
          </label>
        </div>

        {/* Summary pills */}
        <div className="flex flex-wrap gap-4 mb-5">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs text-slate-500">Cash In</span>
            <span className="text-xs font-semibold tabular-nums text-emerald-600">
              {totals.totalIn.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowDownRight className="h-3.5 w-3.5 text-rose-400" />
            <span className="text-xs text-slate-500">Cash Out</span>
            <span className="text-xs font-semibold tabular-nums text-rose-600">
              {totals.totalOut.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-xs text-slate-500">Net</span>
            <span className={cn("text-xs font-semibold tabular-nums", totals.net >= 0 ? "text-emerald-600" : "text-rose-600")}>
              {totals.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
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
              <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />
              <Bar dataKey="cashIn" fill="#34d399" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="cashOut" fill="#fb7185" radius={[0, 0, 4, 4]} barSize={20} />
              {showProjected && (
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff" }}
                  connectNulls={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

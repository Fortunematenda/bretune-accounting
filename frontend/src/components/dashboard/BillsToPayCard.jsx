import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Money from "../common/money";
import { ArrowRight, FileText, Plus } from "lucide-react";
import Button from "../ui/button";

const BAR_LABELS = ["Overdue", "This week", "Next 7d", "Later"];
const BAR_COLORS = ["bg-rose-400", "bg-amber-400", "bg-blue-400", "bg-slate-300"];

function bucketBillsByDate(upcomingBills, overdueAmount, now) {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const week1End = new Date(today);
  week1End.setDate(week1End.getDate() + 7);
  const week2End = new Date(today);
  week2End.setDate(week2End.getDate() + 14);
  const week3End = new Date(today);
  week3End.setDate(week3End.getDate() + 21);

  const buckets = {
    older: Number(overdueAmount || 0),
    week1: 0,
    week2: 0,
    week3: 0,
  };
  for (const b of upcomingBills || []) {
    const d = new Date(b.dueDate);
    d.setHours(0, 0, 0, 0);
    const bal = Number(b.balanceDue || 0);
    if (d < week1End) buckets.week1 += bal;
    else if (d < week2End) buckets.week2 += bal;
    else buckets.week3 += bal;
  }
  return buckets;
}

export default function BillsToPayCard({ bills, overdueAmount, overdueCount, onAddBill }) {
  const totalCount = (bills?.length || 0) + (overdueCount || 0);
  const now = useMemo(() => new Date(), []);
  const bucketed = useMemo(() => bucketBillsByDate(bills, overdueAmount, now), [bills, overdueAmount]);
  const barData = [bucketed.older, bucketed.week1, bucketed.week2, bucketed.week3];
  const maxBar = Math.max(...barData, 1);
  const totalOwed = barData.reduce((a, b) => a + b, 0);

  return (
    <div className="card-glow group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.04] to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 opacity-60" />

      <div className="relative p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center ring-1 ring-amber-500/20">
              <FileText className="h-4 w-4 text-amber-600" strokeWidth={1.8} />
            </div>
            <span className="text-[13px] font-semibold text-slate-800">Bills to pay</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-lg font-bold tracking-tight text-slate-900 animate-count-up">
              <Money value={totalOwed} />
            </div>
            <div className="mt-0.5 text-[11px] text-slate-400 font-medium">{totalCount} awaiting payment</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold tracking-tight text-rose-600 animate-count-up">
              <Money value={overdueAmount || 0} />
            </div>
            <div className="mt-0.5 text-[11px] text-rose-500/80 font-medium">{overdueCount ?? 0} overdue</div>
          </div>
        </div>

        {maxBar > 0 ? (
          <div className="space-y-2">
            <div className="flex gap-1.5 h-10 items-end">
              {barData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1" title={`${BAR_LABELS[i]}: ${v}`}>
                  <div className="w-full rounded-lg bg-slate-100/80 h-10 flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-lg ${BAR_COLORS[i]} transition-all duration-500 ease-out`}
                      style={{ height: `${Math.max(8, (v / maxBar) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between px-0.5">
              {BAR_LABELS.map((l) => (
                <span key={l} className="text-[10px] text-slate-400 font-medium">{l}</span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between pt-1">
          <Button size="sm" className="h-8 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium shadow-sm shadow-violet-600/20" onClick={onAddBill}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add bill
          </Button>
          <Link to="/bills" className="inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 font-semibold transition-colors">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

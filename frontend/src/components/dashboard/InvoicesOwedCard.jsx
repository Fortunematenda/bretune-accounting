import React from "react";
import { Link } from "react-router-dom";
import Money from "../common/money";
import { ArrowRight, Plus, Receipt } from "lucide-react";
import Button from "../ui/button";

const BAR_LABELS = ["0–30", "31–60", "61–90", "90+"];
const BAR_COLORS = ["bg-emerald-400", "bg-amber-400", "bg-orange-400", "bg-rose-400"];

export default function InvoicesOwedCard({
  totalOwed,
  overdueAmount,
  totalCount,
  overdueCount,
  agingBuckets,
  onNewInvoice,
}) {
  const b0 = Number(agingBuckets?.bucket_0_30 || 0);
  const b1 = Number(agingBuckets?.bucket_31_60 || 0);
  const b2 = Number(agingBuckets?.bucket_61_90 || 0);
  const b3 = Number(agingBuckets?.bucket_90_plus || 0);
  const barData = [b0, b1, b2, b3];
  const maxBar = Math.max(...barData, 1);

  return (
    <div className="card-glow group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.04] to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-violet-400 to-violet-300 opacity-60" />

      <div className="relative p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-violet-500/10 flex items-center justify-center ring-1 ring-violet-500/20">
              <Receipt className="h-4 w-4 text-violet-600" strokeWidth={1.8} />
            </div>
            <span className="text-[13px] font-semibold text-slate-800">Invoices owed to you</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-lg font-bold tracking-tight text-slate-900 animate-count-up">
              <Money value={totalOwed || 0} />
            </div>
            <div className="mt-0.5 text-[11px] text-slate-400 font-medium">{totalCount ?? 0} awaiting payment</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold tracking-tight text-amber-600 animate-count-up">
              <Money value={overdueAmount || 0} />
            </div>
            <div className="mt-0.5 text-[11px] text-amber-500/80 font-medium">{overdueCount ?? 0} overdue</div>
          </div>
        </div>

        {maxBar > 0 ? (
          <div className="space-y-2">
            <div className="flex gap-1.5 h-10 items-end">
              {barData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1" title={`${BAR_LABELS[i]} days: ${v}`}>
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
          <Button size="sm" className="h-8 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium shadow-sm shadow-violet-600/20" onClick={onNewInvoice}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            New invoice
          </Button>
          <Link to="/invoices" className="inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 font-semibold transition-colors">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import Money from "../common/money";
import { ArrowRight, Landmark, Plus } from "lucide-react";
import Button from "../ui/button";

export default function LoansCard({ summary, onNewLoan }) {
  const totalLoaned = Number(summary?.totalLoaned ?? 0);
  const totalOutstanding = Number(summary?.totalOutstanding ?? 0);
  const totalRepaid = Number(summary?.totalRepaid ?? 0);
  const uniqueBorrowers = summary?.uniqueBorrowers ?? 0;
  const activeLoans = summary?.byStatus?.ACTIVE ?? 0;
  const overdueCount = summary?.byStatus?.OVERDUE ?? 0;

  const repaidPct = totalLoaned > 0 ? Math.min(100, Math.round((totalRepaid / totalLoaned) * 100)) : 0;

  return (
    <div className="card-glow group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.04] to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-indigo-400 to-violet-400 opacity-60" />

      <div className="relative p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 flex items-center justify-center ring-1 ring-indigo-500/20">
              <Landmark className="h-4 w-4 text-indigo-600" strokeWidth={1.8} />
            </div>
            <span className="text-[13px] font-semibold text-slate-800">Loans given out</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-lg font-bold tracking-tight text-slate-900 animate-count-up">
              <Money value={totalLoaned} />
            </div>
            <div className="mt-0.5 text-[11px] text-slate-400 font-medium">{uniqueBorrowers} borrower{uniqueBorrowers !== 1 ? "s" : ""}</div>
          </div>
          <div className="text-right">
            <div className={`text-lg font-bold tracking-tight animate-count-up ${totalOutstanding > 0 ? "text-rose-600" : "text-emerald-600"}`}>
              <Money value={totalOutstanding} />
            </div>
            <div className="mt-0.5 text-[11px] text-slate-400 font-medium">outstanding</div>
          </div>
        </div>

        {totalLoaned > 0 ? (
          <div className="space-y-2">
            <div className="flex justify-between text-[11px] font-medium">
              <span className="text-emerald-600">{repaidPct}% repaid</span>
              <span className="text-slate-400">{activeLoans} active{overdueCount > 0 ? ` · ${overdueCount} overdue` : ""}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 ease-out"
                style={{ width: `${repaidPct}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between pt-1">
          <Button size="sm" className="h-8 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium shadow-sm shadow-violet-600/20" onClick={onNewLoan}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Record loan
          </Button>
          <Link to="/loans" className="inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 font-semibold transition-colors">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

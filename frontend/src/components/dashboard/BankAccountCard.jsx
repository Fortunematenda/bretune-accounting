import React from "react";
import { Link } from "react-router-dom";
import Money from "../common/money";
import { ArrowRight, Building2, Upload } from "lucide-react";

export default function BankAccountCard({ label = "Bank Account", accountNumber, balance, reconcileCount, onImport }) {
  return (
    <div className="card-glow group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.04] to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 opacity-60" />

      <div className="relative p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-blue-500/10 flex items-center justify-center ring-1 ring-blue-500/20">
            <Building2 className="h-4 w-4 text-blue-600" strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <span className="text-[13px] font-semibold text-slate-800 block truncate">{label}</span>
            {accountNumber ? (
              <span className="text-[11px] text-slate-400 font-medium">{accountNumber}</span>
            ) : null}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Balance</div>
          <div className="mt-1 text-lg font-bold tracking-tight text-slate-900 animate-count-up">
            <Money value={balance ?? 0} />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Link
            to="/bank-reconciliation"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium shadow-sm shadow-violet-600/20 transition-colors"
          >
            Reconcile {reconcileCount > 0 ? `${reconcileCount} items` : "now"}
            <ArrowRight className="h-3 w-3" />
          </Link>
          <button
            type="button"
            onClick={onImport}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-white text-slate-600 text-xs font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <Upload className="h-3 w-3" />
            Import
          </button>
        </div>
      </div>
    </div>
  );
}

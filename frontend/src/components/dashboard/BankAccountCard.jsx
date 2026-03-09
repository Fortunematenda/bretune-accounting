import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Link } from "react-router-dom";
import Money from "../common/money";
import { MoreVertical } from "lucide-react";

export default function BankAccountCard({ label = "Bank Account", accountNumber, balance, reconcileCount, onImport }) {
  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">{label}</CardTitle>
          <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400" aria-label="More options">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
        {accountNumber ? (
          <p className="text-xs text-slate-500 mt-0.5">{accountNumber}</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="text-xs text-slate-500">Balance</div>
          <div className="text-xl font-semibold text-slate-900">
            <Money value={balance ?? 0} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            to="/bank-reconciliation"
            className="inline-flex items-center h-8 px-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium"
          >
            Reconcile {reconcileCount > 0 ? `${reconcileCount} items` : "now"}
          </Link>
          <button
            type="button"
            onClick={onImport}
            className="inline-flex items-center h-8 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50"
          >
            Import bank statement
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

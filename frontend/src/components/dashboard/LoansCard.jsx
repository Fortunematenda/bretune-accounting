import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Link } from "react-router-dom";
import Money from "../common/money";
import { Landmark, Plus } from "lucide-react";
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
    <Card className="border border-slate-200 bg-white shadow-sm relative">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Loans given out</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
            <Landmark className="h-4 w-4 text-violet-600" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xl font-semibold text-slate-900">
              <Money value={totalLoaned} />
            </div>
            <div className="text-xs text-slate-500">{uniqueBorrowers} borrower{uniqueBorrowers !== 1 ? "s" : ""}</div>
          </div>
          <div>
            <div className={`text-xl font-semibold ${totalOutstanding > 0 ? "text-red-600" : "text-emerald-600"}`}>
              <Money value={totalOutstanding} />
            </div>
            <div className="text-xs text-slate-500">outstanding</div>
          </div>
        </div>

        {totalLoaned > 0 ? (
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>{repaidPct}% repaid</span>
              <span>{activeLoans} active loan{activeLoans !== 1 ? "s" : ""}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-[width]"
                style={{ width: `${repaidPct}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 pt-1">
          <Button size="sm" className="h-8 bg-violet-600 hover:bg-violet-700 text-white" onClick={onNewLoan}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Record loan
          </Button>
          <Link to="/loans" className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center">
            View all loans
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Link } from "react-router-dom";
import Money from "../common/money";
import { MoreVertical, Plus } from "lucide-react";
import Button from "../ui/button";

const BAR_LABELS = ["0-30 days", "31-60", "61-90", "90+"];

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
    <Card className="border border-slate-200 bg-white shadow-sm relative">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Invoices owed to you</CardTitle>
          <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400" aria-label="More options">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xl font-semibold text-slate-900">
              <Money value={totalOwed || 0} />
            </div>
            <div className="text-xs text-slate-500">{totalCount ?? 0} awaiting payment</div>
          </div>
          <div>
            <div className="text-xl font-semibold text-amber-600">
              <Money value={overdueAmount || 0} />
            </div>
            <div className="text-xs text-slate-500">{overdueCount ?? 0} overdue</div>
          </div>
        </div>

        {maxBar > 0 ? (
          <div className="space-y-1">
            <div className="flex gap-1 h-8 items-end">
              {barData.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-sky-200 min-w-0 flex items-end justify-center"
                  title={`${BAR_LABELS[i]}: ${v}`}
                >
                  <div
                    className="w-full rounded-t bg-violet-600 min-h-[4px]"
                    style={{ height: `${Math.max(4, (v / maxBar) * 100)}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              {BAR_LABELS.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 pt-2">
          <Button size="sm" className="h-8 bg-violet-600 hover:bg-violet-700 text-white" onClick={onNewInvoice}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            New invoice
          </Button>
          <Link to="/invoices" className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center">
            View all invoices
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

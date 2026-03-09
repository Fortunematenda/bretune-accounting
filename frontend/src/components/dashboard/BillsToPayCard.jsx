import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Link, useNavigate } from "react-router-dom";
import Money from "../common/money";
import { MoreVertical, Plus } from "lucide-react";
import Button from "../ui/button";

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
    <Card className="border border-slate-200 bg-white shadow-sm relative">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Bills to pay</CardTitle>
          <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400" aria-label="More options">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xl font-semibold text-slate-900">
              <Money value={totalOwed} />
            </div>
            <div className="text-xs text-slate-500">{totalCount} awaiting payment</div>
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
                  title={`${v}`}
                >
                  <div
                    className="w-full rounded-t bg-violet-600 min-h-[4px]"
                    style={{ height: `${Math.max(4, (v / maxBar) * 100)}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Older</span>
              <span>This week</span>
              <span>Next 7 days</span>
              <span>Later</span>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 pt-2">
          <Button size="sm" className="h-8 bg-violet-600 hover:bg-violet-700 text-white" onClick={onAddBill}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add bill
          </Button>
          <Link to="/bills" className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center">
            View all bills
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

import React from "react";
import BillSummaryCard from "../bills/BillSummaryCard";
import Money from "../common/money";

export default function ExpenseSummaryCards({ loading, totals }) {
  const t = totals || { totalAmount: 0, pending: 0, reimbursed: 0 };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      <BillSummaryCard
        title="Total Expenses (period)"
        value={loading ? "…" : <Money value={t.totalAmount || 0} />}
      />
      <BillSummaryCard title="Pending Approval" value={loading ? "…" : String(t.pending || 0)} />
      <BillSummaryCard title="Reimbursed" value={loading ? "…" : String(t.reimbursed || 0)} />
    </div>
  );
}

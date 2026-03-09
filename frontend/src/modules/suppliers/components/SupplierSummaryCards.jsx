import React, { useMemo } from "react";
import { FileText, Wallet, Receipt, Clock } from "lucide-react";
import KpiCard from "../../../components/dashboard/KpiCard";
import { formatMoney } from "../../../components/common/money";

function fmtDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "2-digit" }).format(dt);
  } catch {
    return dt.toISOString().slice(0, 10);
  }
}

export default function SupplierSummaryCards({ supplier }) {
  const summary = useMemo(() => {
    const bills = Array.isArray(supplier?.bills) ? supplier.bills : [];
    const payments = Array.isArray(supplier?.payments) ? supplier.payments : [];
    const tx = Array.isArray(supplier?.transactions) ? supplier.transactions : [];

    const totalBills = supplier?.totalBills != null ? Number(supplier.totalBills) : bills.length;

    const outstandingAmount = (() => {
      const candidates = [supplier?.outstandingAmount, supplier?.balance, supplier?.balanceDue];
      for (const c of candidates) {
        const n = Number(c);
        if (Number.isFinite(n)) return n;
      }
      const openBills = bills.filter((b) => {
        const s = String(b?.status || "").toUpperCase();
        return ["OPEN", "UNPAID", "OVERDUE", "PARTIALLY_PAID"].includes(s);
      });
      return openBills.reduce((sum, b) => sum + Number(b?.balanceDue || b?.amountDue || 0), 0);
    })();

    const paidThisPeriod = (() => {
      const n = Number(supplier?.paidThisPeriod);
      if (Number.isFinite(n)) return n;
      const now = new Date();
      const start = new Date(now);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      return payments
        .filter((p) => {
          const d = p?.date || p?.paidAt || p?.createdAt;
          const dt = d ? new Date(d) : null;
          if (!dt || Number.isNaN(dt.getTime())) return false;
          return dt.getTime() >= start.getTime();
        })
        .reduce((sum, p) => sum + Number(p?.amount || 0), 0);
    })();

    const lastTransaction = (() => {
      const dates = [];
      for (const t of tx) {
        if (t?.date) dates.push(new Date(t.date));
      }
      for (const b of bills) {
        if (b?.issueDate) dates.push(new Date(b.issueDate));
        if (b?.createdAt) dates.push(new Date(b.createdAt));
      }
      for (const p of payments) {
        if (p?.date) dates.push(new Date(p.date));
        if (p?.createdAt) dates.push(new Date(p.createdAt));
      }
      const valid = dates.filter((d) => d && !Number.isNaN(d.getTime()));
      if (valid.length === 0) return null;
      return valid.sort((a, b) => b.getTime() - a.getTime())[0];
    })();

    return {
      totalBills,
      outstandingAmount,
      paidThisPeriod,
      lastTransaction,
    };
  }, [supplier]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard title="Total Bills" value={String(summary.totalBills || 0)} label="All bills" icon={Receipt} tone="default" />
      <KpiCard
        title="Outstanding"
        value={formatMoney(summary.outstandingAmount || 0)}
        label="Unpaid balance"
        icon={Wallet}
        tone="default"
      />
      <KpiCard
        title="Paid This Period"
        value={formatMoney(summary.paidThisPeriod || 0)}
        label="This month"
        icon={FileText}
        tone="default"
      />
      <KpiCard
        title="Last Transaction"
        value={summary.lastTransaction ? fmtDate(summary.lastTransaction) : "—"}
        label="Most recent activity"
        icon={Clock}
        tone="default"
      />
    </div>
  );
}

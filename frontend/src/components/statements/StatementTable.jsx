import React from "react";
import Money from "../common/money";
import { formatDateForDisplay } from "../../lib/dateFormat";

function rowDescription(row) {
  if (row.type === "INVOICE") return "Invoice issued";
  if (row.type === "PAYMENT") return `Payment received${row.method ? ` (${row.method})` : ""}`;
  if (row.type === "LOAN") return `Loan issued${row.borrowerName ? ` (${row.borrowerName})` : ""}`;
  if (row.type === "LOAN_REPAYMENT") return `Loan repayment${row.borrowerName ? ` (${row.borrowerName})` : ""}`;
  return "Transaction";
}

export default function StatementTable({ statement }) {
  const ledger = statement?.ledger || [];

  return (
    <div className="rounded-lg border border-[#E5E7EB] overflow-hidden">
      <div className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-3">Transactions</div>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-[#F8F9FB]">
            <th className="px-5 py-4 text-left font-semibold text-[#111827]">Date</th>
            <th className="px-5 py-4 text-left font-semibold text-[#111827]">Reference / Invoice #</th>
            <th className="px-5 py-4 text-left font-semibold text-[#111827]">Description</th>
            <th className="px-5 py-4 text-right font-semibold text-[#111827] w-28">Debit</th>
            <th className="px-5 py-4 text-right font-semibold text-[#111827] w-28">Credit</th>
            <th className="px-5 py-4 text-right font-semibold text-[#111827] w-32">Balance</th>
          </tr>
        </thead>
        <tbody>
          {ledger.map((row, idx) => {
            const balance = Number(row.runningBalance || 0);
            const isDebit = balance > 0;
            return (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}
              >
                <td className="px-5 py-4 text-[#111827] border-t border-[#E5E7EB]">
                  {formatDateForDisplay(row.date)}
                </td>
                <td className="px-5 py-4 font-medium text-[#111827] border-t border-[#E5E7EB]">
                  {row.reference || "—"}
                </td>
                <td className="px-5 py-4 text-[#6B7280] border-t border-[#E5E7EB]">
                  {rowDescription(row)}
                </td>
                <td className="px-5 py-4 text-right text-[#111827] border-t border-[#E5E7EB]">
                  {Number(row.debit || 0) > 0 ? (
                    <Money value={row.debit} />
                  ) : (
                    <span className="text-[#9CA3AF]">—</span>
                  )}
                </td>
                <td className="px-5 py-4 text-right text-[#111827] border-t border-[#E5E7EB]">
                  {Number(row.credit || 0) > 0 ? (
                    <Money value={row.credit} />
                  ) : (
                    <span className="text-[#9CA3AF]">—</span>
                  )}
                </td>
                <td className={`px-5 py-4 text-right font-medium border-t border-[#E5E7EB] ${isDebit ? "text-[#7C3AED]" : "text-[#111827]"}`}>
                  <Money value={row.runningBalance} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {ledger.length === 0 ? (
        <div className="px-5 py-8 text-center text-[#6B7280] text-sm">No entries for this period.</div>
      ) : null}
    </div>
  );
}

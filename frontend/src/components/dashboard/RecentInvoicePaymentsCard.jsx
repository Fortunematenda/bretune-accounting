import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Link } from "react-router-dom";
import Money from "../common/money";
import { MoreVertical } from "lucide-react";

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "2-digit" }).format(dt);
}

export default function RecentInvoicePaymentsCard({ payments }) {
  const rows = Array.isArray(payments) ? payments.slice(0, 8) : [];

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Recent invoice payments</CardTitle>
          <button type="button" className="p-1 rounded hover:bg-slate-100 text-slate-400" aria-label="More options">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="py-6 text-center text-sm text-slate-500">No recent payments.</div>
        ) : (
          <div className="overflow-auto max-h-64">
            <table className="w-full text-sm min-w-[320px]">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="py-2 font-medium">Invoice #</th>
                  <th className="py-2 font-medium">Contact</th>
                  <th className="py-2 font-medium">Date received</th>
                  <th className="py-2 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="py-2">
                      <Link to="/invoices" className="text-violet-600 hover:text-violet-700 font-medium">
                        {p.invoiceNumber}
                      </Link>
                    </td>
                    <td className="py-2 text-slate-700 truncate max-w-[120px]">{p.contact}</td>
                    <td className="py-2 text-slate-600">{formatDate(p.dateReceived)}</td>
                    <td className="py-2 text-right font-medium">
                      <Money value={p.amount || 0} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Link to="/payments" className="block mt-3 text-sm text-violet-600 hover:text-violet-700 font-medium">
          View all payments
        </Link>
      </CardContent>
    </Card>
  );
}

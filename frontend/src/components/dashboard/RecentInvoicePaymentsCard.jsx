import React from "react";
import { Card, CardContent } from "../ui/card";
import { Link } from "react-router-dom";
import Money from "../common/money";
import { ArrowRight, CreditCard } from "lucide-react";

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "2-digit" }).format(dt);
}

export default function RecentInvoicePaymentsCard({ payments }) {
  const rows = Array.isArray(payments) ? payments.slice(0, 8) : [];

  return (
    <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-sm">
      <div className="p-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-violet-500/10 flex items-center justify-center ring-1 ring-violet-500/20">
            <CreditCard className="h-4 w-4 text-violet-600" strokeWidth={1.8} />
          </div>
          <span className="text-[13px] font-semibold text-slate-800">Recent payments</span>
        </div>
        <Link to="/payments" className="inline-flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 font-semibold transition-colors">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <CardContent className="pt-0">
        {rows.length === 0 ? (
          <div className="py-8 text-center">
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <CreditCard className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">No recent payments.</p>
          </div>
        ) : (
          <div className="overflow-auto max-h-72">
            <table className="w-full text-sm min-w-[320px]">
              <thead>
                <tr className="text-left border-b border-slate-100">
                  <th className="py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Invoice</th>
                  <th className="py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Contact</th>
                  <th className="py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Received</th>
                  <th className="py-2.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p, i) => (
                  <tr key={i} className="border-b border-slate-50/80 hover:bg-violet-50/30 transition-colors">
                    <td className="py-2.5">
                      <Link to="/invoices" className="text-violet-600 hover:text-violet-700 font-semibold text-xs">
                        {p.invoiceNumber}
                      </Link>
                    </td>
                    <td className="py-2.5 text-slate-600 text-xs truncate max-w-[120px]">{p.contact}</td>
                    <td className="py-2.5 text-slate-400 text-xs">{formatDate(p.dateReceived)}</td>
                    <td className="py-2.5 text-right font-semibold text-xs text-slate-800">
                      <Money value={p.amount || 0} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

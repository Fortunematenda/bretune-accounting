import React, { useMemo } from "react";
import Money from "../common/money";

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function QuoteSummary({ items }) {
  const totals = useMemo(() => {
    const rows = Array.isArray(items) ? items : [];
    let subtotal = 0;
    let vat = 0;

    for (const r of rows) {
      const qty = toNumber(r.quantity);
      const unit = toNumber(r.unitPrice);
      const discount = toNumber(r.discount);
      const rate = toNumber(r.taxRate);
      const lineSubtotal = Math.max(0, qty * unit - discount);
      const lineVat = lineSubtotal * rate;
      subtotal += lineSubtotal;
      vat += lineVat;
    }

    const total = subtotal + vat;
    return { subtotal, vat, total };
  }, [items]);

  return (
    <div className="rounded-xl border border-violet-100 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">Quote summary</div>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Subtotal</span>
          <Money value={totals.subtotal} className="font-medium" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600">VAT</span>
          <Money value={totals.vat} className="font-medium" />
        </div>
        <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
          <span className="text-slate-900 font-semibold">Total</span>
          <Money value={totals.total} className="font-bold text-lg" />
        </div>
      </div>
    </div>
  );
}

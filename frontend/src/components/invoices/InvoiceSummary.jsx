import React, { useMemo } from "react";
import Money from "../common/money";

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function InvoiceSummary({ items }) {
  const totals = useMemo(() => {
    const rows = Array.isArray(items) ? items : [];
    let subtotal = 0;
    let vat = 0;

    for (const r of rows) {
      const qty = toNumber(r.quantity);
      const unit = toNumber(r.unitPrice);
      const rate = toNumber(r.taxRate);
      const lineSubtotal = qty * unit;
      const lineVat = lineSubtotal * rate;
      subtotal += lineSubtotal;
      vat += lineVat;
    }

    const total = subtotal + vat;
    return {
      subtotal,
      vat,
      total,
    };
  }, [items]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-sm font-medium text-slate-900">Summary</div>
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-600">Subtotal</span>
          <Money value={totals.subtotal} className="font-medium" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600">VAT</span>
          <Money value={totals.vat} className="font-medium" />
        </div>
        <div className="border-t border-slate-200 pt-2 flex items-center justify-between">
          <span className="text-slate-900 font-medium">Grand total</span>
          <Money value={totals.total} className="font-semibold" />
        </div>
      </div>
    </div>
  );
}

import React, { useMemo } from "react";
import Input from "../ui/input";
import Button from "../ui/button";
import Money from "../common/money";

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function QuoteLineItems({ items, setItems, products, vatEnabled, errors, onAddProduct }) {
  const productById = useMemo(() => {
    const map = new Map();
    (products || []).forEach((p) => map.set(p.id, p));
    return map;
  }, [products]);

  function addRow() {
    setItems((prev) => [
      ...(prev || []),
      {
        productId: "",
        description: "",
        quantity: "1",
        unitPrice: "0.00",
        discount: "0.00",
        taxRate: vatEnabled ? "0.15" : "0.00",
      },
    ]);
  }

  function removeRow(idx) {
    setItems((prev) => (prev || []).filter((_, i) => i !== idx));
  }

  function updateRow(idx, patch) {
    setItems((prev) => (prev || []).map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-slate-900">Line items</div>
          <div className="text-xs text-slate-500">Add products or services from your catalog</div>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={addRow}>
          + Add line
        </Button>
      </div>

      <div className="overflow-auto rounded-xl border border-violet-100 bg-white">
        <table className="min-w-full text-sm table-fixed">
          <colgroup>
            <col className="w-[160px]" />
            <col className="w-auto" style={{ minWidth: 200 }} />
            <col className="w-[80px]" />
            <col className="w-[110px]" />
            <col className="w-[100px]" />
            <col className="w-[80px]" />
            <col className="w-[110px]" />
            <col className="w-[48px]" />
          </colgroup>
          <thead className="text-left text-slate-500">
            <tr>
              <th className="px-3 py-3 text-xs font-semibold">Product</th>
              <th className="px-3 py-3 text-xs font-semibold">Description</th>
              <th className="px-3 py-3 text-xs font-semibold">Qty</th>
              <th className="px-3 py-3 text-xs font-semibold">Unit price</th>
              <th className="px-3 py-3 text-xs font-semibold">Discount</th>
              <th className="px-3 py-3 text-xs font-semibold">VAT %</th>
              <th className="px-3 py-3 text-xs font-semibold text-right">Amount</th>
              <th className="px-2 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(items || []).map((r, idx) => {
              const qty = toNumber(r.quantity);
              const unit = toNumber(r.unitPrice);
              const discount = toNumber(r.discount);
              const rate = vatEnabled ? toNumber(r.taxRate) : 0;
              const lineSubtotal = Math.max(0, qty * unit - discount);
              const lineTotal = lineSubtotal * (1 + rate);
              const rowErrors = errors?.items?.[idx] || {};
              const vatPercent = Math.round(rate * 100);

              return (
                <tr key={idx} className="border-t border-slate-100 align-top">
                  <td className="px-3 py-3">
                    <select
                      className="h-10 w-full rounded-lg border border-violet-200 bg-white px-2 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-200 truncate"
                      value={r.productId || ""}
                      onChange={(e) => {
                        const nextId = e.target.value;
                        if (nextId === "" && onAddProduct) {
                          updateRow(idx, { productId: "" });
                          onAddProduct(idx);
                          return;
                        }
                        const p = productById.get(nextId);
                        const nextTax = vatEnabled && p?.taxRate != null ? String(Number(p.taxRate)) : "0.00";
                        updateRow(idx, {
                          productId: nextId,
                          description: p?.description || p?.name || r.description,
                          unitPrice: p?.price != null ? String(p.price) : r.unitPrice,
                          taxRate: nextTax,
                        });
                      }}
                    >
                      <option value="">New</option>
                      {(products || []).map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.trackInventory ? "Product" : "Service"})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      value={r.description}
                      onChange={(e) => updateRow(idx, { description: e.target.value })}
                      placeholder="Description"
                      className="w-full border-violet-200 focus:border-violet-400"
                    />
                    {rowErrors.description ? (
                      <div className="mt-1 text-xs text-red-600">{rowErrors.description}</div>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={r.quantity}
                      onChange={(e) => updateRow(idx, { quantity: e.target.value })}
                      className="w-full border-violet-200"
                    />
                    {rowErrors.quantity ? (
                      <div className="mt-1 text-xs text-red-600">{rowErrors.quantity}</div>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={r.unitPrice}
                      onChange={(e) => updateRow(idx, { unitPrice: e.target.value })}
                      className="w-full border-violet-200"
                    />
                    {rowErrors.unitPrice ? (
                      <div className="mt-1 text-xs text-red-600">{rowErrors.unitPrice}</div>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={r.discount}
                      onChange={(e) => updateRow(idx, { discount: e.target.value })}
                      className="w-full border-violet-200"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      step="0.01"
                      value={vatEnabled ? (r.taxRate ? String(toNumber(r.taxRate) * 100) : "0") : "0"}
                      onChange={(e) => {
                        const pct = toNumber(e.target.value);
                        updateRow(idx, { taxRate: String((pct / 100).toFixed(4)) });
                      }}
                      disabled={!vatEnabled}
                      className="w-full border-violet-200"
                      placeholder={vatEnabled ? "15" : "0"}
                    />
                    {!vatEnabled ? <div className="mt-1 text-[11px] text-slate-500">—</div> : null}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="h-10 flex items-center justify-end font-medium text-sm tabular-nums">
                      <Money value={lineTotal} />
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    {(items || []).length > 1 ? (
                      <button
                        type="button"
                        className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        onClick={() => removeRow(idx)}
                        aria-label="Remove line"
                      >
                        ×
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {errors?.itemsError ? <div className="text-sm text-red-600">{errors.itemsError}</div> : null}
    </div>
  );
}

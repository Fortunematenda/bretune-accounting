import React, { useMemo } from "react";
import Input from "../ui/input";
import Button from "../ui/button";
import Money from "../common/money";

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function InvoiceLineItems({
  items,
  setItems,
  products,
  vatEnabled,
  errors,
  readOnly = false,
  onAddProduct,
}) {
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
        quantity: 1,
        unitPrice: 0,
        vatPercent: vatEnabled ? 15 : 0,
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
          <div className="text-xs text-slate-500">Add products or services to this invoice</div>
        </div>
        {!readOnly ? (
          <Button type="button" variant="secondary" onClick={addRow}>
            Add line
          </Button>
        ) : null}
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-[640px] w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="px-3 py-2">Product/Service</th>
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2 w-24">Qty</th>
              <th className="px-3 py-2 w-32">Unit</th>
              <th className="px-3 py-2 w-28">VAT %</th>
              <th className="px-3 py-2 w-32 text-right">Line total</th>
              <th className="px-3 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {(items || []).map((r, idx) => {
              const qty = toNumber(r.quantity);
              const unit = toNumber(r.unitPrice);
              const vatRate = vatEnabled ? toNumber(r.vatPercent) / 100 : 0;
              const lineTotal = qty * unit * (1 + vatRate);
              const rowErrors = errors?.items?.[idx] || {};

              return (
                <tr key={idx} className="border-t border-slate-100 align-top">
                  <td className="px-3 py-2">
                    <select
                      className="h-10 w-48 rounded-md border border-slate-200 bg-white px-3 text-sm"
                      value={r.productId}
                      disabled={readOnly}
                      onChange={(e) => {
                        const nextId = e.target.value;
                        if (nextId === "" && onAddProduct) {
                          updateRow(idx, { productId: "" });
                          onAddProduct(idx);
                          return;
                        }
                        const p = productById.get(nextId);
                        const nextVat = vatEnabled
                          ? Math.round(Number(p?.taxRate != null ? p.taxRate : 0) * 10000) / 100
                          : 0;
                        updateRow(idx, {
                          productId: nextId,
                          description: p?.description || p?.name || r.description,
                          unitPrice: p?.price != null ? Number(p.price) : r.unitPrice,
                          vatPercent: nextVat,
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

                  <td className="px-3 py-2">
                    <Input
                      value={r.description}
                      onChange={(e) => updateRow(idx, { description: e.target.value })}
                      placeholder="Description"
                      disabled={readOnly}
                    />
                    {rowErrors.description ? (
                      <div className="mt-1 text-xs text-red-600">{rowErrors.description}</div>
                    ) : null}
                  </td>

                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={r.quantity}
                      onChange={(e) => updateRow(idx, { quantity: e.target.value })}
                      disabled={readOnly}
                    />
                    {rowErrors.quantity ? (
                      <div className="mt-1 text-xs text-red-600">{rowErrors.quantity}</div>
                    ) : null}
                  </td>

                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={r.unitPrice}
                      onChange={(e) => updateRow(idx, { unitPrice: e.target.value })}
                      disabled={readOnly}
                    />
                    {rowErrors.unitPrice ? (
                      <div className="mt-1 text-xs text-red-600">{rowErrors.unitPrice}</div>
                    ) : null}
                  </td>

                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={vatEnabled ? r.vatPercent : 0}
                      onChange={(e) => updateRow(idx, { vatPercent: e.target.value })}
                      disabled={!vatEnabled || readOnly}
                    />
                    {!vatEnabled ? <div className="mt-1 text-[11px] text-slate-500">VAT disabled</div> : null}
                  </td>

                  <td className="px-3 py-2 text-right">
                    <div className="h-10 flex items-center justify-end">
                      <Money value={lineTotal} />
                    </div>
                  </td>

                  <td className="px-3 py-2">
                    {!readOnly && (items || []).length > 1 ? (
                      <button
                        type="button"
                        className="h-10 w-10 inline-flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-50 hover:text-slate-700"
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

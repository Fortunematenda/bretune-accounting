import React, { useState } from "react";
import Dialog from "../ui/dialog";
import Input from "../ui/input";
import Button from "../ui/button";
import { api } from "../../lib/api";

const emptyForm = { type: "PRODUCT", name: "", description: "", price: "0.00", taxRate: "0.15" };

export default function AddProductModal({ open, onOpenChange, onCreated }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function reset() {
    setForm(emptyForm);
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const product = await api.createProduct({
        type: form.type,
        name: form.name.trim(),
        description: form.description?.trim() || null,
        price: form.price,
        taxRate: form.taxRate,
        isActive: true,
      });
      reset();
      onOpenChange(false);
      onCreated?.(product);
    } catch (err) {
      setError(err.message || "Failed to add product");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
      title="Add item"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="PRODUCT">Product</option>
            <option value="SERVICE">Service</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Name *</label>
          <Input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Product or service name"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Optional"
            rows={2}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Price *</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">VAT %</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={form.taxRate ? String(Number(form.taxRate) * 100) : "15"}
              onChange={(e) => setForm((p) => ({ ...p, taxRate: String(Number(e.target.value || 0) / 100) }))}
              placeholder="15"
            />
          </div>
        </div>
        {error ? <div className="text-sm text-red-600">{error}</div> : null}
        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={submitting || !form.name.trim()} className="bg-violet-600 hover:bg-violet-700">
            {submitting ? "Adding…" : "Add & use"}
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

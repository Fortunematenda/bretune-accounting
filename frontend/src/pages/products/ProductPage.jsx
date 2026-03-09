import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import { Package } from "lucide-react";

const RECURRING_OPTIONS = [
  { value: "", label: "One-time" },
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "BI_WEEKLY", label: "Bi-weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "YEARLY", label: "Yearly" },
];

const emptyForm = {
  type: "PRODUCT",
  name: "",
  description: "",
  sku: "",
  price: "0.00",
  cost: "",
  taxRate: "0.00",
  isRecurring: false,
  recurringFrequency: "",
  isActive: true,
};

export default function ProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    api
      .getProduct(id)
      .then((res) => {
        if (mounted) {
          setProduct(res);
          setForm({
            type: String(res.type || "PRODUCT").toUpperCase() === "SERVICE" ? "SERVICE" : "PRODUCT",
            name: res.name || "",
            description: res.description || "",
            sku: res.sku || "",
            price: String(res.price ?? "0.00"),
            cost: res.cost != null ? String(res.cost) : "",
            taxRate: String(res.taxRate ?? "0.00"),
            isRecurring: Boolean(res.isRecurring),
            recurringFrequency: res.recurringFrequency || "",
            isActive: res.isActive !== false,
          });
        }
      })
      .catch(() => {
        if (mounted) setProduct(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        type: form.type,
        name: form.name.trim(),
        description: form.description?.trim() || null,
        sku: form.sku?.trim() || null,
        price: form.price,
        cost: form.cost ? form.cost : null,
        taxRate: form.taxRate,
        isRecurring: form.isRecurring,
        recurringFrequency: form.isRecurring ? (form.recurringFrequency || "MONTHLY") : null,
        isActive: form.isActive,
      };
      if (isEdit) {
        await api.updateProduct(id, payload);
        navigate(`/items/${id}`, { replace: true });
      } else {
        const created = await api.createProduct(payload);
        navigate(created?.id ? `/items/${created.id}` : "/items", { replace: true });
      }
    } catch (e) {
      setError(e.message || "Failed to save item");
    } finally {
      setSubmitting(false);
    }
  }

  if (isEdit && loading) {
    return <div className="text-sm text-slate-600">Loading item…</div>;
  }

  if (isEdit && !product) {
    return (
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-2">
          <div>
            <h1 className="text-xl font-semibold">Item</h1>
            <p className="text-sm text-slate-600">Item not found.</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/items")}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {isEdit ? "Edit item" : "New item"}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {isEdit ? "Edit item details" : "Add a new product or service"}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/items")}>
          Back
        </Button>
      </div>

      <Card className="border-violet-100 overflow-hidden">
        <CardHeader className="border-b border-violet-100 bg-violet-50/30">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <div className="h-10 w-10 rounded-lg bg-violet-600 text-white flex items-center justify-center">
              <Package className="h-5 w-5" />
            </div>
            <span>Item details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
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
                  className="h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Optional description"
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">SKU</label>
                  <Input
                    value={form.sku}
                    onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
                    placeholder="Stock keeping unit"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Price *</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    required
                    className="h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Cost (optional)</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.cost}
                    onChange={(e) => setForm((p) => ({ ...p, cost: e.target.value }))}
                    placeholder="Cost price"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Tax rate</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={form.taxRate}
                    onChange={(e) => setForm((p) => ({ ...p, taxRate: e.target.value }))}
                    placeholder="e.g. 0.15 for 15%"
                    className="h-10"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.isRecurring}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        isRecurring: e.target.checked,
                        recurringFrequency: e.target.checked ? p.recurringFrequency || "MONTHLY" : "",
                      }))
                    }
                  />
                  Recurring product
                </label>
                {form.isRecurring && (
                  <select
                    value={form.recurringFrequency || "MONTHLY"}
                    onChange={(e) => setForm((p) => ({ ...p, recurringFrequency: e.target.value }))}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  >
                    {RECURRING_OPTIONS.filter((o) => o.value).map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                />
                Active (shown in invoice line items)
              </label>
            </div>

            {error ? <div className="text-sm text-red-600">{error}</div> : null}

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={submitting || !form.name.trim()}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {submitting ? "Saving…" : isEdit ? "Save Changes" : "Add Item"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/items")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

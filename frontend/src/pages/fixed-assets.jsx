import React, { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import Money from "../components/common/money";
import Pagination from "../components/common/Pagination";
import PageHeader from "../components/common/PageHeader";
import ListTable from "../components/common/ListTable";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Package, Plus } from "lucide-react";

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? String(iso) : new Intl.DateTimeFormat(undefined, { year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

const DEFAULT_FORM = {
  name: "",
  description: "",
  assetCode: "",
  purchaseDate: new Date().toISOString().slice(0, 10),
  cost: "",
  residualValue: "0",
  usefulLifeYears: "5",
  depreciationMethod: "STRAIGHT_LINE",
};

export default function FixedAssetsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.listFixedAssets({ page, limit: 20 });
      setData(res);
    } catch (e) {
      setError(e.message || "Failed to load");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAddAsset = async (e) => {
    e.preventDefault();
    setFormError(null);
    const name = form.name?.trim();
    const cost = parseFloat(form.cost);
    const usefulLife = parseInt(form.usefulLifeYears, 10);
    if (!name) {
      setFormError("Asset name is required");
      return;
    }
    if (!Number.isFinite(cost) || cost <= 0) {
      setFormError("Cost must be greater than 0");
      return;
    }
    if (!Number.isFinite(usefulLife) || usefulLife <= 0) {
      setFormError("Useful life must be greater than 0 years");
      return;
    }
    setSaving(true);
    try {
      await api.createFixedAsset({
        name,
        description: form.description?.trim() || null,
        assetCode: form.assetCode?.trim() || null,
        purchaseDate: form.purchaseDate || new Date().toISOString().slice(0, 10),
        cost,
        residualValue: parseFloat(form.residualValue) || 0,
        usefulLifeYears: usefulLife,
        depreciationMethod: form.depreciationMethod,
      });
      setForm(DEFAULT_FORM);
      setShowForm(false);
      load();
    } catch (e) {
      setFormError(e.message || "Failed to add asset");
    } finally {
      setSaving(false);
    }
  };

  const updateForm = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6 min-h-screen">
      <PageHeader
        title="Fixed Assets"
        subtitle="Asset register and depreciation tracking"
        icon={<Package className="h-6 w-6 text-violet-600" />}
        action={
          <Button onClick={() => setShowForm((v) => !v)} className="h-9 shrink-0 gap-2">
            <Plus className="h-4 w-4" />
            Add asset
          </Button>
        }
      />

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Fixed Asset List</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {showForm && (
            <form
              onSubmit={handleAddAsset}
              className="mb-6 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-6"
            >
              <h2 className="text-sm font-semibold text-slate-900 mb-4">New Fixed Asset</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Name *</label>
                  <Input
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    placeholder="e.g. Office equipment"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Asset code</label>
                  <Input
                    value={form.assetCode}
                    onChange={(e) => updateForm("assetCode", e.target.value)}
                    placeholder="e.g. FA-001"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Purchase date *</label>
                  <Input
                    type="date"
                    value={form.purchaseDate}
                    onChange={(e) => updateForm("purchaseDate", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Cost *</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.cost}
                    onChange={(e) => updateForm("cost", e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Residual value</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.residualValue}
                    onChange={(e) => updateForm("residualValue", e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Useful life (years) *</label>
                  <Input
                    type="number"
                    min="1"
                    value={form.usefulLifeYears}
                    onChange={(e) => updateForm("usefulLifeYears", e.target.value)}
                    placeholder="5"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">Depreciation method</label>
                  <select
                    value={form.depreciationMethod}
                    onChange={(e) => updateForm("depreciationMethod", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="STRAIGHT_LINE">Straight line</option>
                    <option value="DECLINING_BALANCE">Declining balance</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-slate-600">Description</label>
                  <Input
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    placeholder="Optional notes"
                  />
                </div>
              </div>
              {formError && (
                <p className="mt-3 text-sm text-red-600">{formError}</p>
              )}
              <div className="mt-4 flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Adding…" : "Add asset"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setFormError(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <ListTable
            data={data?.data ?? []}
            loading={loading}
            page={page}
            limit={data?.meta?.limit ?? 20}
            emptyMessage='No fixed assets. Click "Add asset" to add one.'
            columns={[
              { key: "name", label: "Asset", render: (a) => <span className="font-medium text-slate-900">{a.name}</span> },
              { key: "purchaseDate", label: "Purchase Date", render: (a) => formatDate(a.purchaseDate) },
              { key: "cost", label: "Cost", align: "right", render: (a) => <Money value={a.cost} />, cellClassName: "tabular-nums" },
              { key: "accumulatedDepreciation", label: "Accum. Depr.", align: "right", render: (a) => <Money value={a.accumulatedDepreciation} />, cellClassName: "tabular-nums" },
              {
                key: "status",
                label: "Status",
                render: (a) => (
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${a.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                    {a.status}
                  </span>
                ),
              },
            ]}
          />
          {data?.meta && data.meta.totalPages > 1 && (
            <Pagination page={data.meta.page} limit={data.meta.limit} total={data.meta.total} onPageChange={setPage} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

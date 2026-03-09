import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import Money from "../components/common/money";
import ListPageToolbar from "../components/common/ListPageToolbar";
import PageHeader from "../components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Pagination from "../components/common/Pagination";
import { Download, Package, Plus, Upload } from "lucide-react";
import { csvToObjects, downloadTextFile, objectsToCsv } from "../lib/csv";
import { formatRecordDisplayId } from "../lib/utils";
import ActionsMenu from "../components/common/ActionsMenu";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const isActive = searchParams.get("isActive") ?? "";
  const type = searchParams.get("type") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(10, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const importInputRef = useRef(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [success, setSuccess] = useState(null);


  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const params = { page, limit };
    if (q) params.q = q;
    if (isActive !== "") params.isActive = isActive;
    if (type !== "") params.type = type;
    api
      .listProducts(params)
      .then(setData)
      .catch((e) => setError(e.message || "Failed to load products"))
      .finally(() => setLoading(false));
  }, [q, isActive, type, page, limit]);

  useEffect(() => {
    load();
  }, [load]);

  function setPage(p) {
    const next = new URLSearchParams(searchParams);
    if (p <= 1) next.delete("page");
    else next.set("page", String(p));
    setSearchParams(next, { replace: true });
  }

  function setLimit(l) {
    const next = new URLSearchParams(searchParams);
    if (l === 20) next.delete("limit");
    else next.set("limit", String(l));
    next.delete("page");
    setSearchParams(next, { replace: true });
  }

  function clean(v) {
    if (v == null) return null;
    const s = String(v).trim();
    return s ? s : null;
  }

  function pick(obj, keys) {
    for (const k of keys) {
      const v = obj?.[k];
      if (v != null && String(v).trim() !== "") return String(v).trim();
    }
    return "";
  }

  function parseBool(v, defaultValue) {
    if (v == null || String(v).trim() === "") return defaultValue;
    const s = String(v).trim().toLowerCase();
    if (["true", "1", "yes", "y"].includes(s)) return true;
    if (["false", "0", "no", "n"].includes(s)) return false;
    return defaultValue;
  }

  async function fetchAllProducts() {
    const all = [];
    const limit = 1000;
    let p = 1;
    let totalPages = 1;

    while (p <= totalPages) {
      const params = { page: p, limit };
      if (q) params.q = q;
      if (isActive !== "") params.isActive = isActive;
      if (type !== "") params.type = type;

      const res = await api.listProducts(params);
      const batch = Array.isArray(res?.data) ? res.data : [];
      all.push(...batch);

      totalPages = Number(res?.meta?.totalPages || 1);
      if (!Number.isFinite(totalPages) || totalPages < 1) totalPages = 1;
      p += 1;
      if (p > 50) break;
    }

    return all;
  }

  async function exportProductsCsv() {
    setExporting(true);
    setError(null);
    setSuccess(null);
    try {
      const all = await fetchAllProducts();
      const headers = [
        { key: "type", label: "type" },
        { key: "name", label: "name" },
        { key: "description", label: "description" },
        { key: "sku", label: "sku" },
        { key: "price", label: "price" },
        { key: "cost", label: "cost" },
        { key: "taxRate", label: "taxRate" },
        { key: "isRecurring", label: "isRecurring" },
        { key: "recurringFrequency", label: "recurringFrequency" },
        { key: "isActive", label: "isActive" },
      ];

      const csv = objectsToCsv({
        headers,
        rows: all.map((p) => ({
          type: p?.type || "PRODUCT",
          name: p?.name || "",
          description: p?.description || "",
          sku: p?.sku || "",
          price: p?.price ?? "0.00",
          cost: p?.cost ?? "",
          taxRate: p?.taxRate ?? "0.00",
          isRecurring: p?.isRecurring ? "true" : "false",
          recurringFrequency: p?.recurringFrequency || "",
          isActive: p?.isActive === false ? "false" : "true",
        })),
      });

      const date = new Date().toISOString().slice(0, 10);
      downloadTextFile(`products_${date}.csv`, csv);
      setSuccess(`Exported ${all.length} items.`);
    } catch (e) {
      setError(e.message || "Failed to export products");
    } finally {
      setExporting(false);
    }
  }

  async function importProductsCsv(file) {
    if (!file) return;
    setImporting(true);
    setError(null);
    setSuccess(null);

    try {
      const text = await file.text();
      const parsed = csvToObjects(text);
      const rowsIn = Array.isArray(parsed?.rows) ? parsed.rows : [];

      let created = 0;
      let skipped = 0;
      let failed = 0;
      let firstErr = null;

      for (const r of rowsIn) {
        const name = pick(r, ["name", "product", "productname"]);
        if (!name) {
          skipped += 1;
          continue;
        }

        const rawType = pick(r, ["type", "itemtype"]);
        const typeNorm = String(rawType || "").trim().toUpperCase();
        const itemType = typeNorm === "SERVICE" ? "SERVICE" : "PRODUCT";

        const isRecurring = parseBool(pick(r, ["isrecurring", "recurring"]), false);
        const isActiveBool = parseBool(pick(r, ["isactive", "active"]), true);

        const payload = {
          type: itemType,
          name: String(name).trim(),
          description: clean(pick(r, ["description", "desc"])) ,
          sku: clean(pick(r, ["sku"])) ,
          price: String(pick(r, ["price"]) || "0.00"),
          cost: clean(pick(r, ["cost"])) ,
          taxRate: String(pick(r, ["taxrate", "tax"]) || "0.00"),
          isRecurring,
          recurringFrequency: isRecurring ? (clean(pick(r, ["recurringfrequency", "frequency"])) || "MONTHLY") : null,
          isActive: isActiveBool,
        };

        try {
          await api.createProduct(payload);
          created += 1;
        } catch (e) {
          if (e?.status === 409 || String(e?.message || "").toLowerCase().includes("exists")) {
            skipped += 1;
          } else {
            failed += 1;
            if (!firstErr) firstErr = e;
          }
        }
      }

      if (failed > 0) {
        setError(firstErr?.message || "Some rows failed to import.");
      }
      setSuccess(`Imported ${created} items. Skipped ${skipped}. Failed ${failed}.`);
      load();
    } catch (e) {
      setError(e.message || "Failed to import products");
    } finally {
      setImporting(false);
      if (importInputRef.current) importInputRef.current.value = "";
    }
  }

  function openCreate() {
    navigate("/items/new");
  }

  function openEdit(product) {
    navigate(`/items/${product.id}`);
  }

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setError(null);
    try {
      await api.deleteProduct(product.id);
      load();
    } catch (e) {
      setError(e.message || "Failed to delete product");
    }
  }

  const products = data?.data || [];

  return (
    <div className="space-y-6 min-h-screen">
      <PageHeader
        title="Items"
        subtitle="Products and services you can add to invoices"
        icon={<Package className="h-6 w-6 text-violet-600" />}
        actions={
          <>
            <select
                  value={type}
                  onChange={(e) => {
                    const next = e.target.value;
                    const nextParams = new URLSearchParams(searchParams);
                    if (next !== "") nextParams.set("type", next);
                    else nextParams.delete("type");
                    nextParams.delete("page");
                    setSearchParams(nextParams, { replace: true });
                  }}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                >
                  <option value="">All types</option>
                  <option value="PRODUCT">Products</option>
                  <option value="SERVICE">Services</option>
                </select>
            <select
                  value={isActive}
                  onChange={(e) => {
                    const next = e.target.value;
                    const nextParams = new URLSearchParams(searchParams);
                    if (next !== "") nextParams.set("isActive", next);
                    else nextParams.delete("isActive");
                    nextParams.delete("page");
                    setSearchParams(nextParams, { replace: true });
                  }}
                  className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                >
                  <option value="">All status</option>
                  <option value="true">Active only</option>
                  <option value="false">Inactive only</option>
                </select>
            <Button onClick={openCreate} className="h-9 shrink-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </>
        }
      />

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Item List</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            ref={importInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => importProductsCsv(e.target.files?.[0] || null)}
          />
          <ListPageToolbar
            actionsItems={[
              { key: "import", label: importing ? "Importing…" : "Import CSV", onSelect: () => importInputRef.current?.click(), disabled: importing },
              { key: "export", label: exporting ? "Exporting…" : "Export CSV", onSelect: exportProductsCsv, disabled: exporting },
            ]}
            searchValue={q}
            onSearchChange={(next) => {
              const nextParams = new URLSearchParams(searchParams);
              if (next) nextParams.set("q", next);
              else nextParams.delete("q");
              nextParams.delete("page");
              setSearchParams(nextParams, { replace: true });
            }}
            searchPlaceholder="Search by name, SKU, description…"
            limit={limit}
            onLimitChange={setLimit}
          />
          {success && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Tax
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">
                        Loading…
                      </td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="rounded-full bg-slate-100 p-4">
                            <Package className="h-8 w-8 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">No items yet</p>
                            <p className="text-sm text-slate-500">Add items to use in invoices</p>
                          </div>
                          <Button onClick={openCreate} className="bg-violet-600 hover:bg-violet-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Item
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((p, index) => {
                      const displayId = formatRecordDisplayId(p, { page, limit, index });
                      const typeLabel = String(p?.type || "PRODUCT").toUpperCase() === "SERVICE" ? "Service" : "Product";
                      return (
                      <tr
                        key={p.id}
                        className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/items/${p.id}`)}
                      >
                        <td className="px-4 py-3 font-mono text-sm text-violet-600 font-medium" title={p.id}>{displayId}</td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-slate-900">{p.name}</div>
                            {p.description && (
                              <div className="text-xs text-slate-500 truncate max-w-[200px]">
                                {p.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 font-mono">
                          {p.sku || "—"}
                        </td>
                        <td className="px-4 py-3 text-right font-medium tabular-nums">
                          <Money value={p.price || 0} />
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {p.taxRate != null ? `${(Number(p.taxRate) * 100).toFixed(1)}%` : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-slate-700">{typeLabel}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              p.isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {p.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end">
                            <ActionsMenu
                              ariaLabel="Item actions"
                              items={[
                                { key: "open", label: "Open", onSelect: () => navigate(`/items/${p.id}`) },
                                { key: "edit", label: "Edit", onSelect: () => openEdit(p) },
                                { key: "delete", label: "Delete", tone: "danger", onSelect: () => handleDelete(p) },
                              ]}
                            />
                          </div>
                        </td>
                      </tr>
                    );})
                  )}
                </tbody>
              </table>
            </div>

            {data?.meta && products.length > 0 && (
              <Pagination
                page={data.meta.page}
                limit={data.meta.limit}
                total={data.meta.total}
                onPageChange={setPage}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

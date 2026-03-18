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
import EmptyState from "../components/common/EmptyState";
import StatusBadge from "../components/common/StatusBadge";
import ColumnPickerDialog from "../components/common/ColumnPickerDialog";
import SortableTableHeader from "../components/common/SortableTableHeader";
import { usePersistentColumns } from "../utils/usePersistentColumns";
import { useColumnSort } from "../utils/useColumnSort";
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
  const [columnsOpen, setColumnsOpen] = useState(false);

  const requiredColumnKeys = new Set(["id", "name"]);
  const columnDefs = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "sku", label: "SKU" },
    { key: "price", label: "Price" },
    { key: "tax", label: "Tax" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
  ];
  const columnOrder = columnDefs.map((c) => c.key);
  const defaultVisibleColumns = ["id", "name", "sku", "price", "tax", "type", "status"];

  const [visibleColumns, setVisibleColumns, resetVisibleColumns] = usePersistentColumns({
    storageKey: "ba_products_visible_columns",
    columnOrder,
    defaultVisibleColumns,
    requiredKeys: Array.from(requiredColumnKeys),
  });

  const sortColumnDefs = columnDefs.map((c) => ({
    ...c,
    getValue:
      c.key === "price" ? (r) => Number(r?.price) || 0
      : c.key === "tax" ? (r) => Number(r?.taxRate) || 0
      : undefined,
  }));
  const { sortKey, sortDir, toggleSort, sortRows } = useColumnSort(sortColumnDefs);


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
        icon={<Package className="h-5 w-5 text-violet-600" />}
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
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-600"
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
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-600"
            >
              <option value="">All status</option>
              <option value="true">Active only</option>
              <option value="false">Inactive only</option>
            </select>
            <Button onClick={openCreate} className="h-9 shrink-0">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Item
            </Button>
          </>
        }
      />

      <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4">
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
              searchPlaceholder="Search items…"
              limit={limit}
              onLimitChange={setLimit}
              onColumnsClick={() => setColumnsOpen(true)}
            />
            {success && (
              <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
                {success}
              </div>
            )}
            {error && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>

          <div className="overflow-auto">
            <table className="min-w-max w-full text-[13px]">
              <thead className="text-left bg-slate-50/80">
                <tr className="border-y border-slate-200/80">
                  {visibleColumns.includes("id") ? <SortableTableHeader label="ID" columnKey="id" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} /> : null}
                  {visibleColumns.includes("name") ? <SortableTableHeader label="Name" columnKey="name" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} /> : null}
                  {visibleColumns.includes("sku") ? <SortableTableHeader label="SKU" columnKey="sku" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" /> : null}
                  {visibleColumns.includes("price") ? <SortableTableHeader label="Price" columnKey="price" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" className="hidden sm:table-cell" /> : null}
                  {visibleColumns.includes("tax") ? <SortableTableHeader label="Tax" columnKey="tax" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" /> : null}
                  {visibleColumns.includes("type") ? <SortableTableHeader label="Type" columnKey="type" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" /> : null}
                  {visibleColumns.includes("status") ? <SortableTableHeader label="Status" columnKey="status" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" /> : null}
                  <th className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-xs font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortRows(products).map((p, index) => {
                  const displayId = formatRecordDisplayId(p, { page, limit, index });
                  const typeLabel = String(p?.type || "PRODUCT").toUpperCase() === "SERVICE" ? "Service" : "Product";
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => navigate(`/items/${p.id}`)}
                    >
                      {visibleColumns.includes("id") ? <td className="py-2.5 px-3 font-mono text-xs text-slate-500 font-medium whitespace-nowrap" title={p.id}>{displayId}</td> : null}
                      {visibleColumns.includes("name") ? (
                        <td className="py-2.5 px-3 min-w-[240px]">
                          <div className="font-medium text-slate-900 leading-5">{p.name}</div>
                          {p.description && <div className="text-xs text-slate-400 truncate max-w-[200px] mt-0.5">{p.description}</div>}
                        </td>
                      ) : null}
                      {visibleColumns.includes("sku") ? <td className="hidden sm:table-cell py-2.5 px-3 text-slate-600 font-mono text-xs">{p.sku || "—"}</td> : null}
                      {visibleColumns.includes("price") ? <td className="hidden sm:table-cell py-2.5 px-3 text-right font-medium tabular-nums text-slate-800"><Money value={p.price || 0} /></td> : null}
                      {visibleColumns.includes("tax") ? <td className="hidden sm:table-cell py-2.5 px-3 text-slate-600">{p.taxRate != null ? `${(Number(p.taxRate) * 100).toFixed(1)}%` : "—"}</td> : null}
                      {visibleColumns.includes("type") ? (
                        <td className="hidden sm:table-cell py-2.5 px-3">
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{typeLabel}</span>
                        </td>
                      ) : null}
                      {visibleColumns.includes("status") ? (
                        <td className="hidden sm:table-cell py-2.5 px-3">
                          <StatusBadge status={p.isActive ? "ACTIVE" : "INACTIVE"} size="sm" />
                        </td>
                      ) : null}
                      <td className="hidden sm:table-cell py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <ActionsMenu
                          ariaLabel="Item actions"
                          items={[
                            { key: "open", label: "Open", onSelect: () => navigate(`/items/${p.id}`) },
                            { key: "edit", label: "Edit", onSelect: () => openEdit(p) },
                            { key: "delete", label: "Delete", tone: "danger", onSelect: () => handleDelete(p) },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {data && products.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No items yet"
                description="Add items to use in invoices"
                action={
                  <Button onClick={openCreate} className="h-9">
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add Item
                  </Button>
                }
              />
            ) : null}
          </div>

          {data?.meta && products.length > 0 && (
            <Pagination
              page={data.meta.page}
              limit={data.meta.limit}
              total={data.meta.total}
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>

      <ColumnPickerDialog
        open={columnsOpen}
        onOpenChange={setColumnsOpen}
        columnDefs={columnDefs}
        visibleColumns={visibleColumns}
        requiredColumnKeys={requiredColumnKeys}
        onToggle={(key) => {
          setVisibleColumns((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
          );
        }}
        onReset={resetVisibleColumns}
      />
    </div>
  );
}

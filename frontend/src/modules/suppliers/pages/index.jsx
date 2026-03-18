import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Truck } from "lucide-react";
import { api } from "../../../lib/api";
import Button from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import Pagination from "../../../components/common/Pagination";
import ListPageToolbar from "../../../components/common/ListPageToolbar";
import PageHeader from "../../../components/common/PageHeader";
import EmptyState from "../../../components/common/EmptyState";
import ColumnPickerDialog from "../../../components/common/ColumnPickerDialog";
import SortableTableHeader from "../../../components/common/SortableTableHeader";
import ActionsMenu from "../../../components/common/ActionsMenu";
import Money from "../../../components/common/money";
import { usePersistentColumns } from "../../../utils/usePersistentColumns";
import { useColumnSort } from "../../../utils/useColumnSort";

export default function SuppliersListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQ = searchParams.get("q") || "";
  const status = searchParams.get("status") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(10, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));

  const [q, setQ] = useState(urlQ);
  const [columnsOpen, setColumnsOpen] = useState(false);

  const requiredColumnKeys = new Set(["supplierName", "status"]);
  const columnDefs = [
    { key: "supplierName", label: "Supplier Name" },
    { key: "companyContact", label: "Company / Contact" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "outstanding", label: "Outstanding" },
    { key: "status", label: "Status" },
  ];
  const columnOrder = columnDefs.map((c) => c.key);
  const defaultVisibleColumns = ["supplierName", "companyContact", "email", "phone", "outstanding", "status"];

  const [visibleColumns, setVisibleColumns, resetVisibleColumns] = usePersistentColumns({
    storageKey: "ba_suppliers_visible_columns",
    columnOrder,
    defaultVisibleColumns,
    requiredKeys: Array.from(requiredColumnKeys),
  });

  const suppliersQuery = useQuery({
    queryKey: ["suppliers", { q: urlQ, status, page, limit }],
    queryFn: () => api.listSuppliers({ q: urlQ, status, page, limit }),
    staleTime: 20_000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteSupplier(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    },
  });

  const rawRows = suppliersQuery.data?.data || [];
  const meta = suppliersQuery.data?.meta || { page, limit, total: 0 };

  const supplierSortDefs = columnDefs.map((c) => ({
    ...c,
    getValue:
      c.key === "supplierName" ? (s) => s?.supplierName || s?.name || s?.companyName || ""
      : c.key === "companyContact" ? (s) => (s?.companyName || "") + " " + (s?.contactPerson || s?.contactName || "")
      : c.key === "outstanding" ? (s) => Number(s?.outstandingAmount ?? s?.outstandingBillsAmount ?? s?.balance ?? 0)
      : undefined,
  }));
  const { sortKey, sortDir, toggleSort, sortRows } = useColumnSort(supplierSortDefs);
  const rows = sortRows(rawRows);


  function setPage(p) {
    const next = new URLSearchParams(searchParams);
    if (p <= 1) next.delete("page");
    else next.set("page", String(p));
    setSearchParams(next, { replace: true });
  }

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value == null || value === "") next.delete(key);
    else next.set(key, String(value));
    next.delete("page");
    setSearchParams(next, { replace: true });
  }

  function setLimit(l) {
    const next = new URLSearchParams(searchParams);
    if (l === 20) next.delete("limit");
    else next.set("limit", String(l));
    next.delete("page");
    setSearchParams(next, { replace: true });
  }

  function displayName(s) {
    return s?.supplierName || s?.name || s?.companyName || s?.contactPerson || "\u2014";
  }

  function companyOrContact(s) {
    const a = s?.companyName || "";
    const b = s?.contactPerson || s?.contactName || "";
    if (a && b && String(a) !== String(b)) return `${a} / ${b}`;
    return a || b || "\u2014";
  }

  function outstandingValue(s) {
    for (const c of [s?.outstandingAmount, s?.outstandingBillsAmount, s?.outstandingBills, s?.balanceDue, s?.balance]) {
      const n = Number(c);
      if (Number.isFinite(n)) return n;
    }
    return null;
  }

  function statusBadgeClass(s) {
    const v = String(s || "").toUpperCase();
    if (v === "ACTIVE") return "inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800";
    if (v === "INACTIVE") return "inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700";
    return "inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700";
  }

  return (
    <div className="space-y-6 min-h-screen">
      <PageHeader
        title="Suppliers"
        subtitle="Manage your vendors and purchase relationships"
        icon={<Truck className="h-5 w-5 text-violet-600" />}
        actions={
          <>
            <select
              value={status}
              onChange={(e) => updateParam("status", e.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-600"
            >
              <option value="">All status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <Button onClick={() => navigate("/suppliers/new")} className="h-9 shrink-0">
              <Plus className="h-4 w-4 mr-1.5" />
              New Supplier
            </Button>
          </>
        }
      />

      <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4">
            {suppliersQuery.error ? (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {suppliersQuery.error?.message || "Failed to load suppliers"}
              </div>
            ) : null}

            <ListPageToolbar
              searchValue={q}
              onSearchChange={(v) => {
                setQ(v);
                updateParam("q", v);
              }}
              searchPlaceholder="Search suppliers\u2026"
              limit={limit}
              onLimitChange={setLimit}
              onColumnsClick={() => setColumnsOpen(true)}
            />
          </div>

          <div className="overflow-auto">
            <table className="min-w-max w-full text-[13px]">
              <thead className="text-left bg-slate-50/80">
                <tr className="border-y border-slate-200/80">
                  {visibleColumns.includes("supplierName") ? <SortableTableHeader label="Supplier Name" columnKey="supplierName" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} /> : null}
                  {visibleColumns.includes("companyContact") ? <SortableTableHeader label="Company / Contact" columnKey="companyContact" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} /> : null}
                  {visibleColumns.includes("email") ? <SortableTableHeader label="Email" columnKey="email" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" /> : null}
                  {visibleColumns.includes("phone") ? <SortableTableHeader label="Phone" columnKey="phone" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" /> : null}
                  {visibleColumns.includes("outstanding") ? <SortableTableHeader label="Outstanding" columnKey="outstanding" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" className="hidden sm:table-cell" /> : null}
                  {visibleColumns.includes("status") ? <SortableTableHeader label="Status" columnKey="status" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" /> : null}
                  <th className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-xs font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => {
                  const outstanding = outstandingValue(s);
                  return (
                    <tr
                      key={s.id}
                      className="border-b border-slate-100 cursor-pointer hover:bg-slate-50/80 transition-colors"
                      onClick={() => navigate(`/suppliers/${s.id}`)}
                    >
                      {visibleColumns.includes("supplierName") ? (
                        <td className="py-2.5 px-3 min-w-[240px]">
                          <div className="font-medium text-slate-900 leading-5">{displayName(s)}</div>
                          {s?.supplierNo || s?.supplierSeq ? <div className="text-xs text-slate-400 font-mono mt-0.5">{String(s.supplierNo || s.supplierSeq)}</div> : null}
                        </td>
                      ) : null}
                      {visibleColumns.includes("companyContact") ? <td className="py-2.5 px-3 whitespace-nowrap text-slate-600">{companyOrContact(s)}</td> : null}
                      {visibleColumns.includes("email") ? <td className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-slate-600">{s.email || "\u2014"}</td> : null}
                      {visibleColumns.includes("phone") ? <td className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-slate-600">{s.phone || "\u2014"}</td> : null}
                      {visibleColumns.includes("outstanding") ? (
                        <td className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-right tabular-nums font-medium text-slate-800">
                          {outstanding == null ? "\u2014" : <Money value={outstanding} />}
                        </td>
                      ) : null}
                      {visibleColumns.includes("status") ? (
                        <td className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap">
                          <span className={statusBadgeClass(s.status)}>{String(s.status || "\u2014")}</span>
                        </td>
                      ) : null}
                      <td className="hidden sm:table-cell py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <ActionsMenu
                          ariaLabel="Supplier actions"
                          items={[
                            { key: "view", label: "View", onSelect: () => navigate(`/suppliers/${s.id}`) },
                            { key: "edit", label: "Edit", onSelect: () => navigate(`/suppliers/${s.id}/edit`) },
                            { key: "delete", label: "Delete", tone: "danger", onSelect: () => { if (window.confirm(`Delete supplier "${displayName(s)}"? This cannot be undone.`)) deleteMutation.mutate(s.id); } },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!suppliersQuery.isLoading && rows.length === 0 ? (
              <EmptyState
                icon={Truck}
                title="No suppliers found"
                description="Create a supplier to track your vendor bills and payments"
                action={
                  <Button onClick={() => navigate("/suppliers/new")} className="h-9">
                    <Plus className="h-4 w-4 mr-1.5" />
                    New Supplier
                  </Button>
                }
              />
            ) : null}

            {meta?.total > 0 ? (
              <Pagination page={meta.page} limit={meta.limit} total={meta.total} onPageChange={setPage} />
            ) : null}
          </div>
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

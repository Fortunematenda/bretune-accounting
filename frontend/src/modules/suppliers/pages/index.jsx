import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Truck } from "lucide-react";
import { api } from "../../../lib/api";
import Button from "../../../components/ui/button";
import Input from "../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import Pagination from "../../../components/common/Pagination";
import ListPageToolbar from "../../../components/common/ListPageToolbar";
import SuppliersTable from "../components/SuppliersTable";
import { useColumnSort } from "../../../utils/useColumnSort";

function EmptyState({ onNew }) {
  return (
    <div className="py-14 text-center">
      <div className="inline-flex flex-col items-center gap-3">
        <div className="rounded-full bg-slate-100 p-4">
          <Truck className="h-8 w-8 text-slate-400" />
        </div>
        <div>
          <div className="text-sm font-medium text-slate-700">No suppliers found</div>
          <div className="text-sm text-slate-500">Create a supplier to track your vendor bills and payments.</div>
        </div>
        <Button onClick={onNew} className="bg-violet-600 hover:bg-violet-700">
          <Plus className="h-4 w-4 mr-2" />
          New Supplier
        </Button>
      </div>
    </div>
  );
}

export default function SuppliersListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQ = searchParams.get("q") || "";
  const status = searchParams.get("status") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(10, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));

  const [q, setQ] = useState(urlQ);

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

  const supplierSortDefs = [
    { key: "supplierName", label: "Supplier Name", getValue: (s) => s?.supplierName || s?.name || s?.companyName || "" },
    { key: "companyContact", label: "Company / Contact", getValue: (s) => (s?.companyName || "") + " " + (s?.contactPerson || s?.contactName || "") },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "outstandingBills", label: "Outstanding", getValue: (s) => s?.outstandingAmount ?? s?.outstandingBillsAmount ?? s?.balance ?? 0 },
    { key: "status", label: "Status" },
  ];
  const { sortKey, sortDir, toggleSort, sortRows } = useColumnSort(supplierSortDefs);
  const rows = sortRows(rawRows);

  const isEmpty = useMemo(() => !suppliersQuery.isLoading && Array.isArray(rows) && rows.length === 0, [rows, suppliersQuery.isLoading]);

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

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Suppliers</h1>
              <p className="mt-1 text-sm text-slate-500">Manage your vendors and purchase relationships</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={status}
                onChange={(e) => updateParam("status", e.target.value)}
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                <option value="">All status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>

              <Button onClick={() => navigate("/suppliers/new")} className="h-9 bg-violet-600 hover:bg-violet-700">
                <Plus className="h-4 w-4 mr-2" />
                New Supplier
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {suppliersQuery.error ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {suppliersQuery.error?.message || "Failed to load suppliers"}
            </div>
          ) : null}

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Supplier List</CardTitle>
            </CardHeader>
            <CardContent>
              <ListPageToolbar
                actionsItems={[{ key: "new", label: "New Supplier", onSelect: () => navigate("/suppliers/new") }]}
                searchValue={q}
                onSearchChange={(v) => {
                  setQ(v);
                  updateParam("q", v);
                }}
                searchPlaceholder="Search suppliers…"
                limit={limit}
                onLimitChange={setLimit}
              />
              <div className="mt-4">
              {isEmpty ? (
                <EmptyState onNew={() => navigate("/suppliers/new")} />
              ) : (
                <>
                  <SuppliersTable
                    rows={rows}
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={toggleSort}
                    loading={suppliersQuery.isLoading}
                    onRowClick={(s) => navigate(`/suppliers/${s.id}`)}
                    onView={(s) => navigate(`/suppliers/${s.id}`)}
                    onEdit={(s) => navigate(`/suppliers/${s.id}/edit`)}
                    onDelete={(s) => {
                      if (!s?.id) return;
                      const ok = window.confirm(`Delete supplier "${s.supplierName || s.name || "this supplier"}"? This cannot be undone.`);
                      if (!ok) return;
                      deleteMutation.mutate(s.id);
                    }}
                  />

                  {Array.isArray(rows) && rows.length > 0 ? (
                    <Pagination page={meta.page} limit={meta.limit} total={meta.total} onPageChange={setPage} />
                  ) : null}
                </>
              )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

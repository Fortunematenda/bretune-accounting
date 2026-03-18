import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus, Receipt } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import ListPageToolbar from "../components/common/ListPageToolbar";
import PageHeader from "../components/common/PageHeader";
import EmptyState from "../components/common/EmptyState";
import ExpenseFilters from "../components/expenses/ExpenseFilters";
import ExpenseSummaryCards from "../components/expenses/ExpenseSummaryCards";
import ExpenseStatusBadge from "../components/expenses/ExpenseStatusBadge";
import Pagination from "../components/common/Pagination";
import ColumnPickerDialog from "../components/common/ColumnPickerDialog";
import SortableTableHeader from "../components/common/SortableTableHeader";
import ActionsMenu from "../components/common/ActionsMenu";
import Money from "../components/common/money";
import { usePersistentColumns } from "../utils/usePersistentColumns";
import { useColumnSort } from "../utils/useColumnSort";
import { formatDateForDisplay } from "../lib/dateFormat";

function fmtKey(y, m) {
  return `${y}-${String(m).padStart(2, "0")}`;
}

export default function ExpensesIndexPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const status = searchParams.get("status") || "";
  const supplierId = searchParams.get("supplierId") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(10, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));

  const suppliersQuery = useQuery({
    queryKey: ["suppliers", { page: 1, limit: 1000 }],
    queryFn: () => api.listSuppliers({ page: 1, limit: 1000 }),
    staleTime: 60_000,
  });

  const categoriesQuery = useQuery({
    queryKey: ["expenseCategories"],
    queryFn: () => api.listExpenseCategories({ page: 1, limit: 1000 }),
    staleTime: 60_000,
  });

  const expensesQuery = useQuery({
    queryKey: ["expenses", { q, status, supplierId, categoryId, from, to, page, limit }],
    queryFn: () =>
      api.listExpenses({
        q,
        status,
        supplierId,
        categoryId,
        from,
        to,
        page,
        limit,
      }),
    staleTime: 10_000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteExpense(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  const suppliers = suppliersQuery.data?.data || [];
  const categories = categoriesQuery.data?.data || [];

  const suppliersById = useMemo(() => {
    const map = {};
    for (const s of suppliers) map[s.id] = s;
    return map;
  }, [suppliers]);

  const categoriesById = useMemo(() => {
    const map = {};
    for (const c of categories) map[c.id] = c;
    return map;
  }, [categories]);

  const rawRows = expensesQuery.data?.data || [];
  const meta = expensesQuery.data?.meta || { page, limit, total: 0 };

  const [columnsOpen, setColumnsOpen] = useState(false);

  const requiredColumnKeys = new Set(["date", "description"]);
  const columnDefs = [
    { key: "date", label: "Date" },
    { key: "description", label: "Description" },
    { key: "supplier", label: "Supplier" },
    { key: "category", label: "Category" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];
  const columnOrder = columnDefs.map((c) => c.key);
  const defaultVisibleColumns = ["date", "description", "supplier", "category", "amount", "status"];

  const [visibleColumns, setVisibleColumns, resetVisibleColumns] = usePersistentColumns({
    storageKey: "ba_expenses_visible_columns",
    columnOrder,
    defaultVisibleColumns,
    requiredKeys: Array.from(requiredColumnKeys),
  });

  const sortColumnDefs = columnDefs.map((c) => ({
    ...c,
    getValue:
      c.key === "amount" ? (r) => Number(r?.totalAmount ?? r?.amount) || 0
      : c.key === "date" ? (r) => r?.expenseDate || r?.date || ""
      : c.key === "supplier" ? (r) => r?.supplierName || suppliersById?.[r?.supplierId]?.supplierName || ""
      : c.key === "category" ? (r) => r?.categoryName || categoriesById?.[r?.categoryId]?.name || ""
      : undefined,
  }));
  const { sortKey, sortDir, toggleSort, sortRows } = useColumnSort(sortColumnDefs);

  const rows = rawRows;

  const [summary, setSummary] = useState({ totalAmount: 0, pending: 0, reimbursed: 0 });

  React.useEffect(() => {
    const list = Array.isArray(rows) ? rows : [];
    const totalAmount = list.reduce((acc, r) => acc + Number(r.totalAmount ?? r.amount ?? 0), 0);
    const pending = list.filter((r) => String(r.status || "").toUpperCase() === "DRAFT").length;
    const reimbursed = list.filter((r) => String(r.status || "").toUpperCase() === "REIMBURSED").length;
    setSummary({ totalAmount, pending, reimbursed });
  }, [rows]);

  function updateParams(patch) {
    const next = new URLSearchParams(searchParams);
    for (const [k, v] of Object.entries(patch || {})) {
      if (v == null || v === "") next.delete(k);
      else next.set(k, String(v));
    }
    next.delete("page");
    setSearchParams(next, { replace: true });
  }

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses"
        subtitle="Track expenses, approvals and reimbursements"
        icon={<Receipt className="h-5 w-5 text-violet-600" />}
        action={
          <Button onClick={() => navigate("/expenses/new")} className="h-9">
            <Plus className="h-4 w-4 mr-1.5" />
            New Expense
          </Button>
        }
      />

      <div>
        <ExpenseFilters
          status={status}
          supplierId={supplierId}
          categoryId={categoryId}
          from={from}
          to={to}
          suppliers={suppliers}
          categories={categories}
          onChange={updateParams}
        />
      </div>

      <ExpenseSummaryCards loading={expensesQuery.isLoading} totals={summary} />

      <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4">
            {expensesQuery.error ? (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {expensesQuery.error?.message || "Failed to load expenses"}
              </div>
            ) : null}

            <ListPageToolbar
              searchValue={q}
              onSearchChange={(v) => updateParams({ q: v })}
              searchPlaceholder="Search expenses…"
              limit={limit}
              onLimitChange={setLimit}
              onColumnsClick={() => setColumnsOpen(true)}
            />
          </div>

          <div className="overflow-auto">
            <table className="min-w-max w-full text-[13px]">
              <thead className="text-left bg-slate-50/80">
                <tr className="border-y border-slate-200/80">
                  {visibleColumns.includes("date") ? <SortableTableHeader label="Date" columnKey="date" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} /> : null}
                  {visibleColumns.includes("description") ? <SortableTableHeader label="Description" columnKey="description" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} /> : null}
                  {visibleColumns.includes("supplier") ? <SortableTableHeader label="Supplier" columnKey="supplier" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" /> : null}
                  {visibleColumns.includes("category") ? <SortableTableHeader label="Category" columnKey="category" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" /> : null}
                  {visibleColumns.includes("amount") ? <SortableTableHeader label="Amount" columnKey="amount" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" className="hidden sm:table-cell" /> : null}
                  {visibleColumns.includes("status") ? <SortableTableHeader label="Status" columnKey="status" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" /> : null}
                  <th className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-xs font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortRows(rows).map((e) => {
                  const supplierName = e?.supplierName || suppliersById?.[e?.supplierId]?.supplierName || "\u2014";
                  const categoryName = e?.categoryName || categoriesById?.[e?.categoryId]?.name || "\u2014";
                  return (
                    <tr
                      key={e.id}
                      className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => navigate(`/expenses/${e.id}`)}
                    >
                      {visibleColumns.includes("date") ? <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{formatDateForDisplay(e.expenseDate || e.date)}</td> : null}
                      {visibleColumns.includes("description") ? (
                        <td className="py-2.5 px-3 min-w-[200px]">
                          <div className="font-medium text-slate-900 leading-5">{e.description || "\u2014"}</div>
                        </td>
                      ) : null}
                      {visibleColumns.includes("supplier") ? <td className="hidden sm:table-cell py-2.5 px-3 text-slate-600">{supplierName}</td> : null}
                      {visibleColumns.includes("category") ? <td className="hidden sm:table-cell py-2.5 px-3 text-slate-600">{categoryName}</td> : null}
                      {visibleColumns.includes("amount") ? <td className="hidden sm:table-cell py-2.5 px-3 text-right font-medium tabular-nums text-slate-800"><Money value={e.totalAmount ?? e.amount} /></td> : null}
                      {visibleColumns.includes("status") ? (
                        <td className="hidden sm:table-cell py-2.5 px-3">
                          <ExpenseStatusBadge status={e.status} />
                        </td>
                      ) : null}
                      <td className="hidden sm:table-cell py-2.5 px-3 text-right" onClick={(ev) => ev.stopPropagation()}>
                        <ActionsMenu
                          ariaLabel="Expense actions"
                          items={[
                            { key: "view", label: "View", onSelect: () => navigate(`/expenses/${e.id}`) },
                            { key: "edit", label: "Edit", onSelect: () => navigate(`/expenses/${e.id}/edit`) },
                            { key: "delete", label: "Delete", tone: "danger", onSelect: () => { if (window.confirm("Delete this expense? This cannot be undone.")) deleteMutation.mutate(e.id); } },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!expensesQuery.isLoading && rows.length === 0 ? (
              <EmptyState
                icon={Receipt}
                title="No expenses found"
                description="Record your first expense to start tracking"
                action={
                  <Button onClick={() => navigate("/expenses/new")} className="h-9">
                    <Plus className="h-4 w-4 mr-1.5" />
                    New Expense
                  </Button>
                }
              />
            ) : null}

            {meta?.total ? <Pagination page={meta.page} limit={meta.limit} total={meta.total} onPageChange={setPage} /> : null}
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

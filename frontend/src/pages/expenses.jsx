import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import ListPageToolbar from "../components/common/ListPageToolbar";
import ExpenseFilters from "../components/expenses/ExpenseFilters";
import ExpenseSummaryCards from "../components/expenses/ExpenseSummaryCards";
import ExpenseTable from "../components/expenses/ExpenseTable";
import Pagination from "../components/common/Pagination";

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
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Expenses</h1>
              <p className="mt-1 text-sm text-slate-500">Track expenses, approvals and reimbursements</p>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={() => navigate("/expenses/new")} className="h-9 bg-violet-600 hover:bg-violet-700">
                <Plus className="h-4 w-4 mr-2" />
                New Expense
              </Button>
            </div>
          </div>

          <div className="mt-4">
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

          <div className="mt-5">
            <ExpenseSummaryCards loading={expensesQuery.isLoading} totals={summary} />
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {expensesQuery.error ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {expensesQuery.error?.message || "Failed to load expenses"}
            </div>
          ) : null}

          <ListPageToolbar
            searchValue={q}
            onSearchChange={(v) => updateParams({ q: v })}
            searchPlaceholder="Search expenses…"
            limit={limit}
            onLimitChange={setLimit}
          />

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            {expensesQuery.isLoading ? (
              <div className="p-6 text-sm text-slate-600">Loading…</div>
            ) : rows.length === 0 ? (
              <div className="p-6 text-sm text-slate-600">No expenses found.</div>
            ) : (
              <ExpenseTable
                rows={rows}
                suppliersById={suppliersById}
                categoriesById={categoriesById}
                onDelete={(e) => {
                  if (!e?.id) return;
                  const ok = window.confirm("Delete this expense? This cannot be undone.");
                  if (!ok) return;
                  deleteMutation.mutate(e.id);
                }}
              />
            )}

            {meta?.total ? <Pagination page={meta.page} limit={meta.limit} total={meta.total} onPageChange={setPage} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

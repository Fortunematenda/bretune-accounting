import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FileText, Plus } from "lucide-react";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import Select from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import ListPageToolbar from "../components/common/ListPageToolbar";
import PageHeader from "../components/common/PageHeader";
import EmptyState from "../components/common/EmptyState";
import BillSummaryCard from "../components/bills/BillSummaryCard";
import BillStatusBadge from "../components/bills/BillStatusBadge";
import Pagination from "../components/common/Pagination";
import ColumnPickerDialog from "../components/common/ColumnPickerDialog";
import SortableTableHeader from "../components/common/SortableTableHeader";
import ActionsMenu from "../components/common/ActionsMenu";
import Money from "../components/common/money";
import { usePersistentColumns } from "../utils/usePersistentColumns";
import { useColumnSort } from "../utils/useColumnSort";
import { formatDateForDisplay } from "../lib/dateFormat";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "DRAFT", label: "Draft" },
  { value: "OPEN", label: "Awaiting Payment" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "PAID", label: "Paid" },
];

function isOverdueBill(bill) {
  if (!bill) return false;
  if (String(bill.status || "").toUpperCase() !== "OPEN") return false;
  if (!bill.dueDate) return false;
  const d = new Date(bill.dueDate);
  if (Number.isNaN(d.getTime())) return false;
  return d < new Date();
}

async function fetchCount(params) {
  const res = await api.listBills({ ...params, page: 1, limit: 1 });
  return Number(res?.meta?.total || 0);
}

export default function BillsIndexPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const status = searchParams.get("status") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(10, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [summary, setSummary] = useState({ total: 0, awaiting: 0, overdue: 0, paidThisMonth: 0 });
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [overdueMode, setOverdueMode] = useState({ enabled: false, total: 0, rows: [] });
  const [columnsOpen, setColumnsOpen] = useState(false);

  const requiredColumnKeys = new Set(["billNumber", "supplier", "status"]);
  const columnDefs = [
    { key: "billNumber", label: "Bill #" },
    { key: "supplier", label: "Supplier" },
    { key: "issueDate", label: "Issue Date" },
    { key: "dueDate", label: "Due Date" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];
  const columnOrder = columnDefs.map((c) => c.key);
  const defaultVisibleColumns = ["billNumber", "supplier", "issueDate", "dueDate", "amount", "status"];

  const [visibleColumns, setVisibleColumns, resetVisibleColumns] = usePersistentColumns({
    storageKey: "ba_bills_visible_columns",
    columnOrder,
    defaultVisibleColumns,
    requiredKeys: Array.from(requiredColumnKeys),
  });

  const sortColumnDefs = columnDefs.map((c) => ({
    ...c,
    getValue:
      c.key === "amount" ? (r) => Number(r?.totalAmount) || 0
      : c.key === "supplier" ? (r) => r?.vendorName || ""
      : c.key === "issueDate" ? (r) => r?.billDate || ""
      : c.key === "dueDate" ? (r) => r?.dueDate || ""
      : undefined,
  }));
  const { sortKey, sortDir, toggleSort, sortRows } = useColumnSort(sortColumnDefs);

  function formatBillDisplayNumber(bill) {
    if (!bill) return "\u2014";
    if (bill.reference) return String(bill.reference);
    const n = Number(bill.billNumber);
    if (!Number.isFinite(n) || n <= 0) return "\u2014";
    return `BILL-${String(n).padStart(4, "0")}`;
  }

  const currentMonthKey = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (status === "OVERDUE") {
        const open = [];
        const per = 1000;
        let p = 1;
        let totalPages = 1;

        while (p <= totalPages) {
          const res = await api.listBills({ page: p, limit: per, q, status: "OPEN" });
          const batch = Array.isArray(res?.data) ? res.data : [];
          open.push(...batch);

          totalPages = Number(res?.meta?.totalPages || 1);
          if (!Number.isFinite(totalPages) || totalPages < 1) totalPages = 1;
          p += 1;
          if (p > 10) break;
        }

        const filtered = open.filter(isOverdueBill);
        const total = filtered.length;
        const start = (page - 1) * limit;
        const rows = filtered.slice(start, start + limit);

        setOverdueMode({ enabled: true, total, rows });
        setData({ data: rows, meta: { total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) } });
        return;
      }

      const params = { page, limit };
      if (q) params.q = q;
      if (status) params.status = status;

      const res = await api.listBills(params);
      setOverdueMode({ enabled: false, total: 0, rows: [] });
      setData(res);
    } catch (e) {
      setError(e?.message || "Failed to load bills");
    } finally {
      setLoading(false);
    }
  }, [page, limit, q, status]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let mounted = true;
    setSummaryLoading(true);

    Promise.all([
      fetchCount(q ? { q } : {}),
      fetchCount({ ...(q ? { q } : {}), status: "OPEN" }),
      (async () => {
        const open = [];
        const per = 1000;
        let p = 1;
        let totalPages = 1;

        while (p <= totalPages) {
          const res = await api.listBills({ page: p, limit: per, q, status: "OPEN" });
          const batch = Array.isArray(res?.data) ? res.data : [];
          open.push(...batch);

          totalPages = Number(res?.meta?.totalPages || 1);
          if (!Number.isFinite(totalPages) || totalPages < 1) totalPages = 1;
          p += 1;
          if (p > 10) break;
        }

        return open.filter(isOverdueBill).length;
      })(),
      (async () => {
        const paid = [];
        const per = 1000;
        let p = 1;
        let totalPages = 1;

        while (p <= totalPages) {
          const res = await api.listBills({ page: p, limit: per, q, status: "PAID" });
          const batch = Array.isArray(res?.data) ? res.data : [];
          paid.push(...batch);

          totalPages = Number(res?.meta?.totalPages || 1);
          if (!Number.isFinite(totalPages) || totalPages < 1) totalPages = 1;
          p += 1;
          if (p > 10) break;
        }

        return paid.filter((b) => String(b?.billDate || "").slice(0, 7) === currentMonthKey).length;
      })(),
    ])
      .then(([total, awaiting, overdue, paidThisMonth]) => {
        if (!mounted) return;
        setSummary({ total, awaiting, overdue, paidThisMonth });
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setSummaryLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [q, currentMonthKey]);

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

  async function onDelete(bill) {
    if (!bill) return;
    if (!window.confirm("Delete this bill? This cannot be undone.")) return;

    setError(null);
    try {
      await api.deleteBill(bill.id);
      load();
    } catch (e) {
      setError(e?.message || "Failed to delete bill");
    }
  }

  const rawRows = data?.data || [];
  const rows = rawRows;
  const total = Number(data?.meta?.total || 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bills"
        subtitle="Track and manage supplier bills"
        icon={<FileText className="h-5 w-5 text-violet-600" />}
        actions={
          <>
            <Select
              value={status}
              onChange={(e) => {
                const next = e.target.value;
                const nextParams = new URLSearchParams(searchParams);
                if (next) nextParams.set("status", next);
                else nextParams.delete("status");
                nextParams.delete("page");
                setSearchParams(nextParams, { replace: true });
              }}
              className="h-9 w-44"
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </Select>
            <Button onClick={() => navigate("/bills/new")} className="h-9">
              <Plus className="h-4 w-4 mr-1.5" />
              New Bill
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <BillSummaryCard title="Total Bills" value={summaryLoading ? "…" : String(summary.total)} />
        <BillSummaryCard title="Awaiting Payment" value={summaryLoading ? "…" : String(summary.awaiting)} />
        <BillSummaryCard title="Overdue" value={summaryLoading ? "…" : String(summary.overdue)} />
        <BillSummaryCard title="Paid This Month" value={summaryLoading ? "…" : String(summary.paidThisMonth)} />
      </div>

      <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4">
            {error ? (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            <ListPageToolbar
              searchValue={q}
              onSearchChange={(next) => {
                const nextParams = new URLSearchParams(searchParams);
                if (next) nextParams.set("q", next);
                else nextParams.delete("q");
                nextParams.delete("page");
                setSearchParams(nextParams, { replace: true });
              }}
              searchPlaceholder="Search bills…"
              limit={limit}
              onLimitChange={setLimit}
              onColumnsClick={() => setColumnsOpen(true)}
            />
          </div>

          <div className="overflow-auto">
            <table className="min-w-max w-full text-[13px]">
              <thead className="text-left bg-slate-50/80">
                <tr className="border-y border-slate-200/80">
                  {visibleColumns.includes("billNumber") ? <SortableTableHeader label="Bill #" columnKey="billNumber" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} /> : null}
                  {visibleColumns.includes("supplier") ? <SortableTableHeader label="Supplier" columnKey="supplier" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} /> : null}
                  {visibleColumns.includes("issueDate") ? <SortableTableHeader label="Issue Date" columnKey="issueDate" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" /> : null}
                  {visibleColumns.includes("dueDate") ? <SortableTableHeader label="Due Date" columnKey="dueDate" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" /> : null}
                  {visibleColumns.includes("amount") ? <SortableTableHeader label="Amount" columnKey="amount" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" className="hidden sm:table-cell" /> : null}
                  {visibleColumns.includes("status") ? <SortableTableHeader label="Status" columnKey="status" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" /> : null}
                  <th className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-xs font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortRows(rows).map((b) => {
                  const due = b?.dueDate ? new Date(b.dueDate) : null;
                  const overdue = b?.status === "OPEN" && due && !Number.isNaN(due.getTime()) && due < new Date();
                  return (
                    <tr
                      key={b.id}
                      className={`border-b border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer ${overdue ? "border-l-4 border-l-red-300" : ""}`}
                      onClick={() => navigate(`/bills/${b.id}`)}
                    >
                      {visibleColumns.includes("billNumber") ? <td className="py-2.5 px-3 font-mono text-xs text-slate-500 font-medium whitespace-nowrap">{formatBillDisplayNumber(b)}</td> : null}
                      {visibleColumns.includes("supplier") ? (
                        <td className="py-2.5 px-3 min-w-[200px]">
                          <div className="font-medium text-slate-900 leading-5">{b.vendorName || "\u2014"}</div>
                        </td>
                      ) : null}
                      {visibleColumns.includes("issueDate") ? <td className="hidden sm:table-cell py-2.5 px-3 text-slate-500 whitespace-nowrap">{formatDateForDisplay(b.billDate)}</td> : null}
                      {visibleColumns.includes("dueDate") ? <td className="hidden sm:table-cell py-2.5 px-3 text-slate-500 whitespace-nowrap">{formatDateForDisplay(b.dueDate)}</td> : null}
                      {visibleColumns.includes("amount") ? <td className="hidden sm:table-cell py-2.5 px-3 text-right font-medium tabular-nums text-slate-800"><Money value={b.totalAmount} /></td> : null}
                      {visibleColumns.includes("status") ? (
                        <td className="hidden sm:table-cell py-2.5 px-3">
                          <BillStatusBadge status={b.status} overdue={overdue} />
                        </td>
                      ) : null}
                      <td className="hidden sm:table-cell py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <ActionsMenu
                          ariaLabel="Bill actions"
                          items={[
                            { key: "view", label: "View", onSelect: () => navigate(`/bills/${b.id}`) },
                            { key: "edit", label: "Edit", onSelect: () => navigate(`/bills/${b.id}/edit`) },
                            { key: "delete", label: "Delete", tone: "danger", onSelect: () => onDelete?.(b) },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {data && rows.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No bills found"
                description="Record your first bill to track supplier expenses"
                action={
                  <Button onClick={() => navigate("/bills/new")} className="h-9">
                    <Plus className="h-4 w-4 mr-1.5" />
                    New Bill
                  </Button>
                }
              />
            ) : null}

            {total > 0 && (
              <Pagination page={page} limit={limit} total={total} onPageChange={setPage} />
            )}
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

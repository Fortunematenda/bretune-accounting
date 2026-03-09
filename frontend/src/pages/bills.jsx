import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import Select from "../components/ui/select";
import ListPageToolbar from "../components/common/ListPageToolbar";
import BillTable from "../components/bills/BillTable";
import BillSummaryCard from "../components/bills/BillSummaryCard";
import Pagination from "../components/common/Pagination";

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
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Bills</h1>
              <p className="mt-1 text-sm text-slate-500">Track and manage supplier bills</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
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
                className="h-9 w-52"
              >
                {STATUS_FILTERS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>

              <Button onClick={() => navigate("/bills/new")} className="h-9 bg-violet-600 hover:bg-violet-700">
                <Plus className="h-4 w-4 mr-2" />
                New Bill
              </Button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            <BillSummaryCard title="Total Bills" value={summaryLoading ? "…" : String(summary.total)} />
            <BillSummaryCard title="Awaiting Payment" value={summaryLoading ? "…" : String(summary.awaiting)} />
            <BillSummaryCard title="Overdue" value={summaryLoading ? "…" : String(summary.overdue)} />
            <BillSummaryCard title="Paid This Month" value={summaryLoading ? "…" : String(summary.paidThisMonth)} />
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {error ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <ListPageToolbar
            onAddNew={() => navigate("/bills/new")}
            addNewLabel="New Bill"
            searchValue={q}
            onSearchChange={(next) => {
              const nextParams = new URLSearchParams(searchParams);
              if (next) nextParams.set("q", next);
              else nextParams.delete("q");
              nextParams.delete("page");
              setSearchParams(nextParams, { replace: true });
            }}
            searchPlaceholder="Search supplier, reference, description…"
            limit={limit}
            onLimitChange={setLimit}
          />

          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            {loading ? (
              <div className="p-6 text-sm text-slate-600">Loading…</div>
            ) : rows.length === 0 ? (
              <div className="p-6 text-sm text-slate-600">No bills found.</div>
            ) : (
              <BillTable rows={rows} onDelete={onDelete} />
            )}

            <Pagination page={page} limit={limit} total={total} onPageChange={setPage} />
          </div>
        </div>
      </div>
    </div>
  );
}

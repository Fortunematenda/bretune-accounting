import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Pagination from "../components/common/Pagination";
import ListPageToolbar from "../components/common/ListPageToolbar";
import PageHeader from "../components/common/PageHeader";
import Button from "../components/ui/button";
import { BookOpen, Plus } from "lucide-react";
import ActionsMenu from "../components/common/ActionsMenu";
import { formatRecordDisplayId } from "../lib/utils";

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

const SOURCE_LABELS = {
  INVOICE: "Invoice",
  PAYMENT: "Payment",
  BILL: "Bill",
  SUPPLIER_PAYMENT: "Supplier Payment",
  EXPENSE: "Expense",
  MANUAL: "General Journal",
};

export default function JournalEntriesPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sourceType, setSourceType] = useState("");
  const [status, setStatus] = useState("");


  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit };
      if (from) params.from = from;
      if (to) params.to = to;
      if (sourceType) params.sourceType = sourceType;
      if (status) params.status = status;
      const res = await api.listJournalEntries(params);
      setData(res);
    } catch (e) {
      setError(e.message || "Failed to load journal entries");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, from, to, sourceType, status]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6 min-h-screen">
      <PageHeader
        title="Journal Entries"
        subtitle="Journal entries from invoices, payments, bills, and manual entries (including drafts)"
        icon={<BookOpen className="h-6 w-6 text-violet-600" />}
        action={
          <Button onClick={() => navigate("/journal/new")} className="h-9 shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            New Journal Entry
          </Button>
        }
      />

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Journal Entry List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-2.5">
            <ListPageToolbar limit={limit} onLimitChange={setLimit} />
            <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 px-3 text-sm"
            placeholder="From"
          />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 px-3 text-sm"
            placeholder="To"
          />
          <select
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 px-3 text-sm"
          >
            <option value="">All sources</option>
            {Object.entries(SOURCE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 px-3 text-sm"
          >
            <option value="">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="POSTED">Posted</option>
            <option value="REVERSED">Reversed</option>
          </select>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Memo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Source
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
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                        Loading…
                      </td>
                    </tr>
                  ) : !data?.data?.length ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                        No journal entries. Create invoices, record payments, or add manual entries.
                      </td>
                    </tr>
                  ) : (
                    (data.data || []).map((entry, index) => {
                      const displayId = formatRecordDisplayId(entry, {
                        page: data?.meta?.page ?? page,
                        limit: data?.meta?.limit ?? limit,
                        index,
                      });
                      return (
                      <tr key={entry.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-mono text-sm text-violet-600 font-medium" title={entry.id}>
                          {displayId}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">
                          {formatDate(entry.date)}
                        </td>
                        <td className="px-4 py-3 text-slate-900 max-w-xs truncate">
                          {entry.memo || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                            {SOURCE_LABELS[entry.sourceType] || entry.sourceType || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              entry.status === "REVERSED"
                                ? "bg-amber-100 text-amber-800"
                                : entry.status === "DRAFT" || entry.status === "PENDING_APPROVAL"
                                  ? "bg-slate-100 text-slate-700"
                                  : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end">
                            <ActionsMenu
                              ariaLabel="Journal entry actions"
                              items={[
                                { key: "view", label: "View", onSelect: () => navigate(`/journal/${entry.id}`) },
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
            {data?.meta && data.meta.totalPages > 1 && (
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

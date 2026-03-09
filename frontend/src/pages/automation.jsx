import React, { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import Pagination from "../components/common/Pagination";
import { Zap, Mail, Repeat } from "lucide-react";

function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

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

export default function AutomationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const outboxPage = Math.max(1, parseInt(searchParams.get("outboxPage") || "1", 10));
  const runsPage = Math.max(1, parseInt(searchParams.get("runsPage") || "1", 10));
  const outboxStatus = searchParams.get("outboxStatus") ?? "";

  const [outbox, setOutbox] = useState(null);
  const [runs, setRuns] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    const outboxParams = { page: outboxPage, limit: 15 };
    if (outboxStatus) outboxParams.status = outboxStatus;
    Promise.all([
      api.listEmailOutbox(outboxParams),
      api.listRecurringRuns({ page: runsPage, limit: 15 }),
    ])
      .then(([o, r]) => {
        setOutbox(o);
        setRuns(r);
      })
      .catch((e) => setError(e.message || "Failed to load automation data"))
      .finally(() => setLoading(false));
  }, [outboxPage, runsPage, outboxStatus]);

  useEffect(() => {
    load();
  }, [load]);

  function setOutboxPage(p) {
    const next = new URLSearchParams(searchParams);
    if (p <= 1) next.delete("outboxPage");
    else next.set("outboxPage", String(p));
    setSearchParams(next, { replace: true });
  }

  function setRunsPage(p) {
    const next = new URLSearchParams(searchParams);
    if (p <= 1) next.delete("runsPage");
    else next.set("runsPage", String(p));
    setSearchParams(next, { replace: true });
  }

  const outboxItems = outbox?.data || [];
  const runItems = runs?.data || [];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Automation</h1>
              <p className="mt-1 text-sm text-slate-500">
                Email queue and recurring invoice execution history
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Email Outbox */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-violet-600" />
                  <h2 className="text-sm font-semibold text-slate-900">Email Outbox</h2>
                </div>
                <select
                  value={outboxStatus}
                  onChange={(e) => {
                    const next = new URLSearchParams(searchParams);
                    const v = e.target.value;
                    if (v) next.set("outboxStatus", v);
                    else next.delete("outboxStatus");
                    next.delete("outboxPage");
                    setSearchParams(next, { replace: true });
                  }}
                  className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700"
                >
                  <option value="">All status</option>
                  <option value="PENDING">Pending</option>
                  <option value="SENT">Sent</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        To
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Type
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Status
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Attempts
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {loading && !outbox ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                          Loading…
                        </td>
                      </tr>
                    ) : outboxItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                          No emails in queue
                        </td>
                      </tr>
                    ) : (
                      outboxItems.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-2.5">
                            <div className="flex flex-col min-w-0">
                              <span className="font-medium text-slate-900 truncate max-w-[160px]">{m.to}</span>
                              {m.client && (
                                <Link
                                  to={`/customers/${m.clientId}`}
                                  className="text-xs text-violet-600 hover:text-violet-800 truncate max-w-[160px]"
                                >
                                  {m.client.companyName || m.client.contactName}
                                </Link>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            <div className="flex flex-col gap-0.5">
                              <span className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 w-fit">
                                {m.documentType}
                              </span>
                              {m.invoice && (
                                <Link
                                  to={`/invoices/${m.invoice.id}`}
                                  className="text-xs text-violet-600 hover:text-violet-800"
                                >
                                  {m.invoice.invoiceNumber}
                                </Link>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                m.status === "SENT"
                                  ? "bg-green-100 text-green-800"
                                  : m.status === "FAILED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {m.status}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-slate-600">{m.attempts ?? 0}</td>
                          <td className="px-4 py-2.5 text-slate-600 text-xs">
                            {formatDateTime(m.createdAt)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {outbox?.meta && outboxItems.length > 0 && outbox.meta.totalPages > 1 && (
                <Pagination
                  page={outbox.meta.page}
                  limit={outbox.meta.limit}
                  total={outbox.meta.total}
                  onPageChange={setOutboxPage}
                />
              )}
            </div>

            {/* Recurring Runs */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3 flex items-center gap-2">
                <Repeat className="h-5 w-5 text-violet-600" />
                <h2 className="text-sm font-semibold text-slate-900">Recurring Invoice Runs</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Run at
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Template
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Status
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Invoice
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Next run
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {loading && !runs ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                          Loading…
                        </td>
                      </tr>
                    ) : runItems.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                          No runs yet
                        </td>
                      </tr>
                    ) : (
                      runItems.map((x) => (
                        <tr key={x.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-2.5 text-slate-600 text-xs">
                            {formatDateTime(x.runAt)}
                          </td>
                          <td className="px-4 py-2.5">
                            <Link
                              to={`/recurring`}
                              className="font-medium text-violet-600 hover:text-violet-800"
                            >
                              {x.recurringInvoice?.templateName || "—"}
                            </Link>
                          </td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                x.status === "SUCCESS"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {x.status}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            {x.invoiceId ? (
                              <Link
                                to={`/invoices/${x.invoiceId}`}
                                className="text-violet-600 hover:text-violet-800 text-xs"
                              >
                                View invoice
                              </Link>
                            ) : (
                              <span className="text-slate-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-2.5 text-slate-600 text-xs">
                            {formatDate(x.recurringInvoice?.nextRunDate)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {runs?.meta && runItems.length > 0 && runs.meta.totalPages > 1 && (
                <Pagination
                  page={runs.meta.page}
                  limit={runs.meta.limit}
                  total={runs.meta.total}
                  onPageChange={setRunsPage}
                />
              )}
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/30 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-violet-100 p-2">
                <Zap className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">How it works</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Emails are sent automatically every minute. Recurring invoices are generated every 5 minutes.
                  Pending and failed emails will retry with exponential backoff. Check the dashboard for pending
                  or failed email counts.
                </p>
                <Link
                  to="/dashboard"
                  className="mt-2 inline-block text-sm font-medium text-violet-600 hover:text-violet-800"
                >
                  View dashboard →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

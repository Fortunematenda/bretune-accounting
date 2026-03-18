import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { getAccessToken } from "../features/auth/token-store";

const API_BASE = import.meta.env.VITE_API_URL || "/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import Money from "../components/common/money";
import { FileText, Plus } from "lucide-react";
import { cn, formatRecordDisplayId } from "../lib/utils";
import EmptyState from "../components/common/EmptyState";
import StatusBadge from "../components/common/StatusBadge";
import ColumnPickerDialog from "../components/common/ColumnPickerDialog";
import ListPageToolbar from "../components/common/ListPageToolbar";
import PageHeader from "../components/common/PageHeader";
import Pagination from "../components/common/Pagination";
import { usePersistentColumns } from "../utils/usePersistentColumns";
import ActionsMenu from "../components/common/ActionsMenu";
import QuoteStatusBadge from "../components/quotes/QuoteStatusBadge";
import { formatDateForDisplay } from "../lib/dateFormat";

function formatSeq(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return "—";
  return String(v).padStart(3, "0");
}

function formatCustomerName(c) {
  if (!c) return "—";
  return c.companyName || c.contactName || "—";
}

const STATUS_FILTERS = [
  { key: "", label: "All" },
  { key: "DRAFT", label: "Draft" },
  { key: "SENT", label: "Sent" },
  { key: "ACCEPTED", label: "Accepted" },
  { key: "REJECTED", label: "Rejected" },
];

function QuoteRow({ q, visibleColumns, onAction, navigate, displayId }) {
  const status = String(q.status || "").toUpperCase();
  const canSend = status === "DRAFT";
  const canAccept = status === "SENT";
  const canReject = status === "SENT";
  const isConverted = Boolean(q.invoice?.id);
  const canConvert = status === "ACCEPTED" && !isConverted;

  return (
    <tr
      className="border-b border-slate-100 cursor-pointer hover:bg-slate-50/80 transition-colors group"
      onClick={() => navigate(`/quotes/${q.id}`)}
    >
      {visibleColumns.includes("id") ? (
        <td className="py-2.5 px-3 font-mono text-xs text-slate-500 font-medium whitespace-nowrap" title={q.id}>{displayId}</td>
      ) : null}
      {visibleColumns.includes("quoteNumber") ? (
        <td className="py-2.5 px-3 font-medium text-slate-900">{q.quoteNumber}</td>
      ) : null}
      {visibleColumns.includes("customer") ? (
        <td className="py-2.5 px-3 text-slate-600">{formatCustomerName(q.client)}</td>
      ) : null}
      {visibleColumns.includes("status") ? (
        <td className="py-2.5 px-3">
          <StatusBadge status={q.status} size="sm" />
        </td>
      ) : null}
      {visibleColumns.includes("expiryDate") ? (
        <td className="py-2.5 px-3 text-slate-500">{formatDateForDisplay(q.expiryDate)}</td>
      ) : null}
      {visibleColumns.includes("totalAmount") ? (
        <td className="py-2.5 px-3 text-right tabular-nums font-medium text-slate-800">
          <Money value={Number(q.totalAmount || 0)} />
        </td>
      ) : null}

      <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
        <ActionsMenu
          ariaLabel="Quote actions"
          items={[
            { key: "open", label: "Open", onSelect: () => navigate(`/quotes/${q.id}`) },
            {
              key: "pdf",
              label: "Download PDF",
              onSelect: () => onAction("pdf", q),
            },
            { key: "edit", label: "Edit", onSelect: () => navigate(`/quotes/${q.id}`) },
            {
              key: "send",
              label: "Send quote",
              disabled: !canSend,
              hint: !canSend ? "Only draft quotes can be sent" : "",
              onSelect: () => onAction("send", q),
            },
            {
              key: "accept",
              label: "Accept",
              disabled: !canAccept,
              hint: !canAccept ? "Only sent quotes can be accepted" : "",
              onSelect: () => onAction("accept", q),
            },
            {
              key: "reject",
              label: "Reject",
              disabled: !canReject,
              hint: !canReject ? "Only sent quotes can be rejected" : "",
              onSelect: () => onAction("reject", q),
            },
            {
              key: "convert",
              label: isConverted ? `Converted to invoice ${q.invoice?.invoiceNumber ?? ""}` : "Convert to invoice",
              disabled: !canConvert,
              hint: isConverted ? "Already converted" : !canConvert ? "Only accepted quotes can be converted" : "",
              onSelect: () => onAction("convert", q),
            },
          ]}
        />
      </td>
    </tr>
  );
}

function QuoteCard({ q, onAction, navigate, displayId }) {
  const status = String(q.status || "").toUpperCase();
  const canSend = status === "DRAFT";
  const canAccept = status === "SENT";
  const canReject = status === "SENT";
  const isConverted = Boolean(q.invoice?.id);
  const canConvert = status === "ACCEPTED" && !isConverted;

  const menuItems = [
    { key: "open", label: "Open", onSelect: () => navigate(`/quotes/${q.id}`) },
    { key: "pdf", label: "Download PDF", onSelect: () => onAction("pdf", q) },
    { key: "edit", label: "Edit", onSelect: () => navigate(`/quotes/${q.id}`) },
    canSend && { key: "send", label: "Send", onSelect: () => onAction("send", q) },
    canAccept && { key: "accept", label: "Accept", onSelect: () => onAction("accept", q) },
    canReject && { key: "reject", label: "Reject", onSelect: () => onAction("reject", q) },
    canConvert && { key: "convert", label: "Convert to invoice", onSelect: () => onAction("convert", q) },
    isConverted && {
      key: "view-invoice",
      label: `View invoice ${q.invoice?.invoiceNumber ?? ""}`,
      onSelect: () => q.invoice?.id && navigate(`/invoices/${q.invoice.id}`),
    },
  ].filter(Boolean);

  return (
    <div
      className="rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
      onClick={() => navigate(`/quotes/${q.id}`)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-slate-900">{q.quoteNumber}</span>
            <StatusBadge status={q.status} size="sm" />
          </div>
          <div className="mt-1 text-sm text-slate-600 truncate">{formatCustomerName(q.client)}</div>
          <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
            <span>Expires {formatDateForDisplay(q.expiryDate)}</span>
            <span className="font-medium text-slate-700 tabular-nums">
              <Money value={Number(q.totalAmount || 0)} />
            </span>
            <span className="font-mono text-slate-500 font-medium" title={q.id}>{displayId}</span>
          </div>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <ActionsMenu ariaLabel="Quote actions" items={menuItems} />
        </div>
      </div>
    </div>
  );
}

export default function QuotesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const clientId = searchParams.get("clientId") || "";
  const statusFilter = searchParams.get("status") || "";
  const urlQ = searchParams.get("q") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(10, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
  const [q, setQ] = useState(urlQ);

  const requiredColumnKeys = new Set(["id", "quoteNumber", "status"]);
  const columnDefs = [
    { key: "id", label: "ID" },
    { key: "quoteNumber", label: "Quote" },
    { key: "customer", label: "Customer" },
    { key: "status", label: "Status" },
    { key: "expiryDate", label: "Expiry" },
    { key: "totalAmount", label: "Total" },
  ];
  const columnOrder = columnDefs.map((c) => c.key);
  const defaultVisibleColumns = ["id", "quoteNumber", "customer", "status", "expiryDate", "totalAmount"];
  const [columnsOpen, setColumnsOpen] = useState(false);

  const [visibleColumns, setVisibleColumns, resetVisibleColumns] = usePersistentColumns({
    storageKey: "ba_quotes_visible_columns",
    columnOrder,
    defaultVisibleColumns,
    requiredKeys: Array.from(requiredColumnKeys),
  });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function onAction(action, row) {
    if (!row?.id) return;
    try {
      setError(null);
      if (action === "pdf") {
        const token = getAccessToken();
        if (!token) throw new Error("Your session has expired. Please log in again.");
        const res = await fetch(`${API_BASE}/quotes/${row.id}/pdf`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/pdf" },
        });
        if (res.status === 401) throw new Error("Your session has expired. Please log in again.");
        if (!res.ok) {
          const text = await res.text();
          let msg = text;
          try {
            const j = JSON.parse(text);
            msg = j?.message || text;
          } catch {}
          throw new Error(msg || "Could not download quote PDF");
        }
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        return;
      }
      if (action === "send") await api.sendQuote(row.id);
      if (action === "accept") await api.acceptQuote(row.id);
      if (action === "reject") await api.rejectQuote(row.id);
      if (action === "convert") {
        const res = await api.convertQuoteToInvoice(row.id);
        const inv = res?.data ?? res;
        const invId = inv?.id ?? inv?.invoice?.id;
        if (invId) navigate(`/invoices/${invId}`);
        return;
      }
      await load();
    } catch (e) {
      setError(e?.message ? String(e.message) : "Action failed");
    }
  }

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        ...(clientId ? { clientId } : {}),
        ...(q ? { q } : {}),
        ...(statusFilter ? { status: statusFilter } : {}),
      };
      const res = await api.listQuotes(params);
      setData(res);
    } catch (e) {
      setError(e.message || "Failed to load quotes");
    } finally {
      setLoading(false);
    }
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

  useEffect(() => setQ(urlQ), [urlQ]);
  useEffect(() => {
    load();
  }, [clientId, q, statusFilter, page, limit]);

  function setStatus(s) {
    const next = new URLSearchParams(searchParams);
    if (s) next.set("status", s);
    else next.delete("status");
    next.delete("page");
    setSearchParams(next, { replace: true });
  }

  function setQuery(val) {
    setQ(val);
    const next = new URLSearchParams(searchParams);
    if (val) next.set("q", val);
    else next.delete("q");
    next.delete("page");
    setSearchParams(next, { replace: true });
  }

  const quotes = data?.data || [];

  return (
    <div className="space-y-6 min-h-screen">
      <PageHeader
        title="Quotes"
        subtitle="Create and manage professional quotes for your customers"
        icon={<FileText className="h-5 w-5 text-violet-600" />}
        extra={clientId ? <div className="text-violet-600 font-medium">Filtered by customer</div> : null}
        action={
          <Button onClick={() => navigate(clientId ? `/quotes/new?clientId=${clientId}` : "/quotes/new")} className="h-9 shrink-0">
            <Plus className="h-4 w-4 mr-1.5" />
            New Quote
          </Button>
        }
      />

      <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex flex-wrap gap-1.5">
                {STATUS_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setStatus(f.key)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors",
                      statusFilter === f.key
                        ? "bg-violet-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <ListPageToolbar
              searchValue={q}
              onSearchChange={setQuery}
              searchPlaceholder="Search quotes…"
              limit={limit}
              onLimitChange={setLimit}
              onColumnsClick={() => setColumnsOpen(true)}
            />

            {error ? (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
            ) : null}
          </div>

          <div>
          {loading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 rounded-lg bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : quotes.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No quotes yet"
              description="Quotes you create will appear here"
            />
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-auto">
                <table className="min-w-full text-[13px]">
                  <thead className="text-left bg-slate-50/80">
                    <tr className="border-y border-slate-200/80">
                      {visibleColumns.includes("id") ? <th className="py-2.5 px-3 text-xs font-medium text-slate-500">ID</th> : null}
                      {visibleColumns.includes("quoteNumber") ? <th className="py-2.5 px-3 text-xs font-medium text-slate-500">Quote</th> : null}
                      {visibleColumns.includes("customer") ? <th className="py-2.5 px-3 text-xs font-medium text-slate-500">Customer</th> : null}
                      {visibleColumns.includes("status") ? <th className="py-2.5 px-3 text-xs font-medium text-slate-500">Status</th> : null}
                      {visibleColumns.includes("expiryDate") ? <th className="py-2.5 px-3 text-xs font-medium text-slate-500">Expiry</th> : null}
                      {visibleColumns.includes("totalAmount") ? <th className="py-2.5 px-3 text-right text-xs font-medium text-slate-500">Total</th> : null}
                      <th className="py-2.5 px-3 text-right w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotes.map((row, index) => {
                      const displayId = formatRecordDisplayId(row);
                      return (
                      <QuoteRow
                        key={row.id}
                        q={row}
                        displayId={displayId}
                        visibleColumns={visibleColumns}
                        onAction={onAction}
                        navigate={navigate}
                      />
                    );})}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden p-4 space-y-3">
                {quotes.map((row, index) => {
                  const displayId = formatRecordDisplayId(row);
                  return (
                  <QuoteCard key={row.id} q={row} displayId={displayId} onAction={onAction} navigate={navigate} />
                );})}
              </div>

              {data?.meta && quotes.length > 0 ? (
                <Pagination
                  page={data.meta.page}
                  limit={data.meta.limit}
                  total={data.meta.total}
                  onPageChange={setPage}
                />
              ) : null}
            </>
          )}
          </div>
        </CardContent>
      </Card>

      <ColumnPickerDialog
        open={columnsOpen}
        onOpenChange={setColumnsOpen}
        columnDefs={columnDefs}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        requiredKeys={requiredColumnKeys}
        columnOrder={columnOrder}
        defaultVisibleColumns={defaultVisibleColumns}
        onReset={resetVisibleColumns}
      />
    </div>
  );
}

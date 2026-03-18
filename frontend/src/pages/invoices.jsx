import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import InvoiceTable from "../components/invoices/invoice-table";
import { getAccessToken } from "../features/auth/token-store";
import Dialog from "../components/ui/dialog";
import Button from "../components/ui/button";
import { Plus, Receipt, SlidersHorizontal, FileText } from "lucide-react";
import EmptyState from "../components/common/EmptyState";
import ColumnPickerDialog from "../components/common/ColumnPickerDialog";
import ListPageToolbar from "../components/common/ListPageToolbar";
import PageHeader from "../components/common/PageHeader";
import Pagination from "../components/common/Pagination";
import { usePersistentColumns } from "../utils/usePersistentColumns";
import { useColumnSort } from "../utils/useColumnSort";

export default function InvoicesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const clientId = searchParams.get("clientId") || "";
  const urlQ = searchParams.get("q") || "";
  const status = searchParams.get("status") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(10, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
  const [q, setQ] = useState(urlQ);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [pdfPreviewInvoice, setPdfPreviewInvoice] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDueDateOpen, setBulkDueDateOpen] = useState(false);
  const [bulkRecurringOpen, setBulkRecurringOpen] = useState(false);
  const [bulkDueDate, setBulkDueDate] = useState("");
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [bulkRecurringForm, setBulkRecurringForm] = useState({
    frequency: "MONTHLY",
    intervalValue: 1,
    startDate: new Date().toISOString().slice(0, 10),
    nextRunDate: new Date().toISOString().slice(0, 10),
  });

  const requiredColumnKeys = new Set(["id", "customer", "status"]);
  const columnDefs = [
    { key: "id", label: "Invoice ID" },
    { key: "customer", label: "Customer" },
    { key: "status", label: "Status" },
    { key: "issueDate", label: "Issue" },
    { key: "dueDate", label: "Due" },
    { key: "totalAmount", label: "Total" },
    { key: "balanceDue", label: "Balance" },
  ];
  const columnOrder = columnDefs.map((c) => c.key);
  const defaultVisibleColumns = ["id", "customer", "status", "issueDate", "dueDate", "totalAmount", "balanceDue"];
  const [columnsOpen, setColumnsOpen] = useState(false);

  const [visibleColumns, setVisibleColumns, resetVisibleColumns] = usePersistentColumns({
    storageKey: "ba_invoices_visible_columns",
    columnOrder,
    defaultVisibleColumns,
    requiredKeys: Array.from(requiredColumnKeys),
  });

  const invoiceSortDefs = columnDefs.map((c) => ({
    ...c,
    getValue:
      c.key === "customer"
        ? (r) => (r?.client?.companyName || r?.client?.contactName || "")
        : c.key === "id"
          ? (r) => (r?.invoiceNumber || String(r?.invoiceSeq ?? "").padStart(3, "0"))
          : ["totalAmount", "balanceDue"].includes(c.key)
            ? (r) => Number(r?.[c.key]) || 0
            : undefined,
  }));
  const { sortKey, sortDir, toggleSort, sortRows } = useColumnSort(invoiceSortDefs);

  function closePdfPreview() {
    if (pdfPreviewUrl) window.URL.revokeObjectURL(pdfPreviewUrl);
    setPdfPreviewUrl(null);
    setPdfPreviewInvoice(null);
  }

  async function openInvoicePdf(inv) {
    try {
      setError(null);
      const token = getAccessToken();
      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }
      const res = await fetch(`/api/invoices/${inv.id}/pdf?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/pdf",
        },
      });
      const contentType = res.headers.get("content-type") || "";

      if (res.status === 401) {
        throw new Error("Your session has expired. Please log in again.");
      }

      if (!res.ok || !contentType.includes("application/pdf")) {
        let detail = "";
        try {
          const text = await res.text();
          if (text) {
            try {
              const asJson = JSON.parse(text);
              detail = asJson?.message ? String(asJson.message) : text;
              if (asJson?.requestId) detail = `${detail} (Request ID: ${asJson.requestId})`;
            } catch {
              detail = text;
            }
          }
        } catch {
          // ignore
        }

        const showStatus = res.status !== 204;
        const meta = showStatus ? `Status ${res.status}${contentType ? `, Content-Type: ${contentType}` : ""}` : "";
        throw new Error(detail ? `${detail}${meta ? ` — ${meta}` : ""}` : `Could not load PDF.${meta ? ` ${meta}` : ""}`);
      }

      const buf = await res.arrayBuffer();
      const pdfBlob = new Blob([buf], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);

      closePdfPreview();
      setPdfPreviewInvoice(inv);
      setPdfPreviewUrl(url);
    } catch {
      // PDF load error – hidden for now
    }
  }

  async function load() {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.listInvoices({ page, limit, ...(clientId ? { clientId } : {}), ...(q ? { q } : {}), ...(status ? { status } : {}) });
      setData(res);
    } catch (e) {
      setError(e.message || "Failed to load invoices");
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

  useEffect(() => {
    setQ(urlQ);
  }, [urlQ]);

  useEffect(() => {
    load();
  }, [clientId, q, page, limit, status]);

  useEffect(() => {
    const visibleIds = new Set((data?.data || []).map((r) => r.id));
    setSelectedIds((prev) => prev.filter((id) => visibleIds.has(id)));
  }, [data]);

  function toggleSelectInvoice(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function toggleSelectAll(ids) {
    setSelectedIds((prev) => {
      const allSelected = ids.every((id) => prev.includes(id));
      if (allSelected) return prev.filter((id) => !ids.includes(id));
      return Array.from(new Set([...prev, ...ids]));
    });
  }

  async function handleBulkDueDateSubmit(e) {
    e.preventDefault();
    if (!bulkDueDate) {
      setError("Select a due date first");
      return;
    }
    setBulkUpdating(true);
    setError(null);
    setSuccess(null);
    try {
      await Promise.all(selectedIds.map((id) => api.updateInvoice(id, { dueDate: bulkDueDate })));
      setSuccess(`Updated due date for ${selectedIds.length} invoice${selectedIds.length === 1 ? "" : "s"}.`);
      setSelectedIds([]);
      setBulkDueDateOpen(false);
      setBulkDueDate("");
      await load();
    } catch (e2) {
      setError(e2.message || "Failed to update due dates");
    } finally {
      setBulkUpdating(false);
    }
  }

  async function handleBulkRecurringSubmit(e) {
    e.preventDefault();
    setBulkUpdating(true);
    setError(null);
    setSuccess(null);
    try {
      const invoices = await Promise.all(selectedIds.map((id) => api.getInvoice(id)));
      await Promise.all(
        invoices.map((inv) =>
          api.createRecurringInvoice({
            clientId: inv.clientId,
            templateName: `Recurring from ${inv.invoiceNumber}`,
            frequency: bulkRecurringForm.frequency,
            intervalValue: Number(bulkRecurringForm.intervalValue || 1),
            startDate: bulkRecurringForm.startDate,
            nextRunDate: bulkRecurringForm.nextRunDate,
            notes: inv.notes || undefined,
            items: (inv.items || []).map((item) => ({
              productId: item.productId || undefined,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              discount: item.discount,
              taxRate: item.taxRate,
            })),
          })
        )
      );
      setSuccess(`Created recurring templates for ${selectedIds.length} invoice${selectedIds.length === 1 ? "" : "s"}.`);
      setSelectedIds([]);
      setBulkRecurringOpen(false);
    } catch (e2) {
      setError(e2.message || "Failed to create recurring invoices");
    } finally {
      setBulkUpdating(false);
    }
  }

  return (
    <div className="space-y-6 min-h-screen">
      <PageHeader
        title="Invoices"
        subtitle="Track once-off and recurring invoices"
        icon={<Receipt className="h-5 w-5 text-violet-600" />}
        extra={
          (clientId || status) && (
            <>
              {clientId ? <div>Filtered by customer</div> : null}
              {status ? <div>Filtered by status: {status}</div> : null}
            </>
          )
        }
        action={
          <Button onClick={() => navigate("/invoices/new")} className="h-9 shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        }
      />

      <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4">
          {selectedIds.length > 0 ? (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm">
              <div className="font-medium text-violet-900">
                {selectedIds.length} invoice{selectedIds.length === 1 ? "" : "s"} selected
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" className="h-9" onClick={() => setBulkDueDateOpen(true)}>
                  Change due date
                </Button>
                <Button type="button" className="h-9 bg-violet-600 hover:bg-violet-700" onClick={() => setBulkRecurringOpen(true)}>
                  Add to recurring
                </Button>
                <Button type="button" variant="outline" className="h-9" onClick={() => setSelectedIds([])}>
                  Clear
                </Button>
              </div>
            </div>
          ) : null}

          <ListPageToolbar
            searchValue={q}
            onSearchChange={(next) => {
              setQ(next);
              const nextParams = new URLSearchParams(searchParams);
              if (next) nextParams.set("q", next);
              else nextParams.delete("q");
              nextParams.delete("page");
              setSearchParams(nextParams, { replace: true });
            }}
            searchPlaceholder="Search invoices…"
            limit={limit}
            onLimitChange={setLimit}
            onColumnsClick={() => setColumnsOpen(true)}
          />
          {success ? (
            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
              {success}
            </div>
          ) : null}
          {error ? (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          ) : null}
          </div>

          <div>
            <InvoiceTable
              rows={sortRows(data?.data || [])}
              page={data?.meta?.page ?? page}
              limit={data?.meta?.limit ?? limit}
              visibleColumns={visibleColumns}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelectInvoice}
              onToggleSelectAll={toggleSelectAll}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={toggleSort}
              onViewPdf={openInvoicePdf}
              onEdit={(inv) => navigate(`/invoices/${inv.id}/edit`)}
              onAddToRecurring={(inv) => navigate(`/recurring?fromInvoice=${inv.id}`)}
              onSend={async (inv) => {
                try {
                  const token = getAccessToken();
                  if (!token) throw new Error("Your session has expired. Please log in again.");

                  const res = await fetch(`/api/invoices/${inv.id}/send`, {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                  if (!res.ok) {
                    const text = await res.text();
                    if (res.status === 401) throw new Error("Your session has expired. Please log in again.");
                    throw new Error(text || "We couldn’t send the invoice. Please try again.");
                  }
                  setSuccess("Invoice queued for sending.");
                  load();
                } catch (e) {
                  setError(e.message || "Could not send invoice");
                }
              }}
            />

            {data && (data.data || []).length === 0 ? (
              <EmptyState
                icon={Receipt}
                title="No invoices found"
                description={q ? "Try adjusting your search terms" : "Create your first invoice to get started"}
                action={
                  !q ? (
                    <Button onClick={() => navigate("/invoices/new")} className="h-9">
                      <Plus className="h-4 w-4 mr-1.5" />
                      New Invoice
                    </Button>
                  ) : null
                }
              />
            ) : null}

            {data?.meta && (data.data || []).length > 0 ? (
              <Pagination
                page={data.meta.page}
                limit={data.meta.limit}
                total={data.meta.total}
                onPageChange={setPage}
              />
            ) : null}
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

      <Dialog
        open={Boolean(pdfPreviewUrl)}
        onOpenChange={(o) => {
          if (!o) closePdfPreview();
        }}
        title="Invoice PDF"
      >
        {pdfPreviewUrl ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm text-slate-600">
                {pdfPreviewInvoice?.invoiceNumber ? `Invoice ${pdfPreviewInvoice.invoiceNumber}` : "Invoice"}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const opened = window.open(pdfPreviewUrl, "_blank");
                    if (!opened) setError("Please allow pop-ups to open the invoice in a new tab.");
                  }}
                >
                  Open in new tab
                </Button>
                <Button type="button" variant="outline" onClick={closePdfPreview}>
                  Close
                </Button>
              </div>
            </div>

            <iframe
              title="Invoice PDF Preview"
              src={pdfPreviewUrl}
              className="w-full h-[70vh] rounded-md border border-slate-200"
            />
          </div>
        ) : (
          <div className="text-sm text-slate-600">Preparing preview…</div>
        )}
      </Dialog>

      <Dialog open={bulkDueDateOpen} onOpenChange={setBulkDueDateOpen} title="Bulk change due date" className="max-w-md">
        <form onSubmit={handleBulkDueDateSubmit} className="space-y-4">
          <div className="text-sm text-slate-600">Apply a new due date to {selectedIds.length} selected invoice{selectedIds.length === 1 ? "" : "s"}.</div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">New due date</label>
            <input
              type="date"
              value={bulkDueDate}
              onChange={(e) => setBulkDueDate(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setBulkDueDateOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={bulkUpdating}>{bulkUpdating ? "Saving…" : "Update due date"}</Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={bulkRecurringOpen} onOpenChange={setBulkRecurringOpen} title="Bulk add to recurring" className="max-w-lg">
        <form onSubmit={handleBulkRecurringSubmit} className="space-y-4">
          <div className="text-sm text-slate-600">Create recurring templates from {selectedIds.length} selected invoice{selectedIds.length === 1 ? "" : "s"}.</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Frequency</label>
              <select
                value={bulkRecurringForm.frequency}
                onChange={(e) => setBulkRecurringForm((f) => ({ ...f, frequency: e.target.value }))}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="BI_WEEKLY">Bi-weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Interval</label>
              <input
                type="number"
                min="1"
                value={bulkRecurringForm.intervalValue}
                onChange={(e) => setBulkRecurringForm((f) => ({ ...f, intervalValue: e.target.value }))}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Start date</label>
              <input
                type="date"
                value={bulkRecurringForm.startDate}
                onChange={(e) => setBulkRecurringForm((f) => ({ ...f, startDate: e.target.value }))}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Next run date</label>
              <input
                type="date"
                value={bulkRecurringForm.nextRunDate}
                onChange={(e) => setBulkRecurringForm((f) => ({ ...f, nextRunDate: e.target.value }))}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setBulkRecurringOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={bulkUpdating}>{bulkUpdating ? "Saving…" : "Create recurring"}</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

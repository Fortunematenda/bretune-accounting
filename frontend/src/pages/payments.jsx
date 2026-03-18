import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Button from "../components/ui/button";
import Dialog from "../components/ui/dialog";
import Input from "../components/ui/input";
import Money, { formatMoney } from "../components/common/money";
import Pagination from "../components/common/Pagination";
import ListPageToolbar from "../components/common/ListPageToolbar";
import PageHeader from "../components/common/PageHeader";
import ActionsMenu from "../components/common/ActionsMenu";
import ColumnPickerDialog from "../components/common/ColumnPickerDialog";
import SortableTableHeader from "../components/common/SortableTableHeader";
import { usePersistentColumns } from "../utils/usePersistentColumns";
import { useColumnSort } from "../utils/useColumnSort";
import { CreditCard, Plus, Wallet } from "lucide-react";
import EmptyState from "../components/common/EmptyState";
import { formatDateForDisplay } from "../lib/dateFormat";
import { formatRecordDisplayId } from "../lib/utils";

function getInvoiceLabel(p) {
  const allocations = Array.isArray(p?.allocations) ? p.allocations : [];
  if (allocations.length > 1) return "Multiple";
  if (allocations.length === 1) return allocations[0]?.invoice?.invoiceNumber || "—";
  return p?.invoice?.invoiceNumber || "—";
}


const METHOD_LABELS = {
  CASH: "Cash",
  BANK_TRANSFER: "Bank Transfer",
  CREDIT_CARD: "Credit Card",
  DEBIT_CARD: "Debit Card",
  CHECK: "Check",
  ONLINE: "Online",
  CREDIT_NOTE: "Credit Note",
};

function getMethodLabel(method) {
  return METHOD_LABELS[method] || method;
}

export default function PaymentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const clientId = searchParams.get("clientId") || "";
  const invoiceId = searchParams.get("invoiceId") || "";
  const newParam = searchParams.get("new") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(10, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newPaymentOpen, setNewPaymentOpen] = useState(false);
  const [newPaymentForm, setNewPaymentForm] = useState({
    clientId: clientId || "",
    amount: "",
    method: "BANK_TRANSFER",
    transactionId: "",
    notes: "",
    allocations: invoiceId ? [{ invoiceId, amount: "" }] : [{ invoiceId: "", amount: "" }],
  });
  const [submitting, setSubmitting] = useState(false);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [invoiceOptions, setInvoiceOptions] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);

  const requiredColumnKeys = new Set(["id", "customer"]);
  const columnDefs = [
    { key: "id", label: "ID" },
    { key: "date", label: "Date" },
    { key: "customer", label: "Customer" },
    { key: "invoice", label: "Invoice" },
    { key: "method", label: "Method" },
    { key: "amount", label: "Amount" },
    { key: "reference", label: "Reference" },
  ];
  const columnOrder = columnDefs.map((c) => c.key);
  const defaultVisibleColumns = ["id", "date", "customer", "invoice", "method", "amount", "reference"];

  const [visibleColumns, setVisibleColumns, resetVisibleColumns] = usePersistentColumns({
    storageKey: "ba_payments_visible_columns",
    columnOrder,
    defaultVisibleColumns,
    requiredKeys: Array.from(requiredColumnKeys),
  });

  const sortColumnDefs = columnDefs.map((c) => ({
    ...c,
    getValue:
      c.key === "customer" ? (r) => (r?.client?.companyName || r?.client?.contactName || "")
      : c.key === "amount" ? (r) => Number(r?.amount) || 0
      : c.key === "date" ? (r) => r?.paymentDate || ""
      : undefined,
  }));
  const { sortKey, sortDir, toggleSort, sortRows } = useColumnSort(sortColumnDefs);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .listPayments({
        page,
        limit,
        ...(q ? { q } : {}),
        ...(clientId ? { clientId } : {}),
        ...(invoiceId ? { invoiceId } : {}),
      })
      .then(setData)
      .catch((e) => setError(e.message || "Failed to load payments"))
      .finally(() => setLoading(false));
  }, [q, clientId, invoiceId, page, limit]);

  useEffect(() => {
    load();
  }, [load]);

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

  async function handleCreatePayment() {
    setSubmitting(true);
    setError(null);
    try {
      const amountNum = Number(newPaymentForm.amount || 0);
      const allocations = Array.isArray(newPaymentForm.allocations) ? newPaymentForm.allocations : [];
      const cleanedAllocations = allocations
        .map((a) => ({
          invoiceId: String(a?.invoiceId || "").trim(),
          amount: String(a?.amount || "").trim(),
        }))
        .filter((a) => a.invoiceId && a.amount && Number(a.amount) > 0);

      if (!newPaymentForm.clientId) throw new Error("Please select a customer.");
      if (!amountNum || amountNum <= 0) throw new Error("Please enter a valid amount.");
      if (cleanedAllocations.length === 0) throw new Error("Please allocate this payment to at least one invoice.");

      if (newPaymentForm.method === "CREDIT_NOTE") {
        if (cleanedAllocations.length !== 1) throw new Error("Credit notes can only be applied to a single invoice.");
        if (Number(cleanedAllocations[0].amount) !== amountNum) throw new Error("Credit note allocation amount must equal the payment amount.");
      }

      await api.createPayment({
        clientId: newPaymentForm.clientId,
        amount: String(newPaymentForm.amount),
        method: newPaymentForm.method,
        transactionId: newPaymentForm.transactionId || null,
        notes: newPaymentForm.notes || null,
        allocations: cleanedAllocations,
      });
      setNewPaymentOpen(false);
      setNewPaymentForm({
        clientId: clientId || "",
        amount: "",
        method: "BANK_TRANSFER",
        transactionId: "",
        notes: "",
        allocations: invoiceId ? [{ invoiceId, amount: "" }] : [{ invoiceId: "", amount: "" }],
      });
      setCustomerSearch("");
      setCustomerOptions([]);
      setInvoiceOptions([]);
      load();
    } catch (e) {
      setError(e.message || "Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (newPaymentOpen) {
      loadCustomers();
    }
  }, [newPaymentOpen]);

  useEffect(() => {
    if (!newPaymentOpen) return;
    if (!newPaymentForm.clientId) return;
    if (String(customerSearch || "").trim()) return;

    api
      .getClient(newPaymentForm.clientId)
      .then((c) => setCustomerSearch(c?.companyName || c?.contactName || ""))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPaymentOpen, newPaymentForm.clientId]);

  useEffect(() => {
    if (newParam === "1" && clientId) {
      setNewPaymentOpen(true);
      setNewPaymentForm((p) => ({ ...p, clientId }));
      api.getClient(clientId).then((c) => setCustomerSearch(c?.companyName || c?.contactName || "")).catch(() => {});
      setSearchParams((p) => {
        const next = new URLSearchParams(p);
        next.delete("new");
        return next;
      }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newParam, clientId]);

  async function loadCustomers(search = "") {
    setLoadingCustomers(true);
    try {
      const res = await api.listCustomers({ limit: 30, q: search });
      setCustomerOptions(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setCustomerOptions([]);
    } finally {
      setLoadingCustomers(false);
    }
  }

  function handleCustomerSearchChange(e) {
    const val = e.target.value;
    setCustomerSearch(val);
    loadCustomers(val);
  }

  function handleCustomerSelect(customer) {
    setNewPaymentForm((p) => ({ ...p, clientId: customer.id }));
    setCustomerSearch(`${customer.companyName || customer.contactName || ""}`);
    setCustomerOptions([]);
    setCustomerDropdownOpen(false);
  }

  useEffect(() => {
    if (!newPaymentOpen) return;
    if (!newPaymentForm.clientId) {
      setInvoiceOptions([]);
      return;
    }
    loadInvoices(newPaymentForm.clientId);
  }, [newPaymentOpen, newPaymentForm.clientId]);

  const allocatedTotal = useMemo(() => {
    const rows = Array.isArray(newPaymentForm.allocations) ? newPaymentForm.allocations : [];
    return rows.reduce((sum, r) => sum + Number(r?.amount || 0), 0);
  }, [newPaymentForm.allocations]);

  const unallocatedTotal = useMemo(() => {
    const total = Number(newPaymentForm.amount || 0);
    const v = total - allocatedTotal;
    return Number.isFinite(v) ? v : 0;
  }, [newPaymentForm.amount, allocatedTotal]);

  function updateAllocationRow(index, patch) {
    setNewPaymentForm((p) => {
      const rows = Array.isArray(p.allocations) ? p.allocations.slice() : [];
      rows[index] = { ...(rows[index] || { invoiceId: "", amount: "" }), ...(patch || {}) };
      return { ...p, allocations: rows };
    });
  }

  function addAllocationRow() {
    setNewPaymentForm((p) => ({
      ...p,
      allocations: [...(Array.isArray(p.allocations) ? p.allocations : []), { invoiceId: "", amount: "" }],
    }));
  }

  function removeAllocationRow(index) {
    setNewPaymentForm((p) => {
      const rows = Array.isArray(p.allocations) ? p.allocations.slice() : [];
      rows.splice(index, 1);
      return { ...p, allocations: rows.length > 0 ? rows : [{ invoiceId: "", amount: "" }] };
    });
  }

  useEffect(() => {
    if (!newPaymentOpen) return;
    if (newPaymentForm.method !== "CREDIT_NOTE") return;

    setNewPaymentForm((p) => {
      const first = Array.isArray(p.allocations) && p.allocations.length > 0 ? p.allocations[0] : { invoiceId: "", amount: "" };
      return {
        ...p,
        allocations: [{ ...first, amount: String(p.amount || "") }],
      };
    });
  }, [newPaymentOpen, newPaymentForm.method, newPaymentForm.amount]);

  async function loadInvoices(cId) {
    setLoadingInvoices(true);
    try {
      const res = await api.listInvoices({ limit: 50, clientId: cId });
      setInvoiceOptions(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setInvoiceOptions([]);
    } finally {
      setLoadingInvoices(false);
    }
  }

  function handleCustomerFocus() {
    setCustomerDropdownOpen(true);
    if (customerSearch.trim()) {
      loadCustomers(customerSearch);
    }
  }

  function handleCustomerBlur() {
    setTimeout(() => setCustomerDropdownOpen(false), 150);
  }

  const rawPayments = data?.data || [];

  const paymentsWithAllocations = rawPayments;

  const [reallocateOpen, setReallocateOpen] = useState(false);
  const [reallocatePayment, setReallocatePayment] = useState(null);
  const [reallocateForm, setReallocateForm] = useState({ allocations: [{ invoiceId: "", amount: "" }] });

  const reallocateAllocatedTotal = useMemo(() => {
    const rows = Array.isArray(reallocateForm.allocations) ? reallocateForm.allocations : [];
    return rows.reduce((sum, r) => sum + Number(r?.amount || 0), 0);
  }, [reallocateForm.allocations]);

  const reallocateUnallocatedTotal = useMemo(() => {
    const total = Number(reallocatePayment?.amount || 0);
    const v = total - reallocateAllocatedTotal;
    return Number.isFinite(v) ? v : 0;
  }, [reallocatePayment?.amount, reallocateAllocatedTotal]);

  function openReallocate(p) {
    const allocations = Array.isArray(p?.allocations) ? p.allocations : [];
    const initial = allocations.length > 0
      ? allocations.map((a) => ({ invoiceId: a.invoiceId || "", amount: String(a.amount || "") }))
      : p?.invoiceId
        ? [{ invoiceId: p.invoiceId, amount: String(p.amount || "") }]
        : [{ invoiceId: "", amount: "" }];

    setReallocatePayment(p);
    setReallocateForm({ allocations: initial.length > 0 ? initial : [{ invoiceId: "", amount: "" }] });
    setReallocateOpen(true);
    if (p?.clientId) loadInvoices(p.clientId);
  }

  function updateReallocateRow(index, patch) {
    setReallocateForm((p) => {
      const rows = Array.isArray(p.allocations) ? p.allocations.slice() : [];
      rows[index] = { ...(rows[index] || { invoiceId: "", amount: "" }), ...(patch || {}) };
      return { ...p, allocations: rows };
    });
  }

  function addReallocateRow() {
    setReallocateForm((p) => ({
      ...p,
      allocations: [...(Array.isArray(p.allocations) ? p.allocations : []), { invoiceId: "", amount: "" }],
    }));
  }

  function removeReallocateRow(index) {
    setReallocateForm((p) => {
      const rows = Array.isArray(p.allocations) ? p.allocations.slice() : [];
      rows.splice(index, 1);
      return { ...p, allocations: rows.length > 0 ? rows : [{ invoiceId: "", amount: "" }] };
    });
  }

  async function submitReallocate() {
    if (!reallocatePayment?.id) return;
    setError(null);

    try {
      const total = Number(reallocatePayment.amount || 0);
      const allocations = Array.isArray(reallocateForm.allocations) ? reallocateForm.allocations : [];
      const cleaned = allocations
        .map((a) => ({
          invoiceId: String(a?.invoiceId || "").trim(),
          amount: String(a?.amount || "").trim(),
        }))
        .filter((a) => a.invoiceId && a.amount && Number(a.amount) > 0);

      const allocated = cleaned.reduce((sum, a) => sum + Number(a.amount || 0), 0);
      if (allocated > total) throw new Error("Allocated total cannot exceed payment amount.");

      await api.updatePaymentAllocations(reallocatePayment.id, { allocations: cleaned });
      setReallocateOpen(false);
      setReallocatePayment(null);
      setReallocateForm({ allocations: [{ invoiceId: "", amount: "" }] });
      load();
    } catch (e) {
      setError(e.message || "Failed to reallocate payment");
    }
  }

  async function handleVoidPayment(p) {
    const ok = window.confirm("Void this payment? This will reverse its effect on invoice balances.");
    if (!ok) return;
    setError(null);
    try {
      await api.voidPayment(p.id, {});
      load();
    } catch (e) {
      setError(e.message || "Failed to void payment");
    }
  }

  return (
    <div className="space-y-6 min-h-screen">
      <PageHeader
        title="Payments"
        subtitle="Track receipts and payment allocations"
        icon={<CreditCard className="h-5 w-5 text-violet-600" />}
        action={
          <Button onClick={() => setNewPaymentOpen(true)} className="h-9 shrink-0">
            <Plus className="h-4 w-4 mr-1.5" />
            Record Payment
          </Button>
        }
      />

      <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4">
            {error && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            <ListPageToolbar
              searchValue={q}
              onSearchChange={(next) => {
                const nextParams = new URLSearchParams(searchParams);
                if (next) nextParams.set("q", next);
                else nextParams.delete("q");
                nextParams.delete("page");
                setSearchParams(nextParams, { replace: true });
              }}
              searchPlaceholder="Search payments…"
              limit={limit}
              onLimitChange={setLimit}
              onColumnsClick={() => setColumnsOpen(true)}
            />
          </div>

          <div className="overflow-auto">
            <table className="min-w-max w-full text-[13px]">
              <thead className="text-left bg-slate-50/80">
                <tr className="border-y border-slate-200/80">
                  {visibleColumns.includes("id") ? <SortableTableHeader label="ID" columnKey="id" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} /> : null}
                  {visibleColumns.includes("date") ? <SortableTableHeader label="Date" columnKey="date" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} /> : null}
                  {visibleColumns.includes("customer") ? <SortableTableHeader label="Customer" columnKey="customer" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} /> : null}
                  {visibleColumns.includes("invoice") ? <SortableTableHeader label="Invoice" columnKey="invoice" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" /> : null}
                  {visibleColumns.includes("method") ? <SortableTableHeader label="Method" columnKey="method" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" /> : null}
                  {visibleColumns.includes("amount") ? <SortableTableHeader label="Amount" columnKey="amount" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" className="hidden sm:table-cell" /> : null}
                  {visibleColumns.includes("reference") ? <SortableTableHeader label="Reference" columnKey="reference" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" /> : null}
                  <th className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-xs font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortRows(paymentsWithAllocations).map((p) => {
                  const displayId = formatRecordDisplayId(p);
                  return (
                    <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                      {visibleColumns.includes("id") ? <td className="py-2.5 px-3 font-mono text-xs font-medium text-slate-500 whitespace-nowrap" title={p.id}>{displayId}</td> : null}
                      {visibleColumns.includes("date") ? <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{formatDateForDisplay(p.paymentDate)}</td> : null}
                      {visibleColumns.includes("customer") ? (
                        <td className="py-2.5 px-3">
                          <Link to={p.clientId ? `/customers/${p.clientId}` : "#"} className="font-medium text-slate-900 hover:text-violet-700 truncate block max-w-[160px]">
                            {p.client?.companyName || p.client?.contactName || "—"}
                          </Link>
                        </td>
                      ) : null}
                      {visibleColumns.includes("invoice") ? (
                        <td className="hidden sm:table-cell py-2.5 px-3">
                          <Link to={p.invoiceId ? `/invoices/${p.invoiceId}` : "#"} className="text-slate-600 hover:text-violet-700">{getInvoiceLabel(p)}</Link>
                        </td>
                      ) : null}
                      {visibleColumns.includes("method") ? (
                        <td className="hidden sm:table-cell py-2.5 px-3">
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{getMethodLabel(p.method)}</span>
                        </td>
                      ) : null}
                      {visibleColumns.includes("amount") ? <td className="hidden sm:table-cell py-2.5 px-3 text-right font-medium tabular-nums text-slate-800"><Money value={p.amount || 0} /></td> : null}
                      {visibleColumns.includes("reference") ? <td className="hidden sm:table-cell py-2.5 px-3 text-slate-500">{p.transactionId || "—"}</td> : null}
                      <td className="hidden sm:table-cell py-2.5 px-3 text-right">
                        <ActionsMenu
                          items={[
                            { key: "reallocate", label: "Reallocate", disabled: String(p.status || "").toUpperCase() === "VOIDED" || String(p.method || "").toUpperCase() === "CREDIT_NOTE", onSelect: () => openReallocate(p) },
                            { key: "void", label: "Void payment", tone: "danger", disabled: String(p.status || "").toUpperCase() === "VOIDED", onSelect: () => handleVoidPayment(p) },
                          ]}
                          ariaLabel="Payment actions"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {data && rawPayments.length === 0 ? (
              <EmptyState
                icon={CreditCard}
                title="No payments yet"
                description="Record a payment to get started"
                action={
                  <Button onClick={() => setNewPaymentOpen(true)} className="h-9">
                    <Plus className="h-4 w-4 mr-1.5" />
                    Record Payment
                  </Button>
                }
              />
            ) : null}
          </div>

          {data?.meta && rawPayments.length > 0 && (
            <Pagination
              page={data.meta.page}
              limit={data.meta.limit}
              total={data.meta.total}
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>

      {newPaymentOpen && (
        <Dialog open={newPaymentOpen} onOpenChange={setNewPaymentOpen} title="Record Payment" description="Allocate a payment to one or more invoices" size="lg">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreatePayment();
            }}
          >
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Customer</label>
                <div className="relative">
                  <Input
                    value={customerSearch}
                    onChange={handleCustomerSearchChange}
                    onFocus={handleCustomerFocus}
                    onBlur={handleCustomerBlur}
                    placeholder="Search customer…"
                    autoComplete="off"
                    className="h-10"
                  />
                  {customerDropdownOpen && customerSearch.trim() && customerOptions.length > 0 ? (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg max-h-48 overflow-auto">
                      {customerOptions.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className="w-full px-3 py-2.5 text-left text-sm hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg"
                          onClick={() => handleCustomerSelect(c)}
                        >
                          {c.companyName || c.contactName || "—"}
                        </button>
                      ))}
                    </div>
                  ) : customerDropdownOpen && customerSearch.trim() && loadingCustomers ? (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg px-3 py-2.5 text-sm text-slate-500">
                      Searching…
                    </div>
                  ) : null}
                </div>
                <input type="hidden" name="clientId" value={newPaymentForm.clientId} required />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Invoice</label>
                <div className="space-y-2">
                  {(Array.isArray(newPaymentForm.allocations) ? newPaymentForm.allocations : []).map((row, idx) => {
                    const selectedInv = invoiceOptions.find((i) => i.id === row.invoiceId);
                    const balanceDue = Number(selectedInv?.balanceDue || 0);
                    return (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_minmax(180px,auto)_auto] gap-2 items-center">
                      <select
                        value={row.invoiceId}
                        onChange={(e) => updateAllocationRow(idx, { invoiceId: e.target.value })}
                        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                        disabled={!newPaymentForm.clientId || loadingInvoices}
                      >
                        <option value="">
                          {loadingInvoices ? "Loading invoices…" : "Select invoice"}
                        </option>
                        {invoiceOptions.filter((inv) => Number(inv.balanceDue || 0) > 0).map((inv) => (
                          <option key={inv.id} value={inv.id}>
                            {inv.invoiceNumber} • Balance {formatMoney(inv.balanceDue || 0)}
                          </option>
                        ))}
                      </select>

                      <div className="flex gap-1">
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={row.amount}
                          onChange={(e) => updateAllocationRow(idx, { amount: e.target.value })}
                          className="h-10"
                          placeholder="0.00"
                          disabled={newPaymentForm.method === "CREDIT_NOTE"}
                        />
                        {newPaymentForm.method !== "CREDIT_NOTE" && balanceDue > 0 ? (
                          <Button
                            type="button"
                            variant="outline"
                            className="h-10 shrink-0"
                            title={`Allocate full balance (${formatMoney(balanceDue)})`}
                            onClick={() => updateAllocationRow(idx, { amount: String(balanceDue) })}
                          >
                            Full
                          </Button>
                        ) : null}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="h-10"
                        onClick={() => removeAllocationRow(idx)}
                        disabled={newPaymentForm.method === "CREDIT_NOTE" || (Array.isArray(newPaymentForm.allocations) ? newPaymentForm.allocations.length : 0) <= 1}
                      >
                        Remove
                      </Button>
                    </div>
                    ); })}

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Allocated: {formatMoney(allocatedTotal)} • Unallocated: {formatMoney(unallocatedTotal)}</span>
                      <Button type="button" variant="outline" size="sm" onClick={addAllocationRow} disabled={newPaymentForm.method === "CREDIT_NOTE"}>
                        Add invoice
                      </Button>
                    </div>
                    {unallocatedTotal > 0 && (
                      <p className="text-xs text-slate-500">Unallocated amount will be credited to the customer account.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Amount</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={newPaymentForm.amount}
                    onChange={(e) => setNewPaymentForm((p) => ({ ...p, amount: e.target.value }))}
                    required
                    className="h-10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Method</label>
                  <select
                    value={newPaymentForm.method}
                    onChange={(e) => setNewPaymentForm((p) => ({ ...p, method: e.target.value }))}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  >
                    <option value="CASH">Cash</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="DEBIT_CARD">Debit Card</option>
                    <option value="CHECK">Check</option>
                    <option value="ONLINE">Online</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Transaction ID (optional)</label>
                <Input
                  value={newPaymentForm.transactionId}
                  onChange={(e) => setNewPaymentForm((p) => ({ ...p, transactionId: e.target.value }))}
                  placeholder="Reference number"
                  className="h-10"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Notes (optional)</label>
                <Input
                  value={newPaymentForm.notes}
                  onChange={(e) => setNewPaymentForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Internal notes"
                  className="h-10"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={submitting || !newPaymentForm.clientId}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {submitting ? "Recording…" : "Record Payment"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setNewPaymentOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Dialog>
      )}

      {reallocateOpen && reallocatePayment ? (
        <Dialog
          open={reallocateOpen}
          onOpenChange={(o) => {
            setReallocateOpen(o);
            if (!o) {
              setReallocatePayment(null);
              setReallocateForm({ allocations: [{ invoiceId: "", amount: "" }] });
            }
          }}
          title="Reallocate payment"
        >
          <div className="space-y-4">
            <div className="text-sm text-slate-600">
              Payment amount: <span className="font-medium text-slate-900">{formatMoney(reallocatePayment.amount || 0)}</span>
            </div>

            <div className="space-y-2">
              {(Array.isArray(reallocateForm.allocations) ? reallocateForm.allocations : []).map((row, idx) => {
                const selectedInv = invoiceOptions.find((i) => i.id === row.invoiceId);
                const balanceDue = Number(selectedInv?.balanceDue || 0);
                return (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_minmax(180px,auto)_auto] gap-2 items-center">
                  <select
                    value={row.invoiceId}
                    onChange={(e) => updateReallocateRow(idx, { invoiceId: e.target.value })}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                    disabled={loadingInvoices}
                  >
                    <option value="">
                      {loadingInvoices ? "Loading invoices…" : "Select invoice"}
                    </option>
                    {invoiceOptions.filter((inv) => Number(inv.balanceDue || 0) > 0).map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoiceNumber} • Balance {formatMoney(inv.balanceDue || 0)}
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-1">
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={row.amount}
                      onChange={(e) => updateReallocateRow(idx, { amount: e.target.value })}
                      className="h-10"
                      placeholder="0.00"
                    />
                    {balanceDue > 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 shrink-0"
                        title={`Allocate full balance (${formatMoney(balanceDue)})`}
                        onClick={() => updateReallocateRow(idx, { amount: String(balanceDue) })}
                      >
                        Full
                      </Button>
                    ) : null}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-10"
                    onClick={() => removeReallocateRow(idx)}
                    disabled={(Array.isArray(reallocateForm.allocations) ? reallocateForm.allocations.length : 0) <= 1}
                  >
                    Remove
                  </Button>
                </div>
                ); })}

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Allocated: {formatMoney(reallocateAllocatedTotal)} • Unallocated: {formatMoney(reallocateUnallocatedTotal)}</span>
                  <Button type="button" variant="outline" size="sm" onClick={addReallocateRow}>
                    Add invoice
                  </Button>
                </div>
                {reallocateUnallocatedTotal > 0 && (
                  <p className="text-xs text-slate-500">Unallocated amount will be credited to the customer account.</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setReallocateOpen(false)}>
                Cancel
              </Button>
              <Button type="button" className="bg-violet-600 hover:bg-violet-700" onClick={submitReallocate}>
                Save allocations
              </Button>
            </div>
          </div>
        </Dialog>
      ) : null}

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

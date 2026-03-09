import React, { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import Dialog from "../ui/dialog";
import Input from "../ui/input";
import Button from "../ui/button";
import { formatMoney } from "../common/money";

const DEFAULT_FORM = {
  clientId: "",
  amount: "",
  method: "BANK_TRANSFER",
  transactionId: "",
  notes: "",
  allocations: [{ invoiceId: "", amount: "" }],
};

export default function RecordPaymentDialog({
  open,
  onOpenChange,
  defaultClientId = "",
  defaultClientName = "",
  defaultInvoiceId = "",
  defaultAmount = "",
  suggestedClientSearch = "",
  reconciliationContext = null,
  onSuccess,
  onError,
}) {
  const [form, setForm] = useState(() => ({
    ...DEFAULT_FORM,
    amount: defaultAmount || "",
    clientId: defaultClientId || "",
    allocations: defaultInvoiceId ? [{ invoiceId: defaultInvoiceId, amount: "" }] : [{ invoiceId: "", amount: "" }],
  }));
  const [submitting, setSubmitting] = useState(false);
  const [dialogError, setDialogError] = useState(null);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [customerSearch, setCustomerSearch] = useState(defaultClientName || "");
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [invoiceOptions, setInvoiceOptions] = useState([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  const isClientFixed = Boolean(defaultClientId);

  const allocatedTotal = useMemo(
    () => (Array.isArray(form.allocations) ? form.allocations : []).reduce((sum, r) => sum + Number(r?.amount || 0), 0),
    [form.allocations]
  );
  const unallocatedTotal = useMemo(() => {
    const total = Number(form.amount || 0);
    const v = total - allocatedTotal;
    return Number.isFinite(v) ? v : 0;
  }, [form.amount, allocatedTotal]);

  const loadCustomers = useCallback(async (search = "") => {
    setLoadingCustomers(true);
    try {
      const res = await api.listCustomers({ limit: 30, q: search });
      setCustomerOptions(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setCustomerOptions([]);
    } finally {
      setLoadingCustomers(false);
    }
  }, []);

  // Extract likely customer name from bank statement description
  const extractSearchFromDescription = useCallback((desc) => {
    if (!desc || typeof desc !== "string") return "";
    const d = desc.trim();
    if (!d) return "";
    const skip = /\b(deposit|transfer|from|payment|received|eft|bank|send|money|app|dr|cr|ref|account|pos|purchase|voucher|digital|content)\b/gi;
    const words = d.replace(skip, " ").replace(/\s+/g, " ").trim().split(/\s+/).filter((w) => w.length > 2 && !/^\d+$/.test(w));
    if (words.length === 0) return d.slice(0, 40);
    const unique = [...new Set(words)];
    const lastPart = unique.slice(-3).join(" ");
    const firstPart = unique.slice(0, 3).join(" ");
    return lastPart.length >= 4 ? lastPart : firstPart;
  }, []);

  const loadInvoices = useCallback(async (cId) => {
    setLoadingInvoices(true);
    try {
      const res = await api.listInvoices({ limit: 50, clientId: cId });
      setInvoiceOptions(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setInvoiceOptions([]);
    } finally {
      setLoadingInvoices(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    if (isClientFixed) return;
    const raw = suggestedClientSearch?.trim() || "";
    const search = raw ? extractSearchFromDescription(raw) || raw : "";
    loadCustomers(search);
  }, [open, isClientFixed, suggestedClientSearch, loadCustomers, extractSearchFromDescription]);

  // Auto-select client when search returns a clear match (e.g. from bank statement description)
  const autoSelectedRef = React.useRef(false);
  useEffect(() => {
    if (!open) {
      autoSelectedRef.current = false;
      return;
    }
    if (!suggestedClientSearch?.trim() || form.clientId || autoSelectedRef.current) return;
    const search = suggestedClientSearch.trim().toLowerCase();
    const searchWords = search.split(/\s+/).filter((w) => w.length > 2);
    if (customerOptions.length === 0) return;
    let chosen = null;
    if (customerOptions.length === 1) {
      chosen = customerOptions[0];
    } else {
      chosen = customerOptions.find((c) => {
        const name = String(c.companyName || c.contactName || "").toLowerCase();
        if (!name) return false;
        if (search.includes(name) || name.includes(search)) return true;
        return searchWords.some((word) => name.includes(word));
      });
    }
    if (chosen) {
      autoSelectedRef.current = true;
      setForm((p) => ({ ...p, clientId: chosen.id }));
      setCustomerSearch(chosen.companyName || chosen.contactName || "—");
    }
  }, [open, suggestedClientSearch, customerOptions, form.clientId]);

  useEffect(() => {
    if (!open) return;
    if (!form.clientId) {
      setInvoiceOptions([]);
      return;
    }
    loadInvoices(form.clientId);
  }, [open, form.clientId, loadInvoices]);

  useEffect(() => {
    if (!open) return;
    setForm((p) => ({
      ...DEFAULT_FORM,
      amount: defaultAmount || p.amount,
      clientId: defaultClientId || p.clientId,
      allocations: defaultInvoiceId ? [{ invoiceId: defaultInvoiceId, amount: "" }] : [{ invoiceId: "", amount: "" }],
    }));
    setCustomerSearch(defaultClientName || suggestedClientSearch?.trim() || "");
  }, [open, defaultClientId, defaultClientName, defaultInvoiceId, defaultAmount, suggestedClientSearch]);

  useEffect(() => {
    if (open && form.clientId && isClientFixed) {
      api.getClient(form.clientId).then((c) => setCustomerSearch(c?.companyName || c?.contactName || "")).catch(() => {});
    }
  }, [open, form.clientId, isClientFixed]);

  useEffect(() => {
    if (!open || form.method !== "CREDIT_NOTE") return;
    setForm((p) => {
      const first = Array.isArray(p.allocations) && p.allocations.length > 0 ? p.allocations[0] : { invoiceId: "", amount: "" };
      return { ...p, allocations: [{ ...first, amount: String(p.amount || "") }] };
    });
  }, [open, form.method, form.amount]);

  function updateAllocationRow(index, patch) {
    setForm((p) => {
      const rows = Array.isArray(p.allocations) ? p.allocations.slice() : [];
      rows[index] = { ...(rows[index] || { invoiceId: "", amount: "" }), ...(patch || {}) };
      return { ...p, allocations: rows };
    });
  }

  function addAllocationRow() {
    setForm((p) => ({
      ...p,
      allocations: [...(Array.isArray(p.allocations) ? p.allocations : []), { invoiceId: "", amount: "" }],
    }));
  }

  function removeAllocationRow(index) {
    setForm((p) => {
      const rows = Array.isArray(p.allocations) ? p.allocations.slice() : [];
      rows.splice(index, 1);
      return { ...p, allocations: rows.length > 0 ? rows : [{ invoiceId: "", amount: "" }] };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setDialogError(null);
    if (onError) onError(null);
    try {
      const amountNum = Number(form.amount || 0);
      const allocations = Array.isArray(form.allocations) ? form.allocations : [];
      const cleanedAllocations = allocations
        .map((a) => ({ invoiceId: String(a?.invoiceId || "").trim(), amount: String(a?.amount || "").trim() }))
        .filter((a) => a.invoiceId && a.amount && Number(a.amount) > 0);

      if (!form.clientId) throw new Error("Please select a customer.");
      if (!amountNum || amountNum <= 0) throw new Error("Please enter a valid amount.");
      if (cleanedAllocations.length === 0) throw new Error("Please allocate this payment to at least one invoice.");

      if (form.method === "CREDIT_NOTE") {
        if (cleanedAllocations.length !== 1) throw new Error("Credit notes can only be applied to a single invoice.");
        if (Number(cleanedAllocations[0].amount) !== amountNum) throw new Error("Credit note allocation amount must equal the payment amount.");
      }

      if (reconciliationContext) {
        await api.recordPaymentFromStatement(reconciliationContext.reconciliationId, {
          statementLineId: reconciliationContext.statementLineId,
          clientId: form.clientId,
          amount: String(form.amount),
          allocations: cleanedAllocations,
        });
      } else {
        await api.createPayment({
          clientId: form.clientId,
          amount: String(form.amount),
          method: form.method,
          transactionId: form.transactionId || null,
          notes: form.notes || null,
          allocations: cleanedAllocations,
        });
      }
      onOpenChange(false);
      setForm({ ...DEFAULT_FORM, clientId: defaultClientId || "" });
      if (onSuccess) onSuccess();
    } catch (e) {
      const msg = e.message || "Failed to record payment";
      setDialogError(msg);
      if (onError) onError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const clientId = form.clientId || defaultClientId;

    return (
    <Dialog
      open={open}
      onOpenChange={(o) => { setDialogError(null); onOpenChange(o); }}
      title={reconciliationContext ? "Allocate deposit to invoice" : "Record Payment"}
      className="max-w-2xl"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {dialogError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{dialogError}</div>
        ) : null}
        <div className="space-y-4">
          {isClientFixed ? (
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Customer</label>
              <div className="h-10 flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700">
                {customerSearch || "—"}
              </div>
              <input type="hidden" name="clientId" value={clientId} />
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Customer</label>
              <div className="relative">
                <Input
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    loadCustomers(e.target.value);
                  }}
                  onFocus={() => setCustomerDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setCustomerDropdownOpen(false), 150)}
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
                        onClick={() => {
                          setForm((p) => ({ ...p, clientId: c.id }));
                          setCustomerSearch(c.companyName || c.contactName || "—");
                          setCustomerOptions([]);
                          setCustomerDropdownOpen(false);
                        }}
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
              <input type="hidden" name="clientId" value={clientId} />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Invoice</label>
            <div className="space-y-2">
              {(Array.isArray(form.allocations) ? form.allocations : []).map((row, idx) => {
                const selectedInv = invoiceOptions.find((i) => i.id === row.invoiceId);
                const balanceDue = Number(selectedInv?.balanceDue || 0);
                return (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_minmax(180px,auto)_auto] gap-2 items-center">
                    <select
                      value={row.invoiceId}
                      onChange={(e) => updateAllocationRow(idx, { invoiceId: e.target.value })}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                      disabled={!clientId || loadingInvoices}
                    >
                      <option value="">{loadingInvoices ? "Loading invoices…" : "Select invoice"}</option>
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
                        disabled={form.method === "CREDIT_NOTE"}
                      />
                      {form.method !== "CREDIT_NOTE" && balanceDue > 0 ? (
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
                      disabled={form.method === "CREDIT_NOTE" || (Array.isArray(form.allocations) ? form.allocations.length : 0) <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                );
              })}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Allocated: {formatMoney(allocatedTotal)} • Unallocated: {formatMoney(unallocatedTotal)}
                  </span>
                  <Button type="button" variant="outline" size="sm" onClick={addAllocationRow} disabled={form.method === "CREDIT_NOTE"}>
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
              <label className="text-sm font-medium text-slate-700">
                Amount {reconciliationContext ? "(from bank statement)" : ""}
              </label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={form.amount}
                onChange={(e) => !reconciliationContext && setForm((p) => ({ ...p, amount: e.target.value }))}
                readOnly={!!reconciliationContext}
                required
                className={`h-10 ${reconciliationContext ? "bg-slate-50" : ""}`}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Method</label>
              <select
                value={form.method}
                onChange={(e) => setForm((p) => ({ ...p, method: e.target.value }))}
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
              value={form.transactionId}
              onChange={(e) => setForm((p) => ({ ...p, transactionId: e.target.value }))}
              placeholder="Reference number"
              className="h-10"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Notes (optional)</label>
            <Input
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Internal notes"
              className="h-10"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={submitting || !clientId} className="bg-violet-600 hover:bg-violet-700">
            {submitting ? "Recording…" : "Record Payment"}
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

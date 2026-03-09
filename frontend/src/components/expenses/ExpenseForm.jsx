import React, { useMemo, useState } from "react";
import Button from "../ui/button";
import Input from "../ui/input";
import Select from "../ui/select";
import Money from "../common/money";

const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "BANK_TRANSFER", label: "Bank transfer" },
  { value: "CREDIT_CARD", label: "Credit card" },
  { value: "DEBIT_CARD", label: "Debit card" },
  { value: "CHECK", label: "Check" },
  { value: "ONLINE", label: "Online" },
];

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export default function ExpenseForm({
  initialValues,
  suppliers,
  categories,
  loading,
  serverError,
  submitLabelDraft = "Save Draft",
  submitLabelApprove = "Save & Approve",
  onCancel,
  onSubmit,
}) {
  const [values, setValues] = useState(() => ({
    expenseDate: initialValues?.expenseDate || initialValues?.date || new Date().toISOString().slice(0, 10),
    supplierId: initialValues?.supplierId || "",
    categoryId: initialValues?.categoryId || "",
    description: initialValues?.description || "",
    amount: initialValues?.amount != null ? String(initialValues.amount) : "0",
    taxRate: initialValues?.taxRate != null ? String(initialValues.taxRate) : "0",
    paymentMethod: initialValues?.paymentMethod || "BANK_TRANSFER",
    notes: initialValues?.notes || "",
  }));

  const [attachment, setAttachment] = useState(null);

  const amount = useMemo(() => toNumber(values.amount), [values.amount]);
  const taxRate = useMemo(() => toNumber(values.taxRate), [values.taxRate]);
  const taxAmount = useMemo(() => amount * (taxRate / 100), [amount, taxRate]);
  const total = useMemo(() => amount + taxAmount, [amount, taxAmount]);

  function patch(p) {
    setValues((prev) => ({ ...prev, ...p }));
  }

  function submit(status) {
    onSubmit?.({
      ...values,
      amount: amount.toFixed(2),
      taxRate: taxRate.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      totalAmount: total.toFixed(2),
      status,
      attachment,
    });
  }

  return (
    <div className="space-y-4">
      {serverError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Expense date</label>
          <Input type="date" value={values.expenseDate} onChange={(e) => patch({ expenseDate: e.target.value })} />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Supplier</label>
          <Select value={values.supplierId} onChange={(e) => patch({ supplierId: e.target.value })}>
            <option value="">Select supplier…</option>
            {(suppliers || []).map((s) => (
              <option key={s.id} value={s.id}>
                {s.supplierName || "—"}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Category</label>
          <Select value={values.categoryId} onChange={(e) => patch({ categoryId: e.target.value })}>
            <option value="">Select category…</option>
            {(categories || []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name || "—"}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Payment method</label>
          <Select value={values.paymentMethod} onChange={(e) => patch({ paymentMethod: e.target.value })}>
            {PAYMENT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-medium text-slate-600">Description</label>
          <Input value={values.description} onChange={(e) => patch({ description: e.target.value })} placeholder="What was this expense for?" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Amount (excl. tax)</label>
          <Input
            type="number"
            value={values.amount}
            onChange={(e) => patch({ amount: e.target.value })}
            className="text-right"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-600">Tax rate %</label>
          <Input
            type="number"
            value={values.taxRate}
            onChange={(e) => patch({ taxRate: e.target.value })}
            className="text-right"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-medium text-slate-600">Notes</label>
          <textarea
            value={values.notes}
            onChange={(e) => patch({ notes: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            placeholder="Optional notes"
          />
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-xs font-medium text-slate-600">Attachment (receipt)</label>
          <input
            type="file"
            onChange={(e) => setAttachment(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
          />
          {attachment ? <div className="text-xs text-slate-500">Selected: {attachment.name}</div> : null}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-300">Tax</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              <Money value={taxAmount} />
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-slate-300">Total</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              <Money value={total} />
            </span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={() => submit("DRAFT")} disabled={loading}>
              {loading ? "Saving…" : submitLabelDraft}
            </Button>
            <Button className="bg-violet-600 hover:bg-violet-700" onClick={() => submit("APPROVED")} disabled={loading}>
              {loading ? "Saving…" : submitLabelApprove}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

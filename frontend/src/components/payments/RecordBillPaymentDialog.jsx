import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import Dialog from "../ui/dialog";
import Input from "../ui/input";
import Button from "../ui/button";
import { formatMoney } from "../common/money";

export default function RecordBillPaymentDialog({
  open,
  onOpenChange,
  bill,
  onSuccess,
}) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("BANK_TRANSFER");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const balanceDue = Number(bill?.balanceDue ?? bill?.totalAmount ?? 0);
  const supplierId = bill?.supplierId ?? bill?.supplier?.id;

  useEffect(() => {
    if (open && bill) {
      setAmount(String(balanceDue));
      setError(null);
    }
  }, [open, bill, balanceDue]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!supplierId) {
      setError("This bill has no supplier linked. Edit the bill to add a supplier before recording payments.");
      return;
    }

    const amountNum = Number(amount || 0);
    if (!amountNum || amountNum <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (amountNum > balanceDue) {
      setError(`Amount cannot exceed the outstanding balance (${formatMoney(balanceDue)}).`);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await api.createSupplierPayment({
        supplierId,
        amount: String(amount),
        method,
        reference: reference.trim() || undefined,
        notes: notes.trim() || undefined,
        allocations: [{ billId: bill.id, amount: String(amount) }],
      });
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (e) {
      setError(e?.message || "Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setError(null);
        onOpenChange(o);
      }}
      title="Record Bill Payment"
      className="max-w-md"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        {bill && !supplierId ? (
          <p className="text-sm text-slate-600">
            This bill has no supplier linked. Go to Edit Bill and link a supplier to record payments.
          </p>
        ) : (
          <>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
              <div className="text-xs text-slate-500">Bill</div>
              <div className="mt-0.5 font-medium text-slate-900">
                {bill?.reference || `BILL-${String(bill?.billNumber || "").padStart(4, "0")}`} • {bill?.vendorName || "—"}
              </div>
              <div className="mt-1 text-xs text-slate-600">Outstanding: {formatMoney(balanceDue)}</div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Amount</label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                max={balanceDue}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="h-10"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1"
                onClick={() => setAmount(String(balanceDue))}
              >
                Pay full balance
              </Button>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
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

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Reference (optional)</label>
              <Input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Cheque no, transaction ref…"
                className="h-10"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Notes (optional)</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes"
                className="h-10"
              />
            </div>
          </>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            type="submit"
            disabled={submitting || !supplierId}
            className="bg-violet-600 hover:bg-violet-700"
          >
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

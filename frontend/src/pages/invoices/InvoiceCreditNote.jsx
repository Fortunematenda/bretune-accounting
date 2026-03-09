import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import Money from "../../components/common/money";

function fmtDate(v) {
  if (!v) return "—";
  try {
    return String(v).slice(0, 10);
  } catch {
    return "—";
  }
}

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function InvoiceCreditNotePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    amount: "",
    date: todayISO(),
    reference: "",
    notes: "",
  });

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setError(null);

    api
      .getInvoice(id)
      .then((res) => {
        if (!mounted) return;
        setInvoice(res);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message ? String(e.message) : "Failed to load invoice");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const balanceDue = useMemo(() => Number(invoice?.balanceDue || 0), [invoice]);

  useEffect(() => {
    if (!invoice) return;
    if (String(form.amount || "").trim()) return;
    if (!(balanceDue > 0)) return;
    setForm((p) => ({ ...p, amount: String(balanceDue) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoice, balanceDue]);

  const clientName = useMemo(() => {
    const c = invoice?.client;
    if (!c) return "—";
    return c.companyName ? String(c.companyName) : String(c.contactName || "—");
  }, [invoice]);

  const canCredit = useMemo(() => {
    const status = String(invoice?.status || "").toUpperCase();
    if (!invoice) return false;
    if (["DRAFT", "CANCELLED"].includes(status)) return false;
    return balanceDue > 0;
  }, [invoice, balanceDue]);

  async function submit() {
    if (!invoice?.id) return;

    const amt = Number(String(form.amount || "").trim());
    if (!Number.isFinite(amt) || amt <= 0) {
      setError("Credit amount must be greater than 0.");
      return;
    }

    if (amt > balanceDue) {
      setError(`Credit amount cannot exceed the outstanding balance (${balanceDue}).`);
      return;
    }

    if (!canCredit) {
      setError("This invoice has no outstanding balance to credit.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await api.createPayment({
        invoiceId: invoice.id,
        clientId: invoice.clientId,
        amount: String(amt),
        paymentDate: form.date || null,
        method: "CREDIT_NOTE",
        transactionId: form.reference ? String(form.reference) : null,
        notes: form.notes ? String(form.notes) : null,
      });

      navigate(`/invoices/${invoice.id}/edit`, { replace: true });
    } catch (e) {
      setError(e?.message ? String(e.message) : "Failed to apply credit");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xl font-semibold truncate">Create Credit Note</div>
          <div className="text-sm text-slate-600 truncate">
            {invoice?.invoiceNumber ? `Invoice ${invoice.invoiceNumber}` : "Invoice"} • {clientName}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(-1)} disabled={saving}>
            Cancel
          </Button>
          <Button
            className="bg-violet-600 hover:bg-violet-700 text-white"
            onClick={submit}
            disabled={saving || loading || !invoice?.id}
          >
            {saving ? "Saving…" : "Save Credit Note"}
          </Button>
        </div>
      </div>

      {loading ? <div className="text-sm text-slate-600">Loading…</div> : null}
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
      {!loading && !error && !invoice ? <div className="text-sm text-slate-600">Invoice not found.</div> : null}

      {invoice ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Credit note details</CardTitle>
              </CardHeader>
              <CardContent>
                {!canCredit ? (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    This invoice cannot be credited. Only sent/partially paid invoices with an outstanding balance can be credited.
                  </div>
                ) : null}

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">Credit date</label>
                    <Input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                      disabled={saving}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">Reference</label>
                    <Input
                      value={form.reference}
                      onChange={(e) => setForm((p) => ({ ...p, reference: e.target.value }))}
                      placeholder="e.g. CN-001"
                      disabled={saving}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-600">Amount</label>
                    <Input
                      value={form.amount}
                      onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                      placeholder="0.00"
                      inputMode="decimal"
                      disabled={saving}
                    />
                    <div className="text-xs text-slate-500">
                      Outstanding balance: <Money value={balanceDue} />
                    </div>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-medium text-slate-600">Reason / Notes</label>
                    <Input
                      value={form.notes}
                      onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                      placeholder="Reason for credit"
                      disabled={saving}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Invoice summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-600">Customer</span>
                    <span className="text-slate-900 font-medium text-right">{clientName}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-600">Invoice #</span>
                    <span className="text-slate-900 font-medium">{invoice.invoiceNumber || "—"}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-600">Invoice date</span>
                    <span className="text-slate-900 font-medium">{fmtDate(invoice.issueDate)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-600">Due date</span>
                    <span className="text-slate-900 font-medium">{fmtDate(invoice.dueDate)}</span>
                  </div>

                  <div className="border-t border-slate-200 pt-3 mt-3 space-y-2">
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-600">Total</span>
                      <span className="text-slate-900 font-medium">
                        <Money value={Number(invoice.totalAmount || 0)} />
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-600">Paid</span>
                      <span className="text-slate-900 font-medium">
                        <Money value={Number(invoice.amountPaid || 0)} />
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-600">Balance due</span>
                      <span className="text-slate-900 font-semibold">
                        <Money value={balanceDue} />
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}

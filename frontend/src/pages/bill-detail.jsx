import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import RecordBillPaymentDialog from "../components/payments/RecordBillPaymentDialog";
import Money from "../components/common/money";
import StatusBadge from "../components/common/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import ActionsMenu from "../components/common/ActionsMenu";
import { ArrowLeft, FileText } from "lucide-react";

function fmtDate(d) {
  if (!d) return "—";
  return String(d).slice(0, 10);
}

function formatBillDisplayNumber(bill) {
  if (!bill) return "—";
  if (bill.reference) return String(bill.reference);
  const n = Number(bill.billNumber);
  if (!Number.isFinite(n) || n <= 0) return "—";
  return `BILL-${String(n).padStart(4, "0")}`;
}

function parseDescription(raw) {
  const s = raw == null ? "" : String(raw);
  if (!s.trim()) return { memo: "", items: [] };

  try {
    const parsed = JSON.parse(s);
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.items)) {
      return {
        memo: typeof parsed.memo === "string" ? parsed.memo : "",
        items: parsed.items,
      };
    }
  } catch {
    // ignore
  }

  return { memo: s, items: [] };
}

function calcTotals(items) {
  const safe = Array.isArray(items) ? items : [];
  let subtotal = 0;
  let tax = 0;

  for (const it of safe) {
    const qty = Number(it?.quantity ?? 0);
    const unit = Number(it?.unitCost ?? 0);
    const rate = Number(it?.taxRate ?? 0);
    if (!Number.isFinite(qty) || !Number.isFinite(unit) || !Number.isFinite(rate)) continue;
    const lineSubtotal = qty * unit;
    const lineTax = lineSubtotal * (rate / 100);
    subtotal += lineSubtotal;
    tax += lineTax;
  }

  const total = subtotal + tax;
  return { subtotal, tax, total };
}

export default function BillDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getBill(id);
      setBill(res);
    } catch (e) {
      setError(e?.message || "Failed to load bill");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const overdue = useMemo(() => {
    if (!bill?.dueDate) return false;
    if (String(bill.status || "").toUpperCase() !== "OPEN") return false;
    const d = new Date(bill.dueDate);
    if (Number.isNaN(d.getTime())) return false;
    return d < new Date();
  }, [bill]);

  const parsed = useMemo(() => parseDescription(bill?.description), [bill?.description]);
  const totals = useMemo(() => calcTotals(parsed.items), [parsed.items]);

  async function markPaid() {
    if (!bill) return;
    if (!window.confirm("Mark this bill as paid?")) return;

    setSaving(true);
    setError(null);
    try {
      const res = await api.updateBill(bill.id, { status: "PAID" });
      setBill(res);
    } catch (e) {
      setError(e?.message || "Failed to update bill");
    } finally {
      setSaving(false);
    }
  }

  async function deleteBill() {
    if (!bill) return;
    if (!window.confirm("Delete this bill? This cannot be undone.")) return;

    setSaving(true);
    setError(null);
    try {
      await api.deleteBill(bill.id);
      navigate("/bills");
    } catch (e) {
      setError(e?.message || "Failed to delete bill");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-0">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <button
          type="button"
          onClick={() => navigate("/bills")}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Bills
        </button>
      </nav>

      {loading ? <div className="py-12 text-center text-sm text-slate-500">Loading…</div> : null}
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div> : null}

      {bill ? (
        <>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
            <div className="flex items-start gap-3 min-w-0">
              <div className="h-11 w-11 rounded-lg bg-violet-50 ring-1 ring-violet-100 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-violet-600" strokeWidth={1.7} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl font-semibold text-slate-900">{formatBillDisplayNumber(bill)}</h1>
                  <StatusBadge status={overdue ? "OVERDUE" : bill.status} />
                </div>
                <p className="mt-0.5 text-sm text-slate-500">{bill.vendorName || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" className="h-9" onClick={() => navigate(`/bills/${id}/edit`)} disabled={saving || loading}>Edit</Button>
              <ActionsMenu
                ariaLabel="Bill actions"
                buttonClassName="h-9 w-9"
                menuWidthClassName="w-52"
                items={[
                  { key: "record_payment", label: "Record Payment", disabled: saving || loading || bill?.status === "PAID", onSelect: () => setRecordPaymentOpen(true) },
                  { key: "mark_paid", label: "Mark as Paid", disabled: saving || loading || bill?.status === "PAID", onSelect: markPaid },
                  { key: "delete", label: "Delete Bill", tone: "danger", disabled: saving || loading, onSelect: deleteBill },
                ]}
              />
            </div>
          </div>

          {/* Summary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Card><CardContent className="p-3.5"><div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Total</div><div className="mt-1 text-lg font-semibold tabular-nums text-slate-900"><Money value={bill.totalAmount} /></div></CardContent></Card>
            <Card><CardContent className="p-3.5"><div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Issue Date</div><div className="mt-1 text-lg font-semibold text-slate-900">{fmtDate(bill.billDate)}</div></CardContent></Card>
            <Card><CardContent className="p-3.5"><div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Due Date</div><div className={"mt-1 text-lg font-semibold " + (overdue ? "text-rose-600" : "text-slate-900")}>{fmtDate(bill.dueDate)}</div></CardContent></Card>
            <Card><CardContent className="p-3.5"><div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Tax</div><div className="mt-1 text-lg font-semibold tabular-nums text-slate-900"><Money value={totals.tax || 0} /></div></CardContent></Card>
          </div>

          {/* Notes */}
          {parsed.memo ? (
            <Card className="border-slate-200/80 mb-6">
              <CardContent className="p-4">
                <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1.5">Notes</div>
                <p className="text-sm text-slate-700">{parsed.memo}</p>
              </CardContent>
            </Card>
          ) : null}

          {/* Line items + Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Card className="border-slate-200/80 overflow-hidden">
                <CardContent className="p-0">
                  <div className="px-4 py-3">
                    <h3 className="text-sm font-medium text-slate-700">Line Items</h3>
                  </div>
                  {Array.isArray(parsed.items) && parsed.items.length > 0 ? (
                    <div className="overflow-auto">
                      <table className="min-w-full text-[13px]">
                        <thead className="bg-slate-50/80">
                          <tr className="border-y border-slate-200/80">
                            <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Description</th>
                            <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Category</th>
                            <th className="py-2.5 px-3 text-right text-xs font-medium text-slate-500">Qty</th>
                            <th className="py-2.5 px-3 text-right text-xs font-medium text-slate-500">Unit Cost</th>
                            <th className="py-2.5 px-3 text-right text-xs font-medium text-slate-500">Total</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {parsed.items.map((it, idx) => {
                            const qty = Number(it?.quantity ?? 0);
                            const unit = Number(it?.unitCost ?? 0);
                            const rate = Number(it?.taxRate ?? 0);
                            const subtotal = (Number.isFinite(qty) ? qty : 0) * (Number.isFinite(unit) ? unit : 0);
                            const total = subtotal + subtotal * (Number.isFinite(rate) ? rate / 100 : 0);

                            return (
                              <tr key={idx} className="border-b border-slate-100">
                                <td className="py-2.5 px-3 font-medium text-slate-900">{it?.description || "—"}</td>
                                <td className="py-2.5 px-3 text-slate-500">{it?.category || "—"}</td>
                                <td className="py-2.5 px-3 text-right tabular-nums text-slate-600">{Number.isFinite(qty) ? qty : "—"}</td>
                                <td className="py-2.5 px-3 text-right tabular-nums text-slate-600"><Money value={Number.isFinite(unit) ? unit : 0} /></td>
                                <td className="py-2.5 px-3 text-right tabular-nums font-medium text-slate-900"><Money value={total} /></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="px-4 pb-4 text-sm text-slate-400 italic">No line items stored for this bill.</div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-slate-200/80">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Summary</h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="font-medium tabular-nums text-slate-800"><Money value={totals.subtotal || 0} /></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Tax</span>
                      <span className="font-medium tabular-nums text-slate-800"><Money value={totals.tax || 0} /></span>
                    </div>
                    <div className="pt-2.5 mt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="font-bold text-violet-700">Total</span>
                      <span className="font-bold tabular-nums text-violet-700"><Money value={totals.total || bill.totalAmount} /></span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : null}

      {recordPaymentOpen && bill ? (
        <RecordBillPaymentDialog
          open={recordPaymentOpen}
          onOpenChange={setRecordPaymentOpen}
          bill={bill}
          onSuccess={load}
        />
      ) : null}
    </div>
  );
}

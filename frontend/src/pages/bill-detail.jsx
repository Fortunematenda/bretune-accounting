import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import RecordBillPaymentDialog from "../components/payments/RecordBillPaymentDialog";
import Money from "../components/common/money";
import BillStatusBadge from "../components/bills/BillStatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import ActionsMenu from "../components/common/ActionsMenu";

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
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Bill Details</h1>
              <p className="mt-1 text-sm text-slate-500">Review bill details and status</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ActionsMenu
                ariaLabel="Bill actions"
                menuWidthClassName="w-56"
                items={[
                  {
                    key: "edit",
                    label: "Edit",
                    disabled: saving || loading,
                    onSelect: () => navigate(`/bills/${id}/edit`),
                  },
                  {
                    key: "record_payment",
                    label: "Record payment",
                    disabled: saving || loading || bill?.status === "PAID",
                    onSelect: () => setRecordPaymentOpen(true),
                  },
                  {
                    key: "mark_paid",
                    label: "Mark as paid",
                    disabled: saving || loading || bill?.status === "PAID",
                    onSelect: markPaid,
                  },
                  {
                    key: "delete",
                    label: "Delete",
                    tone: "danger",
                    disabled: saving || loading,
                    onSelect: deleteBill,
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : null}

          {loading ? <div className="text-sm text-slate-600">Loading…</div> : null}

          {bill ? (
            <>
              <Card className="hover:translate-y-0">
                <CardHeader>
                  <CardTitle>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-slate-500">Bill</div>
                        <div className="mt-1 text-base font-semibold text-slate-900 truncate">
                          {formatBillDisplayNumber(bill)}
                        </div>
                        <div className="mt-1 text-sm text-slate-600">{bill.vendorName || "—"}</div>
                      </div>
                      <div className="shrink-0">
                        <BillStatusBadge status={bill.status} overdue={overdue} />
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                      <div className="text-xs text-slate-500">Issue date</div>
                      <div className="mt-1 font-medium">{fmtDate(bill.billDate)}</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                      <div className="text-xs text-slate-500">Due date</div>
                      <div className="mt-1 font-medium">{fmtDate(bill.dueDate)}</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                      <div className="text-xs text-slate-500">Total amount</div>
                      <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                        <Money value={bill.totalAmount} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div className="lg:col-span-2">
                      <div className="text-xs font-medium text-slate-500">Notes</div>
                      <div className="mt-1 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                        {parsed.memo ? parsed.memo : "—"}
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Subtotal</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          <Money value={totals.subtotal || 0} />
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Tax</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          <Money value={totals.tax || 0} />
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-200 font-semibold">Total</span>
                        <span className="text-slate-900 dark:text-slate-100 font-semibold">
                          <Money value={totals.total || bill.totalAmount} />
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <Card className="hover:translate-y-0">
                    <CardHeader>
                      <CardTitle>Line items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Array.isArray(parsed.items) && parsed.items.length > 0 ? (
                        <div className="overflow-hidden rounded-xl border border-slate-200">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead>Account / Category</TableHead>
                                <TableHead className="text-right">Qty</TableHead>
                                <TableHead className="text-right">Unit Cost</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {parsed.items.map((it, idx) => {
                                const qty = Number(it?.quantity ?? 0);
                                const unit = Number(it?.unitCost ?? 0);
                                const rate = Number(it?.taxRate ?? 0);
                                const subtotal = (Number.isFinite(qty) ? qty : 0) * (Number.isFinite(unit) ? unit : 0);
                                const total = subtotal + subtotal * (Number.isFinite(rate) ? rate / 100 : 0);

                                return (
                                  <TableRow key={idx}>
                                    <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                                      {it?.description || "—"}
                                    </TableCell>
                                    <TableCell className="text-slate-600 dark:text-slate-300">
                                      {it?.category || "—"}
                                    </TableCell>
                                    <TableCell className="text-right text-slate-600 dark:text-slate-300">
                                      {Number.isFinite(qty) ? qty : "—"}
                                    </TableCell>
                                    <TableCell className="text-right text-slate-600 dark:text-slate-300">
                                      <Money value={Number.isFinite(unit) ? unit : 0} />
                                    </TableCell>
                                    <TableCell className="text-right text-slate-900 dark:text-slate-100">
                                      <Money value={total} />
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                          No line items stored for this bill.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="hover:translate-y-0">
                    <CardHeader>
                      <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 dark:text-slate-300">Subtotal</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            <Money value={totals.subtotal || 0} />
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 dark:text-slate-300">Tax</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            <Money value={totals.tax || 0} />
                          </span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-slate-700 dark:text-slate-200 font-semibold">Total</span>
                          <span className="text-slate-900 dark:text-slate-100 font-semibold">
                            <Money value={totals.total || bill.totalAmount} />
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

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

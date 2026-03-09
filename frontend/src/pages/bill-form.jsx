import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import Select from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Money from "../components/common/money";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
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

function calcLineTotal(it) {
  const qty = Number(it?.quantity ?? 0);
  const unit = Number(it?.unitCost ?? 0);
  const rate = Number(it?.taxRate ?? 0);
  const subtotal = (Number.isFinite(qty) ? qty : 0) * (Number.isFinite(unit) ? unit : 0);
  const tax = subtotal * (Number.isFinite(rate) ? rate / 100 : 0);
  return subtotal + tax;
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

  return { subtotal, tax, total: subtotal + tax };
}

export default function BillFormPage() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [suppliers, setSuppliers] = useState([]);
  const [useOtherSupplier, setUseOtherSupplier] = useState(false);

  const [form, setForm] = useState({
    vendorName: "",
    reference: "",
    billDate: todayIso(),
    dueDate: "",
    memo: "",
  });

  const [items, setItems] = useState([
    { description: "", category: "", quantity: 1, unitCost: 0, taxRate: 0 },
  ]);

  const totals = useMemo(() => calcTotals(items), [items]);

  useEffect(() => {
    let mounted = true;
    api
      .listSuppliers({ page: 1, limit: 1000 })
      .then((res) => {
        if (!mounted) return;
        const rows = Array.isArray(res?.data) ? res.data : [];
        setSuppliers(rows);
      })
      .catch(() => {})
      .finally(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const load = useCallback(async () => {
    if (!editing) return;
    setLoading(true);
    setError(null);

    try {
      const bill = await api.getBill(id);
      const parsed = parseDescription(bill?.description);

      setForm({
        vendorName: bill?.vendorName || "",
        reference: bill?.reference || "",
        billDate: bill?.billDate ? String(bill.billDate).slice(0, 10) : todayIso(),
        dueDate: bill?.dueDate ? String(bill.dueDate).slice(0, 10) : "",
        memo: parsed.memo || "",
      });

      if (Array.isArray(parsed.items) && parsed.items.length > 0) {
        setItems(
          parsed.items.map((it) => ({
            description: it?.description || "",
            category: it?.category || "",
            quantity: Number(it?.quantity ?? 1),
            unitCost: Number(it?.unitCost ?? 0),
            taxRate: Number(it?.taxRate ?? 0),
          }))
        );
      }

      const foundById = bill?.supplierId && suppliers.find((s) => s?.id === bill.supplierId);
      const foundByName = suppliers.find((s) => (s?.supplierName || "") === (bill?.vendorName || ""));
      setUseOtherSupplier(!foundById && !foundByName);

    } catch (e) {
      setError(e?.message || "Failed to load bill");
    } finally {
      setLoading(false);
    }
  }, [editing, id, suppliers]);

  useEffect(() => {
    load();
  }, [load]);

  function addRow() {
    setItems((prev) => [...prev, { description: "", category: "", quantity: 1, unitCost: 0, taxRate: 0 }]);
  }

  function removeRow(idx) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateItem(idx, patch) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  async function save(status) {
    setSaving(true);
    setError(null);

    try {
      const vendorName = String(form.vendorName || "").trim();
      if (!vendorName) throw new Error("Supplier is required");

      const payload = {
        vendorName,
        reference: form.reference || null,
        billDate: form.billDate || null,
        dueDate: form.dueDate || null,
        status,
        totalAmount: totals.total.toFixed(2),
        description: JSON.stringify({ memo: form.memo || "", items }),
      };

      const matchedSupplier = suppliers.find((s) => (s?.supplierName || "") === vendorName);
      if (matchedSupplier?.id) payload.supplierId = matchedSupplier.id;

      if (editing) {
        await api.updateBill(id, payload);
      } else {
        await api.createBill(payload);
      }

      navigate("/bills");
    } catch (e) {
      setError(e?.message || "Could not save bill");
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
              <h1 className="text-xl font-semibold text-slate-900">{editing ? "Edit Bill" : "New Bill"}</h1>
              <p className="mt-1 text-sm text-slate-500">Create and manage supplier bills</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/bills")} disabled={saving}>
                Cancel
              </Button>
              <Button variant="secondary" onClick={() => save("DRAFT")} disabled={saving || loading}>
                {saving ? "Saving…" : "Save Draft"}
              </Button>
              <Button onClick={() => save("OPEN")} className="bg-violet-600 hover:bg-violet-700" disabled={saving || loading}>
                {saving ? "Saving…" : "Save Bill"}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : null}

          {loading ? <div className="text-sm text-slate-600">Loading…</div> : null}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <Card className="hover:translate-y-0">
                <CardHeader>
                  <CardTitle>Bill details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600">Supplier</label>
                      <div className="space-y-2">
                        <Select
                          value={
                            useOtherSupplier
                              ? "__other__"
                              : (suppliers || []).some((s) => (s?.supplierName || "") === (form.vendorName || ""))
                                ? form.vendorName
                                : "__other__"
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "__other__") {
                              setUseOtherSupplier(true);
                              setForm((p) => ({ ...p, vendorName: p.vendorName || "" }));
                            } else {
                              setUseOtherSupplier(false);
                              setForm((p) => ({ ...p, vendorName: val }));
                            }
                          }}
                          className="h-10"
                        >
                          <option value="">Choose supplier…</option>
                          {(suppliers || []).map((s) => (
                            <option key={s.id} value={s.supplierName}>
                              {s.supplierName}
                            </option>
                          ))}
                          <option value="__other__">Other (enter name manually)</option>
                        </Select>
                        {useOtherSupplier && (
                          <Input
                            value={form.vendorName}
                            onChange={(e) => setForm((p) => ({ ...p, vendorName: e.target.value }))}
                            placeholder="Supplier name"
                          />
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600">Bill number</label>
                      <Input
                        value={form.reference}
                        onChange={(e) => setForm((p) => ({ ...p, reference: e.target.value }))}
                        placeholder="e.g. INV-123 / Ref"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600">Issue date</label>
                      <Input
                        type="date"
                        value={form.billDate}
                        onChange={(e) => setForm((p) => ({ ...p, billDate: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-600">Due date</label>
                      <Input
                        type="date"
                        value={form.dueDate}
                        onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-medium text-slate-600">Notes</label>
                      <textarea
                        value={form.memo}
                        onChange={(e) => setForm((p) => ({ ...p, memo: e.target.value }))}
                        rows={3}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                        placeholder="Optional notes / memo"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:translate-y-0">
                <CardHeader>
                  <CardTitle>Line items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Description</TableHead>
                          <TableHead>Account / Category</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead className="text-right">Unit Cost</TableHead>
                          <TableHead className="text-right">Tax %</TableHead>
                          <TableHead className="text-right">Line Total</TableHead>
                          <TableHead className="text-right"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((it, idx) => {
                          const lineTotal = calcLineTotal(it);
                          return (
                            <TableRow key={idx}>
                              <TableCell>
                                <Input
                                  value={it.description}
                                  onChange={(e) => updateItem(idx, { description: e.target.value })}
                                  placeholder="Description"
                                  className="h-9"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  value={it.category}
                                  onChange={(e) => updateItem(idx, { category: e.target.value })}
                                  placeholder="Category"
                                  className="h-9"
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                <Input
                                  type="number"
                                  value={it.quantity}
                                  onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
                                  className="h-9 text-right"
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                <Input
                                  type="number"
                                  value={it.unitCost}
                                  onChange={(e) => updateItem(idx, { unitCost: Number(e.target.value) })}
                                  className="h-9 text-right"
                                />
                              </TableCell>
                              <TableCell className="text-right">
                                <Input
                                  type="number"
                                  value={it.taxRate}
                                  onChange={(e) => updateItem(idx, { taxRate: Number(e.target.value) })}
                                  className="h-9 text-right"
                                />
                              </TableCell>
                              <TableCell className="text-right font-medium text-slate-900 dark:text-slate-100">
                                <Money value={lineTotal} />
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeRow(idx)}
                                  disabled={items.length <= 1}
                                  aria-label="Remove row"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <Button variant="outline" size="sm" onClick={addRow}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add line
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="hover:translate-y-0">
                <CardHeader>
                  <CardTitle>Totals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Subtotal</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        <Money value={totals.subtotal} />
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Tax</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        <Money value={totals.tax} />
                      </span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-slate-700 dark:text-slate-200 font-semibold">Total</span>
                      <span className="text-slate-900 dark:text-slate-100 font-semibold">
                        <Money value={totals.total} />
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:translate-y-0">
                <CardHeader>
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Save Draft keeps the bill in Draft. Save Bill sets it to Awaiting Payment.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

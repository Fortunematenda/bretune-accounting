import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Plus, Pencil, Receipt, Wallet } from "lucide-react";
import { api } from "../../../lib/api";
import Button from "../../../components/ui/button";
import Dialog from "../../../components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import Money from "../../../components/common/money";
import SupplierSummaryCards from "../components/SupplierSummaryCards";

function statusBadgeClass(s) {
  const v = String(s || "").toUpperCase();
  if (v === "ACTIVE") return "inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800";
  if (v === "INACTIVE") return "inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700";
  return "inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700";
}

function fmtDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "2-digit" }).format(dt);
  } catch {
    return dt.toISOString().slice(0, 10);
  }
}

function normalizeTransactions(supplier) {
  const tx = [];
  const raw = Array.isArray(supplier?.transactions) ? supplier.transactions : [];

  for (const t of raw) {
    tx.push({
      id: t.id || `${t.type || "TX"}-${t.reference || ""}-${t.date || ""}`,
      date: t.date || t.createdAt || null,
      type: t.type || "Transaction",
      reference: t.reference || t.ref || t.number || "—",
      amount: t.amount != null ? Number(t.amount) : null,
      status: t.status || "—",
      raw: t,
    });
  }

  const bills = Array.isArray(supplier?.bills) ? supplier.bills : [];
  for (const b of bills) {
    tx.push({
      id: b.id || `BILL-${b.reference || b.billNumber || ""}-${b.issueDate || b.createdAt || ""}`,
      date: b.issueDate || b.date || b.createdAt || null,
      type: "Bill",
      reference: b.reference || b.billNumber || b.id || "—",
      amount: b.totalAmount != null ? Number(b.totalAmount) : b.amount != null ? Number(b.amount) : null,
      status: b.status || "—",
      raw: b,
    });
  }

  const payments = Array.isArray(supplier?.payments) ? supplier.payments : [];
  for (const p of payments) {
    tx.push({
      id: p.id || `PAY-${p.reference || ""}-${p.date || p.createdAt || ""}`,
      date: p.date || p.paidAt || p.createdAt || null,
      type: "Payment",
      reference: p.reference || p.id || "—",
      amount: p.amount != null ? Number(p.amount) : null,
      status: p.status || "—",
      raw: p,
    });
  }

  return tx
    .filter((t) => t.date)
    .sort((a, b) => {
      const ad = new Date(a.date);
      const bd = new Date(b.date);
      const av = Number.isNaN(ad.getTime()) ? 0 : ad.getTime();
      const bv = Number.isNaN(bd.getTime()) ? 0 : bd.getTime();
      return bv - av;
    });
}

export default function SupplierDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const supplierQuery = useQuery({
    queryKey: ["supplier", id],
    queryFn: () => api.getSupplier(id),
    enabled: Boolean(id),
  });

  const supplier = supplierQuery.data;

  const title = supplier?.supplierName || supplier?.name || supplier?.companyName || "Supplier";
  const subtitleParts = [supplier?.companyName, supplier?.contactPerson, supplier?.email, supplier?.phone].filter(Boolean);
  const subtitle = subtitleParts.join(" · ");

  const transactions = useMemo(() => normalizeTransactions(supplier), [supplier]);

  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedTx, setSelectedTx] = useState(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (typeFilter && String(t.type).toUpperCase() !== String(typeFilter).toUpperCase()) return false;
      if (statusFilter && String(t.status).toUpperCase() !== String(statusFilter).toUpperCase()) return false;
      return true;
    });
  }, [transactions, typeFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <Button variant="outline" className="h-9" onClick={() => navigate("/suppliers")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-slate-900 truncate">{title}</h1>
              {supplier?.status ? <span className={statusBadgeClass(supplier.status)}>{supplier.status}</span> : null}
            </div>
            <p className="mt-1 text-sm text-slate-500 truncate">{subtitle || "—"}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-9" onClick={() => navigate(`/suppliers/${id}/edit`)} disabled={!id}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Supplier
          </Button>
          <Button
            variant="outline"
            className="h-9"
            disabled
            title="Bills UI coming soon"
            onClick={() => {}}
          >
            <Receipt className="h-4 w-4 mr-2" />
            New Bill
          </Button>
          <Button
            variant="outline"
            className="h-9"
            disabled
            title="Supplier payments coming soon"
            onClick={() => {}}
          >
            <Wallet className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        </div>
      </div>

      {supplierQuery.isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[110px] rounded-xl border border-slate-200 bg-white shadow-sm animate-pulse" />
          ))}
        </div>
      ) : supplierQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {supplierQuery.error?.message || "Failed to load supplier"}
        </div>
      ) : (
        <SupplierSummaryCards supplier={supplier} />
      )}

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Transactions</CardTitle>
              <div className="mt-1 text-sm text-slate-500">Bills, payments, and credits tied to this supplier.</div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
              >
                <option value="">All types</option>
                <option value="Bill">Bill</option>
                <option value="Payment">Payment</option>
                <option value="Credit">Credit</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
              >
                <option value="">All status</option>
                <option value="OPEN">Open</option>
                <option value="PAID">Paid</option>
                <option value="COMPLETED">Completed</option>
                <option value="VOID">Void</option>
              </select>

              <Button
                variant="outline"
                className="h-9"
                onClick={() => {
                  setTypeFilter("");
                  setStatusFilter("");
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {supplierQuery.isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-10 rounded bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="py-14 text-center">
              <div className="inline-flex flex-col items-center gap-3">
                <div className="rounded-full bg-slate-100 p-4">
                  <Plus className="h-8 w-8 text-slate-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-700">No transactions</div>
                  <div className="text-sm text-slate-500">Bills and payments will appear here once recorded.</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-slate-500">
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-3 whitespace-nowrap">Date</th>
                    <th className="py-3 px-3 whitespace-nowrap">Type</th>
                    <th className="py-3 px-3 whitespace-nowrap">Reference</th>
                    <th className="py-3 px-3 whitespace-nowrap text-right">Amount</th>
                    <th className="py-3 px-3 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((t) => (
                    <tr
                      key={t.id}
                      className="border-t border-slate-100 cursor-pointer hover:bg-slate-50"
                      onClick={() => setSelectedTx(t)}
                    >
                      <td className="py-3 px-3 whitespace-nowrap">{fmtDate(t.date)}</td>
                      <td className="py-3 px-3 whitespace-nowrap">{t.type}</td>
                      <td className="py-3 px-3 whitespace-nowrap">{t.reference}</td>
                      <td className="py-3 px-3 whitespace-nowrap text-right">
                        {t.amount == null ? "—" : <Money value={t.amount} />}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">{String(t.status || "—")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(selectedTx)}
        onOpenChange={(o) => {
          if (!o) setSelectedTx(null);
        }}
        title="Transaction"
        className="max-w-xl"
      >
        {selectedTx ? (
          <div className="space-y-4 text-sm">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-slate-500">Date</div>
                  <div className="text-slate-900 font-medium">{fmtDate(selectedTx.date)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Type</div>
                  <div className="text-slate-900 font-medium">{selectedTx.type}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Reference</div>
                  <div className="text-slate-900 font-medium">{selectedTx.reference}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500">Amount</div>
                  <div className="text-slate-900 font-medium">{selectedTx.amount == null ? "—" : <Money value={selectedTx.amount} />}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs text-slate-500">Status</div>
                  <div className="text-slate-900 font-medium">{String(selectedTx.status || "—")}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setSelectedTx(null)}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}

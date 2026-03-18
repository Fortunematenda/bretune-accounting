import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Money from "../components/common/money";
import StatusBadge from "../components/common/StatusBadge";
import ActionsMenu from "../components/common/ActionsMenu";
import { ArrowLeft, Receipt } from "lucide-react";

function fmtDate(d) {
  if (!d) return "—";
  return String(d).slice(0, 10);
}

export default function ExpenseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const expenseQuery = useQuery({
    queryKey: ["expense", id],
    queryFn: () => api.getExpense(id),
  });

  const approveMutation = useMutation({
    mutationFn: () => api.approveExpense(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expense", id] });
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  const reimburseMutation = useMutation({
    mutationFn: () => api.reimburseExpense(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expense", id] });
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteExpense(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expenses"] });
      navigate("/expenses", { replace: true });
    },
  });

  const e = expenseQuery.data;
  const status = String(e?.status || "").toUpperCase();

  return (
    <div className="space-y-0">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <button
          type="button"
          onClick={() => navigate("/expenses")}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Expenses
        </button>
      </nav>

      {expenseQuery.isLoading ? <div className="py-12 text-center text-sm text-slate-500">Loading…</div> : null}
      {expenseQuery.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {expenseQuery.error?.message || "Failed to load expense"}
        </div>
      ) : null}

      {e ? (
        <>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
            <div className="flex items-start gap-3 min-w-0">
              <div className="h-11 w-11 rounded-lg bg-violet-50 ring-1 ring-violet-100 flex items-center justify-center shrink-0">
                <Receipt className="h-5 w-5 text-violet-600" strokeWidth={1.7} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl font-semibold text-slate-900">{e.description || e.expenseNumber || "Expense"}</h1>
                  <StatusBadge status={e.status} />
                </div>
                <p className="mt-0.5 text-sm text-slate-500">{e.supplierName || "No supplier"} · {e.categoryName || "Uncategorized"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" className="h-9" onClick={() => navigate(`/expenses/${id}/edit`)} disabled={expenseQuery.isLoading}>Edit</Button>
              <ActionsMenu
                ariaLabel="Expense actions"
                buttonClassName="h-9 w-9"
                menuWidthClassName="w-52"
                items={[
                  { key: "approve", label: approveMutation.isPending ? "Approving…" : "Approve", disabled: approveMutation.isPending || status !== "DRAFT", onSelect: () => approveMutation.mutate() },
                  { key: "reimburse", label: reimburseMutation.isPending ? "Saving…" : "Mark Reimbursed", disabled: reimburseMutation.isPending || status !== "APPROVED", onSelect: () => reimburseMutation.mutate() },
                  { key: "delete", label: "Delete Expense", tone: "danger", disabled: deleteMutation.isPending, onSelect: () => { if (window.confirm("Delete this expense? This cannot be undone.")) deleteMutation.mutate(); } },
                ]}
              />
            </div>
          </div>

          {/* Summary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Card><CardContent className="p-3.5"><div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Total</div><div className="mt-1 text-lg font-semibold tabular-nums text-slate-900"><Money value={e.totalAmount ?? e.amount} /></div></CardContent></Card>
            <Card><CardContent className="p-3.5"><div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Amount</div><div className="mt-1 text-lg font-semibold tabular-nums text-slate-900"><Money value={e.amount ?? 0} /></div></CardContent></Card>
            <Card><CardContent className="p-3.5"><div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Tax</div><div className="mt-1 text-lg font-semibold tabular-nums text-slate-900"><Money value={e.taxAmount ?? 0} /></div></CardContent></Card>
            <Card><CardContent className="p-3.5"><div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Date</div><div className="mt-1 text-lg font-semibold text-slate-900">{fmtDate(e.expenseDate || e.date)}</div></CardContent></Card>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-slate-200/80">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Expense Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-[11px] font-medium text-slate-400">Description</div>
                      <div className="mt-1 text-slate-800">{e.description || "—"}</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-medium text-slate-400">Payment Method</div>
                      <div className="mt-1 text-slate-800">{e.paymentMethod || "—"}</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-medium text-slate-400">Supplier</div>
                      <div className="mt-1 text-slate-800">{e.supplierName || "—"}</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-medium text-slate-400">Category</div>
                      <div className="mt-1 text-slate-800">{e.categoryName || "—"}</div>
                    </div>
                  </div>
                  {e.notes ? (
                    <div className="mt-4 text-sm">
                      <div className="text-[11px] font-medium text-slate-400">Notes</div>
                      <div className="mt-1 text-slate-800">{e.notes}</div>
                    </div>
                  ) : null}
                  <div className="mt-4 text-sm">
                    <div className="text-[11px] font-medium text-slate-400">Attachment</div>
                    <div className="mt-1">
                      {e.attachmentUrl ? (
                        <a className="text-sm underline text-violet-600 hover:text-violet-800" href={e.attachmentUrl} target="_blank" rel="noreferrer">
                          View receipt
                        </a>
                      ) : e.attachmentName ? (
                        <span className="text-slate-800">{e.attachmentName}</span>
                      ) : (
                        <span className="text-slate-400 italic">No attachment</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-slate-200/80">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-slate-700 mb-3">Tax Breakdown</h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Amount</span>
                      <span className="font-medium tabular-nums text-slate-800"><Money value={e.amount ?? 0} /></span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Tax</span>
                      <span className="font-medium tabular-nums text-slate-800"><Money value={e.taxAmount ?? 0} /></span>
                    </div>
                    <div className="pt-2.5 mt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="font-bold text-violet-700">Total</span>
                      <span className="font-bold tabular-nums text-violet-700"><Money value={e.totalAmount ?? e.amount} /></span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

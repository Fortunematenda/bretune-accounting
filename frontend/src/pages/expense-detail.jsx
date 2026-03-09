import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Money from "../components/common/money";
import ExpenseStatusBadge from "../components/expenses/ExpenseStatusBadge";
import ActionsMenu from "../components/common/ActionsMenu";

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
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Expense Detail</h1>
              <p className="mt-1 text-sm text-slate-500">Review expense information, tax and attachments</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ActionsMenu
                ariaLabel="Expense actions"
                menuWidthClassName="w-52"
                items={[
                  {
                    key: "edit",
                    label: "Edit",
                    disabled: expenseQuery.isLoading,
                    onSelect: () => navigate(`/expenses/${id}/edit`),
                  },
                  {
                    key: "approve",
                    label: approveMutation.isPending ? "Approving…" : "Approve",
                    disabled: approveMutation.isPending || expenseQuery.isLoading || status !== "DRAFT",
                    hint: status !== "DRAFT" ? "Only draft expenses can be approved" : "",
                    onSelect: () => approveMutation.mutate(),
                  },
                  {
                    key: "reimburse",
                    label: reimburseMutation.isPending ? "Saving…" : "Mark Reimbursed",
                    disabled: reimburseMutation.isPending || expenseQuery.isLoading || status !== "APPROVED",
                    hint: status !== "APPROVED" ? "Only approved expenses can be reimbursed" : "",
                    onSelect: () => reimburseMutation.mutate(),
                  },
                  {
                    key: "delete",
                    label: "Delete",
                    tone: "danger",
                    disabled: deleteMutation.isPending || expenseQuery.isLoading,
                    onSelect: () => {
                      const ok = window.confirm("Delete this expense? This cannot be undone.");
                      if (!ok) return;
                      deleteMutation.mutate();
                    },
                  },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {expenseQuery.error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {expenseQuery.error?.message || "Failed to load expense"}
            </div>
          ) : null}

          {expenseQuery.isLoading ? <div className="text-sm text-slate-600">Loading…</div> : null}

          {e ? (
            <>
              <Card className="hover:translate-y-0">
                <CardHeader>
                  <CardTitle>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-xs font-medium text-slate-500">Expense</div>
                        <div className="mt-1 text-base font-semibold text-slate-900">{e.expenseNumber || e.id}</div>
                      </div>
                      <ExpenseStatusBadge status={e.status} />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="text-xs text-slate-500">Date</div>
                      <div className="mt-1 font-medium text-slate-900 dark:text-slate-100">{fmtDate(e.expenseDate || e.date)}</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="text-xs text-slate-500">Supplier</div>
                      <div className="mt-1 font-medium text-slate-900 dark:text-slate-100">{e.supplierName || "—"}</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="text-xs text-slate-500">Total</div>
                      <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">
                        <Money value={e.totalAmount ?? e.amount} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
                    <div className="lg:col-span-2">
                      <div className="text-xs font-medium text-slate-500">Expense Information</div>
                      <div className="mt-1 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                        <div className="font-medium text-slate-900 dark:text-slate-100">{e.description || "—"}</div>
                        <div className="mt-2 text-xs text-slate-500">Payment method: {e.paymentMethod || "—"}</div>
                        <div className="mt-1 text-xs text-slate-500">Category: {e.categoryName || "—"}</div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="text-xs font-medium text-slate-500">Tax Breakdown</div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Amount</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          <Money value={e.amount ?? 0} />
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-slate-600 dark:text-slate-300">Tax</span>
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          <Money value={e.taxAmount ?? 0} />
                        </span>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-200 font-semibold">Total</span>
                        <span className="text-slate-900 dark:text-slate-100 font-semibold">
                          <Money value={e.totalAmount ?? e.amount} />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs font-medium text-slate-500">Notes</div>
                      <div className="mt-1 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                        {e.notes || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500">Attachment</div>
                      <div className="mt-1 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                        {e.attachmentUrl ? (
                          <a className="text-sm underline text-blue-700" href={e.attachmentUrl} target="_blank" rel="noreferrer">
                            View receipt
                          </a>
                        ) : e.attachmentName ? (
                          <div className="text-sm">{e.attachmentName}</div>
                        ) : (
                          "—"
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

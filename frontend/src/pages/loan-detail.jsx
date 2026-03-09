import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Money from "../components/common/money";
import ActionsMenu from "../components/common/ActionsMenu";
import Dialog from "../components/ui/dialog";
import { ArrowLeft, Landmark, Plus } from "lucide-react";
import { formatDateForDisplay } from "../lib/dateFormat";

const STATUS_COLORS = {
  ACTIVE: "bg-blue-100 text-blue-800",
  PARTIALLY_REPAID: "bg-amber-100 text-amber-800",
  REPAID: "bg-emerald-100 text-emerald-800",
  WRITTEN_OFF: "bg-slate-100 text-slate-600",
};

const STATUS_LABELS = {
  ACTIVE: "Active",
  PARTIALLY_REPAID: "Partially Repaid",
  REPAID: "Repaid",
  WRITTEN_OFF: "Written Off",
};

const EDIT_FIELDS = ["borrowerName", "borrowerContact", "loanDate", "dueDate", "interestRate", "purpose", "notes", "status"];

export default function LoanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [repayOpen, setRepayOpen] = useState(false);
  const [repayForm, setRepayForm] = useState({ amount: "", paymentDate: new Date().toISOString().slice(0, 10), notes: "" });
  const [repayError, setRepayError] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editError, setEditError] = useState(null);

  const [newLoanOpen, setNewLoanOpen] = useState(false);
  const [newLoanForm, setNewLoanForm] = useState(null);
  const [newLoanError, setNewLoanError] = useState(null);

  const loanQuery = useQuery({
    queryKey: ["loan", id],
    queryFn: () => api.getLoan(id),
    enabled: Boolean(id),
  });

  const addRepayMutation = useMutation({
    mutationFn: (data) => api.addLoanRepayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loan", id] });
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      setRepayOpen(false);
      setRepayForm({ amount: "", paymentDate: new Date().toISOString().slice(0, 10), notes: "" });
      setRepayError(null);
    },
    onError: (e) => setRepayError(e.message || "Failed to record repayment"),
  });

  const deleteRepayMutation = useMutation({
    mutationFn: (repaymentId) => api.deleteLoanRepayment(id, repaymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loan", id] });
      queryClient.invalidateQueries({ queryKey: ["loans"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => api.updateLoan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loan", id] });
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      setEditOpen(false);
      setEditError(null);
    },
    onError: (e) => setEditError(e.message || "Failed to update loan"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.deleteLoan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      navigate("/loans", { replace: true });
    },
  });

  const addAnotherMutation = useMutation({
    mutationFn: (data) => api.createLoan(data),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["loans-summary"] });
      setNewLoanOpen(false);
      setNewLoanError(null);
      navigate(`/loans/${created.id}`);
    },
    onError: (e) => setNewLoanError(e.message || "Failed to create loan"),
  });

  const loan = loanQuery.data;
  const repayments = loan?.repayments || [];
  const totalRepaid = repayments.reduce((s, r) => s + Number(r.amount), 0);
  const progressPct = loan ? Math.min(100, Math.round((totalRepaid / Number(loan.amount)) * 100)) : 0;

  function openEdit() {
    if (!loan) return;
    setEditForm({
      borrowerName: loan.borrowerName || "",
      borrowerContact: loan.borrowerContact || "",
      loanDate: loan.loanDate ? String(loan.loanDate).slice(0, 10) : "",
      dueDate: loan.dueDate ? String(loan.dueDate).slice(0, 10) : "",
      interestRate: loan.interestRate != null ? String(loan.interestRate) : "",
      purpose: loan.purpose || "",
      notes: loan.notes || "",
      status: loan.status || "ACTIVE",
    });
    setEditError(null);
    setEditOpen(true);
  }

  function handleRepaySubmit(e) {
    e.preventDefault();
    setRepayError(null);
    if (!repayForm.amount || parseFloat(repayForm.amount) <= 0) {
      setRepayError("Amount must be greater than 0");
      return;
    }
    addRepayMutation.mutate({
      amount: repayForm.amount,
      paymentDate: repayForm.paymentDate,
      notes: repayForm.notes || undefined,
    });
  }

  function handleEditSubmit(e) {
    e.preventDefault();
    setEditError(null);
    if (!editForm.borrowerName.trim()) { setEditError("Borrower name is required"); return; }
    updateMutation.mutate({
      borrowerName: editForm.borrowerName,
      borrowerContact: editForm.borrowerContact || undefined,
      loanDate: editForm.loanDate,
      dueDate: editForm.dueDate || undefined,
      interestRate: editForm.interestRate || undefined,
      purpose: editForm.purpose || undefined,
      notes: editForm.notes || undefined,
      status: editForm.status,
    });
  }

  function openNewLoan() {
    if (!loan) return;
    setNewLoanForm({
      customerId: loan.customerId || "",
      borrowerName: loan.borrowerName || "",
      borrowerContact: loan.borrowerContact || "",
      amount: "",
      loanDate: new Date().toISOString().slice(0, 10),
      dueDate: "",
      interestRate: loan.interestRate != null ? String(loan.interestRate) : "",
      purpose: "",
      notes: "",
    });
    setNewLoanError(null);
    setNewLoanOpen(true);
  }

  function handleNewLoanSubmit(e) {
    e.preventDefault();
    setNewLoanError(null);
    if (!newLoanForm.borrowerName.trim()) { setNewLoanError("Borrower name is required"); return; }
    if (!newLoanForm.amount || parseFloat(newLoanForm.amount) <= 0) { setNewLoanError("Amount must be greater than 0"); return; }
    addAnotherMutation.mutate({
      customerId: newLoanForm.customerId || undefined,
      borrowerName: newLoanForm.borrowerName,
      borrowerContact: newLoanForm.borrowerContact || undefined,
      amount: newLoanForm.amount,
      loanDate: newLoanForm.loanDate,
      dueDate: newLoanForm.dueDate || undefined,
      interestRate: newLoanForm.interestRate || undefined,
      purpose: newLoanForm.purpose || undefined,
      notes: newLoanForm.notes || undefined,
    });
  }

  function handleDelete() {
    if (!window.confirm(`Delete this loan? All repayment records will also be removed.`)) return;
    deleteMutation.mutate();
  }

  function handleDeleteRepayment(r) {
    if (!window.confirm(`Remove this repayment of ${Number(r.amount).toLocaleString()}?`)) return;
    deleteRepayMutation.mutate(r.id);
  }

  if (loanQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-500 text-sm">Loading…</div>
    );
  }

  if (loanQuery.error || !loan) {
    return (
      <div className="space-y-4">
        <button onClick={() => navigate("/loans")} className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-800 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Loans
        </button>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {loanQuery.error?.message || "Loan not found"}
        </div>
      </div>
    );
  }

  const isOverdue = loan.dueDate && new Date(loan.dueDate) < new Date() && loan.status !== "REPAID";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate("/loans")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shrink-0"
            aria-label="Back to loans"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-slate-900 truncate">{loan.borrowerName}</h1>
            {loan.borrowerContact && <p className="text-sm text-slate-500">{loan.borrowerContact}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[loan.status] || "bg-slate-100 text-slate-700"}`}>
            {STATUS_LABELS[loan.status] || loan.status}
          </span>
          {isOverdue && (
            <span className="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-700">
              Overdue
            </span>
          )}
          <ActionsMenu
            ariaLabel="Loan actions"
            menuWidthClassName="w-52"
            items={[
              { key: "edit", label: "Edit loan", onSelect: openEdit },
              { key: "repay", label: "Record repayment", disabled: loan.status === "REPAID", hint: loan.status === "REPAID" ? "Loan is fully repaid" : "", onSelect: () => setRepayOpen(true) },
              { key: "add", label: "Add another loan", onSelect: openNewLoan },
              { key: "delete", label: "Delete loan", tone: "danger", onSelect: handleDelete },
            ]}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase text-slate-500">Loan Amount</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums"><Money value={loan.amount} /></p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase text-slate-500">Outstanding</p>
            <p className={`mt-1 text-2xl font-bold tabular-nums ${loan.outstandingBalance > 0 ? "text-red-600" : "text-emerald-600"}`}>
              <Money value={loan.outstandingBalance} />
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase text-slate-500">Total Repaid</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600 tabular-nums"><Money value={totalRepaid} /></p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase text-slate-500">Repayment Progress</p>
            <p className="mt-1 text-2xl font-bold text-violet-600">{progressPct}%</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200">
              <div className="h-1.5 rounded-full bg-violet-500 transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-200 lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Landmark className="h-4 w-4 text-violet-600" />
              Loan Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Loan Date", value: formatDateForDisplay(loan.loanDate) },
              { label: "Due Date", value: loan.dueDate ? formatDateForDisplay(loan.dueDate) : "—" },
              { label: "Interest Rate", value: loan.interestRate != null ? `${loan.interestRate}%` : "Interest-free" },
              { label: "Purpose", value: loan.purpose || "—" },
              { label: "Notes", value: loan.notes || "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-3 text-sm">
                <span className="text-slate-500 shrink-0">{label}</span>
                <span className="text-slate-900 text-right">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center justify-between">
              <span>Repayment History</span>
              {loan.status !== "REPAID" && (
                <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setRepayOpen(true)}>
                  <Plus className="h-3.5 w-3.5" />
                  Record Repayment
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {repayments.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-10 text-center">
                <p className="text-sm font-medium text-slate-700">No repayments yet</p>
                <p className="mt-1 text-sm text-slate-500">Record a repayment when your borrower pays back</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Date</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">Amount</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Notes</th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-600"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {repayments.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 text-sm text-slate-600">{formatDateForDisplay(r.paymentDate)}</td>
                        <td className="px-4 py-3 text-right font-medium tabular-nums text-emerald-600">
                          +<Money value={r.amount} />
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">{r.notes || "—"}</td>
                        <td className="px-2 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <ActionsMenu
                            ariaLabel="Repayment actions"
                            items={[
                              { key: "delete", label: "Remove", tone: "danger", onSelect: () => handleDeleteRepayment(r) },
                            ]}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={repayOpen} onOpenChange={setRepayOpen} title="Record Repayment">
        <form onSubmit={handleRepaySubmit} className="space-y-4">
          {repayError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{repayError}</div>
          )}
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Outstanding balance: <strong className="text-red-600"><Money value={loan.outstandingBalance} /></strong>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Amount *</label>
            <Input
              type="number" min="0.01" step="0.01"
              value={repayForm.amount}
              onChange={(e) => setRepayForm((f) => ({ ...f, amount: e.target.value }))}
              placeholder="0.00"
              required
              className="h-10"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Payment date *</label>
            <Input
              type="date"
              value={repayForm.paymentDate}
              onChange={(e) => setRepayForm((f) => ({ ...f, paymentDate: e.target.value }))}
              required
              className="h-10"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Notes</label>
            <Input
              value={repayForm.notes}
              onChange={(e) => setRepayForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="e.g. Cash, Bank transfer…"
              className="h-10"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => { setRepayOpen(false); setRepayError(null); }}>
              Cancel
            </Button>
            <Button type="submit" disabled={addRepayMutation.isPending}>
              {addRepayMutation.isPending ? "Saving…" : "Record Repayment"}
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen} title="Edit Loan" className="max-w-lg">
        {editForm && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {editError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{editError}</div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">Borrower name *</label>
                <Input value={editForm.borrowerName} onChange={(e) => setEditForm((f) => ({ ...f, borrowerName: e.target.value }))} required className="h-10" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">Contact</label>
                <Input value={editForm.borrowerContact} onChange={(e) => setEditForm((f) => ({ ...f, borrowerContact: e.target.value }))} placeholder="Optional" className="h-10" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Loan date *</label>
                <Input type="date" value={editForm.loanDate} onChange={(e) => setEditForm((f) => ({ ...f, loanDate: e.target.value }))} required className="h-10" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Due date</label>
                <Input type="date" value={editForm.dueDate} onChange={(e) => setEditForm((f) => ({ ...f, dueDate: e.target.value }))} className="h-10" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Interest rate %</label>
                <Input type="number" min="0" step="0.01" value={editForm.interestRate} onChange={(e) => setEditForm((f) => ({ ...f, interestRate: e.target.value }))} className="h-10" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">Purpose</label>
                <Input value={editForm.purpose} onChange={(e) => setEditForm((f) => ({ ...f, purpose: e.target.value }))} placeholder="Optional" className="h-10" />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">Notes</label>
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => { setEditOpen(false); setEditError(null); }}>Cancel</Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </Dialog>

      <Dialog open={newLoanOpen} onOpenChange={setNewLoanOpen} title={`New Loan — ${loan.borrowerName}`} className="max-w-lg">
        {newLoanForm && (
          <form onSubmit={handleNewLoanSubmit} className="space-y-4">
            {newLoanError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{newLoanError}</div>
            )}
            <div className="rounded-lg border border-violet-100 bg-violet-50 px-4 py-2.5 text-sm text-violet-700">
              Borrower: <strong>{newLoanForm.borrowerName}</strong>
              {newLoanForm.borrowerContact && <span className="ml-2 text-violet-500">· {newLoanForm.borrowerContact}</span>}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Loan amount *</label>
                <Input
                  type="number" min="0.01" step="0.01"
                  value={newLoanForm.amount}
                  onChange={(e) => setNewLoanForm((f) => ({ ...f, amount: e.target.value }))}
                  placeholder="0.00" required className="h-10"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Interest rate %</label>
                <Input
                  type="number" min="0" step="0.01"
                  value={newLoanForm.interestRate}
                  onChange={(e) => setNewLoanForm((f) => ({ ...f, interestRate: e.target.value }))}
                  placeholder="0 = interest-free" className="h-10"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Loan date *</label>
                <Input
                  type="date"
                  value={newLoanForm.loanDate}
                  onChange={(e) => setNewLoanForm((f) => ({ ...f, loanDate: e.target.value }))}
                  required className="h-10"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Due date</label>
                <Input
                  type="date"
                  value={newLoanForm.dueDate}
                  onChange={(e) => setNewLoanForm((f) => ({ ...f, dueDate: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">Purpose</label>
                <Input
                  value={newLoanForm.purpose}
                  onChange={(e) => setNewLoanForm((f) => ({ ...f, purpose: e.target.value }))}
                  placeholder="e.g. Emergency, Business, Education" className="h-10"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-sm font-medium text-slate-700">Notes</label>
                <textarea
                  value={newLoanForm.notes}
                  onChange={(e) => setNewLoanForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => { setNewLoanOpen(false); setNewLoanError(null); }}>
                Cancel
              </Button>
              <Button type="submit" disabled={addAnotherMutation.isPending}>
                {addAnotherMutation.isPending ? "Saving…" : "Record Loan"}
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import PageHeader from "../components/common/PageHeader";
import ActionsMenu from "../components/common/ActionsMenu";
import Money from "../components/common/money";
import Dialog from "../components/ui/dialog";
import { ChevronDown, ChevronRight, Landmark, Plus, Search, TrendingDown, TrendingUp, Users, Wallet } from "lucide-react";
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

const EMPTY_FORM = {
  customerId: "",
  borrowerName: "",
  borrowerContact: "",
  amount: "",
  loanDate: new Date().toISOString().slice(0, 10),
  dueDate: "",
  interestRate: "",
  purpose: "",
  notes: "",
};

const STATUS_PRIORITY = { ACTIVE: 0, PARTIALLY_REPAID: 1, REPAID: 2, WRITTEN_OFF: 3 };

function worstStatus(loans) {
  return loans.reduce((worst, l) => {
    return (STATUS_PRIORITY[l.status] ?? 99) < (STATUS_PRIORITY[worst] ?? 99) ? l.status : worst;
  }, "REPAID");
}

function SummaryCard({ icon, label, value, sub, color = "text-slate-900" }) {
  return (
    <Card className="border-slate-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
            <p className={`mt-1 text-2xl font-bold tabular-nums ${color}`}>{value}</p>
            {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
          </div>
          <div className="rounded-lg bg-slate-100 p-2 shrink-0">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoansPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [newOpen, setNewOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState(null);
  const [expanded, setExpanded] = useState({});

  const customersQuery = useQuery({
    queryKey: ["customers-list-loans"],
    queryFn: () => api.listCustomers({ limit: 500, status: "ACTIVE" }),
    staleTime: 60_000,
  });

  const customers = useMemo(() => {
    const raw = customersQuery.data?.data ?? customersQuery.data ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [customersQuery.data]);

  const summaryQuery = useQuery({
    queryKey: ["loans-summary"],
    queryFn: () => api.getLoansSummary(),
    staleTime: 15_000,
  });

  const loansQuery = useQuery({
    queryKey: ["loans", { q, status }],
    queryFn: () => api.listLoans({ q: q || undefined, status: status || undefined, limit: 500 }),
    staleTime: 10_000,
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.createLoan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["loans-summary"] });
      setNewOpen(false);
      setForm(EMPTY_FORM);
      setFormError(null);
    },
    onError: (e) => setFormError(e.message || "Failed to create loan"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteLoan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["loans-summary"] });
    },
  });

  const loans = loansQuery.data?.data || [];
  const summary = summaryQuery.data;

  const borrowerGroups = useMemo(() => {
    const groups = {};
    loans.forEach((loan) => {
      const key = loan.borrowerName.trim().toLowerCase();
      if (!groups[key]) {
        groups[key] = {
          key,
          name: loan.borrowerName,
          contact: loan.borrowerContact || null,
          loans: [],
          totalAmount: 0,
          totalOutstanding: 0,
        };
      }
      groups[key].loans.push(loan);
      groups[key].totalAmount += Number(loan.amount);
      groups[key].totalOutstanding += Number(loan.outstandingBalance);
      if (!groups[key].contact && loan.borrowerContact) groups[key].contact = loan.borrowerContact;
    });
    return Object.values(groups).sort((a, b) => b.totalOutstanding - a.totalOutstanding);
  }, [loans]);

  function toggleExpand(key) {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handleCustomerSelect(e) {
    const cid = e.target.value;
    if (!cid) {
      setForm((f) => ({ ...f, customerId: "", borrowerName: "", borrowerContact: "" }));
      return;
    }
    const c = customers.find((x) => x.id === cid);
    if (c) {
      const name = c.companyName || c.contactName || "";
      const contact = c.phone || c.email || "";
      setForm((f) => ({ ...f, customerId: cid, borrowerName: name, borrowerContact: contact }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    if (!form.borrowerName.trim()) { setFormError("Borrower name is required"); return; }
    if (!form.amount || parseFloat(form.amount) <= 0) { setFormError("Amount must be greater than 0"); return; }
    createMutation.mutate({
      customerId: form.customerId || undefined,
      borrowerName: form.borrowerName,
      borrowerContact: form.borrowerContact || undefined,
      amount: form.amount,
      loanDate: form.loanDate,
      dueDate: form.dueDate || undefined,
      interestRate: form.interestRate || undefined,
      purpose: form.purpose || undefined,
      notes: form.notes || undefined,
    });
  }

  function handleDelete(loan) {
    if (!window.confirm(`Delete loan to ${loan.borrowerName}? This cannot be undone.`)) return;
    deleteMutation.mutate(loan.id);
  }

  const fmt = (n) => (n == null ? "—" : Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

  return (
    <div className="space-y-6 min-h-screen">
      <PageHeader
        title="Loans Given"
        subtitle="Track money you've lent to friends, family, or colleagues"
        icon={<Landmark className="h-6 w-6 text-violet-600" />}
        action={
          <Button onClick={() => setNewOpen(true)} className="h-9 shrink-0 gap-2">
            <Plus className="h-4 w-4" />
            Record Loan
          </Button>
        }
      />

      {/* Overview KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={<Wallet className="h-5 w-5 text-violet-600" />}
          label="Total Loaned"
          value={summaryQuery.isLoading ? "…" : fmt(summary?.totalLoaned)}
          sub={`${summary?.totalLoans ?? 0} loan${summary?.totalLoans !== 1 ? "s" : ""}`}
        />
        <SummaryCard
          icon={<TrendingDown className="h-5 w-5 text-red-500" />}
          label="Outstanding"
          value={summaryQuery.isLoading ? "…" : fmt(summary?.totalOutstanding)}
          sub="Still owed to you"
          color={summary?.totalOutstanding > 0 ? "text-red-600" : "text-slate-900"}
        />
        <SummaryCard
          icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
          label="Repaid"
          value={summaryQuery.isLoading ? "…" : fmt(summary?.totalRepaid)}
          sub="Collected so far"
          color="text-emerald-600"
        />
        <SummaryCard
          icon={<Users className="h-5 w-5 text-blue-500" />}
          label="Borrowers"
          value={summaryQuery.isLoading ? "…" : String(summary?.uniqueBorrowers ?? 0)}
          sub={`${summary?.byStatus?.ACTIVE ?? 0} active · ${summary?.byStatus?.REPAID ?? 0} repaid`}
        />
      </div>

      {/* Borrowers table */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Borrowers</CardTitle>
        </CardHeader>
        <CardContent>
          {loansQuery.error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loansQuery.error.message}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-2.5 mb-4">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                className="pl-9 h-9"
                placeholder="Search borrower, purpose…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 px-3 text-sm"
            >
              <option value="">All statuses</option>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="w-8 px-2 py-3" />
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Borrower</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">Loans</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">Total Loaned</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">Outstanding</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loansQuery.isLoading ? (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">Loading…</td></tr>
                ) : borrowerGroups.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-14 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="rounded-full bg-slate-100 p-4">
                          <Landmark className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500">No loans recorded yet</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  borrowerGroups.map((group) => {
                    const isOpen = !!expanded[group.key];
                    const ws = worstStatus(group.loans);
                    const hasMultiple = group.loans.length > 1;
                    return (
                      <React.Fragment key={group.key}>
                        {/* Group / borrower row */}
                        <tr
                          className={`border-t border-slate-200 ${hasMultiple ? "cursor-pointer hover:bg-violet-50/40" : "hover:bg-violet-50/20"} transition-colors`}
                          onClick={() => hasMultiple ? toggleExpand(group.key) : navigate(`/loans/${group.loans[0].id}`)}
                        >
                          <td className="w-8 px-2 py-3 text-center text-slate-400">
                            {hasMultiple
                              ? (isOpen ? <ChevronDown className="h-4 w-4 mx-auto" /> : <ChevronRight className="h-4 w-4 mx-auto" />)
                              : null}
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-slate-900">{group.name}</div>
                            {group.contact && <div className="text-xs text-slate-500">{group.contact}</div>}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-semibold h-6 w-6">
                              {group.loans.length}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold tabular-nums text-slate-900">
                            <Money value={group.totalAmount} />
                          </td>
                          <td className="px-4 py-3 text-right font-semibold tabular-nums">
                            <span className={group.totalOutstanding > 0 ? "text-red-600" : "text-emerald-600"}>
                              <Money value={group.totalOutstanding} />
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[ws] || "bg-slate-100 text-slate-700"}`}>
                              {STATUS_LABELS[ws] || ws}
                            </span>
                          </td>
                          <td className="px-2 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                            {!hasMultiple && (
                              <ActionsMenu
                                ariaLabel="Loan actions"
                                items={[
                                  { key: "view", label: "View details", onSelect: () => navigate(`/loans/${group.loans[0].id}`) },
                                  { key: "delete", label: "Delete", tone: "danger", onSelect: () => handleDelete(group.loans[0]) },
                                ]}
                              />
                            )}
                          </td>
                        </tr>

                        {/* Expanded individual loans */}
                        {isOpen && group.loans.map((loan) => (
                          <tr
                            key={loan.id}
                            className="border-t border-slate-100 bg-violet-50/30 hover:bg-violet-50/60 cursor-pointer transition-colors"
                            onClick={() => navigate(`/loans/${loan.id}`)}
                          >
                            <td className="w-8 px-2 py-2.5" />
                            <td className="px-4 py-2.5 pl-8">
                              <div className="text-sm text-slate-700">{loan.purpose || <span className="italic text-slate-400">No purpose</span>}</div>
                              <div className="text-xs text-slate-500">{formatDateForDisplay(loan.loanDate)}{loan.dueDate ? ` · Due ${formatDateForDisplay(loan.dueDate)}` : ""}</div>
                            </td>
                            <td className="px-4 py-2.5 text-center text-xs text-slate-400">—</td>
                            <td className="px-4 py-2.5 text-right text-sm tabular-nums text-slate-700">
                              <Money value={loan.amount} />
                            </td>
                            <td className="px-4 py-2.5 text-right text-sm tabular-nums">
                              <span className={loan.outstandingBalance > 0 ? "text-red-500" : "text-emerald-600"}>
                                <Money value={loan.outstandingBalance} />
                              </span>
                            </td>
                            <td className="px-4 py-2.5">
                              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[loan.status] || "bg-slate-100 text-slate-700"}`}>
                                {STATUS_LABELS[loan.status] || loan.status}
                              </span>
                            </td>
                            <td className="px-2 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                              <ActionsMenu
                                ariaLabel="Loan actions"
                                items={[
                                  { key: "view", label: "View details", onSelect: () => navigate(`/loans/${loan.id}`) },
                                  { key: "delete", label: "Delete", tone: "danger", onSelect: () => handleDelete(loan) },
                                ]}
                              />
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={newOpen} onOpenChange={setNewOpen} title="Record a Loan" className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700">Select from customers</label>
              <select
                value={form.customerId}
                onChange={handleCustomerSelect}
                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">— Select a customer (optional) —</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName || c.contactName}{c.companyName && c.contactName ? ` (${c.contactName})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <div className="flex-1 border-t border-slate-200" />
              <span className="text-xs text-slate-400">or enter manually</span>
              <div className="flex-1 border-t border-slate-200" />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700">Borrower name *</label>
              <Input value={form.borrowerName} onChange={(e) => setForm((f) => ({ ...f, borrowerName: e.target.value }))} placeholder="e.g. John Doe" required className="h-10" />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700">Contact (phone / email)</label>
              <Input value={form.borrowerContact} onChange={(e) => setForm((f) => ({ ...f, borrowerContact: e.target.value }))} placeholder="Optional" className="h-10" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Loan amount *</label>
              <Input type="number" min="0.01" step="0.01" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder="0.00" required className="h-10" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Interest rate %</label>
              <Input type="number" min="0" step="0.01" value={form.interestRate} onChange={(e) => setForm((f) => ({ ...f, interestRate: e.target.value }))} placeholder="0 = interest-free" className="h-10" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Loan date *</label>
              <Input type="date" value={form.loanDate} onChange={(e) => setForm((f) => ({ ...f, loanDate: e.target.value }))} required className="h-10" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Due date</label>
              <Input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} className="h-10" />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700">Purpose</label>
              <Input value={form.purpose} onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))} placeholder="e.g. Emergency, Business, Education" className="h-10" />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Any additional notes"
                rows={2}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => { setNewOpen(false); setForm(EMPTY_FORM); setFormError(null); }}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Saving…" : "Record Loan"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

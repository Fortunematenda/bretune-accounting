import React, { useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";
import {
  FileText,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  Trash2,
  Send,
  RefreshCw,
  Search,
  X,
  CreditCard,
  ArrowLeft,
  Receipt,
  TrendingUp,
  Users,
  Ban,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────

function formatCurrency(amount) {
  return `R${Number(amount || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" });
}

function statusBadge(status) {
  const map = {
    DRAFT: { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
    SENT: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-400" },
    PAID: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
    PARTIALLY_PAID: { bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-400" },
    OVERDUE: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-500" },
    CANCELLED: { bg: "bg-slate-50", text: "text-slate-400", dot: "bg-slate-300" },
  };
  const s = map[status] || map.DRAFT;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {(status || "").replace("_", " ")}
    </span>
  );
}

// ── Dashboard Stats ──────────────────────────────

function StatsCards({ stats }) {
  const cards = [
    { label: "Total Revenue", value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "This Month", value: formatCurrency(stats.monthRevenue), icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Outstanding", value: formatCurrency(stats.totalOutstanding), icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Overdue", value: stats.overdueInvoices, icon: Ban, color: "text-red-600", bg: "bg-red-50" },
    { label: "Paid", value: stats.paidInvoices, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Invoices", value: stats.totalInvoices, icon: FileText, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`h-8 w-8 rounded-lg ${c.bg} flex items-center justify-center`}>
                <Icon className={`h-4 w-4 ${c.color}`} />
              </div>
            </div>
            <div className="text-lg font-bold text-slate-800">{c.value}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{c.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── Create Invoice Modal ─────────────────────────

function CreateInvoiceModal({ open, onClose, customers, onCreated }) {
  const [customerId, setCustomerId] = useState("");
  const [description, setDescription] = useState("Internet Service - Monthly");
  const [unitPrice, setUnitPrice] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleCreate = async () => {
    if (!customerId || !unitPrice) return alert("Select a customer and enter a price");
    setSaving(true);
    try {
      await api.billingInvoiceCreate({
        customerId,
        items: [{ description, quantity: 1, unitPrice: Number(unitPrice) }],
      });
      onCreated();
      onClose();
      setCustomerId("");
      setUnitPrice("");
    } catch (err) {
      alert(err.message || "Failed to create invoice");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Create Invoice</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</label>
            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none">
              <option value="">Select customer...</option>
              {(customers || []).map((c) => (
                <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.pppoeUsername})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount (ZAR)</label>
            <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="0.00"
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700">Cancel</button>
          <button onClick={handleCreate} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Creating..." : "Create Invoice"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Record Payment Modal ─────────────────────────

function RecordPaymentModal({ open, onClose, invoice, onRecorded }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("CASH");
  const [reference, setReference] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (invoice) setAmount(String(Number(invoice.balanceDue || 0)));
  }, [invoice]);

  if (!open || !invoice) return null;

  const handlePay = async () => {
    if (!amount || Number(amount) <= 0) return alert("Enter a valid amount");
    setSaving(true);
    try {
      await api.billingPaymentCreate({
        invoiceId: invoice.id,
        amount: Number(amount),
        method,
        reference: reference || null,
      });
      onRecorded();
      onClose();
    } catch (err) {
      alert(err.message || "Failed to record payment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Record Payment — {invoice.invoiceNumber}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Invoice Total</span>
            <span className="font-semibold">{formatCurrency(invoice.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Balance Due</span>
            <span className="font-semibold text-red-600">{formatCurrency(invoice.balanceDue)}</span>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Method</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none">
              {["CASH", "BANK_TRANSFER", "CARD", "MOBILE_MONEY", "DEBIT_ORDER", "ONLINE"].map((m) => (
                <option key={m} value={m}>{m.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Reference</label>
            <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Payment ref..."
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700">Cancel</button>
          <button onClick={handlePay} disabled={saving}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50">
            {saving ? "Recording..." : "Record Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Invoice Detail View ──────────────────────────

function InvoiceDetail({ invoice, onBack, onRefresh }) {
  if (!invoice) return null;
  const cust = invoice.customer;

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-violet-600 hover:text-violet-800">
        <ArrowLeft className="h-4 w-4" /> Back to Invoices
      </button>

      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{invoice.invoiceNumber}</h2>
            <p className="text-xs text-slate-400">{cust ? `${cust.firstName} ${cust.lastName} (${cust.pppoeUsername})` : "—"}</p>
          </div>
          {statusBadge(invoice.status)}
        </div>

        <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["Issue Date", formatDate(invoice.issueDate)],
            ["Due Date", formatDate(invoice.dueDate)],
            ["Period", invoice.periodStart ? `${formatDate(invoice.periodStart)} — ${formatDate(invoice.periodEnd)}` : "—"],
            ["Paid Date", formatDate(invoice.paidDate)],
          ].map(([l, v]) => (
            <div key={l}>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{l}</div>
              <div className="text-sm font-medium text-slate-700 mt-0.5">{v}</div>
            </div>
          ))}
        </div>

        {/* Items table */}
        <div className="px-6 py-3">
          <table className="w-full">
            <thead className="bg-slate-50/80 border-y border-slate-100">
              <tr>
                {["Description", "Qty", "Unit Price", "Total"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(invoice.items || []).map((item, i) => (
                <tr key={i} className="border-b border-slate-50">
                  <td className="px-3 py-2 text-sm text-slate-700">{item.description}</td>
                  <td className="px-3 py-2 text-sm text-slate-600">{Number(item.quantity)}</td>
                  <td className="px-3 py-2 text-sm text-slate-600 font-mono">{formatCurrency(item.unitPrice)}</td>
                  <td className="px-3 py-2 text-sm text-slate-700 font-mono font-semibold">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <div className="w-64 space-y-1">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><span className="font-mono">{formatCurrency(invoice.subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Tax ({(Number(invoice.taxRate) * 100).toFixed(0)}%)</span><span className="font-mono">{formatCurrency(invoice.taxAmount)}</span></div>
            <div className="flex justify-between text-sm font-bold border-t border-slate-200 pt-1"><span>Total</span><span className="font-mono">{formatCurrency(invoice.totalAmount)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Paid</span><span className="font-mono text-emerald-600">{formatCurrency(invoice.amountPaid)}</span></div>
            <div className="flex justify-between text-sm font-bold"><span className="text-red-600">Balance Due</span><span className="font-mono text-red-600">{formatCurrency(invoice.balanceDue)}</span></div>
          </div>
        </div>
      </div>

      {/* Payments */}
      {invoice.payments?.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="px-6 py-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Payments</h3>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                {["#", "Date", "Method", "Reference", "Amount"].map((h) => (
                  <th key={h} className="px-4 py-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoice.payments.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-violet-50/20">
                  <td className="px-4 py-2 text-sm text-slate-600 font-mono">{p.paymentNumber}</td>
                  <td className="px-4 py-2 text-sm text-slate-600">{formatDate(p.paymentDate)}</td>
                  <td className="px-4 py-2 text-sm text-slate-600">{(p.method || "").replace(/_/g, " ")}</td>
                  <td className="px-4 py-2 text-sm text-slate-600">{p.reference || "—"}</td>
                  <td className="px-4 py-2 text-sm text-emerald-600 font-mono font-semibold">{formatCurrency(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Main Billing Page ────────────────────────────

export default function IspBillingPage() {
  const [stats, setStats] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [payInvoice, setPayInvoice] = useState(null);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [dashData, invData, custData] = await Promise.all([
        api.billingDashboard(),
        api.billingInvoices({ status: statusFilter || undefined, search: search || undefined }),
        api.ispCustomers(),
      ]);
      setStats(dashData);
      setInvoices(invData.items || []);
      setCustomers(custData.items || []);
    } catch (err) {
      console.error("Billing load error:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleMarkOverdue = async () => {
    setActionLoading(true);
    try {
      const res = await api.billingMarkOverdue();
      alert(`${res.count} invoice(s) marked as overdue`);
      fetchData();
    } catch (err) {
      alert(err.message || "Failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendInvoice = async (inv) => {
    try {
      await api.billingInvoiceUpdateStatus(inv.id, "SENT");
      fetchData();
    } catch (err) {
      alert(err.message || "Failed");
    }
  };

  const handleDeleteInvoice = async (inv) => {
    if (!confirm(`Delete invoice ${inv.invoiceNumber}?`)) return;
    try {
      await api.billingInvoiceDelete(inv.id);
      fetchData();
    } catch (err) {
      alert(err.message || "Failed");
    }
  };

  const handleViewDetail = async (inv) => {
    try {
      const full = await api.billingInvoice(inv.id);
      setViewInvoice(full);
    } catch (err) {
      alert(err.message || "Failed to load invoice");
    }
  };

  if (viewInvoice) {
    return (
      <InvoiceDetail
        invoice={viewInvoice}
        onBack={() => { setViewInvoice(null); fetchData(); }}
        onRefresh={async () => {
          const full = await api.billingInvoice(viewInvoice.id);
          setViewInvoice(full);
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="text-sm">Loading billing data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">ISP Billing</h1>
          <p className="text-sm text-slate-500">Invoices, payments & billing management</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleMarkOverdue} disabled={actionLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors disabled:opacity-50">
            <AlertTriangle className="h-3.5 w-3.5" /> Mark Overdue
          </button>
          <button onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors">
            <Plus className="h-4 w-4" /> New Invoice
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && <StatsCards stats={stats} />}

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none">
          <option value="">All Statuses</option>
          {["DRAFT", "SENT", "PAID", "PARTIALLY_PAID", "OVERDUE", "CANCELLED"].map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                {["Invoice #", "Customer", "Issue Date", "Due Date", "Total", "Paid", "Balance", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-400">
                    <Receipt className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    No invoices found
                  </td>
                </tr>
              ) : invoices.map((inv) => {
                const cust = inv.customer;
                return (
                  <tr key={inv.id} className="border-b border-slate-50 hover:bg-violet-50/20 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono font-semibold text-violet-700 cursor-pointer hover:underline" onClick={() => handleViewDetail(inv)}>
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {cust ? `${cust.firstName} ${cust.lastName}` : "—"}
                      <div className="text-[10px] text-slate-400 font-mono">{cust?.pppoeUsername}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{formatDate(inv.issueDate)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{formatDate(inv.dueDate)}</td>
                    <td className="px-4 py-3 text-sm font-mono font-semibold text-slate-800">{formatCurrency(inv.totalAmount)}</td>
                    <td className="px-4 py-3 text-sm font-mono text-emerald-600">{formatCurrency(inv.amountPaid)}</td>
                    <td className="px-4 py-3 text-sm font-mono text-red-600 font-semibold">{formatCurrency(inv.balanceDue)}</td>
                    <td className="px-4 py-3">{statusBadge(inv.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleViewDetail(inv)} title="View" className="h-7 w-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        {inv.status !== "PAID" && inv.status !== "CANCELLED" && (
                          <button onClick={() => setPayInvoice(inv)} title="Record Payment" className="h-7 w-7 rounded-md flex items-center justify-center text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50">
                            <CreditCard className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {inv.status === "DRAFT" && (
                          <button onClick={() => handleSendInvoice(inv)} title="Mark as Sent" className="h-7 w-7 rounded-md flex items-center justify-center text-blue-400 hover:text-blue-600 hover:bg-blue-50">
                            <Send className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {inv.status === "DRAFT" && (
                          <button onClick={() => handleDeleteInvoice(inv)} title="Delete" className="h-7 w-7 rounded-md flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CreateInvoiceModal open={createOpen} onClose={() => setCreateOpen(false)} customers={customers} onCreated={fetchData} />
      <RecordPaymentModal open={!!payInvoice} onClose={() => setPayInvoice(null)} invoice={payInvoice} onRecorded={fetchData} />
    </div>
  );
}

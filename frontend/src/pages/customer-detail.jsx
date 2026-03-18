import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Button from "../components/ui/button";
import Dialog from "../components/ui/dialog";
import Input from "../components/ui/input";
import RecordPaymentDialog from "../components/payments/RecordPaymentDialog";
import { ArrowLeft, Download, FileText, FileBarChart, Minus, Paperclip, Plus, Receipt, StickyNote, Trash2, Upload, Wallet } from "lucide-react";
import Money from "../components/common/money";
import ActionsMenu from "../components/common/ActionsMenu";
import StatusBadge from "../components/common/StatusBadge";
import EmptyState from "../components/common/EmptyState";
import { cn } from "../lib/utils";

const TABS = [
  { key: "information", label: "Information", icon: FileText },
  { key: "invoices", label: "Invoices", icon: Receipt },
  { key: "quotes", label: "Quotes", icon: FileText },
  { key: "payments", label: "Payments", icon: Wallet },
  { key: "statements", label: "Statements", icon: FileBarChart },
  { key: "credit-notes", label: "Credit Notes", icon: Receipt },
  { key: "documents", label: "Documents", icon: Paperclip },
  { key: "notes", label: "Notes", icon: StickyNote },
];

function formatClientId(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return "—";
  return String(v).padStart(3, "0");
}

function fmtDate(v) {
  if (!v) return "—";
  try {
    return String(v).slice(0, 10);
  } catch {
    return "—";
  }
}

function fmtBytes(v) {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let idx = 0;
  let val = n;
  while (val >= 1024 && idx < units.length - 1) {
    val /= 1024;
    idx++;
  }
  const shown = idx === 0 ? String(Math.round(val)) : val.toFixed(val >= 10 ? 1 : 2);
  return `${shown} ${units[idx]}`;
}

export default function CustomerDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "information";
  const setActiveTab = (tab) => setSearchParams((p) => {
    const next = new URLSearchParams(p);
    if (tab === "information") next.delete("tab");
    else next.set("tab", tab);
    return next;
  });
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteBlockedMessage, setDeleteBlockedMessage] = useState(null);
  const [settingInactive, setSettingInactive] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState(null);
  const [selectedDocumentFile, setSelectedDocumentFile] = useState(null);
  const [selectedDocumentDescription, setSelectedDocumentDescription] = useState("");
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const documentFileInputRef = useRef(null);

  const loadCustomer = useCallback(() => {
    if (!id) return;
    api.getCustomer(id).then(setCustomer).catch(() => {});
  }, [id]);

  const loadDocuments = useCallback(async () => {
    if (!id) return;
    setDocumentsLoading(true);
    setDocumentsError(null);
    try {
      const list = await api.listCustomerDocuments(id);
      setDocuments(Array.isArray(list) ? list : []);
    } catch (e) {
      setDocuments([]);
      setDocumentsError(e?.message ? String(e.message) : "Failed to load documents");
    } finally {
      setDocumentsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setError(null);
    api
      .getCustomer(id)
      .then((res) => {
        if (!mounted) return;
        setCustomer(res);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message ? String(e.message) : "Failed to load customer");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (activeTab !== "documents") return;
    if (!id) return;
    loadDocuments();
  }, [activeTab, id, loadDocuments]);

  const title = useMemo(() => {
    if (!customer) return "Customer";
    return customer.companyName ? String(customer.companyName) : String(customer.contactName || "Customer");
  }, [customer]);

  const lastInvoiceDate = useMemo(() => {
    const invoices = Array.isArray(customer?.invoices) ? customer.invoices : [];
    const dates = invoices
      .map((i) => (i?.issueDate ? new Date(i.issueDate) : null))
      .filter((d) => d && !Number.isNaN(d.getTime()));
    if (dates.length === 0) return "—";
    const latest = dates.sort((a, b) => b.getTime() - a.getTime())[0];
    try {
      return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "2-digit" }).format(latest);
    } catch {
      return latest.toISOString().slice(0, 10);
    }
  }, [customer]);

  const contactSubtitle = useMemo(() => {
    if (!customer) return "";
    const parts = [];
    if (customer.companyName && customer.contactName && String(customer.contactName) !== String(customer.companyName)) {
      parts.push(customer.contactName);
    }
    if (customer.email) parts.push(customer.email);
    if (customer.phone) parts.push(customer.phone);
    return parts.join(" · ");
  }, [customer]);

  const initials = useMemo(() => {
    const text = String(title || "U");
    return text
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  }, [title]);

  const memberSince = useMemo(() => {
    const d = customer?.createdAt ? new Date(customer.createdAt) : null;
    if (!d || Number.isNaN(d.getTime())) return "—";
    try {
      return new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "2-digit" }).format(d);
    } catch {
      return String(customer.createdAt).slice(0, 10);
    }
  }, [customer]);

  const kpis = useMemo(() => {
    const invoices = Array.isArray(customer?.invoices) ? customer.invoices : [];
    const payments = Array.isArray(customer?.payments) ? customer.payments : [];

    const openInvoices = invoices.filter((i) => {
      const s = String(i?.status || "").toUpperCase();
      return s === "SENT" || s === "OVERDUE" || s === "PARTIALLY_PAID";
    });

    const openCount = openInvoices.length;
    const dueTotal = openInvoices.reduce((sum, i) => sum + Number(i?.balanceDue || 0), 0);

    const overdueInvoices = openInvoices.filter((i) => {
      const s = String(i?.status || "").toUpperCase();
      if (s === "OVERDUE") return true;
      const due = i?.dueDate ? new Date(i.dueDate) : null;
      if (!due || Number.isNaN(due.getTime())) return false;
      return due.getTime() < Date.now();
    });
    const overdueTotal = overdueInvoices.reduce((sum, i) => sum + Number(i?.balanceDue || 0), 0);

    const creditTotal = Number(customer?.creditBalance || 0);
    const paidTotal = payments.reduce((sum, p) => {
      const s = String(p?.status || "").toUpperCase();
      if (s && s !== "COMPLETED") return sum;
      return sum + Number(p?.amount || 0);
    }, 0);

    return {
      openInvoices: openCount,
      dueTotal,
      paidTotal,
      overdueTotal,
      creditTotal,
    };
  }, [customer]);

  const notesHasContent = useMemo(() => Boolean(String(customer?.notes || "").trim()), [customer]);

  function parseEmails(str) {
    if (!str || typeof str !== "string") return [""];
    const parts = str.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
    return parts.length ? parts : [""];
  }

  useEffect(() => {
    if (customer && editMode) {
      const emails = parseEmails(customer.email);
      setEditForm({
        type: customer.type || "COMPANY",
        companyName: customer.companyName || "",
        contactName: customer.contactName || "",
        emails,
        phone: customer.phone || "",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        country: customer.country || "",
        postalCode: customer.postalCode || "",
        taxNumber: customer.taxNumber || "",
        status: customer.status || "ACTIVE",
        paymentTermsDays: customer.paymentTermsDays != null ? String(customer.paymentTermsDays) : "",
        openingBalance: customer.openingBalance != null ? String(customer.openingBalance) : "",
        creditLimit: customer.creditLimit != null ? String(customer.creditLimit) : "",
        notes: customer.notes || "",
      });
      setFieldErrors({});
    }
  }, [customer, editMode]);

  async function handleSaveEdit() {
    setSaving(true);
    setFieldErrors({});
    try {
      const emailList = (Array.isArray(editForm.emails) ? editForm.emails : [editForm.email || ""])
        .map((e) => String(e || "").trim())
        .filter(Boolean);
      const emailValue = emailList.length ? emailList.join(", ") : null;

      const updated = await api.updateCustomer(customer.id, {
        ...editForm,
        companyName: String(editForm.companyName || "").trim() || null,
        email: emailValue,
        paymentTermsDays:
          editForm.paymentTermsDays != null && String(editForm.paymentTermsDays).trim() !== ""
            ? Number(editForm.paymentTermsDays)
            : null,
      });
      setCustomer(updated);
      setEditMode(false);
    } catch (e) {
      setError(e?.message ? String(e.message) : "Failed to update customer");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!customer?.id) return;
    setDeleting(true);
    setDeleteBlockedMessage(null);
    try {
      await api.deleteCustomer(customer.id);
      navigate("/customers");
    } catch (e) {
      const msg = e?.message ? String(e.message) : "Failed to delete customer";
      if (msg.includes("related records") || msg.includes("INACTIVE")) {
        setDeleteBlockedMessage(msg);
      } else {
        setError(msg);
        setDeleteConfirmOpen(false);
      }
    } finally {
      setDeleting(false);
    }
  }

  async function handleSetInactive() {
    if (!customer?.id) return;
    setSettingInactive(true);
    setError(null);
    try {
      const updated = await api.updateCustomer(customer.id, { status: "INACTIVE" });
      setCustomer(updated);
      setDeleteBlockedMessage(null);
      setDeleteConfirmOpen(false);
    } catch (e) {
      setError(e?.message ? String(e.message) : "Failed to set customer inactive");
    } finally {
      setSettingInactive(false);
    }
  }

  async function handleUploadDocument() {
    if (!id || !selectedDocumentFile) return;
    setDocumentsError(null);
    setUploadingDocument(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedDocumentFile);
      if (String(selectedDocumentDescription || "").trim()) {
        formData.append("description", String(selectedDocumentDescription).trim());
      }
      await api.uploadCustomerDocument(id, formData);
      setSelectedDocumentFile(null);
      setSelectedDocumentDescription("");
      if (documentFileInputRef.current) {
        documentFileInputRef.current.value = "";
      }
      await loadDocuments();
    } catch (e) {
      setDocumentsError(e?.message ? String(e.message) : "Failed to upload document");
    } finally {
      setUploadingDocument(false);
    }
  }

  async function handleDownloadDocument(doc) {
    if (!id || !doc?.id) return;
    setDocumentsError(null);
    try {
      const { blob, filename } = await api.downloadCustomerDocument(id, doc.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || doc.originalName || "customer-document";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      setDocumentsError(e?.message ? String(e.message) : "Failed to download document");
    }
  }

  async function handleDeleteDocument(doc) {
    if (!id || !doc?.id) return;
    const ok = window.confirm(`Delete "${doc.originalName || "this document"}"?`);
    if (!ok) return;
    setDocumentsError(null);
    try {
      await api.deleteCustomerDocument(id, doc.id);
      await loadDocuments();
    } catch (e) {
      setDocumentsError(e?.message ? String(e.message) : "Failed to delete document");
    }
  }

  return (
    <div className="space-y-6 min-h-screen">
      {/* Breadcrumb */}
      <nav>
        <button
          type="button"
          onClick={() => navigate("/customers")}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Customers
        </button>
      </nav>

      {loading ? <div className="py-12 text-center text-sm text-slate-500">Loading…</div> : null}
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div> : null}
      {!loading && !error && !customer ? <div className="py-12 text-center text-sm text-slate-500">Customer not found.</div> : null}

      {!loading && !error && customer ? (
        <>
          {/* Header card */}
          <Card className="border-slate-200/80 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-lg font-bold shrink-0 ring-2 ring-white/30">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h1 className="text-xl font-bold text-white truncate">{title}</h1>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          String(customer.status).toUpperCase() === "ACTIVE" ? "bg-emerald-400/20 text-emerald-100" :
                          String(customer.status).toUpperCase() === "INACTIVE" ? "bg-white/20 text-white/70" :
                          "bg-amber-400/20 text-amber-100"
                        }`}>{customer.status}</span>
                        {customer?.clientSeq != null ? (
                          <span className="font-mono text-xs text-white/60">#{formatClientId(customer.clientSeq)}</span>
                        ) : null}
                      </div>
                      {contactSubtitle ? <p className="mt-1 text-sm text-violet-100 truncate">{contactSubtitle}</p> : null}
                      <p className="mt-0.5 text-xs text-violet-200/70">Customer since {memberSince}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" className="h-9 border-white/30 text-white bg-white/10 hover:bg-white/20" onClick={() => setEditMode(true)}>Edit</Button>
                    <ActionsMenu
                      ariaLabel="Customer actions"
                      buttonClassName="h-9 w-9 border-white/30 text-white bg-white/10 hover:bg-white/20"
                      menuWidthClassName="w-52"
                      items={[
                        { key: "invoice", label: "Create Invoice", onSelect: () => navigate(`/invoices/new?clientId=${id}`) },
                        { key: "quote", label: "Create Quote", onSelect: () => navigate(`/quotes/new?clientId=${id}`) },
                        { key: "payment", label: "Record Payment", onSelect: () => setRecordPaymentOpen(true) },
                        { key: "statement", label: "Send Statement", onSelect: () => navigate(`/statements/client?clientId=${id}`) },
                        { key: "email", label: "Send Email", disabled: !customer.email, onSelect: () => { if (customer.email) { window.location.href = `mailto:${customer.email.replace(/\s*[,;]\s*/g, ",")}`; } } },
                        { key: "delete", label: "Delete Customer", tone: "danger", onSelect: () => setDeleteConfirmOpen(true) },
                      ]}
                    />
                  </div>
                </div>
              </div>

              {/* KPI strip */}
              <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-slate-200/80 border-b border-slate-200/80">
                <div className="px-5 py-4">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Balance</div>
                  <div className="mt-1 text-lg font-bold tabular-nums text-slate-900"><Money value={Number(customer.balance || 0)} /></div>
                </div>
                <div className="px-5 py-4">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Open</div>
                  <div className="mt-1 text-lg font-bold tabular-nums text-slate-900">{kpis.openInvoices}</div>
                </div>
                <div className="px-5 py-4">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Overdue</div>
                  <div className={"mt-1 text-lg font-bold tabular-nums " + (kpis.overdueTotal > 0 ? "text-rose-600" : "text-slate-900")}><Money value={kpis.overdueTotal} /></div>
                </div>
                <div className="px-5 py-4">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Credit</div>
                  <div className={"mt-1 text-lg font-bold tabular-nums " + (kpis.creditTotal > 0 ? "text-emerald-600" : "text-slate-900")}><Money value={kpis.creditTotal} /></div>
                </div>
                <div className="px-5 py-4">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Paid</div>
                  <div className="mt-1 text-lg font-bold tabular-nums text-slate-900"><Money value={kpis.paidTotal} /></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tab bar */}
          <div className="border-b border-slate-200">
            <nav className="flex gap-0 overflow-x-auto -mb-px" aria-label="Customer sections">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "inline-flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-[13px] font-medium transition-colors",
                    activeTab === key
                      ? "border-violet-600 text-violet-700"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab content */}
          <div>
            {activeTab === "information" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="border-slate-200/80 shadow-sm">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="inline-flex items-center gap-2 text-sm font-semibold">
                      <FileText className="h-4 w-4 text-violet-500" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                      <div>
                        <dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Company Name</dt>
                        <dd className="mt-1 text-slate-800 font-medium">{customer.companyName || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Contact Name</dt>
                        <dd className="mt-1 text-slate-800">{customer.contactName || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Email</dt>
                        <dd className="mt-1 text-slate-800 break-words">
                          {customer.email
                            ? customer.email.split(/[,;]/).map((e, i) => <div key={i} className="text-violet-600">{e.trim()}</div>)
                            : "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Phone</dt>
                        <dd className="mt-1 text-slate-800">{customer.phone || "—"}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Address</dt>
                        <dd className="mt-1 text-slate-800">
                          {[customer.address, customer.city, customer.state, customer.country, customer.postalCode].filter(Boolean).join(", ") || "—"}
                        </dd>
                      </div>
                      {customer.taxNumber ? (
                        <div>
                          <dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Tax/VAT Number</dt>
                          <dd className="mt-1 text-slate-800 font-mono text-xs">{customer.taxNumber}</dd>
                        </div>
                      ) : null}
                    </dl>
                  </CardContent>
                </Card>
                <Card className="border-slate-200/80 shadow-sm">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="inline-flex items-center gap-2 text-sm font-semibold">
                      <Wallet className="h-4 w-4 text-violet-500" />
                      Financial Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                      <div>
                        <dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Balance</dt>
                        <dd className="mt-1 text-slate-800 font-semibold tabular-nums"><Money value={Number(customer.balance || 0)} /></dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Credit Limit</dt>
                        <dd className="mt-1 text-slate-800 tabular-nums"><Money value={Number(customer.creditLimit || 0)} /></dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Payment Terms</dt>
                        <dd className="mt-1 text-slate-800">{customer.paymentTermsDays != null ? `${customer.paymentTermsDays} days` : "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Opening Balance</dt>
                        <dd className="mt-1 text-slate-800 tabular-nums"><Money value={Number(customer.openingBalance || 0)} /></dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Invoiced</dt>
                        <dd className="mt-1 text-slate-800 tabular-nums"><Money value={Number(customer.totalInvoiced || 0)} /></dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Paid</dt>
                        <dd className="mt-1 text-slate-800 tabular-nums"><Money value={Number(customer.totalPaid || 0)} /></dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Last Invoice</dt>
                        <dd className="mt-1 text-slate-800">{lastInvoiceDate}</dd>
                      </div>
                      <div>
                        <dt className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Customer ID</dt>
                        <dd className="mt-1 text-slate-800 font-mono text-xs">{formatClientId(customer.clientSeq)}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "invoices" && (
              <Card className="border-slate-200/80 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between px-4 py-3">
                    <h3 className="text-sm font-medium text-slate-700">Invoices</h3>
                    <Button size="sm" className="h-8" onClick={() => navigate(`/invoices/new?clientId=${customer.id}`)}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> New Invoice
                    </Button>
                  </div>
                  <div className="overflow-auto">
                    <table className="min-w-full text-[13px]">
                      <thead className="bg-slate-50/80">
                        <tr className="border-y border-slate-200/80">
                          <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Invoice</th>
                          <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Issue</th>
                          <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Due</th>
                          <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Status</th>
                          <th className="py-2.5 px-3 text-right text-xs font-medium text-slate-500">Total</th>
                          <th className="py-2.5 px-3 text-right text-xs font-medium text-slate-500">Balance</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {(Array.isArray(customer.invoices) ? customer.invoices : [])
                          .slice()
                          .sort((a, b) => new Date(b.issueDate || 0).getTime() - new Date(a.issueDate || 0).getTime())
                          .map((inv) => (
                            <tr
                              key={inv.id}
                              className="border-b border-slate-100 hover:bg-slate-50/80 cursor-pointer transition-colors"
                              onClick={() => navigate(`/invoices/${inv.id}`)}
                            >
                              <td className="py-2.5 px-3 font-medium text-slate-900">{inv.invoiceNumber}</td>
                              <td className="py-2.5 px-3 text-slate-500">{fmtDate(inv.issueDate)}</td>
                              <td className="py-2.5 px-3 text-slate-500">{fmtDate(inv.dueDate)}</td>
                              <td className="py-2.5 px-3"><StatusBadge status={inv.status} size="sm" /></td>
                              <td className="py-2.5 px-3 text-right tabular-nums font-medium text-slate-800"><Money value={Number(inv.totalAmount || 0)} /></td>
                              <td className="py-2.5 px-3 text-right tabular-nums text-slate-600"><Money value={Number(inv.balanceDue || 0)} /></td>
                            </tr>
                          ))}
                        {(Array.isArray(customer.invoices) ? customer.invoices : []).length === 0 ? (
                          <tr><td colSpan={6} className="py-0 px-4"><EmptyState icon={Receipt} title="No invoices yet" description="Create an invoice to get started" /></td></tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "documents" && (
              <Card className="border-slate-200/80 overflow-hidden">
                <CardContent className="p-0">
                  <div className="px-4 py-3">
                    {documentsError ? <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{documentsError}</div> : null}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Description (optional)"
                          value={selectedDocumentDescription}
                          onChange={(e) => setSelectedDocumentDescription(e.target.value)}
                          className="h-9"
                        />
                        <Input
                          type="file"
                          ref={documentFileInputRef}
                          onChange={(e) => setSelectedDocumentFile(e.target?.files?.[0] || null)}
                          className="h-9"
                        />
                        <Button
                          type="button"
                          className="h-9 shrink-0"
                          onClick={handleUploadDocument}
                          disabled={!selectedDocumentFile || uploadingDocument}
                        >
                          <Upload className="h-4 w-4 mr-1.5" />
                          Upload
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-auto">
                    <table className="min-w-full text-[13px]">
                      <thead className="bg-slate-50/80">
                        <tr className="border-y border-slate-200/80">
                          <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">File</th>
                          <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Description</th>
                          <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Uploaded</th>
                          <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Size</th>
                          <th className="py-2.5 px-3 text-right text-xs font-medium text-slate-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {(Array.isArray(documents) ? documents : []).map((doc) => (
                          <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                            <td className="py-2.5 px-3 font-medium text-slate-900">
                              {doc.originalName || "—"}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500">
                              {String(doc?.description || "").trim() ? String(doc.description) : "—"}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500">{fmtDate(doc.createdAt)}</td>
                            <td className="py-2.5 px-3 text-slate-500 tabular-nums">{fmtBytes(doc.size)}</td>
                            <td className="py-2.5 px-3">
                              <div className="flex justify-end">
                                <ActionsMenu
                                  ariaLabel="Document actions"
                                  items={[
                                    { key: "download", label: "Download", onSelect: () => handleDownloadDocument(doc) },
                                    { key: "delete", label: "Delete", tone: "danger", onSelect: () => handleDeleteDocument(doc) },
                                  ]}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                        {documentsLoading ? (
                          <tr><td className="py-10 text-center text-sm text-slate-500" colSpan={5}>Loading…</td></tr>
                        ) : null}
                        {!documentsLoading && (Array.isArray(documents) ? documents : []).length === 0 ? (
                          <tr><td colSpan={5} className="py-0 px-4"><EmptyState icon={Paperclip} title="No documents yet" description="Upload a document to get started" /></td></tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "quotes" && (
              <Card className="border-slate-200/80 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between px-4 py-3">
                    <h3 className="text-sm font-medium text-slate-700">Quotes</h3>
                    <Button size="sm" className="h-8" onClick={() => navigate(`/quotes/new?clientId=${customer.id}`)}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> New Quote
                    </Button>
                  </div>
                  <div className="overflow-auto">
                    <table className="min-w-full text-[13px]">
                      <thead className="bg-slate-50/80">
                        <tr className="border-y border-slate-200/80">
                          <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Quote</th>
                          <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Issue</th>
                          <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Expiry</th>
                          <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Status</th>
                          <th className="py-2.5 px-3 text-right text-xs font-medium text-slate-500">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {(Array.isArray(customer.quotes) ? customer.quotes : [])
                          .slice()
                          .sort((a, b) => new Date(b.issueDate || 0).getTime() - new Date(a.issueDate || 0).getTime())
                          .map((q) => (
                            <tr
                              key={q.id}
                              className="border-b border-slate-100 hover:bg-slate-50/80 cursor-pointer transition-colors"
                              onClick={() => navigate(`/quotes/${q.id}`)}
                            >
                              <td className="py-2.5 px-3 font-medium text-slate-900">{q.quoteNumber}</td>
                              <td className="py-2.5 px-3 text-slate-500">{fmtDate(q.issueDate)}</td>
                              <td className="py-2.5 px-3 text-slate-500">{fmtDate(q.expiryDate)}</td>
                              <td className="py-2.5 px-3"><StatusBadge status={q.status} size="sm" /></td>
                              <td className="py-2.5 px-3 text-right tabular-nums font-medium text-slate-800"><Money value={Number(q.totalAmount || 0)} /></td>
                            </tr>
                          ))}
                        {(Array.isArray(customer.quotes) ? customer.quotes : []).length === 0 ? (
                          <tr><td colSpan={5} className="py-0 px-4"><EmptyState icon={FileText} title="No quotes yet" description="Create a quote to get started" /></td></tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "payments" && (
              <Card className="border-slate-200/80 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between px-4 py-3">
                    <h3 className="text-sm font-medium text-slate-700">Payments</h3>
                    <Button size="sm" className="h-8" onClick={() => setRecordPaymentOpen(true)}>
                      <Plus className="h-3.5 w-3.5 mr-1" /> Record Payment
                    </Button>
                  </div>
                  <div className="overflow-auto">
                    <table className="min-w-full text-[13px]">
                      <thead className="bg-slate-50/80">
                        <tr className="border-y border-slate-200/80">
                          <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Payment</th>
                          <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Date</th>
                          <th className="py-2.5 px-3 text-right text-xs font-medium text-slate-500">Amount</th>
                          <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {(Array.isArray(customer.payments) ? customer.payments : [])
                          .slice()
                          .sort((a, b) => new Date(b.paymentDate || 0).getTime() - new Date(a.paymentDate || 0).getTime())
                          .map((p) => (
                            <tr
                              key={p.id}
                              className="border-b border-slate-100 hover:bg-slate-50/80 cursor-pointer transition-colors"
                              onClick={() => navigate(`/payments?clientId=${customer.id}`)}
                            >
                              <td className="py-2.5 px-3 font-medium text-slate-900">{p.paymentNumber || "—"}</td>
                              <td className="py-2.5 px-3 text-slate-500">{fmtDate(p.paymentDate)}</td>
                              <td className="py-2.5 px-3 text-right tabular-nums font-medium text-slate-800"><Money value={Number(p.amount || 0)} /></td>
                              <td className="py-2.5 px-3"><StatusBadge status={p.status || "COMPLETED"} size="sm" /></td>
                            </tr>
                          ))}
                        {(Array.isArray(customer.payments) ? customer.payments : []).length === 0 ? (
                          <tr><td colSpan={4} className="py-0 px-4"><EmptyState icon={Wallet} title="No payments yet" description="Record a payment to get started" /></td></tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "statements" && (
              <Card className="border-slate-200/80">
                <CardContent className="p-0">
                  <EmptyState
                    icon={FileBarChart}
                    title="Account Statements"
                    description="Generate and send account statements to this customer"
                    action={
                      <Button className="h-9" onClick={() => navigate(`/statements/client?clientId=${customer.id}`)}>
                        Send Statement
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            )}

            {activeTab === "credit-notes" && (
              <Card className="border-slate-200/80">
                <CardContent className="p-0">
                  <EmptyState
                    icon={Receipt}
                    title="Credit Notes"
                    description="Credit notes are not available yet. This feature is coming soon."
                  />
                </CardContent>
              </Card>
            )}

            {activeTab === "notes" && (
              <Card className="border-slate-200/80">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                      <StickyNote className="h-4 w-4 text-slate-400" />
                      Notes
                    </h3>
                    <Button variant="outline" className="h-8" onClick={() => setEditMode(true)}>Edit Notes</Button>
                  </div>
                  <div className="rounded-lg border border-slate-200/80 bg-slate-50/50 p-4">
                    {notesHasContent ? (
                      <div className="text-sm text-slate-700 whitespace-pre-wrap break-words">{customer.notes}</div>
                    ) : (
                      <div className="text-sm text-slate-400 italic">No notes yet. Add a note to keep track of important information about this customer.</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      ) : null}

      {recordPaymentOpen && customer ? (
        <RecordPaymentDialog
          open={recordPaymentOpen}
          onOpenChange={setRecordPaymentOpen}
          defaultClientId={customer.id}
          defaultClientName={customer.companyName || customer.contactName || ""}
          onSuccess={loadCustomer}
        />
      ) : null}

      {editMode && customer ? (
        <Dialog open={editMode} onOpenChange={setEditMode} title="Edit Customer">
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
            {/* Section: Basic Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <FileText className="h-4 w-4 text-violet-500" />
                <h3 className="text-[13px] font-semibold text-slate-700 uppercase tracking-wider">Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-slate-600">Customer Type</label>
                  <select
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 transition-shadow"
                    value={editForm.type}
                    onChange={(e) => setEditForm((p) => ({ ...p, type: e.target.value }))}
                  >
                    <option value="COMPANY">Company</option>
                    <option value="INDIVIDUAL">Individual</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-slate-600">Status</label>
                  <select
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 transition-shadow"
                    value={editForm.status}
                    onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="LEAD">Lead</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-slate-600">
                    Company Name{editForm.type === "COMPANY" ? " *" : ""}
                  </label>
                  <Input
                    value={editForm.companyName}
                    onChange={(e) => setEditForm((p) => ({ ...p, companyName: e.target.value }))}
                    placeholder={editForm.type === "COMPANY" ? "Company name" : "Optional"}
                    className="rounded-lg focus:ring-violet-500/40 focus:border-violet-400"
                  />
                  {fieldErrors.companyName ? <div className="text-xs text-red-600">{fieldErrors.companyName}</div> : null}
                </div>
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-slate-600">Contact Name</label>
                  <Input value={editForm.contactName} onChange={(e) => setEditForm((p) => ({ ...p, contactName: e.target.value }))} placeholder="Full name" className="rounded-lg" />
                </div>
              </div>
            </div>

            {/* Section: Contact */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <Receipt className="h-4 w-4 text-violet-500" />
                <h3 className="text-[13px] font-semibold text-slate-700 uppercase tracking-wider">Contact Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[13px] font-medium text-slate-600">Email Addresses</label>
                  <div className="space-y-2">
                    {(Array.isArray(editForm.emails) ? editForm.emails : [editForm.email || ""]).map((addr, i) => (
                      <div key={i} className="flex gap-2">
                        <Input type="email" value={addr} onChange={(e) => { const list = [...(editForm.emails || [""])]; list[i] = e.target.value; setEditForm((p) => ({ ...p, emails: list })); }} placeholder="email@example.com" className="rounded-lg" />
                        <Button type="button" variant="outline" size="sm" className="shrink-0 h-10 w-10 px-0 rounded-lg" onClick={() => { const list = (editForm.emails || [""]).filter((_, j) => j !== i); setEditForm((p) => ({ ...p, emails: list.length ? list : [""] })); }} disabled={(editForm.emails || [""]).length <= 1} aria-label="Remove email">
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" className="text-xs rounded-lg text-violet-600 border-violet-200 hover:bg-violet-50" onClick={() => setEditForm((p) => ({ ...p, emails: [...(p.emails || [""]), ""] }))}>
                      <Plus className="h-3 w-3 mr-1 inline" />
                      Add email
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-slate-600">Phone</label>
                  <Input value={editForm.phone} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} placeholder="+1 555 123 4567" className="rounded-lg" />
                </div>
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-slate-600">Tax/VAT #</label>
                  <Input value={editForm.taxNumber} onChange={(e) => setEditForm((p) => ({ ...p, taxNumber: e.target.value }))} placeholder="Optional" className="rounded-lg" />
                </div>
              </div>
            </div>

            {/* Section: Address */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <FileText className="h-4 w-4 text-violet-500" />
                <h3 className="text-[13px] font-semibold text-slate-700 uppercase tracking-wider">Address</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[13px] font-medium text-slate-600">Street Address</label>
                  <Input value={editForm.address} onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))} placeholder="Street address" className="rounded-lg" />
                </div>
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-slate-600">City</label>
                  <Input value={editForm.city} onChange={(e) => setEditForm((p) => ({ ...p, city: e.target.value }))} placeholder="City" className="rounded-lg" />
                </div>
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-slate-600">State/Province</label>
                  <Input value={editForm.state} onChange={(e) => setEditForm((p) => ({ ...p, state: e.target.value }))} placeholder="State" className="rounded-lg" />
                </div>
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-slate-600">Country</label>
                  <Input value={editForm.country} onChange={(e) => setEditForm((p) => ({ ...p, country: e.target.value }))} placeholder="Country" className="rounded-lg" />
                </div>
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-slate-600">Postal Code</label>
                  <Input value={editForm.postalCode} onChange={(e) => setEditForm((p) => ({ ...p, postalCode: e.target.value }))} placeholder="Postal code" className="rounded-lg" />
                </div>
              </div>
            </div>

            {/* Section: Financial */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <Wallet className="h-4 w-4 text-violet-500" />
                <h3 className="text-[13px] font-semibold text-slate-700 uppercase tracking-wider">Financial</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-slate-600">Payment Terms (days)</label>
                  <Input type="number" value={editForm.paymentTermsDays} onChange={(e) => setEditForm((p) => ({ ...p, paymentTermsDays: e.target.value }))} placeholder="30" className="rounded-lg" />
                </div>
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-slate-600">Opening Balance</label>
                  <Input type="number" step="0.01" value={editForm.openingBalance} onChange={(e) => setEditForm((p) => ({ ...p, openingBalance: e.target.value }))} placeholder="0.00" className="rounded-lg" />
                </div>
                <div className="space-y-1">
                  <label className="text-[13px] font-medium text-slate-600">Credit Limit</label>
                  <Input type="number" step="0.01" value={editForm.creditLimit} onChange={(e) => setEditForm((p) => ({ ...p, creditLimit: e.target.value }))} placeholder="0.00" className="rounded-lg" />
                </div>
              </div>
            </div>

            {/* Section: Notes */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <StickyNote className="h-4 w-4 text-violet-500" />
                <h3 className="text-[13px] font-semibold text-slate-700 uppercase tracking-wider">Notes</h3>
              </div>
              <textarea
                className="min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 transition-shadow"
                value={editForm.notes}
                onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Optional notes about this customer..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setEditMode(false)} disabled={saving} className="rounded-lg">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="rounded-lg bg-violet-600 hover:bg-violet-700">
                {saving ? "Saving\u2026" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Dialog>
      ) : null}

      {deleteConfirmOpen ? (
        <Dialog
          open={deleteConfirmOpen}
          onOpenChange={(o) => {
            if (!o) {
              setDeleteBlockedMessage(null);
            }
            setDeleteConfirmOpen(o);
          }}
          title="Delete Customer"
        >
          <div className="space-y-4">
            {deleteBlockedMessage ? (
              <>
                <p className="text-sm text-slate-700">{deleteBlockedMessage}</p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDeleteBlockedMessage(null);
                      setDeleteConfirmOpen(false);
                    }}
                    disabled={settingInactive}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSetInactive}
                    disabled={settingInactive}
                  >
                    {settingInactive ? "Updating…" : "Set to Inactive"}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-700">
                  Are you sure you want to delete <strong>{title}</strong>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={deleting}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting…" : "Delete"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </Dialog>
      ) : null}
    </div>
  );
}

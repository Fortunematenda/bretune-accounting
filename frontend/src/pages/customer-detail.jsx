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
import InvoiceStatusBadge from "../components/invoices/invoice-status-badge";
import QuoteStatusBadge from "../components/quotes/QuoteStatusBadge";
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
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <nav className="text-sm text-slate-500 dark:text-slate-400">
        <button type="button" onClick={() => navigate("/customers")} className="hover:text-slate-700 dark:hover:text-slate-300">
          Customers
        </button>
      </nav>

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="outline"
            className="h-10 w-10 p-0"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <div className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 truncate">{title}</div>
            {contactSubtitle ? <div className="mt-0.5 text-sm text-slate-600 dark:text-slate-400 truncate">{contactSubtitle}</div> : null}
            <div className="mt-2 flex flex-wrap gap-2">
              {customer?.clientSeq != null ? (
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  ID {formatClientId(customer.clientSeq)}
                </span>
              ) : null}
              {customer?.status ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  <span className="relative inline-flex h-2 w-2">
                    <span
                      className={
                        String(customer.status).toUpperCase() === "ACTIVE"
                          ? "absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
                          : "absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"
                      }
                    />
                    <span
                      className={
                        String(customer.status).toUpperCase() === "ACTIVE"
                          ? "relative inline-flex h-2 w-2 rounded-full bg-emerald-500"
                          : "relative inline-flex h-2 w-2 rounded-full bg-rose-500"
                      }
                    />
                  </span>
                  {String(customer.status)}
                </span>
              ) : null}
              {customer?.city ? (
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  {customer.city}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {id ? (
          <ActionsMenu
            ariaLabel="Customer actions"
            buttonClassName="h-10 w-10"
            buttonIconClassName="h-5 w-5"
            menuWidthClassName="w-56"
            items={[
              {
                key: "invoice",
                label: "Create Invoice",
                onSelect: () => navigate(`/invoices/new?clientId=${id}`),
              },
              {
                key: "quote",
                label: "Create Quote",
                onSelect: () => navigate(`/quotes/new?clientId=${id}`),
              },
              {
                key: "payment",
                label: "Add Payment",
                onSelect: () => navigate(`/payments?clientId=${id}`),
              },
              {
                key: "credit",
                label: "Create Credit",
                onSelect: () => window.alert("Credit notes are not enabled yet."),
              },
              {
                key: "statement",
                label: "Send Statement",
                onSelect: () => navigate(`/statements/client?clientId=${id}`),
              },
            ]}
          />
        ) : null}
      </div>

      {loading ? <div className="text-sm text-slate-600">Loading…</div> : null}
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
      {!loading && !error && !customer ? <div className="text-sm text-slate-600">Customer not found.</div> : null}

      {!loading && !error && customer ? (
        <>
          {/* Summary bar */}
          <div className="flex flex-wrap items-center justify-end gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Account balance <strong className="text-slate-900 dark:text-slate-100 ml-1"><Money value={Number(customer.balance || 0)} /></strong>
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="outline" onClick={() => navigate(`/invoices/new?clientId=${customer.id}`)}>
              Create Invoice
            </Button>
            <Button variant="outline" onClick={() => navigate(`/quotes/new?clientId=${customer.id}`)}>
              Create Quote
            </Button>
            <Button variant="outline" onClick={() => setRecordPaymentOpen(true)}>
              Record Payment
            </Button>
            <Button variant="outline" onClick={() => navigate(`/statements/client?clientId=${customer.id}`)}>
              Send Statement
            </Button>
            <Button variant="outline" onClick={() => setEditMode(true)}>
              Add Note
            </Button>
          </div>

          {/* Tab bar */}
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="flex gap-1 overflow-x-auto" aria-label="Customer sections">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                    activeTab === key
                      ? "border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400"
                      : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab content */}
          <div className="pt-4">
            {activeTab === "information" && (
              <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
                <Card>
                  <CardContent className="p-5">
                    <div className="relative">
                      <div className="absolute top-0 right-0">
                        <ActionsMenu
                          ariaLabel="Customer profile actions"
                          buttonClassName="h-8 w-8"
                          buttonIconClassName="h-4 w-4"
                          menuWidthClassName="w-48"
                          items={[
                            { key: "edit", label: "Edit", onSelect: () => setEditMode(true) },
                            { key: "delete", label: "Delete", tone: "danger", onSelect: () => setDeleteConfirmOpen(true) },
                          ]}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center text-center pt-2">
                      <div className="h-20 w-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 text-xl font-semibold dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
                        {initials}
                      </div>
                      <div className="mt-3 text-xs text-slate-500">Member since {memberSince}</div>
                      <div className="mt-4 w-full space-y-2">
                        <Button
                          className="w-full"
                          onClick={() => {
                            if (customer.email) {
                              const addr = customer.email.replace(/\s*[,;]\s*/g, ",");
                              window.location.href = `mailto:${addr}`;
                            }
                          }}
                          disabled={!customer.email}
                        >
                          Send Email
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => navigate(`/statements/client?clientId=${customer.id}`)}>
                          Statement
                        </Button>
                      </div>
                      <div className="mt-4 w-full rounded-lg border border-slate-200 bg-slate-50/50 p-3 text-left dark:border-slate-700 dark:bg-slate-800/50">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Last invoice</div>
                            <div className="mt-0.5 text-slate-900 dark:text-slate-100">{lastInvoiceDate}</div>
                          </div>
                          <div>
                            <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Since</div>
                            <div className="mt-0.5 text-slate-900 dark:text-slate-100">{memberSince}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="inline-flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-500" />
                        Main information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-xs text-slate-500">Customer ID</div>
                          <div className="mt-1 text-slate-900 dark:text-slate-100 font-mono">{formatClientId(customer.clientSeq)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Emails</div>
                          <div className="mt-1 text-slate-900 dark:text-slate-100 break-words">
                            {customer.email
                              ? customer.email.split(/[,;]/).map((e, i) => <div key={i}>{e.trim()}</div>)
                              : "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Phone</div>
                          <div className="mt-1 text-slate-900 dark:text-slate-100">{customer.phone || "—"}</div>
                        </div>
                      </div>
                      <div className="mt-4 text-sm">
                        <div className="text-xs text-slate-500">Address</div>
                        <div className="mt-1 text-slate-900 dark:text-slate-100">
                          {[customer.address, customer.city, customer.state, customer.country].filter(Boolean).join(", ") || "—"}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="inline-flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-slate-500" />
                        Financial information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-xs text-slate-500">Balance</div>
                          <div className="mt-1 text-slate-900 dark:text-slate-100 font-medium"><Money value={Number(customer.balance || 0)} /></div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Credit limit</div>
                          <div className="mt-1 text-slate-900 dark:text-slate-100"><Money value={Number(customer.creditLimit || 0)} /></div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Payment terms</div>
                          <div className="mt-1 text-slate-900 dark:text-slate-100">{customer.paymentTermsDays != null ? `${customer.paymentTermsDays} days` : "—"}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Opening balance</div>
                          <div className="mt-1 text-slate-900 dark:text-slate-100"><Money value={Number(customer.openingBalance || 0)} /></div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Total invoiced</div>
                          <div className="mt-1 text-slate-900 dark:text-slate-100"><Money value={Number(customer.totalInvoiced || 0)} /></div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Total paid</div>
                          <div className="mt-1 text-slate-900 dark:text-slate-100"><Money value={Number(customer.totalPaid || 0)} /></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card><CardContent className="p-4"><div className="text-xs font-medium text-slate-600">Open invoices</div><div className="mt-1 text-2xl font-semibold">{kpis.openInvoices}</div></CardContent></Card>
                    <Card><CardContent className="p-4"><div className="text-xs font-medium text-slate-600">Balance</div><div className="mt-1 text-2xl font-semibold"><Money value={kpis.dueTotal} /></div></CardContent></Card>
                    <Card><CardContent className="p-4"><div className="text-xs font-medium text-slate-600">Overdue</div><div className={"mt-1 text-2xl font-semibold " + (kpis.overdueTotal > 0 ? "text-rose-700" : "text-slate-900")}><Money value={kpis.overdueTotal} /></div></CardContent></Card>
                    <Card><CardContent className="p-4"><div className="text-xs font-medium text-slate-600">Credit</div><div className={"mt-1 text-2xl font-semibold " + (kpis.creditTotal > 0 ? "text-emerald-700" : "text-slate-900")}><Money value={kpis.creditTotal} /></div></CardContent></Card>
                    <Card><CardContent className="p-4"><div className="text-xs font-medium text-slate-600">Paid</div><div className="mt-1 text-2xl font-semibold"><Money value={kpis.paidTotal} /></div></CardContent></Card>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "invoices" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-3">
                    <span>Invoices</span>
                    <Button
                      size="sm"
                      className="h-8 w-8 p-0 shrink-0"
                      onClick={() => navigate(`/invoices/new?clientId=${customer.id}`)}
                      aria-label="Add invoice"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto">
                    <table className="min-w-full text-sm">
                      <thead className="text-left text-slate-600 dark:text-slate-300">
                        <tr className="border-b border-slate-200 dark:border-slate-800">
                          <th className="py-3 pr-3">Invoice</th>
                          <th className="py-3 pr-3">Issue</th>
                          <th className="py-3 pr-3">Due</th>
                          <th className="py-3 pr-3">Status</th>
                          <th className="py-3 pr-3 text-right">Total</th>
                          <th className="py-3 pr-3 text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(Array.isArray(customer.invoices) ? customer.invoices : [])
                          .slice()
                          .sort((a, b) => new Date(b.issueDate || 0).getTime() - new Date(a.issueDate || 0).getTime())
                          .map((inv) => (
                            <tr
                              key={inv.id}
                              className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 cursor-pointer"
                              onClick={() => navigate(`/invoices/${inv.id}`)}
                            >
                              <td className="py-3 pr-3 font-medium text-slate-900 dark:text-slate-100">{inv.invoiceNumber}</td>
                              <td className="py-3 pr-3 text-slate-700 dark:text-slate-300">{fmtDate(inv.issueDate)}</td>
                              <td className="py-3 pr-3 text-slate-700 dark:text-slate-300">{fmtDate(inv.dueDate)}</td>
                              <td className="py-3 pr-3"><InvoiceStatusBadge status={inv.status} /></td>
                              <td className="py-3 pr-3 text-right"><Money value={Number(inv.totalAmount || 0)} /></td>
                              <td className="py-3 pr-3 text-right"><Money value={Number(inv.balanceDue || 0)} /></td>
                            </tr>
                          ))}
                        {(Array.isArray(customer.invoices) ? customer.invoices : []).length === 0 ? (
                          <tr><td className="py-8 text-center text-slate-500" colSpan={6}>No invoices yet.</td></tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "documents" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-slate-500" />
                      Documents
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {documentsError ? <div className="mb-3 text-sm text-red-600">{documentsError}</div> : null}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Description (optional)"
                        value={selectedDocumentDescription}
                        onChange={(e) => setSelectedDocumentDescription(e.target.value)}
                      />
                      <Input
                        type="file"
                        ref={documentFileInputRef}
                        onChange={(e) => setSelectedDocumentFile(e.target?.files?.[0] || null)}
                      />
                      <Button
                        type="button"
                        onClick={handleUploadDocument}
                        disabled={!selectedDocumentFile || uploadingDocument}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    <Button type="button" variant="outline" onClick={loadDocuments} disabled={documentsLoading}>
                      Refresh
                    </Button>
                  </div>

                  <div className="mt-4 overflow-auto">
                    <table className="min-w-full text-sm">
                      <thead className="text-left text-slate-600 dark:text-slate-300">
                        <tr className="border-b border-slate-200 dark:border-slate-800">
                          <th className="py-3 pr-3">File</th>
                          <th className="py-3 pr-3">Description</th>
                          <th className="py-3 pr-3">Uploaded</th>
                          <th className="py-3 pr-3">Size</th>
                          <th className="py-3 pr-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(Array.isArray(documents) ? documents : []).map((doc) => (
                          <tr key={doc.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-3 pr-3 font-medium text-slate-900 dark:text-slate-100">
                              {doc.originalName || "—"}
                            </td>
                            <td className="py-3 pr-3 text-slate-700 dark:text-slate-300">
                              {String(doc?.description || "").trim() ? String(doc.description) : "—"}
                            </td>
                            <td className="py-3 pr-3 text-slate-700 dark:text-slate-300">{fmtDate(doc.createdAt)}</td>
                            <td className="py-3 pr-3 text-slate-700 dark:text-slate-300">{fmtBytes(doc.size)}</td>
                            <td className="py-3 pr-3">
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
                          <tr><td className="py-8 text-center text-slate-500" colSpan={5}>Loading…</td></tr>
                        ) : null}
                        {!documentsLoading && (Array.isArray(documents) ? documents : []).length === 0 ? (
                          <tr><td className="py-8 text-center text-slate-500" colSpan={5}>No documents yet.</td></tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "quotes" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-3">
                    <span>Quotes</span>
                    <Button
                      size="sm"
                      className="h-8 w-8 p-0 shrink-0"
                      onClick={() => navigate(`/quotes/new?clientId=${customer.id}`)}
                      aria-label="Add quote"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto">
                    <table className="min-w-full text-sm">
                      <thead className="text-left text-slate-600 dark:text-slate-300">
                        <tr className="border-b border-slate-200 dark:border-slate-800">
                          <th className="py-3 pr-3">Quote</th>
                          <th className="py-3 pr-3">Issue</th>
                          <th className="py-3 pr-3">Expiry</th>
                          <th className="py-3 pr-3">Status</th>
                          <th className="py-3 pr-3 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(Array.isArray(customer.quotes) ? customer.quotes : [])
                          .slice()
                          .sort((a, b) => new Date(b.issueDate || 0).getTime() - new Date(a.issueDate || 0).getTime())
                          .map((q) => (
                            <tr
                              key={q.id}
                              className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 cursor-pointer"
                              onClick={() => navigate(`/quotes/${q.id}`)}
                            >
                              <td className="py-3 pr-3 font-medium text-slate-900 dark:text-slate-100">{q.quoteNumber}</td>
                              <td className="py-3 pr-3 text-slate-700 dark:text-slate-300">{fmtDate(q.issueDate)}</td>
                              <td className="py-3 pr-3 text-slate-700 dark:text-slate-300">{fmtDate(q.expiryDate)}</td>
                              <td className="py-3 pr-3"><QuoteStatusBadge status={q.status} /></td>
                              <td className="py-3 pr-3 text-right"><Money value={Number(q.totalAmount || 0)} /></td>
                            </tr>
                          ))}
                        {(Array.isArray(customer.quotes) ? customer.quotes : []).length === 0 ? (
                          <tr><td className="py-8 text-center text-slate-500" colSpan={5}>No quotes yet.</td></tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "payments" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-3">
                    <span>Payments</span>
                    <Button
                      size="sm"
                      className="h-8 w-8 p-0 shrink-0"
                      onClick={() => navigate(`/payments?clientId=${customer.id}&new=1`)}
                      aria-label="Record payment"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto">
                    <table className="min-w-full text-sm">
                      <thead className="text-left text-slate-600 dark:text-slate-300">
                        <tr className="border-b border-slate-200 dark:border-slate-800">
                          <th className="py-3 pr-3">Payment</th>
                          <th className="py-3 pr-3">Date</th>
                          <th className="py-3 pr-3">Amount</th>
                          <th className="py-3 pr-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(Array.isArray(customer.payments) ? customer.payments : [])
                          .slice()
                          .sort((a, b) => new Date(b.paymentDate || 0).getTime() - new Date(a.paymentDate || 0).getTime())
                          .map((p) => (
                            <tr
                              key={p.id}
                              className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 cursor-pointer"
                              onClick={() => navigate(`/payments?clientId=${customer.id}`)}
                            >
                              <td className="py-3 pr-3 font-medium text-slate-900 dark:text-slate-100">{p.paymentNumber || "—"}</td>
                              <td className="py-3 pr-3 text-slate-700 dark:text-slate-300">{fmtDate(p.paymentDate)}</td>
                              <td className="py-3 pr-3 text-right"><Money value={Number(p.amount || 0)} /></td>
                              <td className="py-3 pr-3">{String(p.status || "—")}</td>
                            </tr>
                          ))}
                        {(Array.isArray(customer.payments) ? customer.payments : []).length === 0 ? (
                          <tr><td className="py-8 text-center text-slate-500" colSpan={4}>No payments yet.</td></tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "statements" && (
              <Card>
                <CardHeader>
                  <CardTitle>Statements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-6 text-center">
                    <FileBarChart className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Generate and send account statements to this customer.</p>
                    <Button className="mt-4" onClick={() => navigate(`/statements/client?clientId=${customer.id}`)}>
                      Send Statement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "credit-notes" && (
              <Card>
                <CardHeader>
                  <CardTitle>Credit Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-6 text-center">
                    <Receipt className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Credit notes are not available yet. This feature is coming soon.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "notes" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2">
                      <StickyNote className="h-4 w-4 text-slate-500" />
                      Notes
                    </span>
                    <Button variant="outline" onClick={() => setEditMode(true)}>+ Add Note</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                    {notesHasContent ? (
                      <div className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap break-words">{customer.notes}</div>
                    ) : (
                      <div className="text-sm text-slate-500">No notes yet. Add a note to keep track of important information about this customer.</div>
                    )}
                    <div className="mt-4 border-t border-slate-200 pt-4">
                      <div className="text-xs text-slate-500">Note history</div>
                      <div className="mt-1 text-sm text-slate-500">Note timeline will appear here.</div>
                    </div>
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
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Customer Type</label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={editForm.type}
                  onChange={(e) => setEditForm((p) => ({ ...p, type: e.target.value }))}
                >
                  <option value="COMPANY">Company</option>
                  <option value="INDIVIDUAL">Individual</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Customer / Company Name{editForm.type === "COMPANY" ? " *" : ""}
                </label>
                <Input
                  value={editForm.companyName}
                  onChange={(e) => setEditForm((p) => ({ ...p, companyName: e.target.value }))}
                  placeholder={editForm.type === "COMPANY" ? "Company name" : "Optional"}
                />
                {fieldErrors.companyName ? <div className="text-xs text-red-600">{fieldErrors.companyName}</div> : null}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Contact Name</label>
                <Input
                  value={editForm.contactName}
                  onChange={(e) => setEditForm((p) => ({ ...p, contactName: e.target.value }))}
                  placeholder="Full name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Emails</label>
                <div className="space-y-2">
                  {(Array.isArray(editForm.emails) ? editForm.emails : [editForm.email || ""]).map((addr, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        type="email"
                        value={addr}
                        onChange={(e) => {
                          const list = [...(editForm.emails || [""])];
                          list[i] = e.target.value;
                          setEditForm((p) => ({ ...p, emails: list }));
                        }}
                        placeholder="email@example.com"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="shrink-0 h-10 px-2"
                        onClick={() => {
                          const list = (editForm.emails || [""]).filter((_, j) => j !== i);
                          setEditForm((p) => ({ ...p, emails: list.length ? list : [""] }));
                        }}
                        disabled={(editForm.emails || [""]).length <= 1}
                        aria-label="Remove email"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => setEditForm((p) => ({ ...p, emails: [...(p.emails || [""]), ""] }))}
                  >
                    <Plus className="h-3 w-3 mr-1 inline" />
                    Add another email
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={editForm.phone}
                  onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+1 555 123 4567"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Status</label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={editForm.status}
                  onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="LEAD">Lead</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Payment Terms (days)</label>
                <Input
                  type="number"
                  value={editForm.paymentTermsDays}
                  onChange={(e) => setEditForm((p) => ({ ...p, paymentTermsDays: e.target.value }))}
                  placeholder="30"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Opening Balance</label>
                <Input
                  type="number"
                  step="0.01"
                  value={editForm.openingBalance}
                  onChange={(e) => setEditForm((p) => ({ ...p, openingBalance: e.target.value }))}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Credit Limit</label>
                <Input
                  type="number"
                  step="0.01"
                  value={editForm.creditLimit}
                  onChange={(e) => setEditForm((p) => ({ ...p, creditLimit: e.target.value }))}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Tax/VAT #</label>
                <Input
                  value={editForm.taxNumber}
                  onChange={(e) => setEditForm((p) => ({ ...p, taxNumber: e.target.value }))}
                  placeholder="Optional"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Address</label>
                <Input
                  value={editForm.address}
                  onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))}
                  placeholder="Street address"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">City</label>
                <Input
                  value={editForm.city}
                  onChange={(e) => setEditForm((p) => ({ ...p, city: e.target.value }))}
                  placeholder="City"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">State/Province</label>
                <Input
                  value={editForm.state}
                  onChange={(e) => setEditForm((p) => ({ ...p, state: e.target.value }))}
                  placeholder="State"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Country</label>
                <Input
                  value={editForm.country}
                  onChange={(e) => setEditForm((p) => ({ ...p, country: e.target.value }))}
                  placeholder="Country"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Postal Code</label>
                <Input
                  value={editForm.postalCode}
                  onChange={(e) => setEditForm((p) => ({ ...p, postalCode: e.target.value }))}
                  placeholder="Postal code"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  className="min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={editForm.notes}
                  onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Optional notes about this customer..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditMode(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
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

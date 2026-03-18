import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../features/auth/auth-context";
import { Card, CardContent } from "../components/ui/card";
import Button from "../components/ui/button";
import Dialog from "../components/ui/dialog";
import { ArrowLeft, Calendar, CreditCard, Download, FileText, Mail, Pencil, Receipt, Send, User, Wallet, XCircle } from "lucide-react";
import Money from "../components/common/money";
import ActionsMenu from "../components/common/ActionsMenu";
import StatusBadge from "../components/common/StatusBadge";
import { getAccessToken } from "../features/auth/token-store";

function fmtDate(v) {
  if (!v) return "—";
  try {
    return String(v).slice(0, 10);
  } catch {
    return "—";
  }
}

function initialsFrom(text) {
  const t = String(text || "I");
  return t
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}


export default function InvoiceDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [invoice, setInvoice] = useState(null);
  const [companySettings, setCompanySettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);

  const [creditOpen, setCreditOpen] = useState(false);
  const [creditForm, setCreditForm] = useState({ amount: "", notes: "" });
  const [creditSubmitting, setCreditSubmitting] = useState(false);
  const [creditError, setCreditError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setError(null);
    api
      .getInvoice(id)
      .then((res) => {
        if (!mounted) return;
        setInvoice(res);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message ? String(e.message) : "Failed to load invoice");
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
    const wantsCredit = searchParams.get("credit") === "1";
    if (wantsCredit) {
      navigate(`/invoices/${id}/credit-note`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, id]);

  useEffect(() => {
    let mounted = true;
    api
      .getCompanySettings()
      .then((data) => {
        if (mounted && data) setCompanySettings(data);
      })
      .catch(() => {
        if (mounted) setCompanySettings(null);
      });
    return () => { mounted = false; };
  }, []);

  const title = useMemo(() => {
    const n = invoice?.invoiceNumber ? String(invoice.invoiceNumber) : "Invoice";
    return n;
  }, [invoice]);

  const status = useMemo(() => String(invoice?.status || "—"), [invoice]);

  const clientName = useMemo(() => {
    const c = invoice?.client;
    if (!c) return "—";
    return c.companyName ? String(c.companyName) : String(c.contactName || "—");
  }, [invoice]);

  const companyName = useMemo(() => String(user?.companyName || "").trim() || "Company", [user]);

  const companyAddress = useMemo(() => {
    const s = companySettings || {};
    const parts = [s.addressLine, s.city, s.country].filter(Boolean);
    return parts.join(", ") || null;
  }, [companySettings]);

  async function openPdf() {
    if (!invoice?.id) return;
    try {
      setError(null);
      const token = getAccessToken();
      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const res = await fetch(`/api/invoices/${invoice.id}/pdf?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/pdf",
        },
      });
      const contentType = res.headers.get("content-type") || "";

      if (res.status === 401) {
        throw new Error("Your session has expired. Please log in again.");
      }

      if (!res.ok || !contentType.includes("application/pdf")) {
        let detail = "";
        try {
          const text = await res.text();
          if (text) {
            try {
              const asJson = JSON.parse(text);
              detail = asJson?.message ? String(asJson.message) : text;
              if (asJson?.requestId) detail = `${detail} (Request ID: ${asJson.requestId})`;
            } catch {
              detail = text;
            }
          }
        } catch {
          // ignore
        }

        const showStatus = res.status !== 204;
        const meta = showStatus ? `Status ${res.status}${contentType ? `, Content-Type: ${contentType}` : ""}` : "";
        throw new Error(detail ? `${detail}${meta ? ` — ${meta}` : ""}` : `Could not load PDF.${meta ? ` ${meta}` : ""}`);
      }
      const buf = await res.arrayBuffer();
      const pdfBlob = new Blob([buf], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);
      if (pdfPreviewUrl) window.URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(url);
    } catch {
      // PDF load error – hidden for now
    }
  }

  async function sendInvoice() {
    if (!invoice?.id) return;
    try {
      setError(null);
      const token = getAccessToken();
      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const res = await fetch(`/api/invoices/${invoice.id}/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        throw new Error("Your session has expired. Please log in again.");
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to send invoice");
      }
      const updated = await api.getInvoice(invoice.id);
      setInvoice(updated);
    } catch (e) {
      setError(e?.message ? String(e.message) : "Could not send invoice");
    }
  }

  async function cancelInvoice() {
    if (!invoice?.id) return;
    try {
      setError(null);
      const token = getAccessToken();
      if (!token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const res = await fetch(`/api/invoices/${invoice.id}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        throw new Error("Your session has expired. Please log in again.");
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to cancel invoice");
      }
      const updated = await api.getInvoice(invoice.id);
      setInvoice(updated);
    } catch (e) {
      setError(e?.message ? String(e.message) : "Could not cancel invoice");
    }
  }

  const canEdit = String(invoice?.status || "").toUpperCase() !== "SENT";
  const canSend = String(invoice?.status || "").toUpperCase() === "DRAFT";
  const canCancel = String(invoice?.status || "").toUpperCase() === "DRAFT";
  const canCredit =
    !["DRAFT", "CANCELLED"].includes(String(invoice?.status || "").toUpperCase()) &&
    Number(invoice?.balanceDue || 0) > 0;

  useEffect(() => {
    if (!creditOpen) return;
    if (!invoice) return;
    if (canCredit) return;
    setCreditError("This invoice has no outstanding balance to credit.");
  }, [creditOpen, invoice, canCredit]);

  async function submitCredit() {
    if (!invoice?.id) {
      setCreditError("Invoice is still loading. Please wait and try again.");
      return;
    }
    if (!canCredit) {
      setCreditError("This invoice has no outstanding balance to credit.");
      return;
    }
    const raw = String(creditForm.amount || "").trim();
    const amt = Number(raw);
    if (!Number.isFinite(amt) || amt <= 0) {
      setCreditError("Credit amount must be greater than 0.");
      return;
    }

    const max = Number(invoice.balanceDue || 0);
    if (Number.isFinite(max) && max > 0 && amt > max) {
      setCreditError(`Credit amount cannot exceed the outstanding balance (${max}).`);
      return;
    }

    setCreditSubmitting(true);
    setCreditError(null);
    try {
      await api.createPayment({
        invoiceId: invoice.id,
        clientId: invoice.clientId,
        amount: String(amt),
        method: "CREDIT_NOTE",
        transactionId: null,
        notes: creditForm.notes || null,
      });

      const updated = await api.getInvoice(invoice.id);
      setInvoice(updated);

      setCreditOpen(false);
      setCreditForm({ amount: "", notes: "" });
      setSearchParams((p) => {
        const next = new URLSearchParams(p);
        next.delete("credit");
        return next;
      }, { replace: true });
    } catch (e) {
      setCreditError(e?.message ? String(e.message) : "Failed to apply credit");
    } finally {
      setCreditSubmitting(false);
    }
  }

  const statusColor = (() => {
    const s = String(status).toUpperCase();
    if (s === "PAID") return { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" };
    if (s === "SENT") return { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" };
    if (s === "OVERDUE") return { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" };
    if (s === "CANCELLED") return { bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" };
    if (s === "PARTIALLY_PAID") return { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" };
    return { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" };
  })();

  const paidAmount = Number((invoice?.totalAmount || 0) - (invoice?.balanceDue || 0));
  const progressPct = Number(invoice?.totalAmount) > 0 ? Math.min(100, Math.round((paidAmount / Number(invoice.totalAmount)) * 100)) : 0;

  return (
    <div className="space-y-5 min-h-screen">
      {/* Top bar: breadcrumb + title + actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => navigate("/invoices")}
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold text-slate-900 truncate">{title}</h1>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusColor.bg} ${statusColor.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${statusColor.dot}`} />
                {status}
              </span>
            </div>
            <p className="text-[13px] text-slate-500 truncate">{clientName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" className="h-9 gap-1.5 text-[13px]" onClick={openPdf}>
            <Download className="h-3.5 w-3.5" />
            PDF
          </Button>
          {canSend && (
            <Button variant="outline" className="h-9 gap-1.5 text-[13px]" onClick={sendInvoice}>
              <Send className="h-3.5 w-3.5" />
              Send
            </Button>
          )}
          {canEdit && (
            <Button variant="outline" className="h-9 gap-1.5 text-[13px]" onClick={() => navigate(`/invoices/${invoice.id}/edit`)}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          )}
          <ActionsMenu
            ariaLabel="Invoice actions"
            buttonClassName="h-9 w-9"
            menuWidthClassName="w-52"
            items={[
              { key: "payment", label: "Record Payment", onSelect: () => navigate(`/payments?invoiceId=${invoice.id}&clientId=${invoice.clientId || ""}&new=1`) },
              { key: "credit", label: "Credit Invoice", onSelect: () => navigate(`/invoices/${invoice.id}/credit-note`) },
              { key: "cancel", label: "Cancel Invoice", tone: "danger", disabled: !canCancel, onSelect: cancelInvoice },
            ]}
          />
        </div>
      </div>

      {loading ? <div className="py-12 text-center text-sm text-slate-500">Loading\u2026</div> : null}
      {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div> : null}
      {!loading && !error && !invoice ? <div className="py-12 text-center text-sm text-slate-500">Invoice not found.</div> : null}

      {!loading && !error && invoice ? (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
          {/* LEFT COLUMN: Invoice Document */}
          <Card className="overflow-hidden shadow-sm border-slate-200/80 bg-white">
            <CardContent className="p-0">
              {/* Company header */}
              <div className="px-8 pt-8 pb-6 border-b border-slate-100">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src="/bretune-logo.png" alt="" className="h-12 w-12 rounded-xl object-contain bg-slate-50 border border-slate-100" />
                    <div>
                      <div className="text-base font-bold text-slate-900">{companyName}</div>
                      {companyAddress ? (
                        <div className="text-[13px] text-slate-500 mt-0.5 leading-relaxed">
                          {companyAddress.split(/,\s*/).map((p, i, arr) => (
                            <React.Fragment key={i}>{p}{i < arr.length - 1 ? ", " : ""}</React.Fragment>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-extrabold text-violet-600 uppercase tracking-wider">Invoice</div>
                    <div className="text-sm text-slate-500 mt-1 font-mono">{invoice.invoiceNumber || "\u2014"}</div>
                  </div>
                </div>
              </div>

              {/* Bill To + Invoice meta */}
              <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-100">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Bill To</div>
                  <div className="text-sm font-semibold text-slate-900">{clientName}</div>
                  {[invoice?.client?.address, invoice?.client?.city, invoice?.client?.country].filter(Boolean).map((p, i) => (
                    <div key={i} className="text-[13px] text-slate-600 mt-0.5">{p}</div>
                  ))}
                  {invoice?.client?.email ? <div className="text-[13px] text-slate-500 mt-1">{invoice.client.email}</div> : null}
                  {invoice?.client?.contactName && invoice?.client?.contactName !== clientName ? <div className="text-[13px] text-slate-500 mt-0.5">Attn: {invoice.client.contactName}</div> : null}
                </div>
                <div className="md:text-right">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Invoice Details</div>
                  <dl className="inline-grid grid-cols-[auto_auto] gap-x-4 gap-y-1.5 text-[13px] md:ml-auto">
                    <dt className="text-slate-500">Invoice #</dt>
                    <dd className="font-medium text-slate-800 text-right">{invoice.invoiceNumber || "\u2014"}</dd>
                    <dt className="text-slate-500">Issue Date</dt>
                    <dd className="font-medium text-slate-800 text-right">{fmtDate(invoice.issueDate)}</dd>
                    <dt className="text-slate-500">Due Date</dt>
                    <dd className="font-medium text-slate-800 text-right">{fmtDate(invoice.dueDate)}</dd>
                    <dt className="text-slate-500">Terms</dt>
                    <dd className="font-medium text-slate-800 text-right">{invoice?.client?.paymentTermsDays ? `Net ${invoice.client.paymentTermsDays}` : "On receipt"}</dd>
                  </dl>
                </div>
              </div>

              {/* Line items */}
              <div className="px-8 py-6">
                <table className="min-w-full text-[13px]">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="pb-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider w-[100px]">Item</th>
                      <th className="pb-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Description</th>
                      <th className="pb-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Price</th>
                      <th className="pb-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">VAT</th>
                      <th className="pb-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Qty</th>
                      <th className="pb-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(invoice.items || []).map((it, idx) => (
                      <tr key={it.id} className={idx > 0 ? "border-t border-slate-100" : ""}>
                        <td className="py-3 text-slate-500 whitespace-nowrap font-mono text-xs">
                          {(() => {
                            const sku = it.product?.sku?.trim();
                            const desc = String(it.description || it.product?.name || it.productName || "\u2014");
                            return (sku && sku.length <= 12 && !/^[a-z]{7,}$/.test(sku) ? sku : desc.slice(0, 10).trim()) || "\u2014";
                          })()}
                        </td>
                        <td className="py-3 text-slate-800">{it.description || it.product?.name || it.productName || "\u2014"}</td>
                        <td className="py-3 text-right tabular-nums text-slate-700"><Money value={Number(it.unitPrice || 0)} /></td>
                        <td className="py-3 text-right tabular-nums text-slate-500">{Math.round((Number(it.taxRate || 0) * 100))}%</td>
                        <td className="py-3 text-right tabular-nums text-slate-700">{String(it.quantity)}</td>
                        <td className="py-3 text-right tabular-nums font-semibold text-slate-900"><Money value={Number(it.total || 0)} /></td>
                      </tr>
                    ))}
                    {(invoice.items || []).length === 0 ? (
                      <tr><td className="py-10 text-slate-400 text-center text-sm" colSpan={6}>No line items</td></tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="px-8 pb-6 flex justify-end">
                <div className="w-72 space-y-1.5 text-[13px]">
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="text-slate-800 font-medium tabular-nums"><Money value={Number(invoice.subtotal || 0)} /></span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">VAT</span>
                    <span className="text-slate-800 font-medium tabular-nums"><Money value={Number(invoice.taxAmount || 0)} /></span>
                  </div>
                  <div className="flex justify-between py-2.5 border-t-2 border-slate-900">
                    <span className="text-[15px] font-bold text-slate-900">Total</span>
                    <span className="text-[15px] font-bold text-slate-900 tabular-nums"><Money value={Number(invoice.totalAmount || 0)} /></span>
                  </div>
                  {Number(invoice.balanceDue || 0) > 0 && Number(invoice.balanceDue) !== Number(invoice.totalAmount) ? (
                    <div className="flex justify-between py-2 px-3 rounded-lg bg-rose-50 border border-rose-200">
                      <span className="text-[13px] text-rose-700 font-semibold">Balance Due</span>
                      <span className="text-[13px] text-rose-700 font-bold tabular-nums"><Money value={Number(invoice.balanceDue || 0)} /></span>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Banking Details */}
              {(companySettings?.bankName || companySettings?.accountNumber || companySettings?.accountName) ? (
                <div className="mx-8 mb-6 rounded-xl bg-slate-900 p-5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Banking Details</div>
                  <div className="grid grid-cols-2 gap-3 text-[13px]">
                    {companySettings?.bankName ? <div><span className="text-slate-500">Bank</span><div className="text-white font-medium mt-0.5">{companySettings.bankName}</div></div> : null}
                    {companySettings?.accountName ? <div><span className="text-slate-500">Account Holder</span><div className="text-white font-medium mt-0.5">{companySettings.accountName}</div></div> : null}
                    {companySettings?.accountNumber ? <div><span className="text-slate-500">Account Number</span><div className="text-white font-mono font-medium mt-0.5">{companySettings.accountNumber}</div></div> : null}
                    {companySettings?.branchCode ? <div><span className="text-slate-500">Branch Code</span><div className="text-white font-mono font-medium mt-0.5">{companySettings.branchCode}</div></div> : null}
                  </div>
                </div>
              ) : null}

              {invoice.notes ? (
                <div className="px-8 pb-6">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Notes</div>
                  <div className="text-[13px] text-slate-600 whitespace-pre-wrap">{invoice.notes}</div>
                </div>
              ) : null}

              <div className="text-xs text-slate-400 text-center py-4 border-t border-slate-100">Thank you for your business</div>
            </CardContent>
          </Card>

          {/* RIGHT COLUMN: Sidebar info cards */}
          <div className="space-y-4">
            {/* Payment Summary */}
            <Card className="border-slate-200/80 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="px-5 py-4 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Wallet className="h-4 w-4 text-violet-500" />
                    Payment Summary
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">Total Amount</span>
                    <span className="text-[15px] font-bold tabular-nums text-slate-900"><Money value={Number(invoice.totalAmount || 0)} /></span>
                  </div>
                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-slate-400">{progressPct}% paid</span>
                      <span className="text-xs text-slate-400 tabular-nums"><Money value={paidAmount} /> / <Money value={Number(invoice.totalAmount || 0)} /></span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-400 transition-all duration-500" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3">
                      <div className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider">Paid</div>
                      <div className="mt-1 text-base font-bold tabular-nums text-emerald-700"><Money value={paidAmount} /></div>
                    </div>
                    <div className="rounded-lg bg-rose-50 border border-rose-100 p-3">
                      <div className="text-[11px] font-medium text-rose-600 uppercase tracking-wider">Due</div>
                      <div className="mt-1 text-base font-bold tabular-nums text-rose-700"><Money value={Number(invoice.balanceDue || 0)} /></div>
                    </div>
                  </div>
                  {Number(invoice.balanceDue || 0) > 0 ? (
                    <Button className="w-full h-9 gap-1.5 bg-violet-600 hover:bg-violet-700 text-[13px]" onClick={() => navigate(`/payments?invoiceId=${invoice.id}&clientId=${invoice.clientId || ""}&new=1`)}>
                      <CreditCard className="h-3.5 w-3.5" />
                      Record Payment
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {/* Invoice Details */}
            <Card className="border-slate-200/80 shadow-sm">
              <CardContent className="p-0">
                <div className="px-5 py-4 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <FileText className="h-4 w-4 text-violet-500" />
                    Invoice Details
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0"><Receipt className="h-4 w-4 text-violet-500" /></div>
                    <div><div className="text-[11px] text-slate-400 font-medium">Invoice Number</div><div className="text-[13px] font-semibold text-slate-900">{invoice.invoiceNumber || "\u2014"}</div></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0"><Calendar className="h-4 w-4 text-blue-500" /></div>
                    <div><div className="text-[11px] text-slate-400 font-medium">Issue Date</div><div className="text-[13px] font-semibold text-slate-900">{fmtDate(invoice.issueDate)}</div></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0"><Calendar className="h-4 w-4 text-amber-500" /></div>
                    <div><div className="text-[11px] text-slate-400 font-medium">Due Date</div><div className="text-[13px] font-semibold text-slate-900">{fmtDate(invoice.dueDate)}</div></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg ${statusColor.bg} flex items-center justify-center shrink-0`}><FileText className={`h-4 w-4 ${statusColor.text}`} /></div>
                    <div><div className="text-[11px] text-slate-400 font-medium">Status</div><div className={`text-[13px] font-semibold ${statusColor.text}`}>{status}</div></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card className="border-slate-200/80 shadow-sm">
              <CardContent className="p-0">
                <div className="px-5 py-4 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <User className="h-4 w-4 text-violet-500" />
                      Customer
                    </div>
                    {invoice?.clientId ? (
                      <button type="button" onClick={() => navigate(`/customers/${invoice.clientId}`)} className="text-[12px] font-medium text-violet-600 hover:text-violet-700 transition-colors">
                        View profile
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-sm font-bold shrink-0">
                      {initialsFrom(clientName)}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-slate-900">{clientName}</div>
                      {invoice?.client?.email ? <div className="text-[12px] text-slate-500">{invoice.client.email}</div> : null}
                    </div>
                  </div>
                  {invoice?.client?.phone ? (
                    <div className="flex items-center gap-2 text-[13px] text-slate-600 mt-2">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {invoice.client.phone}
                    </div>
                  ) : null}
                  {[invoice?.client?.address, invoice?.client?.city, invoice?.client?.country].filter(Boolean).length > 0 ? (
                    <div className="text-[13px] text-slate-500 mt-2">
                      {[invoice?.client?.address, invoice?.client?.city, invoice?.client?.country].filter(Boolean).join(", ")}
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-slate-200/80 shadow-sm">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-9 gap-1.5 text-[12px] justify-center" onClick={openPdf}>
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                  <Button variant="outline" className="h-9 gap-1.5 text-[12px] justify-center" onClick={() => navigate(`/invoices/${invoice.id}/credit-note`)}>
                    <CreditCard className="h-3.5 w-3.5" />
                    Credit Note
                  </Button>
                  {canSend ? (
                    <Button variant="outline" className="h-9 gap-1.5 text-[12px] justify-center col-span-2" onClick={sendInvoice}>
                      <Send className="h-3.5 w-3.5" />
                      Send Invoice
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}

      <Dialog
        open={Boolean(pdfPreviewUrl)}
        onOpenChange={(o) => {
          if (!o && pdfPreviewUrl) {
            window.URL.revokeObjectURL(pdfPreviewUrl);
            setPdfPreviewUrl(null);
          }
        }}
        title="Invoice PDF"
      >
        {pdfPreviewUrl ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm text-[#6B7280]">{invoice?.invoiceNumber ? `Invoice ${invoice.invoiceNumber}` : "Invoice"}</div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const opened = window.open(pdfPreviewUrl, "_blank");
                    if (!opened) setError("Please allow pop-ups to open the invoice in a new tab.");
                  }}
                >
                  Open in new tab
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (pdfPreviewUrl) window.URL.revokeObjectURL(pdfPreviewUrl);
                    setPdfPreviewUrl(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>

            <iframe title="Invoice PDF Preview" src={pdfPreviewUrl} className="w-full h-[70vh] rounded-md border border-[#E5E7EB]" />
          </div>
        ) : (
          <div className="text-sm text-[#6B7280]">Preparing preview…</div>
        )}
      </Dialog>

      <Dialog
        open={creditOpen}
        onOpenChange={(o) => {
          if (o) setCreditError(null);
          setCreditOpen(o);
          if (!o) {
            setCreditError(null);
            setSearchParams((p) => {
              const next = new URLSearchParams(p);
              next.delete("credit");
              return next;
            }, { replace: true });
          }
        }}
        title="Credit invoice"
      >
        <div className="space-y-3">
          <div className="text-sm text-slate-600">
            This will apply a credit note to the invoice. Credits reduce the invoice balance but are not counted as cash received.
          </div>

          {creditError ? (
            <div className="text-sm text-red-600">{creditError}</div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">Amount</label>
              <input
                value={creditForm.amount}
                onChange={(e) => setCreditForm((p) => ({ ...p, amount: e.target.value }))}
                placeholder="0.00"
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                inputMode="decimal"
              />
              <div className="text-xs text-slate-500">Outstanding balance: {invoice ? <Money value={Number(invoice.balanceDue || 0)} /> : "—"}</div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">Reference / Notes</label>
              <input
                value={creditForm.notes}
                onChange={(e) => setCreditForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Reason for credit"
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setCreditOpen(false)} disabled={creditSubmitting}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={submitCredit}
              disabled={creditSubmitting || !invoice?.id || !canCredit}
            >
              {creditSubmitting ? "Applying…" : "Apply credit"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

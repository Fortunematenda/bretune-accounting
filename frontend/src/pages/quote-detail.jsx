import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../features/auth/auth-context";
import { Card, CardContent } from "../components/ui/card";
import Button from "../components/ui/button";
import Dialog from "../components/ui/dialog";
import { ArrowLeft, Calendar, CreditCard, Download, FileText, Pencil, Receipt, Send, User, Wallet } from "lucide-react";
import Money from "../components/common/money";
import ActionsMenu from "../components/common/ActionsMenu";
import StatusBadge from "../components/common/StatusBadge";
import QuoteForm from "../components/quotes/QuoteForm";
import { getAccessToken } from "../features/auth/token-store";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

function fmtDate(v) {
  if (!v) return "—";
  try {
    return String(v).slice(0, 10);
  } catch {
    return "—";
  }
}

function initialsFrom(text) {
  const t = String(text || "Q");
  return t
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}


export default function QuoteDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [quote, setQuote] = useState(null);
  const [companySettings, setCompanySettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [convertResult, setConvertResult] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState(null);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setError(null);
    api
      .getQuote(id)
      .then((res) => {
        if (!mounted) return;
        setQuote(res);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message ? String(e.message) : "Failed to load quote");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => { mounted = false; };
  }, [id]);

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

  useEffect(() => {
    if (editOpen) {
      api.listClients({ page: 1, limit: 200 }).then((r) => setClients(r.data || [])).catch(() => setClients([]));
      api.listProducts({ page: 1, limit: 200 }).then((r) => setProducts(r.data || [])).catch(() => setProducts([]));
    }
  }, [editOpen]);

  const title = useMemo(() => (quote?.quoteNumber ? String(quote.quoteNumber) : "Quote"), [quote]);

  const clientName = useMemo(() => {
    const c = quote?.client;
    if (!c) return "—";
    return c.companyName ? String(c.companyName) : String(c.contactName || "—");
  }, [quote]);

  const companyName = useMemo(() => String(user?.companyName || "").trim() || "Company", [user]);

  const companyAddress = useMemo(() => {
    const s = companySettings || {};
    const parts = [s.addressLine, s.city, s.country].filter(Boolean);
    return parts.join(", ") || null;
  }, [companySettings]);

  const canEdit = true;
  const canSend = String(quote?.status || "").toUpperCase() === "DRAFT";
  const canAccept = String(quote?.status || "").toUpperCase() === "SENT";
  const canReject = String(quote?.status || "").toUpperCase() === "SENT";
  const isConverted = Boolean(quote?.invoice?.id);
  const canConvert = String(quote?.status || "").toUpperCase() === "ACCEPTED" && !isConverted;

  async function refresh() {
    if (!quote?.id) return;
    const updated = await api.getQuote(quote.id);
    setQuote(updated);
  }

  async function downloadPdf() {
    if (!quote?.id) return;
    setActionLoading("pdf");
    setError(null);
    try {
      const token = getAccessToken();
      if (!token) throw new Error("Your session has expired. Please log in again.");
      const res = await fetch(`${API_BASE}/quotes/${quote.id}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/pdf",
        },
      });
      if (res.status === 401) throw new Error("Your session has expired. Please log in again.");
      if (!res.ok) {
        const text = await res.text();
        let msg = text;
        try {
          const j = JSON.parse(text);
          msg = j?.message || text;
        } catch {}
        throw new Error(msg || "Could not download quote PDF");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (e) {
      setError(e?.message ? String(e.message) : "Could not download quote PDF");
    } finally {
      setActionLoading(null);
    }
  }

  async function sendQuote() {
    if (!quote?.id) return;
    setActionLoading("send");
    setError(null);
    try {
      await api.sendQuote(quote.id);
      await refresh();
    } catch (e) {
      setError(e?.message ? String(e.message) : "Could not send quote");
    } finally {
      setActionLoading(null);
    }
  }

  async function acceptQuote() {
    if (!quote?.id) return;
    setActionLoading("accept");
    setError(null);
    try {
      await api.acceptQuote(quote.id);
      await refresh();
    } catch (e) {
      setError(e?.message ? String(e.message) : "Could not accept quote");
    } finally {
      setActionLoading(null);
    }
  }

  async function rejectQuote() {
    if (!quote?.id) return;
    setActionLoading("reject");
    setError(null);
    try {
      await api.rejectQuote(quote.id);
      await refresh();
    } catch (e) {
      setError(e?.message ? String(e.message) : "Could not reject quote");
    } finally {
      setActionLoading(null);
    }
  }

  async function convertToInvoice() {
    if (!quote?.id) return;
    setActionLoading("convert");
    setError(null);
    try {
      const res = await api.convertQuoteToInvoice(quote.id);
      const inv = res?.data ?? res;
      setConvertResult(inv);
      await refresh();
    } catch (e) {
      setError(e?.message ? String(e.message) : "Could not convert quote");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSaveEdit(payload) {
    if (!quote?.id) return;
    setEditSaving(true);
    setEditError(null);
    try {
      await api.updateQuote(quote.id, payload);
      await refresh();
      setEditOpen(false);
    } catch (e) {
      setEditError(e?.message ? String(e.message) : "Could not update quote");
    } finally {
      setEditSaving(false);
    }
  }

  const statusColor = (() => {
    const s = String(quote?.status || "").toUpperCase();
    if (s === "ACCEPTED") return { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" };
    if (s === "SENT") return { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" };
    if (s === "REJECTED") return { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-500" };
    if (s === "EXPIRED") return { bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" };
    return { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" };
  })();

  return (
    <div className="space-y-5 min-h-screen">
      {/* Top bar: breadcrumb + title + actions */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => navigate("/quotes")}
            className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h1 className="text-lg font-bold text-slate-900 truncate">{title}</h1>
              {quote ? (
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusColor.bg} ${statusColor.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${statusColor.dot}`} />
                  {quote.status}
                </span>
              ) : null}
            </div>
            {quote ? <p className="text-[13px] text-slate-500 truncate">{clientName}</p> : null}
          </div>
        </div>
        {quote ? (
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" className="h-9 gap-1.5 text-[13px]" onClick={downloadPdf}>
              <Download className="h-3.5 w-3.5" />
              PDF
            </Button>
            {canSend && (
              <Button variant="outline" className="h-9 gap-1.5 text-[13px]" onClick={sendQuote}>
                <Send className="h-3.5 w-3.5" />
                Send
              </Button>
            )}
            {canEdit && (
              <Button variant="outline" className="h-9 gap-1.5 text-[13px]" onClick={() => setEditOpen(true)}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
            )}
            <ActionsMenu
              ariaLabel="Quote actions"
              buttonClassName="h-9 w-9"
              menuWidthClassName="w-52"
              items={[
                { key: "accept", label: "Accept", disabled: !canAccept, onSelect: acceptQuote },
                { key: "reject", label: "Reject", disabled: !canReject, onSelect: rejectQuote },
                { key: "convert", label: isConverted ? "Already Converted" : "Convert to Invoice", disabled: !canConvert, onSelect: convertToInvoice },
                isConverted && quote?.invoice?.id && { key: "view-invoice", label: "View Invoice", onSelect: () => navigate(`/invoices/${quote.invoice.id}`) },
              ].filter(Boolean)}
            />
          </div>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
      ) : null}

      {loading ? (
        <div className="py-12 text-center text-sm text-slate-500">Loading\u2026</div>
      ) : !quote ? (
        <div className="py-12 text-center text-sm text-slate-500">Quote not found.</div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
          {/* LEFT COLUMN: Quote Document */}
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
                    <div className="text-2xl font-extrabold text-violet-600 uppercase tracking-wider">Quote</div>
                    <div className="text-sm text-slate-500 mt-1 font-mono">{quote.quoteNumber || "\u2014"}</div>
                  </div>
                </div>
              </div>

              {/* Quote For + Quote meta */}
              <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-slate-100">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Quote For</div>
                  <div className="text-sm font-semibold text-slate-900">{clientName}</div>
                  {[quote?.client?.address, quote?.client?.city, quote?.client?.country].filter(Boolean).map((p, i) => (
                    <div key={i} className="text-[13px] text-slate-600 mt-0.5">{p}</div>
                  ))}
                  {quote?.client?.email ? <div className="text-[13px] text-slate-500 mt-1">{quote.client.email}</div> : null}
                  {quote?.client?.phone ? <div className="text-[13px] text-slate-500 mt-0.5">{quote.client.phone}</div> : null}
                </div>
                <div className="md:text-right">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Quote Details</div>
                  <dl className="inline-grid grid-cols-[auto_auto] gap-x-4 gap-y-1.5 text-[13px] md:ml-auto">
                    <dt className="text-slate-500">Quote #</dt>
                    <dd className="font-medium text-slate-800 text-right">{quote.quoteNumber || "\u2014"}</dd>
                    <dt className="text-slate-500">Issue Date</dt>
                    <dd className="font-medium text-slate-800 text-right">{fmtDate(quote.issueDate)}</dd>
                    <dt className="text-slate-500">Valid Until</dt>
                    <dd className="font-medium text-slate-800 text-right">{fmtDate(quote.expiryDate)}</dd>
                  </dl>
                </div>
              </div>

              {/* Line items */}
              <div className="px-8 py-6">
                <table className="min-w-full text-[13px]">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="pb-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Description</th>
                      <th className="pb-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Qty</th>
                      <th className="pb-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Price</th>
                      <th className="pb-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Discount</th>
                      <th className="pb-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">VAT</th>
                      <th className="pb-3 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(quote.items || []).map((it, idx) => (
                      <tr key={it.id} className={idx > 0 ? "border-t border-slate-100" : ""}>
                        <td className="py-3 text-slate-800">{it.description || it.productName || "\u2014"}</td>
                        <td className="py-3 text-right tabular-nums text-slate-700">{String(it.quantity)}</td>
                        <td className="py-3 text-right tabular-nums text-slate-700"><Money value={Number(it.unitPrice || 0)} /></td>
                        <td className="py-3 text-right tabular-nums text-slate-500"><Money value={Number(it.discount || 0)} /></td>
                        <td className="py-3 text-right tabular-nums text-slate-500">{Math.round((Number(it.taxRate || 0) * 100))}%</td>
                        <td className="py-3 text-right tabular-nums font-semibold text-slate-900"><Money value={Number(it.total || 0)} /></td>
                      </tr>
                    ))}
                    {(quote.items || []).length === 0 ? (
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
                    <span className="text-slate-800 font-medium tabular-nums"><Money value={Number(quote.subtotal || 0)} /></span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">VAT</span>
                    <span className="text-slate-800 font-medium tabular-nums"><Money value={Number(quote.taxAmount || 0)} /></span>
                  </div>
                  <div className="flex justify-between py-2.5 border-t-2 border-slate-900">
                    <span className="text-[15px] font-bold text-slate-900">Total</span>
                    <span className="text-[15px] font-bold text-slate-900 tabular-nums"><Money value={Number(quote.totalAmount || 0)} /></span>
                  </div>
                </div>
              </div>

              {/* Notes / Scope of Work */}
              {quote.notes ? (
                <div className="px-8 pb-6">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Notes / Scope of Work</div>
                  <div className="text-[13px] text-slate-600 whitespace-pre-wrap">{quote.notes}</div>
                </div>
              ) : null}

              {/* Terms & Conditions */}
              <div className="px-8 pb-6">
                <div className="rounded-lg border border-slate-200/60 bg-slate-50/50 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Terms & Conditions</div>
                  <div className="text-[13px] text-slate-500">
                    This quote is valid until {fmtDate(quote.expiryDate)}. Payment terms as agreed. Please contact us with any questions.
                  </div>
                </div>
              </div>

              {/* Acceptance Area */}
              <div className="px-8 pb-6">
                <div className="rounded-lg border border-slate-200/60 bg-white p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Acceptance</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <div className="text-xs font-medium text-slate-400 mb-1">Accepted By</div>
                      <div className="h-8 border-b border-slate-300" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-400 mb-1">Signature</div>
                      <div className="h-8 border-b border-slate-300" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-400 mb-1">Date</div>
                      <div className="h-8 border-b border-slate-300" />
                    </div>
                  </div>
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

              <div className="text-xs text-slate-400 text-center py-4 border-t border-slate-100">Thank you for your business</div>
            </CardContent>
          </Card>

          {/* RIGHT COLUMN: Sidebar info cards */}
          <div className="space-y-4">
            {/* Quote Summary */}
            <Card className="border-slate-200/80 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="px-5 py-4 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Wallet className="h-4 w-4 text-violet-500" />
                    Quote Summary
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">Total Amount</span>
                    <span className="text-[15px] font-bold tabular-nums text-slate-900"><Money value={Number(quote.totalAmount || 0)} /></span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-violet-50 border border-violet-100 p-3">
                      <div className="text-[11px] font-medium text-violet-600 uppercase tracking-wider">Subtotal</div>
                      <div className="mt-1 text-base font-bold tabular-nums text-violet-700"><Money value={Number(quote.subtotal || 0)} /></div>
                    </div>
                    <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                      <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">VAT</div>
                      <div className="mt-1 text-base font-bold tabular-nums text-slate-700"><Money value={Number(quote.taxAmount || 0)} /></div>
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
                    <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Line Items</div>
                    <div className="mt-1 text-lg font-bold text-slate-900">{(quote.items || []).length}</div>
                  </div>
                  {canConvert ? (
                    <Button className="w-full h-9 gap-1.5 bg-violet-600 hover:bg-violet-700 text-[13px]" onClick={convertToInvoice}>
                      <Receipt className="h-3.5 w-3.5" />
                      Convert to Invoice
                    </Button>
                  ) : null}
                  {isConverted && quote?.invoice?.id ? (
                    <Button variant="outline" className="w-full h-9 gap-1.5 text-[13px] text-violet-600 border-violet-200 hover:bg-violet-50" onClick={() => navigate(`/invoices/${quote.invoice.id}`)}>
                      <FileText className="h-3.5 w-3.5" />
                      View Invoice
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {/* Quote Details */}
            <Card className="border-slate-200/80 shadow-sm">
              <CardContent className="p-0">
                <div className="px-5 py-4 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <FileText className="h-4 w-4 text-violet-500" />
                    Quote Details
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0"><Receipt className="h-4 w-4 text-violet-500" /></div>
                    <div><div className="text-[11px] text-slate-400 font-medium">Quote Number</div><div className="text-[13px] font-semibold text-slate-900">{quote.quoteNumber || "\u2014"}</div></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0"><Calendar className="h-4 w-4 text-blue-500" /></div>
                    <div><div className="text-[11px] text-slate-400 font-medium">Issue Date</div><div className="text-[13px] font-semibold text-slate-900">{fmtDate(quote.issueDate)}</div></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0"><Calendar className="h-4 w-4 text-amber-500" /></div>
                    <div><div className="text-[11px] text-slate-400 font-medium">Valid Until</div><div className="text-[13px] font-semibold text-slate-900">{fmtDate(quote.expiryDate)}</div></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg ${statusColor.bg} flex items-center justify-center shrink-0`}><FileText className={`h-4 w-4 ${statusColor.text}`} /></div>
                    <div><div className="text-[11px] text-slate-400 font-medium">Status</div><div className={`text-[13px] font-semibold ${statusColor.text}`}>{quote.status}</div></div>
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
                    {quote?.clientId ? (
                      <button type="button" onClick={() => navigate(`/customers/${quote.clientId}`)} className="text-[12px] font-medium text-violet-600 hover:text-violet-700 transition-colors">
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
                      {quote?.client?.email ? <div className="text-[12px] text-slate-500">{quote.client.email}</div> : null}
                    </div>
                  </div>
                  {quote?.client?.phone ? (
                    <div className="text-[13px] text-slate-600 mt-2">{quote.client.phone}</div>
                  ) : null}
                  {[quote?.client?.address, quote?.client?.city, quote?.client?.country].filter(Boolean).length > 0 ? (
                    <div className="text-[13px] text-slate-500 mt-2">
                      {[quote?.client?.address, quote?.client?.city, quote?.client?.country].filter(Boolean).join(", ")}
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-slate-200/80 shadow-sm">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="h-9 gap-1.5 text-[12px] justify-center" onClick={downloadPdf}>
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                  {canSend ? (
                    <Button variant="outline" className="h-9 gap-1.5 text-[12px] justify-center" onClick={sendQuote}>
                      <Send className="h-3.5 w-3.5" />
                      Send Quote
                    </Button>
                  ) : (
                    <Button variant="outline" className="h-9 gap-1.5 text-[12px] justify-center" disabled>
                      <Send className="h-3.5 w-3.5" />
                      Send Quote
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen} title="Edit quote">
        {editOpen && quote ? (
          <div className="max-h-[85vh] overflow-y-auto">
            <QuoteForm
              clients={clients}
              products={products}
              initialQuote={quote}
              onSubmit={handleSaveEdit}
              loading={editSaving}
              serverError={editError}
              submitLabel="Save changes"
              isEdit
              onProductCreated={(p) => setProducts((prev) => [...(prev || []), p])}
            />
          </div>
        ) : null}
      </Dialog>

      <Dialog
        open={Boolean(convertResult)}
        onOpenChange={(o) => {
          if (!o) setConvertResult(null);
        }}
        title="Quote converted"
      >
        {convertResult ? (
          <div className="space-y-4">
            <p className="text-slate-600">
              Invoice{" "}
              <span className="font-semibold text-slate-900">
                {convertResult.invoiceNumber ?? convertResult.invoice?.invoiceNumber ?? "—"}
              </span>{" "}
              has been created from this quote.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConvertResult(null)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  const invId = convertResult.id ?? convertResult.invoice?.id;
                  setConvertResult(null);
                  if (invId) navigate(`/invoices/${invId}`);
                }}
              >
                Open invoice
              </Button>
            </div>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../features/auth/auth-context";
import { Card, CardContent } from "../components/ui/card";
import Button from "../components/ui/button";
import Dialog from "../components/ui/dialog";
import { ArrowLeft, Download } from "lucide-react";
import Money from "../components/common/money";
import ActionsMenu from "../components/common/ActionsMenu";
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

function StatusBadge({ status }) {
  const s = String(status || "").toUpperCase();
  const styles = {
    DRAFT: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
    SENT: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    ACCEPTED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    REJECTED: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    EXPIRED: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  };
  const c = styles[s] || styles.DRAFT;
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${c}`}>
      {s || "DRAFT"}
    </span>
  );
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

  return (
    <div className="space-y-6" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Button variant="outline" className="h-10 w-10 p-0" onClick={() => navigate("/quotes")} aria-label="Back to quotes">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <div className="text-lg sm:text-xl font-semibold text-[#111827] truncate">{title}</div>
            <div className="text-sm text-[#6B7280] truncate">{clientName}</div>
          </div>
        </div>

        {quote?.id ? (
          <ActionsMenu
            ariaLabel="Quote actions"
            buttonClassName="h-10 w-10"
            buttonIconClassName="h-5 w-5"
            menuWidthClassName="w-56"
            items={[
              { key: "pdf", label: "Download PDF", onSelect: downloadPdf },
              { key: "edit", label: "Edit quote", onSelect: () => setEditOpen(true) },
              { key: "send", label: "Send quote", disabled: !canSend, hint: !canSend ? "Only draft quotes can be sent" : "", onSelect: sendQuote },
              { key: "accept", label: "Accept", disabled: !canAccept, hint: !canAccept ? "Only sent quotes can be accepted" : "", onSelect: acceptQuote },
              { key: "reject", label: "Reject", disabled: !canReject, hint: !canReject ? "Only sent quotes can be rejected" : "", onSelect: rejectQuote },
              {
                key: "convert",
                label: isConverted ? `Converted to invoice ${quote?.invoice?.invoiceNumber ?? ""}` : "Convert to invoice",
                disabled: !canConvert,
                hint: isConverted ? "This quote has already been converted" : !canConvert ? "Only accepted quotes can be converted" : "",
                onSelect: convertToInvoice,
              },
              isConverted && quote?.invoice?.id && {
                key: "view-invoice",
                label: "View invoice",
                onSelect: () => navigate(`/invoices/${quote.invoice.id}`),
              },
            ].filter(Boolean)}
          />
        ) : null}
      </div>

      {error ? (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      {loading ? (
        <div className="space-y-4">
          <div className="h-48 rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-32 rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-64 rounded-xl bg-slate-100 animate-pulse" />
        </div>
      ) : !quote ? (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-12 text-center">
          <p className="text-[#6B7280]">Quote not found.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/quotes")}>
            Back to quotes
          </Button>
        </div>
      ) : (
        <div className="max-w-4xl">
          <Card className="overflow-hidden shadow-sm border-[#E5E7EB] rounded-xl bg-white">
            <CardContent className="p-0">
              {/* Header: Logo left | Quote details right */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 px-8 pt-8 pb-6 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-[#7C3AED] flex items-center justify-center text-white text-xl font-bold shadow-sm">
                    {initialsFrom(companyName)}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-[#111827]">{companyName}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-right">
                  <div>
                    <div className="text-xs font-medium text-[#6B7280]">Quote #</div>
                    <div className="text-sm font-semibold text-[#111827]">{quote.quoteNumber || "—"}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#6B7280]">Issue Date</div>
                    <div className="text-sm font-semibold text-[#111827]">{fmtDate(quote.issueDate)}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#6B7280]">Valid Until</div>
                    <div className="text-sm font-semibold text-[#111827]">{fmtDate(quote.expiryDate)}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#6B7280]">Status</div>
                    <div className="mt-1">
                      <StatusBadge status={quote.status} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Company block */}
              <div className="px-8 pt-6 pb-6">
                <div className="space-y-1 text-sm text-[#6B7280]">
                  {companyAddress ? <div>{companyAddress}</div> : null}
                  {companySettings?.businessPhone ? <div>Phone: {companySettings.businessPhone}</div> : null}
                  {companySettings?.businessEmail ? <div>Email: {companySettings.businessEmail}</div> : null}
                  <div>VAT: —</div>
                </div>
              </div>

              {/* Quote For – client block */}
              <div className="px-8 pb-6">
                <div className="rounded-lg border border-[#E5E7EB] bg-[#F8F9FB] p-5 shadow-sm">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Quote For</div>
                  <div className="text-sm font-semibold text-[#111827]">{clientName}</div>
                  {quote?.client?.email ? (
                    <div className="mt-1 text-sm text-[#6B7280]">{quote.client.email}</div>
                  ) : null}
                  {quote?.client?.phone ? (
                    <div className="mt-1 text-sm text-[#6B7280]">{quote.client.phone}</div>
                  ) : null}
                  {(quote?.client?.address || quote?.client?.city) ? (
                    <div className="mt-1 text-sm text-[#6B7280]">
                      {[quote.client.address, quote.client.city, quote.client.country].filter(Boolean).join(", ")}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Line items table */}
              <div className="px-8 pb-6">
                <div className="rounded-lg border border-[#E5E7EB] overflow-hidden">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-[#F8F9FB]">
                        <th className="px-5 py-4 text-left font-semibold text-[#111827]">Description</th>
                        <th className="px-5 py-4 text-right font-semibold text-[#111827] w-16">Qty</th>
                        <th className="px-5 py-4 text-right font-semibold text-[#111827] w-28">Unit Price</th>
                        <th className="px-5 py-4 text-right font-semibold text-[#111827] w-24">Discount</th>
                        <th className="px-5 py-4 text-right font-semibold text-[#111827] w-20">VAT %</th>
                        <th className="px-5 py-4 text-right font-semibold text-[#111827] w-32">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(quote.items || []).map((it, idx) => (
                        <tr key={it.id} className={idx % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}>
                          <td className="px-5 py-4 text-[#111827] border-t border-[#E5E7EB]">
                            {it.description || it.productName || "—"}
                          </td>
                          <td className="px-5 py-4 text-right text-[#6B7280] border-t border-[#E5E7EB]">
                            {String(it.quantity)}
                          </td>
                          <td className="px-5 py-4 text-right text-[#6B7280] border-t border-[#E5E7EB]">
                            <Money value={Number(it.unitPrice || 0)} />
                          </td>
                          <td className="px-5 py-4 text-right text-[#6B7280] border-t border-[#E5E7EB]">
                            <Money value={Number(it.discount || 0)} />
                          </td>
                          <td className="px-5 py-4 text-right text-[#6B7280] border-t border-[#E5E7EB]">
                            {Math.round((Number(it.taxRate || 0) * 100))}%
                          </td>
                          <td className="px-5 py-4 text-right font-medium text-[#111827] border-t border-[#E5E7EB]">
                            <Money value={Number(it.total || 0)} />
                          </td>
                        </tr>
                      ))}
                      {(quote.items || []).length === 0 ? (
                        <tr>
                          <td className="px-5 py-6 text-[#6B7280] text-center" colSpan={6}>
                            No line items.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals section */}
              <div className="px-8 pb-6">
                <div className="rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] p-6 shadow-sm max-w-sm ml-auto">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">Subtotal</span>
                      <Money value={Number(quote.subtotal || 0)} className="text-[#111827] font-medium" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280]">VAT</span>
                      <Money value={Number(quote.taxAmount || 0)} className="text-[#111827] font-medium" />
                    </div>
                    <div className="flex justify-between text-base pt-2 border-t border-[#E5E7EB]">
                      <span className="font-semibold text-[#111827]">Total</span>
                      <Money value={Number(quote.totalAmount || 0)} className="font-bold text-[#7C3AED]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes / Scope of Work */}
              {quote.notes ? (
                <div className="px-8 pb-6">
                  <div className="rounded-lg border border-[#E5E7EB] bg-white p-5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Notes / Scope of Work</div>
                    <div className="text-sm text-[#111827] whitespace-pre-wrap">{quote.notes}</div>
                  </div>
                </div>
              ) : null}

              {/* Terms & Conditions */}
              <div className="px-8 pb-6">
                <div className="rounded-lg border border-[#E5E7EB] bg-[#F8F9FB] p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Terms & Conditions</div>
                  <div className="text-sm text-[#6B7280]">
                    This quote is valid until {fmtDate(quote.expiryDate)}. Payment terms as agreed. Please contact us with any questions.
                  </div>
                </div>
              </div>

              {/* Acceptance Area */}
              <div className="px-8 pb-6">
                <div className="rounded-lg border border-[#E5E7EB] bg-white p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-4">Acceptance</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-xs font-medium text-[#6B7280] mb-1">Accepted By</div>
                      <div className="h-10 border-b border-[#E5E7EB]" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[#6B7280] mb-1">Signature</div>
                      <div className="h-10 border-b border-[#E5E7EB]" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[#6B7280] mb-1">Date</div>
                      <div className="h-10 border-b border-[#E5E7EB]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Banking Details */}
              {(companySettings?.bankName || companySettings?.accountNumber || companySettings?.accountName) ? (
                <div className="px-8 pb-6">
                  <div className="rounded-lg border border-[#E5E7EB] overflow-hidden">
                    <div className="bg-[#E5E7EB] px-4 py-2.5">
                      <div className="text-sm font-bold text-[#374151]">Banking Details</div>
                    </div>
                    <div className="bg-white p-4 space-y-2 text-sm text-[#374151]">
                      {companySettings?.bankName ? (
                        <div>Bank: {companySettings.bankName}</div>
                      ) : null}
                      {companySettings?.accountName ? (
                        <div>Account Holder: {companySettings.accountName}</div>
                      ) : null}
                      {companySettings?.accountType ? (
                        <div>Account Type: {companySettings.accountType}</div>
                      ) : null}
                      {companySettings?.accountNumber ? (
                        <div>Account Number: {companySettings.accountNumber}</div>
                      ) : null}
                      {companySettings?.branchCode ? (
                        <div>Branch Code: {companySettings.branchCode}</div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Quick actions */}
              <div className="px-8 pb-8 pt-4 border-t border-[#E5E7EB] flex flex-wrap gap-2">
                {canEdit ? (
                  <Button variant="outline" className="border-[#E5E7EB]" onClick={() => setEditOpen(true)}>
                    Edit quote
                  </Button>
                ) : null}
                <Button variant="outline" className="border-[#E5E7EB]" onClick={downloadPdf} disabled={!!actionLoading}>
                  <Download className="h-4 w-4 mr-2" />
                  {actionLoading === "pdf" ? "Downloading…" : "Download PDF"}
                </Button>
                <Button
                  className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
                  onClick={sendQuote}
                  disabled={!canSend || actionLoading}
                >
                  {actionLoading === "send" ? "Sending…" : "Send quote"}
                </Button>
                {isConverted && quote?.invoice?.id ? (
                  <Button
                    variant="outline"
                    className="border-emerald-200 text-emerald-800"
                    onClick={() => navigate(`/invoices/${quote.invoice.id}`)}
                  >
                    View invoice {quote.invoice.invoiceNumber}
                  </Button>
                ) : canConvert ? (
                  <Button variant="outline" className="border-[#E5E7EB]" onClick={convertToInvoice} disabled={actionLoading}>
                    {actionLoading === "convert" ? "Converting…" : "Convert to invoice"}
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
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
            <p className="text-[#6B7280]">
              Invoice{" "}
              <span className="font-semibold text-[#111827]">
                {convertResult.invoiceNumber ?? convertResult.invoice?.invoiceNumber ?? "—"}
              </span>{" "}
              has been created from this quote.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConvertResult(null)}>
                Close
              </Button>
              <Button
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
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

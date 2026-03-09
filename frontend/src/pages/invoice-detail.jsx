import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../features/auth/auth-context";
import { Card, CardContent } from "../components/ui/card";
import Button from "../components/ui/button";
import Dialog from "../components/ui/dialog";
import { ArrowLeft } from "lucide-react";
import Money from "../components/common/money";
import ActionsMenu from "../components/common/ActionsMenu";
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

function StatusBadge({ status }) {
  const s = String(status || "").toUpperCase();
  const styles = {
    DRAFT: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
    SENT: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    PAID: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    CANCELLED: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  const c = styles[s] || styles.DRAFT;
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${c}`}>
      {s || "DRAFT"}
    </span>
  );
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

  return (
    <div className="space-y-4" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Button variant="outline" className="h-10 w-10 p-0" onClick={() => navigate(-1)} aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="min-w-0">
            <div className="text-lg sm:text-xl font-semibold text-[#111827] truncate">{title}</div>
            <div className="text-sm text-[#6B7280] truncate">{clientName}</div>
          </div>
        </div>

        {invoice?.id ? (
          <ActionsMenu
            ariaLabel="Invoice actions"
            buttonClassName="h-10 w-10"
            buttonIconClassName="h-5 w-5"
            menuWidthClassName="w-56"
            items={[
              { key: "edit", label: "Edit", disabled: !canEdit, hint: !canEdit ? "Sent invoices cannot be edited" : "", onSelect: () => navigate(`/invoices/${invoice.id}/edit`) },
              { key: "pdf", label: "View PDF", onSelect: openPdf },
              {
                key: "send",
                label: "Send Invoice",
                disabled: !canSend,
                hint: !canSend ? "Only draft invoices can be sent" : "",
                onSelect: sendInvoice,
              },
              {
                key: "payment",
                label: "Record Payment",
                onSelect: () => navigate(`/payments?invoiceId=${invoice.id}&clientId=${invoice.clientId || ""}&new=1`),
              },
              {
                key: "credit",
                label: "Credit Invoice",
                disabled: false,
                hint: !canCredit ? "Invoice must have an outstanding balance to credit" : "",
                onSelect: () => {
                  navigate(`/invoices/${invoice.id}/credit-note`);
                },
              },
              {
                key: "cancel",
                label: "Cancel",
                tone: "danger",
                disabled: !canCancel,
                hint: !canCancel ? "Only draft invoices can be cancelled" : "",
                onSelect: cancelInvoice,
              },
            ]}
          />
        ) : null}
      </div>

      {loading ? <div className="text-sm text-[#6B7280]">Loading…</div> : null}
      {error ? <div className="text-sm text-red-600">{error}</div> : null}
      {!loading && !error && !invoice ? <div className="text-sm text-[#6B7280]">Invoice not found.</div> : null}

      {!loading && !error && invoice ? (
        <div className="max-w-4xl">
          <Card className="overflow-hidden shadow-sm border-[#E5E7EB] rounded-xl bg-white">
            <CardContent className="p-0">
              {/* Header: Logo + Company details only */}
              <div className="px-6 pt-6 pb-5 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-3">
                  <img src="/bretune-logo.png" alt="" className="h-[55px] w-[55px] rounded-lg object-contain bg-[#F8F9FB]" />
                  <div>
                    <div className="text-lg font-bold text-[#111827]">{companyName}</div>
                    {companyAddress ? (
                      <div className="text-[13px] text-[#6B7280] mt-1 leading-relaxed">
                        {companyAddress.split(/,\s*/).map((p, i, arr) => (
                          <React.Fragment key={i}>{p}{i < arr.length - 1 ? <br /> : null}</React.Fragment>
                        ))}
                      </div>
                    ) : null}
                    {companySettings?.businessPhone ? <div className="text-[13px] text-[#6B7280] mt-1">Phone: {companySettings.businessPhone}</div> : null}
                    {companySettings?.businessEmail ? <div className="text-[13px] text-[#6B7280] mt-1">Email: {companySettings.businessEmail}</div> : null}
                  </div>
                </div>
              </div>

              {/* Customer Information + Invoice Information boxes */}
              <div className="px-6 pt-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg bg-[#F8F9FB] p-[18px] space-y-1">
                  <div className="text-[13px] font-semibold uppercase text-[#6B7280] mb-2">Customer Information</div>
                  <div className="text-sm text-[#111827]">{clientName}</div>
                  {[invoice?.client?.address, invoice?.client?.city, invoice?.client?.country].filter(Boolean).map((p, i) => (
                    <div key={i} className="text-sm text-[#111827]">{p}</div>
                  ))}
                  {invoice?.client?.contactName ? <div className="text-sm text-[#111827] pt-1">Contact: {invoice.client.contactName}</div> : null}
                </div>
                <div className="rounded-lg bg-[#F8F9FB] p-[18px]">
                  <div className="text-[13px] font-semibold uppercase text-[#6B7280] mb-2">Invoice Information</div>
                  <div className="text-lg font-bold text-[#111827] mt-1">TAX INVOICE</div>
                  <div className="text-sm text-[#111827] mt-2"><strong>Invoice #:</strong> {invoice.invoiceNumber || "—"}</div>
                  <div className="text-sm text-[#111827] mt-1"><strong>Date:</strong> {fmtDate(invoice.issueDate)}</div>
                  <div className="text-sm text-[#111827] mt-1"><strong>Order #:</strong> {(invoice.notes || "—").slice(0, 50)}</div>
                </div>
              </div>

              {/* Line items table: Code, Description, Unit Price, VAT %, Qty, Total */}
              <div className="px-6 pb-6 flex flex-col lg:flex-row gap-6">
                <div className="flex-1 min-w-0 overflow-hidden">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E5E7EB]">
                        <th className="px-0 py-3 text-left text-xs font-semibold text-[#6B7280]">Code</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280]">Description</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B7280]">Unit Price</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B7280]">VAT %</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B7280]">Qty</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-[#6B7280]">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(invoice.items || []).map((it, idx) => (
                        <tr key={it.id} className={idx % 2 === 0 ? "bg-white" : "bg-transparent"}>
                          <td className="px-0 py-3.5 text-left text-sm text-[#111827] border-b border-[#F3F4F6] whitespace-nowrap">
                            {(() => {
                              const sku = it.product?.sku?.trim();
                              const desc = String(it.description || it.product?.name || it.productName || "—");
                              return (sku && sku.length <= 12 && !/^[a-z]{7,}$/.test(sku) ? sku : desc.slice(0, 10).trim()) || "—";
                            })()}
                          </td>
                          <td className="px-4 py-3.5 text-left text-sm text-[#111827] border-b border-[#F3F4F6]">
                            {it.description || it.product?.name || it.productName || "—"}
                          </td>
                          <td className="px-4 py-3.5 text-right text-sm text-[#111827] border-b border-[#F3F4F6]">
                            <Money value={Number(it.unitPrice || 0)} />
                          </td>
                          <td className="px-4 py-3.5 text-right text-sm text-[#111827] border-b border-[#F3F4F6]">
                            {Math.round((Number(it.taxRate || 0) * 100))}
                          </td>
                          <td className="px-4 py-3.5 text-right text-sm text-[#111827] border-b border-[#F3F4F6]">
                            {String(it.quantity)}
                          </td>
                          <td className="px-4 py-3.5 text-right text-sm text-[#111827] border-b border-[#F3F4F6]">
                            <Money value={Number(it.total || 0)} />
                          </td>
                        </tr>
                      ))}
                      {(invoice.items || []).length === 0 ? (
                        <tr>
                          <td className="px-4 py-4 text-[#6B7280] text-center" colSpan={6}>
                            No line items.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
                <div className="lg:w-72 shrink-0 rounded-lg bg-[#F8F9FB] border border-[#E5E7EB] p-5">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Subtotal</span>
                      <Money value={Number(invoice.subtotal || 0)} className="text-[#111827] font-medium" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">VAT</span>
                      <Money value={Number(invoice.taxAmount || 0)} className="text-[#111827] font-medium" />
                    </div>
                    <div className="flex justify-between pt-2 mt-2">
                      <span className="text-lg font-bold text-[#5B2DFF]">Total</span>
                      <Money value={Number(invoice.totalAmount || 0)} className="text-lg font-bold text-[#5B2DFF]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Banking Details (dark) + Footer + Actions */}
              <div className="px-6 pb-6 pt-5 border-t border-[#E5E7EB] flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1 min-w-0 space-y-2">
                  {(companySettings?.bankName || companySettings?.accountNumber || companySettings?.accountName) ? (
                    <div className="rounded-lg overflow-hidden bg-[#111827] p-5">
                      <div className="text-sm font-semibold text-white mb-2">Banking Details</div>
                      <div className="space-y-1 text-[13px] text-[#D1D5DB]">
                        {companySettings?.bankName ? <div>Bank: {companySettings.bankName}</div> : null}
                        {companySettings?.accountName ? <div>Account Holder: {companySettings.accountName}</div> : null}
                        {companySettings?.accountType ? <div>Account Type: {companySettings.accountType}</div> : null}
                        {companySettings?.accountNumber ? <div>Account Number: {companySettings.accountNumber}</div> : null}
                        {companySettings?.branchCode ? <div>Branch Code: {companySettings.branchCode}</div> : null}
                      </div>
                    </div>
                  ) : null}
                  <div className="text-xs text-[#9CA3AF] text-center">Thank you for your business</div>
                </div>
                <div className="flex shrink-0 items-start">
                  <ActionsMenu
                    ariaLabel="Invoice actions"
                    menuWidthClassName="w-52"
                    items={[
                      { key: "edit", label: "Edit invoice", disabled: !canEdit, hint: !canEdit ? "Sent invoices cannot be edited" : "", onSelect: () => navigate(`/invoices/${invoice.id}/edit`) },
                      { key: "pdf", label: "View PDF", onSelect: openPdf },
                      { key: "send", label: "Send Invoice", disabled: !canSend, hint: !canSend ? "Only draft invoices can be sent" : "", onSelect: sendInvoice },
                    ]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
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

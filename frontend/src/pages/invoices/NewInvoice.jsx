import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Button from "../../components/ui/button";
import Dialog from "../../components/ui/dialog";
import InvoiceForm from "../../components/invoices/InvoiceForm";
import ActionsMenu from "../../components/common/ActionsMenu";
import { getAccessToken } from "../../features/auth/token-store";

export default function NewInvoicePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const preselectedClientId = searchParams.get("clientId") || "";

  const isEdit = Boolean(id);

  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(isEdit);
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);

  const invoiceNumber = useMemo(
    () =>
      invoice?.invoiceNumber
        ? String(invoice.invoiceNumber)
        : nextInvoiceNumber ?? "INV-001",
    [invoice, nextInvoiceNumber]
  );

  const canCredit = useMemo(() => {
    const status = String(invoice?.status || "").toUpperCase();
    if (!invoice?.id) return false;
    if (["DRAFT", "CANCELLED"].includes(status)) return false;
    return Number(invoice?.balanceDue || 0) > 0;
  }, [invoice]);

  useEffect(() => {
    api
      .listClients({ page: 1, limit: 200 })
      .then((res) => setClients(res.data || []))
      .catch(() => setClients([]));

    api
      .listProducts({ page: 1, limit: 200, isActive: true })
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    if (!id) {
      api
        .getNextInvoiceNumber()
        .then((res) => res?.invoiceNumber && setNextInvoiceNumber(res.invoiceNumber))
        .catch(() => {});
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setInvoiceLoading(true);
    api
      .getInvoice(id)
      .then((res) => {
        if (mounted) setInvoice(res);
      })
      .catch(() => {
        if (mounted) setInvoice(null);
      })
      .finally(() => {
        if (mounted) setInvoiceLoading(false);
      });
    return () => { mounted = false; };
  }, [id]);

  async function openPdf() {
    if (!invoice?.id) return;
    try {
      setError(null);
      const token = getAccessToken();
      if (!token) throw new Error("Your session has expired. Please log in again.");
      const res = await fetch(`/api/invoices/${invoice.id}/pdf`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/pdf" },
      });
      const contentType = res.headers.get("content-type") || "";
      if (res.status === 401) throw new Error("Your session has expired. Please log in again.");
      if (!res.ok || !contentType.includes("application/pdf")) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Could not load PDF");
      }
      const buf = await res.arrayBuffer();
      const pdfBlob = new Blob([buf], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);
      if (pdfPreviewUrl) window.URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(url);
    } catch (e) {
      setError(e?.message || "Could not load PDF");
    }
  }

  async function submit(payload) {
    setLoading(true);
    setError(null);
    try {
      if (isEdit) {
        await api.updateInvoice(id, payload);
        navigate(`/invoices/${id}/edit`, { replace: true });
      } else {
        await api.createInvoice(payload);

        if (payload.alsoCreateRecurring && payload.clientId && payload.items?.length) {
          const today = new Date().toISOString().slice(0, 10);
          const startDate = payload.issueDate || today;
          const nextRunDate = payload.dueDate || startDate;

          await api.createRecurringInvoice({
            clientId: payload.clientId,
            templateName: payload.recurringTemplateName || `From invoice ${new Date().toISOString().slice(0, 10)}`,
            frequency: payload.recurringFrequency || "MONTHLY",
            intervalValue: 1,
            startDate,
            nextRunDate,
            endDate: null,
            isActive: true,
            items: payload.items.map((i) => ({
              description: i.description || "Line item",
              quantity: String(i.quantity || "1"),
              unitPrice: String(i.unitPrice || "0"),
              discount: String(i.discount || "0"),
              taxRate: String(i.taxRate || "0"),
            })),
            notes: payload.notes || undefined,
          });
        }

        navigate("/invoices", { replace: true });
      }
    } catch (e) {
      setError(e.message || "We couldn’t save the invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const readOnly = false;
  const showForm = !isEdit || invoice;

  if (isEdit && invoiceLoading) {
    return <div className="text-sm text-slate-600">Loading invoice…</div>;
  }

  if (isEdit && !invoice) {
    return (
      <div className="space-y-4">
        <div className="flex items-end justify-between gap-2">
          <div>
            <h1 className="text-xl font-semibold">Invoice</h1>
            <p className="text-sm text-slate-600">Invoice not found.</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/invoices")}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2">
        <div className="flex items-start gap-2">
          <Button
            variant="outline"
            className="h-10 w-10 p-0"
            onClick={() => navigate("/invoices")}
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{isEdit ? "Edit Invoice" : "New Invoice"}</h1>
            <p className="text-sm text-slate-600">
              {isEdit ? "Edit invoice details" : "Create and send professional invoices"}
            </p>
          </div>
        </div>

        {isEdit && invoice?.id ? (
          <ActionsMenu
            ariaLabel="Invoice actions"
            buttonClassName="h-10 w-10"
            buttonIconClassName="h-5 w-5"
            menuWidthClassName="w-56"
            items={[
              {
                key: "allocate_payment",
                label: "Allocate Payment",
                onSelect: () =>
                  navigate(`/payments?invoiceId=${invoice.id}&clientId=${invoice.clientId || ""}&new=1`),
              },
              {
                key: "credit_invoice",
                label: "Credit Invoice",
                disabled: !canCredit,
                hint: !canCredit ? "Invoice must have an outstanding balance to credit" : "",
                onSelect: () => navigate(`/invoices/${invoice.id}/credit-note`),
              },
            ]}
          />
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          {showForm ? (
            <InvoiceForm
              clients={clients}
              products={products}
              preselectedClientId={preselectedClientId}
              invoiceNumber={invoiceNumber}
              initialInvoice={invoice}
              onSubmit={submit}
              loading={loading}
              serverError={error}
              isEdit={isEdit}
              readOnly={readOnly}
              onProductCreated={(p) => setProducts((prev) => [...(prev || []), p])}
            />
          ) : null}
        </CardContent>
      </Card>

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
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => window.open(pdfPreviewUrl, "_blank")}
              >
                Open in new tab
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  window.URL.revokeObjectURL(pdfPreviewUrl);
                  setPdfPreviewUrl(null);
                }}
              >
                Close
              </Button>
            </div>
            <iframe
              title="Invoice PDF Preview"
              src={pdfPreviewUrl}
              className="w-full h-[70vh] rounded-md border border-slate-200"
            />
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}

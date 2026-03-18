import React, { useEffect, useMemo, useState } from "react";
import { Repeat } from "lucide-react";
import Input from "../ui/input";
import Button from "../ui/button";
import InvoiceLineItems from "./InvoiceLineItems";
import InvoiceSummary from "./InvoiceSummary";
import AddProductModal from "../products/AddProductModal";
import { validateInvoice } from "../../utils/validation";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysISO(isoDate, days) {
  if (!isoDate) return "";
  const d = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + Number(days || 0));
  return d.toISOString().slice(0, 10);
}

function invoiceToFormValues(inv) {
  if (!inv) return null;
  const vatEnabled = inv?.client?.taxType === "VAT_REGISTERED";
  const items = (inv.items || []).map((i) => ({
    productId: i.productId || "",
    description: i.description || "",
    quantity: Number(i.quantity) || 1,
    unitPrice: Number(i.unitPrice) || 0,
    vatPercent: vatEnabled ? Math.round((Number(i.taxRate) || 0) * 100) : 0,
  }));
  return {
    clientId: inv.clientId || "",
    issueDate: inv.issueDate ? String(inv.issueDate).slice(0, 10) : todayIso(),
    dueDate: inv.dueDate ? String(inv.dueDate).slice(0, 10) : "",
    notes: inv.notes || "",
    items: items.length > 0 ? items : [{ productId: "", description: "", quantity: 1, unitPrice: 0, vatPercent: vatEnabled ? 15 : 0 }],
  };
}

export default function InvoiceForm({
  clients,
  products,
  preselectedClientId,
  invoiceNumber,
  initialInvoice,
  onSubmit,
  loading,
  serverError,
  isEdit = false,
  readOnly = false,
  onProductCreated,
  onViewPdf,
}) {
  const isClientLocked = Boolean(preselectedClientId) && !initialInvoice;
  const disabled = readOnly;
  const initial = initialInvoice ? invoiceToFormValues(initialInvoice) : null;

  const [values, setValues] = useState(() => {
    if (initial) return initial;
    return {
      clientId: preselectedClientId || "",
      issueDate: todayIso(),
      dueDate: "",
      notes: "",
      items: [
        {
          productId: "",
          description: "",
          quantity: 1,
          unitPrice: 0,
          vatPercent: 15,
        },
      ],
    };
  });

  useEffect(() => {
    if (initialInvoice && invoiceToFormValues(initialInvoice)) {
      setValues(invoiceToFormValues(initialInvoice));
    }
  }, [initialInvoice?.id]);

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [addProductRowIndex, setAddProductRowIndex] = useState(null);
  const [alsoCreateRecurring, setAlsoCreateRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState("MONTHLY");
  const [recurringTemplateName, setRecurringTemplateName] = useState("");

  const selectedClient = useMemo(
    () => (clients || []).find((c) => c.id === values.clientId) || null,
    [clients, values.clientId]
  );

  const vatEnabled = selectedClient?.taxType === "VAT_REGISTERED";

  const defaultDueDays = 7;

  useEffect(() => {
    if (initialInvoice) return;
    const baseIssue = values.issueDate || todayIso();
    setValues((p) => ({ ...p, dueDate: addDaysISO(baseIssue, defaultDueDays) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClient?.id]);

  useEffect(() => {
    if (initialInvoice) return;
    setValues((p) => ({ ...p, dueDate: addDaysISO(p.issueDate || todayIso(), defaultDueDays) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.issueDate]);

  useEffect(() => {
    if (vatEnabled) return;
    setValues((p) => ({
      ...p,
      items: (p.items || []).map((it) => ({ ...it, vatPercent: 0 })),
    }));
  }, [vatEnabled]);

  const payloadItems = useMemo(() => {
    return (values.items || []).map((it) => ({
      productId: it.productId || undefined,
      description: it.description,
      quantity: String(it.quantity ?? "1"),
      unitPrice: String(it.unitPrice ?? "0"),
      discount: "0",
      taxRate: String(vatEnabled ? Number(it.vatPercent || 0) / 100 : 0),
    }));
  }, [values.items, vatEnabled]);

  const summaryItems = useMemo(() => {
    return payloadItems.map((it) => ({
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      taxRate: it.taxRate,
    }));
  }, [payloadItems]);

  function runValidation(nextValues = values) {
    const v = {
      ...nextValues,
      items: (nextValues.items || []).map((it) => ({
        ...it,
        taxRate: vatEnabled ? Number(it.vatPercent || 0) / 100 : 0,
      })),
    };

    const res = validateInvoice({
      clientId: v.clientId,
      items: (v.items || []).map((it) => ({
        productId: it.productId,
        description: it.description,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
      })),
    });

    setErrors(res.errors || {});
    return res.valid;
  }

  function markAllTouched() {
    setTouched({ all: true });
  }

  async function submit(send) {
    markAllTouched();
    const ok = runValidation();
    if (!ok) return;

    await onSubmit({
      clientId: values.clientId,
      issueDate: values.issueDate,
      dueDate: values.dueDate,
      notes: values.notes,
      items: payloadItems,
      send,
      alsoCreateRecurring: !isEdit && alsoCreateRecurring,
      recurringFrequency: alsoCreateRecurring ? recurringFrequency : undefined,
      recurringTemplateName: alsoCreateRecurring ? recurringTemplateName.trim() || undefined : undefined,
    });
  }

  const showErrors = Boolean(touched.all);

  function handleProductCreated(product) {
    onProductCreated?.(product);
    if (addProductRowIndex != null) {
      const vatPercent = vatEnabled && product?.taxRate != null
        ? Math.round(Number(product.taxRate) * 100)
        : vatEnabled ? 15 : 0;
      setValues((p) => ({
        ...p,
        items: (p.items || []).map((item, i) =>
          i === addProductRowIndex
            ? {
                ...item,
                productId: product.id,
                description: product.description || product.name || item.description,
                unitPrice: product.price != null ? Number(product.price) : item.unitPrice,
                vatPercent,
              }
            : item
        ),
      }));
    }
    setAddProductRowIndex(null);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-violet-100 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Customer</label>
            <select
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
              value={values.clientId}
              onChange={(e) => setValues((p) => ({ ...p, clientId: e.target.value }))}
              disabled={isClientLocked || disabled}
            >
              <option value="">Select a customer</option>
              {(clients || []).map((c) => (
                <option key={c.id} value={c.id}>
                  {(c.companyName ? c.companyName : c.contactName) || c.email}
                </option>
              ))}
            </select>
            {isClientLocked ? <div className="text-xs text-slate-500">Customer is locked.</div> : null}
            {showErrors && errors?.clientId ? <div className="text-xs text-red-600">{errors.clientId}</div> : null}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Invoice date</label>
            <Input
              type="date"
              value={values.issueDate}
              onChange={(e) => setValues((p) => ({ ...p, issueDate: e.target.value }))}
              disabled={disabled}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Due date</label>
            <Input
              type="date"
              value={values.dueDate}
              onChange={(e) => setValues((p) => ({ ...p, dueDate: e.target.value }))}
              disabled={disabled}
            />
            <div className="text-xs text-slate-500">
              Default: 7 days from invoice date
            </div>
          </div>
        </div>
      </div>

      <InvoiceLineItems
        items={values.items}
        setItems={(fn) => {
          if (disabled) return;
          setValues((p) => ({ ...p, items: typeof fn === "function" ? fn(p.items) : fn }));
          if (showErrors) {
            setTimeout(() => runValidation({ ...values, items: typeof fn === "function" ? fn(values.items) : fn }), 0);
          }
        }}
        products={products}
        vatEnabled={vatEnabled}
        errors={showErrors ? errors : null}
        readOnly={disabled}
        onAddProduct={(rowIndex) => {
          if (disabled) return;
          setAddProductRowIndex(rowIndex);
          setAddProductOpen(true);
        }}
      />

      <InvoiceSummary items={summaryItems} />

      <AddProductModal
        open={addProductOpen}
        onOpenChange={setAddProductOpen}
        onCreated={handleProductCreated}
      />

      {!isEdit && (
        <div className="rounded-lg border border-slate-200 bg-violet-50/50 p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={alsoCreateRecurring}
              onChange={(e) => setAlsoCreateRecurring(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
              disabled={disabled}
            />
            <div className="flex-1 min-w-0">
              <span className="flex items-center gap-2 text-sm font-medium text-slate-900">
                <Repeat className="h-4 w-4 text-violet-600" />
                Also create as recurring template
              </span>
              <p className="mt-0.5 text-xs text-slate-600">
                Save this invoice as a recurring template to automate future billing
              </p>
              {alsoCreateRecurring && (
                <div className="mt-3 flex flex-wrap gap-3">
                  <div className="flex-1 min-w-[140px] space-y-1">
                    <label className="text-xs font-medium text-slate-700">Template name</label>
                    <Input
                      value={recurringTemplateName}
                      onChange={(e) => setRecurringTemplateName(e.target.value)}
                      placeholder="e.g. Monthly retainer"
                      className="h-9 text-sm"
                      disabled={disabled}
                    />
                  </div>
                  <div className="flex-1 min-w-[120px] space-y-1">
                    <label className="text-xs font-medium text-slate-700">Frequency</label>
                    <select
                      value={recurringFrequency}
                      onChange={(e) => setRecurringFrequency(e.target.value)}
                      className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                      disabled={disabled}
                    >
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="BI_WEEKLY">Bi-weekly</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="QUARTERLY">Quarterly</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </label>
        </div>
      )}

      {serverError ? <div className="text-sm text-red-600">{serverError}</div> : null}

      <div className="flex items-center justify-end gap-2">
        {onViewPdf ? (
          <Button type="button" variant="outline" onClick={onViewPdf}>
            View PDF
          </Button>
        ) : null}
        {!readOnly ? (
          <>
            <Button type="button" variant="outline" disabled={loading} onClick={() => submit(false)}>
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Save Draft"}
            </Button>
            {!isEdit ? (
              <Button type="button" disabled={loading} onClick={() => submit(true)}>
                {loading ? "Sending..." : "Send Invoice"}
              </Button>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}

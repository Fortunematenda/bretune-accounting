import React, { useEffect, useMemo, useState } from "react";
import Input from "../ui/input";
import Button from "../ui/button";
import QuoteLineItems from "./QuoteLineItems";
import QuoteSummary from "./QuoteSummary";
import AddProductModal from "../products/AddProductModal";

function defaultExpiry() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
}

function emptyItem(vatEnabled) {
  return {
    productId: "",
    description: "",
    quantity: "1",
    unitPrice: "0.00",
    discount: "0.00",
    taxRate: vatEnabled ? "0.15" : "0.00",
  };
}

function quoteToFormValues(quote) {
  if (!quote) return null;
  const vatEnabled = quote?.client?.taxType === "VAT_REGISTERED";
  const items = (quote.items || []).map((i) => ({
    productId: i.productId || "",
    description: i.description || "",
    quantity: String(i.quantity ?? "1"),
    unitPrice: String(i.unitPrice ?? "0"),
    discount: String(i.discount ?? "0"),
    taxRate: vatEnabled ? String(i.taxRate ?? "0.15") : "0.00",
  }));
  return {
    clientId: quote.clientId || "",
    expiryDate: quote.expiryDate ? String(quote.expiryDate).slice(0, 10) : defaultExpiry(),
    notes: quote.notes || "",
    items: items.length > 0 ? items : [emptyItem(vatEnabled)],
  };
}

export default function QuoteForm({
  clients,
  products,
  preselectedClientId,
  initialQuote,
  onSubmit,
  loading,
  serverError,
  submitLabel = "Create quote",
  isEdit = false,
  onProductCreated,
}) {
  const isClientLocked = Boolean(preselectedClientId) && !initialQuote;
  const initial = initialQuote ? quoteToFormValues(initialQuote) : null;

  const [values, setValues] = useState(() => {
    if (initial) return initial;
    return {
      clientId: preselectedClientId || "",
      expiryDate: defaultExpiry(),
      notes: "",
      items: [emptyItem(true)],
    };
  });

  useEffect(() => {
    if (initialQuote && quoteToFormValues(initialQuote)) {
      setValues(quoteToFormValues(initialQuote));
    }
  }, [initialQuote?.id]);

  const selectedClient = useMemo(
    () => (clients || []).find((c) => c.id === values.clientId) || null,
    [clients, values.clientId]
  );

  const vatEnabled = selectedClient?.taxType === "VAT_REGISTERED";

  useEffect(() => {
    if (!vatEnabled)
      setValues((p) => ({
        ...p,
        items: (p.items || []).map((it) => ({ ...it, taxRate: "0.00" })),
      }));
  }, [vatEnabled]);

  const payloadItems = useMemo(() => {
    return (values.items || []).map((it) => ({
      productId: it.productId || undefined,
      description: it.description,
      quantity: String(it.quantity || "1"),
      unitPrice: String(it.unitPrice || "0"),
      discount: String(it.discount || "0"),
      taxRate: vatEnabled ? String(it.taxRate || "0") : "0",
    }));
  }, [values.items, vatEnabled]);

  const summaryItems = useMemo(
    () =>
      payloadItems.map((it) => ({
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        discount: it.discount,
        taxRate: it.taxRate,
      })),
    [payloadItems]
  );

  const [addProductOpen, setAddProductOpen] = useState(false);
  const [addProductRowIndex, setAddProductRowIndex] = useState(null);

  function handleProductCreated(product) {
    onProductCreated?.(product);
    if (addProductRowIndex != null) {
      const taxRate = vatEnabled && product?.taxRate != null
        ? String(Number(product.taxRate))
        : vatEnabled ? "0.15" : "0.00";
      setValues((p) => ({
        ...p,
        items: (p.items || []).map((item, i) =>
          i === addProductRowIndex
            ? {
                ...item,
                productId: product.id,
                description: product.description || product.name || item.description,
                unitPrice: product.price != null ? String(product.price) : item.unitPrice,
                taxRate,
              }
            : item
        ),
      }));
    }
    setAddProductRowIndex(null);
  }

  const canSubmit = useMemo(() => {
    if (!values.clientId) return false;
    if (!values.expiryDate) return false;
    if (!values.items?.length) return false;
    return values.items.every((i) => String(i.description || "").trim());
  }, [values]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit || loading) return;
    await onSubmit({
      clientId: values.clientId,
      expiryDate: values.expiryDate,
      notes: values.notes || undefined,
      items: payloadItems,
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
        <div className="rounded-xl border border-violet-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">Quote details</div>
              <div className="mt-1 text-xs text-slate-500">
                {isEdit && initialQuote?.quoteNumber
                  ? `Quote ${initialQuote.quoteNumber}`
                  : "Quote number is assigned when saved"}
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Customer</label>
              <select
                className="h-11 w-full rounded-lg border border-violet-200 bg-white px-3 text-sm focus:border-violet-400 focus:ring-2 focus:ring-violet-200 disabled:opacity-60"
                value={values.clientId}
                onChange={(e) => setValues((p) => ({ ...p, clientId: e.target.value }))}
                disabled={isClientLocked}
                required
              >
                <option value="">Select customer</option>
                {(clients || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {(c.companyName || c.contactName) || c.email}
                  </option>
                ))}
              </select>
              {isClientLocked ? (
                <div className="text-xs text-slate-500">Customer is preset for this quote</div>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Expiry date</label>
              <Input
                type="date"
                value={values.expiryDate}
                onChange={(e) => setValues((p) => ({ ...p, expiryDate: e.target.value }))}
                required
                className="h-11 border-violet-200 focus:border-violet-400"
              />
              <div className="text-xs text-slate-500">Quote valid until this date</div>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Notes</label>
              <Input
                value={values.notes}
                onChange={(e) => setValues((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Optional notes for the quote"
                className="border-violet-200 focus:border-violet-400"
              />
            </div>
          </div>
        </div>

        <QuoteLineItems
          items={values.items}
          setItems={(fn) =>
            setValues((p) => ({
              ...p,
              items: typeof fn === "function" ? fn(p.items) : fn,
            }))
          }
          products={products}
          vatEnabled={vatEnabled}
          errors={{}}
          onAddProduct={(rowIndex) => {
            setAddProductRowIndex(rowIndex);
            setAddProductOpen(true);
          }}
        />

        <AddProductModal
          open={addProductOpen}
          onOpenChange={setAddProductOpen}
          onCreated={handleProductCreated}
        />

        {serverError ? <div className="text-sm text-red-600 rounded-lg bg-red-50 p-3">{serverError}</div> : null}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            disabled={!canSubmit || loading}
            onClick={handleSubmit}
            className="bg-violet-600 hover:bg-violet-700 text-white px-6"
          >
            {loading ? "Saving…" : submitLabel}
          </Button>
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="sticky top-4">
          <QuoteSummary items={summaryItems} />
        </div>
      </div>
    </div>
  );
}

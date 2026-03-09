import React, { useEffect, useMemo, useState } from "react";
import Input from "../../../components/ui/input";
import Button from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

function validate(values) {
  const errors = {};
  if (!String(values.supplierName || "").trim()) errors.supplierName = "Supplier name is required.";

  const email = String(values.email || "").trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (email && !emailOk) errors.email = "Please enter a valid email address.";

  const terms = values.paymentTermsDays;
  if (terms != null && String(terms).trim() !== "") {
    const n = Number(terms);
    if (Number.isNaN(n) || n < 0 || n > 365) errors.paymentTermsDays = "Payment terms must be between 0 and 365 days.";
  }

  return errors;
}

function normalize(v) {
  const terms = v.paymentTermsDays;
  const normalizedTerms = terms != null && String(terms).trim() !== "" ? Number(terms) : null;

  return {
    supplierName: String(v.supplierName || "").trim(),
    companyName: String(v.companyName || "").trim() || null,
    contactPerson: String(v.contactPerson || "").trim() || null,
    email: String(v.email || "").trim() || null,
    phone: String(v.phone || "").trim() || null,
    address: String(v.address || "").trim() || null,
    taxNumber: String(v.taxNumber || "").trim() || null,
    paymentTermsDays: normalizedTerms,
    status: String(v.status || "ACTIVE").toUpperCase(),
    notes: String(v.notes || "").trim() || null,
  };
}

const PAYMENT_TERMS = [
  { label: "Due on receipt", value: 0 },
  { label: "Net 7", value: 7 },
  { label: "Net 14", value: 14 },
  { label: "Net 30", value: 30 },
  { label: "Net 45", value: 45 },
  { label: "Net 60", value: 60 },
  { label: "Net 90", value: 90 },
];

export default function SupplierForm({
  initialValues,
  onSubmit,
  loading,
  serverError,
  submitLabel = "Save",
  onCancel,
}) {
  const initial = useMemo(
    () => ({
      supplierName: initialValues?.supplierName || initialValues?.name || "",
      companyName: initialValues?.companyName || "",
      contactPerson: initialValues?.contactPerson || initialValues?.contactName || "",
      email: initialValues?.email || "",
      phone: initialValues?.phone || "",
      address: initialValues?.address || "",
      taxNumber: initialValues?.taxNumber || "",
      paymentTermsDays:
        initialValues?.paymentTermsDays != null
          ? String(initialValues.paymentTermsDays)
          : initialValues?.paymentTerms != null
            ? String(initialValues.paymentTerms)
            : "30",
      status: initialValues?.status || "ACTIVE",
      notes: initialValues?.notes || "",
    }),
    [initialValues]
  );

  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(initial);
    setTouched({});
    setErrors({});
  }, [initial]);

  function markTouched(name) {
    setTouched((p) => ({ ...p, [name]: true }));
  }

  function runValidation(next = values) {
    const e = validate(next);
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(e) {
    e.preventDefault();
    setTouched({ all: true });
    const ok = runValidation();
    if (!ok) return;
    await onSubmit(normalize(values));
  }

  const showError = (k) => Boolean((touched.all || touched[k]) && errors[k]);

  return (
    <form className="space-y-5" onSubmit={submit}>
      {serverError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</div>
      ) : null}

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Supplier details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Supplier Name</label>
              <div className="mt-1">
                <Input
                  value={values.supplierName}
                  onChange={(e) => setValues((p) => ({ ...p, supplierName: e.target.value }))}
                  onBlur={() => {
                    markTouched("supplierName");
                    runValidation({ ...values, supplierName: values.supplierName });
                  }}
                  placeholder="e.g. Acme Supplies"
                  disabled={loading}
                />
                {showError("supplierName") ? <div className="mt-1 text-xs text-red-600">{errors.supplierName}</div> : null}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Company Name</label>
              <div className="mt-1">
                <Input
                  value={values.companyName}
                  onChange={(e) => setValues((p) => ({ ...p, companyName: e.target.value }))}
                  placeholder="e.g. Acme (Pty) Ltd"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Contact Person</label>
              <div className="mt-1">
                <Input
                  value={values.contactPerson}
                  onChange={(e) => setValues((p) => ({ ...p, contactPerson: e.target.value }))}
                  placeholder="e.g. Jane Doe"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <div className="mt-1">
                <Input
                  value={values.email}
                  onChange={(e) => setValues((p) => ({ ...p, email: e.target.value }))}
                  onBlur={() => {
                    markTouched("email");
                    runValidation({ ...values, email: values.email });
                  }}
                  placeholder="accounts@acme.com"
                  disabled={loading}
                />
                {showError("email") ? <div className="mt-1 text-xs text-red-600">{errors.email}</div> : null}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Phone</label>
              <div className="mt-1">
                <Input
                  value={values.phone}
                  onChange={(e) => setValues((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+27 …"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Address</label>
              <div className="mt-1">
                <textarea
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  rows={3}
                  value={values.address}
                  onChange={(e) => setValues((p) => ({ ...p, address: e.target.value }))}
                  placeholder="Street, city, region"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Tax Number</label>
              <div className="mt-1">
                <Input
                  value={values.taxNumber}
                  onChange={(e) => setValues((p) => ({ ...p, taxNumber: e.target.value }))}
                  placeholder="VAT / Tax reference"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Payment Terms</label>
              <div className="mt-1">
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  value={values.paymentTermsDays}
                  onChange={(e) => setValues((p) => ({ ...p, paymentTermsDays: e.target.value }))}
                  onBlur={() => {
                    markTouched("paymentTermsDays");
                    runValidation({ ...values, paymentTermsDays: values.paymentTermsDays });
                  }}
                  disabled={loading}
                >
                  {PAYMENT_TERMS.map((t) => (
                    <option key={t.value} value={String(t.value)}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {showError("paymentTermsDays") ? (
                  <div className="mt-1 text-xs text-red-600">{errors.paymentTermsDays}</div>
                ) : null}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Status</label>
              <div className="mt-1">
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  value={values.status}
                  onChange={(e) => setValues((p) => ({ ...p, status: e.target.value }))}
                  disabled={loading}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-700">Notes</label>
              <div className="mt-1">
                <textarea
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  rows={4}
                  value={values.notes}
                  onChange={(e) => setValues((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Payment instructions, preferred contact, account notes…"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-violet-600 hover:bg-violet-700" disabled={loading}>
              {loading ? "Saving…" : submitLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

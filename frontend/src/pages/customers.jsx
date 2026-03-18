import React, { useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import Dialog from "../components/ui/dialog";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Download, Minus, Plus, Upload, SlidersHorizontal, Users, UserPlus } from "lucide-react";
import StatusBadge from "../components/common/StatusBadge";
import EmptyState from "../components/common/EmptyState";
import Money from "../components/common/money";
import ActionsMenu from "../components/common/ActionsMenu";
import ColumnPickerDialog from "../components/common/ColumnPickerDialog";
import ListPageToolbar from "../components/common/ListPageToolbar";
import PageHeader from "../components/common/PageHeader";
import Pagination from "../components/common/Pagination";
import { usePersistentColumns } from "../utils/usePersistentColumns";
import { useColumnSort } from "../utils/useColumnSort";
import SortableTableHeader from "../components/common/SortableTableHeader";
import { csvToObjects, downloadTextFile, objectsToCsv } from "../lib/csv";
import { formatDateForDisplay } from "../lib/dateFormat";
import { formatRecordDisplayId } from "../lib/utils";

function formatClientId(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return "—";
  return String(v).padStart(3, "0");
}

export default function ClientsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQ = searchParams.get("q") || "";
  const urlNew = searchParams.get("new") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(10, Math.min(100, parseInt(searchParams.get("limit") || "20", 10)));
  const [q, setQ] = useState(urlQ);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const importInputRef = useRef(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [columnsOpen, setColumnsOpen] = useState(false);

  const requiredColumnKeys = new Set(["customerNo", "status", "name"]);
  const columnDefs = [
    { key: "customerNo", label: "ID" },
    { key: "status", label: "Status" },
    { key: "name", label: "Full name" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "address", label: "Street" },
    { key: "createdAt", label: "Date added" },
    { key: "balance", label: "Balance" },
    { key: "paymentTermsDays", label: "Terms" },
    { key: "type", label: "Type" },
    { key: "city", label: "City/Zone" },
    { key: "taxNumber", label: "Tax/VAT #" },
    { key: "openingBalance", label: "Opening Balance" },
    { key: "creditLimit", label: "Credit Limit" },
    { key: "totalInvoiced", label: "Total Invoiced" },
    { key: "totalPaid", label: "Total Paid" },
  ];
  const columnOrder = columnDefs.map((c) => c.key);
  const defaultVisibleColumns = [
    "customerNo",
    "status",
    "name",
    "phone",
    "email",
    "address",
    "createdAt",
  ];

  const [visibleColumns, setVisibleColumns, resetVisibleColumns] = usePersistentColumns({
    storageKey: "ba_customers_visible_columns",
    columnOrder,
    defaultVisibleColumns,
    requiredKeys: Array.from(requiredColumnKeys),
  });

  const sortColumnDefs = columnDefs.map((c) => ({
    ...c,
    getValue:
      c.key === "name"
        ? (r) => (r?.companyName || r?.contactName || "")
        : c.key === "customerNo"
          ? (r) => String(r?.clientSeq ?? "").padStart(3, "0")
          : ["balance", "openingBalance", "creditLimit", "totalInvoiced", "totalPaid", "paymentTermsDays"].includes(c.key)
            ? (r) => Number(r?.[c.key]) || 0
            : undefined,
  }));
  const { sortKey, sortDir, toggleSort, sortRows } = useColumnSort(sortColumnDefs);

  const [viewClientOpen, setViewClientOpen] = useState(false);
  const [viewClient, setViewClient] = useState(null);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    type: "COMPANY",
    companyName: "",
    contactName: "",
    emails: [""],
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    taxType: "NONE",
    taxNumber: "",
    paymentTermsDays: 30,
    openingBalance: "0.00",
    creditLimit: "0.00",
    status: "ACTIVE",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(current) {
    const errors = {};
    const emailList = Array.isArray(current.emails) ? current.emails : [current.email || ""];
    const validEmails = emailList.map((e) => String(e || "").trim()).filter(Boolean);
    const invalidEmails = validEmails.filter((e) => !emailRegex.test(e));

    if (!String(current.contactName || "").trim()) errors.contactName = "Contact name is required.";
    if (invalidEmails.length > 0) errors.emails = "Please enter valid email addresses.";

    const terms = Number(current.paymentTermsDays);
    if (Number.isNaN(terms) || terms < 1 || terms > 365) errors.paymentTermsDays = "Payment terms must be between 1 and 365.";

    const dec = (v) => /^-?\d+(\.\d+)?$/.test(String(v || "0"));
    if (!dec(current.openingBalance)) errors.openingBalance = "Opening balance must be a valid number.";
    if (!dec(current.creditLimit)) errors.creditLimit = "Credit limit must be a valid number.";
    if (dec(current.creditLimit) && Number(current.creditLimit) < 0) errors.creditLimit = "Credit limit must be 0 or greater.";

    if (current.taxType === "VAT_REGISTERED" && !String(current.taxNumber || "").trim()) {
      errors.taxNumber = "VAT number is required when VAT Registered.";
    }

    return errors;
  }

  function clean(v) {
    if (v == null) return null;
    const s = String(v).trim();
    return s ? s : null;
  }

  function pick(obj, keys) {
    for (const k of keys) {
      const v = obj?.[k];
      if (v != null && String(v).trim() !== "") return String(v).trim();
    }
    return "";
  }

  async function fetchAllCustomers() {
    const all = [];
    const limit = 1000;
    let p = 1;
    let totalPages = 1;

    while (p <= totalPages) {
      const res = await api.listClients({ q, page: p, limit });
      const batch = Array.isArray(res?.data) ? res.data : [];
      all.push(...batch);
      totalPages = Number(res?.meta?.totalPages || 1);
      if (!Number.isFinite(totalPages) || totalPages < 1) totalPages = 1;
      p += 1;
      if (p > 50) break;
    }

    return all;
  }

  async function exportCustomersCsv() {
    setExporting(true);
    setError(null);
    setSuccess(null);
    try {
      const all = await fetchAllCustomers();
      const headers = [
        { key: "type", label: "type" },
        { key: "companyName", label: "companyName" },
        { key: "contactName", label: "contactName" },
        { key: "email", label: "email" },
        { key: "phone", label: "phone" },
        { key: "address", label: "address" },
        { key: "city", label: "city" },
        { key: "state", label: "state" },
        { key: "country", label: "country" },
        { key: "postalCode", label: "postalCode" },
        { key: "taxType", label: "taxType" },
        { key: "taxNumber", label: "taxNumber" },
        { key: "paymentTermsDays", label: "paymentTermsDays" },
        { key: "openingBalance", label: "openingBalance" },
        { key: "creditLimit", label: "creditLimit" },
        { key: "status", label: "status" },
        { key: "notes", label: "notes" },
      ];
      const csv = objectsToCsv({
        headers,
        rows: all.map((c) => ({
          type: c?.type || "COMPANY",
          companyName: c?.companyName || "",
          contactName: c?.contactName || "",
          email: c?.email || "",
          phone: c?.phone || "",
          address: c?.address || "",
          city: c?.city || "",
          state: c?.state || "",
          country: c?.country || "",
          postalCode: c?.postalCode || "",
          taxType: c?.taxType || "NONE",
          taxNumber: c?.taxNumber || "",
          paymentTermsDays: c?.paymentTermsDays ?? 30,
          openingBalance: c?.openingBalance ?? "0.00",
          creditLimit: c?.creditLimit ?? "0.00",
          status: c?.status || "ACTIVE",
          notes: c?.notes || "",
        })),
      });

      const date = new Date().toISOString().slice(0, 10);
      downloadTextFile(`customers_${date}.csv`, csv);
      setSuccess(`Exported ${all.length} customers.`);
    } catch (e) {
      setError(e.message || "Failed to export customers");
    } finally {
      setExporting(false);
    }
  }

  async function importCustomersCsv(file) {
    if (!file) return;
    setImporting(true);
    setError(null);
    setSuccess(null);

    try {
      const text = await file.text();
      const parsed = csvToObjects(text);
      const rowsIn = Array.isArray(parsed?.rows) ? parsed.rows : [];

      let created = 0;
      let skipped = 0;
      let failed = 0;
      let firstErr = null;

      for (const r of rowsIn) {
        const contactName = pick(r, ["contactname", "fullname", "name", "customername"]);
        if (!contactName) {
          skipped += 1;
          continue;
        }

        const typeRaw = pick(r, ["type", "customertype"]);
        const type = typeRaw && String(typeRaw).toUpperCase() === "INDIVIDUAL" ? "INDIVIDUAL" : "COMPANY";

        const taxTypeRaw = pick(r, ["taxtype", "taxstatus"]);
        const taxType =
          taxTypeRaw && ["VAT_REGISTERED", "VAT_EXEMPT", "NONE"].includes(String(taxTypeRaw).toUpperCase())
            ? String(taxTypeRaw).toUpperCase()
            : "NONE";

        const statusRaw = pick(r, ["status"]);
        const status =
          statusRaw && ["ACTIVE", "INACTIVE", "SUSPENDED"].includes(String(statusRaw).toUpperCase())
            ? String(statusRaw).toUpperCase()
            : "ACTIVE";

        const payload = {
          type,
          companyName: clean(pick(r, ["companyname", "company"])),
          contactName,
          email: clean(pick(r, ["email"])),
          phone: clean(pick(r, ["phone", "phonenumber"])),
          address: clean(pick(r, ["address", "street"])),
          city: clean(pick(r, ["city", "zone"])),
          state: clean(pick(r, ["state"])),
          country: clean(pick(r, ["country"])),
          postalCode: clean(pick(r, ["postalcode", "zipcode", "zip"])),
          taxType,
          taxNumber: clean(pick(r, ["taxnumber", "vatnumber", "vat"])),
          paymentTermsDays: Number(pick(r, ["paymenttermsdays", "paymentterms", "terms"]) || 30),
          openingBalance: String(pick(r, ["openingbalance", "opening"]) || "0.00"),
          creditLimit: String(pick(r, ["creditlimit", "credit"]) || "0.00"),
          status,
          notes: clean(pick(r, ["notes", "note"])),
        };

        if (Number.isNaN(Number(payload.paymentTermsDays)) || payload.paymentTermsDays < 1 || payload.paymentTermsDays > 365) {
          payload.paymentTermsDays = 30;
        }

        try {
          await api.createCustomer(payload);
          created += 1;
        } catch (e) {
          if (e?.status === 409 || String(e?.message || "").toLowerCase().includes("exists")) {
            skipped += 1;
          } else {
            failed += 1;
            if (!firstErr) firstErr = e;
          }
        }
      }

      if (failed > 0) {
        setError(firstErr?.message || "Some rows failed to import.");
      }
      setSuccess(`Imported ${created} customers. Skipped ${skipped}. Failed ${failed}.`);
      await load();
    } catch (e) {
      setError(e.message || "Failed to import customers");
    } finally {
      setImporting(false);
      if (importInputRef.current) importInputRef.current.value = "";
    }
  }

  async function load() {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await api.listClients({ q, page, limit });
      setData(res);
    } catch (e) {
      setError(e.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  function setPage(p) {
    const next = new URLSearchParams(searchParams);
    if (p <= 1) next.delete("page");
    else next.set("page", String(p));
    setSearchParams(next, { replace: true });
  }

  function setLimit(l) {
    const next = new URLSearchParams(searchParams);
    if (l === 20) next.delete("limit");
    else next.set("limit", String(l));
    next.delete("page");
    setSearchParams(next, { replace: true });
  }

  useEffect(() => {
    setQ(urlQ);
  }, [urlQ]);

  useEffect(() => {
    if (urlNew === "1") {
      setEditingId(null);
      setOpen(true);
    }
  }, [urlNew]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, page, limit]);

  const rows = (data?.data || []).slice().sort((a, b) => {
    const av = Number(a?.clientSeq);
    const bv = Number(b?.clientSeq);
    if (!Number.isFinite(av) && !Number.isFinite(bv)) return 0;
    if (!Number.isFinite(av)) return 1;
    if (!Number.isFinite(bv)) return -1;
    return av - bv;
  });

  function parseEmails(str) {
    if (!str || typeof str !== "string") return [""];
    const parts = str.split(/[,;]/).map((s) => s.trim()).filter(Boolean);
    return parts.length ? parts : [""];
  }

  function openEditCustomer(c) {
    if (!c) return;
    setEditingId(c.id);
    setFieldErrors({});
    const emails = parseEmails(c.email);
    setForm({
      type: c.type || "COMPANY",
      companyName: c.companyName || "",
      contactName: c.contactName || "",
      emails: emails.length ? emails : [""],
      phone: c.phone || "",
      address: c.address || "",
      city: c.city || "",
      state: c.state || "",
      country: c.country || "",
      postalCode: c.postalCode || "",
      taxType: c.taxType || "NONE",
      taxNumber: c.taxNumber || "",
      paymentTermsDays: c.paymentTermsDays != null ? c.paymentTermsDays : 30,
      openingBalance: String(c.openingBalance ?? "0.00"),
      creditLimit: String(c.creditLimit ?? "0.00"),
      status: c.status || "ACTIVE",
      notes: c.notes || "",
    });
    setOpen(true);
  }

  async function saveCustomer(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSaving(false);
      return;
    }

    try {
      const emailList = (Array.isArray(form.emails) ? form.emails : [form.email || ""])
        .map((e) => String(e || "").trim())
        .filter(Boolean);
      const emailValue = emailList.length ? emailList.join(", ") : null;

      const payload = {
        ...form,
        companyName: String(form.companyName || "").trim() || null,
        email: emailValue,
        paymentTermsDays: Number(form.paymentTermsDays),
        openingBalance: String(form.openingBalance || "0.00"),
        creditLimit: String(form.creditLimit || "0.00"),
      };

      if (editingId) {
        await api.updateCustomer(editingId, payload);
        setSuccess("Customer updated successfully.");
      } else {
        await api.createClient(payload);
        setSuccess("Customer created successfully.");
      }
      setOpen(false);
      setEditingId(null);
      setForm({
        type: "COMPANY",
        companyName: "",
        contactName: "",
        emails: [""],
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        taxType: "NONE",
        taxNumber: "",
        paymentTermsDays: 30,
        openingBalance: "0.00",
        creditLimit: "0.00",
        status: "ACTIVE",
        notes: "",
      });
      setFieldErrors({});
      await load();
    } catch (e2) {
      setError(e2.message || "Could not save the customer.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCustomer(id) {
    const ok = window.confirm("Delete this customer? This cannot be undone.");
    if (!ok) return;
    setError(null);
    setSuccess(null);
    try {
      await api.deleteCustomer(id);
      setSuccess("Customer deleted successfully.");
      await load();
    } catch (e) {
      setError(e.message || "Could not delete the customer.");
    }
  }

  return (
    <div className="space-y-6 min-h-screen">
      <PageHeader
        title="Customers"
        subtitle="Manage your customer and contact records"
        icon={<Users className="h-5 w-5 text-violet-600" />}
        action={
          <Button
            onClick={() => {
              setEditingId(null);
              setForm({
                type: "COMPANY",
                companyName: "",
                contactName: "",
                emails: [""],
                phone: "",
                address: "",
                city: "",
                state: "",
                country: "",
                postalCode: "",
                taxType: "NONE",
                taxNumber: "",
                paymentTermsDays: 30,
                openingBalance: "0.00",
                creditLimit: "0.00",
                status: "ACTIVE",
                notes: "",
              });
              setFieldErrors({});
              setOpen(true);
            }}
            className="h-9 shrink-0"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            New Customer
          </Button>
        }
      />

      <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4">
          <input
            ref={importInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => importCustomersCsv(e.target.files?.[0] || null)}
          />
          <ListPageToolbar
            actionsItems={[
              { key: "import", label: importing ? "Importing…" : "Import CSV", onSelect: () => importInputRef.current?.click(), disabled: importing },
              { key: "export", label: exporting ? "Exporting…" : "Export CSV", onSelect: exportCustomersCsv, disabled: exporting },
            ]}
            searchValue={q}
            onSearchChange={(next) => {
              setQ(next);
              const nextParams = new URLSearchParams(searchParams);
              if (next) nextParams.set("q", next);
              else nextParams.delete("q");
              nextParams.delete("new");
              nextParams.delete("page");
              setSearchParams(nextParams, { replace: true });
            }}
            searchPlaceholder="Search customers…"
            limit={limit}
            onLimitChange={setLimit}
            onColumnsClick={() => setColumnsOpen(true)}
          />
          {success ? (
            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
              {success}
            </div>
          ) : null}
          {error ? (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          ) : null}
          </div>

          <div className="overflow-auto">
            <table className="min-w-max w-full text-[13px]">
              <thead className="text-left bg-slate-50/80">
                <tr className="border-y border-slate-200/80">
                  {visibleColumns.includes("customerNo") ? (
                    <SortableTableHeader label="ID" columnKey="customerNo" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  ) : null}
                  {visibleColumns.includes("status") ? (
                    <SortableTableHeader label="Status" columnKey="status" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  ) : null}
                  {visibleColumns.includes("name") ? (
                    <SortableTableHeader label="Full name" columnKey="name" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  ) : null}
                  {visibleColumns.includes("phone") ? (
                    <SortableTableHeader label="Phone" columnKey="phone" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" />
                  ) : null}
                  {visibleColumns.includes("email") ? (
                    <SortableTableHeader label="Email" columnKey="email" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" />
                  ) : null}
                  {visibleColumns.includes("address") ? (
                    <SortableTableHeader label="Street" columnKey="address" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" />
                  ) : null}
                  {visibleColumns.includes("createdAt") ? (
                    <SortableTableHeader label="Date added" columnKey="createdAt" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" />
                  ) : null}
                  {visibleColumns.includes("city") ? (
                    <SortableTableHeader label="City/Zone" columnKey="city" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" />
                  ) : null}
                  {visibleColumns.includes("type") ? (
                    <SortableTableHeader label="Type" columnKey="type" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" />
                  ) : null}
                  {visibleColumns.includes("paymentTermsDays") ? (
                    <SortableTableHeader label="Terms" columnKey="paymentTermsDays" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" />
                  ) : null}
                  {visibleColumns.includes("balance") ? (
                    <SortableTableHeader label="Balance" columnKey="balance" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" className="hidden sm:table-cell" />
                  ) : null}
                  {visibleColumns.includes("taxNumber") ? (
                    <SortableTableHeader label="Tax/VAT #" columnKey="taxNumber" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" />
                  ) : null}
                  {visibleColumns.includes("openingBalance") ? (
                    <SortableTableHeader label="Opening" columnKey="openingBalance" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" className="hidden sm:table-cell" />
                  ) : null}
                  {visibleColumns.includes("creditLimit") ? (
                    <SortableTableHeader label="Credit" columnKey="creditLimit" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" className="hidden sm:table-cell" />
                  ) : null}
                  {visibleColumns.includes("totalInvoiced") ? (
                    <SortableTableHeader label="Invoiced" columnKey="totalInvoiced" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" className="hidden sm:table-cell" />
                  ) : null}
                  {visibleColumns.includes("totalPaid") ? (
                    <SortableTableHeader label="Paid" columnKey="totalPaid" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" className="hidden sm:table-cell" />
                  ) : null}
                  <th className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-xs font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortRows(rows).map((c) => {
                  const displayId = formatRecordDisplayId(c);
                  return (
                  <tr
                    key={c.id}
                    className="border-b border-slate-100 cursor-pointer hover:bg-slate-50/80 transition-colors"
                    onClick={() => navigate(`/customers/${c.id}`)}
                  >
                    {visibleColumns.includes("customerNo") ? (
                      <td className="py-2.5 px-3 font-mono text-xs text-slate-500 font-medium whitespace-nowrap" title={c.id}>{displayId}</td>
                    ) : null}
                    {visibleColumns.includes("status") ? (
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <StatusBadge status={c.status} size="sm" />
                      </td>
                    ) : null}
                    {visibleColumns.includes("name") ? (
                      <td className="py-2.5 px-3 min-w-[240px]">
                        <div className="font-medium text-slate-900 leading-5">{c.companyName ? c.companyName : c.contactName}</div>
                        {c.companyName ? <div className="text-xs text-slate-400 mt-0.5">{c.contactName}</div> : null}
                      </td>
                    ) : null}
                    {visibleColumns.includes("phone") ? (
                      <td className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-slate-600">{c.phone || "—"}</td>
                    ) : null}
                    {visibleColumns.includes("email") ? (
                      <td className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-slate-600">{c.email || "—"}</td>
                    ) : null}
                    {visibleColumns.includes("address") ? (
                      <td className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-slate-600">{c.address || "—"}</td>
                    ) : null}
                    {visibleColumns.includes("createdAt") ? (
                      <td className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-slate-500">{formatDateForDisplay(c.createdAt)}</td>
                    ) : null}
                    {visibleColumns.includes("city") ? (
                      <td className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-slate-600">{c.city || "—"}</td>
                    ) : null}
                    {visibleColumns.includes("type") ? (
                      <td className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{c.type || "—"}</span>
                      </td>
                    ) : null}
                    {visibleColumns.includes("paymentTermsDays") ? (
                      <td className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-slate-600">{c.paymentTermsDays} days</td>
                    ) : null}
                    {visibleColumns.includes("balance") ? (
                      <td className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-right tabular-nums font-medium text-slate-800">
                        <Money value={Number(c.balance || 0)} />
                      </td>
                    ) : null}
                    {visibleColumns.includes("taxNumber") ? (
                      <td className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-slate-600">{c.taxNumber || "—"}</td>
                    ) : null}
                    {visibleColumns.includes("openingBalance") ? (
                      <td className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-right tabular-nums text-slate-600">
                        <Money value={Number(c.openingBalance || 0)} />
                      </td>
                    ) : null}
                    {visibleColumns.includes("creditLimit") ? (
                      <td className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-right tabular-nums text-slate-600">
                        <Money value={Number(c.creditLimit || 0)} />
                      </td>
                    ) : null}
                    {visibleColumns.includes("totalInvoiced") ? (
                      <td className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-right tabular-nums text-slate-600">
                        <Money value={Number(c.totalInvoiced || 0)} />
                      </td>
                    ) : null}
                    {visibleColumns.includes("totalPaid") ? (
                      <td className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-right tabular-nums text-slate-600">
                        <Money value={Number(c.totalPaid || 0)} />
                      </td>
                    ) : null}
                    <td className="hidden sm:table-cell py-2.5 px-3 text-right">
                      <ActionsMenu
                        ariaLabel="Customer actions"
                        items={[
                          {
                            key: "view",
                            label: "View",
                            onSelect: () => navigate(`/customers/${c.id}`),
                          },
                          {
                            key: "edit",
                            label: "Edit",
                            onSelect: () => openEditCustomer(c),
                          },
                          {
                            key: "delete",
                            label: "Delete",
                            tone: "danger",
                            onSelect: () => deleteCustomer(c.id),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                );})}
              </tbody>
            </table>

            {data && (data.data || []).length === 0 ? (
              <EmptyState
                icon={Users}
                title="No customers found"
                description={q ? "Try adjusting your search terms" : "Get started by adding your first customer"}
                action={
                  !q ? (
                    <Button
                      onClick={() => {
                        setEditingId(null);
                        setForm({ type: "COMPANY", companyName: "", contactName: "", emails: [""], phone: "", address: "", city: "", state: "", country: "", postalCode: "", taxType: "NONE", taxNumber: "", paymentTermsDays: 30, openingBalance: "0.00", creditLimit: "0.00", status: "ACTIVE", notes: "" });
                        setFieldErrors({});
                        setOpen(true);
                      }}
                      className="h-9"
                    >
                      <UserPlus className="h-4 w-4 mr-1.5" />
                      Add Customer
                    </Button>
                  ) : null
                }
              />
            ) : null}

            {data?.meta && (data.data || []).length > 0 ? (
              <Pagination
                page={data.meta.page}
                limit={data.meta.limit}
                total={data.meta.total}
                onPageChange={setPage}
              />
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Dialog open={viewClientOpen} onOpenChange={setViewClientOpen} title="Customer">
        {viewClient ? (
          <div className="space-y-3 text-sm">
            <div className="font-medium text-slate-900">{viewClient.companyName ? viewClient.companyName : viewClient.contactName}</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-slate-500">Contact</div>
                <div className="text-slate-800">{viewClient.contactName}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Emails</div>
                <div className="text-slate-800">
                  {viewClient.email
                    ? viewClient.email.split(/[,;]/).map((e, i) => (
                        <div key={i}>{e.trim()}</div>
                      ))
                    : "—"}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Phone</div>
                <div className="text-slate-800">{viewClient.phone || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Status</div>
                <div className="text-slate-800">{viewClient.status}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Payment Terms</div>
                <div className="text-slate-800">{viewClient.paymentTermsDays} days</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Balance</div>
                <div className="text-slate-800"><Money value={Number(viewClient.balance || 0)} /></div>
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500">Address</div>
              <div className="text-slate-800">
                {[
                  viewClient.address,
                  viewClient.city,
                  viewClient.state,
                  viewClient.country,
                  viewClient.postalCode,
                ]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setViewClientOpen(false);
                  setViewClient(null);
                }}
              >
                Close
              </Button>
              <Button
                className="bg-violet-600 hover:bg-violet-700 text-white"
                onClick={() => {
                  const id = viewClient.id;
                  setViewClientOpen(false);
                  setViewClient(null);
                  navigate(`/invoices/new?clientId=${id}`);
                }}
              >
                Create Invoice
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-600">Client not found.</div>
        )}
      </Dialog>

      <ColumnPickerDialog
        open={columnsOpen}
        onOpenChange={setColumnsOpen}
        columnDefs={columnDefs}
        visibleColumns={visibleColumns}
        setVisibleColumns={setVisibleColumns}
        requiredKeys={requiredColumnKeys}
        columnOrder={columnOrder}
        defaultVisibleColumns={defaultVisibleColumns}
        onReset={resetVisibleColumns}
      />

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditingId(null);
          if (!v && urlNew === "1") {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.delete("new");
            setSearchParams(nextParams, { replace: true });
          }
        }}
        title={editingId ? "Edit Customer" : "New Customer"}
        description={editingId ? "Update customer information" : "Add a new customer to your account"}
        size="lg"
      >
        <form className="space-y-5" onSubmit={saveCustomer}>
          <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Customer Type</label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={form.type}
                  onChange={(e) => {
                  const nextType = e.target.value;
                  setForm((p) => ({
                    ...p,
                    type: nextType,
                    ...(nextType === "INDIVIDUAL" ? { companyName: "" } : {}),
                  }));
                }}
                >
                  <option value="COMPANY">Company</option>
                  <option value="INDIVIDUAL">Individual</option>
                </select>
              </div>

              {form.type === "COMPANY" ? (
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Company Name</label>
                <Input
                  value={form.companyName}
                  onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
                />
                {fieldErrors.companyName ? <div className="text-xs text-red-600">{fieldErrors.companyName}</div> : null}
              </div>
            ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Contact Name</label>
                <Input value={form.contactName} onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))} required />
                {fieldErrors.contactName ? <div className="text-xs text-red-600">{fieldErrors.contactName}</div> : null}
              </div>
              <div className="space-y-1 md:col-span-1">
                <label className="text-xs font-medium text-slate-600">Emails</label>
                <div className="space-y-2">
                  {(Array.isArray(form.emails) ? form.emails : [form.email || ""]).map((addr, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        type="email"
                        value={addr}
                        onChange={(e) => {
                          const list = [...(form.emails || [""])];
                          list[i] = e.target.value;
                          setForm((p) => ({ ...p, emails: list }));
                        }}
                        placeholder="email@example.com"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="shrink-0 h-10 px-2"
                        onClick={() => {
                          const list = (form.emails || [""]).filter((_, j) => j !== i);
                          setForm((p) => ({ ...p, emails: list.length ? list : [""] }));
                        }}
                        disabled={(form.emails || [""]).length <= 1}
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
                    onClick={() => setForm((p) => ({ ...p, emails: [...(p.emails || [""]), ""] }))}
                  >
                    <Plus className="h-3 w-3 mr-1 inline" />
                    Add another email
                  </Button>
                </div>
                {fieldErrors.emails ? <div className="text-xs text-red-600">{fieldErrors.emails}</div> : null}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Phone</label>
                <Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Account Status</label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Payment Terms (days)</label>
                <Input
                  type="number"
                  value={form.paymentTermsDays}
                  onChange={(e) => setForm((p) => ({ ...p, paymentTermsDays: e.target.value }))}
                  min={1}
                  max={365}
                  required
                />
                {fieldErrors.paymentTermsDays ? <div className="text-xs text-red-600">{fieldErrors.paymentTermsDays}</div> : null}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Opening Balance</label>
                  <Input value={form.openingBalance} onChange={(e) => setForm((p) => ({ ...p, openingBalance: e.target.value }))} />
                  {fieldErrors.openingBalance ? <div className="text-xs text-red-600">{fieldErrors.openingBalance}</div> : null}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Credit Limit</label>
                  <Input value={form.creditLimit} onChange={(e) => setForm((p) => ({ ...p, creditLimit: e.target.value }))} />
                  {fieldErrors.creditLimit ? <div className="text-xs text-red-600">{fieldErrors.creditLimit}</div> : null}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Billing Address</label>
                <Input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">City</label>
                <Input value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">State / Province</label>
                <Input value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Country</label>
                <Input value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Postal Code</label>
                <Input value={form.postalCode} onChange={(e) => setForm((p) => ({ ...p, postalCode: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Tax Type</label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={form.taxType}
                  onChange={(e) => {
                    const v = e.target.value;
                    setForm((p) => ({
                      ...p,
                      taxType: v,
                      taxNumber: v === "VAT_REGISTERED" ? p.taxNumber : "",
                    }));
                  }}
                >
                  <option value="NONE">None</option>
                  <option value="VAT_REGISTERED">VAT Registered</option>
                  <option value="VAT_EXEMPT">VAT Exempt</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-600">Tax / VAT Number</label>
                <Input
                  value={form.taxNumber}
                  onChange={(e) => setForm((p) => ({ ...p, taxNumber: e.target.value }))}
                  disabled={form.taxType !== "VAT_REGISTERED"}
                />
                {fieldErrors.taxNumber ? <div className="text-xs text-red-600">{fieldErrors.taxNumber}</div> : null}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-600">Notes</label>
            <textarea
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-violet-600 hover:bg-violet-700 text-white">
              {saving ? "Saving..." : editingId ? "Save Changes" : "Create Customer"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Dialog from "../components/ui/dialog";
import Input from "../components/ui/input";
import Money from "../components/common/money";
import Pagination from "../components/common/Pagination";
import { Repeat, Plus, Search, Pause, Play, Trash2 } from "lucide-react";
import ActionsMenu from "../components/common/ActionsMenu";
import ListTable from "../components/common/ListTable";
import PageHeader from "../components/common/PageHeader";
import { formatDateForDisplay } from "../lib/dateFormat";

const FREQUENCY_LABELS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  BI_WEEKLY: "Bi-weekly",
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  YEARLY: "Yearly",
};

function formatDate(iso) {
  return formatDateForDisplay(iso);
}

function getFrequencyLabel(freq) {
  return FREQUENCY_LABELS[freq] || freq;
}

export default function RecurringPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const isActive = searchParams.get("isActive") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [createForm, setCreateForm] = useState({
    clientId: "",
    templateName: "",
    frequency: "MONTHLY",
    startDate: "",
    nextRunDate: "",
    endDate: "",
    items: [{ description: "", quantity: "1", unitPrice: "0", discount: "0", taxRate: "0.15" }],
  });
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerOptions, setCustomerOptions] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = { page, limit: 20 };
    if (q) params.q = q;
    if (isActive !== "") params.isActive = isActive;
    api
      .listRecurringInvoices(params)
      .then(setData)
      .catch((e) => setError(e.message || "Failed to load recurring invoices"))
      .finally(() => setLoading(false));
  }, [q, isActive, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setCreateOpen(true);
      setSearchParams((p) => {
        const next = new URLSearchParams(p);
        next.delete("new");
        return next;
      }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fromInvoiceId = searchParams.get("fromInvoice");
    if (!fromInvoiceId) return;

    setError(null);
    api
      .getInvoice(fromInvoiceId)
      .then((inv) => {
        const today = new Date().toISOString().slice(0, 10);
        const startDate = inv.issueDate ? String(inv.issueDate).slice(0, 10) : today;
        const items =
          Array.isArray(inv.items) && inv.items.length > 0
            ? inv.items.map((i) => ({
                description: i.description || "",
                quantity: i.quantity != null ? String(i.quantity) : "1",
                unitPrice: i.unitPrice != null ? String(i.unitPrice) : "0",
                discount: i.discount != null ? String(i.discount) : "0",
                taxRate: i.taxRate != null ? String(i.taxRate) : "0.15",
              }))
            : [{ description: "", quantity: "1", unitPrice: "0", discount: "0", taxRate: "0.15" }];

        setCreateForm({
          clientId: inv.clientId || inv.client?.id || "",
          templateName: inv.invoiceNumber ? `Recurring: ${inv.invoiceNumber}` : "Recurring invoice",
          frequency: "MONTHLY",
          startDate,
          nextRunDate: startDate,
          endDate: "",
          items,
        });
        setCustomerSearch(inv.client?.companyName || inv.client?.contactName || "");
        setCreateOpen(true);
        setEditId(null);
        setSearchParams((p) => {
          const next = new URLSearchParams(p);
          next.delete("fromInvoice");
          return next;
        }, { replace: true });
      })
      .catch((e) => setError(e.message || "Failed to load invoice"));
  }, [searchParams, setSearchParams]);

  async function loadCustomers(search = "") {
    setLoadingCustomers(true);
    try {
      const res = await api.listCustomers({ limit: 30, q: search });
      setCustomerOptions(Array.isArray(res.data) ? res.data : []);
    } catch {
      setCustomerOptions([]);
    } finally {
      setLoadingCustomers(false);
    }
  }

  function handleCustomerSelect(c) {
    setCreateForm((p) => ({ ...p, clientId: c.id }));
    setCustomerSearch(c.companyName || c.contactName || "");
    setCustomerDropdownOpen(false);
  }

  async function handleEditTemplate(r) {
    setError(null);
    try {
      const full = await api.getRecurringInvoice(r.id);
      setEditId(r.id);
      setCreateForm({
        clientId: full.clientId || "",
        templateName: full.templateName || "",
        frequency: full.frequency || "MONTHLY",
        startDate: full.startDate ? String(full.startDate).slice(0, 10) : "",
        nextRunDate: full.nextRunDate ? String(full.nextRunDate).slice(0, 10) : "",
        endDate: full.endDate ? String(full.endDate).slice(0, 10) : "",
        items: [
          {
            description: full.items?.[0]?.description || "",
            quantity: full.items?.[0]?.quantity != null ? String(full.items[0].quantity) : "1",
            unitPrice: full.items?.[0]?.unitPrice != null ? String(full.items[0].unitPrice) : "0",
            discount: full.items?.[0]?.discount != null ? String(full.items[0].discount) : "0",
            taxRate: full.items?.[0]?.taxRate != null ? String(full.items[0].taxRate) : "0.15",
          },
        ],
      });
      setCustomerSearch(full.client?.companyName || full.client?.contactName || "");
      setCustomerOptions([]);
      setCustomerDropdownOpen(false);
      setCreateOpen(true);
    } catch (e) {
      setError(e.message || "Failed to load template");
    }
  }

  async function handleDeleteTemplate(r) {
    const ok = window.confirm(`Delete recurring invoice template "${r.templateName}"?`);
    if (!ok) return;

    setActionId(r.id);
    setError(null);
    try {
      await api.deleteRecurringInvoice(r.id);
      load();
    } catch (e) {
      setError(e.message || "Failed to delete");
    } finally {
      setActionId(null);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    const today = new Date().toISOString().slice(0, 10);
    const startDate = createForm.startDate || today;
    let nextRunDate = createForm.nextRunDate || startDate;
    if (nextRunDate < startDate) nextRunDate = startDate;
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        clientId: createForm.clientId,
        templateName: createForm.templateName.trim(),
        frequency: createForm.frequency,
        intervalValue: 1,
        startDate,
        nextRunDate,
        endDate: createForm.endDate || null,
        isActive: true,
        items: createForm.items.map((i) => ({
          description: i.description.trim() || "Line item",
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          discount: i.discount || "0",
          taxRate: i.taxRate || "0",
        })),
      };

      if (editId) {
        await api.updateRecurringInvoice(editId, payload);
      } else {
        await api.createRecurringInvoice(payload);
      }

      setCreateOpen(false);
      setEditId(null);
      setCreateForm({
        clientId: "",
        templateName: "",
        frequency: "MONTHLY",
        startDate: "",
        nextRunDate: "",
        endDate: "",
        items: [{ description: "", quantity: "1", unitPrice: "0", discount: "0", taxRate: "0.15" }],
      });
      setCustomerSearch("");
      load();
    } catch (e) {
      setError(e.message || (editId ? "Failed to update recurring invoice" : "Failed to create recurring invoice"));
    } finally {
      setSubmitting(false);
    }
  }

  function setPage(p) {
    const next = new URLSearchParams(searchParams);
    if (p <= 1) next.delete("page");
    else next.set("page", String(p));
    setSearchParams(next, { replace: true });
  }

  async function handlePause(r) {
    setActionId(r.id);
    setError(null);
    try {
      await api.pauseRecurringInvoice(r.id);
      load();
    } catch (e) {
      setError(e.message || "Failed to pause");
    } finally {
      setActionId(null);
    }
  }

  async function handleResume(r) {
    setActionId(r.id);
    setError(null);
    try {
      await api.resumeRecurringInvoice(r.id);
      load();
    } catch (e) {
      setError(e.message || "Failed to resume");
    } finally {
      setActionId(null);
    }
  }

  const templates = data?.data || [];
  const selectedCount = selectedIds.size;
  const allIds = templates.map((t) => t.id);
  const allSelected = templates.length > 0 && selectedCount === templates.length;

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(allIds));
  }

  async function handleBulkPause() {
    if (selectedCount === 0) return;
    setActionId("bulk");
    setError(null);
    try {
      for (const id of selectedIds) {
        await api.pauseRecurringInvoice(id);
      }
      setSelectedIds(new Set());
      load();
    } catch (e) {
      setError(e.message || "Failed to pause some templates");
    } finally {
      setActionId(null);
    }
  }

  async function handleBulkResume() {
    if (selectedCount === 0) return;
    setActionId("bulk");
    setError(null);
    try {
      for (const id of selectedIds) {
        await api.resumeRecurringInvoice(id);
      }
      setSelectedIds(new Set());
      load();
    } catch (e) {
      setError(e.message || "Failed to resume some templates");
    } finally {
      setActionId(null);
    }
  }

  async function handleBulkDelete() {
    if (selectedCount === 0) return;
    const ok = window.confirm(`Delete ${selectedCount} selected template(s)? This cannot be undone.`);
    if (!ok) return;
    setActionId("bulk");
    setError(null);
    try {
      for (const id of selectedIds) {
        await api.deleteRecurringInvoice(id);
      }
      setSelectedIds(new Set());
      load();
    } catch (e) {
      setError(e.message || "Failed to delete some templates");
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="space-y-6 min-h-screen">
      <PageHeader
        title="Recurring Invoices"
        subtitle="Track and manage your recurring invoice templates"
        icon={<Repeat className="h-6 w-6 text-violet-600" />}
        action={
          <Button
            onClick={() => {
              setEditId(null);
              setCreateOpen(true);
            }}
            className="h-9 shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        }
      />

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Recurring List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-2.5">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={q}
                onChange={(e) => {
                  const next = e.target.value;
                  const nextParams = new URLSearchParams(searchParams);
                  if (next) nextParams.set("q", next);
                  else nextParams.delete("q");
                  nextParams.delete("page");
                  setSearchParams(nextParams, { replace: true });
                }}
                placeholder="Search by template name…"
                className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
            <select
              value={isActive}
              onChange={(e) => {
                const next = e.target.value;
                const nextParams = new URLSearchParams(searchParams);
                if (next !== "") nextParams.set("isActive", next);
                else nextParams.delete("isActive");
                nextParams.delete("page");
                setSearchParams(nextParams, { replace: true });
              }}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option value="">All</option>
              <option value="true">Active only</option>
              <option value="false">Paused only</option>
            </select>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {selectedCount > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-4 py-2">
              <span className="text-sm font-medium text-violet-800">
                {selectedCount} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-violet-300 text-violet-800 hover:bg-violet-100"
                onClick={handleBulkPause}
                disabled={actionId === "bulk"}
              >
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-violet-300 text-violet-800 hover:bg-violet-100"
                onClick={handleBulkResume}
                disabled={actionId === "bulk"}
              >
                <Play className="h-4 w-4 mr-1" />
                Resume
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-red-200 text-red-700 hover:bg-red-50"
                onClick={handleBulkDelete}
                disabled={actionId === "bulk"}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <Button variant="ghost" size="sm" className="h-8" onClick={() => setSelectedIds(new Set())}>
                Clear selection
              </Button>
            </div>
          )}

          <div className="mt-4 overflow-x-auto">
            <ListTable
              data={templates}
              loading={loading}
              page={page}
              limit={data?.meta?.limit ?? 20}
              emptyComponent={
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-full bg-violet-100 p-4">
                    <Repeat className="h-8 w-8 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">No recurring templates yet</p>
                    <p className="text-sm text-slate-500">Create templates to automate your invoicing</p>
                  </div>
                  <Button onClick={() => setCreateOpen(true)} className="bg-violet-600 hover:bg-violet-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </div>
              }
              selectable
              selectedIds={selectedIds}
              onSelect={toggleSelect}
              onSelectAll={toggleSelectAll}
              allSelected={allSelected}
              getCheckboxLabel={(r) => `Select ${r.templateName}`}
              rowClassName="hover:bg-violet-50/50 transition-colors"
              columns={[
                { key: "templateName", label: "Template", render: (r) => <span className="font-medium text-slate-900">{r.templateName}</span> },
                {
                  key: "customer",
                  label: "Customer",
                  render: (r) => (
                    <Link to={r.clientId ? `/customers/${r.clientId}` : "#"} className="text-sm text-violet-600 hover:text-violet-800 truncate block max-w-[160px]">
                      {r.client?.companyName || r.client?.contactName || "—"}
                    </Link>
                  ),
                },
                {
                  key: "frequency",
                  label: "Frequency",
                  render: (r) => (
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                      {getFrequencyLabel(r.frequency)}
                      {r.intervalValue > 1 ? ` ×${r.intervalValue}` : ""}
                    </span>
                  ),
                },
                { key: "amount", label: "Amount", align: "right", render: (r) => <Money value={r.totalAmount || 0} />, cellClassName: "font-medium tabular-nums" },
                { key: "nextRunDate", label: "Next run", render: (r) => formatDate(r.nextRunDate) },
                {
                  key: "status",
                  label: "Status",
                  render: (r) => (
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${r.isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"}`}>
                      {r.isActive ? "Active" : "Paused"}
                    </span>
                  ),
                },
                {
                  key: "actions",
                  label: "Actions",
                  align: "right",
                  render: (r) => (
                    <div className="flex items-center justify-end">
                      <ActionsMenu
                        ariaLabel="Recurring invoice actions"
                        menuWidthClassName="w-48"
                        items={[
                          r.isActive
                            ? {
                                key: "pause",
                                label: "Pause",
                                disabled: actionId === r.id,
                                onSelect: () => handlePause(r),
                              }
                            : {
                                key: "resume",
                                label: "Resume",
                                disabled: actionId === r.id,
                                onSelect: () => handleResume(r),
                              },
                          { key: "edit", label: "Edit", onSelect: () => handleEditTemplate(r) },
                          { key: "delete", label: "Delete", tone: "danger", onSelect: () => handleDeleteTemplate(r) },
                        ]}
                      />
                    </div>
                  ),
                },
              ]}
            />

            {data?.meta && templates.length > 0 && (
              <Pagination
                page={data.meta.page}
                limit={data.meta.limit}
                total={data.meta.total}
                onPageChange={setPage}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {createOpen && (
        <Dialog
          open={createOpen}
          onOpenChange={(o) => {
            setCreateOpen(o);
            if (!o) setEditId(null);
          }}
          title={editId ? "Edit Recurring Invoice" : "New Recurring Invoice"}
        >
          <form className="space-y-4" onSubmit={handleCreate}>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Customer *</label>
                <div className="relative">
                  <Input
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      loadCustomers(e.target.value);
                    }}
                    onFocus={() => {
                      setCustomerDropdownOpen(true);
                      if (customerSearch) loadCustomers(customerSearch);
                    }}
                    onBlur={() => setTimeout(() => setCustomerDropdownOpen(false), 150)}
                    placeholder="Search customer…"
                    autoComplete="off"
                    className="h-10"
                  />
                  {customerDropdownOpen && customerOptions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg max-h-48 overflow-auto">
                      {customerOptions.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className="w-full px-3 py-2.5 text-left text-sm hover:bg-slate-50"
                          onClick={() => handleCustomerSelect(c)}
                        >
                          {c.companyName || c.contactName || "—"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Template name *</label>
                <Input
                  value={createForm.templateName}
                  onChange={(e) => setCreateForm((p) => ({ ...p, templateName: e.target.value }))}
                  placeholder="e.g. Monthly retainer"
                  required
                  className="h-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Frequency *</label>
                  <select
                    value={createForm.frequency}
                    onChange={(e) => setCreateForm((p) => ({ ...p, frequency: e.target.value }))}
                    className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="BI_WEEKLY">Bi-weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Start date *</label>
                  <Input
                    type="date"
                    value={createForm.startDate}
                    onChange={(e) => {
                      const newStart = e.target.value;
                      setCreateForm((p) => ({
                        ...p,
                        startDate: newStart,
                        nextRunDate: !p.nextRunDate || p.nextRunDate < newStart ? newStart : p.nextRunDate,
                      }));
                    }}
                    required
                    className="h-10"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Line item</label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    value={createForm.items[0]?.description ?? ""}
                    onChange={(e) =>
                      setCreateForm((p) => {
                        const first = { ...(p.items[0] || { quantity: "1", unitPrice: "0", discount: "0", taxRate: "0.15" }), description: e.target.value };
                        return { ...p, items: [first, ...(p.items?.slice(1) || [])] };
                      })
                    }
                    placeholder="Description"
                    className="h-10"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={createForm.items[0]?.quantity ?? "1"}
                    onChange={(e) =>
                      setCreateForm((p) => {
                        const first = { ...(p.items[0] || { description: "", unitPrice: "0", discount: "0", taxRate: "0.15" }), quantity: e.target.value };
                        return { ...p, items: [first, ...(p.items?.slice(1) || [])] };
                      })
                    }
                    placeholder="Qty"
                    className="h-10"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={createForm.items[0]?.unitPrice ?? "0"}
                    onChange={(e) =>
                      setCreateForm((p) => {
                        const first = { ...(p.items[0] || { description: "", quantity: "1", discount: "0", taxRate: "0.15" }), unitPrice: e.target.value };
                        return { ...p, items: [first, ...(p.items?.slice(1) || [])] };
                      })
                    }
                    placeholder="Price"
                    className="h-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={submitting || !createForm.clientId || !createForm.templateName.trim()}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {submitting ? "Creating…" : "Create"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
}

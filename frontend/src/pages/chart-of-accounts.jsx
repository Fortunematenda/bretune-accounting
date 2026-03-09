import React, { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import ListPageToolbar from "../components/common/ListPageToolbar";
import ListTable from "../components/common/ListTable";
import PageHeader from "../components/common/PageHeader";
import Pagination from "../components/common/Pagination";
import { BookOpen, Plus } from "lucide-react";
import Dialog from "../components/ui/dialog";
import ActionsMenu from "../components/common/ActionsMenu";

const ACCOUNT_TYPES = ["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"];

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export default function ChartOfAccountsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [typeFilter, setTypeFilter] = useState("");
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ code: "", name: "", type: "EXPENSE", isActive: true });


  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit };
      if (typeFilter) params.type = typeFilter;
      if (q) params.q = q;
      const res = await api.listLedgerAccounts(params);
      setData(res);
    } catch (e) {
      setError(e.message || "Failed to load chart of accounts");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, typeFilter, q]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingId) {
        await api.updateLedgerAccount(editingId, { name: form.name, isActive: form.isActive });
      } else {
        await api.createLedgerAccount(form);
      }
      setModalOpen(false);
      setEditingId(null);
      setForm({ code: "", name: "", type: "EXPENSE", isActive: true });
      load();
    } catch (e) {
      setError(e.message || "Failed to save account");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this account? Accounts with journal lines cannot be deleted.")) return;
    try {
      await api.deleteLedgerAccount(id);
      load();
    } catch (e) {
      setError(e.message || "Failed to delete account");
    }
  };

  const openEdit = (acc) => {
    setEditingId(acc.id);
    setForm({ code: acc.code, name: acc.name, type: acc.type, isActive: acc.isActive });
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ code: "", name: "", type: "EXPENSE", isActive: true });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 min-h-screen">
      <PageHeader
        title="Chart of Accounts"
        subtitle="Manage your ledger accounts for double-entry bookkeeping"
        icon={<BookOpen className="h-6 w-6 text-violet-600" />}
        action={
          <Button onClick={openCreate} className="h-9 shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        }
      />

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Account List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-2.5">
            <ListPageToolbar
              searchValue={q}
              onSearchChange={setQ}
              searchPlaceholder="Search by code or name"
              limit={limit}
              onLimitChange={setLimit}
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 px-3 text-sm"
            >
              <option value="">All types</option>
              {ACCOUNT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-4 overflow-x-auto">
            <ListTable
              data={data?.data ?? []}
              loading={loading}
              page={page}
              limit={limit}
              emptyMessage="No accounts. System accounts are created automatically when you post transactions."
              columns={[
                { key: "code", label: "Code", render: (acc) => <span className="font-mono text-sm text-slate-700">{acc.code}</span> },
                { key: "name", label: "Name", render: (acc) => acc.name },
                { key: "type", label: "Type", render: (acc) => acc.type },
                {
                  key: "system",
                  label: "System",
                  render: (acc) =>
                    acc.isSystem ? (
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">Yes</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    ),
                },
                {
                  key: "actions",
                  label: "Actions",
                  align: "right",
                  render: (acc) =>
                    !acc.isSystem ? (
                      <div className="flex justify-end">
                        <ActionsMenu
                          ariaLabel="Account actions"
                          items={[
                            { key: "edit", label: "Edit", onSelect: () => openEdit(acc) },
                            { key: "delete", label: "Delete", tone: "danger", onSelect: () => handleDelete(acc.id) },
                          ]}
                        />
                      </div>
                    ) : null,
                },
              ]}
            />
            {data?.meta && data.meta.totalPages > 1 && (
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

      <Dialog open={modalOpen} onOpenChange={setModalOpen} title={editingId ? "Edit Account" : "New Account"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Code</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="e.g. 5100"
              required
              disabled={!!editingId}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="e.g. Office Supplies"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              disabled={!!editingId}
            >
              {ACCOUNT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          {editingId && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              <label htmlFor="isActive" className="text-sm text-slate-700">Active</label>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingId ? "Update" : "Create"}</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

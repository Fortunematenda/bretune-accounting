import React, { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import Pagination from "../components/common/Pagination";
import PageHeader from "../components/common/PageHeader";
import ListTable from "../components/common/ListTable";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Calendar } from "lucide-react";
import ActionsMenu from "../components/common/ActionsMenu";

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

export default function AccountingPeriodsPage() {
  const [data, setData] = useState(null);
  const [lockedThrough, setLockedThrough] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    startDate: new Date().toISOString().slice(0, 7) + "-01",
    endDate: new Date().toISOString().slice(0, 10),
    name: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [periodsRes, lockedRes] = await Promise.all([
        api.listAccountingPeriods({ page, limit: 20 }),
        api.getLockedThrough(),
      ]);
      setData(periodsRes);
      setLockedThrough(lockedRes?.lockedThrough || null);
    } catch (e) {
      setError(e.message || "Failed to load periods");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.createAccountingPeriod(form);
      setModalOpen(false);
      setForm({
        startDate: new Date().toISOString().slice(0, 7) + "-01",
        endDate: new Date().toISOString().slice(0, 10),
        name: "",
      });
      load();
    } catch (e) {
      setError(e.message || "Failed to create period");
    }
  };

  const handleClose = async (id) => {
    if (!confirm("Close this period? No new journal entries will be allowed with dates in this range.")) return;
    try {
      await api.closeAccountingPeriod(id);
      load();
    } catch (e) {
      setError(e.message || "Failed to close");
    }
  };

  const handleReopen = async (id) => {
    if (!confirm("Reopen this period? Posting will be allowed again.")) return;
    try {
      await api.reopenAccountingPeriod(id);
      load();
    } catch (e) {
      setError(e.message || "Failed to reopen");
    }
  };

  return (
    <div className="space-y-6 min-h-screen">
      <PageHeader
        title="Accounting Periods"
        subtitle={
          <>
            Manage period close. Closed periods block new journal entries.
            {lockedThrough && (
              <span className="ml-2 text-amber-600 font-medium">
                Locked through: {lockedThrough}
              </span>
            )}
          </>
        }
        icon={<Calendar className="h-6 w-6 text-violet-600" />}
        action={
          <Button onClick={() => setModalOpen(true)} className="h-9 shrink-0 gap-2">
            <Calendar className="h-4 w-4" />
            Add Period
          </Button>
        }
      />

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Accounting Period List</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <ListTable
            data={data?.data ?? []}
            loading={loading}
            page={page}
            limit={20}
            emptyMessage="No periods defined. Add one to enable period close."
            columns={[
              { key: "name", label: "Name", render: (p) => p.name || "—" },
              { key: "startDate", label: "Start", render: (p) => formatDate(p.startDate) },
              { key: "endDate", label: "End", render: (p) => formatDate(p.endDate) },
              {
                key: "status",
                label: "Status",
                render: (p) => (
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${p.status === "CLOSED" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                    {p.status}
                  </span>
                ),
              },
              {
                key: "actions",
                label: "Actions",
                align: "right",
                render: (p) => (
                  <div className="flex justify-end">
                    <ActionsMenu
                      ariaLabel="Period actions"
                      items={[
                        p.status === "OPEN"
                          ? { key: "close", label: "Close Period", onSelect: () => handleClose(p.id) }
                          : { key: "reopen", label: "Reopen Period", onSelect: () => handleReopen(p.id) },
                      ]}
                    />
                  </div>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Add Accounting Period</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="e.g. January 2025"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

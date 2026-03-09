import React, { useMemo, useState } from "react";
import { Plus, Tags } from "lucide-react";
import ActionsMenu from "../components/common/ActionsMenu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import Dialog from "../components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";

function CategoryForm({ values, onChange }) {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-600">Name</label>
        <Input value={values.name} onChange={(e) => onChange({ name: e.target.value })} placeholder="e.g. Travel" />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-600">Default tax rate %</label>
        <Input
          type="number"
          value={values.defaultTaxRate}
          onChange={(e) => onChange({ defaultTaxRate: e.target.value })}
          className="text-right"
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-600">Linked ledger account</label>
        <Input
          value={values.ledgerAccount}
          onChange={(e) => onChange({ ledgerAccount: e.target.value })}
          placeholder="e.g. 6000 - Office Expenses"
        />
      </div>
    </div>
  );
}

export default function ExpenseCategoriesPage() {
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ["expenseCategories"],
    queryFn: () => api.listExpenseCategories({ page: 1, limit: 1000 }),
    staleTime: 30_000,
  });

  const createMutation = useMutation({
    mutationFn: (payload) => api.createExpenseCategory(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.updateExpenseCategory(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteExpenseCategory(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
    },
  });

  const rows = categoriesQuery.data?.data || [];

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", defaultTaxRate: "0", ledgerAccount: "" });

  const busy = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const title = useMemo(() => (editing ? "Edit Category" : "New Category"), [editing]);

  function openNew() {
    setEditing(null);
    setForm({ name: "", defaultTaxRate: "0", ledgerAccount: "" });
    setModalOpen(true);
  }

  function openEdit(c) {
    setEditing(c);
    setForm({
      name: c?.name || "",
      defaultTaxRate: c?.defaultTaxRate != null ? String(c.defaultTaxRate) : "0",
      ledgerAccount: c?.ledgerAccount || "",
    });
    setModalOpen(true);
  }

  async function save() {
    const payload = {
      name: String(form.name || "").trim(),
      defaultTaxRate: String(form.defaultTaxRate || "0"),
      ledgerAccount: String(form.ledgerAccount || "").trim() || null,
    };

    if (!payload.name) return;

    if (editing?.id) await updateMutation.mutateAsync({ id: editing.id, payload });
    else await createMutation.mutateAsync(payload);

    setModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Expense Categories</h1>
              <p className="mt-1 text-sm text-slate-500">Maintain your expense categories and default tax rates</p>
            </div>
            <Button onClick={openNew} className="h-9 bg-violet-600 hover:bg-violet-700">
              <Plus className="h-4 w-4 mr-2" />
              New Category
            </Button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {categoriesQuery.error ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {categoriesQuery.error?.message || "Failed to load categories"}
            </div>
          ) : null}

          <Card className="shadow-sm hover:translate-y-0">
            <CardHeader>
              <CardTitle>
                <span className="inline-flex items-center gap-2">
                  <Tags className="h-4 w-4 text-slate-500" />
                  Categories
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoriesQuery.isLoading ? (
                <div className="text-sm text-slate-600">Loading…</div>
              ) : rows.length === 0 ? (
                <div className="text-sm text-slate-600">No categories yet.</div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Default Tax %</TableHead>
                        <TableHead>Ledger Account</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium text-slate-900 dark:text-slate-100">{c.name}</TableCell>
                          <TableCell className="text-right text-slate-600 dark:text-slate-300">
                            {c.defaultTaxRate != null ? String(c.defaultTaxRate) : "0"}
                          </TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-300">{c.ledgerAccount || "—"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end">
                              <ActionsMenu
                                ariaLabel="Category actions"
                                items={[
                                  { key: "edit", label: "Edit", disabled: busy, onSelect: () => openEdit(c) },
                                  {
                                    key: "delete",
                                    label: "Delete",
                                    tone: "danger",
                                    disabled: busy,
                                    onSelect: () => {
                                      const ok = window.confirm(`Delete category "${c.name}"?`);
                                      if (!ok) return;
                                      deleteMutation.mutate(c.id);
                                    },
                                  },
                                ]}
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={title}
        className="max-w-md"
      >
        <CategoryForm values={form} onChange={(p) => setForm((prev) => ({ ...prev, ...p }))} />

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setModalOpen(false)} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={save} className="bg-violet-600 hover:bg-violet-700" disabled={busy || !String(form.name || "").trim()}>
            {busy ? "Saving…" : "Save"}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

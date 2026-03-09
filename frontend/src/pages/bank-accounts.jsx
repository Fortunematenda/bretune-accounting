import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import Money from "../components/common/money";
import PageHeader from "../components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Building2, ChevronRight, Plus } from "lucide-react";
import Dialog from "../components/ui/dialog";
import { formatRecordDisplayId } from "../lib/utils";

export default function BankAccountsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    accountHolder: "",
    branchCode: "",
    currency: "ZAR",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.listBankAccounts({ limit: 100 });
      setData(res);
    } catch (e) {
      setError(e?.message || "Failed to load bank accounts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.createBankAccount(form);
      setModalOpen(false);
      setForm({ bankName: "", accountName: "", accountNumber: "", accountHolder: "", branchCode: "", currency: "ZAR" });
      load();
    } catch (e) {
      setError(e?.message || "Failed to add bank account");
    }
  };

  const accounts = data?.data ?? [];

  return (
    <div className="space-y-6 min-h-screen">
      <PageHeader
        title="Business Bank Accounts"
        subtitle="Add your bank accounts and sync statements for reconciliation"
        icon={<Building2 className="h-6 w-6 text-violet-600" />}
        action={
          <Button onClick={() => setModalOpen(true)} className="h-9 shrink-0 gap-2">
            <Plus className="h-4 w-4" />
            Add Bank Account
          </Button>
        }
      />

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Bank Account List</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-sm text-slate-500">Loading…</div>
          ) : accounts.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-16 text-center">
              <Building2 className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-base font-medium text-slate-700">No bank accounts yet</h3>
              <p className="mt-2 text-sm text-slate-500">
                Add your business bank account to import statements and reconcile with your ledger.
              </p>
              <Button onClick={() => setModalOpen(true)} className="mt-6 gap-2">
                <Plus className="h-4 w-4" />
                Add Bank Account
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {accounts.map((acc, index) => {
                const displayId = formatRecordDisplayId(acc, { page: 1, limit: accounts.length, index });
                return (
                <div
                  key={acc.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-violet-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{acc.bankName}</h3>
                      <p className="mt-0.5 text-sm text-slate-600">{acc.accountName}</p>
                      {acc.accountNumber ? (
                        <p className="mt-1 text-xs text-slate-500">
                          •••• {String(acc.accountNumber).slice(-4)}
                        </p>
                      ) : null}
                      <p className="mt-1 text-xs font-mono text-violet-600 font-medium" title={acc.id}>ID: {displayId}</p>
                    </div>
                    <Link
                      to={`/bank-reconciliation?bankAccountId=${acc.id}`}
                      className="inline-flex items-center gap-1 text-violet-600 hover:text-violet-800 text-sm font-medium"
                    >
                      Reconcile
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <Link
                      to={`/bank-reconciliation?bankAccountId=${acc.id}`}
                      className="inline-flex h-8 items-center rounded-lg bg-violet-600 px-3 text-sm font-medium text-white hover:bg-violet-700"
                    >
                      Import statement
                    </Link>
                  </div>
                </div>
              );})}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={modalOpen} onOpenChange={setModalOpen} title="Add Bank Account" className="max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Bank name</label>
            <Input
              value={form.bankName}
              onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))}
              placeholder="e.g. First National Bank"
              required
              className="h-10"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Account name</label>
            <Input
              value={form.accountName}
              onChange={(e) => setForm((f) => ({ ...f, accountName: e.target.value }))}
              placeholder="e.g. Business Operating"
              required
              className="h-10"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Account number</label>
            <Input
              value={form.accountNumber}
              onChange={(e) => setForm((f) => ({ ...f, accountNumber: e.target.value }))}
              placeholder="Last 4 digits or full (optional)"
              className="h-10"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Account holder</label>
            <Input
              value={form.accountHolder}
              onChange={(e) => setForm((f) => ({ ...f, accountHolder: e.target.value }))}
              placeholder="Optional"
              className="h-10"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Branch code</label>
            <Input
              value={form.branchCode}
              onChange={(e) => setForm((f) => ({ ...f, branchCode: e.target.value }))}
              placeholder="Optional"
              className="h-10"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit">Add Bank Account</Button>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

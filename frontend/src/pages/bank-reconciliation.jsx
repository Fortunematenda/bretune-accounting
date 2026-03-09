import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import Money from "../components/common/money";
import Pagination from "../components/common/Pagination";
import PageHeader from "../components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import ListTable from "../components/common/ListTable";
import { Plus, Upload, Wallet } from "lucide-react";
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

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const dateIdx = headers.findIndex((h) => h.includes("date"));
  const descIdx = headers.findIndex((h) => h.includes("desc") || h.includes("memo") || h.includes("detail"));
  const refIdx = headers.findIndex((h) => h.includes("ref") || h.includes("reference"));
  const amtIdx = headers.findIndex((h) => h.includes("amount") || h.includes("debit") || h.includes("credit") || h.includes("value"));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
    const date = dateIdx >= 0 ? cells[dateIdx] : "";
    const description = descIdx >= 0 ? cells[descIdx] : "";
    const reference = refIdx >= 0 ? cells[refIdx] : "";
    let amount = amtIdx >= 0 ? parseFloat(String(cells[amtIdx] || "0").replace(/[^\d.-]/g, "")) || 0 : 0;
    if (headers.some((h) => h.includes("credit") && h.includes("debit"))) {
      const creditIdx = headers.findIndex((h) => h.includes("credit"));
      const debitIdx = headers.findIndex((h) => h.includes("debit"));
      const credit = creditIdx >= 0 ? parseFloat(String(cells[creditIdx] || "0").replace(/[^\d.-]/g, "")) || 0 : 0;
      const debit = debitIdx >= 0 ? parseFloat(String(cells[debitIdx] || "0").replace(/[^\d.-]/g, "")) || 0 : 0;
      amount = credit > 0 ? credit : -debit;
    }
    if (date || description || reference || amount !== 0) {
      rows.push({ date, description, reference, amount });
    }
  }
  return rows;
}

export default function BankReconciliationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bankAccountIdParam = searchParams.get("bankAccountId");
  const [data, setData] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [form, setForm] = useState({
    bankAccountId: bankAccountIdParam || "",
    accountCode: "1000",
    statementDate: new Date().toISOString().slice(0, 10),
    openingBalance: "",
    closingBalance: "",
    lines: [],
  });
  const [importForm, setImportForm] = useState({
    bankAccountId: bankAccountIdParam || "",
    accountCode: "1000",
    statementDate: new Date().toISOString().slice(0, 10),
    openingBalance: "",
    closingBalance: "",
    file: null,
    parsedLines: [],
    isPdf: false,
  });
  const [pdfPreview, setPdfPreview] = useState(null);
  const [parsingPdf, setParsingPdf] = useState(false);
  const [reverseAmountSigns, setReverseAmountSigns] = useState(false);

  useEffect(() => {
    setForm((f) => ({ ...f, bankAccountId: bankAccountIdParam || f.bankAccountId }));
    setImportForm((f) => ({ ...f, bankAccountId: bankAccountIdParam || f.bankAccountId }));
  }, [bankAccountIdParam]);

  const loadBankAccounts = useCallback(async () => {
    try {
      const res = await api.listBankAccounts({ limit: 100 });
      setBankAccounts(res?.data ?? []);
    } catch {
      setBankAccounts([]);
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 20 };
      if (bankAccountIdParam) params.bankAccountId = bankAccountIdParam;
      const res = await api.listBankReconciliations(params);
      setData(res);
    } catch (e) {
      setError(e.message || "Failed to load reconciliations");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, bankAccountIdParam]);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    loadBankAccounts();
  }, [loadBankAccounts]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        statementDate: form.statementDate,
        openingBalance: form.openingBalance || "0",
        closingBalance: form.closingBalance || "0",
        lines: form.lines.filter((l) => l.amount && Number(l.amount) !== 0),
      };
      if (form.bankAccountId) payload.bankAccountId = form.bankAccountId;
      else payload.accountCode = form.accountCode;
      const rec = await api.createBankReconciliation(payload);
      setModalOpen(false);
      setForm({
        bankAccountId: bankAccountIdParam || "",
        accountCode: "1000",
        statementDate: new Date().toISOString().slice(0, 10),
        openingBalance: "",
        closingBalance: "",
        lines: [],
      });
      navigate(`/bank-reconciliation/${rec.id}`);
    } catch (e) {
      setError(e.message || "Failed to create reconciliation");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    const isPdf = (file.name || "").toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
    if (isPdf) {
      setImportForm((f) => ({ ...f, file, parsedLines: [], isPdf: true }));
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        const lines = parseCSV(reader.result || "");
        setImportForm((f) => ({ ...f, file, parsedLines: lines, isPdf: false }));
      };
      reader.readAsText(file);
    }
  };

  const handleParsePdf = async (e) => {
    e.preventDefault();
    if (!importForm.file || !importForm.isPdf) return;
    setError(null);
    setParsingPdf(true);
    try {
      const formData = new FormData();
      formData.append("file", importForm.file);
      if (importForm.statementDate) formData.append("statementDate", importForm.statementDate);
      const preview = await api.importBankStatementPdfPreview(formData);
      setPdfPreview(preview);
    } catch (err) {
      setError(err.message || "Failed to parse PDF");
    } finally {
      setParsingPdf(false);
    }
  };

  const handleConfirmPdfImport = async (e) => {
    e.preventDefault();
    if (!pdfPreview) return;
    setError(null);
    try {
      const lines = (pdfPreview.lines ?? []).map((l) => ({
        ...l,
        amount: reverseAmountSigns ? -Number(l.amount) : l.amount,
      }));
      const payload = {
        statementDate: importForm.statementDate,
        openingBalance: String(pdfPreview.openingBalance ?? importForm.openingBalance ?? 0),
        closingBalance: String(pdfPreview.closingBalance ?? importForm.closingBalance ?? 0),
        lines,
      };
      if (importForm.bankAccountId) payload.bankAccountId = importForm.bankAccountId;
      else payload.accountCode = importForm.accountCode || "1000";
      const rec = await api.importBankStatement(payload);
      setImportOpen(false);
      setPdfPreview(null);
      setReverseAmountSigns(false);
      setImportForm({
        bankAccountId: bankAccountIdParam || "",
        accountCode: "1000",
        statementDate: new Date().toISOString().slice(0, 10),
        openingBalance: "",
        closingBalance: "",
        file: null,
        parsedLines: [],
        isPdf: false,
      });
      navigate(`/bank-reconciliation/${rec.id}`);
    } catch (err) {
      setError(err.message || "Failed to import");
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (importForm.isPdf && importForm.file && !pdfPreview) {
        await handleParsePdf(e);
      } else if (pdfPreview) {
        await handleConfirmPdfImport(e);
      } else {
        const payload = {
          statementDate: importForm.statementDate,
          openingBalance: importForm.openingBalance || "0",
          closingBalance: importForm.closingBalance || "0",
          lines: importForm.parsedLines,
        };
        if (importForm.bankAccountId) payload.bankAccountId = importForm.bankAccountId;
        else payload.accountCode = importForm.accountCode;
        const rec = await api.importBankStatement(payload);
        setImportOpen(false);
        setImportForm({
          bankAccountId: bankAccountIdParam || "",
          accountCode: "1000",
          statementDate: new Date().toISOString().slice(0, 10),
          openingBalance: "",
          closingBalance: "",
          file: null,
          parsedLines: [],
          isPdf: false,
        });
        navigate(`/bank-reconciliation/${rec.id}`);
      }
    } catch (err) {
      setError(err.message || "Failed to import statement");
    }
  };

  return (
    <div className="space-y-6 min-h-screen">
      <PageHeader
        title="Bank Reconciliation"
        subtitle="Match bank statements to your ledger transactions"
        icon={<Wallet className="h-6 w-6 text-violet-600" />}
        actions={
          <>
            <Button variant="outline" onClick={() => setImportOpen(true)} className="h-9 shrink-0 gap-2">
              <Upload className="h-4 w-4" />
              Import Statement
            </Button>
            <Button onClick={() => setModalOpen(true)} className="h-9 shrink-0 gap-2">
              <Plus className="h-4 w-4" />
              New Reconciliation
            </Button>
          </>
        }
      />

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Reconciliation List</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-4">
            <ListTable
              data={data?.data ?? []}
              loading={loading}
              page={page}
              limit={data?.meta?.limit ?? 20}
              emptyMessage="No reconciliations yet. Create one to match your bank statement."
              columns={[
                { key: "statementDate", label: "Statement Date", render: (rec) => formatDate(rec.statementDate) },
                { key: "account", label: "Account", render: (rec) => rec.bankAccount ? `${rec.bankAccount.bankName} (${rec.accountCode})` : rec.accountCode, cellClassName: "font-mono text-sm text-slate-600" },
                { key: "openingBalance", label: "Opening", align: "right", render: (rec) => <Money value={rec.openingBalance} />, cellClassName: "tabular-nums" },
                { key: "closingBalance", label: "Closing", align: "right", render: (rec) => <Money value={rec.closingBalance} />, cellClassName: "tabular-nums" },
                {
                  key: "status",
                  label: "Status",
                  render: (rec) => (
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${rec.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                      {rec.status}
                    </span>
                  ),
                },
                {
                  key: "actions",
                  label: "Actions",
                  align: "right",
                  render: (rec) => (
                    <div className="flex justify-end">
                      <ActionsMenu
                        ariaLabel="Reconciliation actions"
                        items={[
                          { key: "view", label: "View", onSelect: () => navigate(`/bank-reconciliation/${rec.id}`) },
                        ]}
                      />
                    </div>
                  ),
                },
              ]}
            />
          </div>
          {data?.meta && data.meta.totalPages > 1 && (
            <Pagination
              page={data.meta.page}
              limit={data.meta.limit}
              total={data.meta.total}
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">New Reconciliation</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              {bankAccounts.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bank Account</label>
                  <select
                    value={form.bankAccountId}
                    onChange={(e) => setForm((f) => ({ ...f, bankAccountId: e.target.value, accountCode: e.target.value ? "" : "1000" }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    <option value="">Use ledger account code</option>
                    {bankAccounts.map((b) => (
                      <option key={b.id} value={b.id}>{b.bankName} – {b.accountName}</option>
                    ))}
                  </select>
                </div>
              )}
              {!form.bankAccountId && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ledger Account Code</label>
                  <Input value={form.accountCode} onChange={(e) => setForm((f) => ({ ...f, accountCode: e.target.value }))} placeholder="1000" className="h-10" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Statement Date</label>
                <input
                  type="date"
                  value={form.statementDate}
                  onChange={(e) => setForm((f) => ({ ...f, statementDate: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Opening Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.openingBalance}
                  onChange={(e) => setForm((f) => ({ ...f, openingBalance: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Closing Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.closingBalance}
                  onChange={(e) => setForm((f) => ({ ...f, closingBalance: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="0.00"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {importOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            {pdfPreview ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900">Review Extracted Data</h2>
                <p className="text-sm text-slate-600">
                  Check that transactions and amounts match your statement. Cancel if anything looks wrong.
                </p>
                <div className="rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 text-sm text-slate-700">
                  Opening: <Money value={pdfPreview.openingBalance ?? 0} /> → Closing: <Money value={pdfPreview.closingBalance ?? 0} />
                </div>
                <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200">
                  <table className="min-w-full text-sm">
                    <thead className="bg-slate-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600">Date</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600">Description</th>
                        <th className="px-3 py-2 text-right font-semibold text-slate-600">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(pdfPreview.lines ?? []).map((l, i) => (
                        <tr key={i}>
                          <td className="px-3 py-1.5">{l.date}</td>
                          <td className="px-3 py-1.5">{l.description || "—"}</td>
                          <td className="px-3 py-1.5 text-right tabular-nums">
                            <Money value={reverseAmountSigns ? -Number(l.amount) : l.amount} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={reverseAmountSigns}
                    onChange={(e) => setReverseAmountSigns(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  Amounts look inverted? Reverse signs (e.g. deposits show as negative)
                </label>
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
                )}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => { setPdfPreview(null); setError(null); setReverseAmountSigns(false); }}>
                    Back
                  </Button>
                  <Button onClick={handleConfirmPdfImport}>Confirm & Import</Button>
                </div>
              </div>
            ) : (
            <form onSubmit={handleImport} className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Import Bank Statement</h2>
            <p className="text-sm text-slate-600">
              Upload a CSV or PDF. For PDFs, click Parse & Preview to review extracted data before importing.
            </p>
              {bankAccounts.length > 0 ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bank Account</label>
                  <select
                    value={importForm.bankAccountId}
                    onChange={(e) => setImportForm((f) => ({ ...f, bankAccountId: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    <option value="">Select bank account</option>
                    {bankAccounts.map((b) => (
                      <option key={b.id} value={b.id}>{b.bankName} – {b.accountName}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ledger Account Code</label>
                  <Input value={importForm.accountCode} onChange={(e) => setImportForm((f) => ({ ...f, accountCode: e.target.value }))} className="h-10" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Statement Date</label>
                <input
                  type="date"
                  value={importForm.statementDate}
                  onChange={(e) => setImportForm((f) => ({ ...f, statementDate: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Opening Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={importForm.openingBalance}
                  onChange={(e) => setImportForm((f) => ({ ...f, openingBalance: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Closing Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={importForm.closingBalance}
                  onChange={(e) => setImportForm((f) => ({ ...f, closingBalance: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CSV or PDF File</label>
                <input
                  type="file"
                  accept=".csv,.pdf,application/pdf"
                  onChange={handleFileChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm file:mr-2 file:rounded file:border-0 file:bg-violet-50 file:px-3 file:py-1 file:text-violet-700"
                />
                {importForm.isPdf && importForm.file && (
                  <p className="mt-1 text-xs text-slate-500">PDF ready: {importForm.file.name}</p>
                )}
                {!importForm.isPdf && importForm.parsedLines.length > 0 && (
                  <p className="mt-1 text-xs text-slate-500">{importForm.parsedLines.length} lines parsed</p>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => { setImportOpen(false); setPdfPreview(null); setError(null); setReverseAmountSigns(false); }}>Cancel</Button>
                <Button
                  type="submit"
                  disabled={!(importForm.file && (importForm.isPdf || importForm.parsedLines.length > 0)) || parsingPdf}
                >
                  {parsingPdf ? "Parsing…" : importForm.isPdf ? "Parse & Preview" : "Import & Reconcile"}
                </Button>
              </div>
            </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

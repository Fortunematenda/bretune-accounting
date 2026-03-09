import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

export default function JournalEntryFormPage() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [memo, setMemo] = useState("");
  const [saveAsDraft, setSaveAsDraft] = useState(true);
  const [lines, setLines] = useState([
    { accountCode: "", debit: "", credit: "" },
    { accountCode: "", debit: "", credit: "" },
  ]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.listLedgerAccounts({ limit: 500 });
        setAccounts(res?.data || []);
      } catch (e) {
        setError(e.message || "Failed to load accounts");
      }
    })();
  }, []);

  const addLine = () => {
    setLines((prev) => [...prev, { accountCode: "", debit: "", credit: "" }]);
  };

  const removeLine = (idx) => {
    if (lines.length <= 2) return;
    setLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateLine = (idx, field, value) => {
    setLines((prev) =>
      prev.map((l, i) =>
        i === idx ? { ...l, [field]: value } : l
      )
    );
  };

  const validate = () => {
    for (let i = 0; i < lines.length; i++) {
      if (!lines[i].accountCode) {
        setError(`Line ${i + 1}: Select an account`);
        return false;
      }
      const d = Number(lines[i].debit || 0);
      const c = Number(lines[i].credit || 0);
      if (d <= 0 && c <= 0) {
        setError(`Line ${i + 1}: Enter a debit or credit amount`);
        return false;
      }
      if (d > 0 && c > 0) {
        setError(`Line ${i + 1}: Cannot have both debit and credit`);
        return false;
      }
    }
    let totalDebit = 0;
    let totalCredit = 0;
    for (const l of lines) {
      totalDebit += Number(l.debit || 0);
      totalCredit += Number(l.credit || 0);
    }
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      setError("Total debits must equal total credits");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    const payload = {
      date,
      memo: memo.trim() || null,
      status: saveAsDraft ? "DRAFT" : "POSTED",
      lines: lines
        .filter((l) => l.accountCode && (Number(l.debit) > 0 || Number(l.credit) > 0))
        .map((l) => ({
          accountCode: l.accountCode,
          debit: String(Number(l.debit) || 0),
          credit: String(Number(l.credit) || 0),
        })),
    };

    setLoading(true);
    try {
      const created = await api.createJournalEntry(payload);
      navigate(`/journal/${created.id}`);
    } catch (e) {
      setError(e.message || "Failed to create journal entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <a
          href="/journal"
          onClick={(e) => {
            e.preventDefault();
            navigate("/journal");
          }}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Journal
        </a>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
          <h1 className="text-xl font-semibold text-slate-900">New Journal Entry</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create a manual journal entry. Debits must equal credits.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Memo</label>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="e.g. Year-end adjustment"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">Journal Lines</label>
              <Button type="button" variant="outline" size="sm" onClick={addLine} className="gap-1">
                <Plus className="h-4 w-4" /> Add line
              </Button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 w-48">
                      Account
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 w-32">
                      Debit
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 w-32">
                      Credit
                    </th>
                    <th className="px-4 py-3 w-12" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {lines.map((line, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/30">
                      <td className="px-4 py-2">
                        <select
                          value={line.accountCode}
                          onChange={(e) => updateLine(idx, "accountCode", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                          required
                        >
                          <option value="">Select account</option>
                          {accounts.map((acc) => (
                            <option key={acc.id} value={acc.code}>
                              {acc.code} – {acc.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={line.debit}
                          onChange={(e) => {
                            updateLine(idx, "debit", e.target.value);
                            if (line.credit) updateLine(idx, "credit", "");
                          }}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={line.credit}
                          onChange={(e) => {
                            updateLine(idx, "credit", e.target.value);
                            if (line.debit) updateLine(idx, "debit", "");
                          }}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-right"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLine(idx)}
                          disabled={lines.length <= 2}
                          title="Remove line"
                        >
                          <Trash2 className="h-4 w-4 text-slate-400" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={saveAsDraft}
              onChange={(e) => setSaveAsDraft(e.target.checked)}
              className="rounded border-slate-300"
            />
            Save as draft (requires approval before posting)
          </label>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate("/journal")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? saveAsDraft ? "Saving…" : "Posting…"
                : saveAsDraft ? "Save as Draft" : "Post Entry"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

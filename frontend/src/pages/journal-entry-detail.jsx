import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Money from "../components/common/money";
import { ArrowLeft } from "lucide-react";
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

const SOURCE_LABELS = {
  INVOICE: "Invoice",
  PAYMENT: "Payment",
  BILL: "Bill",
  SUPPLIER_PAYMENT: "Supplier Payment",
  EXPENSE: "Expense",
  MANUAL: "General Journal",
};

export default function JournalEntryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reversing, setReversing] = useState(false);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getJournalEntry(id);
        if (!cancelled) setEntry(res);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load journal entry");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const handleApprove = async () => {
    setApproving(true);
    setError(null);
    try {
      const approved = await api.approveJournalEntry(id);
      setEntry(approved);
    } catch (e) {
      setError(e.message || "Failed to approve");
    } finally {
      setApproving(false);
    }
  };

  const handleReverse = async () => {
    if (!confirm("Reverse this journal entry? A reversing entry will be created.")) return;
    setReversing(true);
    setError(null);
    try {
      const reversal = await api.reverseJournalEntry(id);
      navigate(`/journal/${reversal.id}`);
    } catch (e) {
      setError(e.message || "Failed to reverse entry");
    } finally {
      setReversing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="space-y-4">
        <Link to="/journal" className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-800 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Journal
        </Link>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error || "Journal entry not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/journal"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Journal
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                {entry.entryNumber}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {formatDate(entry.date)} • {SOURCE_LABELS[entry.sourceType] || entry.sourceType || "Manual"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  entry.status === "REVERSED"
                    ? "bg-amber-100 text-amber-800"
                    : entry.status === "DRAFT" || entry.status === "PENDING_APPROVAL"
                      ? "bg-slate-100 text-slate-700"
                      : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {entry.status}
              </span>
              {(entry.status === "DRAFT" || entry.status === "PENDING_APPROVAL" || (entry.status === "POSTED" && !entry.reversedEntryId)) && (
                <ActionsMenu
                  ariaLabel="Journal entry actions"
                  menuWidthClassName="w-44"
                  items={[
                    (entry.status === "DRAFT" || entry.status === "PENDING_APPROVAL") && {
                      key: "approve",
                      label: approving ? "Approving…" : "Approve",
                      disabled: approving,
                      onSelect: handleApprove,
                    },
                    (entry.status === "POSTED" && !entry.reversedEntryId) && {
                      key: "reverse",
                      label: reversing ? "Reversing…" : "Reverse entry",
                      disabled: reversing,
                      tone: "danger",
                      onSelect: handleReverse,
                    },
                  ].filter(Boolean)}
                />
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="text-xs font-medium uppercase text-slate-500">Memo</label>
            <p className="mt-1 text-slate-900">{entry.memo || "—"}</p>
          </div>
          {entry.createdBy && (
            <div>
              <label className="text-xs font-medium uppercase text-slate-500">Created by</label>
              <p className="mt-1 text-slate-900">
                {entry.createdBy.firstName} {entry.createdBy.lastName}
              </p>
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-slate-200 mt-4">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Account
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Debit
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Credit
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {entry.lines?.map((line) => (
                  <tr key={line.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <span className="font-mono text-slate-600">{line.account?.code}</span>
                      <span className="ml-2 text-slate-900">{line.account?.name}</span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {Number(line.debit || 0) > 0 ? (
                        <Money value={line.debit} />
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {Number(line.credit || 0) > 0 ? (
                        <Money value={line.credit} />
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {entry.reversedEntry && (
            <div className="mt-4 p-4 rounded-lg border border-amber-200 bg-amber-50">
              <p className="text-sm font-medium text-amber-800">Reversed by</p>
              <Link
                to={`/journal/${entry.reversedEntry.id}`}
                className="mt-1 inline-flex items-center gap-1 text-violet-600 hover:text-violet-800 text-sm font-medium"
              >
                {entry.reversedEntry.entryNumber} ({formatDate(entry.reversedEntry.date)})
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

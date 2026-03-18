import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import Money from "../components/common/money";
import StatusBadge from "../components/common/StatusBadge";
import { ArrowLeft, BookOpen } from "lucide-react";
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
      <div className="py-12 text-center text-sm text-slate-500">Loading…</div>
    );
  }

  if (error || !entry) {
    return (
      <div className="space-y-4">
        <nav className="mb-4">
          <Link to="/journal" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Journal
          </Link>
        </nav>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error || "Journal entry not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <Link
          to="/journal"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Journal
        </Link>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
        <div className="flex items-start gap-3 min-w-0">
          <div className="h-11 w-11 rounded-lg bg-violet-50 ring-1 ring-violet-100 flex items-center justify-center shrink-0">
            <BookOpen className="h-5 w-5 text-violet-600" strokeWidth={1.7} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-semibold text-slate-900">{entry.entryNumber}</h1>
              <StatusBadge status={entry.status} />
            </div>
            <p className="mt-0.5 text-sm text-slate-500">
              {formatDate(entry.date)} · {SOURCE_LABELS[entry.sourceType] || entry.sourceType || "Manual"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {(entry.status === "DRAFT" || entry.status === "PENDING_APPROVAL" || (entry.status === "POSTED" && !entry.reversedEntryId)) && (
            <ActionsMenu
              ariaLabel="Journal entry actions"
              buttonClassName="h-9 w-9"
              menuWidthClassName="w-48"
              items={[
                (entry.status === "DRAFT" || entry.status === "PENDING_APPROVAL") && {
                  key: "approve",
                  label: approving ? "Approving…" : "Approve",
                  disabled: approving,
                  onSelect: handleApprove,
                },
                (entry.status === "POSTED" && !entry.reversedEntryId) && {
                  key: "reverse",
                  label: reversing ? "Reversing…" : "Reverse Entry",
                  disabled: reversing,
                  tone: "danger",
                  onSelect: handleReverse,
                },
              ].filter(Boolean)}
            />
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600 mb-4">
          {error}
        </div>
      )}

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg border border-slate-200/80 bg-white p-4">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Memo</div>
          <p className="mt-1 text-sm text-slate-800">{entry.memo || "—"}</p>
        </div>
        {entry.createdBy && (
          <div className="rounded-lg border border-slate-200/80 bg-white p-4">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Created by</div>
            <p className="mt-1 text-sm text-slate-800">
              {entry.createdBy.firstName} {entry.createdBy.lastName}
            </p>
          </div>
        )}
      </div>

      {/* Lines table */}
      <div className="overflow-hidden rounded-lg border border-slate-200/80">
        <table className="min-w-full text-[13px]">
          <thead className="bg-slate-50/80">
            <tr className="border-b border-slate-200/80">
              <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Account</th>
              <th className="py-2.5 px-3 text-right text-xs font-medium text-slate-500">Debit</th>
              <th className="py-2.5 px-3 text-right text-xs font-medium text-slate-500">Credit</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {entry.lines?.map((line) => (
              <tr key={line.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                <td className="py-2.5 px-3">
                  <span className="font-mono text-xs text-slate-500">{line.account?.code}</span>
                  <span className="ml-2 text-slate-800">{line.account?.name}</span>
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums font-medium">
                  {Number(line.debit || 0) > 0 ? (
                    <Money value={line.debit} />
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums font-medium">
                  {Number(line.credit || 0) > 0 ? (
                    <Money value={line.credit} />
                  ) : (
                    <span className="text-slate-300">—</span>
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
  );
}

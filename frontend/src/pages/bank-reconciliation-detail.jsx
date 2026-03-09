import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import Money from "../components/common/money";
import RecordPaymentDialog from "../components/payments/RecordPaymentDialog";
import { ArrowLeft, Check, Link2, PlusCircle, X } from "lucide-react";

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

export default function BankReconciliationDetailPage() {
  const [rec, setRec] = useState(null);
  const [unreconciled, setUnreconciled] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [matchingFor, setMatchingFor] = useState(null); // statementLineId
  const [matching, setMatching] = useState(false);
  const [allocateFor, setAllocateFor] = useState(null); // { statementLineId, amount }
  const { id } = useParams();

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const recRes = await api.getBankReconciliation(id);
      setRec(recRes);
      const accountCode = recRes?.accountCode || "1000";
      const asOf = recRes?.statementDate
        ? new Date(recRes.statementDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10);
      const actRes = await api.getUnreconciledActivity({ accountCode, asOf });
      setUnreconciled(Array.isArray(actRes) ? actRes : []);
    } catch (e) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (!rec?.accountCode || !rec?.statementDate) return;
    (async () => {
      const accountCode = rec.accountCode;
      const asOf = new Date(rec.statementDate).toISOString().slice(0, 10);
      try {
        const actRes = await api.getUnreconciledActivity({ accountCode, asOf });
        setUnreconciled(Array.isArray(actRes) ? actRes : []);
      } catch (_) {}
    })();
  }, [rec?.id, rec?.accountCode, rec?.statementDate]);

  const handleComplete = async () => {
    if (!confirm("Complete this reconciliation? You won't be able to modify it.")) return;
    setCompleting(true);
    setError(null);
    try {
      const updated = await api.completeBankReconciliation(id);
      setRec(updated);
    } catch (e) {
      setError(e.message || "Failed to complete");
    } finally {
      setCompleting(false);
    }
  };

  const handleMatch = async (statementLineId, journalLineId) => {
    if (!statementLineId || !journalLineId) return;
    setMatching(true);
    setError(null);
    setMatchingFor(null);
    try {
      const updated = await api.matchBankReconciliation(id, {
        statementLineId,
        journalLineId,
      });
      setRec(updated);
      const accountCode = updated.accountCode;
      const asOf = new Date(updated.statementDate).toISOString().slice(0, 10);
      const actRes = await api.getUnreconciledActivity({ accountCode, asOf });
      setUnreconciled(Array.isArray(actRes) ? actRes : []);
    } catch (e) {
      setError(e.message || "Failed to match");
    } finally {
      setMatching(false);
    }
  };

  const handleUnmatch = async (statementLineId, journalLineId) => {
    if (!statementLineId || !journalLineId) return;
    setMatching(true);
    setError(null);
    try {
      const updated = await api.unmatchBankReconciliation(id, {
        statementLineId,
        journalLineId,
      });
      setRec(updated);
      const accountCode = updated.accountCode;
      const asOf = new Date(updated.statementDate).toISOString().slice(0, 10);
      const actRes = await api.getUnreconciledActivity({ accountCode, asOf });
      setUnreconciled(Array.isArray(actRes) ? actRes : []);
    } catch (e) {
      setError(e.message || "Failed to unmatch");
    } finally {
      setMatching(false);
    }
  };

  const getMatchForStatementLine = (stmtLineId) => {
    const m = rec?.matches?.find((x) => x.statementLineId === stmtLineId);
    return m?.journalLine;
  };

  const handleAllocateSuccess = () => {
    setAllocateFor(null);
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  if (error || !rec) {
    return (
      <div className="space-y-4">
        <Link to="/bank-reconciliation" className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-800">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error || "Not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/bank-reconciliation" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> Back to Reconciliations
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Reconciliation – {formatDate(rec.statementDate)}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Account {rec.accountCode} • Opening: <Money value={rec.openingBalance} /> → Closing:{" "}
              <Money value={rec.closingBalance} />
            </p>
          </div>
          {rec.status === "DRAFT" && (
            <Button onClick={handleComplete} disabled={completing} className="gap-2">
              <Check className="h-4 w-4" /> Complete
            </Button>
          )}
        </div>

        {error && (
          <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="p-4 sm:p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">
              Statement Transactions ({rec.statementLines?.length ?? 0})
            </h3>
            <p className="text-xs text-slate-500 mb-2">
              For deposits: use <strong>Allocate</strong> to record a customer payment and allocate to an invoice. Use <strong>Match</strong> to link to an existing ledger entry. Withdrawals: use Match only.
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-[32rem] overflow-y-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Match</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Reference</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {rec.statementLines?.length ? (
                    rec.statementLines.map((l) => {
                      const matchedJournal = getMatchForStatementLine(l.id);
                      const stmtAmount = parseFloat(l.amount) || 0;
                      const suggested = unreconciled.filter(
                        (j) => Math.abs((parseFloat(j.amount) || 0) + stmtAmount) < 0.01
                      );
                      return (
                        <tr key={l.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-2 align-top whitespace-nowrap">
                            {rec.status === "COMPLETED" ? (
                              matchedJournal ? (
                                <span className="text-xs text-slate-600">
                                  <Link2 className="inline h-3 w-3 mr-1" />
                                  {matchedJournal.entry?.entryNumber}
                                </span>
                              ) : (
                                "—"
                              )
                            ) : matchedJournal ? (
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-emerald-600 flex items-center gap-1">
                                  <Link2 className="h-3 w-3" />
                                  {matchedJournal.entry?.entryNumber}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUnmatch(
                                      l.id,
                                      matchedJournal.id
                                    )
                                  }
                                  disabled={matching}
                                  className="text-slate-400 hover:text-red-600 text-xs p-0.5"
                                  title="Unmatch"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {(parseFloat(l.amount) || 0) > 0 ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      setAllocateFor({
                                        statementLineId: l.id,
                                        amount: String(l.amount),
                                        description: l.description || "",
                                        reference: l.reference || "",
                                      })
                                    }
                                    disabled={matching}
                                    className="text-xs gap-1"
                                  >
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    Allocate
                                  </Button>
                                ) : null}
                                <div className="relative">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      setMatchingFor(
                                        matchingFor === l.id ? null : l.id
                                      )
                                    }
                                    disabled={matching}
                                    className="text-xs"
                                  >
                                    Match…
                                  </Button>
                                {matchingFor === l.id && (
                                  <>
                                    <div
                                      className="fixed inset-0 z-20"
                                      aria-hidden
                                      onClick={() => setMatchingFor(null)}
                                    />
                                    <div className="absolute left-0 top-full mt-1 z-30 min-w-[20rem] max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg py-1">
                                      {unreconciled.length === 0 ? (
                                        <p className="px-3 py-2 text-xs text-slate-500">
                                          No ledger lines to match. Record deposits and payments first.
                                        </p>
                                      ) : (
                                        unreconciled.map((j) => (
                                          <button
                                            key={j.id}
                                            type="button"
                                            onClick={() =>
                                              handleMatch(l.id, j.id)
                                            }
                                            className={`w-full text-left px-3 py-2 text-xs hover:bg-slate-50 flex justify-between items-center gap-2 ${
                                              suggested.some((s) => s.id === j.id)
                                                ? "bg-amber-50"
                                                : ""
                                            }`}
                                          >
                                            <span className="flex-1 min-w-0 truncate">
                                              {j.entryNumber} • {formatDate(j.date)}
                                              {j.memo ? ` — ${j.memo}` : ""}
                                              {j.invoiceNumbers?.length ? (
                                                <span className="text-violet-600"> • Invoices: {j.invoiceNumbers.join(", ")}</span>
                                              ) : null}
                                            </span>
                                            <span className="tabular-nums shrink-0">
                                              <Money value={j.amount} />
                                            </span>
                                          </button>
                                        ))
                                      )}
                                    </div>
                                  </>
                                )}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-2 text-sm whitespace-nowrap">{formatDate(l.lineDate)}</td>
                          <td className="px-4 py-2 text-sm">{l.description || "—"}</td>
                          <td className="px-4 py-2 text-sm text-slate-600">{l.reference || "—"}</td>
                          <td className="px-4 py-2 text-right tabular-nums">
                            <Money value={l.amount} />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                        No statement transactions. Import a CSV or PDF to add transactions.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Unreconciled Ledger Activity</h3>
            <p className="text-xs text-slate-500 mb-2">
              Ledger lines not yet matched. Use the Match button on each statement line to link them.
            </p>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Date</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Entry</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Memo</th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-slate-600">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {unreconciled.length ? (
                    unreconciled.map((l) => (
                      <tr key={l.id}>
                        <td className="px-4 py-2 text-sm">{formatDate(l.date)}</td>
                        <td className="px-4 py-2 font-mono text-sm">
                          {l.entryNumber}
                          {l.invoiceNumbers?.length ? (
                            <span className="ml-1 text-violet-600 font-normal">
                              (Invoices: {l.invoiceNumbers.join(", ")})
                            </span>
                          ) : null}
                        </td>
                        <td className="px-4 py-2 text-sm">{l.memo || "—"}</td>
                        <td className="px-4 py-2 text-right tabular-nums">
                          <Money value={l.amount} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-4 text-center text-sm text-slate-500">
                        No unreconciled activity. All ledger transactions may already be matched.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <RecordPaymentDialog
        open={!!allocateFor}
        onOpenChange={(open) => !open && setAllocateFor(null)}
        defaultAmount={allocateFor?.amount ?? ""}
        suggestedClientSearch={allocateFor?.description || allocateFor?.reference || ""}
        reconciliationContext={
          allocateFor
            ? { reconciliationId: id, statementLineId: allocateFor.statementLineId }
            : null
        }
        onSuccess={handleAllocateSuccess}
      />
    </div>
  );
}

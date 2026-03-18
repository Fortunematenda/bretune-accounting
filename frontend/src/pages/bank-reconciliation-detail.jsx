import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import Money from "../components/common/money";
import StatusBadge from "../components/common/StatusBadge";
import RecordPaymentDialog from "../components/payments/RecordPaymentDialog";
import { ArrowLeft, Check, Link2, PlusCircle, Scale, X } from "lucide-react";

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
      <div className="py-12 text-center text-sm text-slate-500">Loading…</div>
    );
  }

  if (error || !rec) {
    return (
      <div className="space-y-4">
        <nav className="mb-4">
          <Link to="/bank-reconciliation" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Reconciliations
          </Link>
        </nav>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error || "Not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Breadcrumb */}
      <nav className="mb-4">
        <Link to="/bank-reconciliation" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Reconciliations
        </Link>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
        <div className="flex items-start gap-3 min-w-0">
          <div className="h-11 w-11 rounded-lg bg-violet-50 ring-1 ring-violet-100 flex items-center justify-center shrink-0">
            <Scale className="h-5 w-5 text-violet-600" strokeWidth={1.7} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-semibold text-slate-900">Reconciliation – {formatDate(rec.statementDate)}</h1>
              <StatusBadge status={rec.status} />
            </div>
            <p className="mt-0.5 text-sm text-slate-500">Account {rec.accountCode}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {rec.status === "DRAFT" && (
            <Button onClick={handleComplete} disabled={completing} className="h-9 gap-1.5">
              <Check className="h-3.5 w-3.5" /> Complete
            </Button>
          )}
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <Card><CardContent className="p-3.5"><div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Opening Balance</div><div className="mt-1 text-lg font-semibold tabular-nums text-slate-900"><Money value={rec.openingBalance} /></div></CardContent></Card>
        <Card><CardContent className="p-3.5"><div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Closing Balance</div><div className="mt-1 text-lg font-semibold tabular-nums text-slate-900"><Money value={rec.closingBalance} /></div></CardContent></Card>
        <Card><CardContent className="p-3.5"><div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Transactions</div><div className="mt-1 text-lg font-semibold text-slate-900">{rec.statementLines?.length ?? 0}</div></CardContent></Card>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600 mb-4">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-1.5">
            Statement Transactions ({rec.statementLines?.length ?? 0})
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            For deposits: use <strong className="text-slate-500">Allocate</strong> to record a customer payment. Use <strong className="text-slate-500">Match</strong> to link to an existing ledger entry.
          </p>
          <div className="overflow-x-auto rounded-lg border border-slate-200/80 max-h-[32rem] overflow-y-auto">
            <table className="min-w-full text-[13px]">
              <thead className="bg-slate-50/80 sticky top-0 z-10">
                <tr className="border-b border-slate-200/80">
                  <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Match</th>
                  <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Date</th>
                  <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Description</th>
                  <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Reference</th>
                  <th className="py-2.5 px-3 text-right text-xs font-medium text-slate-500">Amount</th>
                </tr>
              </thead>
                <tbody className="bg-white">
                  {rec.statementLines?.length ? (
                    rec.statementLines.map((l) => {
                      const matchedJournal = getMatchForStatementLine(l.id);
                      const stmtAmount = parseFloat(l.amount) || 0;
                      const suggested = unreconciled.filter(
                        (j) => Math.abs((parseFloat(j.amount) || 0) + stmtAmount) < 0.01
                      );
                      return (
                        <tr key={l.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
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
                          <td className="py-2.5 px-3 text-sm whitespace-nowrap text-slate-600">{formatDate(l.lineDate)}</td>
                          <td className="py-2.5 px-3 text-sm text-slate-800">{l.description || "—"}</td>
                          <td className="py-2.5 px-3 text-sm text-slate-500">{l.reference || "—"}</td>
                          <td className="py-2.5 px-3 text-right tabular-nums font-medium text-slate-900">
                            <Money value={l.amount} />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-slate-400 italic">
                        No statement transactions. Import a CSV or PDF to add transactions.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-1.5">Unreconciled Ledger Activity</h3>
          <p className="text-xs text-slate-400 mb-3">
            Ledger lines not yet matched. Use the Match button on each statement line to link them.
          </p>
          <div className="overflow-x-auto rounded-lg border border-slate-200/80">
            <table className="min-w-full text-[13px]">
              <thead className="bg-slate-50/80">
                <tr className="border-b border-slate-200/80">
                  <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Date</th>
                  <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Entry</th>
                  <th className="py-2.5 px-3 text-left text-xs font-medium text-slate-500">Memo</th>
                  <th className="py-2.5 px-3 text-right text-xs font-medium text-slate-500">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {unreconciled.length ? (
                  unreconciled.map((l) => (
                    <tr key={l.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 text-sm text-slate-600">{formatDate(l.date)}</td>
                      <td className="py-2.5 px-3 font-mono text-sm text-slate-800">
                        {l.entryNumber}
                        {l.invoiceNumbers?.length ? (
                          <span className="ml-1 text-violet-600 font-normal text-xs">
                            (Invoices: {l.invoiceNumbers.join(", ")})
                          </span>
                        ) : null}
                      </td>
                      <td className="py-2.5 px-3 text-sm text-slate-500">{l.memo || "—"}</td>
                      <td className="py-2.5 px-3 text-right tabular-nums font-medium text-slate-900">
                        <Money value={l.amount} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-sm text-slate-400 italic">
                      No unreconciled activity. All ledger transactions may already be matched.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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

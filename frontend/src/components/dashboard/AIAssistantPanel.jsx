import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { api } from "../../lib/api";
import { cn } from "../../lib/utils";
import {
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Copy,
  FileSearch,
  Loader2,
  Play,
  Receipt,
  RefreshCw,
  Sparkles,
  Tag,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import Button from "../ui/button";

const TYPE_CONFIG = {
  CATEGORIZE_TRANSACTION: { label: "Categorize", icon: Tag, color: "text-blue-600 bg-blue-50" },
  MATCH_INVOICE: { label: "Match Invoice", icon: Receipt, color: "text-emerald-600 bg-emerald-50" },
  MATCH_BILL: { label: "Match Bill", icon: Receipt, color: "text-amber-600 bg-amber-50" },
  DUPLICATE_INVOICE: { label: "Duplicate Invoice", icon: Copy, color: "text-rose-600 bg-rose-50" },
  DUPLICATE_BILL: { label: "Duplicate Bill", icon: Copy, color: "text-rose-600 bg-rose-50" },
  DUPLICATE_EXPENSE: { label: "Duplicate Expense", icon: Copy, color: "text-rose-600 bg-rose-50" },
  EXPENSE_SUGGESTION: { label: "Expense Suggestion", icon: Sparkles, color: "text-violet-600 bg-violet-50" },
};

function confidenceLabel(c) {
  const n = Number(c || 0);
  if (n >= 0.85) return { text: "High", cls: "text-emerald-600 bg-emerald-50" };
  if (n >= 0.6) return { text: "Medium", cls: "text-amber-600 bg-amber-50" };
  return { text: "Low", cls: "text-slate-500 bg-slate-100" };
}

function SuggestionRow({ item, onAccept, onDismiss, busy }) {
  const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.CATEGORIZE_TRANSACTION;
  const Icon = cfg.icon;
  const conf = confidenceLabel(item.confidence);

  return (
    <div className="group flex items-start gap-3 py-3 px-1 border-b border-slate-100 last:border-0">
      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5", cfg.color)}>
        <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{cfg.label}</span>
          <span className={cn("text-[10px] font-semibold rounded-full px-1.5 py-0.5", conf.cls)}>
            {conf.text} ({(Number(item.confidence) * 100).toFixed(0)}%)
          </span>
        </div>
        <div className="text-sm text-slate-700 leading-snug">{item.reasoning || "No details"}</div>
        {item.status === "PENDING" ? (
          <div className="flex items-center gap-2 mt-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => onAccept(item.id)}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="h-3 w-3" /> Accept
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => onDismiss(item.id)}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              <X className="h-3 w-3" /> Dismiss
            </button>
          </div>
        ) : (
          <div className="mt-1">
            <span className={cn(
              "text-[11px] font-medium",
              item.status === "ACCEPTED" ? "text-emerald-600" : "text-slate-400"
            )}>
              {item.status === "ACCEPTED" ? "✓ Accepted" : "✗ Dismissed"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AIAssistantPanel() {
  const [stats, setStats] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(null); // 'categorize' | 'match' | 'duplicates'
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, suggestionsRes] = await Promise.allSettled([
        api.aiSuggestionStats(),
        api.aiSuggestions({ status: "PENDING", limit: 10 }),
      ]);
      setStats(statsRes.status === "fulfilled" ? statsRes.value : { pending: 0, accepted: 0, dismissed: 0, total: 0, byType: {} });
      setSuggestions(suggestionsRes.status === "fulfilled" ? (suggestionsRes.value?.items || []) : []);
      if (statsRes.status === "rejected" && suggestionsRes.status === "rejected") {
        setError("AI tables not available. Run migrations first.");
      }
    } catch (e) {
      setStats({ pending: 0, accepted: 0, dismissed: 0, total: 0, byType: {} });
      setError(e?.message || "Failed to load AI data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function runJob(type) {
    setRunning(type);
    setError(null);
    try {
      if (type === "categorize") await api.aiRunCategorize();
      else if (type === "match") await api.aiRunMatch();
      else if (type === "duplicates") await api.aiRunDuplicates();
      await fetchData();
    } catch (e) {
      setError(e?.message || `Failed to run ${type}`);
    } finally {
      setRunning(null);
    }
  }

  async function handleAccept(id) {
    setBusy(true);
    try {
      await api.aiAcceptSuggestion(id);
      await fetchData();
    } catch {
      // ignore
    } finally {
      setBusy(false);
    }
  }

  async function handleDismiss(id) {
    setBusy(true);
    try {
      await api.aiDismissSuggestion(id);
      await fetchData();
    } catch {
      // ignore
    } finally {
      setBusy(false);
    }
  }

  const pendingCount = stats?.pending || 0;

  return (
    <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.03] to-transparent pointer-events-none" />
      <div className="relative">
        {/* Header */}
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-violet-600/20">
                <Bot className="h-4 w-4 text-white" strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-slate-800">AI Assistant</div>
                <div className="text-[11px] text-slate-400">
                  {pendingCount > 0 ? `${pendingCount} pending suggestion${pendingCount !== 1 ? "s" : ""}` : "No pending suggestions"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={fetchData}
                disabled={loading}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
              </button>
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="px-5 pb-3">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "categorize", label: "Categorize", icon: Tag },
              { key: "match", label: "Match", icon: FileSearch },
              { key: "duplicates", label: "Duplicates", icon: Copy },
            ].map((job) => (
              <button
                key={job.key}
                type="button"
                disabled={running != null}
                onClick={() => runJob(job.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium border transition-all",
                  running === job.key
                    ? "border-violet-300 bg-violet-50 text-violet-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                )}
              >
                {running === job.key ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <job.icon className="h-3 w-3" />
                )}
                {job.label}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="mx-5 mb-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        ) : null}

        {/* Stats row */}
        {stats ? (
          <div className="px-5 pb-3">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="text-slate-500">Pending</span>
                <span className="font-semibold text-slate-700 tabular-nums">{stats.pending}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-slate-500">Accepted</span>
                <span className="font-semibold text-slate-700 tabular-nums">{stats.accepted}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-slate-300" />
                <span className="text-slate-500">Dismissed</span>
                <span className="font-semibold text-slate-700 tabular-nums">{stats.dismissed}</span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Suggestions list */}
        {expanded && suggestions.length > 0 ? (
          <CardContent className="pt-0">
            <div className="max-h-[320px] overflow-y-auto -mx-1">
              {suggestions.map((s) => (
                <SuggestionRow
                  key={s.id}
                  item={s}
                  onAccept={handleAccept}
                  onDismiss={handleDismiss}
                  busy={busy}
                />
              ))}
            </div>
          </CardContent>
        ) : null}

        {expanded && suggestions.length === 0 && !loading ? (
          <CardContent className="pt-0">
            <div className="py-6 text-center">
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-5 w-5 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">No pending suggestions.</p>
              <p className="text-xs text-slate-400 mt-1">Run a scan to find matches and duplicates.</p>
            </div>
          </CardContent>
        ) : null}
      </div>
    </Card>
  );
}

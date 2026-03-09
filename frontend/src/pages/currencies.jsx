import React, { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  RefreshCw,
  ArrowRightLeft,
  Globe,
  TrendingUp,
  Info,
  Zap,
} from "lucide-react";

function formatDateShort(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? String(iso)
    : new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
      }).format(d);
}

const SYNC_INTERVAL_MS = 30 * 60 * 1000;

function fmtTimeAgo(date) {
  if (!date) return null;
  const mins = Math.floor((Date.now() - date.getTime()) / 60_000);
  if (mins < 1) return "just now";
  if (mins === 1) return "1 min ago";
  return `${mins} min ago`;
}

export default function CurrenciesPage() {
  const [currencies, setCurrencies] = useState([]);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState("ZAR");
  const [lastSyncAt, setLastSyncAt] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [curr, r, settings] = await Promise.all([
        api.listCurrencies(),
        api.listExchangeRates(),
        api.getCompanySettings().catch(() => null),
      ]);
      setCurrencies(Array.isArray(curr) ? curr : []);
      setRates(Array.isArray(r) ? r : []);
      if (settings?.displayCurrencyCode) setDisplayCurrency(settings.displayCurrencyCode);
      else {
        try {
          const stored = localStorage.getItem("ba_settings_accounting");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed?.currency) setDisplayCurrency(parsed.currency);
          }
        } catch { /* ignore */ }
      }
    } catch (e) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  const silentSync = useCallback(async () => {
    try {
      await api.syncExchangeRates();
      setLastSyncAt(new Date());
      await load();
    } catch {
      /* silent — don't disrupt UI on auto-sync failure */
    }
  }, [load]);

  useEffect(() => {
    silentSync();
    const interval = setInterval(silentSync, SYNC_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [silentSync]);

  const handleSyncOnline = async () => {
    setSyncing(true);
    setError(null);
    try {
      await api.syncExchangeRates();
      setLastSyncAt(new Date());
      await load();
    } catch (e) {
      setError(e.message || "Failed to sync rates");
    } finally {
      setSyncing(false);
    }
  };

  const latestRateDate = useMemo(() => {
    const dates = rates.map((r) => new Date(r.asOfDate).getTime()).filter(Boolean);
    return dates.length ? new Date(Math.max(...dates)) : null;
  }, [rates]);

  return (
    <div className="space-y-6">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 px-6 py-8 text-white shadow-lg sm:px-8 sm:py-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-60" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Currencies & Exchange Rates
            </h1>
            <p className="mt-2 max-w-xl text-sm text-violet-100 sm:text-base">
              Multi-currency support with live rates from the European Central Bank.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1">
                <Globe className="h-4 w-4" />
                {currencies.length} currencies
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1">
                <TrendingUp className="h-4 w-4" />
                {rates.length} rates
              </span>
              {latestRateDate && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1">
                  <Zap className="h-4 w-4" />
                  Rates as of {formatDateShort(latestRateDate)}
                </span>
              )}
            </div>
          </div>
          <Button
            onClick={handleSyncOnline}
            disabled={syncing || currencies.length < 2 || loading}
            className="shrink-0 gap-2 bg-white text-violet-700 hover:bg-violet-50"
          >
            <RefreshCw className={`h-5 w-5 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing…" : "Sync now"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-16">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-slate-400" />
            <p className="text-sm text-slate-500">Loading currencies…</p>
          </div>
        </div>
      ) : (
        <>
          {/* Converter */}
          <ConverterCard currencies={currencies} defaultCurrency={displayCurrency} />

          {/* Currency trends chart */}
          <CurrencyTrendsChart currencies={currencies} defaultCurrency={displayCurrency} />

          {/* Info footer */}
          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-4">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
            <div className="text-sm text-slate-600">
              <p className="font-medium text-slate-700">About exchange rates</p>
              <p className="mt-1">
                Rates are sourced from the European Central Bank via{" "}
                <a
                  href="https://frankfurter.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-600 hover:underline"
                >
                  Frankfurter API
                </a>
                . They update automatically every 30 minutes. Use the converter above for quick calculations, or sync manually for the latest data.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const CHART_COLORS = [
  "#7c3aed",
  "#0891b2",
  "#059669",
  "#d97706",
  "#dc2626",
  "#db2777",
];

function CurrencyTrendsChart({ currencies, defaultCurrency = "ZAR" }) {
  const [baseCode, setBaseCode] = useState("");
  const [targetCodes, setTargetCodes] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("90");

  const codeSet = useMemo(() => new Set(currencies.map((c) => c.code)), [currencies]);
  const hasDefault = codeSet.has(defaultCurrency);
  const hasUsd = codeSet.has("USD");

  useEffect(() => {
    if (currencies.length < 2) return;
    if (!baseCode) setBaseCode(hasDefault ? defaultCurrency : currencies[0]?.code || "");
    if (targetCodes.length === 0) {
      const base = hasDefault ? defaultCurrency : currencies[0]?.code;
      const target = hasUsd && base !== "USD" ? "USD" : (currencies.find((c) => c.code !== base)?.code || currencies[1]?.code);
      if (target) setTargetCodes([target]);
    }
  }, [currencies, hasDefault, hasUsd, defaultCurrency, baseCode, targetCodes.length]);

  useEffect(() => {
    if (!baseCode || targetCodes.length === 0) return;
    let cancelled = false;
    setLoading(true);
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - Number(period));
    api
      .getCurrencyHistory({
        from: baseCode,
        to: targetCodes.join(","),
        fromDate: start.toISOString().slice(0, 10),
        toDate: end.toISOString().slice(0, 10),
      })
      .then((data) => {
        if (!cancelled) setHistory(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setHistory([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [baseCode, targetCodes.join(","), period]);

  const toggleTarget = (code) => {
    setTargetCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-violet-600" />
              Currency Trends
            </CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Exchange rate trends over time (1 {baseCode || "…"} vs target currencies)
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={baseCode}
              onChange={(e) => setBaseCode(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 px-3 text-sm"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>{c.code}</option>
              ))}
            </select>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 px-3 text-sm"
            >
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="180">6 months</option>
            </select>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-xs text-slate-500">Compare with:</span>
          {currencies
            .filter((c) => c.code !== baseCode)
            .map((c) => (
              <label
                key={c.code}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-1 text-xs hover:bg-slate-50"
              >
                <input
                  type="checkbox"
                  checked={targetCodes.includes(c.code)}
                  onChange={() => toggleTarget(c.code)}
                  className="rounded"
                />
                {c.code}
              </label>
            ))}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex h-64 items-center justify-center text-slate-500">
            Loading trends…
          </div>
        ) : history.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-sm text-slate-500">
            Select at least one currency to compare
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  {targetCodes.map((code, i) => (
                    <linearGradient
                      key={code}
                      id={`gradient-${code}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.05} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) =>
                    new Date(v).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => Number(v).toFixed(2)}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                  labelFormatter={(v) =>
                    new Date(v).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                  formatter={(value, name) => [
                    Number(value).toLocaleString(undefined, {
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4,
                    }),
                    name,
                  ]}
                />
                <Legend />
                {targetCodes.map((code, i) => (
                  <Area
                    key={code}
                    type="monotone"
                    dataKey={code}
                    name={`1 ${baseCode} → ${code}`}
                    stroke={CHART_COLORS[i % CHART_COLORS.length]}
                    fill={`url(#gradient-${code})`}
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ConverterCard({ currencies, defaultCurrency = "ZAR" }) {
  const [amount, setAmount] = useState("100");
  const [fromCode, setFromCode] = useState("");
  const [toCode, setToCode] = useState("");
  const [rate, setRate] = useState(null);
  const [rateLoading, setRateLoading] = useState(false);
  const [rateError, setRateError] = useState(null);

  const codeSet = useMemo(() => new Set(currencies.map((c) => c.code)), [currencies]);
  const hasDefault = codeSet.has(defaultCurrency);
  const hasUsd = codeSet.has("USD");

  useEffect(() => {
    if (currencies.length < 2 || fromCode || toCode) return;
    const from = hasDefault ? defaultCurrency : currencies[0]?.code;
    const to = hasUsd ? "USD" : (currencies.find((c) => c.code !== from)?.code || currencies[1]?.code);
    setFromCode(from || "");
    setToCode(to || "");
  }, [currencies, hasDefault, hasUsd, defaultCurrency, fromCode, toCode]);

  const fetchRate = useCallback(async () => {
    if (!fromCode || !toCode || fromCode === toCode) {
      setRate(fromCode === toCode ? 1 : null);
      setRateError(null);
      return;
    }
    setRateLoading(true);
    setRateError(null);
    try {
      const res = await api.getExchangeRate({
        from: fromCode,
        to: toCode,
        live: "true",
      });
      const r = res?.rate != null ? parseFloat(res.rate) : null;
      setRate(Number.isFinite(r) ? r : null);
      if (!Number.isFinite(r)) setRateError(res?.error || "Rate not found");
    } catch (e) {
      setRate(null);
      setRateError(e.message || "Failed to fetch rate");
    } finally {
      setRateLoading(false);
    }
  }, [fromCode, toCode]);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  const amountNum = parseFloat(amount) || 0;
  const result =
    rate != null && Number.isFinite(rate) ? amountNum * rate : null;

  return (
    <Card className="border-violet-100 bg-gradient-to-br from-violet-50/50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-violet-600" />
          Quick Converter
        </CardTitle>
        <p className="mt-1 text-xs text-slate-500">
          Convert amounts using your latest exchange rates
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Amount
            </label>
            <Input
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="text-lg font-semibold tabular-nums"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              From
            </label>
            <select
              value={fromCode}
              onChange={(e) => setFromCode(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Select currency</option>
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} – {c.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              setFromCode(toCode);
              setToCode(fromCode);
            }}
            className="flex shrink-0 items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors sm:pb-2"
            title="Swap currencies"
            aria-label="Swap currencies"
          >
            <ArrowRightLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              To
            </label>
            <select
              value={toCode}
              onChange={(e) => setToCode(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            >
              <option value="">Select currency</option>
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} – {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 sm:min-w-[140px]">
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Result
            </label>
            <div className="flex h-10 items-center rounded-md border border-slate-200 bg-white px-3 py-2 font-mono text-lg font-semibold tabular-nums text-slate-900">
              {rateLoading ? (
                <span className="text-slate-400">Loading…</span>
              ) : result != null ? (
                <>
                  {result.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,
                  })}
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    {toCode}
                  </span>
                </>
              ) : rateError ? (
                <span className="text-sm font-normal text-amber-600">
                  {rateError}
                </span>
              ) : (
                "—"
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


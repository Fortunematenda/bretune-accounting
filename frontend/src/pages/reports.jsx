import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import Money from "../components/common/money";
import Pagination from "../components/common/Pagination";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  BarChart3,
  FileText,
  Landmark,
  TrendingUp,
  Wallet,
  Calendar,
  Clock,
  BookOpen,
  Scale,
  DollarSign,
  RefreshCw,
  Download,
  ChevronRight,
} from "lucide-react";
import { cn } from "../lib/utils";

const REPORT_CATEGORIES = [
  {
    label: "Receivables",
    reports: [
      { key: "aging", label: "AR Aging", icon: Clock, description: "Aging analysis by customer" },
      { key: "outstanding", label: "Outstanding Invoices", icon: FileText, description: "Unpaid invoice details" },
    ],
  },
  {
    label: "Revenue",
    reports: [
      { key: "revenue-accrual", label: "Revenue (Accrual)", icon: TrendingUp, description: "Monthly invoiced revenue" },
      { key: "revenue-cash", label: "Revenue (Cash)", icon: DollarSign, description: "Monthly cash collected" },
    ],
  },
  {
    label: "Financial Statements",
    reports: [
      { key: "trial-balance", label: "Trial Balance", icon: Scale, description: "Account debits & credits" },
      { key: "balance-sheet", label: "Balance Sheet", icon: BookOpen, description: "Assets, liabilities & equity" },
      { key: "profit-loss", label: "Profit & Loss", icon: TrendingUp, description: "Income vs expenses" },
    ],
  },
  {
    label: "Lending",
    reports: [
      { key: "loans", label: "Loans Report", icon: Landmark, description: "Outstanding & repaid loans" },
    ],
  },
];

const ALL_REPORTS = REPORT_CATEGORIES.flatMap((c) => c.reports);

function formatMonth(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
  }).format(d);
}

function formatMonthShort(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    year: "2-digit",
    month: "short",
  }).format(d);
}

function formatMoneyTooltip(value) {
  const n = Number(value ?? 0);
  if (!Number.isFinite(n)) return String(value ?? "0");
  const formatted = n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  return `R ${formatted}`;
}

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

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState("aging");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  const [aging, setAging] = useState(null);
  const [agingAsOf, setAgingAsOf] = useState("");

  const [outstanding, setOutstanding] = useState(null);
  const [outstandingPage, setOutstandingPage] = useState(1);

  const [revenueAccrual, setRevenueAccrual] = useState(null);
  const [revenueCash, setRevenueCash] = useState(null);

  const [loansSummary, setLoansSummary] = useState(null);
  const [loansReport, setLoansReport] = useState([]);

  const [trialBalance, setTrialBalance] = useState(null);
  const [balanceSheet, setBalanceSheet] = useState(null);
  const [profitLoss, setProfitLoss] = useState(null);
  const [accountingAsOf, setAccountingAsOf] = useState("");

  const loadAging = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = agingAsOf ? { asOf: agingAsOf } : {};
      const res = await api.aging(params);
      setAging(Array.isArray(res) ? res : []);
    } catch (e) {
      setError(e.message || "Failed to load aging report");
      setAging([]);
    } finally {
      setLoading(false);
    }
  }, [agingAsOf]);

  const loadOutstanding = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.outstandingInvoices({ page: outstandingPage, limit: 20 });
      setOutstanding(res);
    } catch (e) {
      setError(e.message || "Failed to load outstanding invoices");
      setOutstanding(null);
    } finally {
      setLoading(false);
    }
  }, [outstandingPage]);

  const loadRevenueAccrual = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { mode: "accrual" };
      if (dateStart) params.from = dateStart;
      if (dateEnd) params.to = dateEnd;
      const res = await api.monthlyRevenue(params);
      setRevenueAccrual(Array.isArray(res) ? res : []);
    } catch (e) {
      setError(e.message || "Failed to load revenue report");
      setRevenueAccrual([]);
    } finally {
      setLoading(false);
    }
  }, [dateStart, dateEnd]);

  const loadRevenueCash = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { mode: "cash" };
      if (dateStart) params.from = dateStart;
      if (dateEnd) params.to = dateEnd;
      const res = await api.monthlyRevenue(params);
      setRevenueCash(Array.isArray(res) ? res : []);
    } catch (e) {
      setError(e.message || "Failed to load cash report");
      setRevenueCash([]);
    } finally {
      setLoading(false);
    }
  }, [dateStart, dateEnd]);

  const loadLoans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, loansRes] = await Promise.all([
        api.getLoansSummary(),
        api.listLoans({ limit: 200 }),
      ]);
      setLoansSummary(summaryRes || null);
      setLoansReport(Array.isArray(loansRes?.data) ? loansRes.data : []);
    } catch (e) {
      setError(e.message || "Failed to load loans report");
      setLoansSummary(null);
      setLoansReport([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTrialBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = accountingAsOf ? { asOf: accountingAsOf } : {};
      const res = await api.trialBalance(params);
      setTrialBalance(res);
    } catch (e) {
      setError(e.message || "Failed to load trial balance");
      setTrialBalance(null);
    } finally {
      setLoading(false);
    }
  }, [accountingAsOf]);

  const loadBalanceSheet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = accountingAsOf ? { asOf: accountingAsOf } : {};
      const res = await api.balanceSheet(params);
      setBalanceSheet(res);
    } catch (e) {
      setError(e.message || "Failed to load balance sheet");
      setBalanceSheet(null);
    } finally {
      setLoading(false);
    }
  }, [accountingAsOf]);

  const loadProfitLoss = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (dateStart) params.from = dateStart;
      if (dateEnd) params.to = dateEnd;
      const res = await api.profitLoss(params);
      setProfitLoss(res);
    } catch (e) {
      setError(e.message || "Failed to load profit & loss");
      setProfitLoss(null);
    } finally {
      setLoading(false);
    }
  }, [dateStart, dateEnd]);

  useEffect(() => {
    if (activeReport === "aging") loadAging();
  }, [activeReport, loadAging]);

  useEffect(() => {
    if (activeReport === "outstanding") loadOutstanding();
  }, [activeReport, loadOutstanding]);

  useEffect(() => {
    if (activeReport === "revenue-accrual") loadRevenueAccrual();
  }, [activeReport, loadRevenueAccrual]);

  useEffect(() => {
    if (activeReport === "revenue-cash") loadRevenueCash();
  }, [activeReport, loadRevenueCash]);

  useEffect(() => {
    if (activeReport === "loans") loadLoans();
  }, [activeReport, loadLoans]);

  useEffect(() => {
    if (activeReport === "trial-balance") loadTrialBalance();
  }, [activeReport, loadTrialBalance]);

  useEffect(() => {
    if (activeReport === "balance-sheet") loadBalanceSheet();
  }, [activeReport, loadBalanceSheet]);

  useEffect(() => {
    if (activeReport === "profit-loss") loadProfitLoss();
  }, [activeReport, loadProfitLoss]);

  function refresh() {
    if (activeReport === "aging") loadAging();
    else if (activeReport === "outstanding") loadOutstanding();
    else if (activeReport === "revenue-accrual") loadRevenueAccrual();
    else if (activeReport === "revenue-cash") loadRevenueCash();
    else if (activeReport === "loans") loadLoans();
    else if (activeReport === "trial-balance") loadTrialBalance();
    else if (activeReport === "balance-sheet") loadBalanceSheet();
    else if (activeReport === "profit-loss") loadProfitLoss();
  }

  const agingTotal = aging
    ? aging.reduce(
        (acc, r) => ({
          b0: acc.b0 + Number(r.bucket_0_30 || 0),
          b1: acc.b1 + Number(r.bucket_31_60 || 0),
          b2: acc.b2 + Number(r.bucket_61_90 || 0),
          b3: acc.b3 + Number(r.bucket_90_plus || 0),
        }),
        { b0: 0, b1: 0, b2: 0, b3: 0 }
      )
    : null;

  const agingChartData = aging?.slice(0, 10).map((r) => ({
    name: (r.customerName || "Unknown").slice(0, 20),
    "0-30": Number(r.bucket_0_30 || 0),
    "31-60": Number(r.bucket_31_60 || 0),
    "61-90": Number(r.bucket_61_90 || 0),
    "90+": Number(r.bucket_90_plus || 0),
    total:
      Number(r.bucket_0_30 || 0) +
      Number(r.bucket_31_60 || 0) +
      Number(r.bucket_61_90 || 0) +
      Number(r.bucket_90_plus || 0),
  }));

  const agingPieData =
    agingTotal &&
    (agingTotal.b0 > 0 ||
      agingTotal.b1 > 0 ||
      agingTotal.b2 > 0 ||
      agingTotal.b3 > 0)
      ? [
          { name: "0-30 days", value: agingTotal.b0, color: "#22c55e" },
          { name: "31-60 days", value: agingTotal.b1, color: "#eab308" },
          { name: "61-90 days", value: agingTotal.b2, color: "#f97316" },
          { name: "90+ days", value: agingTotal.b3, color: "#ef4444" },
        ].filter((d) => d.value > 0)
      : [];

  const revenueAccrualChartData = revenueAccrual?.map((r) => ({
    month: r.month,
    label: formatMonthShort(r.month),
    revenue: Number(r.revenue || 0),
  }));

  const revenueCashChartData = revenueCash?.map((r) => ({
    month: r.month,
    label: formatMonthShort(r.month),
    cash: Number(r.cash_received || 0),
  }));

  const outstandingChartData = outstanding?.data?.slice(0, 10).map((inv) => ({
    name: (inv.client?.companyName || inv.client?.contactName || "Unknown").slice(0, 20),
    amount: Number(inv.balanceDue || 0),
  }));

  const loansBorrowerChartData = (loansSummary?.topBorrowers || []).map((b) => ({
    name: String(b.name || "Unknown").slice(0, 20),
    outstanding: Number(b.outstanding || 0),
    loaned: Number(b.loaned || 0),
  }));

  const loansStatusPieData = loansSummary?.byStatus
    ? Object.entries(loansSummary.byStatus)
        .map(([name, value], idx) => ({
          name,
          value: Number(value || 0),
          color: ["#3b82f6", "#f59e0b", "#22c55e", "#64748b"][idx % 4],
        }))
        .filter((d) => d.value > 0)
    : [];

  const activeReportMeta = ALL_REPORTS.find((r) => r.key === activeReport) || ALL_REPORTS[0];
  const ActiveIcon = activeReportMeta?.icon || BarChart3;

  return (
    <div className="space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Reports</h1>
            <p className="text-sm text-slate-500">Financial reports & analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(activeReport === "revenue-accrual" || activeReport === "revenue-cash" || activeReport === "profit-loss") && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none"
              />
              <span className="text-slate-400 text-sm">to</span>
              <input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none"
              />
            </div>
          )}
          {(activeReport === "trial-balance" || activeReport === "balance-sheet") && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">As of</span>
              <input
                type="date"
                value={accountingAsOf}
                onChange={(e) => setAccountingAsOf(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none"
              />
            </div>
          )}
          {activeReport === "aging" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">As of</span>
              <input
                type="date"
                value={agingAsOf}
                onChange={(e) => setAgingAsOf(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-violet-400 focus:ring-2 focus:ring-violet-200 outline-none"
              />
            </div>
          )}
          <button
            type="button"
            onClick={refresh}
            className="h-9 w-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar navigation */}
        <div className="hidden lg:block">
          <div className="sticky top-4 space-y-1">
            {REPORT_CATEGORIES.map((cat) => (
              <div key={cat.label}>
                <div className="px-3 pt-4 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {cat.label}
                </div>
                {cat.reports.map((r) => {
                  const Icon = r.icon;
                  const isActive = activeReport === r.key;
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setActiveReport(r.key)}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all group",
                        isActive
                          ? "bg-violet-50 text-violet-700 shadow-sm"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <div className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                        isActive ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={cn("text-sm font-medium truncate", isActive && "text-violet-700")}>{r.label}</div>
                        <div className="text-[11px] text-slate-400 truncate">{r.description}</div>
                      </div>
                      {isActive && <ChevronRight className="h-4 w-4 text-violet-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile tabs (visible on small screens) */}
        <div className="lg:hidden flex overflow-x-auto gap-1.5 pb-1">
          {ALL_REPORTS.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => setActiveReport(r.key)}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors shrink-0",
                  activeReport === r.key
                    ? "bg-violet-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Report content */}
        <div className="min-w-0">
          {/* Active report header */}
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <ActiveIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{activeReportMeta?.label}</h2>
              <p className="text-xs text-slate-500">{activeReportMeta?.description}</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {activeReport === "aging" && (
            <>
              {(agingChartData?.length > 0 || agingPieData?.length > 0) && !loading && (
                <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {agingChartData?.length > 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <h3 className="mb-4 text-sm font-semibold text-slate-700">
                        AR Aging by Customer (Top 10)
                      </h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={agingChartData} layout="vertical" margin={{ left: 20, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis type="number" tickFormatter={formatMoneyTooltip} />
                            <YAxis type="category" dataKey="name" width={100} />
                            <Tooltip formatter={(v) => formatMoneyTooltip(v)} />
                            <Legend />
                            <Bar dataKey="0-30" stackId="a" fill="#22c55e" name="0-30 days" />
                            <Bar dataKey="31-60" stackId="a" fill="#eab308" name="31-60 days" />
                            <Bar dataKey="61-90" stackId="a" fill="#f97316" name="61-90 days" />
                            <Bar dataKey="90+" stackId="a" fill="#ef4444" name="90+ days" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                  {agingPieData?.length > 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <h3 className="mb-4 text-sm font-semibold text-slate-700">
                        Total AR Aging Breakdown
                      </h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={agingPieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={2}
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {agingPieData.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(v) => formatMoneyTooltip(v)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                        0–30 days
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                        31–60 days
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                        61–90 days
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                        90+ days
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                          Loading…
                        </td>
                      </tr>
                    ) : aging?.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                          No aging data. Outstanding invoices will appear here.
                        </td>
                      </tr>
                    ) : (
                      aging?.map((r) => {
                        const t =
                          Number(r.bucket_0_30 || 0) +
                          Number(r.bucket_31_60 || 0) +
                          Number(r.bucket_61_90 || 0) +
                          Number(r.bucket_90_plus || 0);
                        return (
                          <tr key={r.clientId} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3">
                              <Link
                                to={`/customers/${r.clientId}`}
                                className="font-medium text-violet-600 hover:text-violet-800"
                              >
                                {r.customerName || "—"}
                              </Link>
                            </td>
                            <td className="px-4 py-3 text-right text-sm tabular-nums">
                              <Money value={r.bucket_0_30 || 0} />
                            </td>
                            <td className="px-4 py-3 text-right text-sm tabular-nums">
                              <Money value={r.bucket_31_60 || 0} />
                            </td>
                            <td className="px-4 py-3 text-right text-sm tabular-nums">
                              <Money value={r.bucket_61_90 || 0} />
                            </td>
                            <td className="px-4 py-3 text-right text-sm tabular-nums">
                              <Money value={r.bucket_90_plus || 0} />
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium tabular-nums">
                              <Money value={t} />
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  {agingTotal && aging?.length > 0 && (
                    <tfoot className="bg-slate-50 font-medium">
                      <tr>
                        <td className="px-4 py-3 text-slate-700">Total</td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          <Money value={agingTotal.b0} />
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          <Money value={agingTotal.b1} />
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          <Money value={agingTotal.b2} />
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          <Money value={agingTotal.b3} />
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          <Money value={agingTotal.b0 + agingTotal.b1 + agingTotal.b2 + agingTotal.b3} />
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
            </>
          )}

          {activeReport === "outstanding" && (
            <>
              {outstandingChartData?.length > 0 && !loading && (
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="mb-4 text-sm font-semibold text-slate-700">
                    Outstanding by Customer (Top 10)
                  </h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={outstandingChartData} margin={{ left: 20, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={80} />
                        <YAxis tickFormatter={formatMoneyTooltip} />
                        <Tooltip formatter={(v) => formatMoneyTooltip(v)} />
                        <Bar dataKey="amount" fill="#8b5cf6" name="Balance due" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Invoice
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Issue date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Due date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Balance due
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                          Loading…
                        </td>
                      </tr>
                    ) : !outstanding?.data?.length ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                          No outstanding invoices.
                        </td>
                      </tr>
                    ) : (
                      outstanding?.data?.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <Link
                              to={`/invoices/${inv.id}`}
                              className="font-medium text-violet-600 hover:text-violet-800"
                            >
                              {inv.invoiceNumber}
                            </Link>
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              to={inv.clientId ? `/customers/${inv.clientId}` : "#"}
                              className="text-slate-700 hover:text-violet-600"
                            >
                              {inv.client?.companyName || inv.client?.contactName || "—"}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {formatDate(inv.issueDate)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {formatDate(inv.dueDate)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                inv.status === "OVERDUE"
                                  ? "bg-amber-100 text-amber-800"
                                  : inv.status === "PARTIALLY_PAID"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {inv.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-medium tabular-nums">
                            <Money value={inv.balanceDue || 0} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {outstanding?.meta && outstanding.meta.totalPages > 1 && (
                <Pagination
                  page={outstanding.meta.page}
                  limit={outstanding.meta.limit}
                  total={outstanding.meta.total}
                  onPageChange={setOutstandingPage}
                />
              )}
            </div>
            </>
          )}

          {activeReport === "revenue-accrual" && (
            <>
              {revenueAccrualChartData?.length > 0 && !loading && (
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="mb-4 text-sm font-semibold text-slate-700">
                    Revenue (Accrual) Over Time
                  </h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueAccrualChartData} margin={{ left: 20, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="label" />
                        <YAxis tickFormatter={formatMoneyTooltip} />
                        <Tooltip formatter={(v) => formatMoneyTooltip(v)} />
                        <Bar dataKey="revenue" fill="#8b5cf6" name="Revenue" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Month
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Revenue (Accrual)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {loading ? (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-sm text-slate-500">
                          Loading…
                        </td>
                      </tr>
                    ) : revenueAccrual?.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-sm text-slate-500">
                          No revenue data for the selected period.
                        </td>
                      </tr>
                    ) : (
                      revenueAccrual?.map((r, i) => (
                        <tr key={r.month || i} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {formatMonth(r.month)}
                          </td>
                          <td className="px-4 py-3 text-right font-medium tabular-nums">
                            <Money value={r.revenue || 0} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {revenueAccrual?.length > 0 && (
                    <tfoot className="bg-slate-50 font-medium">
                      <tr>
                        <td className="px-4 py-3 text-slate-700">Total</td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          <Money
                            value={revenueAccrual.reduce(
                              (acc, r) => acc + Number(r.revenue || 0),
                              0
                            )}
                          />
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
            </>
          )}

          {activeReport === "revenue-cash" && (
            <>
              {revenueCashChartData?.length > 0 && !loading && (
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="mb-4 text-sm font-semibold text-slate-700">
                    Cash Received Over Time
                  </h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueCashChartData} margin={{ left: 20, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="label" />
                        <YAxis tickFormatter={formatMoneyTooltip} />
                        <Tooltip formatter={(v) => formatMoneyTooltip(v)} />
                        <Bar dataKey="cash" fill="#22c55e" name="Cash received" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
              <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Month
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Cash received
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {loading ? (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-sm text-slate-500">
                          Loading…
                        </td>
                      </tr>
                    ) : revenueCash?.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-4 py-8 text-center text-sm text-slate-500">
                          No cash data for the selected period.
                        </td>
                      </tr>
                    ) : (
                      revenueCash?.map((r, i) => (
                        <tr key={r.month || i} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {formatMonth(r.month)}
                          </td>
                          <td className="px-4 py-3 text-right font-medium tabular-nums">
                            <Money value={r.cash_received || 0} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {revenueCash?.length > 0 && (
                    <tfoot className="bg-slate-50 font-medium">
                      <tr>
                        <td className="px-4 py-3 text-slate-700">Total</td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          <Money
                            value={revenueCash.reduce(
                              (acc, r) => acc + Number(r.cash_received || 0),
                              0
                            )}
                          />
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
            </>
          )}

          {activeReport === "loans" && (
            <>
              {!loading && (
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total loaned</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-900"><Money value={loansSummary?.totalLoaned || 0} /></div>
                    <div className="mt-1 text-xs text-slate-500">{loansSummary?.totalLoans ?? 0} loans recorded</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Outstanding</div>
                    <div className="mt-2 text-2xl font-semibold text-red-600"><Money value={loansSummary?.totalOutstanding || 0} /></div>
                    <div className="mt-1 text-xs text-slate-500">Still owed to you</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Repaid</div>
                    <div className="mt-2 text-2xl font-semibold text-emerald-600"><Money value={loansSummary?.totalRepaid || 0} /></div>
                    <div className="mt-1 text-xs text-slate-500">Recovered so far</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Borrowers</div>
                    <div className="mt-2 text-2xl font-semibold text-slate-900">{loansSummary?.uniqueBorrowers ?? 0}</div>
                    <div className="mt-1 text-xs text-slate-500">Unique people/customers</div>
                  </div>
                </div>
              )}

              {(loansBorrowerChartData.length > 0 || loansStatusPieData.length > 0) && !loading && (
                <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {loansBorrowerChartData.length > 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <h3 className="mb-4 text-sm font-semibold text-slate-700">Outstanding Loans by Borrower</h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={loansBorrowerChartData} margin={{ left: 20, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={80} />
                            <YAxis tickFormatter={formatMoneyTooltip} />
                            <Tooltip formatter={(v) => formatMoneyTooltip(v)} />
                            <Legend />
                            <Bar dataKey="outstanding" fill="#ef4444" name="Outstanding" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="loaned" fill="#8b5cf6" name="Loaned" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                  {loansStatusPieData.length > 0 && (
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <h3 className="mb-4 text-sm font-semibold text-slate-700">Loans by Status</h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={loansStatusPieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={2}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {loansStatusPieData.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(v) => `${v}`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Borrower</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Loan date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Due date</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">Amount</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">Outstanding</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">Loading…</td>
                        </tr>
                      ) : loansReport.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">No loans found.</td>
                        </tr>
                      ) : (
                        loansReport.map((loan) => (
                          <tr key={loan.id} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3">
                              <Link to={`/loans/${loan.id}`} className="font-medium text-violet-600 hover:text-violet-800">
                                {loan.borrowerName || "—"}
                              </Link>
                              {loan.borrowerContact ? <div className="text-xs text-slate-500">{loan.borrowerContact}</div> : null}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">
                              {loan.customer?.companyName || loan.customer?.contactName || "—"}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600">{formatDate(loan.loanDate)}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{formatDate(loan.dueDate)}</td>
                            <td className="px-4 py-3 text-right font-medium tabular-nums"><Money value={loan.amount || 0} /></td>
                            <td className="px-4 py-3 text-right font-medium tabular-nums"><Money value={loan.outstandingBalance || 0} /></td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                loan.status === "REPAID"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : loan.status === "PARTIALLY_REPAID"
                                  ? "bg-amber-100 text-amber-800"
                                  : loan.status === "WRITTEN_OFF"
                                  ? "bg-slate-100 text-slate-700"
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                {String(loan.status || "ACTIVE").replaceAll("_", " ")}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                    {!loading && loansReport.length > 0 && (
                      <tfoot className="bg-slate-50 font-medium">
                        <tr>
                          <td colSpan={4} className="px-4 py-3 text-slate-700">Total</td>
                          <td className="px-4 py-3 text-right tabular-nums"><Money value={loansSummary?.totalLoaned || 0} /></td>
                          <td className="px-4 py-3 text-right tabular-nums"><Money value={loansSummary?.totalOutstanding || 0} /></td>
                          <td className="px-4 py-3" />
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>
            </>
          )}

          {activeReport === "trial-balance" && (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Account
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Type
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Debits
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                        Credits
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                          Loading…
                        </td>
                      </tr>
                    ) : !trialBalance?.accounts?.length ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-sm text-slate-500">
                          No trial balance data. Create invoices, bills, or journal entries first.
                        </td>
                      </tr>
                    ) : (
                      trialBalance.accounts.map((r) => (
                        <tr key={r.accountCode} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <span className="font-mono text-slate-700">{r.accountCode}</span>
                            <span className="ml-2 text-slate-900">{r.accountName}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">{r.accountType}</td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            <Money value={r.debits || 0} />
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            <Money value={r.credits || 0} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {trialBalance?.totalDebits != null && trialBalance?.accounts?.length > 0 && (
                    <tfoot className="bg-slate-50 font-medium">
                      <tr>
                        <td colSpan={2} className="px-4 py-3 text-slate-700">
                          Total (as of {trialBalance.asOf ? formatDate(trialBalance.asOf) : "—"})
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          <Money value={trialBalance.totalDebits} />
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          <Money value={trialBalance.totalCredits} />
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          )}

          {activeReport === "balance-sheet" && (
            <div className="space-y-6">
              {loading ? (
                <div className="py-8 text-center text-sm text-slate-500">Loading…</div>
              ) : !balanceSheet ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  No balance sheet data available.
                </div>
              ) : (
                <>
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <h3 className="bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                      Assets
                    </h3>
                    <table className="min-w-full divide-y divide-slate-200">
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {balanceSheet.assets?.accounts?.map((a) => (
                          <tr key={a.accountCode} className="hover:bg-slate-50/50">
                            <td className="px-4 py-2 font-mono text-sm text-slate-600">{a.accountCode}</td>
                            <td className="px-4 py-2 text-slate-900">{a.accountName}</td>
                            <td className="px-4 py-2 text-right tabular-nums">
                              <Money value={a.amount} />
                            </td>
                          </tr>
                        )) || null}
                      </tbody>
                      <tfoot className="bg-slate-50">
                        <tr>
                          <td colSpan={2} className="px-4 py-3 font-medium text-slate-700">Total Assets</td>
                          <td className="px-4 py-3 text-right font-medium tabular-nums">
                            <Money value={balanceSheet.assets?.total || 0} />
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <h3 className="bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                      Liabilities
                    </h3>
                    <table className="min-w-full divide-y divide-slate-200">
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {balanceSheet.liabilities?.accounts?.map((a) => (
                          <tr key={a.accountCode} className="hover:bg-slate-50/50">
                            <td className="px-4 py-2 font-mono text-sm text-slate-600">{a.accountCode}</td>
                            <td className="px-4 py-2 text-slate-900">{a.accountName}</td>
                            <td className="px-4 py-2 text-right tabular-nums">
                              <Money value={a.amount} />
                            </td>
                          </tr>
                        )) || null}
                      </tbody>
                      <tfoot className="bg-slate-50">
                        <tr>
                          <td colSpan={2} className="px-4 py-3 font-medium text-slate-700">Total Liabilities</td>
                          <td className="px-4 py-3 text-right font-medium tabular-nums">
                            <Money value={balanceSheet.liabilities?.total || 0} />
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <h3 className="bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                      Equity
                    </h3>
                    <table className="min-w-full divide-y divide-slate-200">
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {balanceSheet.equity?.accounts?.map((a) => (
                          <tr key={a.accountCode} className="hover:bg-slate-50/50">
                            <td className="px-4 py-2 font-mono text-sm text-slate-600">{a.accountCode}</td>
                            <td className="px-4 py-2 text-slate-900">{a.accountName}</td>
                            <td className="px-4 py-2 text-right tabular-nums">
                              <Money value={a.amount} />
                            </td>
                          </tr>
                        )) || null}
                        {balanceSheet.equity?.netIncome != null && Number(balanceSheet.equity.netIncome) !== 0 && (
                          <tr className="hover:bg-slate-50/50">
                            <td className="px-4 py-2" />
                            <td className="px-4 py-2 text-slate-900">Net Income</td>
                            <td className="px-4 py-2 text-right tabular-nums">
                              <Money value={balanceSheet.equity.netIncome} />
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot className="bg-slate-50">
                        <tr>
                          <td colSpan={2} className="px-4 py-3 font-medium text-slate-700">Total Equity</td>
                          <td className="px-4 py-3 text-right font-medium tabular-nums">
                            <Money value={balanceSheet.equity?.total || 0} />
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <h3 className="bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                      Reconciliation
                    </h3>
                    <table className="min-w-full divide-y divide-slate-200">
                      <tbody className="divide-y divide-slate-100 bg-white">
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-2 text-slate-900">Income to date</td>
                          <td className="px-4 py-2 text-right tabular-nums"><Money value={balanceSheet.reconciliation?.income || 0} /></td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-2 text-slate-900">Expenses to date</td>
                          <td className="px-4 py-2 text-right tabular-nums"><Money value={balanceSheet.reconciliation?.expenses || 0} /></td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="px-4 py-2 text-slate-900 font-medium">Net Income</td>
                          <td className="px-4 py-2 text-right tabular-nums font-medium"><Money value={balanceSheet.reconciliation?.netIncome || 0} /></td>
                        </tr>
                        {Number(balanceSheet.reconciliation?.imbalanceAmount || 0) !== 0 ? (
                          <tr className="bg-amber-50/60">
                            <td className="px-4 py-2 text-amber-900 font-medium">Unbalanced difference</td>
                            <td className="px-4 py-2 text-right tabular-nums font-medium text-amber-900"><Money value={balanceSheet.reconciliation?.imbalanceAmount || 0} /></td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                  {balanceSheet.balanced === false && (
                    <p className="text-amber-600 text-sm">
                      Note: Assets do not equal Liabilities + Equity. Ensure all transactions are posted.
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {activeReport === "profit-loss" && (
            <div className="space-y-6">
              {loading ? (
                <div className="py-8 text-center text-sm text-slate-500">Loading…</div>
              ) : !profitLoss ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  No profit & loss data for the selected period.
                </div>
              ) : (
                <>
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <h3 className="bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                      Income
                    </h3>
                    <table className="min-w-full divide-y divide-slate-200">
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {profitLoss.income?.accounts?.map((a) => (
                          <tr key={a.accountCode} className="hover:bg-slate-50/50">
                            <td className="px-4 py-2 font-mono text-sm text-slate-600">{a.accountCode}</td>
                            <td className="px-4 py-2 text-slate-900">{a.accountName}</td>
                            <td className="px-4 py-2 text-right tabular-nums">
                              <Money value={a.amount} />
                            </td>
                          </tr>
                        )) || null}
                      </tbody>
                      <tfoot className="bg-slate-50">
                        <tr>
                          <td colSpan={2} className="px-4 py-3 font-medium text-slate-700">Total Income</td>
                          <td className="px-4 py-3 text-right font-medium tabular-nums">
                            <Money value={profitLoss.income?.total || 0} />
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="rounded-xl border border-slate-200 overflow-hidden">
                    <h3 className="bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                      Expenses
                    </h3>
                    <table className="min-w-full divide-y divide-slate-200">
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {profitLoss.expenses?.accounts?.map((a) => (
                          <tr key={a.accountCode} className="hover:bg-slate-50/50">
                            <td className="px-4 py-2 font-mono text-sm text-slate-600">{a.accountCode}</td>
                            <td className="px-4 py-2 text-slate-900">{a.accountName}</td>
                            <td className="px-4 py-2 text-right tabular-nums">
                              <Money value={a.amount} />
                            </td>
                          </tr>
                        )) || null}
                      </tbody>
                      <tfoot className="bg-slate-50">
                        <tr>
                          <td colSpan={2} className="px-4 py-3 font-medium text-slate-700">Total Expenses</td>
                          <td className="px-4 py-3 text-right font-medium tabular-nums">
                            <Money value={profitLoss.expenses?.total || 0} />
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="rounded-xl border border-violet-200 bg-violet-50/50 overflow-hidden">
                    <table className="min-w-full">
                      <tfoot>
                        <tr>
                          <td colSpan={2} className="px-4 py-3 font-semibold text-slate-800">Net Income</td>
                          <td className="px-4 py-3 text-right font-semibold tabular-nums">
                            <Money value={profitLoss.netIncome || 0} />
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

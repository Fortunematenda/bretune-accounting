import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { api } from "../lib/api";
import { AlertTriangle, BarChart3, Building2, BookOpen, Calendar, ChevronDown, CreditCard, FileText, FilePlus2, Landmark, LayoutGrid, Package, Pencil, PieChart, Plus, Receipt, RefreshCw, Sparkles, Timer, TrendingUp, Users, Wallet } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/button";
import Money from "../components/common/money";
import KpiCard from "../components/dashboard/KpiCard";
import AgingSummary from "../components/dashboard/AgingSummary";
import RecentActivity from "../components/dashboard/RecentActivity";
import MobileActionBar from "../components/dashboard/MobileActionBar";
import InvoicesOwedCard from "../components/dashboard/InvoicesOwedCard";
import BillsToPayCard from "../components/dashboard/BillsToPayCard";
import TasksCard from "../components/dashboard/TasksCard";
import RecentInvoicePaymentsCard from "../components/dashboard/RecentInvoicePaymentsCard";
import BankAccountCard from "../components/dashboard/BankAccountCard";
import LoansCard from "../components/dashboard/LoansCard";
import RevenueExpenseChart from "../components/dashboard/RevenueExpenseChart";
import CashFlowChart from "../components/dashboard/CashFlowChart";
import QuickActionsMenu from "../components/dashboard/QuickActionsMenu";
import AIAssistantPanel from "../components/dashboard/AIAssistantPanel";
import NetworkStatusWidget from "../components/dashboard/NetworkStatusWidget";
import { useAuth } from "../features/auth/auth-context";
import { formatDateForDisplay } from "../lib/dateFormat";

function getCurrentMonthRange() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const start = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`;
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const end = `${lastDay.getFullYear()}-${pad(lastDay.getMonth() + 1)}-${pad(lastDay.getDate())}`;
  return { start, end };
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [tasksSummary, setTasksSummary] = useState(null);
  const [loansSummary, setLoansSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(null);
  const filtersRef = useRef(null);

  const defaultMonthRange = useMemo(() => getCurrentMonthRange(), []);
  const [dateRangeDraft, setDateRangeDraft] = useState(defaultMonthRange);
  const [dateRange, setDateRange] = useState(defaultMonthRange);
  const [layout, setLayout] = useState({
    kpis: true,
    agingSummary: true,
    recentActivity: true,
    revenueExpenseChart: true,
    cashFlowChart: true,
    aiAssistant: true,
    networkStatus: true,
    revenueCard: false,
    topUnpaidCustomers: false,
    unpaidSplit: false,
    arAgingByCustomer: false,
    unpaidTransactions: false,
    fixedAssetsCount: false,
    journalEntriesMtd: false,
    currencyRates: false,
    payRunStatus: false,
    upcomingBills: false,
    loansCard: true,
  });

  const [period, setPeriod] = useState("month"); // month | quarter | year

  const layoutStorageKey = useMemo(() => {
    const id = user?.id || user?.userId || user?.email || "anon";
    return `dashboard_layout_${id}`;
  }, [user]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(layoutStorageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return;
      setLayout((prev) => ({ ...prev, ...parsed }));
    } catch {
      // ignore
    }
  }, [layoutStorageKey]);

  function updateLayout(next) {
    setLayout(next);
    try {
      window.localStorage.setItem(layoutStorageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  const fetchDashboard = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = {};
    if (dateRange.start && dateRange.end) {
      params.start = dateRange.start;
      params.end = dateRange.end;
    } else if (dateRange.end) {
      params.asOf = dateRange.end;
    } else if (dateRange.start) {
      params.start = dateRange.start;
      params.end = dateRange.start;
    }
    const quickParams = params.asOf ? { asOf: params.asOf } : {};
    api
      .dashboardSummaryQuick(quickParams)
      .then((quick) => {
        setSummary(quick);
        setError(null);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Failed to load dashboard");
        setLoading(false);
      });
    api
      .dashboardSummary(params)
      .then((full) => {
        setSummary(full);
      })
      .catch(() => {
        // Quick data already shown; full load failed silently
      });
    api
      .tasksDashboardSummary()
      .then(setTasksSummary)
      .catch(() => setTasksSummary(null));
    api
      .getLoansSummary()
      .then(setLoansSummary)
      .catch(() => setLoansSummary(null));
  }, [dateRange.start, dateRange.end]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (!openFilter) return;
      const t = e.target;
      if (filtersRef.current && filtersRef.current.contains(t)) return;
      setOpenFilter(null);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [openFilter]);

  const kpis = useMemo(() => {
    const k = summary?.kpis || {};
    return [
      {
        key: "outstandingReceivables",
        title: "A/R Outstanding",
        icon: Receipt,
        value: <Money value={k.outstandingReceivables?.value || 0} />,
        label: "Total receivables",
        trend: k.outstandingReceivables?.trend,
        tone: "violet",
      },
      {
        key: "overdueReceivables",
        title: "A/R Overdue",
        icon: Timer,
        value: <Money value={k.overdueReceivables?.value || 0} />,
        label: "Past due amounts",
        trend: k.overdueReceivables?.trend,
        tone: "amber",
      },
      {
        key: "cashCollectedMtd",
        title: k.cashCollectedMtd?.isWholeTotal ? "Cash Collected" : "Cash Collected MTD",
        icon: CreditCard,
        value: <Money value={k.cashCollectedMtd?.value || 0} />,
        label: k.cashCollectedMtd?.isWholeTotal ? "Total cash collected" : "Month to date",
        trend: k.cashCollectedMtd?.trend,
        tone: "emerald",
      },
      {
        key: "invoicesIssuedMtd",
        title: "Invoices Issued MTD",
        icon: FilePlus2,
        value: String(k.invoicesIssuedMtd?.value ?? "—"),
        label: "This month",
        trend: k.invoicesIssuedMtd?.trend,
        tone: "blue",
      },
    ];
  }, [summary]);

  const monthlyChartData = useMemo(() => {
    const monthly = summary?.monthlyRevenue;
    if (!monthly) return [];
    const months = Array.isArray(monthly.months) ? monthly.months : [];
    return months.map((m) => ({
      revenue: Number(m.revenue || m.invoiced || 0),
      expenses: Number(m.expenses || m.costs || 0),
    }));
  }, [summary]);

  const cashFlowData = useMemo(() => {
    const cf = summary?.cashFlow;
    if (!cf) return [];
    const months = Array.isArray(cf.months) ? cf.months : [];
    return months.map((m) => ({
      cashIn: Number(m.cashIn || m.received || 0),
      cashOut: Number(m.cashOut || m.paid || 0),
    }));
  }, [summary]);

  const kpiSparklines = useMemo(() => {
    const sparks = summary?.sparklines || {};
    const build = (arr) => {
      if (!Array.isArray(arr) || arr.length < 2) return undefined;
      return arr.map((v, i) => ({ v: Number(v || 0) }));
    };
    return {
      outstandingReceivables: build(sparks.outstandingReceivables),
      overdueReceivables: build(sparks.overdueReceivables),
      cashCollectedMtd: build(sparks.cashCollectedMtd),
      invoicesIssuedMtd: build(sparks.invoicesIssuedMtd),
    };
  }, [summary]);

  const dashboardCompanyName = useMemo(() => {
    const direct = user?.companyName;
    if (direct) return String(direct);
    const composed = (user?.firstName || user?.lastName) ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim() : "";
    return composed || "your company";
  }, [user]);

  const dateRangeLabel = useMemo(() => {
    if (!dateRange?.start && !dateRange?.end) return "Date range";
    const s = dateRange?.start ? String(dateRange.start) : "";
    const e = dateRange?.end ? String(dateRange.end) : "";
    if (s && e) return `${s} - ${e}`;
    if (s) return `From ${s}`;
    return `To ${e}`;
  }, [dateRange]);

  const tiles = summary?.tiles || {};
  const topUnpaid = Array.isArray(tiles.topUnpaidCustomers) ? tiles.topUnpaidCustomers : [];
  const agingByCustomer = Array.isArray(tiles.arAgingByCustomer) ? tiles.arAgingByCustomer : [];
  const unpaidTransactions = Array.isArray(tiles.unpaidTransactions) ? tiles.unpaidTransactions : [];
  const split = Array.isArray(tiles.unpaidSplit) ? tiles.unpaidSplit : [];

  const enterprise = summary?.enterprise || {};
  const fixedAssetCount = enterprise.fixedAssetCount ?? 0;
  const journalEntriesMtd = enterprise.journalEntriesMtd ?? 0;
  const currencyInfo = enterprise.currencyInfo || {
    baseCurrencyCode: "ZAR",
    displayCurrencyCode: "ZAR",
    rateCount: 0,
    rateVsUsd: null,
  };
  const payRunStatus = enterprise.payRunStatus || { DRAFT: 0, PROCESSED: 0, PAID: 0, CANCELLED: 0 };
  const upcomingBills = Array.isArray(enterprise.upcomingBills) ? enterprise.upcomingBills : [];
  const overdueBills = enterprise.overdueBills || { amount: 0, count: 0 };
  const recentInvoicePayments = summary?.recentInvoicePayments || [];

  const splitTotal = useMemo(() => {
    return split.reduce((acc, s) => acc + Number(s?.value || 0), 0);
  }, [split]);

  const donutSeries = useMemo(() => {
    const palette = [
      "#fb7185",
      "#fda4af",
      "#fecdd3",
      "#ffe4e6",
      "#e11d48",
      "#be123c",
      "#9f1239",
      "#881337",
      "#f43f5e",
      "#fecaca",
    ];
    return (split || []).slice(0, 10).map((s, idx) => ({
      label: s.label,
      value: Number(s.value || 0),
      color: palette[idx % palette.length],
    }));
  }, [split]);

  function fmtMoney(v) {
    return <Money value={v || 0} />;
  }

  const companyInitials = useMemo(() => {
    const name = dashboardCompanyName || "";
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) return (words[0][0] || "") + (words[1][0] || "");
    return name.slice(0, 2).toUpperCase() || "CO";
  }, [dashboardCompanyName]);

  return (
    <div className="min-h-screen dashboard-bg p-4 sm:p-6 lg:p-8 space-y-6">
      {error ? (
        <div className="inline-flex w-full items-center gap-2.5 rounded-xl border border-red-200/80 bg-red-50/80 backdrop-blur-sm px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      {/* Modern company header with greeting */}
      <div className="hidden sm:block relative z-50">
        <div className="relative rounded-2xl border border-slate-200/80 bg-white/60 backdrop-blur-sm p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/[0.05] via-transparent to-indigo-500/[0.03]" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-violet-700 text-white font-bold text-lg shadow-lg shadow-violet-600/20">
                {companyInitials}
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-slate-900 truncate tracking-tight">{dashboardCompanyName}</h1>
                <p className="text-sm text-slate-400 mt-0.5">Business Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {/* Period selector */}
              <div className="flex items-center gap-1 rounded-lg bg-slate-100/80 p-0.5">
                {[
                  { key: "month", label: "Month" },
                  { key: "quarter", label: "Quarter" },
                  { key: "year", label: "Year" },
                ].map((o) => (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() => setPeriod(o.key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                      period === o.key
                        ? "bg-white text-slate-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>

              <div className="relative" ref={filtersRef}>
                <button
                  type="button"
                  className="h-9 rounded-xl border border-slate-200/80 bg-white/80 px-3.5 text-xs font-medium text-slate-600 flex items-center gap-2 hover:bg-white hover:border-slate-300 transition-colors"
                  onClick={() => {
                    setOpenFilter((p) => {
                      if (p === "date") return null;
                      setDateRangeDraft((d) => ({ ...d, ...dateRange }));
                      return "date";
                    });
                  }}
                >
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate max-w-[140px]">{dateRangeLabel}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                {openFilter === "date" ? (
                  <div className="absolute right-0 z-[60] mt-2 w-80 rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 p-5">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3">Date Range</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-medium text-slate-500">Start</div>
                        <input
                          type="date"
                          className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 outline-none transition-all"
                          value={dateRangeDraft.start}
                          onChange={(e) => setDateRangeDraft((p) => ({ ...p, start: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-medium text-slate-500">End</div>
                        <input
                          type="date"
                          className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs focus:ring-2 focus:ring-violet-500/20 focus:border-violet-300 outline-none transition-all"
                          value={dateRangeDraft.end}
                          onChange={(e) => setDateRangeDraft((p) => ({ ...p, end: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-8 text-xs rounded-lg"
                        onClick={() => {
                          setDateRangeDraft({ start: "", end: "" });
                          setDateRange({ start: "", end: "" });
                          setOpenFilter(null);
                        }}
                      >
                        Clear
                      </Button>
                      <Button
                        type="button"
                        className="h-8 text-xs rounded-lg bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-600/20"
                        onClick={() => {
                          setDateRange({ ...dateRangeDraft });
                          setOpenFilter(null);
                        }}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                className="h-9 w-9 rounded-xl border border-slate-200/80 bg-white/80 flex items-center justify-center text-slate-500 hover:bg-white hover:border-slate-300 hover:text-slate-700 transition-colors"
                onClick={fetchDashboard}
                title="Refresh"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              </button>
              <Link to="/reports" className="h-9 rounded-xl border border-slate-200/80 bg-white/80 px-3.5 text-xs font-medium text-slate-600 flex items-center gap-2 hover:bg-white hover:border-slate-300 transition-colors">
                <BarChart3 className="h-3.5 w-3.5 text-slate-400" />
                Reports
              </Link>
              <QuickActionsMenu />
              <Button
                type="button"
                variant="outline"
                className="h-9 text-xs rounded-xl"
                onClick={() => setCustomizeOpen(true)}
              >
                <Pencil className="h-3.5 w-3.5 mr-1" />
                Customize
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-violet-700 text-white font-bold text-sm shadow-md shadow-violet-600/20">
              {companyInitials}
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-slate-900 truncate">{dashboardCompanyName}</h1>
              <p className="text-[11px] text-slate-400">Dashboard</p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="h-8 text-xs rounded-lg border-slate-200"
            onClick={() => setCustomizeOpen(true)}
          >
            <Pencil className="h-3 w-3 mr-1" />
            Edit
          </Button>
        </div>

        {/* Mobile date filter */}
        <div className="relative mb-3" ref={!filtersRef.current ? filtersRef : undefined}>
          <button
            type="button"
            className="w-full rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-xs text-slate-600 flex items-center justify-between gap-2"
            onClick={() => {
              setOpenFilter((p) => {
                if (p === "date") return null;
                setDateRangeDraft((d) => ({ ...d, ...dateRange }));
                return "date";
              });
            }}
          >
            <span className="flex items-center gap-2 min-w-0">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span className="truncate">{dateRangeLabel}</span>
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
        </div>
      </div>

      <MobileActionBar
        onNewInvoice={() => navigate("/invoices/new")}
        onRecordPayment={() => navigate("/payments")}
        onSendStatement={() => navigate("/statements")}
      />

      {/* Primary financial cards row */}
      {!loading ? (
        <div className="stagger-children grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <InvoicesOwedCard
            totalOwed={summary?.kpis?.outstandingReceivables?.value}
            overdueAmount={summary?.kpis?.overdueReceivables?.value}
            totalCount={summary?.kpis?.outstandingReceivables?.count}
            overdueCount={summary?.kpis?.overdueReceivables?.count}
            agingBuckets={summary?.agingSummary}
            onNewInvoice={() => navigate("/invoices/new")}
          />
          <BillsToPayCard
            bills={upcomingBills}
            overdueAmount={overdueBills.amount}
            overdueCount={overdueBills.count}
            onAddBill={() => navigate("/bills/new")}
          />
          <BankAccountCard
            label="Business Bank Account"
            accountNumber={null}
            balance={0}
            reconcileCount={0}
            onImport={() => navigate("/bank-accounts")}
          />
          <BankAccountCard
            label="Business Savings Account"
            accountNumber={null}
            balance={0}
            reconcileCount={0}
            onImport={() => navigate("/bank-accounts")}
          />
        </div>
      ) : null}

      {/* Loans section */}
      {layout.loansCard && !loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <LoansCard
            summary={loansSummary}
            onNewLoan={() => navigate("/loans")}
          />
          <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-sm sm:col-span-1 xl:col-span-2">
            <div className="p-5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-indigo-500/10 flex items-center justify-center ring-1 ring-indigo-500/20">
                  <Landmark className="h-4 w-4 text-indigo-600" strokeWidth={1.8} />
                </div>
                <span className="text-[13px] font-semibold text-slate-800">Outstanding Loans by Borrower</span>
              </div>
            </div>
            <CardContent>
              {!loansSummary || Number(loansSummary.totalLoaned ?? 0) === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                  <p className="text-sm text-slate-600 mb-3">No loans recorded yet.</p>
                  <Button onClick={() => navigate("/loans")} className="bg-violet-600 hover:bg-violet-700 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Record a loan
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {(loansSummary?.topBorrowers || []).length === 0 ? (
                    <div className="text-sm text-slate-500">
                      {Number(loansSummary.totalOutstanding ?? 0) === 0
                        ? "All loans have been repaid."
                        : "Borrower breakdown not available — open Loans for detail."}
                    </div>
                  ) : (
                    (() => {
                      const max = Math.max(...(loansSummary.topBorrowers || []).map((b) => Number(b.outstanding || 0)), 1);
                      return (loansSummary.topBorrowers || []).map((b) => {
                        const pct = Math.max(0, Math.min(100, (Number(b.outstanding || 0) / max) * 100));
                        return (
                          <div key={b.name} className="grid grid-cols-[1fr_auto] gap-3 items-center">
                            <div>
                              <div className="text-xs font-medium text-slate-700 truncate">{b.name}</div>
                              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                <div className="h-full rounded-full bg-violet-500" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                            <div className="text-xs font-semibold text-slate-700 text-right shrink-0">
                              <Money value={b.outstanding} />
                            </div>
                          </div>
                        );
                      });
                    })()
                  )}
                  <div className="pt-1">
                    <Link to="/loans" className="text-xs text-violet-600 hover:text-violet-700 font-medium">
                      View all loans →
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Tasks + Recent invoice payments */}
      {!loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TasksCard
            overdueInvoices={summary?.kpis?.overdueReceivables?.count}
            overdueBills={overdueBills.count}
            reconcileCount={0}
            scheduledTasks={tasksSummary}
          />
          <RecentInvoicePaymentsCard payments={recentInvoicePayments} />
        </div>
      ) : null}

      {loading ? (
        <div className="stagger-children grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm p-5 animate-shimmer">
              <div className="h-3 w-20 rounded-full bg-slate-200/80 mb-4" />
              <div className="h-8 w-28 rounded-lg bg-slate-200/60 mb-3" />
              <div className="h-2.5 w-full rounded-full bg-slate-100/80" />
            </div>
          ))}
        </div>
      ) : null}

      {layout.kpis && !loading ? (
        <div className="stagger-children grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((k) => (
            <KpiCard
              key={k.key}
              title={k.title}
              value={k.value}
              label={k.label}
              trend={k.trend}
              icon={k.icon}
              tone={k.tone}
              sparklineData={kpiSparklines[k.key]}
            />
          ))}
        </div>
      ) : null}

      {/* Charts row: Revenue vs Expense + Cash Flow */}
      {(layout.revenueExpenseChart || layout.cashFlowChart) && !loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {layout.revenueExpenseChart ? <RevenueExpenseChart monthlyData={monthlyChartData} onPeriodChange={() => {}} /> : null}
          {layout.cashFlowChart ? <CashFlowChart cashFlowData={cashFlowData} /> : null}
        </div>
      ) : null}

      {layout.topUnpaidCustomers || layout.unpaidSplit ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {layout.topUnpaidCustomers ? (
            <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-sm">
              <div className="p-5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-violet-500/10 flex items-center justify-center ring-1 ring-violet-500/20">
                    <Receipt className="h-4 w-4 text-violet-600" strokeWidth={1.8} />
                  </div>
                  <span className="text-[13px] font-semibold text-slate-800">Invoices owed to you</span>
                </div>
              </div>
              <CardContent className="pt-0">
                <div className="space-y-2.5">
                  {topUnpaid.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                      <p className="text-sm text-slate-600 mb-3">No unpaid invoices found.</p>
                      <Button onClick={() => navigate("/invoices/new")} className="bg-violet-600 hover:bg-violet-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Create invoice
                      </Button>
                    </div>
                  ) : (
                    (() => {
                      const max = Math.max(...topUnpaid.map((r) => Number(r.amountDue || 0)), 1);
                      return topUnpaid.map((r) => {
                        const pct = Math.max(0, Math.min(100, (Number(r.amountDue || 0) / max) * 100));
                        return (
                          <div key={r.clientId} className="group grid grid-cols-1 sm:grid-cols-[160px_1fr_90px] gap-2 sm:gap-3 items-center">
                            <Link
                              to={`/customers/${r.clientId}`}
                              className="text-xs text-violet-600 hover:text-violet-700 truncate font-semibold"
                            >
                              {r.customerName}
                            </Link>
                            <div className="h-6 rounded-lg bg-slate-100/80 overflow-hidden flex">
                              <div
                                className="h-full rounded-lg shrink-0 transition-all duration-500 ease-out bg-gradient-to-r from-violet-500 to-violet-400"
                                style={{ width: `${pct}%`, minWidth: pct > 0 ? "4px" : 0 }}
                              />
                            </div>
                            <div className="text-right text-xs font-semibold text-slate-700">{fmtMoney(r.amountDue)}</div>
                          </div>
                        );
                      });
                    })()
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div />
          )}

          {layout.unpaidSplit ? (
            <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-sm">
              <div className="p-5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-rose-500/10 flex items-center justify-center ring-1 ring-rose-500/20">
                    <PieChart className="h-4 w-4 text-rose-600" strokeWidth={1.8} />
                  </div>
                  <span className="text-[13px] font-semibold text-slate-800">Unpaid split by status</span>
                </div>
              </div>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="flex items-center justify-center">
                    <svg width="220" height="220" viewBox="0 0 220 220">
                      {(() => {
                        const cx = 110;
                        const cy = 110;
                        const rOuter = 90;
                        const rInner = 55;
                        let a = -Math.PI / 2;

                        function arcPath(start, end) {
                          const large = end - start > Math.PI ? 1 : 0;
                          const x1 = cx + rOuter * Math.cos(start);
                          const y1 = cy + rOuter * Math.sin(start);
                          const x2 = cx + rOuter * Math.cos(end);
                          const y2 = cy + rOuter * Math.sin(end);
                          const xi1 = cx + rInner * Math.cos(end);
                          const yi1 = cy + rInner * Math.sin(end);
                          const xi2 = cx + rInner * Math.cos(start);
                          const yi2 = cy + rInner * Math.sin(start);
                          return [
                            `M ${x1} ${y1}`,
                            `A ${rOuter} ${rOuter} 0 ${large} 1 ${x2} ${y2}`,
                            `L ${xi1} ${yi1}`,
                            `A ${rInner} ${rInner} 0 ${large} 0 ${xi2} ${yi2}`,
                            "Z",
                          ].join(" ");
                        }

                        const series = donutSeries;
                        const total = splitTotal || 0;
                        if (!total || series.length === 0) {
                          return <circle cx={cx} cy={cy} r={rOuter} fill="#f1f5f9" />;
                        }

                        return series.map((s) => {
                          const frac = s.value / total;
                          const end = a + frac * Math.PI * 2;
                          const d = arcPath(a, end);
                          a = end;
                          return <path key={s.label} d={d} fill={s.color} stroke="#fff" strokeWidth="2" />;
                        });
                      })()}
                      <circle cx="110" cy="110" r="54" fill="#fff" />
                    </svg>
                  </div>

                  <div className="space-y-2">
                    {donutSeries.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center">
                        <p className="text-sm text-slate-600">No unpaid amounts to show.</p>
                      </div>
                    ) : (
                      donutSeries.map((s) => (
                        <div key={s.label} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                            <div className="text-xs text-slate-700 truncate">{s.label}</div>
                          </div>
                          <div className="text-xs text-slate-700 shrink-0">
                            {splitTotal ? `${Math.round((s.value / splitTotal) * 1000) / 10}%` : "—"}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div />
          )}
        </div>
      ) : null}

      {layout.arAgingByCustomer || layout.unpaidTransactions ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {layout.arAgingByCustomer ? (
            <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-sm">
              <div className="p-5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center ring-1 ring-amber-500/20">
                    <Receipt className="h-4 w-4 text-amber-600" strokeWidth={1.8} />
                  </div>
                  <span className="text-[13px] font-semibold text-slate-800">AR Aging by Customer</span>
                </div>
              </div>
              <CardContent className="pt-0">
                <div>
                  {agingByCustomer.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                      <p className="text-sm text-slate-600 mb-3">No aging data yet.</p>
                      <Button onClick={() => navigate("/invoices")} variant="outline">
                        View invoices
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="hidden sm:block overflow-auto">
                        <table className="min-w-[520px] w-full text-sm">
                          <thead className="text-left text-slate-500">
                            <tr>
                              <th className="py-2">Customer</th>
                              <th className="py-2 text-right">0-30</th>
                              <th className="py-2 text-right">31-60</th>
                              <th className="py-2 text-right">61-90</th>
                              <th className="py-2 text-right">91+</th>
                              <th className="py-2 text-right">Amount due</th>
                            </tr>
                          </thead>
                          <tbody>
                            {agingByCustomer.slice(0, 10).map((r) => {
                              const total =
                                Number(r.bucket_0_30 || 0) +
                                Number(r.bucket_31_60 || 0) +
                                Number(r.bucket_61_90 || 0) +
                                Number(r.bucket_90_plus || 0);
                              return (
                                <tr key={r.clientId} className="border-t border-slate-100 hover:bg-slate-50/50">
                                  <td className="py-2">
                                    <Link
                                      to={`/customers/${r.clientId}`}
                                      className="font-medium text-violet-600 hover:text-violet-700 truncate block"
                                    >
                                      {r.customerName}
                                    </Link>
                                  </td>
                                  <td className="py-2 text-right">{fmtMoney(r.bucket_0_30)}</td>
                                  <td className="py-2 text-right">{fmtMoney(r.bucket_31_60)}</td>
                                  <td className="py-2 text-right">{fmtMoney(r.bucket_61_90)}</td>
                                  <td className="py-2 text-right">{fmtMoney(r.bucket_90_plus)}</td>
                                  <td className="py-2 text-right font-medium">{fmtMoney(total)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div className="sm:hidden space-y-3">
                        {agingByCustomer.slice(0, 10).map((r) => {
                          const total =
                            Number(r.bucket_0_30 || 0) +
                            Number(r.bucket_31_60 || 0) +
                            Number(r.bucket_61_90 || 0) +
                            Number(r.bucket_90_plus || 0);
                          return (
                            <div key={r.clientId} className="rounded-xl border border-slate-200 p-3">
                              <Link
                                to={`/customers/${r.clientId}`}
                                className="font-medium text-violet-600 hover:text-violet-700 block mb-2"
                              >
                                {r.customerName}
                              </Link>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <span className="text-slate-500">0-30:</span>
                                <span className="text-right">{fmtMoney(r.bucket_0_30)}</span>
                                <span className="text-slate-500">31-60:</span>
                                <span className="text-right">{fmtMoney(r.bucket_31_60)}</span>
                                <span className="text-slate-500">61-90:</span>
                                <span className="text-right">{fmtMoney(r.bucket_61_90)}</span>
                                <span className="text-slate-500">91+:</span>
                                <span className="text-right">{fmtMoney(r.bucket_90_plus)}</span>
                                <span className="text-slate-500 font-medium">Total:</span>
                                <span className="text-right font-medium">{fmtMoney(total)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div />
          )}

          {layout.unpaidTransactions ? (
            <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-sm">
              <div className="p-5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-violet-500/10 flex items-center justify-center ring-1 ring-violet-500/20">
                    <FileText className="h-4 w-4 text-violet-600" strokeWidth={1.8} />
                  </div>
                  <span className="text-[13px] font-semibold text-slate-800">Unpaid Invoices</span>
                </div>
              </div>
              <CardContent className="pt-0">
                <div>
                  {unpaidTransactions.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                      <p className="text-sm text-slate-600 mb-3">No unpaid invoices.</p>
                      <Button onClick={() => navigate("/invoices/new")} className="bg-violet-600 hover:bg-violet-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Create invoice
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="hidden sm:block overflow-auto">
                        <table className="min-w-[520px] w-full text-sm">
                          <thead className="text-left text-slate-500">
                            <tr>
                              <th className="py-2">Customer</th>
                              <th className="py-2">No.</th>
                              <th className="py-2">Contact name</th>
                              <th className="py-2">Date</th>
                              <th className="py-2">Due date</th>
                              <th className="py-2 text-right">Amount due</th>
                            </tr>
                          </thead>
                          <tbody>
                            {unpaidTransactions.map((t) => (
                              <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                                <td className="py-2">
                                  <Link
                                    to={t.clientId ? `/customers/${t.clientId}` : "#"}
                                    className="font-medium text-violet-600 hover:text-violet-700 truncate block"
                                  >
                                    {t.customerName}
                                  </Link>
                                </td>
                                <td className="py-2">
                                  <Link
                                    to={`/invoices/${t.id}`}
                                    className="text-violet-600 hover:text-violet-700"
                                  >
                                    {t.invoiceNumber}
                                  </Link>
                                </td>
                                <td className="py-2">{t.contactName || "—"}</td>
                                <td className="py-2">{formatDateForDisplay(t.issueDate)}</td>
                                <td className="py-2">{formatDateForDisplay(t.dueDate)}</td>
                                <td className="py-2 text-right font-medium">{fmtMoney(t.amountDue)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="sm:hidden space-y-3">
                        {unpaidTransactions.map((t) => (
                          <div key={t.id} className="rounded-xl border border-slate-200 p-3">
                            <Link
                              to={`/invoices/${t.id}`}
                              className="font-medium text-violet-600 hover:text-violet-700 block mb-2"
                            >
                              {t.invoiceNumber}
                            </Link>
                            <div className="text-sm text-slate-700 truncate mb-2">{t.customerName}</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <span className="text-slate-500">Due:</span>
                              <span className="text-right">{formatDateForDisplay(t.dueDate)}</span>
                              <span className="text-slate-500 font-medium">Amount:</span>
                              <span className="text-right font-medium">{fmtMoney(t.amountDue)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div />
          )}
        </div>
      ) : null}

      {layout.agingSummary || layout.recentActivity ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {layout.agingSummary ? (
            <div className="lg:col-span-2">
              <AgingSummary buckets={summary?.agingSummary} />
            </div>
          ) : null}
          {layout.recentActivity ? <RecentActivity items={summary?.recentActivity} /> : null}
          {layout.aiAssistant ? <AIAssistantPanel /> : null}
          {layout.networkStatus ? <NetworkStatusWidget /> : null}
        </div>
      ) : null}

      {layout.revenueCard ? (
        <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.04] to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-60" />
          <div className="relative p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center ring-1 ring-emerald-500/20">
                <TrendingUp className="h-4 w-4 text-emerald-600" strokeWidth={1.8} />
              </div>
              <span className="text-[13px] font-semibold text-slate-800">
                {summary?.monthlyRevenue?.isWholeTotal ? "Revenue (Accrual)" : "Revenue (Accrual) — MTD"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="text-xl font-bold tracking-tight text-slate-900 animate-count-up">
                  <Money value={summary?.kpis?.revenueAccrualMtd?.value || 0} />
                </div>
                <div className="mt-1.5 text-[11px] text-slate-400 font-medium">
                  {summary
                    ? summary.monthlyRevenue?.isWholeTotal
                      ? `${summary.monthlyRevenue?.invoiceCount ?? 0} invoices (total)`
                      : `${summary.monthlyRevenue?.invoiceCount ?? 0} invoices this month`
                    : "Loading…"}
                </div>
              </div>
              <div className="text-[11px] text-slate-400 max-w-[200px]">Revenue (Accrual) vs Cash Received gives a clearer picture.</div>
            </div>
          </div>
        </Card>
      ) : null}

      {layout.fixedAssetsCount || layout.journalEntriesMtd || layout.currencyRates || layout.payRunStatus ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {layout.fixedAssetsCount ? (
            <KpiCard
              title="Active fixed assets"
              value={String(fixedAssetCount)}
              label="Fixed assets currently active."
              icon={Package}
              tone="violet"
            />
          ) : null}
          {layout.journalEntriesMtd ? (
            <KpiCard
              title="Journal entries (MTD)"
              value={String(journalEntriesMtd)}
              label="Manual journal entries posted this month."
              icon={BookOpen}
              tone="blue"
            />
          ) : null}
          {layout.currencyRates ? (
            <div
              className="card-glow group cursor-pointer relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
              onClick={() => navigate("/currencies")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate("/currencies")}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.05] to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 to-violet-400 opacity-60" />
              <div className="relative p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="h-9 w-9 rounded-xl bg-violet-500/10 flex items-center justify-center ring-1 ring-violet-500/20">
                    <Wallet className="h-4 w-4 text-violet-600" strokeWidth={1.8} />
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Currency rates</div>
                </div>
                <div className="text-sm font-bold tracking-tight text-slate-900">
                  {currencyInfo.rateVsUsd != null ? (
                    <>1 USD = {Number(currencyInfo.rateVsUsd).toLocaleString(undefined, { maximumFractionDigits: 4 })} {currencyInfo.displayCurrencyCode}</>
                  ) : (
                    <>{currencyInfo.displayCurrencyCode} · {currencyInfo.rateCount} rates</>
                  )}
                </div>
                <div className="mt-1 text-[11px] text-slate-400">Click to manage currencies</div>
              </div>
            </div>
          ) : null}
          {layout.payRunStatus ? (
            <div className="card-glow group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.05] to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-amber-400 opacity-60" />
              <div className="relative p-5">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center ring-1 ring-amber-500/20">
                    <Users className="h-4 w-4 text-amber-600" strokeWidth={1.8} />
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Pay run status</div>
                </div>
                <div className="flex items-center gap-3 text-sm mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600"><span className="h-2 w-2 rounded-full bg-slate-300"></span>Draft: {payRunStatus.DRAFT ?? 0}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600"><span className="h-2 w-2 rounded-full bg-blue-400"></span>Processed: {payRunStatus.PROCESSED ?? 0}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600"><span className="h-2 w-2 rounded-full bg-emerald-400"></span>Paid: {payRunStatus.PAID ?? 0}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs rounded-lg border-slate-200"
                  onClick={() => navigate("/payroll")}
                >
                  View payroll
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {layout.upcomingBills ? (
        <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-sm">
          <div className="p-5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-amber-500/10 flex items-center justify-center ring-1 ring-amber-500/20">
                <Receipt className="h-4 w-4 text-amber-600" strokeWidth={1.8} />
              </div>
              <span className="text-[13px] font-semibold text-slate-800">Upcoming bills</span>
            </div>
          </div>
          <CardContent className="pt-0">
            <div>
              {upcomingBills.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                  <p className="text-sm text-slate-600 mb-3">No bills due in the next 30 days.</p>
                  <Button onClick={() => navigate("/bills")} variant="outline">
                    View bills
                  </Button>
                </div>
              ) : (
                <>
                  <div className="hidden sm:block overflow-auto">
                    <table className="min-w-[420px] w-full text-sm">
                      <thead className="text-left text-slate-500">
                        <tr>
                          <th className="py-2">Bill #</th>
                          <th className="py-2">Vendor</th>
                          <th className="py-2">Due date</th>
                          <th className="py-2 text-right">Balance due</th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingBills.map((b) => (
                          <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50/50">
                            <td className="py-2">
                              <Link
                                to={`/bills/${b.id}`}
                                className="font-medium text-violet-600 hover:text-violet-700"
                              >
                                #{b.billNumber}
                              </Link>
                            </td>
                            <td className="py-2">{b.vendorName}</td>
                            <td className="py-2">{formatDateForDisplay(b.dueDate)}</td>
                            <td className="py-2 text-right font-medium">{fmtMoney(b.balanceDue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="sm:hidden space-y-3">
                    {upcomingBills.map((b) => (
                      <div key={b.id} className="rounded-xl border border-slate-200 p-3">
                        <Link
                          to={`/bills/${b.id}`}
                          className="font-medium text-violet-600 hover:text-violet-700 block mb-2"
                        >
                          Bill #{b.billNumber}
                        </Link>
                        <div className="text-sm text-slate-700 truncate mb-2">{b.vendorName}</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <span className="text-slate-500">Due:</span>
                          <span className="text-right">{formatDateForDisplay(b.dueDate)}</span>
                          <span className="text-slate-500 font-medium">Balance:</span>
                          <span className="text-right font-medium">{fmtMoney(b.balanceDue)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}

      {customizeOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setCustomizeOpen(false)}
            aria-hidden
          />
          <div
            className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-slate-100 bg-slate-50/50 px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600/10">
                    <LayoutGrid className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Customize dashboard</h2>
                    <p className="text-xs text-slate-500">Choose which widgets to display</p>
                  </div>
                </div>
                <Button type="button" variant="outline" className="h-9" onClick={() => setCustomizeOpen(false)}>
                  Done
                </Button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Overview</h3>
                  <div className="space-y-1.5">
                    {[
                      { key: "kpis", label: "KPI tiles", icon: BarChart3 },
                      { key: "revenueExpenseChart", label: "Revenue vs Expenses chart", icon: TrendingUp },
                      { key: "cashFlowChart", label: "Cash Flow chart", icon: Wallet },
                      { key: "aiAssistant", label: "AI Assistant panel", icon: Sparkles },
                      { key: "networkStatus", label: "Network Status (ISP)", icon: Wallet },
                      { key: "revenueCard", label: "Revenue (accrual)", icon: TrendingUp },
                      { key: "recentActivity", label: "Recent activity", icon: Timer },
                    ].map((w) => (
                      <label
                        key={w.key}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 transition-colors hover:border-violet-500 hover:bg-violet-50"
                      >
                        <w.icon className="h-4 w-4 text-slate-400" />
                        <span className="flex-1 text-sm font-medium text-slate-700">{w.label}</span>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                          checked={Boolean(layout[w.key])}
                          onChange={(e) => updateLayout({ ...layout, [w.key]: e.target.checked })}
                        />
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Receivables</h3>
                  <div className="space-y-1.5">
                    {[
                      { key: "agingSummary", label: "AR aging summary", icon: BarChart3 },
                      { key: "topUnpaidCustomers", label: "Top unpaid customers", icon: Users },
                      { key: "unpaidSplit", label: "Unpaid split (by status)", icon: PieChart },
                      { key: "arAgingByCustomer", label: "AR aging by customer", icon: Receipt },
                      { key: "unpaidTransactions", label: "Unpaid transactions", icon: FilePlus2 },
                    ].map((w) => (
                      <label
                        key={w.key}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 transition-colors hover:border-violet-500 hover:bg-violet-50"
                      >
                        <w.icon className="h-4 w-4 text-slate-400" />
                        <span className="flex-1 text-sm font-medium text-slate-700">{w.label}</span>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                          checked={Boolean(layout[w.key])}
                          onChange={(e) => updateLayout({ ...layout, [w.key]: e.target.checked })}
                        />
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Enterprise</h3>
                  <div className="space-y-1.5">
                    {[
                      { key: "fixedAssetsCount", label: "Fixed assets count", icon: Package },
                      { key: "journalEntriesMtd", label: "Journal entries (MTD)", icon: BookOpen },
                      { key: "currencyRates", label: "Currency rates", icon: Wallet },
                      { key: "payRunStatus", label: "Pay run status", icon: Users },
                      { key: "upcomingBills", label: "Upcoming bills", icon: Receipt },
                    ].map((w) => (
                      <label
                        key={w.key}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 transition-colors hover:border-violet-500 hover:bg-violet-50"
                      >
                        <w.icon className="h-4 w-4 text-slate-400" />
                        <span className="flex-1 text-sm font-medium text-slate-700">{w.label}</span>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                          checked={Boolean(layout[w.key])}
                          onChange={(e) => updateLayout({ ...layout, [w.key]: e.target.checked })}
                        />
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Loans</h3>
                  <div className="space-y-1.5">
                    {[
                      { key: "loansCard", label: "Loans overview & borrowers", icon: Landmark },
                    ].map((w) => (
                      <label
                        key={w.key}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 py-2.5 transition-colors hover:border-violet-500 hover:bg-violet-50"
                      >
                        <w.icon className="h-4 w-4 text-slate-400" />
                        <span className="flex-1 text-sm font-medium text-slate-700">{w.label}</span>
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                          checked={Boolean(layout[w.key])}
                          onChange={(e) => updateLayout({ ...layout, [w.key]: e.target.checked })}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateLayout({
                        kpis: true,
                        agingSummary: true,
                        recentActivity: true,
                        revenueExpenseChart: true,
                        cashFlowChart: true,
                        aiAssistant: true,
                        networkStatus: true,
                        revenueCard: true,
                        topUnpaidCustomers: true,
                        unpaidSplit: true,
                        arAgingByCustomer: true,
                        unpaidTransactions: true,
                        fixedAssetsCount: true,
                        journalEntriesMtd: true,
                        currencyRates: true,
                        payRunStatus: true,
                        upcomingBills: true,
                        loansCard: true,
                      })
                    }
                  >
                    Show all
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateLayout({
                        kpis: false,
                        agingSummary: false,
                        recentActivity: false,
                        revenueExpenseChart: false,
                        cashFlowChart: false,
                        aiAssistant: false,
                        networkStatus: false,
                        revenueCard: false,
                        topUnpaidCustomers: false,
                        unpaidSplit: false,
                        arAgingByCustomer: false,
                        unpaidTransactions: false,
                        fixedAssetsCount: false,
                        journalEntriesMtd: false,
                        currencyRates: false,
                        payRunStatus: false,
                        upcomingBills: false,
                        loansCard: false,
                      })
                    }
                  >
                    Hide all
                  </Button>
                </div>
                <span className="text-xs text-slate-500">Saved automatically</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Receipt,
  BarChart3,
  ArrowRight,
  MessageCircle,
  DollarSign,
  TrendingUp,
  Calculator,
  FileCheck,
  Percent,
  CreditCard,
  Zap,
  Check,
} from "lucide-react";

const navLinks = [
  { to: "/#services", label: "Services" },
  { to: "/about", label: "About Us" },
  { to: "/guides", label: "Guides" },
  { to: "/blog", label: "Blog" },
];

const servicePackages = [
  {
    title: "Small Business & Startup",
    description: "Everything you need to launch. Invoicing, expenses, and basic reporting.",
    detail: "Up to €500k turnover",
    featured: false,
  },
  {
    title: "Growing Business",
    description: "Additional support to reach your goals. Recurring invoices, suppliers & bills.",
    detail: "€500k – €2M turnover",
    featured: false,
  },
  {
    title: "Scale-Up Company",
    description: "Compliance, reporting & performance analysis. Full accounts payable & receivable.",
    detail: "€2M+ turnover",
    featured: false,
  },
  {
    title: "Free Trial",
    description: "Full access for 14 days. No credit card required. Cancel anytime. Start managing your finances today.",
    detail: "14 days free",
    featured: true,
  },
];

export default function LandingPage() {
  return (
    <div
      className="min-h-screen w-full min-w-0 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex h-16 lg:h-[4.5rem] items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 text-white font-bold text-sm shadow-md">
                B
              </div>
              <span className="font-bold text-slate-900 dark:text-white tracking-tight text-sm sm:text-base">
                Bretune Accounting
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={label}
                  to={to}
                  className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors hidden sm:inline"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/35 transition-all hover:scale-[1.02]"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Animated ticker strip - floating/scrolling words */}
      <div className="w-full pt-16 py-3 px-6 sm:px-8 md:px-12 bg-slate-200/50 dark:bg-slate-800/50 border-y border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="py-3 flex items-center justify-center animate-ticker whitespace-nowrap min-w-max">
          {[...Array(3)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-8 shrink-0">
              <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">INVOICE</span>
              <span className="text-slate-500 dark:text-slate-400">€</span>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">RECEIPTS</span>
              <span className="text-slate-500 dark:text-slate-400">$</span>
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">PAID</span>
              <span className="text-slate-500 dark:text-slate-400">£</span>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">BALANCE</span>
              <span className="text-slate-500 dark:text-slate-400">%</span>
              <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">P&L</span>
              <span className="text-slate-500 dark:text-slate-400">→</span>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">STATEMENTS</span>
              <span className="text-slate-500 dark:text-slate-400">123</span>
              <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">EXPENSES</span>
              <span className="text-slate-500 dark:text-slate-400">✓</span>
              </div>
              <div className="shrink-0 w-16 sm:w-24 md:w-32" aria-hidden="true" />
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Hero - split layout */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] pt-24 lg:pt-28 pb-12 lg:pb-0 overflow-hidden bg-slate-100/80 dark:bg-slate-900/50">
        {/* Floating accounting icons - animated */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] left-[8%] animate-float text-violet-400/30 dark:text-violet-500/25" style={{ animationDelay: "0s" }}>
            <FileText className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>
          <div className="absolute top-[25%] right-[15%] animate-float-slow text-rose-400/25 dark:text-rose-500/20" style={{ animationDelay: "1s" }}>
            <DollarSign className="h-7 w-7 sm:h-9 sm:w-9" />
          </div>
          <div className="absolute top-[60%] left-[5%] animate-drift text-indigo-400/30 dark:text-indigo-500/25" style={{ animationDelay: "2s" }}>
            <Receipt className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <div className="absolute top-[70%] right-[10%] animate-float text-violet-400/25 dark:text-violet-500/20" style={{ animationDelay: "0.5s" }}>
            <BarChart3 className="h-7 w-7 sm:h-9 sm:w-9" />
          </div>
          <div className="absolute top-[40%] left-[15%] animate-float-slow text-slate-400/20 dark:text-slate-500/15" style={{ animationDelay: "3s" }}>
            <Calculator className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div className="absolute top-[20%] right-[25%] animate-drift text-indigo-400/25 dark:text-indigo-500/20" style={{ animationDelay: "1.5s" }}>
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <div className="absolute top-[55%] right-[20%] animate-float text-rose-400/20 dark:text-rose-500/15" style={{ animationDelay: "2.5s" }}>
            <FileCheck className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div className="absolute top-[35%] right-[8%] animate-float-slow text-violet-400/20 dark:text-violet-500/15" style={{ animationDelay: "0.8s" }}>
            <Percent className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        </div>

        <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
          <div className="absolute top-20 right-32 w-64 h-64 rounded-full bg-violet-200/40 dark:bg-violet-900/20 blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-20 right-48 w-48 h-48 rounded-full bg-rose-200/30 dark:bg-rose-900/15 blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full border-2 border-violet-200/50 dark:border-violet-700/30 animate-float" />
          <div className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full border border-slate-300/40 dark:border-slate-600/30 animate-float-slow" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              <span className="text-violet-600 dark:text-violet-400">Award-Winning</span>{" "}
              <span className="text-violet-600 dark:text-violet-400">Online</span>{" "}
              <br className="hidden sm:block" />
              Business Services
            </h1>
            <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0">
              Online accounting platform helping your business to launch, grow, and thrive.
            </p>

            {/* Free Trial badge */}
            <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-violet-500/10 dark:from-emerald-500/20 dark:to-violet-500/20 border border-emerald-200/80 dark:border-emerald-700/50 px-5 py-2.5">
              <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                Start your <span className="text-emerald-600 dark:text-emerald-400">free trial</span> — no credit card required
              </span>
            </div>

            {/* Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                Trusted Platform
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                Easy Setup
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5" />
                No card required
              </div>
              <div className="rounded-full bg-violet-100 dark:bg-violet-900/30 px-4 py-2 text-xs font-semibold text-violet-700 dark:text-violet-300">
                Award Winner
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-rose-600 px-6 py-3.5 text-base font-semibold text-white shadow-xl shadow-violet-500/30 hover:shadow-violet-500/40 transition-all w-full sm:w-auto"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/#services"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 dark:border-slate-600 px-6 py-3.5 text-base font-semibold text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors w-full sm:w-auto"
              >
                View Services
              </Link>
            </div>
          </div>

          {/* Right - circular image */}
          <div className="flex-1 flex justify-center lg:justify-end order-1 lg:order-2 w-full lg:max-w-xl">
            <div className="relative animate-float-slow">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-200/50 to-rose-200/50 dark:from-violet-900/20 dark:to-rose-900/20 blur-2xl scale-110 animate-pulse-soft" />
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl ring-4 ring-violet-500/20 dark:ring-violet-500/10">
                <img
                  src="/accounting-professionals.png"
                  alt="Professional accountants collaborating"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Trial highlight strip */}
      <section className="w-full py-8 sm:py-10 bg-white dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-violet-900/80 to-slate-900 dark:from-slate-800 dark:via-violet-900/50 dark:to-slate-800 p-8 sm:p-10 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 text-sm font-semibold text-emerald-400 mb-4">
                  <Zap className="h-4 w-4" />
                  Free trial available
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Try Bretune free for 14 days
                </h2>
                <p className="mt-2 text-slate-300 dark:text-slate-400">
                  Full access to all features. No credit card required. Cancel anytime.
                </p>
                <ul className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-emerald-400 shrink-0" />
                    Unlimited invoices & quotes
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-emerald-400 shrink-0" />
                    Bills & expenses
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-emerald-400 shrink-0" />
                    Reports & dashboards
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-emerald-400 shrink-0" />
                    No card required
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-slate-900 shadow-xl hover:bg-slate-50 transition-colors"
              >
                Start your free trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services section - deep blue/violet background */}
      <section
        id="services"
        className="w-full py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-slate-800 to-slate-900 dark:from-slate-900 dark:to-slate-950"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            {servicePackages.map(({ title, description, detail, featured }) => (
              <Link
                key={title}
                to="/register"
                className={`group rounded-xl p-6 text-left transition-all duration-300 ${
                  featured
                    ? "bg-gradient-to-br from-violet-600 to-rose-600 text-white shadow-2xl shadow-violet-500/30"
                    : "bg-white dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 hover:shadow-xl"
                }`}
              >
                <h3 className="text-lg font-bold">{title}</h3>
                <p className={`mt-2 text-sm ${featured ? "text-white/90" : "text-slate-600 dark:text-slate-400"}`}>
                  {description}
                </p>
                <p className={`mt-3 text-xs font-medium ${featured ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}>
                  {detail}
                </p>
                <div className="mt-4 flex items-center gap-1 font-semibold text-sm">
                  <span className={featured ? "text-white" : "text-violet-600 dark:text-violet-400"}>
                    {featured ? "Start free trial" : "Learn more"}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 sm:mt-16 text-center">
            <p className="text-slate-300 dark:text-slate-400 text-sm sm:text-base">
              Not sure what you need?{" "}
              <Link to="/register" className="text-white font-medium hover:underline inline-flex items-center gap-1">
                Tailor our services to suit your needs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="w-full py-16 sm:py-20 bg-white dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 mb-4">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Invoicing & Quotes</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Create quotes, convert to invoices, and get paid faster.
              </p>
            </div>
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 mb-4">
                <Receipt className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Bills & Expenses</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Track what you owe, manage expenses, and stay on top of cash flow.
              </p>
            </div>
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 mb-4">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Reports & Insights</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Aging reports, revenue charts, and clear financial visibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Free Trial */}
      <section className="w-full py-16 sm:py-20 bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-4 py-2 text-sm font-medium text-white/95 mb-6">
            <Zap className="h-4 w-4" />
            Free trial — no credit card required
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Start your free trial today
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/90 max-w-2xl mx-auto">
            Join thousands of businesses that trust Bretune. Full access for 14 days. Upgrade only when you're ready.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-violet-700 shadow-xl hover:bg-slate-50 transition-colors w-full sm:w-auto"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
            <span className="text-sm text-white/70">No credit card required</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 py-8 sm:py-12">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 text-white font-bold text-xs">
                B
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">Bretune Accounting</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
              <Link to="/login" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Log in
              </Link>
              <Link to="/register" className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">
                Free Trial
              </Link>
            </div>
          </div>
          <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-slate-500">
            © {new Date().getFullYear()} Bretune. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Floating chat widget */}
      <a
        href="#"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-rose-600 text-white shadow-xl shadow-violet-500/30 hover:shadow-violet-500/40 hover:scale-110 transition-all"
        aria-label="Chat support"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}

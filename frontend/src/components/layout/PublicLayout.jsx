import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/guides", label: "Guides" },
  { to: "/blog", label: "Blog" },
];

export default function PublicLayout({ children }) {
  return (
    <div
      className="min-h-screen w-full min-w-0 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
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

      <main className="pt-24 pb-16 min-h-screen">{children}</main>

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
              <Link to="/register" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Sign up
              </Link>
            </div>
          </div>
          <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-slate-500">
            © {new Date().getFullYear()} Bretune. All rights reserved.
          </p>
        </div>
      </footer>

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

import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Target, Heart, Shield } from "lucide-react";
import PublicLayout from "../components/layout/PublicLayout";

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            About Bretune
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We're on a mission to make accounting simple for small businesses and growing companies.
          </p>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Our Story</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Bretune Accounting was founded with a simple idea: financial management shouldn't be complicated or expensive. 
              We built a platform that brings together quotes, invoices, bills, expenses, and payments in one place—so you 
              can focus on running your business instead of wrangling spreadsheets.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">What We Believe</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800/50">
                <Users className="h-10 w-10 text-violet-500 mb-4" />
                <h3 className="font-semibold text-slate-900 dark:text-white">People First</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  We design for real users—owners, bookkeepers, and accountants who need tools that just work.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800/50">
                <Target className="h-10 w-10 text-violet-500 mb-4" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Clarity</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Clear reporting, aging breakdowns, and dashboards so you always know where your business stands.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800/50">
                <Shield className="h-10 w-10 text-violet-500 mb-4" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Trust & Security</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Your financial data is protected with industry-standard security and reliable backups.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Our Values</h2>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <span>We care about your success—every feature we build is designed to save you time and reduce stress.</span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-violet-500 shrink-0 mt-0.5" />
                <span>Transparency and honesty guide everything we do, from pricing to product decisions.</span>
              </li>
              <li className="flex items-start gap-3">
                <Target className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                <span>We're committed to continuous improvement and listening to feedback from our customers.</span>
              </li>
            </ul>
          </section>

          <div className="mt-16 text-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-rose-600 px-6 py-3.5 text-base font-semibold text-white shadow-xl shadow-violet-500/30 hover:shadow-violet-500/40 transition-all"
            >
              Get started with Bretune
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

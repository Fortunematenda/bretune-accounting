import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import PublicLayout from "../components/layout/PublicLayout";

const posts = [
  {
    title: "5 Ways to Improve Your Invoice Payment Times",
    excerpt: "Simple tips to get paid faster—from clear payment terms to friendly reminders.",
    date: "2025-02-20",
    category: "Invoicing",
  },
  {
    title: "Understanding Cash Flow: A Guide for Small Business Owners",
    excerpt: "Learn why cash flow matters and how to track it effectively with the right tools.",
    date: "2025-02-15",
    category: "Finance",
  },
  {
    title: "How to Set Up Recurring Invoices for Subscription Clients",
    excerpt: "Automate billing for retainer and subscription-based work with recurring invoices.",
    date: "2025-02-10",
    category: "Automation",
  },
  {
    title: "Expense Categories: Best Practices for Small Businesses",
    excerpt: "Organise your expenses for better reporting and easier tax preparation.",
    date: "2025-02-05",
    category: "Expenses",
  },
];

export default function BlogPage() {
  return (
    <PublicLayout>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Blog
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Insights, tips, and news for small business owners and accountants.
          </p>
        </div>

        <div className="space-y-8">
          {posts.map(({ title, excerpt, date, category }) => (
            <article
              key={title}
              className="rounded-xl border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800/50 hover:border-violet-300 dark:hover:border-violet-600 transition-colors"
            >
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-3">
                <span className="inline-flex items-center rounded-full bg-violet-100 dark:bg-violet-900/30 px-3 py-0.5 font-medium text-violet-700 dark:text-violet-300">
                  {category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {title}
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {excerpt}
              </p>
              <Link
                to="#"
                className="mt-4 inline-flex items-center gap-1 text-violet-600 dark:text-violet-400 font-medium hover:underline"
              >
                Read more
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            More articles coming soon. Stay tuned!
          </p>
          <Link
            to="/register"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-rose-600 px-6 py-3.5 text-base font-semibold text-white shadow-xl shadow-violet-500/30 hover:shadow-violet-500/40 transition-all"
          >
            Get started with Bretune
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}

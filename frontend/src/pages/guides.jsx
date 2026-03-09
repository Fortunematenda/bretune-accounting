import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Receipt, CreditCard, BookOpen } from "lucide-react";
import PublicLayout from "../components/layout/PublicLayout";

const guides = [
  {
    icon: FileText,
    title: "Creating Your First Invoice",
    excerpt: "Learn how to create professional invoices, add line items, apply taxes, and send them to clients in minutes.",
    href: "#",
  },
  {
    icon: Receipt,
    title: "Managing Bills & Expenses",
    excerpt: "Track supplier bills, record expenses, and categorise spending to keep your accounts in order.",
    href: "#",
  },
  {
    icon: CreditCard,
    title: "Recording Payments & Allocations",
    excerpt: "Record incoming payments, allocate them to invoices, and reconcile your receivables easily.",
    href: "#",
  },
  {
    icon: BookOpen,
    title: "Understanding Aging Reports",
    excerpt: "Use aging reports to see which invoices are overdue and improve your cash flow management.",
    href: "#",
  },
];

export default function GuidesPage() {
  return (
    <PublicLayout>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Guides & How-To
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Step-by-step guides to help you get the most out of Bretune Accounting.
          </p>
        </div>

        <div className="space-y-6">
          {guides.map(({ icon: Icon, title, excerpt, href }) => (
            <Link
              key={title}
              to={href}
              className="block rounded-xl border border-slate-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-800/50 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-lg transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {excerpt}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-violet-500 shrink-0" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/30 p-6 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            More guides coming soon. Have a topic you'd like us to cover?
          </p>
          <Link
            to="/register"
            className="mt-4 inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold hover:underline"
          >
            Get started and explore
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}

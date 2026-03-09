import React from "react";
import { cn } from "../../lib/utils";

const styles = {
  DRAFT: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  SENT: "bg-violet-50 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  ACCEPTED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  REJECTED: "bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  EXPIRED: "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
};

export default function QuoteStatusBadge({ status }) {
  const s = String(status || "").toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[s] || "bg-slate-100 text-slate-700"
      )}
    >
      {s || "—"}
    </span>
  );
}

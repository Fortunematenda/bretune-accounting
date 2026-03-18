import React from "react";
import { cn } from "../../lib/utils";

const STATUS_CONFIG = {
  // Invoice statuses
  DRAFT: { label: "Draft", bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" },
  SENT: { label: "Sent", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  VIEWED: { label: "Viewed", bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200", dot: "bg-cyan-500" },
  APPROVED: { label: "Approved", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  PAID: { label: "Paid", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  COMPLETED: { label: "Completed", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  PARTIALLY_PAID: { label: "Partial", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  OVERDUE: { label: "Overdue", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500" },
  VOIDED: { label: "Voided", bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-200", dot: "bg-slate-400" },
  CANCELLED: { label: "Cancelled", bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-200", dot: "bg-slate-400" },
  DECLINED: { label: "Declined", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500" },
  PENDING: { label: "Pending", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  PROCESSING: { label: "Processing", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  FAILED: { label: "Failed", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", dot: "bg-rose-500" },
  REFUNDED: { label: "Refunded", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
  // Customer/entity statuses
  ACTIVE: { label: "Active", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  INACTIVE: { label: "Inactive", bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-200", dot: "bg-slate-400" },
  SUSPENDED: { label: "Suspended", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  // Expense statuses
  RECORDED: { label: "Recorded", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  CLAIMED: { label: "Claimed", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
  // Quote statuses
  ACCEPTED: { label: "Accepted", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  EXPIRED: { label: "Expired", bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-200", dot: "bg-slate-400" },
};

const DEFAULT_CONFIG = { label: "", bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200", dot: "bg-slate-400" };

export default function StatusBadge({ status, label, size = "default", className }) {
  const key = String(status || "").toUpperCase().replace(/\s+/g, "_");
  const cfg = STATUS_CONFIG[key] || DEFAULT_CONFIG;
  const displayLabel = label || cfg.label || String(status || "—");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        cfg.bg, cfg.text, cfg.border,
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-0.5 text-xs",
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", cfg.dot)} />
      {displayLabel}
    </span>
  );
}

import React from "react";
import { cn } from "../../lib/utils";

const styles = {
  DRAFT: "bg-slate-100 text-slate-700",
  SENT: "bg-violet-50 text-violet-700",
  PARTIALLY_PAID: "bg-amber-50 text-amber-700",
  PAID: "bg-green-50 text-green-700",
  OVERDUE: "bg-red-50 text-red-700",
  CANCELLED: "bg-slate-100 text-slate-600",
};

export default function InvoiceStatusBadge({ status }) {
  const s = String(status || "").toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        styles[s] || "bg-slate-100 text-slate-700"
      )}
    >
      {s || "—"}
    </span>
  );
}

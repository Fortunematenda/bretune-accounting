import React from "react";
import { cn } from "../../lib/utils";

export default function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    secondary: "bg-violet-50 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-200",
    destructive: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/40 dark:text-red-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-200",
    outline: "border border-slate-200 text-slate-700 bg-white dark:border-slate-700 dark:text-slate-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  );
}

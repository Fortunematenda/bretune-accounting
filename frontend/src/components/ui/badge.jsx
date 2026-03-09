import React from "react";
import { cn } from "../../lib/utils";

export default function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    secondary: "bg-violet-50 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
    destructive: "bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-200",
    outline: "border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200",
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

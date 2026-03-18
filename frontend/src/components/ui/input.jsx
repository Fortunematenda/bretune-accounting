import React from "react";
import { cn } from "../../lib/utils";

export default function Input({ className, label, error, hint, ...props }) {
  const input = (
    <input
      className={cn(
        "flex h-9 w-full rounded-lg border bg-white px-3 py-2 text-sm transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/20 focus-visible:border-violet-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
        error ? "border-red-300 focus-visible:ring-red-500/20 focus-visible:border-red-400" : "border-slate-200",
        className
      )}
      {...props}
    />
  );

  if (!label && !error && !hint) return input;

  return (
    <div className="space-y-1.5">
      {label ? <label className="text-xs font-medium text-slate-600">{label}</label> : null}
      {input}
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      {hint && !error ? <p className="text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

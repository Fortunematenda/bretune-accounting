import React from "react";
import { cn } from "../../lib/utils";

export function Table({ className, ...props }) {
  return (
    <div className="w-full overflow-auto">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

export function TableHeader({ className, ...props }) {
  return <thead className={cn("border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40", className)} {...props} />;
}

export function TableBody({ className, ...props }) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

export function TableRow({ className, ...props }) {
  return <tr className={cn("border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/30", className)} {...props} />;
}

export function TableHead({ className, ...props }) {
  return (
    <th
      className={cn(
        "h-10 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }) {
  return <td className={cn("p-4 align-middle", className)} {...props} />;
}

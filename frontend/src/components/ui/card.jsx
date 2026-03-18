import React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] transition-all duration-300 ease-out hover:shadow-[0_4px_12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] dark:border-slate-800 dark:bg-slate-900/80",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("p-5 pb-3", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn("text-[13px] font-semibold tracking-wide text-slate-900 dark:text-slate-100", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("px-5 pb-5", className)} {...props} />;
}

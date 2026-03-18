import React from "react";
import { cn } from "../../lib/utils";

/**
 * Reusable page header layout for list pages.
 * Left: optional icon + title + subtitle + extra (e.g. filter hints)
 * Right: action or actions (e.g. primary button, filters)
 */
export default function PageHeader({
  title,
  subtitle,
  icon,
  action,
  actions,
  extra,
  className,
  breadcrumb,
}) {
  const rightContent = actions ?? action;

  return (
    <div className={cn("space-y-1", className)}>
      {breadcrumb ? (
        <div className="text-xs text-slate-400 mb-2">{breadcrumb}</div>
      ) : null}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {icon ? (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 ring-1 ring-violet-100">
              {icon}
            </div>
          ) : null}
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">{title}</h1>
            {subtitle ? (
              <p className="text-[13px] text-slate-500 mt-0.5">{subtitle}</p>
            ) : null}
            {extra ? (
              <div className="text-xs text-slate-400 mt-0.5">{extra}</div>
            ) : null}
          </div>
        </div>
        {rightContent ? (
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {rightContent}
          </div>
        ) : null}
      </div>
    </div>
  );
}

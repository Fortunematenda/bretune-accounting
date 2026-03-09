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
}) {
  const rightContent = actions ?? action;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {icon ? (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100">
            {icon}
          </div>
        ) : null}
        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          {subtitle ? (
            <p className="text-sm text-slate-500">{subtitle}</p>
          ) : null}
          {extra ? (
            <div className="text-xs text-slate-500 mt-0.5">{extra}</div>
          ) : null}
        </div>
      </div>
      {rightContent ? (
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {rightContent}
        </div>
      ) : null}
    </div>
  );
}

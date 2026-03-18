import React from "react";
import { cn } from "../../lib/utils";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import Button from "../ui/button";

/**
 * DetailViewLayout — Standardized QuickBooks-style detail page layout.
 * 
 * @param {object} props
 * @param {string} props.title - Entity title
 * @param {string} [props.subtitle] - Secondary info line
 * @param {React.ReactNode} [props.statusBadge] - StatusBadge component
 * @param {React.ReactNode} [props.avatar] - Avatar/icon element
 * @param {React.ReactNode} [props.actions] - Primary action buttons
 * @param {React.ReactNode} [props.secondaryActions] - ActionsMenu or dropdown
 * @param {Array<{key, label, icon?}>} [props.tabs] - Tab definitions
 * @param {string} [props.activeTab] - Current active tab key
 * @param {(key: string) => void} [props.onTabChange]
 * @param {React.ReactNode} [props.summaryBar] - Summary metrics bar
 * @param {React.ReactNode} props.children - Tab content
 * @param {() => void} [props.onBack] - Back navigation handler
 * @param {string} [props.backLabel] - Breadcrumb label
 */
export default function DetailViewLayout({
  title,
  subtitle,
  statusBadge,
  avatar,
  actions,
  secondaryActions,
  tabs,
  activeTab,
  onTabChange,
  summaryBar,
  children,
  onBack,
  backLabel = "Back",
  className,
}) {
  return (
    <div className={cn("space-y-0", className)}>
      {/* Breadcrumb */}
      {onBack ? (
        <nav className="mb-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {backLabel}
          </button>
        </nav>
      ) : null}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4">
        <div className="flex items-start gap-3 min-w-0">
          {avatar ? (
            <div className="shrink-0">{avatar}</div>
          ) : null}
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-semibold text-slate-900 truncate">{title}</h1>
              {statusBadge ? statusBadge : null}
            </div>
            {subtitle ? (
              <p className="mt-0.5 text-sm text-slate-500 truncate">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {(actions || secondaryActions) ? (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
            {secondaryActions}
          </div>
        ) : null}
      </div>

      {/* Summary metrics bar */}
      {summaryBar ? (
        <div className="mb-4">{summaryBar}</div>
      ) : null}

      {/* Tabs */}
      {tabs && tabs.length > 0 ? (
        <div className="border-b border-slate-200 mb-6">
          <nav className="flex gap-0 overflow-x-auto -mb-px" aria-label="Detail sections">
            {tabs.map(({ key, label, icon: Icon, count }) => (
              <button
                key={key}
                type="button"
                onClick={() => onTabChange?.(key)}
                className={cn(
                  "inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  activeTab === key
                    ? "border-violet-600 text-violet-700"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                )}
              >
                {Icon ? <Icon className="h-4 w-4 shrink-0" strokeWidth={1.7} /> : null}
                {label}
                {count != null ? (
                  <span className={cn(
                    "ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                    activeTab === key ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-500"
                  )}>
                    {count}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>
      ) : null}

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}

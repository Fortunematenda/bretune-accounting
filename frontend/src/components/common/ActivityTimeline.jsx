import React from "react";
import { cn } from "../../lib/utils";
import { Clock } from "lucide-react";

function formatTimeAgo(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return String(dateStr).slice(0, 10);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(d);
  } catch {
    return String(dateStr).slice(0, 10);
  }
}

/**
 * ActivityTimeline — Displays a vertical timeline of events.
 * @param {Array<{id, action, description?, user?, timestamp, icon?}>} items
 */
export default function ActivityTimeline({ items = [], className }) {
  if (items.length === 0) {
    return (
      <div className={cn("py-8 text-center text-sm text-slate-400", className)}>
        No activity yet
      </div>
    );
  }

  return (
    <div className={cn("flow-root", className)}>
      <ul className="-mb-8">
        {items.map((item, idx) => {
          const Icon = item.icon || Clock;
          const isLast = idx === items.length - 1;
          return (
            <li key={item.id || idx}>
              <div className="relative pb-8">
                {!isLast ? (
                  <span
                    className="absolute left-[15px] top-8 -ml-px h-full w-[2px] bg-slate-200"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 ring-4 ring-white">
                    <Icon className="h-3.5 w-3.5 text-slate-500" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-slate-800">{item.action}</p>
                      <time className="shrink-0 text-[11px] text-slate-400 tabular-nums">
                        {formatTimeAgo(item.timestamp)}
                      </time>
                    </div>
                    {item.description ? (
                      <p className="mt-0.5 text-sm text-slate-500">{item.description}</p>
                    ) : null}
                    {item.user ? (
                      <p className="mt-0.5 text-[11px] text-slate-400">by {item.user}</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

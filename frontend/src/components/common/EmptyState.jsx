import React from "react";
import { cn } from "../../lib/utils";
import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "No items found",
  description,
  action,
  className,
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center", className)}>
      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-slate-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      {description ? (
        <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

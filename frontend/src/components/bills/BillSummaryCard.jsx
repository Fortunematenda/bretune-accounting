import React from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "../../lib/utils";

export default function BillSummaryCard({ title, value, subtext, className }) {
  return (
    <Card className={cn("hover:translate-y-0", className)}>
      <CardContent className="p-4">
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</div>
        <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</div>
        {subtext ? <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtext}</div> : null}
      </CardContent>
    </Card>
  );
}

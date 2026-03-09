import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Money from "../common/money";

const BUCKET_STYLES = {
  bucket_0_30: "border-l-emerald-500 bg-white border border-slate-200",
  bucket_31_60: "border-l-amber-500 bg-white border border-slate-200",
  bucket_61_90: "border-l-orange-500 bg-white border border-slate-200",
  bucket_90_plus: "border-l-rose-500 bg-white border border-slate-200",
};

export default function AgingSummary({ buckets }) {
  const b = buckets || {};

  const rows = [
    { key: "bucket_0_30", label: "0–30", value: b.bucket_0_30 },
    { key: "bucket_31_60", label: "31–60", value: b.bucket_31_60 },
    { key: "bucket_61_90", label: "61–90", value: b.bucket_61_90 },
    { key: "bucket_90_plus", label: "90+", value: b.bucket_90_plus },
  ];

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">AR Aging Buckets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {rows.map((r) => (
            <div
              key={r.key}
              className={`rounded-lg border-l-4 p-4 ${BUCKET_STYLES[r.key] || "border-l-slate-400 bg-white border border-slate-200"}`}
            >
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">{r.label} days</div>
              <div className="mt-2 text-base font-semibold text-slate-900">
                <Money value={r.value || 0} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-slate-500">Receivables grouped by days past due.</div>
      </CardContent>
    </Card>
  );
}

import React, { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import Money from "../components/common/money";
import Pagination from "../components/common/Pagination";
import PageHeader from "../components/common/PageHeader";
import ListTable from "../components/common/ListTable";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Users } from "lucide-react";

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? String(iso) : new Intl.DateTimeFormat(undefined, { year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

export default function PayrollPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.listPayRuns({ page, limit: 20 });
      setData(res);
    } catch (e) {
      setError(e.message || "Failed to load");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6 min-h-screen">
      <PageHeader
        title="Payroll"
        subtitle="Pay runs and employee compensation"
        icon={<Users className="h-6 w-6 text-violet-600" />}
      />

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Pay Run List</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <ListTable
            data={data?.data ?? []}
            loading={loading}
            page={page}
            limit={data?.meta?.limit ?? 20}
            emptyMessage="No pay runs."
            columns={[
              { key: "period", label: "Period", render: (r) => `${formatDate(r.payPeriodStart)} – ${formatDate(r.payPeriodEnd)}` },
              { key: "totalGross", label: "Total Gross", align: "right", render: (r) => <Money value={r.totalGross} />, cellClassName: "tabular-nums" },
              { key: "totalNet", label: "Total Net", align: "right", render: (r) => <Money value={r.totalNet} />, cellClassName: "tabular-nums" },
              {
                key: "status",
                label: "Status",
                render: (r) => (
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${r.status === "DRAFT" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                    {r.status}
                  </span>
                ),
              },
            ]}
          />
          {data?.meta && data.meta.totalPages > 1 && (
            <Pagination page={data.meta.page} limit={data.meta.limit} total={data.meta.total} onPageChange={setPage} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

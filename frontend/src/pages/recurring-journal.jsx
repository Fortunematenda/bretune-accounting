import React, { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import Pagination from "../components/common/Pagination";
import PageHeader from "../components/common/PageHeader";
import ListTable from "../components/common/ListTable";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Repeat, Play } from "lucide-react";

function formatDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export default function RecurringJournalPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [processing, setProcessing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.listRecurringJournals({ page, limit: 20 });
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

  const handleProcessDue = async () => {
    setProcessing(true);
    setError(null);
    try {
      const result = await api.processRecurringJournals();
      if (result?.results?.length) {
        const failed = result.results.filter((r) => r.status === "error");
        if (failed.length) setError(failed.map((f) => f.error).join("; "));
        else load();
      }
    } catch (e) {
      setError(e.message || "Failed to process");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 min-h-screen">
      <PageHeader
        title="Recurring Journal Entries"
        subtitle="Scheduled journal entries that post automatically (monthly, quarterly, yearly)"
        icon={<Repeat className="h-6 w-6 text-violet-600" />}
        action={
          <Button
            onClick={handleProcessDue}
            disabled={processing}
            variant="outline"
            className="h-9 shrink-0 gap-2"
          >
            <Play className="h-4 w-4" /> Process due now
          </Button>
        }
      />

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Recurring Journal List</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-4">
            <ListTable
              data={data?.data ?? []}
              loading={loading}
              page={page}
              limit={20}
              emptyMessage="No recurring entries."
              columns={[
                { key: "name", label: "Name", render: (r) => <span className="font-medium text-slate-900">{r.name}</span> },
                { key: "frequency", label: "Frequency", render: (r) => r.frequency },
                { key: "nextRunDate", label: "Next Run", render: (r) => formatDate(r.nextRunDate) },
                { key: "lastRunAt", label: "Last Run", render: (r) => formatDate(r.lastRunAt) },
                {
                  key: "status",
                  label: "Status",
                  render: (r) => (
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${r.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                      {r.isActive ? "Active" : "Inactive"}
                    </span>
                  ),
                },
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import Input from "../ui/input";
import Button from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function StatementDownloadCard({ clients }) {
  const [clientId, setClientId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canDownload = useMemo(() => Boolean(clientId), [clientId]);

  async function downloadPdf() {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries({ from, to, format: "pdf" }).filter(([, v]) => v != null && v !== ""))
      ).toString();

      const res = await fetch(`/api/statements/client/${clientId}${qs ? `?${qs}` : ""}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ba_access_token")}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to download statement");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (e) {
      setError(e.message || "Failed to download statement");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statement PDF</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Customer</label>
            <select
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            >
              <option value="">Select a customer</option>
              {(clients || []).map((c) => (
                <option key={c.id} value={c.id}>
                  {(c.companyName ? c.companyName : c.contactName) || c.email}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">From</label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">To</label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>

        {error ? <div className="mt-3 text-sm text-red-600">{error}</div> : null}

        <div className="mt-4 flex justify-end">
          <Button onClick={downloadPdf} disabled={!canDownload || loading}>
            {loading ? "Preparing..." : "Download PDF"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../features/auth/auth-context";
import { Card, CardContent } from "../../components/ui/card";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import StatementTable from "../../components/statements/StatementTable";
import Money from "../../components/common/money";
import { getAccessToken } from "../../features/auth/token-store";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function fmtDate(v) {
  if (!v) return "—";
  try {
    return String(v).slice(0, 10);
  } catch {
    return "—";
  }
}

export default function ClientStatementPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [statement, setStatement] = useState(null);
  const [companySettings, setCompanySettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const canGenerate = useMemo(() => Boolean(clientId), [clientId]);

  useEffect(() => {
    api
      .listClients({ page: 1, limit: 200 })
      .then((res) => setClients(res.data || []))
      .catch(() => setClients([]));
  }, []);

  useEffect(() => {
    let mounted = true;
    api
      .getCompanySettings()
      .then((data) => {
        if (mounted && data) setCompanySettings(data);
      })
      .catch(() => {
        if (mounted) setCompanySettings(null);
      });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const v = searchParams.get("clientId") || "";
    if (v) setClientId(v);
  }, [searchParams]);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getClientStatement({ clientId, from: from || undefined, to: to || undefined });
      setStatement(res);
    } catch (e) {
      setError(e.message || "We couldn't generate the statement.");
    } finally {
      setLoading(false);
    }
  }

  async function downloadPdf() {
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      if (!token) throw new Error("Your session has expired. Please log in again.");

      const qs = new URLSearchParams(
        Object.fromEntries(
          Object.entries({ from: from || undefined, to: to || undefined, format: "pdf" }).filter(([, v]) => v)
        )
      ).toString();

      const res = await fetch(`/api/statements/client/${clientId}${qs ? `?${qs}` : ""}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/pdf",
        },
      });

      if (!res.ok) {
        const text = await res.text();
        if (res.status === 401) throw new Error("Your session has expired. Please log in again.");
        throw new Error(text || "Could not download statement PDF");
      }

      const buf = await res.arrayBuffer();
      const blob = new Blob([buf], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (e) {
      setError(e.message || "Could not download statement PDF");
    } finally {
      setLoading(false);
    }
  }

  const selectedClient = useMemo(
    () => (clients || []).find((c) => c.id === clientId) || null,
    [clients, clientId]
  );

  const companyName = useMemo(() => String(user?.companyName || "").trim() || "Company", [user]);

  const companyAddress = useMemo(() => {
    const s = companySettings || {};
    const parts = [s.addressLine, s.city, s.country].filter(Boolean);
    return parts.join(", ") || null;
  }, [companySettings]);

  const clientName = useMemo(() => {
    const c = statement?.client || selectedClient;
    if (!c) return "—";
    return c.companyName ? String(c.companyName) : String(c.contactName || "—");
  }, [statement, selectedClient]);

  return (
    <div className="space-y-6" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl font-semibold text-[#111827]">Customer Statement</h1>
          <p className="text-sm text-[#6B7280]">View a customer's ledger and running balance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()} className="border-[#E5E7EB]">
            Print
          </Button>
          <Button
            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
            onClick={downloadPdf}
            disabled={!statement || loading}
          >
            Download PDF
          </Button>
        </div>
      </div>

      <Card className="print:border-0 print:shadow-none border-[#E5E7EB] print:hidden">
        <CardContent className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-[#111827]">Customer</label>
              <select
                className="h-10 w-full rounded-lg border border-[#E5E7EB] bg-white px-3 text-sm text-[#111827]"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              >
                <option value="">Select a customer</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {(c.companyName ? c.companyName : c.contactName) || c.email}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#111827]">From</label>
              <Input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder={todayIso()}
                className="border-[#E5E7EB]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-[#111827]">To</label>
              <Input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder={todayIso()}
                className="border-[#E5E7EB]"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
              onClick={generate}
              disabled={!canGenerate || loading}
            >
              {loading ? "Generating…" : "Generate statement"}
            </Button>
          </div>

          {error ? (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
          ) : null}
        </CardContent>
      </Card>

      {statement ? (
        <div className="max-w-4xl">
          <Card className="overflow-hidden shadow-sm border-[#E5E7EB] rounded-xl bg-white">
            <CardContent className="p-0">
              {/* Header: Logo left | Statement details right */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 px-8 pt-8 pb-6 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-[#7C3AED] flex items-center justify-center text-white text-xl font-bold shadow-sm">
                    {companyName.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-[#111827]">{companyName}</div>
                    <div className="text-sm font-medium text-[#6B7280]">Statement</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-right">
                  <div>
                    <div className="text-xs font-medium text-[#6B7280]">Client</div>
                    <div className="text-sm font-semibold text-[#111827]">{clientName}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#6B7280]">Statement Period</div>
                    <div className="text-sm font-semibold text-[#111827]">
                      {fmtDate(statement.range?.from)} — {fmtDate(statement.range?.to)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#6B7280]">Statement Date</div>
                    <div className="text-sm font-semibold text-[#111827]">{todayIso()}</div>
                  </div>
                </div>
              </div>

              {/* Company block */}
              <div className="px-8 pt-6 pb-6">
                <div className="space-y-1 text-sm text-[#6B7280]">
                  {companyAddress ? <div>{companyAddress}</div> : null}
                  {companySettings?.businessPhone ? <div>Phone: {companySettings.businessPhone}</div> : null}
                  {companySettings?.businessEmail ? <div>Email: {companySettings.businessEmail}</div> : null}
                </div>
              </div>

              {/* Account Holder – client block */}
              <div className="px-8 pb-6">
                <div className="rounded-lg border border-[#E5E7EB] bg-[#F8F9FB] p-5 shadow-sm">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Account Holder</div>
                  <div className="text-sm font-semibold text-[#111827]">{clientName}</div>
                  {statement?.client?.email ? (
                    <div className="mt-1 text-sm text-[#6B7280]">{statement.client.email}</div>
                  ) : null}
                  {selectedClient?.phone ? (
                    <div className="mt-1 text-sm text-[#6B7280]">{selectedClient.phone}</div>
                  ) : null}
                  {(selectedClient?.address || selectedClient?.city) ? (
                    <div className="mt-1 text-sm text-[#6B7280]">
                      {[selectedClient.address, selectedClient.city, selectedClient.country].filter(Boolean).join(", ")}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Summary card */}
              <div className="px-8 pb-6">
                <div className="rounded-xl bg-[#F8F9FB] border border-[#E5E7EB] p-6 shadow-sm">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-4">Summary</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div>
                      <div className="text-xs font-medium text-[#6B7280]">Opening Balance</div>
                      <div className="mt-1 text-sm font-semibold text-[#111827]">
                        <Money value={Number(statement.openingBalance || 0)} />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[#6B7280]">Total Invoiced</div>
                      <div className="mt-1 text-sm font-semibold text-[#111827]">
                        <Money value={statement.invoices?.reduce((s, i) => s + Number(i.totalAmount || 0), 0) || 0} />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[#6B7280]">Total Paid</div>
                      <div className="mt-1 text-sm font-semibold text-[#111827]">
                        <Money value={statement.payments?.reduce((s, p) => s + Number(p.amount || 0), 0) || 0} />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[#6B7280]">Total Loaned</div>
                      <div className="mt-1 text-sm font-semibold text-[#111827]">
                        <Money value={Number(statement.loansSummary?.totalLoaned || 0)} />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[#6B7280]">Loan Balance</div>
                      <div className="mt-1 text-sm font-semibold text-[#111827]">
                        <Money value={Number(statement.loansSummary?.outstandingLoanBalance || 0)} />
                      </div>
                    </div>
                    <div className="rounded-lg bg-white border border-[#E5E7EB] p-4">
                      <div className="text-xs font-medium text-[#6B7280]">Outstanding Balance</div>
                      <div className="mt-1 text-base font-bold text-[#7C3AED]">
                        <Money value={Number(statement.closingBalance || 0)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction table */}
              <div className="px-8 pb-6">
                <StatementTable statement={statement} />
              </div>

              {/* Footer: Banking Details */}
              <div className="px-8 pb-8 pt-6 border-t border-[#E5E7EB] space-y-6">
                {(companySettings?.bankName || companySettings?.accountNumber || companySettings?.accountName) ? (
                  <div className="rounded-lg border border-[#E5E7EB] overflow-hidden">
                    <div className="bg-[#E5E7EB] px-4 py-2.5">
                      <div className="text-sm font-bold text-[#374151]">Banking Details</div>
                    </div>
                    <div className="bg-white p-4 space-y-2 text-sm text-[#374151]">
                      {companySettings?.bankName ? (
                        <div>Bank: {companySettings.bankName}</div>
                      ) : null}
                      {companySettings?.accountName ? (
                        <div>Account Holder: {companySettings.accountName}</div>
                      ) : null}
                      {companySettings?.accountType ? (
                        <div>Account Type: {companySettings.accountType}</div>
                      ) : null}
                      {companySettings?.accountNumber ? (
                        <div>Account Number: {companySettings.accountNumber}</div>
                      ) : null}
                      {companySettings?.branchCode ? (
                        <div>Branch Code: {companySettings.branchCode}</div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                <div className="text-sm text-[#6B7280]">
                  Thank you for your business. If you have any questions about this statement, please contact us.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-12 text-center">
          <p className="text-[#6B7280]">Select a customer and generate a statement.</p>
        </div>
      )}
    </div>
  );
}

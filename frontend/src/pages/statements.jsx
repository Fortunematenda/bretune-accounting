import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import Button from "../components/ui/button";
import Input from "../components/ui/input";
import { ScrollText, Search, FileDown } from "lucide-react";
import { getAccessToken } from "../features/auth/token-store";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export default function StatementsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [clientId, setClientId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .listCustomers({ page: 1, limit: 200 })
      .then((res) => setClients(res.data || []))
      .catch((e) => {
        setError(e.message || "Failed to load customers");
        setClients([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredClients = customerSearch.trim()
    ? clients.filter(
        (c) =>
          (c.companyName || "")
            .toLowerCase()
            .includes(customerSearch.toLowerCase()) ||
          (c.contactName || "")
            .toLowerCase()
            .includes(customerSearch.toLowerCase()) ||
          (c.email || "")
            .toLowerCase()
            .includes(customerSearch.toLowerCase())
      )
    : clients;

  const selectedClient = clients.find((c) => c.id === clientId);

  const displayValue = selectedClient
    ? selectedClient.companyName || selectedClient.contactName || selectedClient.email
    : customerSearch;

  function handleCustomerSelect(c) {
    setClientId(c.id);
    setCustomerSearch(c.companyName || c.contactName || c.email || "");
    setDropdownOpen(false);
  }

  function handleInputChange(e) {
    const val = e.target.value;
    setCustomerSearch(val);
    setClientId("");
    setDropdownOpen(true);
  }

  function handleInputFocus() {
    setDropdownOpen(true);
  }

  function handleInputBlur() {
    setTimeout(() => setDropdownOpen(false), 150);
  }

  async function handleDownloadPdf(e) {
    e.preventDefault();
    setDownloadLoading(true);
    setDownloadError(null);
    try {
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      params.set("format", "pdf");

      const res = await fetch(
        `${API_BASE}/statements/client/${clientId}${params.toString() ? `?${params}` : ""}`,
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        let msg = text;
        try {
          const err = JSON.parse(text);
          msg = err?.message || text;
        } catch {
          // use text as-is
        }
        throw new Error(msg || "Failed to download statement");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const raw = selectedClient?.companyName || selectedClient?.contactName || clientId || "statement";
      const safe = String(raw).replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-") || "statement";
      a.download = `statement-${safe}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setDownloadError(e.message || "Failed to download statement");
    } finally {
      setDownloadLoading(false);
    }
  }

  const canDownload = Boolean(clientId);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Statements</h1>
              <p className="mt-1 text-sm text-slate-500">
                Generate and download customer account statements as PDF
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="max-w-2xl">
            <form onSubmit={handleDownloadPdf} className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50/30 p-4 sm:p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="rounded-lg bg-violet-100 p-2">
                    <ScrollText className="h-5 w-5 text-violet-600" />
                  </div>
                  <h2 className="text-sm font-semibold text-slate-900">Generate Statement</h2>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Customer *</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <Input
                      value={displayValue}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                      placeholder="Type to search customers…"
                      className="pl-9 h-10"
                      autoComplete="off"
                    />
                    {dropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg max-h-48 overflow-auto">
                        {filteredClients.length === 0 ? (
                          <div className="px-3 py-4 text-sm text-slate-500 text-center">
                            No customers match
                          </div>
                        ) : (
                          filteredClients.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              className="w-full px-3 py-2.5 text-left text-sm hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg"
                              onClick={() => handleCustomerSelect(c)}
                            >
                              {c.companyName || c.contactName || c.email || "—"}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">From date</label>
                    <Input
                      type="date"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="h-10"
                    />
                    <p className="text-xs text-slate-500">Optional — leave blank for all-time</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">To date</label>
                    <Input
                      type="date"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="h-10"
                    />
                    <p className="text-xs text-slate-500">Optional — leave blank for today</p>
                  </div>
                </div>

                {downloadError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {downloadError}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={!canDownload || downloadLoading}
                    className="bg-violet-600 hover:bg-violet-700"
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    {downloadLoading ? "Preparing…" : "Download PDF"}
                  </Button>
                  {selectedClient && (
                    <Link
                      to={`/customers/${selectedClient.id}`}
                      className="text-sm text-violet-600 hover:text-violet-800 font-medium"
                    >
                      View customer →
                    </Link>
                  )}
                </div>
              </div>
            </form>
          </div>

          {loading && clients.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-sm text-slate-500">
              Loading customers…
            </div>
          ) : clients.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
              <p className="text-sm text-slate-600 mb-3">No customers yet</p>
              <Link to="/customers">
                <Button variant="outline" size="sm">
                  Add customers
                </Button>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

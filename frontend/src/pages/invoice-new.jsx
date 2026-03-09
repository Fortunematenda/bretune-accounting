import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Input from "../components/ui/input";
import Button from "../components/ui/button";

function emptyItem() {
  return {
    description: "",
    quantity: "1",
    unitPrice: "0.00",
    discount: "0.00",
    taxRate: "0.00",
  };
}

export default function InvoiceNewPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedClientId = searchParams.get("clientId") || "";

  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState(preselectedClientId);
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([emptyItem()]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // load a bigger list for dropdown
    api
      .listClients({ page: 1, limit: 100 })
      .then((res) => setClients(res.data || []))
      .catch(() => setClients([]));
  }, []);

  useEffect(() => {
    if (preselectedClientId) setClientId(preselectedClientId);
  }, [preselectedClientId]);

  const selectedClient = useMemo(() => clients.find((c) => c.id === clientId) || null, [clients, clientId]);
  const isClientLocked = Boolean(preselectedClientId);
  const vatEnabled = selectedClient?.taxType === "VAT_REGISTERED";

  function addDaysISO(isoDate, days) {
    if (!isoDate) return "";
    const d = new Date(`${isoDate}T00:00:00`);
    if (Number.isNaN(d.getTime())) return "";
    d.setDate(d.getDate() + Number(days || 0));
    return d.toISOString().slice(0, 10);
  }

  useEffect(() => {
    if (!selectedClient) return;
    const terms = Number(selectedClient.paymentTermsDays || 30);
    const nextDue = addDaysISO(issueDate || new Date().toISOString().slice(0, 10), terms);
    if (!dueDate) setDueDate(nextDue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClient?.id]);

  useEffect(() => {
    if (!selectedClient) return;
    const terms = Number(selectedClient.paymentTermsDays || 30);
    const baseIssue = issueDate || new Date().toISOString().slice(0, 10);
    setDueDate(addDaysISO(baseIssue, terms));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issueDate, selectedClient?.paymentTermsDays]);

  useEffect(() => {
    if (vatEnabled) return;
    setItems((prev) => prev.map((it) => ({ ...it, taxRate: "0.00" })));
  }, [vatEnabled]);

  const canSubmit = useMemo(() => {
    if (!clientId) return false;
    if (!items.length) return false;
    return items.every((i) => i.description.trim() && Number(i.quantity) > 0);
  }, [clientId, items]);

  function updateItem(index, patch) {
    setItems((prev) => prev.map((it, idx) => (idx === index ? { ...it, ...patch } : it)));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        clientId,
        issueDate: issueDate || undefined,
        dueDate: dueDate || undefined,
        notes: notes || undefined,
        items: items.map((i) => ({
          description: i.description,
          quantity: String(i.quantity || "1"),
          unitPrice: String(i.unitPrice || "0.00"),
          discount: String(i.discount || "0.00"),
          taxRate: String(i.taxRate || "0.00"),
        })),
      };

      await api.createInvoice(payload);
      navigate("/invoices", { replace: true });
    } catch (err) {
      setError(err.message || "We couldn’t create the invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold">New Invoice</h1>
          <p className="text-sm text-slate-600">Create a once-off invoice in Bretune Accounting</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/invoices")}>Cancel</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Customer</label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  required
                  disabled={isClientLocked}
                >
                  <option value="">Select a customer</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {(c.companyName ? c.companyName : c.contactName) || c.email}
                    </option>
                  ))}
                </select>
                {isClientLocked ? <div className="text-xs text-slate-500">Customer is locked for this invoice.</div> : null}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Notes</label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Issue Date</label>
                <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Due Date</label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                {selectedClient ? (
                  <div className="text-xs text-slate-500">
                    Auto-calculated using payment terms: {selectedClient.paymentTermsDays} days
                  </div>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Line items</div>
                <Button type="button" variant="secondary" onClick={() => setItems((p) => [...p, emptyItem()])}>
                  Add item
                </Button>
              </div>

              <div className="space-y-3">
                {items.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-2 rounded-md border border-slate-200 p-3 bg-white">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs text-slate-500">Description</label>
                      <Input value={it.description} onChange={(e) => updateItem(idx, { description: e.target.value })} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Qty</label>
                      <Input type="number" min={0} step="0.01" value={it.quantity} onChange={(e) => updateItem(idx, { quantity: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Unit</label>
                      <Input value={it.unitPrice} onChange={(e) => updateItem(idx, { unitPrice: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Discount</label>
                      <Input value={it.discount} onChange={(e) => updateItem(idx, { discount: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">VAT</label>
                      <Input
                        value={it.taxRate}
                        onChange={(e) => updateItem(idx, { taxRate: e.target.value })}
                        disabled={!vatEnabled}
                        placeholder={vatEnabled ? "15" : "0"}
                      />
                      {!vatEnabled && selectedClient ? (
                        <div className="text-[11px] text-slate-500">VAT disabled for this customer.</div>
                      ) : null}
                    </div>

                    <div className="md:col-span-6 flex justify-end">
                      {items.length > 1 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-red-700 hover:text-red-800"
                          onClick={() => setItems((p) => p.filter((_, i) => i !== idx))}
                        >
                          Remove
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error ? <div className="text-sm text-red-600">{error}</div> : null}

            <div className="flex justify-end">
              <Button type="submit" disabled={!canSubmit || loading}>
                {loading ? "Creating..." : "Create Invoice"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

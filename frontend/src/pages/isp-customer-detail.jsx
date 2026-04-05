import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, User, Phone, Mail, MapPin, Wifi, WifiOff, Edit3,
  ShieldOff, ShieldCheck, RefreshCw, FileText, ExternalLink, Save, X,
} from "lucide-react";
import { api } from "../lib/api";

const STATUS_STYLES = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  BLOCKED: "bg-red-50 text-red-700 border-red-200",
  INACTIVE: "bg-slate-100 text-slate-500 border-slate-200",
  LEAD: "bg-blue-50 text-blue-700 border-blue-200",
};

function Badge({ status }) {
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[status] || STATUS_STYLES.INACTIVE}`}>
      {status}
    </span>
  );
}

function Field({ label, value, mono }) {
  if (!value) return null;
  return (
    <div>
      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</div>
      <div className={`text-sm text-slate-800 mt-0.5 ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

export default function IspCustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [networkClient, setNetworkClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const cust = await api.ispCustomer(id);
      setCustomer(cust);
      setForm({
        firstName: cust.firstName || "",
        lastName: cust.lastName || "",
        email: cust.email || "",
        phone: cust.phone || "",
        street: cust.street || "",
        city: cust.city || "",
        province: cust.province || "",
        zipCode: cust.zipCode || "",
        notes: cust.notes || "",
        category: cust.category || "RESIDENTIAL",
      });

      const [billingRes] = await Promise.all([
        api.billingCustomer(cust.id).catch(() => ({ invoices: [] })),
      ]);
      setInvoices(billingRes.invoices || []);

      if (cust.pppoeUsername) {
        api.routerSecret(cust.pppoeUsername).then(setNetworkClient).catch(() => null);
      }
    } catch (err) {
      setError(err.message || "Customer not found");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.ispCustomerUpdate(id, form);
      setEditing(false);
      fetchData();
    } catch (err) {
      alert(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleSuspend = async () => {
    if (!confirm(`Suspend ${customer.pppoeUsername}?`)) return;
    setActionLoading(true);
    try {
      await api.billingSuspendClient(id);
      fetchData();
    } catch (err) {
      alert(err.message || "Failed to suspend");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnsuspend = async () => {
    if (!confirm(`Reactivate ${customer.pppoeUsername}?`)) return;
    setActionLoading(true);
    try {
      await api.billingUnsuspendClient(id);
      fetchData();
    } catch (err) {
      alert(err.message || "Failed to reactivate");
    } finally {
      setActionLoading(false);
    }
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const inp = "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none";

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="text-sm">Loading customer...</span>
      </div>
    </div>
  );

  if (error || !customer) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="text-red-500 text-sm">{error || "Customer not found"}</div>
      <button onClick={() => navigate(-1)} className="text-violet-600 text-sm hover:underline flex items-center gap-1"><ArrowLeft className="h-4 w-4" /> Back</button>
    </div>
  );

  const isOnline = networkClient?.isOnline;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/isp-customers")}
            className="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="h-11 w-11 rounded-xl bg-violet-100 flex items-center justify-center text-violet-700 font-bold text-lg">
            {(customer.firstName?.[0] || customer.pppoeUsername?.[0] || "?").toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                {customer.firstName || customer.lastName
                  ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim()
                  : customer.pppoeUsername}
              </h1>
              <Badge status={customer.status} />
              {networkClient && (
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${isOnline ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                  {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                  {isOnline ? "Online" : "Offline"}
                </span>
              )}
            </div>
            <div className="text-sm text-slate-500 font-mono mt-0.5">{customer.pppoeUsername}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {customer.pppoeUsername && (
            <button onClick={() => navigate(`/network/${customer.pppoeUsername}`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50">
              <ExternalLink className="h-3.5 w-3.5" /> Network View
            </button>
          )}
          {customer.status === "BLOCKED" ? (
            <button onClick={handleUnsuspend} disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
              <ShieldCheck className="h-3.5 w-3.5" /> Reactivate
            </button>
          ) : customer.status === "ACTIVE" ? (
            <button onClick={handleSuspend} disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">
              <ShieldOff className="h-3.5 w-3.5" /> Suspend
            </button>
          ) : null}
          <button onClick={() => setEditing((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${editing ? "border-violet-300 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            <Edit3 className="h-3.5 w-3.5" /> {editing ? "Editing..." : "Edit"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Customer Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Profile card */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><User className="h-4 w-4 text-slate-400" /> Customer Details</h2>
              {editing && (
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditing(false)} className="h-7 w-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
                  <button onClick={handleSave} disabled={saving}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50">
                    <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>

            {editing ? (
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">First Name</label><input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} className={`mt-1 ${inp}`} /></div>
                <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Name</label><input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} className={`mt-1 ${inp}`} /></div>
                <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</label><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={`mt-1 ${inp}`} /></div>
                <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</label><input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={`mt-1 ${inp}`} /></div>
                <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Street</label><input value={form.street} onChange={(e) => set("street", e.target.value)} className={`mt-1 ${inp}`} /></div>
                <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">City</label><input value={form.city} onChange={(e) => set("city", e.target.value)} className={`mt-1 ${inp}`} /></div>
                <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Province</label><input value={form.province} onChange={(e) => set("province", e.target.value)} className={`mt-1 ${inp}`} /></div>
                <div><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">ZIP Code</label><input value={form.zipCode} onChange={(e) => set("zipCode", e.target.value)} className={`mt-1 ${inp}`} /></div>
                <div className="col-span-2"><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</label>
                  <select value={form.category} onChange={(e) => set("category", e.target.value)} className={`mt-1 ${inp}`}>
                    {["RESIDENTIAL", "BUSINESS", "ENTERPRISE"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2"><label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Notes</label><textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2} className={`mt-1 ${inp} resize-none`} /></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" value={customer.firstName} />
                <Field label="Last Name" value={customer.lastName} />
                <Field label="Email" value={customer.email} />
                <Field label="Phone" value={customer.phone} />
                <Field label="Street" value={customer.street} />
                <Field label="City" value={customer.city} />
                <Field label="Province" value={customer.province} />
                <Field label="ZIP Code" value={customer.zipCode} />
                <Field label="Category" value={customer.category} />
                <Field label="Billing Type" value={customer.billingType} />
                {customer.notes && <div className="col-span-2"><Field label="Notes" value={customer.notes} /></div>}
              </div>
            )}
          </div>

          {/* Invoices */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-4"><FileText className="h-4 w-4 text-slate-400" /> Billing History</h2>
            {invoices.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">No invoices yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {["Invoice #", "Period", "Amount", "Status", "Due Date"].map((h) => (
                        <th key={h} className="px-3 py-2 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.slice(0, 10).map((inv) => (
                      <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="px-3 py-2 font-mono text-xs">{inv.invoiceNumber || inv.id?.slice(0, 8)}</td>
                        <td className="px-3 py-2 text-xs text-slate-500">{inv.periodLabel || "—"}</td>
                        <td className="px-3 py-2 font-semibold">R {Number(inv.amount || 0).toFixed(2)}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            inv.status === "PAID" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : inv.status === "OVERDUE" ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>{inv.status}</span>
                        </td>
                        <td className="px-3 py-2 text-xs text-slate-500">{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("en-GB") : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right: Network + Meta */}
        <div className="space-y-5">
          {/* Network status */}
          {networkClient && (
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                <Wifi className="h-4 w-4 text-slate-400" /> Network Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Connection</span>
                  <span className={`text-xs font-semibold ${isOnline ? "text-emerald-600" : "text-slate-400"}`}>{isOnline ? "Online" : "Offline"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Profile</span>
                  <span className="text-xs font-semibold text-slate-700">{networkClient.profile || "—"}</span>
                </div>
                {networkClient.activeSession?.address && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">IP Address</span>
                    <span className="text-xs font-mono text-slate-700">{networkClient.activeSession.address}</span>
                  </div>
                )}
                {networkClient.activeSession?.uptime && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Uptime</span>
                    <span className="text-xs font-semibold text-slate-700">{networkClient.activeSession.uptime}</span>
                  </div>
                )}
              </div>
              <button onClick={() => navigate(`/network/${customer.pppoeUsername}`)}
                className="mt-4 w-full text-xs font-semibold text-violet-600 hover:text-violet-800 flex items-center justify-center gap-1">
                <ExternalLink className="h-3.5 w-3.5" /> View Full Network Details
              </button>
            </div>
          )}

          {/* Meta */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">Account Info</h2>
            <div className="space-y-2.5">
              <Field label="PPPoE Username" value={customer.pppoeUsername} mono />
              <Field label="Status" value={customer.status} />
              <Field label="Category" value={customer.category} />
              <Field label="Date Added" value={customer.dateAdded ? new Date(customer.dateAdded).toLocaleDateString("en-GB") : "—"} />
              {customer.partner && <Field label="Partner" value={customer.partner} />}
              {customer.location && <Field label="Location" value={customer.location} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import {
  UserPlus,
  Users,
  ArrowRightCircle,
  Search,
  RefreshCw,
  X,
  Trash2,
  Edit3,
  Phone,
  Mail,
  MapPin,
  Eye,
  EyeOff,
} from "lucide-react";

// ── Add Lead Modal ───────────────────────────────

function AddLeadModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    pppoeUsername: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    province: "",
    zipCode: "",
    category: "RESIDENTIAL",
    billingType: "RECURRING",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.pppoeUsername || !form.firstName || !form.lastName) {
      return alert("PPPoE Username, First Name, and Last Name are required");
    }
    setSaving(true);
    try {
      await api.ispCustomerCreate({ ...form, status: "LEAD" });
      onCreated();
      onClose();
      setForm({ pppoeUsername: "", firstName: "", lastName: "", email: "", phone: "", street: "", city: "", province: "", zipCode: "", category: "RESIDENTIAL", billingType: "RECURRING", notes: "" });
    } catch (err) {
      alert(err.message || "Failed to create lead");
    } finally {
      setSaving(false);
    }
  };

  const field = (label, key, opts = {}) => (
    <div className={opts.full ? "col-span-2" : ""}>
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      {opts.type === "textarea" ? (
        <textarea value={form[key]} onChange={(e) => set(key, e.target.value)} rows={2}
          className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none resize-none" />
      ) : opts.type === "select" ? (
        <select value={form[key]} onChange={(e) => set(key, e.target.value)}
          className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none">
          {opts.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={opts.type || "text"} value={form[key]} onChange={(e) => set(key, e.target.value)}
          placeholder={opts.placeholder || ""}
          className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none" />
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Add New Lead</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
        </div>
        <div className="px-6 py-4 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {field("PPPoE Username *", "pppoeUsername", { placeholder: "e.g. john_doe" })}
            {field("Category", "category", { type: "select", options: ["RESIDENTIAL", "BUSINESS"] })}
            {field("First Name *", "firstName")}
            {field("Last Name *", "lastName")}
            {field("Email", "email", { type: "email" })}
            {field("Phone", "phone", { type: "tel" })}
            {field("Street", "street")}
            {field("City", "city")}
            {field("Province", "province")}
            {field("Zip Code", "zipCode")}
            {field("Billing Type", "billingType", { type: "select", options: ["RECURRING", "PREPAID"] })}
            {field("Notes", "notes", { type: "textarea", full: true })}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700">Cancel</button>
          <button onClick={handleSubmit} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Saving..." : "Add Lead"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Convert Lead Modal ───────────────────────────

function ConvertLeadModal({ open, onClose, lead, profiles, onConverted }) {
  const [profile, setProfile] = useState("");
  const [pppoePassword, setPppoePassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && profiles?.length > 0 && !profile) {
      setProfile(profiles[0].name);
    }
  }, [open, profiles]);

  if (!open || !lead) return null;

  const handleConvert = async () => {
    if (!profile || !pppoePassword) return alert("Profile and PPPoE password are required");
    setSaving(true);
    try {
      await api.ispCustomerConvert(lead.id, { profile, pppoePassword });
      alert(`${lead.firstName} ${lead.lastName} converted to active customer!`);
      onConverted();
      onClose();
      setProfile("");
      setPppoePassword("");
    } catch (err) {
      alert(err.message || "Failed to convert lead");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Convert Lead to Customer</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="bg-violet-50 rounded-lg p-3">
            <div className="text-sm font-semibold text-violet-800">{lead.firstName} {lead.lastName}</div>
            <div className="text-xs text-violet-600 font-mono">{lead.pppoeUsername}</div>
            {lead.email && <div className="text-xs text-violet-500">{lead.email}</div>}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Service Plan (MikroTik Profile)</label>
            <select value={profile} onChange={(e) => setProfile(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none">
              {(profiles || []).map((p) => (
                <option key={p.name} value={p.name}>{p.name}{p.rateLimit ? ` (${p.rateLimit})` : ""}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">PPPoE Password</label>
            <div className="relative mt-1">
              <input type={showPw ? "text" : "password"} value={pppoePassword} onChange={(e) => setPppoePassword(e.target.value)}
                placeholder="Set a password for the PPPoE connection"
                className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none" />
              <button onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            This will create a PPPoE secret on MikroTik and activate the customer's service.
          </p>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700">Cancel</button>
          <button onClick={handleConvert} disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50">
            <ArrowRightCircle className="h-4 w-4" /> {saving ? "Converting..." : "Convert to Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Leads Page ──────────────────────────────

export default function IspLeadsPage() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("customers");
  const [addOpen, setAddOpen] = useState(false);
  const [convertLead, setConvertLead] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [custData, profileData] = await Promise.all([
        api.ispCustomers({ limit: 500 }),
        api.routerProfiles().catch(() => ({ items: [] })),
      ]);
      const all = custData.items || [];
      setLeads(all.filter((c) => c.status === "LEAD"));
      setCustomers(all.filter((c) => c.status !== "LEAD"));
      setProfiles(profileData || []);
    } catch (err) {
      console.error("Leads load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async (lead) => {
    if (!confirm(`Delete lead ${lead.firstName} ${lead.lastName}?`)) return;
    try {
      await api.ispCustomerDelete(lead.id);
      fetchData();
    } catch (err) {
      alert(err.message || "Failed to delete");
    }
  };

  const filtered = (tab === "leads" ? leads : customers).filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      c.firstName?.toLowerCase().includes(s) ||
      c.lastName?.toLowerCase().includes(s) ||
      c.pppoeUsername?.toLowerCase().includes(s) ||
      c.email?.toLowerCase().includes(s) ||
      c.phone?.toLowerCase().includes(s)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  const statusBadge = (status) => {
    const map = {
      LEAD: "bg-blue-50 text-blue-700 border-blue-200",
      ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
      INACTIVE: "bg-slate-100 text-slate-500 border-slate-200",
      BLOCKED: "bg-red-50 text-red-700 border-red-200",
    };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${map[status] || map.LEAD}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">ISP Customers</h1>
          <p className="text-sm text-slate-500">Manage leads and active customers</p>
        </div>
        <button onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors">
          <UserPlus className="h-4 w-4" /> Add Lead
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-blue-200/60 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700">{leads.length}</div>
              <div className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold">Leads</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-emerald-200/60 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-700">{customers.filter((c) => c.status === "ACTIVE").length}</div>
              <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">Active Customers</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-700">{customers.length + leads.length}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {[
          { id: "leads", label: "Leads", count: leads.length, icon: UserPlus },
          { id: "customers", label: "Customers", count: customers.length, icon: Users },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === t.id ? "border-violet-600 text-violet-700" : "border-transparent text-slate-400 hover:text-slate-600"
              }`}>
              <Icon className="h-3.5 w-3.5" /> {t.label}
              <span className="ml-1 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">{t.count}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input type="text" placeholder={`Search ${tab}...`} value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                {["Name", "PPPoE Username", "Contact", "Category", "Status", "Date Added", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">
                    <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    No {tab} found
                  </td>
                </tr>
              ) : filtered.map((c) => (
                <tr key={c.id}
                  className={`border-b border-slate-50 transition-colors ${tab === "customers" ? "hover:bg-violet-50/30 cursor-pointer" : "hover:bg-violet-50/20"}`}
                  onClick={tab === "customers" ? () => navigate(`/isp-customers/${c.id}`) : undefined}
                >
                  <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                    {c.firstName} {c.lastName}
                    {c.companyName && <div className="text-[10px] text-slate-400">{c.companyName}</div>}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-slate-600">{c.pppoeUsername}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5 text-xs text-slate-500">
                      {c.phone && <div className="flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone}</div>}
                      {c.email && <div className="flex items-center gap-1"><Mail className="h-3 w-3" />{c.email}</div>}
                      {(c.city || c.street) && <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{[c.street, c.city].filter(Boolean).join(", ")}</div>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{c.category}</td>
                  <td className="px-4 py-3">{statusBadge(c.status)}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {c.dateAdded ? new Date(c.dateAdded).toLocaleDateString("en-GB") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {c.status === "LEAD" && (
                        <button onClick={() => setConvertLead(c)} title="Convert to Customer"
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors">
                          <ArrowRightCircle className="h-3 w-3" /> Convert
                        </button>
                      )}
                      {c.status === "LEAD" && (
                        <button onClick={() => handleDelete(c)} title="Delete"
                          className="h-7 w-7 rounded-md flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddLeadModal open={addOpen} onClose={() => setAddOpen(false)} onCreated={fetchData} />
      <ConvertLeadModal open={!!convertLead} onClose={() => setConvertLead(null)} lead={convertLead} profiles={profiles} onConverted={fetchData} />
    </div>
  );
}

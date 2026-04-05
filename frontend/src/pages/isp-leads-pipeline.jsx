import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";
import {
  UserPlus, ArrowRightCircle, Trash2, Phone, Mail, MapPin,
  RefreshCw, X, Eye, EyeOff, Plus, ChevronRight,
} from "lucide-react";

const STAGES = [
  { id: "NEW",          label: "New Lead",        color: "bg-blue-500",    light: "bg-blue-50 border-blue-200",   text: "text-blue-700" },
  { id: "CONTACTED",    label: "Contacted",       color: "bg-violet-500",  light: "bg-violet-50 border-violet-200", text: "text-violet-700" },
  { id: "SITE_SURVEY",  label: "Site Survey",     color: "bg-amber-500",   light: "bg-amber-50 border-amber-200",  text: "text-amber-700" },
  { id: "QUOTED",       label: "Quoted",          color: "bg-orange-500",  light: "bg-orange-50 border-orange-200", text: "text-orange-700" },
  { id: "INSTALL",      label: "Install Pending", color: "bg-teal-500",    light: "bg-teal-50 border-teal-200",    text: "text-teal-700" },
  { id: "LOST",         label: "Lost",            color: "bg-slate-400",   light: "bg-slate-50 border-slate-200",  text: "text-slate-500" },
];

// ── Add Lead Modal ────────────────────────────────

function AddLeadModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    pppoeUsername: "", firstName: "", lastName: "", email: "", phone: "",
    street: "", city: "", province: "", zipCode: "",
    category: "RESIDENTIAL", billingType: "RECURRING", notes: "",
  });
  const [saving, setSaving] = useState(false);

  if (!open) return null;
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.pppoeUsername || !form.firstName || !form.lastName)
      return alert("PPPoE Username, First Name, and Last Name are required");
    setSaving(true);
    try {
      await api.ispCustomerCreate({ ...form, status: "LEAD", leadStage: "NEW" });
      onCreated();
      onClose();
      setForm({ pppoeUsername: "", firstName: "", lastName: "", email: "", phone: "", street: "", city: "", province: "", zipCode: "", category: "RESIDENTIAL", billingType: "RECURRING", notes: "" });
    } catch (err) {
      alert(err.message || "Failed to create lead");
    } finally {
      setSaving(false);
    }
  };

  const F = (label, key, opts = {}) => (
    <div className={opts.full ? "col-span-2" : ""}>
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      {opts.type === "textarea" ? (
        <textarea value={form[key]} onChange={(e) => set(key, e.target.value)} rows={2}
          className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none resize-none" />
      ) : opts.type === "select" ? (
        <select value={form[key]} onChange={(e) => set(key, e.target.value)}
          className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none">
          {opts.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={opts.type || "text"} value={form[key]} onChange={(e) => set(key, e.target.value)}
          placeholder={opts.placeholder || ""}
          className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none" />
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
        <div className="px-6 py-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {F("PPPoE Username *", "pppoeUsername", { placeholder: "e.g. john_doe" })}
            {F("Category", "category", { type: "select", options: ["RESIDENTIAL", "BUSINESS"] })}
            {F("First Name *", "firstName")}
            {F("Last Name *", "lastName")}
            {F("Email", "email", { type: "email" })}
            {F("Phone", "phone", { type: "tel" })}
            {F("Street", "street")}
            {F("City", "city")}
            {F("Province", "province")}
            {F("Zip Code", "zipCode")}
            {F("Billing Type", "billingType", { type: "select", options: ["RECURRING", "PREPAID"] })}
            {F("Notes", "notes", { type: "textarea", full: true })}
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

// ── Convert Lead Modal ────────────────────────────

function ConvertLeadModal({ open, onClose, lead, profiles, onConverted }) {
  const [profile, setProfile] = useState("");
  const [pppoePassword, setPppoePassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && profiles?.length > 0 && !profile) setProfile(profiles[0].name);
  }, [open, profiles, profile]);

  if (!open || !lead) return null;

  const handleConvert = async () => {
    if (!pppoePassword) return alert("PPPoE password is required");
    setSaving(true);
    try {
      await api.ispCustomerConvert(lead.id, { profile, pppoePassword });
      alert(`${lead.firstName} ${lead.lastName} converted to active customer!`);
      onConverted();
      onClose();
      setProfile(""); setPppoePassword("");
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
          {profiles?.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Service Plan</label>
              <select value={profile} onChange={(e) => setProfile(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none">
                {profiles.map((p) => <option key={p.name} value={p.name}>{p.name}{p.rateLimit ? ` (${p.rateLimit})` : ""}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">PPPoE Password</label>
            <div className="relative mt-1">
              <input type={showPw ? "text" : "password"} value={pppoePassword} onChange={(e) => setPppoePassword(e.target.value)}
                placeholder="Set a password for the PPPoE connection"
                className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-lg text-sm outline-none" />
              <button onClick={() => setShowPw(!showPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
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

// ── Lead Card ─────────────────────────────────────

function LeadCard({ lead, onMoveStage, onConvert, onDelete }) {
  const [moving, setMoving] = useState(false);
  const currentIdx = STAGES.findIndex((s) => s.id === (lead.leadStage || "NEW"));
  const nextStage = STAGES[currentIdx + 1];
  const prevStage = STAGES[currentIdx - 1];

  const moveStage = async (stageId) => {
    setMoving(true);
    try { await onMoveStage(lead.id, stageId); } finally { setMoving(false); }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 space-y-2 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-slate-800">{lead.firstName} {lead.lastName}</div>
          <div className="text-[11px] font-mono text-slate-500">{lead.pppoeUsername}</div>
        </div>
        <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded-full font-semibold shrink-0">
          {lead.category}
        </span>
      </div>

      {(lead.phone || lead.email || lead.city) && (
        <div className="space-y-0.5 text-[11px] text-slate-500">
          {lead.phone && <div className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</div>}
          {lead.email && <div className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</div>}
          {lead.city && <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{lead.city}</div>}
        </div>
      )}

      {lead.notes && (
        <p className="text-[11px] text-slate-400 italic line-clamp-2">{lead.notes}</p>
      )}

      <div className="text-[10px] text-slate-400">
        Added {lead.dateAdded ? new Date(lead.dateAdded).toLocaleDateString("en-GB") : "—"}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 pt-1 border-t border-slate-100 flex-wrap">
        {prevStage && (
          <button onClick={() => moveStage(prevStage.id)} disabled={moving}
            className="text-[10px] px-2 py-1 rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40">
            ← Back
          </button>
        )}
        {nextStage && nextStage.id !== "LOST" && (
          <button onClick={() => moveStage(nextStage.id)} disabled={moving}
            className="text-[10px] px-2 py-1 rounded border border-violet-200 text-violet-600 bg-violet-50 hover:bg-violet-100 disabled:opacity-40 font-semibold">
            {nextStage.label} →
          </button>
        )}
        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => onConvert(lead)} title="Convert to Customer"
            className="text-[10px] px-2 py-1 rounded border border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 font-semibold flex items-center gap-0.5">
            <ArrowRightCircle className="h-3 w-3" /> Convert
          </button>
          <button onClick={() => onDelete(lead)} title="Delete"
            className="h-6 w-6 rounded flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50">
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Pipeline Page ────────────────────────────

export default function IspLeadsPipelinePage() {
  const [leads, setLeads] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [convertLead, setConvertLead] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [custData, profileData] = await Promise.allSettled([
        api.ispCustomers({ limit: 500, status: "LEAD" }),
        api.routerProfiles().catch(() => []),
      ]);
      if (custData.status === "fulfilled") setLeads(custData.value?.items || []);
      if (profileData.status === "fulfilled") setProfiles(profileData.value || []);
    } catch (err) {
      console.error("Pipeline load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleMoveStage = async (id, stageId) => {
    await api.ispCustomerUpdate(id, { leadStage: stageId });
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, leadStage: stageId } : l));
  };

  const handleDelete = async (lead) => {
    if (!confirm(`Delete lead ${lead.firstName} ${lead.lastName}?`)) return;
    try {
      await api.ispCustomerDelete(lead.id);
      setLeads((prev) => prev.filter((l) => l.id !== lead.id));
    } catch (err) {
      alert(err.message || "Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="text-sm">Loading pipeline...</span>
        </div>
      </div>
    );
  }

  const stageLeads = (stageId) => leads.filter((l) => (l.leadStage || "NEW") === stageId);

  return (
    <div className="space-y-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Leads Pipeline</h1>
          <p className="text-sm text-slate-500">{leads.length} leads · drag cards between stages to progress</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchData} className="h-9 w-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors">
            <Plus className="h-4 w-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Pipeline summary */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {STAGES.map((s) => {
          const count = stageLeads(s.id).length;
          return (
            <div key={s.id} className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${s.light} ${s.text}`}>
              <span className={`h-2 w-2 rounded-full ${s.color}`} />
              {s.label} <span className="opacity-70">({count})</span>
            </div>
          );
        })}
      </div>

      {/* Kanban board */}
      <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: "calc(100vh - 260px)" }}>
        {STAGES.map((stage) => {
          const stageCards = stageLeads(stage.id);
          return (
            <div key={stage.id} className="shrink-0 w-72 flex flex-col gap-3">
              {/* Column header */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${stage.light}`}>
                <span className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
                <span className={`text-xs font-bold ${stage.text}`}>{stage.label}</span>
                <span className={`ml-auto text-xs font-semibold opacity-60 ${stage.text}`}>{stageCards.length}</span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2 flex-1">
                {stageCards.length === 0 ? (
                  <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center text-xs text-slate-400">
                    No leads
                  </div>
                ) : stageCards.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onMoveStage={handleMoveStage}
                    onConvert={setConvertLead}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Quick add to first stage */}
              {stage.id === "NEW" && (
                <button onClick={() => setAddOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-slate-300 text-xs text-slate-400 hover:border-violet-400 hover:text-violet-500 transition-colors">
                  <Plus className="h-3.5 w-3.5" /> Add lead
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <AddLeadModal open={addOpen} onClose={() => setAddOpen(false)} onCreated={fetchData} />
      <ConvertLeadModal open={!!convertLead} onClose={() => setConvertLead(null)} lead={convertLead} profiles={profiles} onConverted={() => { setConvertLead(null); fetchData(); }} />
    </div>
  );
}

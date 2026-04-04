import React, { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../lib/api";
import {
  Wifi,
  WifiOff,
  Server,
  Cpu,
  HardDrive,
  Clock,
  Users,
  UserX,
  UserCheck,
  UserPlus,
  RefreshCw,
  Power,
  PowerOff,
  Unplug,
  Activity,
  Signal,
  AlertTriangle,
  Search,
  X,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Gauge,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  MoreHorizontal,
} from "lucide-react";

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatBits(bits) {
  if (!bits) return "0 bps";
  const k = 1000;
  const sizes = ["bps", "Kbps", "Mbps", "Gbps"];
  const i = Math.floor(Math.log(bits) / Math.log(k));
  return parseFloat((bits / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatRate(bytesPerSec) {
  if (!bytesPerSec) return "0 bps";
  return formatBits(bytesPerSec * 8);
}

// ────────────────────────────────────────────────────
// MODAL BACKDROP
// ────────────────────────────────────────────────────

function Modal({ open, onClose, title, children, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────
// ADD PPPoE USER MODAL
// ────────────────────────────────────────────────────

function AddUserModal({ open, onClose, profiles, onCreated }) {
  const [form, setForm] = useState({ name: "", password: "", profile: "", service: "pppoe", comment: "" });
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setForm({ name: "", password: "", profile: profiles?.[0]?.name || "", service: "pppoe", comment: "" });
      setError(null);
    }
  }, [open, profiles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.password.trim() || !form.profile) {
      setError("Username, password, and profile are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await api.routerCreateSecret(form);
      onCreated();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add PPPoE User">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div> : null}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. client001" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none" autoFocus />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <div className="relative">
            <input type={showPw ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="PPPoE password" className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Speed Profile</label>
          <select value={form.profile} onChange={(e) => setForm({ ...form, profile: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none bg-white">
            {(profiles || []).map((p) => (
              <option key={p.name} value={p.name}>{p.name}{p.rateLimit ? ` (${p.rateLimit})` : ""}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Service</label>
          <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none bg-white">
            <option value="pppoe">PPPoE</option>
            <option value="any">Any</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Comment <span className="text-slate-400 font-normal">(optional)</span></label>
          <input type="text" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Customer name or note" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
          <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            {saving ? "Creating..." : "Add User"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ────────────────────────────────────────────────────
// EDIT PPPoE USER MODAL
// ────────────────────────────────────────────────────

function EditUserModal({ open, onClose, client, profiles, onUpdated }) {
  const [form, setForm] = useState({ profile: "", password: "", comment: "", disabled: false });
  const [showPw, setShowPw] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && client) {
      setForm({ profile: client.profile || "", password: "", comment: client.comment || "", disabled: client.disabled || false });
      setError(null);
    }
  }, [open, client]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { profile: form.profile, comment: form.comment, disabled: form.disabled };
      if (form.password.trim()) payload.password = form.password;
      await api.routerUpdateSecret(client.id, payload);
      onUpdated();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (!client) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Edit: ${client.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div> : null}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
          <input type="text" value={client.name} disabled className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Speed Profile</label>
          <select value={form.profile} onChange={(e) => setForm({ ...form, profile: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none bg-white">
            {(profiles || []).map((p) => (
              <option key={p.name} value={p.name}>{p.name}{p.rateLimit ? ` (${p.rateLimit})` : ""}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">New Password <span className="text-slate-400 font-normal">(leave blank to keep current)</span></label>
          <div className="relative">
            <input type={showPw ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Leave empty to keep current" className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Comment</label>
          <input type="text" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none" />
        </div>
        <div className="flex items-center gap-3 py-1">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={!form.disabled} onChange={(e) => setForm({ ...form, disabled: !e.target.checked })} className="sr-only peer" />
            <div className="w-9 h-5 bg-slate-200 peer-focus:ring-2 peer-focus:ring-violet-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
          </label>
          <span className="text-sm font-medium text-slate-700">{form.disabled ? "Disabled" : "Enabled"}</span>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Cancel</button>
          <button type="submit" disabled={saving} className="flex-1 px-4 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ────────────────────────────────────────────────────
// CLIENT DETAIL MODAL
// ────────────────────────────────────────────────────

function ClientDetailModal({ open, onClose, client }) {
  if (!open || !client) return null;
  const isOnline = client.isOnline;
  const s = client.activeSession;

  return (
    <Modal open={open} onClose={onClose} title={client.name} wide>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className={`inline-block h-3 w-3 rounded-full ${isOnline ? "bg-emerald-500" : client.disabled ? "bg-red-400" : "bg-slate-300"}`} />
          <span className={`text-sm font-semibold ${isOnline ? "text-emerald-700" : client.disabled ? "text-red-600" : "text-slate-500"}`}>
            {client.disabled ? "Disabled" : isOnline ? "Online" : "Offline"}
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 text-violet-700 rounded-lg text-xs font-semibold">
            <Gauge className="h-3.5 w-3.5" /> {client.profile}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            ["Service", client.service || "pppoe"],
            ["Profile", client.profile],
            ["Comment", client.comment || "—"],
            ["Last Caller ID", client.lastCallerId || "—"],
            ["Last Logout", client.lastLoggedOut || "—"],
          ].map(([label, val]) => (
            <div key={label} className="bg-slate-50 rounded-lg px-3 py-2.5">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</div>
              <div className="text-sm font-medium text-slate-800 mt-0.5 truncate">{val}</div>
            </div>
          ))}
        </div>

        {isOnline && s ? (
          <>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider pt-2">Active Session</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["IP Address", s.address],
                ["Uptime", s.uptime],
                ["Caller ID (MAC)", s.callerId],
                ["Session ID", s.sessionId],
                ["Encoding", s.encoding || "—"],
                ["Service", s.service || "pppoe"],
              ].map(([label, val]) => (
                <div key={label} className="bg-emerald-50/50 rounded-lg px-3 py-2.5 border border-emerald-100">
                  <div className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider">{label}</div>
                  <div className="text-sm font-medium text-slate-800 mt-0.5 truncate">{val || "—"}</div>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {client.bandwidth ? (
          <>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider pt-2">Bandwidth & Usage</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50/50 rounded-lg px-3 py-3 border border-blue-100">
                <div className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">Download (RX)</div>
                <div className="text-lg font-bold text-blue-700 mt-0.5">{isOnline ? formatRate(client.bandwidth.rxRate) : "Offline"}</div>
                <div className="text-xs text-blue-500 mt-1">Total: {formatBytes(client.bandwidth.rxBytes)}</div>
              </div>
              <div className="bg-emerald-50/50 rounded-lg px-3 py-3 border border-emerald-100">
                <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Upload (TX)</div>
                <div className="text-lg font-bold text-emerald-700 mt-0.5">{isOnline ? formatRate(client.bandwidth.txRate) : "Offline"}</div>
                <div className="text-xs text-emerald-500 mt-1">Total: {formatBytes(client.bandwidth.txBytes)}</div>
              </div>
              {client.bandwidth.maxLimitDown || client.bandwidth.maxLimitUp ? (
                <>
                  <div className="bg-slate-50 rounded-lg px-3 py-2.5">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Max Download</div>
                    <div className="text-sm font-medium text-slate-800 mt-0.5">{client.bandwidth.maxLimitDown || "Unlimited"}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg px-3 py-2.5">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Max Upload</div>
                    <div className="text-sm font-medium text-slate-800 mt-0.5">{client.bandwidth.maxLimitUp || "Unlimited"}</div>
                  </div>
                </>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
}

// ────────────────────────────────────────────────────
// STAT CARD
// ────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color = "violet" }) {
  const colors = {
    violet: "bg-violet-50 text-violet-600 ring-violet-200/50",
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-200/50",
    amber: "bg-amber-50 text-amber-600 ring-amber-200/50",
    red: "bg-red-50 text-red-600 ring-red-200/50",
    slate: "bg-slate-100 text-slate-500 ring-slate-200/50",
    blue: "bg-blue-50 text-blue-600 ring-blue-200/50",
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ring-1 ${colors[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</div>
          <div className="text-xl font-bold text-slate-900 truncate">{value}</div>
          {sub ? <div className="text-xs text-slate-500 truncate">{sub}</div> : null}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────
// SYSTEM PANEL
// ────────────────────────────────────────────────────

function SystemPanel({ system, identity }) {
  if (!system) return null;
  const bars = [
    { label: "CPU", icon: Cpu, value: system.cpuLoad, unit: "%" },
    { label: "Memory", icon: HardDrive, value: system.memoryPercent, unit: "%" },
  ];
  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Server className="h-5 w-5 text-violet-600" />
        <h3 className="text-sm font-bold text-slate-900">{identity || "MikroTik Router"}</h3>
        <span className="ml-auto text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium">{system.boardName} · v{system.version}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {bars.map((b) => {
          const Icon = b.icon;
          const pct = b.value || 0;
          const barColor = pct > 80 ? "bg-red-500" : pct > 50 ? "bg-amber-500" : "bg-emerald-500";
          return (
            <div key={b.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-400 flex items-center gap-1"><Icon className="h-3 w-3" />{b.label}</span>
                <span className="text-xs font-bold text-slate-700">{pct}{b.unit}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
        <div>
          <div className="text-xs text-slate-400 flex items-center gap-1 mb-1.5"><Clock className="h-3 w-3" />Uptime</div>
          <div className="text-base font-bold text-slate-900">{system.uptime || "N/A"}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 flex items-center gap-1 mb-1.5"><HardDrive className="h-3 w-3" />Storage</div>
          <div className="text-base font-bold text-slate-900">{formatBytes(system.freeHddSpace)}</div>
          <div className="text-[10px] text-slate-400">of {formatBytes(system.totalHddSpace)}</div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────────────────

export default function NetworkPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState("clients");
  const [sortField, setSortField] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [actionMenuId, setActionMenuId] = useState(null);
  const [liveBw, setLiveBw] = useState({});
  const bwPollRef = useRef(null);

  const fetchData = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const res = await api.routerDashboard();
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to connect to router");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Fast bandwidth poll every 5 seconds
  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const bw = await api.routerBandwidth();
        if (active && bw) setLiveBw(bw);
      } catch { /* silent */ }
    };
    poll();
    bwPollRef.current = setInterval(poll, 5000);
    return () => { active = false; clearInterval(bwPollRef.current); };
  }, []);

  const handleAction = async (action, username) => {
    setActionMenuId(null);
    const msgs = { disconnect: `Disconnect ${username}?`, disable: `Disable ${username}? This prevents reconnection.`, delete: `Permanently delete PPPoE user ${username}?` };
    if (msgs[action] && !confirm(msgs[action])) return;
    setActionLoading(true);
    try {
      if (action === "disconnect") await api.routerDisconnect(username);
      else if (action === "disable") await api.routerDisable(username);
      else if (action === "enable") await api.routerEnable(username);
      else if (action === "delete") {
        const secret = data?.clients?.find((c) => c.name === username);
        if (secret?.id) await api.routerDeleteSecret(secret.id);
      }
      await fetchData(true);
    } catch (err) {
      alert(err.message || `Failed to ${action}`);
    } finally {
      setActionLoading(false);
    }
  };

  const rawClients = data?.clients || [];
  // Merge live bandwidth into clients (updates every 5s)
  const clients = rawClients.map((c) => {
    const bw = liveBw[c.name];
    if (bw) return { ...c, bandwidth: bw };
    return c;
  });
  const filtered = clients
    .filter((c) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || c.name?.toLowerCase().includes(q) || c.profile?.toLowerCase().includes(q) || c.activeSession?.address?.includes(q) || c.lastCallerId?.toLowerCase().includes(q) || c.comment?.toLowerCase().includes(q);
      if (filter === "online") return matchesSearch && c.isOnline;
      if (filter === "offline") return matchesSearch && !c.isOnline && !c.disabled;
      if (filter === "disabled") return matchesSearch && c.disabled;
      return matchesSearch;
    })
    .sort((a, b) => {
      let va, vb;
      if (sortField === "name") { va = a.name || ""; vb = b.name || ""; }
      else if (sortField === "profile") { va = a.profile || ""; vb = b.profile || ""; }
      else if (sortField === "status") { va = a.disabled ? 2 : a.isOnline ? 0 : 1; vb = b.disabled ? 2 : b.isOnline ? 0 : 1; }
      else if (sortField === "ip") { va = a.activeSession?.address || "zzz"; vb = b.activeSession?.address || "zzz"; }
      else if (sortField === "uptime") { va = a.activeSession?.uptime || ""; vb = b.activeSession?.uptime || ""; }
      else { va = a.name || ""; vb = b.name || ""; }
      if (typeof va === "number") return sortDir === "asc" ? va - vb : vb - va;
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortHeader = ({ field, children }) => (
    <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:text-slate-600 transition-colors" onClick={() => toggleSort(field)}>
      <span className="inline-flex items-center gap-1">{children}<ArrowUpDown className={`h-3 w-3 ${sortField === field ? "text-violet-500" : "text-slate-300"}`} /></span>
    </th>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="text-sm">Connecting to MikroTik Router...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Network Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">MikroTik RouterOS · PPPoE Client Monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors shadow-sm">
            <UserPlus className="h-4 w-4" /> Add PPPoE User
          </button>
          <button onClick={() => fetchData(true)} disabled={refreshing} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Error / Offline alerts */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-red-800">Router Connection Error</div>
            <div className="text-sm text-red-600 mt-0.5">{error}</div>
            <div className="text-xs text-red-500 mt-1">Ensure RouterOS API is enabled (port 8728) and your server IP is allowed.</div>
          </div>
        </div>
      ) : null}
      {data && !data.connected ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <WifiOff className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div><div className="text-sm font-medium text-amber-800">Router Offline</div><div className="text-sm text-amber-600 mt-0.5">{data.error || "Cannot reach MikroTik."}</div></div>
        </div>
      ) : null}

      {/* Stats */}
      {data ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard icon={data.connected ? Wifi : WifiOff} label="Router" value={data.connected ? "Online" : "Offline"} color={data.connected ? "emerald" : "red"} />
          <StatCard icon={Signal} label="Active" value={data.activeConnections || 0} sub="Connected now" color="emerald" />
          <StatCard icon={Users} label="Total" value={data.totalSecrets || 0} sub="PPPoE accounts" color="blue" />
          <StatCard icon={UserCheck} label="Online" value={data.onlineClients || 0} color="emerald" />
          <StatCard icon={WifiOff} label="Offline" value={data.offlineClients || 0} color="slate" />
          <StatCard icon={UserX} label="Disabled" value={data.disabledClients || 0} color="red" />
        </div>
      ) : null}

      {/* System Panel */}
      {data?.connected ? <SystemPanel system={data.system} identity={data.identity} /> : null}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {[
          { key: "clients", label: "PPPoE Clients", icon: Users },
          { key: "profiles", label: "Speed Profiles", icon: Gauge },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setTab(t.key)} className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t.key ? "border-violet-600 text-violet-700" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`}>
              <Icon className="h-4 w-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* CLIENTS TAB */}
      {tab === "clients" ? (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search by username, IP, MAC, comment..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none transition-all" />
            </div>
            <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs shrink-0">
              {[{ key: "all", label: "All", count: clients.length }, { key: "online", label: "Online", count: data?.onlineClients || 0 }, { key: "offline", label: "Offline", count: data?.offlineClients || 0 }, { key: "disabled", label: "Disabled", count: data?.disabledClients || 0 }].map((f) => (
                <button key={f.key} onClick={() => setFilter(f.key)} className={`px-3 py-1.5 font-medium transition-colors ${filter === f.key ? "bg-violet-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"}`}>
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <Users className="h-10 w-10 text-slate-200 mx-auto mb-3" />
              <div className="text-sm font-medium text-slate-400">{clients.length === 0 ? "No PPPoE clients found" : "No clients match your filter"}</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/80 border-b border-slate-100">
                  <tr>
                    <SortHeader field="status">Status</SortHeader>
                    <SortHeader field="name">Username</SortHeader>
                    <SortHeader field="profile">Profile</SortHeader>
                    <SortHeader field="ip">IP Address</SortHeader>
                    <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">MAC / Caller ID</th>
                    <SortHeader field="uptime">Uptime</SortHeader>
                    <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      <span className="inline-flex items-center gap-1.5">Bandwidth <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold ring-1 ring-emerald-200/50"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />LIVE</span></span>
                    </th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Usage</th>
                    <th className="px-3 py-2.5 text-right text-[10px] font-semibold text-slate-400 uppercase tracking-wider w-20">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((c) => {
                    const isOnline = c.isOnline;
                    const s = c.activeSession;
                    return (
                      <tr key={c.id || c.name} className={`hover:bg-violet-50/30 transition-colors ${c.disabled ? "opacity-50" : ""}`}>
                        <td className="px-3 py-2.5">
                          {c.disabled ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-600 ring-1 ring-red-200/50">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-400" /> Disabled
                            </span>
                          ) : isOnline ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/50">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 ring-1 ring-slate-200/50">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" /> Offline
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2.5">
                          <button onClick={() => { setSelectedClient(c); setDetailOpen(true); }} className="text-sm font-semibold text-violet-700 hover:text-violet-900 hover:underline">{c.name}</button>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-700 rounded text-xs font-medium">
                            <Gauge className="h-3 w-3" /> {c.profile}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-sm text-slate-700 font-mono">{s?.address || "—"}</td>
                        <td className="px-3 py-2.5 text-xs text-slate-500 font-mono">{s?.callerId || c.lastCallerId || "—"}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-600">{s?.uptime || "—"}</td>
                        <td className="px-3 py-2.5">
                          {c.bandwidth && isOnline ? (
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 text-xs">
                                <ArrowDown className="h-3 w-3 text-blue-500" />
                                <span className="font-medium text-blue-700">{formatRate(c.bandwidth.rxRate)}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <ArrowUp className="h-3 w-3 text-emerald-500" />
                                <span className="font-medium text-emerald-700">{formatRate(c.bandwidth.txRate)}</span>
                              </div>
                            </div>
                          ) : <span className="text-xs text-slate-400">—</span>}
                        </td>
                        <td className="px-3 py-2.5">
                          {c.bandwidth ? (
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1 text-xs">
                                <ArrowDown className="h-3 w-3 text-blue-400" />
                                <span className="text-slate-600">{formatBytes(c.bandwidth.rxBytes)}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <ArrowUp className="h-3 w-3 text-emerald-400" />
                                <span className="text-slate-600">{formatBytes(c.bandwidth.txBytes)}</span>
                              </div>
                            </div>
                          ) : <span className="text-xs text-slate-400">—</span>}
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <div className="relative inline-block">
                            <button onClick={() => setActionMenuId(actionMenuId === c.name ? null : c.name)} className="h-7 w-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {actionMenuId === c.name ? (
                              <div className="absolute right-0 top-8 z-20 bg-white border border-slate-200 rounded-lg shadow-lg py-1 w-44" onMouseLeave={() => setActionMenuId(null)}>
                                <button onClick={() => { setSelectedClient(c); setDetailOpen(true); setActionMenuId(null); }} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Eye className="h-3.5 w-3.5" /> View Details</button>
                                <button onClick={() => { setSelectedClient(c); setEditOpen(true); setActionMenuId(null); }} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Pencil className="h-3.5 w-3.5" /> Edit User</button>
                                {isOnline ? <button onClick={() => handleAction("disconnect", c.name)} disabled={actionLoading} className="w-full text-left px-3 py-2 text-sm text-amber-700 hover:bg-amber-50 flex items-center gap-2"><Unplug className="h-3.5 w-3.5" /> Disconnect</button> : null}
                                {!c.disabled ? (
                                  <button onClick={() => handleAction("disable", c.name)} disabled={actionLoading} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><PowerOff className="h-3.5 w-3.5" /> Disable</button>
                                ) : (
                                  <button onClick={() => handleAction("enable", c.name)} disabled={actionLoading} className="w-full text-left px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"><Power className="h-3.5 w-3.5" /> Enable</button>
                                )}
                                <div className="my-1 border-t border-slate-100" />
                                <button onClick={() => handleAction("delete", c.name)} disabled={actionLoading} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="h-3.5 w-3.5" /> Delete User</button>
                              </div>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="px-4 py-2.5 border-t border-slate-100 text-xs text-slate-400">
            Showing {filtered.length} of {clients.length} PPPoE users · Dashboard refresh 30s · <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />Bandwidth live every 5s</span>
          </div>
        </div>
      ) : null}

      {/* PROFILES TAB */}
      {tab === "profiles" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.profiles || []).map((p) => {
            const parts = (p.rateLimit || "").split("/");
            const download = parts[0] || "—";
            const upload = parts[1] || parts[0] || "—";
            const usersOnProfile = clients.filter((c) => c.profile === p.name).length;
            const onlineOnProfile = clients.filter((c) => c.profile === p.name && c.isOnline).length;
            return (
              <div key={p.id} className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{p.name}</h3>
                    {p.comment ? <p className="text-xs text-slate-400 mt-0.5">{p.comment}</p> : null}
                  </div>
                  <Activity className="h-5 w-5 text-violet-500" />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50 rounded-lg px-3 py-2">
                    <div className="text-[10px] font-semibold text-blue-400 uppercase">Download</div>
                    <div className="text-sm font-bold text-blue-700">{download}</div>
                  </div>
                  <div className="bg-emerald-50 rounded-lg px-3 py-2">
                    <div className="text-[10px] font-semibold text-emerald-400 uppercase">Upload</div>
                    <div className="text-sm font-bold text-emerald-700">{upload}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Pool: {p.remoteAddress || "default"}</span>
                  <span className="font-semibold text-slate-600">{onlineOnProfile}/{usersOnProfile} online</span>
                </div>
              </div>
            );
          })}
          {!(data?.profiles || []).length ? (
            <div className="col-span-full text-center py-16">
              <Gauge className="h-10 w-10 text-slate-200 mx-auto mb-3" />
              <div className="text-sm font-medium text-slate-400">No PPP profiles found</div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Modals */}
      <AddUserModal open={addOpen} onClose={() => setAddOpen(false)} profiles={data?.profiles || []} onCreated={() => fetchData(true)} />
      <EditUserModal open={editOpen} onClose={() => { setEditOpen(false); setSelectedClient(null); }} client={selectedClient} profiles={data?.profiles || []} onUpdated={() => fetchData(true)} />
      <ClientDetailModal open={detailOpen} onClose={() => { setDetailOpen(false); setSelectedClient(null); }} client={selectedClient} />
    </div>
  );
}

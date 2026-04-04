import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../lib/api";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft,
  Wifi,
  WifiOff,
  RefreshCw,
  Activity,
  Clock,
  Gauge,
  ArrowDown,
  ArrowUp,
  User,
  Server,
  Globe,
  Shield,
  Pencil,
  Power,
  PowerOff,
  Unplug,
  Trash2,
  Eye,
  EyeOff,
  X,
  ChevronLeft,
  ChevronRight,
  Signal,
  Hash,
  MapPin,
  Phone,
  Mail,
  FileText,
  BarChart3,
  Settings2,
  MonitorSmartphone,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────

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

function timeLabel() {
  const d = new Date();
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

// ── Modal ────────────────────────────────────────

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md max-h-[90vh] overflow-y-auto">
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

// ── Edit User Modal ──────────────────────────────

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
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Speed Profile</label>
          <select value={form.profile} onChange={(e) => setForm({ ...form, profile: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none bg-white">
            {(profiles || []).map((p) => (
              <option key={p.name} value={p.name}>{p.name}{p.rateLimit ? ` (${p.rateLimit})` : ""}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">New Password <span className="text-slate-400 font-normal">(leave blank to keep)</span></label>
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

// ── Bandwidth Chart Tooltip ──────────────────────

function ChartTooltipContent({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <div className="font-semibold text-slate-600 mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-bold text-slate-800">{formatBits(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ── Information Tab ──────────────────────────────

function InformationTab({ client, session }) {
  const isOnline = client.isOnline;

  const infoFields = [
    { icon: User, label: "PPPoE Login", value: client.name },
    { icon: Shield, label: "Status", value: client.disabled ? "Disabled" : isOnline ? "Online" : "Offline", badge: true },
    { icon: Gauge, label: "Profile / Plan", value: client.profile },
    { icon: Server, label: "Service", value: client.service || "pppoe" },
    { icon: Hash, label: "Secret ID", value: client.id },
    { icon: FileText, label: "Comment", value: client.comment || "—" },
    { icon: MonitorSmartphone, label: "Last Caller ID (MAC)", value: client.lastCallerId || "—" },
    { icon: Clock, label: "Last Logged Out", value: client.lastLoggedOut || "—" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Info */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Main Information</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {infoFields.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="flex items-center gap-4">
                  <div className="w-40 flex items-center gap-2 text-xs font-medium text-slate-400 shrink-0">
                    <Icon className="h-3.5 w-3.5" /> {f.label}
                  </div>
                  <div className="flex-1">
                    {f.badge ? (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        client.disabled ? "bg-red-50 text-red-600 ring-1 ring-red-200/50" :
                        isOnline ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/50" :
                        "bg-slate-100 text-slate-500 ring-1 ring-slate-200/50"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${client.disabled ? "bg-red-400" : isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                        {f.value}
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-slate-800">{f.value}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Session / Quick Stats */}
      <div className="space-y-4">
        {isOnline && session ? (
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Signal className="h-4 w-4 text-emerald-500" /> Active Session
              </h3>
            </div>
            <div className="p-5 space-y-3">
              {[
                ["IP Address", session.address],
                ["Uptime", session.uptime],
                ["Caller ID", session.callerId],
                ["Session ID", session.sessionId],
                ["Encoding", session.encoding || "—"],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">{l}</span>
                  <span className="text-xs font-semibold text-slate-700 font-mono">{v || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-6 text-center">
            <WifiOff className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-400">{client.disabled ? "Account Disabled" : "Not Connected"}</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Quick Info</h3>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Local Address</span>
              <span className="text-xs font-semibold text-slate-700 font-mono">{client.localAddress || "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Remote Address</span>
              <span className="text-xs font-semibold text-slate-700 font-mono">{client.remoteAddress || "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Services Tab ─────────────────────────────────

function ServicesTab({ client, session, profileData }) {
  const isOnline = client.isOnline;
  const profile = profileData || {};

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Internet Services</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/80 border-b border-slate-100">
            <tr>
              {["ID", "Status", "Description", "Plan", "Rate Limit", "Service Login", "IPv4 Address", "Actions"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-violet-50/30 transition-colors">
              <td className="px-4 py-3 text-sm text-slate-600 font-mono">{client.id?.replace("*", "") || "—"}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  client.disabled ? "bg-red-50 text-red-600" : isOnline ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${client.disabled ? "bg-red-400" : isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                  {client.disabled ? "Disabled" : isOnline ? "Online" : "Offline"}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">{client.profile}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-700 rounded text-xs font-medium">
                  <Gauge className="h-3 w-3" /> {client.profile}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600 font-mono">{profile.rateLimit || "—"}</td>
              <td className="px-4 py-3 text-sm text-slate-700 font-mono">{client.name}</td>
              <td className="px-4 py-3 text-sm text-slate-700 font-mono">{session?.address || "—"}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="h-6 w-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors" title="View">
                    <Eye className="h-3.5 w-3.5" />
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2.5 border-t border-slate-100 text-xs text-slate-400">
        Showing 1 to 1 of 1 entries
      </div>
    </div>
  );
}

// ── Statistics Tab ───────────────────────────────

function StatisticsTab({ client, session, username }) {
  const isOnline = client.isOnline;
  const [chartData, setChartData] = useState([]);
  const [interval, setInterval_] = useState("1 minute");
  const pollRef = useRef(null);
  const MAX_POINTS = 60;

  useEffect(() => {
    let active = true;

    const poll = async () => {
      try {
        const traffic = await api.routerUserTraffic(username);
        if (active && traffic) {
          setChartData((prev) => {
            const next = [...prev, {
              time: timeLabel(),
              upload: traffic.txBitsPerSecond || 0,
              download: traffic.rxBitsPerSecond || 0,
            }];
            return next.length > MAX_POINTS ? next.slice(-MAX_POINTS) : next;
          });
        }
      } catch { /* silent */ }
    };

    poll();
    pollRef.current = setInterval(poll, 2000);
    return () => { active = false; clearInterval(pollRef.current); };
  }, [username]);

  const lastPoint = chartData[chartData.length - 1];
  const currentUpload = lastPoint?.upload || 0;
  const currentDownload = lastPoint?.download || 0;

  return (
    <div className="space-y-6">
      {/* Online Sessions */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Signal className="h-4 w-4 text-violet-600" /> Online Sessions
          </h3>
        </div>
        {isOnline && session ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  {["Login", "In", "Out", "Start at", "Time", "IP", "MAC", "NAS"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-violet-50/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-violet-700 font-semibold">{client.name}</td>
                  <td className="px-4 py-3 text-sm text-blue-600 font-medium">{client.bandwidth ? formatBytes(client.bandwidth.rxBytes) : "—"}</td>
                  <td className="px-4 py-3 text-sm text-emerald-600 font-medium">{client.bandwidth ? formatBytes(client.bandwidth.txBytes) : "—"}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">—</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{session.uptime}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 font-mono">{session.address}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono">{session.callerId}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">MikroTik</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-sm text-slate-400">No active sessions</div>
        )}
      </div>

      {/* Live Bandwidth Chart */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Activity className="h-4 w-4 text-violet-600" /> Live Bandwidth Usage
          </h3>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-700 rounded text-xs font-medium">
              {client.profile}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-bold ring-1 ring-emerald-200/50">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> LIVE
            </span>
          </div>
        </div>

        {/* Legend + Current Speed */}
        <div className="px-6 pt-4 flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <span className="h-3 w-6 rounded bg-rose-400/60" />
            <span className="text-xs text-slate-500">Upload</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-6 rounded bg-blue-400/60" />
            <span className="text-xs text-slate-500">Download</span>
          </div>
        </div>

        {/* Chart */}
        <div className="px-4 py-4" style={{ height: 300 }}>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="downloadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickFormatter={(v) => formatBits(v)} width={70} />
                <Tooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="upload" name="Upload" stroke="#f43f5e" fill="url(#uploadGrad)" strokeWidth={2} dot={false} animationDuration={300} />
                <Area type="monotone" dataKey="download" name="Download" stroke="#3b82f6" fill="url(#downloadGrad)" strokeWidth={2} dot={false} animationDuration={300} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-slate-400">
              <RefreshCw className="h-4 w-4 animate-spin mr-2" /> Collecting bandwidth data...
            </div>
          )}
        </div>

        {/* Current Speed Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Upload</div>
            <div className="text-sm font-bold text-rose-600 flex items-center gap-1">
              <ArrowUp className="h-3.5 w-3.5" /> {formatBits(currentUpload)}
            </div>
          </div>
          <div className="text-slate-200 text-lg">/</div>
          <div className="text-center">
            <div className="text-[10px] font-semibold text-slate-400 uppercase">Download</div>
            <div className="text-sm font-bold text-blue-600 flex items-center gap-1">
              <ArrowDown className="h-3.5 w-3.5" /> {formatBits(currentDownload)}
            </div>
          </div>
        </div>
      </div>

      {/* Total for Period */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-violet-600" /> Total for Session
            </h3>
          </div>
          <div className="p-6 space-y-3">
            {[
              ["Total Downloaded", client.bandwidth ? formatBytes(client.bandwidth.rxBytes) : "0 B", "text-blue-700"],
              ["Total Uploaded", client.bandwidth ? formatBytes(client.bandwidth.txBytes) : "0 B", "text-emerald-700"],
              ["Session Duration", session?.uptime || "—", "text-slate-700"],
            ].map(([l, v, c]) => (
              <div key={l} className="flex justify-between items-center">
                <span className="text-sm text-slate-500">{l}</span>
                <span className={`text-sm font-bold ${c}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Gauge className="h-4 w-4 text-violet-600" /> Speed Limits
            </h3>
          </div>
          <div className="p-6 space-y-3">
            {[
              ["Max Download", client.bandwidth?.maxLimitDown || "Unlimited", "text-blue-700"],
              ["Max Upload", client.bandwidth?.maxLimitUp || "Unlimited", "text-emerald-700"],
              ["Profile", client.profile, "text-violet-700"],
            ].map(([l, v, c]) => (
              <div key={l} className="flex justify-between items-center">
                <span className="text-sm text-slate-500">{l}</span>
                <span className={`text-sm font-bold ${c}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────

export default function NetworkClientPage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("information");
  const [editOpen, setEditOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchClient = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashData] = await Promise.all([api.routerDashboard()]);
      const found = dashData.clients?.find((c) => c.name === username);
      if (!found) { setError("PPPoE user not found"); return; }
      setClient(found);
      setProfiles(dashData.profiles || []);
    } catch (err) {
      setError(err.message || "Failed to load client");
    } finally {
      setLoading(false);
    }
  }, [username]);

  // Live bandwidth merge
  const [liveBw, setLiveBw] = useState(null);
  useEffect(() => {
    let active = true;
    const poll = async () => {
      try {
        const bw = await api.routerBandwidth();
        if (active && bw?.[username]) setLiveBw(bw[username]);
      } catch { /* silent */ }
    };
    const id = setInterval(poll, 5000);
    poll();
    return () => { active = false; clearInterval(id); };
  }, [username]);

  useEffect(() => { fetchClient(); }, [fetchClient]);

  const enrichedClient = client ? { ...client, bandwidth: liveBw || client.bandwidth } : null;
  const session = enrichedClient?.activeSession;
  const profileData = profiles.find((p) => p.name === enrichedClient?.profile);

  const handleAction = async (action) => {
    const msgs = { disconnect: `Disconnect ${username}?`, disable: `Disable ${username}?`, delete: `Delete PPPoE user ${username}?` };
    if (msgs[action] && !confirm(msgs[action])) return;
    setActionLoading(true);
    try {
      if (action === "disconnect") await api.routerDisconnect(username);
      else if (action === "disable") await api.routerDisable(username);
      else if (action === "enable") await api.routerEnable(username);
      else if (action === "delete") {
        if (client?.id) await api.routerDeleteSecret(client.id);
        navigate("/network");
        return;
      }
      await fetchClient();
    } catch (err) {
      alert(err.message || `Failed to ${action}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="text-sm">Loading client data...</span>
        </div>
      </div>
    );
  }

  if (error || !enrichedClient) {
    return (
      <div className="space-y-4">
        <Link to="/network" className="inline-flex items-center gap-1 text-sm text-violet-600 hover:text-violet-800">
          <ArrowLeft className="h-4 w-4" /> Back to Network
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-sm text-red-600">{error || "Client not found"}</p>
        </div>
      </div>
    );
  }

  const isOnline = enrichedClient.isOnline;

  const tabs = [
    { key: "information", label: "Information", icon: User },
    { key: "services", label: "Services", icon: Settings2 },
    { key: "statistics", label: "Statistics", icon: BarChart3 },
  ];

  return (
    <div className="space-y-5">
      {/* Breadcrumb + Header */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/network" className="text-violet-600 hover:text-violet-800 hover:underline">Customers</Link>
        <span className="text-slate-300">/</span>
        <Link to="/network" className="text-violet-600 hover:text-violet-800 hover:underline">List</Link>
        <span className="text-slate-300">/</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        {/* Client Header Bar */}
        <div className="px-6 py-4 bg-gradient-to-r from-violet-600 to-violet-700 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Wifi className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-lg truncate">{enrichedClient.comment || enrichedClient.name}</div>
            <div className="text-violet-200 text-xs font-mono">{enrichedClient.name}</div>
          </div>
          {/* Nav arrows */}
          <div className="flex items-center gap-1">
            <button className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50/50">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.key} onClick={() => setTab(t.key)} className={`inline-flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${tab === t.key ? "border-violet-600 text-violet-700 bg-white" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
                <Icon className="h-4 w-4" /> {t.label}
              </button>
            );
          })}

          {/* Actions on right */}
          <div className="ml-auto flex items-center gap-2 py-2">
            <button onClick={() => setEditOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
              <Pencil className="h-3 w-3" /> Edit
            </button>
            {isOnline ? (
              <button onClick={() => handleAction("disconnect")} disabled={actionLoading} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors disabled:opacity-50">
                <Unplug className="h-3 w-3" /> Disconnect
              </button>
            ) : null}
            {!enrichedClient.disabled ? (
              <button onClick={() => handleAction("disable")} disabled={actionLoading} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50">
                <PowerOff className="h-3 w-3" /> Disable
              </button>
            ) : (
              <button onClick={() => handleAction("enable")} disabled={actionLoading} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50">
                <Power className="h-3 w-3" /> Enable
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {tab === "information" && <InformationTab client={enrichedClient} session={session} />}
      {tab === "services" && <ServicesTab client={enrichedClient} session={session} profileData={profileData} />}
      {tab === "statistics" && <StatisticsTab client={enrichedClient} session={session} username={username} />}

      {/* Edit Modal */}
      <EditUserModal open={editOpen} onClose={() => setEditOpen(false)} client={enrichedClient} profiles={profiles} onUpdated={fetchClient} />
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";
import {
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Send,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Settings,
  Save,
  TestTube2,
} from "lucide-react";

const TYPE_LABELS = {
  INVOICE_CREATED: "Invoice Sent",
  PAYMENT_RECEIVED: "Payment",
  OVERDUE_REMINDER: "Overdue",
  SUSPENSION_WARNING: "Warning",
  SUSPENDED: "Suspended",
  REACTIVATED: "Reactivated",
};

const TYPE_COLORS = {
  INVOICE_CREATED: "bg-blue-50 text-blue-700 border-blue-200",
  PAYMENT_RECEIVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  OVERDUE_REMINDER: "bg-amber-50 text-amber-700 border-amber-200",
  SUSPENSION_WARNING: "bg-orange-50 text-orange-700 border-orange-200",
  SUSPENDED: "bg-red-50 text-red-700 border-red-200",
  REACTIVATED: "bg-green-50 text-green-700 border-green-200",
};

const CHANNEL_ICONS = {
  EMAIL: Mail,
  SMS: Phone,
  WHATSAPP: MessageSquare,
};

// ── Notification Settings Tab ────────────────────

function NotificationSettingsTab({ settings, onSaved }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) setForm({ ...settings });
  }, [settings]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.billingSettingsUpdate(form);
      alert("Notification settings saved!");
      onSaved();
    } catch (err) {
      alert(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const toggle = (label, key) => (
    <label className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 cursor-pointer">
      <span className="text-sm text-slate-700">{label}</span>
      <button onClick={() => set(key, !form[key])}
        className={`relative w-10 h-5 rounded-full transition-colors ${form[key] ? "bg-violet-600" : "bg-slate-300"}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key] ? "translate-x-5" : ""}`} />
      </button>
    </label>
  );

  const field = (label, key, opts = {}) => (
    <div>
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <input type={opts.type || "text"} value={form[key] || ""} onChange={(e) => set(key, e.target.value)}
        placeholder={opts.placeholder || ""}
        className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Channel toggles */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Notification Channels</h3>
        <div className="space-y-1">
          {toggle("Email Notifications", "enableEmailNotifications")}
          {toggle("SMS Notifications", "enableSmsNotifications")}
          {toggle("WhatsApp Notifications", "enableWhatsappNotifications")}
        </div>
      </div>

      {/* Event toggles */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Notify On</h3>
        <div className="space-y-1">
          {toggle("Invoice Created", "notifyOnInvoice")}
          {toggle("Payment Received", "notifyOnPayment")}
          {toggle("Overdue Reminder", "notifyOnOverdue")}
          {toggle("Suspension / Reactivation", "notifyOnSuspension")}
        </div>
      </div>

      {/* SMS settings */}
      {form.enableSmsNotifications && (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-3">SMS Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Provider</label>
              <select value={form.smsApiProvider || ""} onChange={(e) => set("smsApiProvider", e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none">
                <option value="">Select provider...</option>
                <option value="bulksms">BulkSMS</option>
                <option value="clickatell">Clickatell</option>
              </select>
            </div>
            {field("API Key", "smsApiKey", { placeholder: "Your SMS API key" })}
            {field("API Secret", "smsApiSecret", { placeholder: "Your SMS API secret" })}
            {field("Sender ID", "smsSenderId", { placeholder: "e.g. MyISP" })}
          </div>
        </div>
      )}

      {/* WhatsApp settings */}
      {form.enableWhatsappNotifications && (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
          <h3 className="text-sm font-bold text-slate-900 mb-3">WhatsApp Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {field("API URL", "whatsappApiUrl", { placeholder: "https://graph.facebook.com/v17.0/..." })}
            {field("API Key / Token", "whatsappApiKey", { placeholder: "Bearer token" })}
            {field("From Number", "whatsappFromNumber", { placeholder: "+27..." })}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

// ── Main Notifications Page ──────────────────────

export default function IspNotificationsPage() {
  const [tab, setTab] = useState("log");
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [logTotal, setLogTotal] = useState(0);
  const [logPage, setLogPage] = useState(1);
  const [logPages, setLogPages] = useState(1);
  const [settings, setSettings] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("");
  const [channelFilter, setChannelFilter] = useState("");
  const [testCustomerId, setTestCustomerId] = useState("");
  const [sending, setSending] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [statsData, logData, settingsData, custData] = await Promise.all([
        api.notificationStats(),
        api.notificationLog({
          page: logPage,
          type: typeFilter || undefined,
          channel: channelFilter || undefined,
        }),
        api.billingSettings(),
        api.ispCustomers({ limit: 200 }),
      ]);
      setStats(statsData);
      setLogs(logData.items || []);
      setLogTotal(logData.total || 0);
      setLogPages(logData.pages || 1);
      setSettings(settingsData);
      setCustomers((custData.items || []).filter((c) => c.status === "ACTIVE"));
    } catch (err) {
      console.error("Notifications load error:", err);
    } finally {
      setLoading(false);
    }
  }, [logPage, typeFilter, channelFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSendTest = async () => {
    if (!testCustomerId) return alert("Select a customer first");
    setSending(true);
    try {
      const res = await api.notificationTest(testCustomerId);
      const sent = (res || []).filter((r) => r.status === "SENT").length;
      const failed = (res || []).filter((r) => r.status === "FAILED").length;
      alert(`Test sent! ${sent} succeeded, ${failed} failed.`);
      fetchData();
    } catch (err) {
      alert(err.message || "Failed to send test");
    } finally {
      setSending(false);
    }
  };

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

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500">Email, SMS & WhatsApp notifications for ISP billing events</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Sent", value: stats?.total || 0, color: "violet", icon: Send },
          { label: "Sent Today", value: stats?.sentToday || 0, color: "blue", icon: Bell },
          { label: "This Month", value: stats?.sentThisMonth || 0, color: "emerald", icon: CheckCircle2 },
          { label: "Failed", value: stats?.failed || 0, color: "red", icon: XCircle },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`bg-white rounded-xl border border-${s.color}-200/60 shadow-sm p-4`}>
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg bg-${s.color}-50 flex items-center justify-center`}>
                  <Icon className={`h-4.5 w-4.5 text-${s.color}-500`} />
                </div>
                <div>
                  <div className={`text-xl font-bold text-${s.color}-700`}>{s.value}</div>
                  <div className={`text-[10px] text-${s.color}-400 uppercase tracking-wider font-semibold`}>{s.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        {[
          { id: "log", label: "Notification Log", icon: Bell },
          { id: "test", label: "Send Test", icon: TestTube2 },
          { id: "settings", label: "Settings", icon: Settings },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === t.id ? "border-violet-600 text-violet-700" : "border-transparent text-slate-400 hover:text-slate-600"
              }`}>
              <Icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === "log" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setLogPage(1); }}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none">
                <option value="">All Types</option>
                {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <select value={channelFilter} onChange={(e) => { setChannelFilter(e.target.value); setLogPage(1); }}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none">
                <option value="">All Channels</option>
                <option value="EMAIL">Email</option>
                <option value="SMS">SMS</option>
                <option value="WHATSAPP">WhatsApp</option>
              </select>
            </div>
            <span className="text-xs text-slate-400">{logTotal} notifications</span>
          </div>

          {/* Log table */}
          <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/80 border-b border-slate-100">
                  <tr>
                    {["Date", "Customer", "Type", "Channel", "Recipient", "Status", "Message"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">
                        <Bell className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                        No notifications yet
                      </td>
                    </tr>
                  ) : logs.map((log) => {
                    const ChannelIcon = CHANNEL_ICONS[log.channel] || Bell;
                    return (
                      <tr key={log.id} className="border-b border-slate-50 hover:bg-violet-50/20 transition-colors">
                        <td className="px-4 py-2.5 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="px-4 py-2.5 text-sm font-medium text-slate-700">
                          {log.customer ? `${log.customer.firstName} ${log.customer.lastName}` : "—"}
                          {log.customer?.pppoeUsername && (
                            <div className="text-[10px] text-slate-400 font-mono">{log.customer.pppoeUsername}</div>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${TYPE_COLORS[log.type] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
                            {TYPE_LABELS[log.type] || log.type}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <ChannelIcon className="h-3 w-3" /> {log.channel}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-slate-500 font-mono">{log.recipient}</td>
                        <td className="px-4 py-2.5">
                          {log.status === "SENT" ? (
                            <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                              <CheckCircle2 className="h-3 w-3" /> Sent
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-red-500" title={log.errorMessage || ""}>
                              <XCircle className="h-3 w-3" /> Failed
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-slate-500 max-w-[200px] truncate" title={log.message}>
                          {log.subject || log.message?.substring(0, 60)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {logPages > 1 && (
              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">Page {logPage} of {logPages}</span>
                <div className="flex gap-1">
                  <button onClick={() => setLogPage((p) => Math.max(1, p - 1))} disabled={logPage <= 1}
                    className="h-7 w-7 rounded-md flex items-center justify-center border border-slate-200 text-slate-400 hover:text-slate-600 disabled:opacity-30">
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setLogPage((p) => Math.min(logPages, p + 1))} disabled={logPage >= logPages}
                    className="h-7 w-7 rounded-md flex items-center justify-center border border-slate-200 text-slate-400 hover:text-slate-600 disabled:opacity-30">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "test" && (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6 max-w-lg">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Send Test Notification</h3>
          <p className="text-xs text-slate-400 mb-4">
            Send a test notification to a customer via all enabled channels to verify your configuration is working.
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</label>
              <select value={testCustomerId} onChange={(e) => setTestCustomerId(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none">
                <option value="">Select customer...</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} ({c.pppoeUsername}) {c.email ? `- ${c.email}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500 space-y-1">
              <div><strong>Email:</strong> {settings?.enableEmailNotifications ? "Enabled" : "Disabled"}</div>
              <div><strong>SMS:</strong> {settings?.enableSmsNotifications ? `Enabled (${settings.smsApiProvider || "no provider"})` : "Disabled"}</div>
              <div><strong>WhatsApp:</strong> {settings?.enableWhatsappNotifications ? "Enabled" : "Disabled"}</div>
            </div>

            <button onClick={handleSendTest} disabled={sending || !testCustomerId}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 disabled:opacity-50">
              <Send className="h-4 w-4" /> {sending ? "Sending..." : "Send Test"}
            </button>
          </div>
        </div>
      )}

      {tab === "settings" && (
        <NotificationSettingsTab settings={settings} onSaved={fetchData} />
      )}
    </div>
  );
}

import React, { useState, useEffect, useCallback } from "react";
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
  RefreshCw,
  Power,
  PowerOff,
  Unplug,
  Activity,
  Signal,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Search,
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

function StatusDot({ online }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${
        online ? "bg-emerald-500 shadow-sm shadow-emerald-200" : "bg-slate-300"
      }`}
    />
  );
}

function StatCard({ icon: Icon, label, value, sub, color = "violet" }) {
  const colors = {
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
    slate: "bg-slate-50 text-slate-600",
    blue: "bg-blue-50 text-blue-600",
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</div>
          <div className="text-xl font-bold text-slate-900 truncate">{value}</div>
          {sub ? <div className="text-xs text-slate-500 truncate">{sub}</div> : null}
        </div>
      </div>
    </div>
  );
}

function SystemPanel({ system, identity }) {
  if (!system) return null;
  return (
    <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Server className="h-5 w-5 text-violet-600" />
        <h3 className="text-sm font-semibold text-slate-900">
          Router: {identity || "MikroTik"}
        </h3>
        <span className="ml-auto text-xs text-slate-400">
          {system.boardName} · {system.version}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
            <Cpu className="h-3 w-3" /> CPU
          </div>
          <div className="text-lg font-bold text-slate-900">{system.cpuLoad}%</div>
          <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                system.cpuLoad > 80 ? "bg-red-500" : system.cpuLoad > 50 ? "bg-amber-500" : "bg-emerald-500"
              }`}
              style={{ width: `${system.cpuLoad}%` }}
            />
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
            <HardDrive className="h-3 w-3" /> Memory
          </div>
          <div className="text-lg font-bold text-slate-900">{system.memoryPercent}%</div>
          <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                system.memoryPercent > 80 ? "bg-red-500" : system.memoryPercent > 50 ? "bg-amber-500" : "bg-emerald-500"
              }`}
              style={{ width: `${system.memoryPercent}%` }}
            />
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
            <Clock className="h-3 w-3" /> Uptime
          </div>
          <div className="text-lg font-bold text-slate-900">{system.uptime || "N/A"}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
            <HardDrive className="h-3 w-3" /> Storage
          </div>
          <div className="text-lg font-bold text-slate-900">
            {formatBytes(system.freeHddSpace)}
          </div>
          <div className="text-xs text-slate-400">of {formatBytes(system.totalHddSpace)}</div>
        </div>
      </div>
    </div>
  );
}

function ClientRow({ client, onDisconnect, onDisable, onEnable, actionLoading }) {
  const [expanded, setExpanded] = useState(false);
  const isOnline = client.isOnline;
  const session = client.activeSession;

  return (
    <div className={`border-b border-slate-100 last:border-0 ${client.disabled ? "opacity-60" : ""}`}>
      <div
        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50/50 cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <StatusDot online={isOnline} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900 truncate">{client.name}</span>
            {client.disabled ? (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-600">
                DISABLED
              </span>
            ) : isOnline ? (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-600">
                ONLINE
              </span>
            ) : (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                OFFLINE
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
            <span>Profile: {client.profile}</span>
            {isOnline && session ? (
              <>
                <span>IP: {session.address}</span>
                <span>Uptime: {session.uptime}</span>
              </>
            ) : client.lastCallerId ? (
              <span>Last MAC: {client.lastCallerId}</span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {isOnline ? (
            <button
              onClick={(e) => { e.stopPropagation(); onDisconnect(client.name); }}
              disabled={actionLoading}
              className="h-7 px-2 rounded-md text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors disabled:opacity-50"
              title="Disconnect"
            >
              <Unplug className="h-3.5 w-3.5" />
            </button>
          ) : null}
          {!client.disabled ? (
            <button
              onClick={(e) => { e.stopPropagation(); onDisable(client.name); }}
              disabled={actionLoading}
              className="h-7 px-2 rounded-md text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50"
              title="Disable user"
            >
              <PowerOff className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onEnable(client.name); }}
              disabled={actionLoading}
              className="h-7 px-2 rounded-md text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors disabled:opacity-50"
              title="Enable user"
            >
              <Power className="h-3.5 w-3.5" />
            </button>
          )}
          {expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </div>
      </div>
      {expanded ? (
        <div className="px-4 pb-3 pt-0">
          <div className="bg-slate-50 rounded-lg p-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400">Service:</span>{" "}
              <span className="font-medium text-slate-700">{client.service || "pppoe"}</span>
            </div>
            <div>
              <span className="text-slate-400">Profile:</span>{" "}
              <span className="font-medium text-slate-700">{client.profile}</span>
            </div>
            {isOnline && session ? (
              <>
                <div>
                  <span className="text-slate-400">IP Address:</span>{" "}
                  <span className="font-medium text-slate-700">{session.address}</span>
                </div>
                <div>
                  <span className="text-slate-400">Uptime:</span>{" "}
                  <span className="font-medium text-slate-700">{session.uptime}</span>
                </div>
                <div>
                  <span className="text-slate-400">Caller ID:</span>{" "}
                  <span className="font-medium text-slate-700">{session.callerId}</span>
                </div>
                <div>
                  <span className="text-slate-400">Session:</span>{" "}
                  <span className="font-medium text-slate-700">{session.sessionId}</span>
                </div>
              </>
            ) : null}
            {client.lastCallerId ? (
              <div>
                <span className="text-slate-400">Last Caller ID:</span>{" "}
                <span className="font-medium text-slate-700">{client.lastCallerId}</span>
              </div>
            ) : null}
            {client.lastLoggedOut ? (
              <div>
                <span className="text-slate-400">Last Logout:</span>{" "}
                <span className="font-medium text-slate-700">{client.lastLoggedOut}</span>
              </div>
            ) : null}
            {client.comment ? (
              <div className="col-span-2">
                <span className="text-slate-400">Comment:</span>{" "}
                <span className="font-medium text-slate-700">{client.comment}</span>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function NetworkPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

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

  const handleDisconnect = async (username) => {
    if (!confirm(`Disconnect ${username}?`)) return;
    setActionLoading(true);
    try {
      await api.routerDisconnect(username);
      await fetchData(true);
    } catch (err) {
      alert(err.message || "Failed to disconnect");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisable = async (username) => {
    if (!confirm(`Disable ${username}? This will disconnect and prevent reconnection.`)) return;
    setActionLoading(true);
    try {
      await api.routerDisable(username);
      await fetchData(true);
    } catch (err) {
      alert(err.message || "Failed to disable");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEnable = async (username) => {
    setActionLoading(true);
    try {
      await api.routerEnable(username);
      await fetchData(true);
    } catch (err) {
      alert(err.message || "Failed to enable");
    } finally {
      setActionLoading(false);
    }
  };

  const clients = data?.clients || [];
  const filtered = clients.filter((c) => {
    const matchesSearch =
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.profile?.toLowerCase().includes(search.toLowerCase()) ||
      c.activeSession?.address?.includes(search) ||
      c.lastCallerId?.toLowerCase().includes(search.toLowerCase());

    if (filter === "online") return matchesSearch && c.isOnline;
    if (filter === "offline") return matchesSearch && !c.isOnline && !c.disabled;
    if (filter === "disabled") return matchesSearch && c.disabled;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-slate-400">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Connecting to router...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Network Monitoring</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Live PPPoE client monitoring via MikroTik RouterOS
          </p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-red-800">Router Connection Error</div>
            <div className="text-sm text-red-600 mt-0.5">{error}</div>
            <div className="text-xs text-red-500 mt-2">
              Make sure the RouterOS API is enabled on port 8728 and the firewall allows your server IP.
            </div>
          </div>
        </div>
      ) : null}

      {/* Connection Status */}
      {data && !data.connected ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <WifiOff className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-medium text-amber-800">Router Offline</div>
            <div className="text-sm text-amber-600 mt-0.5">
              {data.error || "Cannot connect to MikroTik router. Check API access."}
            </div>
          </div>
        </div>
      ) : null}

      {/* Stats Cards */}
      {data ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            icon={data.connected ? Wifi : WifiOff}
            label="Router"
            value={data.connected ? "Online" : "Offline"}
            color={data.connected ? "emerald" : "red"}
          />
          <StatCard
            icon={Signal}
            label="Active"
            value={data.activeConnections || 0}
            sub="Connected now"
            color="emerald"
          />
          <StatCard
            icon={Users}
            label="Total Users"
            value={data.totalSecrets || 0}
            sub="PPPoE accounts"
            color="blue"
          />
          <StatCard
            icon={UserCheck}
            label="Online"
            value={data.onlineClients || 0}
            color="emerald"
          />
          <StatCard
            icon={WifiOff}
            label="Offline"
            value={data.offlineClients || 0}
            color="slate"
          />
          <StatCard
            icon={UserX}
            label="Disabled"
            value={data.disabledClients || 0}
            color="red"
          />
        </div>
      ) : null}

      {/* System Panel */}
      {data?.connected ? <SystemPanel system={data.system} identity={data.identity} /> : null}

      {/* Profiles */}
      {data?.profiles?.length ? (
        <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4 text-violet-600" />
            Speed Profiles
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.profiles.map((p) => (
              <div
                key={p.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-xs"
              >
                <span className="font-semibold text-slate-700">{p.name}</span>
                {p.rateLimit ? (
                  <span className="text-slate-400">{p.rateLimit}</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Clients Table */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-violet-600" />
            PPPoE Clients ({filtered.length})
          </h3>
          <div className="flex items-center gap-2 sm:ml-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search username, IP, MAC..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none w-56 transition-all"
              />
            </div>
            <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
              {[
                { key: "all", label: "All" },
                { key: "online", label: "Online" },
                { key: "offline", label: "Offline" },
                { key: "disabled", label: "Disabled" },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-2.5 py-1.5 font-medium transition-colors ${
                    filter === f.key
                      ? "bg-violet-600 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-slate-400">
            {clients.length === 0
              ? "No PPPoE clients found. Check router connection."
              : "No clients match your filter."}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((client) => (
              <ClientRow
                key={client.id || client.name}
                client={client}
                onDisconnect={handleDisconnect}
                onDisable={handleDisable}
                onEnable={handleEnable}
                actionLoading={actionLoading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { api } from "../../lib/api";
import { cn } from "../../lib/utils";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Globe,
  Radio,
  RefreshCw,
  Router,
  Server,
  Shield,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Link } from "react-router-dom";

const STATUS_COLORS = {
  ONLINE: "bg-emerald-400",
  OFFLINE: "bg-slate-300",
  DEGRADED: "bg-amber-400",
  MAINTENANCE: "bg-blue-400",
};

const SEVERITY_CONFIG = {
  CRITICAL: { cls: "text-rose-600 bg-rose-50", icon: AlertTriangle },
  WARNING: { cls: "text-amber-600 bg-amber-50", icon: AlertTriangle },
  INFO: { cls: "text-blue-600 bg-blue-50", icon: Shield },
};

export default function NetworkStatusWidget() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.ispDashboard();
      setData(res || { devices: {}, clients: {}, alerts: {} });
    } catch (e) {
      setData({ devices: { total: 0, online: 0, offline: 0, degraded: 0 }, clients: { total: 0, active: 0, suspended: 0, pending: 0 }, alerts: { unresolved: 0, critical: 0, recent: [] } });
      setError("Network tables not available. Run migrations first.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const devices = data?.devices || {};
  const clients = data?.clients || {};
  const alerts = data?.alerts || {};
  const recentAlerts = alerts.recent || [];

  return (
    <Card className="border border-slate-200/80 bg-white/80 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.03] to-transparent pointer-events-none" />
      <div className="relative">
        {/* Header */}
        <div className="p-5 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-sm shadow-cyan-600/20">
                <Globe className="h-4 w-4 text-white" strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-slate-800">Network Status</div>
                <div className="text-[11px] text-slate-400">
                  {devices.total || 0} devices · {clients.active || 0} active clients
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={fetchData}
                disabled={loading}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
              </button>
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mx-5 mb-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600">
            {error}
          </div>
        ) : null}

        {/* Device status overview */}
        <div className="px-5 pb-3">
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Online", count: devices.online || 0, color: STATUS_COLORS.ONLINE, icon: Wifi },
              { label: "Offline", count: devices.offline || 0, color: STATUS_COLORS.OFFLINE, icon: WifiOff },
              { label: "Degraded", count: devices.degraded || 0, color: STATUS_COLORS.DEGRADED, icon: Radio },
              { label: "Alerts", count: alerts.unresolved || 0, color: alerts.critical > 0 ? "bg-rose-400" : "bg-amber-400", icon: AlertTriangle },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg bg-slate-50/80">
                <div className="flex items-center gap-1.5">
                  <div className={cn("h-2 w-2 rounded-full", s.color)} />
                  <span className="text-sm font-bold tabular-nums text-slate-800">{s.count}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Client summary */}
        <div className="px-5 pb-3">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-slate-500">Active</span>
              <span className="font-semibold text-slate-700 tabular-nums">{clients.active || 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-slate-500">Suspended</span>
              <span className="font-semibold text-slate-700 tabular-nums">{clients.suspended || 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-blue-400" />
              <span className="text-slate-500">Pending</span>
              <span className="font-semibold text-slate-700 tabular-nums">{clients.pending || 0}</span>
            </div>
          </div>
        </div>

        {/* Expanded: Recent alerts */}
        {expanded ? (
          <CardContent className="pt-0">
            <div className="border-t border-slate-100 pt-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Recent Alerts</div>
              {recentAlerts.length === 0 ? (
                <div className="py-4 text-center text-sm text-slate-400">No unresolved alerts</div>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {recentAlerts.map((alert) => {
                    const cfg = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.INFO;
                    const Icon = cfg.icon;
                    return (
                      <div key={alert.id} className="flex items-start gap-2.5 py-2 px-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className={cn("h-6 w-6 rounded-md flex items-center justify-center shrink-0 mt-0.5", cfg.cls)}>
                          <Icon className="h-3 w-3" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium text-slate-700 truncate">{alert.message}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400">{alert.device?.name || "Unknown device"}</span>
                            <span className="text-[10px] text-slate-300">·</span>
                            <span className={cn("text-[10px] font-medium", cfg.cls.split(" ")[0])}>
                              {alert.severity}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        ) : null}
      </div>
    </Card>
  );
}

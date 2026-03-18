import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { useAuth } from "../features/auth/auth-context";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Shield, Settings, LogOut, ChevronRight } from "lucide-react";
import Button from "../components/ui/button";

function initials(name) {
  if (!name || typeof name !== "string") return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return parts.map((p) => p[0]).join("").toUpperCase() || "?";
}

function resolveDisplayName(user) {
  if (!user) return null;
  const direct = user.fullName || user.displayName || user.name;
  if (direct && String(direct).trim()) {
    const s = String(direct).trim();
    if (!/^account$/i.test(s)) return s;
  }
  const composed = (user.firstName || user.lastName)
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "";
  if (composed) return composed;
  if (user.email) {
    const local = user.email.split("@")[0] || "";
    if (local) {
      const formatted = local.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      return formatted;
    }
  }
  return null;
}

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = resolveDisplayName(user) || user?.email || "Account";
  const email = user?.email || "—";
  const role = user?.role || user?.roleName;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero / Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-violet-50/40 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-violet-950/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-100/50 via-transparent to-transparent dark:from-violet-900/20" aria-hidden="true" />
        <div className="relative flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 text-2xl font-semibold text-white shadow-md ring-4 ring-white/50 dark:ring-slate-800/50">
            {initials(displayName)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              Welcome back, {displayName.split(/\s+/)[0] || "there"}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your profile and account settings
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="sm:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400">
                <User className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-800">
                    <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Name
                    </div>
                    <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {displayName}
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-800">
                    <Mail className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Email
                    </div>
                    <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {role && (
              <div className="flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-2 dark:bg-violet-900/20">
                <Shield className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span className="text-sm text-violet-700 dark:text-violet-300">
                  Role: <span className="font-medium capitalize">{role.toLowerCase()}</span>
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                <Settings className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">Quick actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              to="/settings"
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 transition-all hover:border-violet-200 hover:bg-violet-50/50 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-violet-800/50 dark:hover:bg-violet-900/20"
            >
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Settings
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </Link>
            <Link
              to="/settings?section=profile"
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 transition-all hover:border-violet-200 hover:bg-violet-50/50 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-violet-800/50 dark:hover:bg-violet-900/20"
            >
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Edit profile
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </Link>
            <Link
              to="/settings?section=account"
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 transition-all hover:border-violet-200 hover:bg-violet-50/50 dark:border-slate-800 dark:bg-slate-800/30 dark:hover:border-violet-800/50 dark:hover:bg-violet-900/20"
            >
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Account & security
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-500" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Sign out */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => { logout(); navigate("/"); }}
          className="gap-2 border-slate-200 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900/50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}

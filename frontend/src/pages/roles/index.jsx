import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../features/auth/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import { Lock, Plus, Shield, Users } from "lucide-react";
import ActionsMenu from "../../components/common/ActionsMenu";

function canManageRoles(user) {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  if (user.roleRef?.name === "Admin") return true;
  const perms = user.permissions || [];
  return perms.includes("*") || perms.includes("roles.manage");
}

export default function RolesListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.listRoles({ page: 1, limit: 50, q: q || undefined });
      setData(res);
    } catch (e) {
      setError(e.message || "Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id, isSystem) {
    if (isSystem) return;
    if (!window.confirm("Delete this role? Users with this role will need to be reassigned first.")) return;
    setDeleting(id);
    try {
      await api.deleteRole(id);
      load();
    } catch (e) {
      setError(e.message || "Failed to delete role");
    } finally {
      setDeleting(null);
    }
  }

  async function handleDuplicate(id) {
    try {
      const created = await api.duplicateRole(id);
      navigate(`/settings/roles/${created.id}/edit`);
    } catch (e) {
      setError(e.message || "Failed to duplicate role");
    }
  }

  if (!canManageRoles(user)) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <Shield className="mx-auto h-12 w-12 text-amber-600" />
        <p className="mt-3 text-sm font-medium text-amber-800">You don&apos;t have permission to manage roles.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/settings")}>
          Back to Settings
        </Button>
      </div>
    );
  }

  const roles = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Roles & Permissions</h1>
          <p className="mt-1 text-sm text-slate-500">Manage access control and permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
              placeholder="Search roles..."
              className="pl-9"
            />
            <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
          <Button onClick={load} variant="outline">
            Search
          </Button>
          <Link to="/settings/roles/new">
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Plus className="mr-2 h-4 w-4" />
              New role
            </Button>
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent>
                <div className="h-5 w-32 rounded bg-slate-200" />
                <div className="mt-2 h-4 w-full rounded bg-slate-100" />
                <div className="mt-4 flex gap-2">
                  <div className="h-8 w-16 rounded bg-slate-100" />
                  <div className="h-8 w-16 rounded bg-slate-100" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r) => (
            <Card key={r.id} className="group">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="h-8 w-8 rounded-lg shrink-0"
                      style={{ backgroundColor: r.color ? `${r.color}20` : "#f1f5f9" }}
                    >
                      <div
                        className="mt-2 ml-2 h-2 w-2 rounded-full"
                        style={{ backgroundColor: r.color || "#64748b" }}
                      />
                    </div>
                    <CardTitle className="truncate">{r.name}</CardTitle>
                    {r.isSystem ? (
                      <Lock className="h-4 w-4 shrink-0 text-slate-400" title="System role" />
                    ) : null}
                  </div>
                </div>
                {r.description ? (
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">{r.description}</p>
                ) : null}
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5" />
                    {r.permissionCount ?? 0} permissions
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {r.userCount ?? 0} users
                  </span>
                </div>
                <div className="mt-4 flex justify-end">
                  <ActionsMenu
                    ariaLabel="Role actions"
                    items={[
                      { key: "edit", label: "Edit", onSelect: () => navigate(`/settings/roles/${r.id}/edit`) },
                      ...(!r.isSystem ? [
                        { key: "duplicate", label: "Duplicate", onSelect: () => handleDuplicate(r.id) },
                        {
                          key: "delete",
                          label: "Delete",
                          tone: "danger",
                          disabled: deleting === r.id || (r.userCount ?? 0) > 0,
                          onSelect: () => handleDelete(r.id, r.isSystem),
                        },
                      ] : []),
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

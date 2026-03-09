import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../features/auth/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import Button from "../../components/ui/button";
import Input from "../../components/ui/input";
import PermissionMatrix from "../../components/roles/PermissionMatrix";
import { ArrowLeft, Lock, Save } from "lucide-react";

function canManageRoles(user) {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  if (user.roleRef?.name === "Admin") return true;
  const perms = user.permissions || [];
  return perms.includes("*") || perms.includes("roles.manage");
}

export default function RoleEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNew = !id || id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [permissionsData, setPermissionsData] = useState(null);
  const [role, setRole] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#7c3aed",
  });
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    async function loadPermissions() {
      try {
        const res = await api.listPermissions();
        setPermissionsData(res);
      } catch (e) {
        setError(e.message || "Failed to load permissions");
      }
    }
    loadPermissions();
  }, []);

  useEffect(() => {
    if (!isNew && id) {
      setLoading(true);
      api
        .getRole(id)
        .then((r) => {
          setRole(r);
          setForm({
            name: r.name,
            description: r.description || "",
            color: r.color || "#7c3aed",
          });
          setSelectedIds(r.permissions?.map((p) => p.id) || []);
        })
        .catch((e) => setError(e.message || "Failed to load role"))
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  function handleToggle(permId) {
    setSelectedIds((prev) =>
      prev.includes(permId) ? prev.filter((p) => p !== permId) : [...prev, permId]
    );
  }

  function handleToggleModule(mod, permissions) {
    const ids = permissions.map((p) => p.id);
    const allSelected = ids.every((i) => selectedIds.includes(i));
    setSelectedIds((prev) =>
      allSelected
        ? prev.filter((p) => !ids.includes(p))
        : [...new Set([...prev, ...ids])]
    );
  }

  async function handleSave(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (isNew) {
        const created = await api.createRole({
          ...form,
          permissionIds: selectedIds,
        });
        navigate(`/settings/roles/${created.id}/edit`, { replace: true });
      } else {
        await api.updateRole(id, {
          ...form,
          permissionIds: selectedIds,
        });
        setError(null);
        const updated = await api.getRole(id);
        setRole(updated);
        setSelectedIds(updated.permissions?.map((p) => p.id) || []);
      }
    } catch (e) {
      setError(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (!canManageRoles(user)) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <Lock className="mx-auto h-12 w-12 text-amber-600" />
        <p className="mt-3 text-sm font-medium text-amber-800">You don&apos;t have permission to manage roles.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/settings")}>
          Back to Settings
        </Button>
      </div>
    );
  }

  const modules = permissionsData?.byModule || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/settings/roles">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            {isNew ? "Create role" : "Edit role"}
          </h1>
          <p className="text-sm text-slate-500">
            {isNew ? "Set up a new role with permissions" : "Update role details and permissions"}
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <Card>
          <CardContent>
            <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
            <div className="mt-4 h-64 animate-pulse rounded bg-slate-100" />
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600">Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Accountant"
                  disabled={role?.isSystem}
                  required
                  className="mt-1"
                />
                {role?.isSystem ? (
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <Lock className="h-3.5 w-3.5" />
                    System roles cannot be renamed
                  </p>
                ) : null}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Description</label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Optional description"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600">Color</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="color"
                    value={form.color || "#7c3aed"}
                    onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                    className="h-10 w-14 cursor-pointer rounded border border-slate-200 p-1"
                  />
                  <Input
                    value={form.color}
                    onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                    placeholder="#7c3aed"
                    className="w-28 font-mono text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <p className="mt-1 text-xs text-slate-500">
                Select the actions this role can perform
              </p>
            </CardHeader>
            <CardContent>
              <PermissionMatrix
                modules={modules}
                selectedIds={selectedIds}
                onToggle={handleToggle}
                onToggleModule={handleToggleModule}
                disabled={role?.isSystem}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Link to="/settings/roles">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={saving} className="bg-violet-600 hover:bg-violet-700">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving…" : "Save role"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../features/auth/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import Dialog from "../components/ui/dialog";
import Pagination from "../components/common/Pagination";
import ListPageToolbar from "../components/common/ListPageToolbar";
import ActionsMenu from "../components/common/ActionsMenu";


function formatUserNumber(n) {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return "—";
  return String(v).padStart(3, "0");
}

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  if (currentUser?.role !== "ADMIN") return <Navigate to="/settings" replace />;
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQ = searchParams.get("q") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const [q, setQ] = useState(urlQ);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
    role: "ACCOUNTANT",
    roleId: null,
    isActive: true,
    password: "",
  });

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(null);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    companyName: currentUser?.companyName || "",
    role: "ACCOUNTANT",
    roleId: "",
  });

  useEffect(() => {
    api.listRoles({ limit: 100 }).then((r) => setRoles(r?.data || [])).catch(() => {});
  }, []);

  // Pre-fill company when currentUser loads (admins add users to their company)
  useEffect(() => {
    if (currentUser?.companyName) {
      setForm((f) => ({ ...f, companyName: currentUser.companyName }));
    }
  }, [currentUser?.companyName]);

  const users = data?.data || [];

  async function load(opts = {}) {
    const p = opts.page ?? page;
    const searchQ = opts.q !== undefined ? opts.q : urlQ;
    setLoading(true);
    setError(null);
    try {
      const res = await api.listUsers({ page: p, limit: 20, q: searchQ || undefined });
      setData(res);
    } catch (e) {
      setError(e.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  function setPage(p) {
    const next = new URLSearchParams(searchParams);
    if (p <= 1) next.delete("page");
    else next.set("page", String(p));
    setSearchParams(next, { replace: true });
  }

  function handleSearch() {
    const next = new URLSearchParams(searchParams);
    if (q) next.set("q", q);
    else next.delete("q");
    next.delete("page");
    setSearchParams(next, { replace: true });
  }

  useEffect(() => setQ(urlQ), [urlQ]);
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, urlQ]);

  const canCreate = useMemo(() => {
    return (
      form.email.trim() &&
      form.password.length >= 8 &&
      form.firstName.trim() &&
      form.lastName.trim() &&
      (form.roleId || form.role || roles.length === 0)
    );
  }, [form, roles.length]);

  async function onCreate(e) {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);
    if (!canCreate) return;

    setCreating(true);
    try {
      await api.createUser({
        email: form.email.trim(),
        password: form.password,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        companyName: form.companyName.trim() || undefined,
        role: form.roleId ? undefined : (form.role || "ACCOUNTANT"),
        roleId: form.roleId || undefined,
      });
      setCreateSuccess("User created successfully.");
      setTimeout(() => setCreateSuccess(null), 3000);
      setForm({ email: "", password: "", firstName: "", lastName: "", companyName: currentUser?.companyName || "", role: "ACCOUNTANT", roleId: roles[0]?.id || "" });
      setQ("");
      setSearchParams(new URLSearchParams(), { replace: true });
      await load({ page: 1, q: "" });
    } catch (e2) {
      setCreateError(e2.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  }

  async function updateUser(id, patch) {
    try {
      await api.updateUser(id, patch);
      await load();
    } catch (e) {
      setError(e.message || "Failed to update user");
    }
  }

  async function updateUserRole(id, roleId) {
    try {
      await api.updateUserRole(id, { roleId: roleId || null });
      await load();
    } catch (e) {
      setError(e.message || "Failed to update role");
    }
  }

  async function deleteUser(id) {
    const ok = window.confirm("Delete this user? This cannot be undone.");
    if (!ok) return;
    setError(null);
    try {
      await api.deleteUser(id);
      await load();
    } catch (e) {
      setError(e.message || "Failed to delete user");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Users & Roles</h1>
        <p className="text-sm text-slate-600">Create users and manage their roles</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create user</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={onCreate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">First name</label>
                <Input value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Last name</label>
                <Input value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <Input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                />
                <div className="text-xs text-slate-500">Minimum 8 characters.</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Company</label>
                <Input
                  value={form.companyName}
                  onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
                  placeholder="(your company — new users join it)"
                  disabled={Boolean(currentUser?.companyName)}
                />
                {currentUser?.companyName ? (
                  <div className="text-xs text-slate-500">New users are added to your company.</div>
                ) : null}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Role</label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={form.roleId}
                  onChange={(e) => setForm((p) => ({ ...p, roleId: e.target.value, role: p.role }))}
                >
                  {roles.length === 0 ? (
                    <option value="">Accountant (legacy)</option>
                  ) : (
                    roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {createError ? <div className="text-sm text-red-600">{createError}</div> : null}
            {createSuccess ? <div className="text-sm text-emerald-700">{createSuccess}</div> : null}

            <div className="flex items-center justify-end">
              <Button type="submit" disabled={creating || !canCreate}>
                {creating ? "Creating..." : "Create user"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All users</CardTitle>
        </CardHeader>
        <CardContent>
          <ListPageToolbar
            searchValue={q}
            onSearchChange={(v) => { setQ(v); const next = new URLSearchParams(searchParams); if (v) next.set("q", v); else next.delete("q"); next.delete("page"); setSearchParams(next, { replace: true }); }}
            searchPlaceholder="Search by name, email, company"
          />
          <div className="flex justify-end mt-2">
            <Button type="button" variant="outline" className="h-9" onClick={handleSearch} disabled={loading}>
              {loading ? "Loading..." : "Search"}
            </Button>
          </div>

          {error ? <div className="mt-3 text-sm text-red-600">{error}</div> : null}

          <div className="mt-4 overflow-auto">
            <table className="min-w-[1000px] w-full text-sm">
              <thead className="text-left text-slate-500">
                <tr>
                  <th className="py-2">User #</th>
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Company</th>
                  <th className="py-2">Plan</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Active</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-slate-100">
                    <td className="py-2 font-mono text-xs text-slate-600">{formatUserNumber(u.userNumber)}</td>
                    <td className="py-2 font-medium">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="py-2">{u.email}</td>
                    <td className="py-2">{u.companyName || "—"}</td>
                    <td className="py-2">
                      {(() => {
                        const company = u.company;
                        if (!company) return <span className="text-slate-400">—</span>;
                        const status = company.subscriptionStatus;
                        const plan = company.subscriptions?.[0]?.plan;
                        const isTrial = status === "TRIAL";
                        if (isTrial) {
                          return (
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                              Trial
                            </span>
                          );
                        }
                        if (plan?.name) {
                          const isPremium = (plan.name || "").toUpperCase() === "PROFESSIONAL";
                          return (
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${isPremium ? "bg-violet-100 text-violet-800" : "bg-slate-100 text-slate-700"}`}>
                              {(plan.name || "").replace("_", " ")}
                            </span>
                          );
                        }
                        if (status === "EXPIRED") return <span className="text-slate-400">Expired</span>;
                        return <span className="text-slate-400">—</span>;
                      })()}
                    </td>
                    <td className="py-2">
                      <select
                        className="h-9 rounded-md border border-slate-200 bg-white px-2 text-sm"
                        value={u.roleId || ""}
                        onChange={(e) => updateUserRole(u.id, e.target.value || null)}
                      >
                        <option value="">Legacy ({u.role})</option>
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={Boolean(u.isActive)}
                        onChange={(e) => updateUser(u.id, { role: u.role, isActive: e.target.checked })}
                      />
                    </td>
                    <td className="py-2">
                      <ActionsMenu
                        ariaLabel="User actions"
                        items={[
                          {
                            key: "edit",
                            label: "Edit",
                            onSelect: () => {
                              setEditError(null);
                              setEditUserId(u.id);
                              setEditForm({
                                firstName: u.firstName || "",
                                lastName: u.lastName || "",
                                email: u.email || "",
                                companyName: u.companyName || "",
                                role: u.role || "ACCOUNTANT",
                                roleId: u.roleId || null,
                                isActive: Boolean(u.isActive),
                                password: "",
                              });
                              setEditOpen(true);
                            },
                          },
                          {
                            key: "delete",
                            label: "Delete",
                            tone: "danger",
                            onSelect: () => deleteUser(u.id),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading && users.length === 0 ? (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-slate-600">No users found.</p>
                {urlQ ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQ("");
                      setSearchParams({}, { replace: true });
                      load({ page: 1, q: "" });
                    }}
                  >
                    Clear search
                  </Button>
                ) : null}
              </div>
            ) : null}

            {data?.meta && users.length > 0 ? (
              <Pagination
                page={data.meta.page}
                limit={data.meta.limit}
                total={data.meta.total}
                onPageChange={setPage}
              />
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen} title="Edit user">
        <form
          className="space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!editUserId) return;
            setEditSaving(true);
            setEditError(null);
            try {
              const patch = {
                firstName: String(editForm.firstName || "").trim(),
                lastName: String(editForm.lastName || "").trim(),
                email: String(editForm.email || "").trim(),
                companyName: String(editForm.companyName || "").trim() || null,
                isActive: Boolean(editForm.isActive),
                ...(String(editForm.password || "").trim() ? { password: String(editForm.password) } : {}),
              };
              await api.updateUser(editUserId, patch);
              if (editForm.roleId !== undefined) {
                await api.updateUserRole(editUserId, { roleId: editForm.roleId || null });
              }
              setEditOpen(false);
              setEditUserId(null);
              await load();
            } catch (e2) {
              setEditError(e2.message || "Failed to update user");
            } finally {
              setEditSaving(false);
            }
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">First name</label>
              <Input value={editForm.firstName} onChange={(e) => setEditForm((p) => ({ ...p, firstName: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Last name</label>
              <Input value={editForm.lastName} onChange={(e) => setEditForm((p) => ({ ...p, lastName: e.target.value }))} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <Input value={editForm.email} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Company</label>
            <Input
              value={editForm.companyName}
              onChange={(e) => setEditForm((p) => ({ ...p, companyName: e.target.value }))}
              placeholder="(optional)"
              disabled={Boolean(currentUser?.companyName)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Role</label>
              <select
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                value={editForm.roleId || ""}
                onChange={(e) => setEditForm((p) => ({ ...p, roleId: e.target.value || null }))}
              >
                <option value="">Legacy ({editForm.role})</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Active</label>
              <div className="h-10 flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={Boolean(editForm.isActive)}
                  onChange={(e) => setEditForm((p) => ({ ...p, isActive: e.target.checked }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">New password</label>
            <Input
              type="password"
              value={editForm.password}
              onChange={(e) => setEditForm((p) => ({ ...p, password: e.target.value }))}
              placeholder="(leave blank to keep current)"
            />
            <div className="text-xs text-slate-500">Minimum 8 characters.</div>
          </div>

          {editError ? <div className="text-sm text-red-600">{editError}</div> : null}

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setEditOpen(false)} disabled={editSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={editSaving}>
              {editSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

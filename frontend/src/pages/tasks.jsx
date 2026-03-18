import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { addDismissedTask } from "../lib/notification-dismissed";
import Button from "../components/ui/button";
import Dialog from "../components/ui/dialog";
import Input from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import Pagination from "../components/common/Pagination";
import ListPageToolbar from "../components/common/ListPageToolbar";
import PageHeader from "../components/common/PageHeader";
import EmptyState from "../components/common/EmptyState";
import ActionsMenu from "../components/common/ActionsMenu";
import ColumnPickerDialog from "../components/common/ColumnPickerDialog";
import SortableTableHeader from "../components/common/SortableTableHeader";
import { usePersistentColumns } from "../utils/usePersistentColumns";
import { useColumnSort } from "../utils/useColumnSort";
import { CheckCircle2, Plus, Search, ClipboardList } from "lucide-react";

function Badge({ tone = "slate", children }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    green: "bg-green-100 text-green-800",
    yellow: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-800",
    violet: "bg-violet-100 text-violet-800",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone] || tones.slate}`}>
      {children}
    </span>
  );
}

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  const datePart = dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  const hasTime = dt.getHours() !== 0 || dt.getMinutes() !== 0;
  if (!hasTime) return datePart;
  const timePart = dt.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return `${datePart} ${timePart}`;
}

function toDateInputValue(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function toDateTimeLocalInputValue(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "";
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  const hh = String(dt.getHours()).padStart(2, "0");
  const min = String(dt.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function parseDateInput(v) {
  if (!v) return null;
  const d = new Date(`${v}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function parseDateTimeLocalInput(v) {
  if (!v) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function TaskModal({ open, onOpenChange, mode, taskId, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("GENERAL");
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState("PENDING");
  const [dueDate, setDueDate] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderAt, setReminderAt] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [assignedEmployeeId, setAssignedEmployeeId] = useState("");
  const [clientId, setClientId] = useState("");
  const [address, setAddress] = useState("");
  const [createdByLabel, setCreatedByLabel] = useState("");

  const [isRecurring, setIsRecurring] = useState(false);
  const [recFrequency, setRecFrequency] = useState("WEEKLY");
  const [recIntervalValue, setRecIntervalValue] = useState("1");
  const [recStartDate, setRecStartDate] = useState("");
  const [recEndDate, setRecEndDate] = useState("");

  useEffect(() => {
    if (!open) return;

    setError(null);
    setLoading(true);

    Promise.all([
      api.listUsers({ page: 1, limit: 200, isActive: true }).then((r) => r?.data || []),
      api.listEmployees({ page: 1, limit: 200, isActive: true }).then((r) => r?.data || []),
      api.listCustomers({ page: 1, limit: 200 }).then((r) => r?.data || []),
      mode === "edit" && taskId ? api.getTask(taskId) : Promise.resolve(null),
    ])
      .then(([usersRes, employeesRes, customersRes, task]) => {
        setUsers(usersRes);
        setEmployees(employeesRes);
        setCustomers(customersRes);

        if (task) {
          setTitle(task.title || "");
          setDescription(task.description || "");
          setType(task.type || "GENERAL");
          setPriority(task.priority || "MEDIUM");
          setStatus(task.status || "PENDING");
          setDueDate(toDateTimeLocalInputValue(task.dueDate));
          setReminderEnabled(Boolean(task.reminderEnabled));
          setReminderAt(toDateTimeLocalInputValue(task.reminderAt));
          setAssignedUserId(task.assignedUserId || "");
          setAssignedEmployeeId(task.assignedEmployeeId || "");
          setClientId(task.clientId || "");
          setAddress(task.address || "");
          setCreatedByLabel(
            task.createdByUser
              ? `${task.createdByUser.firstName || ""} ${task.createdByUser.lastName || ""}`.trim() ||
                task.createdByUser.email ||
                ""
              : ""
          );

          const hasRec = Boolean(task.recurrenceId);
          setIsRecurring(hasRec);
          if (hasRec && task.recurrence) {
            setRecFrequency(task.recurrence.frequency || "WEEKLY");
            setRecIntervalValue(String(task.recurrence.intervalValue || 1));
            setRecStartDate(toDateInputValue(task.recurrence.startDate));
            setRecEndDate(toDateInputValue(task.recurrence.endDate));
          } else {
            setRecFrequency("WEEKLY");
            setRecIntervalValue("1");
            setRecStartDate("");
            setRecEndDate("");
          }
        } else {
          setTitle("");
          setDescription("");
          setType("GENERAL");
          setPriority("MEDIUM");
          setStatus("PENDING");
          setDueDate("");
          setReminderEnabled(false);
          setReminderAt("");
          setAssignedUserId("");
          setAssignedEmployeeId("");
          setClientId("");
          setAddress("");
          setCreatedByLabel("");
          setIsRecurring(false);
          setRecFrequency("WEEKLY");
          setRecIntervalValue("1");
          setRecStartDate("");
          setRecEndDate("");
        }
      })
      .catch((e) => setError(e.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, [open, mode, taskId]);

  const canSave = title.trim().length > 0 && !saving;

  async function save() {
    if (!canSave) return;

    setSaving(true);
    setError(null);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        priority,
        status,
        dueDate: dueDate ? parseDateTimeLocalInput(dueDate) : null,
        reminderEnabled,
        reminderAt: reminderAt ? parseDateTimeLocalInput(reminderAt) : null,
        assignedUserId: assignedUserId || null,
        assignedEmployeeId: assignedEmployeeId || null,
        clientId: clientId || null,
        address: address.trim() || null,
        isTemplate: Boolean(isRecurring),
      };

      if (isRecurring) {
        payload.recurrence = {
          frequency: recFrequency,
          intervalValue: Number(recIntervalValue || 1),
          startDate: recStartDate ? parseDateInput(recStartDate) : null,
          endDate: recEndDate ? parseDateInput(recEndDate) : null,
        };
      }

      if (payload.assignedUserId && payload.assignedEmployeeId) {
        throw new Error("Pick either a user or an employee (not both)");
      }

      if (mode === "edit" && taskId) {
        await api.updateTask(taskId, payload);
      } else {
        await api.createTask(payload);
      }

      onOpenChange(false);
      onSaved?.();
    } catch (e) {
      setError(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (saving) return;
        onOpenChange(v);
      }}
      title={mode === "edit" ? "Edit task" : "New task"}
      className="max-w-2xl"
    >
      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="py-10 text-sm text-slate-500">Loading…</div>
      ) : (
        <div className="space-y-5">
          {mode === "edit" && createdByLabel ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-xs text-slate-500">Created by</div>
              <div className="text-sm font-medium text-slate-800">{createdByLabel}</div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <div className="text-sm font-medium text-slate-700 mb-1">Title</div>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Send invoice reminder" />
            </div>
            <div className="sm:col-span-2">
              <div className="text-sm font-medium text-slate-700 mb-1">Description</div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                placeholder="Add context, links, steps…"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-slate-700 mb-1">Type</div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <option value="GENERAL">General</option>
                <option value="FINANCE">Finance</option>
                <option value="CLIENT">Client</option>
                <option value="PROJECT">Project</option>
                <option value="SUPPORT">Support</option>
              </select>
            </div>

            <div>
              <div className="text-sm font-medium text-slate-700 mb-1">Priority</div>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div>
              <div className="text-sm font-medium text-slate-700 mb-1">Status</div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <div className="text-sm font-medium text-slate-700 mb-1">Due date</div>
              <Input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>

            <div>
              <div className="text-sm font-medium text-slate-700 mb-1">Assign to user</div>
              <select
                value={assignedUserId}
                onChange={(e) => {
                  setAssignedUserId(e.target.value);
                  if (e.target.value) setAssignedEmployeeId("");
                }}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.firstName} {u.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="text-sm font-medium text-slate-700 mb-1">Assign to employee</div>
              <select
                value={assignedEmployeeId}
                onChange={(e) => {
                  setAssignedEmployeeId(e.target.value);
                  if (e.target.value) setAssignedUserId("");
                }}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <option value="">Unassigned</option>
                {employees.map((em) => (
                  <option key={em.id} value={em.id}>
                    {em.firstName} {em.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="text-sm font-medium text-slate-700 mb-1">Customer</div>
              <select
                value={clientId}
                onChange={(e) => {
                  const nextId = e.target.value;
                  setClientId(nextId);
                  if (nextId) {
                    api.getClient(nextId).then((c) => {
                      const parts = [c?.address, c?.city, c?.state, c?.country, c?.postalCode].filter(Boolean);
                      setAddress(parts.join(", "));
                    }).catch(() => setAddress(""));
                  } else {
                    setAddress("");
                  }
                }}
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <option value="">None</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName || c.contactName || c.email || c.id}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <div className="text-sm font-medium text-slate-700 mb-1">Address</div>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Task location (auto-fills from customer)"
                className="h-10"
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">Reminders</div>
                <div className="text-xs text-slate-600">Schedule a reminder for the assigned user.</div>
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                />
                Enabled
              </label>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="text-sm font-medium text-slate-700 mb-1">Reminder at</div>
                <Input
                  type="datetime-local"
                  value={reminderAt}
                  onChange={(e) => setReminderAt(e.target.value)}
                  disabled={!reminderEnabled}
                />
              </div>
              <div className="text-xs text-slate-600 self-end">
                Reminder notifications are created for assigned users only.
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">Recurring</div>
                <div className="text-xs text-slate-600">Create a template that generates tasks automatically.</div>
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                />
                Enabled
              </label>
            </div>

            {isRecurring ? (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-1">Frequency</div>
                  <select
                    value={recFrequency}
                    onChange={(e) => setRecFrequency(e.target.value)}
                    className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="BI_WEEKLY">Bi-weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-1">Interval</div>
                  <Input
                    type="number"
                    min={1}
                    value={recIntervalValue}
                    onChange={(e) => setRecIntervalValue(e.target.value)}
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-1">Start date</div>
                  <Input type="date" value={recStartDate} onChange={(e) => setRecStartDate(e.target.value)} />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-1">End date (optional)</div>
                  <Input type="date" value={recEndDate} onChange={(e) => setRecEndDate(e.target.value)} />
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={save} disabled={!canSave} className="bg-violet-600 hover:bg-violet-700">
              {saving ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}

export default function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const status = searchParams.get("status") || "";
  const priority = searchParams.get("priority") || "";
  const type = searchParams.get("type") || "";
  const overdue = searchParams.get("overdue") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const [columnsOpen, setColumnsOpen] = useState(false);

  const requiredColumnKeys = new Set(["task"]);
  const columnDefs = [
    { key: "task", label: "Task" },
    { key: "due", label: "Due" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
  ];
  const columnOrder = columnDefs.map((c) => c.key);
  const defaultVisibleColumns = ["task", "due", "priority", "status"];

  const [visibleColumns, setVisibleColumns, resetVisibleColumns] = usePersistentColumns({
    storageKey: "ba_tasks_visible_columns",
    columnOrder,
    defaultVisibleColumns,
    requiredKeys: Array.from(requiredColumnKeys),
  });

  const sortColumnDefs = columnDefs.map((c) => ({
    ...c,
    getValue:
      c.key === "task" ? (r) => r?.title || ""
      : c.key === "due" ? (r) => r?.dueDate || ""
      : undefined,
  }));
  const { sortKey, sortDir, toggleSort, sortRows } = useColumnSort(sortColumnDefs);

  const editParam = searchParams.get("edit");

  const tasks = data?.data || [];
  const meta = data?.meta || { total: 0, page, limit: 20 };

  const load = useCallback(() => {
    setLoading(true);
    setError(null);

    const params = { page, limit: 20 };
    if (q) params.q = q;
    if (status) params.status = status;
    if (priority) params.priority = priority;
    if (type) params.type = type;
    if (overdue !== "") params.overdue = overdue;

    api
      .listTasks(params)
      .then(setData)
      .catch((e) => setError(e.message || "Failed to load tasks"))
      .finally(() => setLoading(false));
  }, [q, status, priority, type, overdue, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!editParam) return;
    setModalMode("edit");
    setEditingId(editParam);
    setModalOpen(true);
  }, [editParam]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value == null || value === "") next.delete(key);
    else next.set(key, String(value));
    next.delete("page");
    setSearchParams(next, { replace: true });
  }

  function setPage(p) {
    const next = new URLSearchParams(searchParams);
    if (p <= 1) next.delete("page");
    else next.set("page", String(p));
    setSearchParams(next, { replace: true });
  }

  function openCreate() {
    setModalMode("create");
    setEditingId(null);
    setModalOpen(true);

    const next = new URLSearchParams(searchParams);
    next.delete("edit");
    setSearchParams(next, { replace: true });
  }

  function openEdit(id) {
    try {
      addDismissedTask(id);
    } catch {
      // ignore
    }
    setModalMode("edit");
    setEditingId(id);
    setModalOpen(true);

    const next = new URLSearchParams(searchParams);
    next.set("edit", String(id));
    setSearchParams(next, { replace: true });
  }

  async function quickComplete(task) {
    if (!task?.id) return;
    setError(null);
    try {
      const comment = window.prompt("Completion comment (optional)", "");
      await api.completeTask(task.id, { comment: comment || null });
      load();
    } catch (e) {
      setError(e.message || "Failed to complete task");
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    setError(null);
    try {
      await api.deleteTask(task.id);
      load();
    } catch (e) {
      setError(e.message || "Failed to delete task");
    }
  }

  const emptyState = useMemo(() => {
    if (loading) return null;
    if (tasks.length > 0) return null;
    if (q || status || priority || type || overdue) {
      return {
        title: "No matching tasks",
        subtitle: "Try adjusting your filters.",
      };
    }
    return {
      title: "No tasks yet",
      subtitle: "Create tasks to stay on top of client work and deadlines.",
    };
  }, [loading, tasks.length, q, status, priority, type, overdue]);

  function priorityTone(p) {
    if (p === "CRITICAL") return "red";
    if (p === "HIGH") return "yellow";
    if (p === "MEDIUM") return "violet";
    return "slate";
  }

  function statusTone(s) {
    if (s === "COMPLETED") return "green";
    if (s === "CANCELLED") return "slate";
    if (s === "IN_PROGRESS") return "violet";
    return "yellow";
  }

  return (
    <div className="space-y-6 min-h-screen">
      <TaskModal
        open={modalOpen}
        onOpenChange={(v) => {
          setModalOpen(v);
          if (!v) {
            const next = new URLSearchParams(searchParams);
            next.delete("edit");
            setSearchParams(next, { replace: true });
          }
        }}
        mode={modalMode}
        taskId={editingId}
        onSaved={load}
      />

      <PageHeader
        title="Tasks"
        subtitle="Track work, deadlines, and follow-ups"
        icon={<ClipboardList className="h-5 w-5 text-violet-600" />}
        actions={
          <>
            <select value={status} onChange={(e) => updateParam("status", e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-600">
              <option value="">All status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <select value={priority} onChange={(e) => updateParam("priority", e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-600">
              <option value="">All priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
            <select value={type} onChange={(e) => updateParam("type", e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[13px] text-slate-600">
              <option value="">All types</option>
              <option value="GENERAL">General</option>
              <option value="FINANCE">Finance</option>
              <option value="CLIENT">Client</option>
              <option value="PROJECT">Project</option>
              <option value="SUPPORT">Support</option>
            </select>
            <Button onClick={openCreate} className="h-9 shrink-0">
              <Plus className="h-4 w-4 mr-1.5" />
              New Task
            </Button>
          </>
        }
      />

      <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4">
            {error ? (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            <ListPageToolbar
              searchValue={q}
              onSearchChange={(v) => updateParam("q", v)}
              searchPlaceholder="Search tasks\u2026"
              onColumnsClick={() => setColumnsOpen(true)}
            />
          </div>

          <div className="overflow-auto">
            <table className="min-w-max w-full text-[13px]">
              <thead className="text-left bg-slate-50/80">
                <tr className="border-y border-slate-200/80">
                  {visibleColumns.includes("task") ? <SortableTableHeader label="Task" columnKey="task" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} /> : null}
                  {visibleColumns.includes("due") ? <SortableTableHeader label="Due" columnKey="due" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" /> : null}
                  {visibleColumns.includes("priority") ? <SortableTableHeader label="Priority" columnKey="priority" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" /> : null}
                  {visibleColumns.includes("status") ? <SortableTableHeader label="Status" columnKey="status" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} className="hidden sm:table-cell" /> : null}
                  <th className="hidden sm:table-cell py-2.5 px-3 whitespace-nowrap text-xs font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortRows(tasks).map((t) => {
                  const isOverdue = t.dueDate && new Date(t.dueDate) < new Date() && (t.status === "PENDING" || t.status === "IN_PROGRESS");
                  const assignee = t.assignedEmployee
                    ? `${t.assignedEmployee.firstName} ${t.assignedEmployee.lastName}`
                    : t.assignedUser
                      ? `${t.assignedUser.firstName} ${t.assignedUser.lastName}`
                      : null;
                  const creator = t.createdByUser
                    ? `${t.createdByUser.firstName || ""} ${t.createdByUser.lastName || ""}`.trim() || t.createdByUser.email || null
                    : null;

                  return (
                    <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors cursor-pointer" onClick={() => openEdit(t.id)}>
                      {visibleColumns.includes("task") ? (
                        <td className="py-2.5 px-3 min-w-[280px]">
                          <div className="flex items-start gap-2">
                            <button type="button" className="mt-0.5 text-slate-400 hover:text-green-600" title={t.status === "COMPLETED" ? "Completed" : "Mark complete"} onClick={(e) => { e.stopPropagation(); quickComplete(t); }} disabled={t.status === "COMPLETED"}>
                              <CheckCircle2 className={`h-4 w-4 ${t.status === "COMPLETED" ? "text-green-600" : ""}`} />
                            </button>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-900 leading-5">{t.title}</span>
                                {t.isTemplate ? <Badge tone="violet">Template</Badge> : null}
                                {isOverdue ? <Badge tone="red">Overdue</Badge> : null}
                              </div>
                              <div className="text-xs text-slate-400 truncate max-w-[400px] mt-0.5">
                                {assignee ? `Assigned to ${assignee}` : "Unassigned"}
                                {creator ? ` \u2022 Created by ${creator}` : ""}
                              </div>
                            </div>
                          </div>
                        </td>
                      ) : null}
                      {visibleColumns.includes("due") ? <td className="hidden sm:table-cell py-2.5 px-3 text-slate-500 whitespace-nowrap">{formatDate(t.dueDate)}</td> : null}
                      {visibleColumns.includes("priority") ? <td className="hidden sm:table-cell py-2.5 px-3"><Badge tone={priorityTone(t.priority)}>{t.priority}</Badge></td> : null}
                      {visibleColumns.includes("status") ? <td className="hidden sm:table-cell py-2.5 px-3"><Badge tone={statusTone(t.status)}>{t.status}</Badge></td> : null}
                      <td className="hidden sm:table-cell py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <ActionsMenu
                          ariaLabel="Task actions"
                          items={[
                            { key: "edit", label: "Edit", onSelect: () => openEdit(t.id) },
                            { key: "complete", label: "Mark complete", disabled: t.status === "COMPLETED", onSelect: () => quickComplete(t) },
                            { key: "delete", label: "Delete", tone: "danger", onSelect: () => handleDelete(t) },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!loading && tasks.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title={q || status || priority || type || overdue ? "No matching tasks" : "No tasks yet"}
                description={q || status || priority || type || overdue ? "Try adjusting your filters" : "Create tasks to stay on top of client work and deadlines"}
                action={
                  !(q || status || priority || type || overdue) ? (
                    <Button onClick={openCreate} className="h-9">
                      <Plus className="h-4 w-4 mr-1.5" />
                      New Task
                    </Button>
                  ) : null
                }
              />
            ) : null}

            {meta?.total > 0 ? (
              <Pagination page={meta.page} limit={meta.limit} total={meta.total} onPageChange={setPage} />
            ) : null}
          </div>
        </CardContent>
      </Card>

      <ColumnPickerDialog
        open={columnsOpen}
        onOpenChange={setColumnsOpen}
        columnDefs={columnDefs}
        visibleColumns={visibleColumns}
        requiredColumnKeys={requiredColumnKeys}
        onToggle={(key) => {
          setVisibleColumns((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
          );
        }}
        onReset={resetVisibleColumns}
      />
    </div>
  );
}

import React, { useMemo } from "react";
import { Lock } from "lucide-react";

export default function PermissionMatrix({
  modules,
  selectedIds,
  onToggle,
  onToggleModule,
  disabled = false,
}) {
  const byModule = useMemo(() => {
    const map = {};
    for (const { module, permissions } of modules) {
      map[module] = permissions;
    }
    return map;
  }, [modules]);

  const moduleLabels = useMemo(() => {
    const labels = {
      invoices: "Invoices",
      quotes: "Quotes",
      banking: "Banking",
      payments: "Payments",
      ledger: "Ledger",
      clients: "Clients",
      products: "Products",
      bills: "Bills",
      suppliers: "Suppliers",
      reports: "Reports",
      settings: "Settings",
      users: "Users",
      roles: "Roles",
      tasks: "Tasks",
      expenses: "Expenses",
      statements: "Statements",
    };
    return labels;
  }, []);

  const actionLabels = {
    view: "View",
    create: "Create",
    edit: "Edit",
    delete: "Delete",
    approve: "Approve",
    send: "Send",
    reconcile: "Reconcile",
    import: "Import",
    void: "Void",
    post: "Post",
    reverse: "Reverse",
    export: "Export",
    manage: "Manage",
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-[640px] w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            <th className="px-4 py-3 text-left font-medium text-slate-700">Permission</th>
            <th className="px-4 py-3 text-center font-medium text-slate-600 w-20">Allow</th>
          </tr>
        </thead>
        <tbody>
          {modules.map(({ module: mod, permissions }) => (
            <React.Fragment key={mod}>
              <tr className="border-t border-slate-200 bg-slate-50/50">
                <td colSpan={2} className="px-4 py-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800">
                      {moduleLabels[mod] || mod}
                    </span>
                    {!disabled && (
                      <button
                        type="button"
                        className="text-xs text-violet-600 hover:text-violet-700"
                        onClick={() => onToggleModule(mod, permissions)}
                      >
                        Toggle all
                      </button>
                    )}
                  </div>
                </td>
              </tr>
              {permissions.map((p) => {
                const checked = selectedIds.includes(p.id);
                const action = p.key.split(".")[1] || "";
                const label = actionLabels[action] || action;
                return (
                  <tr
                    key={p.id}
                    className="border-t border-slate-100 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-2 pl-8 text-slate-700">
                      {label}
                      {p.description ? (
                        <span className="ml-2 text-xs text-slate-400">({p.description})</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggle(p.id)}
                        disabled={disabled}
                        className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

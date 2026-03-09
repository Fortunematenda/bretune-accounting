import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Dialog from "../ui/dialog";
import Input from "../ui/input";
import Button from "../ui/button";

export default function ColumnPickerDialog({
  open,
  onOpenChange,
  columnDefs,
  visibleColumns,
  setVisibleColumns,
  requiredKeys,
  columnOrder,
  defaultVisibleColumns,
  onReset,
}) {
  const [filter, setFilter] = useState("");

  const required = useMemo(() => {
    if (requiredKeys instanceof Set) return requiredKeys;
    return new Set(Array.isArray(requiredKeys) ? requiredKeys : []);
  }, [requiredKeys]);

  const defs = Array.isArray(columnDefs) ? columnDefs : [];

  const filtered = useMemo(() => {
    const s = String(filter || "").trim().toLowerCase();
    if (!s) return defs;
    return defs.filter((c) => String(c.label || "").toLowerCase().includes(s));
  }, [defs, filter]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Show/Hide columns">
      <div className="space-y-4">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Drag & drop fields to change the column order
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-500">Filter</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Type to search" />
          </div>
        </div>

        <div className="max-h-[360px] overflow-auto rounded-lg border border-slate-200">
          <div className="divide-y divide-slate-100">
            {filtered.map((col) => {
              const checked = Array.isArray(visibleColumns) && visibleColumns.includes(col.key);
              const disabled = required.has(col.key);

              return (
                <div key={col.key} className="flex items-center justify-between gap-3 px-3 py-2">
                  <div className={disabled ? "text-sm text-slate-500" : "text-sm text-slate-800"}>{col.label}</div>
                  <button
                    type="button"
                    className={
                      "relative h-5 w-9 rounded-full transition " +
                      (checked ? "bg-sky-600" : "bg-slate-200") +
                      (disabled ? " opacity-60" : "")
                    }
                    onClick={() => {
                      if (disabled) return;
                      setVisibleColumns((prev) => {
                        const p = Array.isArray(prev) ? prev : [];
                        const next = p.includes(col.key) ? p.filter((k) => k !== col.key) : [...p, col.key];
                        const ordered = (Array.isArray(columnOrder) ? columnOrder : []).filter((k) => next.includes(k));
                        for (const k of required) {
                          if (!ordered.includes(k)) ordered.unshift(k);
                        }
                        return ordered;
                      });
                    }}
                    aria-pressed={checked}
                    aria-label={`Toggle ${col.label}`}
                  >
                    <span
                      className={
                        "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition " + (checked ? "left-4" : "left-0.5")
                      }
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (typeof onReset === "function") onReset();
              else setVisibleColumns(defaultVisibleColumns);
            }}
          >
            Reset
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={() => onOpenChange(false)}>Save</Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

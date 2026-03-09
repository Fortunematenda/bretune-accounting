import React from "react";
import Input from "../ui/input";
import Select from "../ui/select";

const STATUS_OPTIONS = [
  { value: "", label: "All status" },
  { value: "DRAFT", label: "Draft" },
  { value: "APPROVED", label: "Approved" },
  { value: "REIMBURSED", label: "Reimbursed" },
];

export default function ExpenseFilters({
  status,
  supplierId,
  categoryId,
  from,
  to,
  suppliers,
  categories,
  onChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input type="date" value={from} onChange={(e) => onChange?.({ from: e.target.value })} className="h-9 w-40" />
      <Input type="date" value={to} onChange={(e) => onChange?.({ to: e.target.value })} className="h-9 w-40" />

      <Select value={supplierId} onChange={(e) => onChange?.({ supplierId: e.target.value })} className="h-9 w-52">
        <option value="">All suppliers</option>
        {(suppliers || []).map((s) => (
          <option key={s.id} value={s.id}>
            {s.supplierName || "—"}
          </option>
        ))}
      </Select>

      <Select value={categoryId} onChange={(e) => onChange?.({ categoryId: e.target.value })} className="h-9 w-52">
        <option value="">All categories</option>
        {(categories || []).map((c) => (
          <option key={c.id} value={c.id}>
            {c.name || "—"}
          </option>
        ))}
      </Select>

      <Select value={status} onChange={(e) => onChange?.({ status: e.target.value })} className="h-9 w-48">
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

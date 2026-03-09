import React, { useMemo } from "react";
import ActionsMenu from "../../../components/common/ActionsMenu";
import Money from "../../../components/common/money";
import SortableTableHeader from "../../../components/common/SortableTableHeader";

function statusBadgeClass(s) {
  const v = String(s || "").toUpperCase();
  if (v === "ACTIVE") return "inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800";
  if (v === "INACTIVE") return "inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700";
  return "inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700";
}

function displayName(s) {
  return s?.supplierName || s?.name || s?.companyName || s?.contactPerson || "—";
}

function companyOrContact(s) {
  const a = s?.companyName || "";
  const b = s?.contactPerson || s?.contactName || "";
  if (a && b && String(a) !== String(b)) return `${a} / ${b}`;
  return a || b || "—";
}

function outstandingValue(s) {
  const candidates = [
    s?.outstandingAmount,
    s?.outstandingBillsAmount,
    s?.outstandingBills,
    s?.balanceDue,
    s?.balance,
  ];
  for (const c of candidates) {
    const n = Number(c);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function SkeletonRow() {
  return (
    <tr className="border-t border-slate-100">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="py-3 px-3">
          <div className="h-4 w-full max-w-[180px] rounded bg-slate-100 animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export default function SuppliersTable({ rows, loading, onRowClick, onView, onEdit, onDelete, sortKey, sortDir, onSort }) {
  const normalizedRows = useMemo(() => Array.isArray(rows) ? rows : [], [rows]);

  return (
    <div className="overflow-auto">
      <table className="min-w-max w-full text-sm">
        <thead className="text-left text-slate-500 bg-slate-50">
          <tr className="border-b border-slate-200">
            {onSort ? (
              <>
                <SortableTableHeader label="Supplier Name" columnKey="supplierName" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                <SortableTableHeader label="Company / Contact" columnKey="companyContact" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                <SortableTableHeader label="Email" columnKey="email" sortKey={sortKey} sortDir={sortDir} onSort={onSort} className="hidden md:table-cell" />
                <SortableTableHeader label="Phone" columnKey="phone" sortKey={sortKey} sortDir={sortDir} onSort={onSort} className="hidden md:table-cell" />
                <SortableTableHeader label="Outstanding Bills" columnKey="outstandingBills" sortKey={sortKey} sortDir={sortDir} onSort={onSort} align="right" />
                <SortableTableHeader label="Status" columnKey="status" sortKey={sortKey} sortDir={sortDir} onSort={onSort} />
                <th className="py-3 px-3 whitespace-nowrap text-right">Actions</th>
              </>
            ) : (
              <>
                <th className="py-3 px-3 whitespace-nowrap">Supplier Name</th>
                <th className="py-3 px-3 whitespace-nowrap">Company / Contact</th>
                <th className="hidden md:table-cell py-3 px-3 whitespace-nowrap">Email</th>
                <th className="hidden md:table-cell py-3 px-3 whitespace-nowrap">Phone</th>
                <th className="py-3 px-3 whitespace-nowrap text-right">Outstanding Bills</th>
                <th className="py-3 px-3 whitespace-nowrap">Status</th>
                <th className="py-3 px-3 whitespace-nowrap text-right">Actions</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          ) : (
            normalizedRows.map((s) => {
              const outstanding = outstandingValue(s);

              return (
                <tr
                  key={s.id}
                  className="border-t border-slate-100 cursor-pointer hover:bg-slate-50"
                  onClick={() => onRowClick?.(s)}
                >
                  <td className="py-3 px-3 min-w-[240px]">
                    <div className="font-medium text-slate-900 leading-6">{displayName(s)}</div>
                    {s?.supplierNo || s?.supplierSeq ? (
                      <div className="text-xs text-slate-500 font-mono">{String(s.supplierNo || s.supplierSeq)}</div>
                    ) : null}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">{companyOrContact(s)}</td>
                  <td className="hidden md:table-cell py-3 px-3 whitespace-nowrap">{s.email || "—"}</td>
                  <td className="hidden md:table-cell py-3 px-3 whitespace-nowrap">{s.phone || "—"}</td>
                  <td className="py-3 px-3 whitespace-nowrap text-right">
                    {outstanding == null ? "—" : <Money value={outstanding} />}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={statusBadgeClass(s.status)}>{String(s.status || "—")}</span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                    <ActionsMenu
                      ariaLabel="Supplier actions"
                      items={[
                        {
                          key: "view",
                          label: "View",
                          onSelect: () => onView?.(s),
                        },
                        {
                          key: "edit",
                          label: "Edit",
                          onSelect: () => onEdit?.(s),
                        },
                        {
                          key: "delete",
                          label: "Delete",
                          tone: "danger",
                          onSelect: () => onDelete?.(s),
                        },
                      ]}
                    />
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

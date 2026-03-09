import React from "react";
import { useNavigate } from "react-router-dom";
import Money from "../common/money";
import BillStatusBadge from "./BillStatusBadge";
import { formatDateForDisplay } from "../../lib/dateFormat";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import ActionsMenu from "../common/ActionsMenu";

function formatBillDisplayNumber(bill) {
  if (!bill) return "—";
  if (bill.reference) return String(bill.reference);
  const n = Number(bill.billNumber);
  if (!Number.isFinite(n) || n <= 0) return "—";
  return `BILL-${String(n).padStart(4, "0")}`;
}

export default function BillTable({ rows, onDelete }) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Bill Number</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Issue Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(rows || []).map((b) => {
          const due = b?.dueDate ? new Date(b.dueDate) : null;
          const overdue = b?.status === "OPEN" && due && !Number.isNaN(due.getTime()) && due < new Date();

          return (
            <TableRow
              key={b.id}
              className={overdue ? "border-l-4 border-l-red-300" : "border-l-4 border-l-transparent"}
            >
              <TableCell className="font-mono text-xs text-slate-700 dark:text-slate-200">
                {formatBillDisplayNumber(b)}
              </TableCell>
              <TableCell className="font-medium text-slate-900 dark:text-slate-100">{b.vendorName || "—"}</TableCell>
              <TableCell className="text-slate-600 dark:text-slate-300">{formatDateForDisplay(b.billDate)}</TableCell>
              <TableCell className="text-slate-600 dark:text-slate-300">{formatDateForDisplay(b.dueDate)}</TableCell>
              <TableCell className="text-right text-slate-900 dark:text-slate-100">
                <Money value={b.totalAmount} />
              </TableCell>
              <TableCell>
                <BillStatusBadge status={b.status} overdue={overdue} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <ActionsMenu
                    ariaLabel="Bill actions"
                    items={[
                      { key: "view", label: "View", onSelect: () => navigate(`/bills/${b.id}`) },
                      { key: "edit", label: "Edit", onSelect: () => navigate(`/bills/${b.id}/edit`) },
                      { key: "delete", label: "Delete", tone: "danger", onSelect: () => onDelete?.(b) },
                    ]}
                  />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

import React from "react";
import { useNavigate } from "react-router-dom";
import Money from "../common/money";
import ExpenseStatusBadge from "./ExpenseStatusBadge";
import { formatDateForDisplay } from "../../lib/dateFormat";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import ActionsMenu from "../common/ActionsMenu";

export default function ExpenseTable({ rows, suppliersById, categoriesById, onDelete }) {
  const navigate = useNavigate();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(rows || []).map((e) => {
          const supplierName = e?.supplierName || suppliersById?.[e?.supplierId]?.supplierName || "—";
          const categoryName = e?.categoryName || categoriesById?.[e?.categoryId]?.name || "—";

          return (
            <TableRow key={e.id}>
              <TableCell className="text-slate-600 dark:text-slate-300">{formatDateForDisplay(e.expenseDate || e.date)}</TableCell>
              <TableCell className="font-medium text-slate-900 dark:text-slate-100">{e.description || "—"}</TableCell>
              <TableCell className="text-slate-600 dark:text-slate-300">{supplierName}</TableCell>
              <TableCell className="text-slate-600 dark:text-slate-300">{categoryName}</TableCell>
              <TableCell className="text-right text-slate-900 dark:text-slate-100">
                <Money value={e.totalAmount ?? e.amount} />
              </TableCell>
              <TableCell>
                <ExpenseStatusBadge status={e.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <ActionsMenu
                    ariaLabel="Expense actions"
                    items={[
                      { key: "view", label: "View", onSelect: () => navigate(`/expenses/${e.id}`) },
                      { key: "edit", label: "Edit", onSelect: () => navigate(`/expenses/${e.id}/edit`) },
                      { key: "delete", label: "Delete", tone: "danger", onSelect: () => onDelete?.(e) },
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

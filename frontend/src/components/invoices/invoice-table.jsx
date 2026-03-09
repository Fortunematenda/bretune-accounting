import React from "react";
import { useNavigate } from "react-router-dom";
import Money from "../common/money";
import { formatDateForDisplay } from "../../lib/dateFormat";
import { formatRecordDisplayId } from "../../lib/utils";
import InvoiceStatusBadge from "./invoice-status-badge";
import InvoiceActionsMenu from "./InvoiceActionsMenu";
import SortableTableHeader from "../common/SortableTableHeader";

function formatCustomerName(c) {
  if (!c) return "—";
  return c.companyName || c.contactName || "—";
}

export default function InvoiceTable({ rows, onViewPdf, onSend, onEdit, onAddToRecurring, visibleColumns, sortKey, sortDir, onSort, page = 1, limit = 20, selectedIds = [], onToggleSelect, onToggleSelectAll }) {
  const navigate = useNavigate();
  const handleEdit = onEdit || ((inv) => navigate(`/invoices/${inv.id}/edit`));

  const cols = Array.isArray(visibleColumns) && visibleColumns.length > 0 ? visibleColumns : [
    "id",
    "customer",
    "status",
    "issueDate",
    "dueDate",
    "totalAmount",
    "balanceDue",
  ];

  const sortProps = onSort ? { sortKey, sortDir, onSort } : {};
  const selectedSet = new Set(selectedIds || []);
  const selectableRows = (rows || []).map((r) => r.id);
  const allSelected = selectableRows.length > 0 && selectableRows.every((id) => selectedSet.has(id));

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead className="text-left text-slate-500 bg-slate-50">
          <tr>
            {typeof onToggleSelectAll === "function" ? (
              <th className="py-2 pr-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => onToggleSelectAll(selectableRows)}
                  aria-label="Select all invoices"
                />
              </th>
            ) : null}
            {cols.includes("id") ? (onSort ? <SortableTableHeader label="Invoice ID" columnKey="id" {...sortProps} /> : <th className="py-2">Invoice ID</th>) : null}
            {cols.includes("customer") ? (onSort ? <SortableTableHeader label="Customer" columnKey="customer" {...sortProps} /> : <th className="py-2">Customer</th>) : null}
            {cols.includes("status") ? (onSort ? <SortableTableHeader label="Status" columnKey="status" {...sortProps} /> : <th className="py-2">Status</th>) : null}
            {cols.includes("issueDate") ? (onSort ? <SortableTableHeader label="Issue" columnKey="issueDate" {...sortProps} /> : <th className="py-2">Issue</th>) : null}
            {cols.includes("dueDate") ? (onSort ? <SortableTableHeader label="Due" columnKey="dueDate" {...sortProps} /> : <th className="py-2">Due</th>) : null}
            {cols.includes("totalAmount") ? (onSort ? <SortableTableHeader label="Total" columnKey="totalAmount" align="right" {...sortProps} /> : <th className="py-2 text-right">Total</th>) : null}
            {cols.includes("balanceDue") ? (onSort ? <SortableTableHeader label="Balance" columnKey="balanceDue" align="right" {...sortProps} /> : <th className="py-2 text-right">Balance</th>) : null}
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {(rows || []).map((i) => (
            <tr
              key={i.id}
              className="border-t border-slate-100 cursor-pointer hover:bg-violet-50/50 transition-colors"
              onClick={() => navigate(`/invoices/${i.id}/edit`)}
            >
              {typeof onToggleSelect === "function" ? (
                <td className="py-2 pr-3 w-10" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedSet.has(i.id)}
                    onChange={() => onToggleSelect(i.id)}
                    aria-label={`Select invoice ${i.invoiceNumber || i.id}`}
                  />
                </td>
              ) : null}
              {cols.includes("id") ? (
                <td className="py-2 font-mono text-xs text-violet-600 font-medium" title={i.id}>
                  {formatRecordDisplayId(i)}
                </td>
              ) : null}
              {cols.includes("customer") ? <td className="py-2 text-slate-800">{formatCustomerName(i.client)}</td> : null}
              {cols.includes("status") ? (
                <td className="py-2">
                  <InvoiceStatusBadge status={i.status} />
                </td>
              ) : null}
              {cols.includes("issueDate") ? <td className="py-2">{formatDateForDisplay(i.issueDate)}</td> : null}
              {cols.includes("dueDate") ? <td className="py-2">{formatDateForDisplay(i.dueDate)}</td> : null}
              {cols.includes("totalAmount") ? (
                <td className="py-2 text-right">
                  <Money value={i.totalAmount} />
                </td>
              ) : null}
              {cols.includes("balanceDue") ? (
                <td className="py-2 text-right">
                  <Money value={i.balanceDue} />
                </td>
              ) : null}
              <td className="py-2 text-right" onClick={(e) => e.stopPropagation()}>
                <InvoiceActionsMenu
                  invoice={i}
                  onEdit={handleEdit}
                  onPreviewPdf={onViewPdf}
                  onSendInvoice={onSend}
                  onRecordPayment={() => navigate(`/payments?invoiceId=${i.id}&clientId=${i.clientId || ""}&new=1`)}
                  onCreateCreditNote={() => {
                    navigate(`/invoices/${i.id}/credit-note`);
                  }}
                  onAddToRecurring={onAddToRecurring}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

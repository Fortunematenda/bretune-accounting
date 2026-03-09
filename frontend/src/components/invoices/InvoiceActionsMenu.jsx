import React, { useMemo } from "react";
import ActionsMenu from "../common/ActionsMenu";

export default function InvoiceActionsMenu({
  invoice,
  onView,
  onEdit,
  onPreviewPdf,
  onSendInvoice,
  onRecordPayment,
  onCreateCreditNote,
  onAddToRecurring,
  onWriteOff,
}) {
  const status = String(invoice?.status || "").toUpperCase();
  const canSend = status === "DRAFT";
  const canCredit = !["DRAFT", "CANCELLED"].includes(status) && Number(invoice?.balanceDue || 0) > 0;

  const items = useMemo(() => {
    const base = [
      {
        key: "edit",
        label: "Edit",
        onSelect: () => (onEdit || onView)?.(invoice),
        tone: "default",
        hidden: typeof onEdit !== "function" && typeof onView !== "function",
      },
      {
        key: "preview_pdf",
        label: "Preview PDF",
        onSelect: () => onPreviewPdf?.(invoice),
        tone: "default",
        hidden: typeof onPreviewPdf !== "function",
        disabled: false,
      },
      {
        key: "send",
        label: "Send Invoice",
        onSelect: () => onSendInvoice?.(invoice),
        tone: "default",
        hidden: false,
        disabled: !canSend,
        hint: !canSend ? "Only draft invoices can be sent" : "",
      },
      {
        key: "payment",
        label: "Record Payment",
        onSelect: () => onRecordPayment?.(invoice),
        tone: "default",
        hidden: false,
        disabled: false,
      },
      {
        key: "credit",
        label: "Create Credit Note",
        onSelect: () => onCreateCreditNote?.(invoice),
        tone: "default",
        hidden: false,
        disabled: false,
        hint: !canCredit ? "Invoice must have an outstanding balance to credit" : "",
      },
      {
        key: "recurring",
        label: "Add to recurring",
        onSelect: () => onAddToRecurring?.(invoice),
        tone: "default",
        hidden: typeof onAddToRecurring !== "function",
      },
      {
        key: "writeoff",
        label: "Write Off",
        onSelect: () => onWriteOff?.(invoice),
        tone: "danger",
        hidden: typeof onWriteOff !== "function",
        disabled: false,
      },
    ];

    return base.filter((i) => !i.hidden);
  }, [invoice, onView, onEdit, onPreviewPdf, onSendInvoice, onRecordPayment, onCreateCreditNote, onAddToRecurring, onWriteOff, canSend, canCredit]);

  return (
    <ActionsMenu
      ariaLabel="Invoice actions"
      menuWidthClassName="w-52"
      items={items}
    />
  );
}

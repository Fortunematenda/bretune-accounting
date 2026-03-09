import React, { useMemo } from "react";
import ActionsMenu from "../common/ActionsMenu";

export default function InvoiceRowActions({ invoice, onViewPdf, onSend, onCancel }) {
  const items = useMemo(() => {
    return [
      {
        key: "view",
        label: "View PDF",
        onSelect: () => onViewPdf?.(invoice),
        tone: "default",
        disabled: false,
      },
      {
        key: "send",
        label: "Send",
        onSelect: () => onSend?.(invoice),
        tone: "default",
        disabled: false,
      },
      {
        key: "cancel",
        label: "Cancel",
        onSelect: () => onCancel?.(invoice),
        tone: "danger",
        disabled: false,
      },
    ];
  }, [invoice, onViewPdf, onSend, onCancel]);

  return (
    <ActionsMenu ariaLabel="Invoice actions" items={items} />
  );
}

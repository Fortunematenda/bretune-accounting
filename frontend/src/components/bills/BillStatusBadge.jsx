import React from "react";
import Badge from "../ui/badge";

export default function BillStatusBadge({ status, overdue = false }) {
  const s = String(status || "").toUpperCase();

  if (overdue && s === "OPEN") {
    return <Badge variant="destructive">OVERDUE</Badge>;
  }

  if (s === "DRAFT") return <Badge>Draft</Badge>;
  if (s === "OPEN") return <Badge variant="secondary">Awaiting Payment</Badge>;
  if (s === "PAID") return <Badge variant="success">Paid</Badge>;
  if (s === "CANCELLED") return <Badge variant="outline">Cancelled</Badge>;

  return <Badge>{s || "—"}</Badge>;
}

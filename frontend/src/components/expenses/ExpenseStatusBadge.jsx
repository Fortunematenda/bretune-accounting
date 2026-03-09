import React from "react";
import Badge from "../ui/badge";

export default function ExpenseStatusBadge({ status }) {
  const s = String(status || "").toUpperCase();
  if (s === "DRAFT") return <Badge>Draft</Badge>;
  if (s === "APPROVED") return <Badge variant="secondary">Approved</Badge>;
  if (s === "REIMBURSED") return <Badge variant="success">Reimbursed</Badge>;
  return <Badge>{s || "—"}</Badge>;
}

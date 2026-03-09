import React from "react";

export function formatMoney(value, _currency = "ZAR") {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) return String(value ?? "0");

  const formatted = n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `R ${formatted}`;
}

export default function Money({ value, currency, className }) {
  return <span className={className}>{formatMoney(value, currency)}</span>;
}

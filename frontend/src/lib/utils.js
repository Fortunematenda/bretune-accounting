import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Hash a string to a positive integer (deterministic).
 * Used for CUID/UUID-style IDs that have no numeric form.
 */
function hashToInt(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h = h & h;
  }
  return Math.abs(h);
}

/**
 * Format a database ID as a readable integer for display.
 * - Numeric IDs: shown as integers (e.g. 1, 123, 12345)
 * - UUIDs: first 8 hex chars parsed as integer (e.g. 1421402968)
 * - CUIDs/long strings: hashed to integer (e.g. 3847291)
 * - null/undefined: "—"
 */
export function formatDisplayId(id) {
  if (id == null || id === "") return "—";
  const str = String(id).trim();
  if (/^-?\d+$/.test(str)) {
    return String(parseInt(str, 10));
  }
  if (/^[0-9a-fA-F]{8}-[0-9a-fA-F-]+$/.test(str)) {
    const parsed = parseInt(str.slice(0, 8), 16);
    return Number.isFinite(parsed) ? String(parsed) : str.slice(0, 8);
  }
  if (str.length > 12) {
    return String(hashToInt(str));
  }
  return str;
}

/** Seq field names used across entities (Prisma schema). */
const SEQ_FIELDS = [
  "clientSeq",
  "invoiceSeq",
  "quoteSeq",
  "supplierSeq",
  "expenseSeq",
  "taskSeq",
  "productSeq",
  "paymentSeq",
  "journalSeq",
  "seq",
];

/**
 * Format a record's display ID, preferring seq when available.
 * Uses *Seq fields (padded 001, 002) or *Number when present.
 * @param {Object} record – The record/row
 * @param {{ page?: number, limit?: number, index?: number }} options – Optional: when no seq exists, use list position for 001, 002, 003
 */
export function formatRecordDisplayId(record, options) {
  if (!record) return "—";
  const numFields = ["billNumber"];
  for (const field of numFields) {
    const val = record[field];
    if (val != null && val !== "") {
      const n = Number(val);
      return Number.isFinite(n) ? String(n).padStart(3, "0") : String(val);
    }
  }
  const strFields = ["invoiceNumber", "quoteNumber", "customerNo", "supplierNo", "paymentNumber"];
  for (const field of strFields) {
    const val = record[field];
    if (val != null && String(val).trim() !== "") return String(val);
  }
  for (const field of SEQ_FIELDS) {
    const val = record[field];
    if (val != null && Number.isFinite(Number(val))) {
      return String(val).padStart(3, "0");
    }
  }
  if (options && typeof options.index === "number" && options.page != null && options.limit != null) {
    return String((options.page - 1) * options.limit + options.index + 1).padStart(3, "0");
  }
  return formatDisplayId(record.id);
}

/**
 * Format a date for display according to user's date format preference.
 * Reads from Settings > General > Accounting defaults > Date format.
 * Options: DD/MM/YYYY (day, month, year), MM/DD/YYYY, YYYY-MM-DD
 * @param {string|Date} iso - ISO date string or Date object
 * @returns {string} Formatted date or "—" if invalid
 */
export function formatDateForDisplay(iso) {
  if (!iso) return "—";
  const d = typeof iso === "string" || typeof iso === "number" ? new Date(iso) : iso;
  if (Number.isNaN(d.getTime())) return String(iso);

  let format = "DD/MM/YYYY";
  try {
    const raw = localStorage.getItem("ba_settings_accounting");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.dateFormat && ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"].includes(parsed.dateFormat)) {
        format = parsed.dateFormat;
      }
    }
  } catch {
    // use default
  }

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  switch (format) {
    case "DD/MM/YYYY":
      return `${day}/${month}/${year}`;
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    default:
      return `${day}/${month}/${year}`;
  }
}

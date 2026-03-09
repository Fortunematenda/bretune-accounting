function normalizeHeaderKey(v) {
  return String(v || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function parseCsv(text) {
  const s = String(text || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (inQuotes) {
      if (ch === '"') {
        const next = s[i + 1];
        if (next === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (ch === "\n") {
      row.push(field);
      field = "";
      const isEmptyRow = row.every((v) => String(v || "").trim() === "");
      if (!isEmptyRow) rows.push(row);
      row = [];
      continue;
    }

    field += ch;
  }

  row.push(field);
  const isEmptyRow = row.every((v) => String(v || "").trim() === "");
  if (!isEmptyRow) rows.push(row);

  return rows;
}

export function csvToObjects(text) {
  const rows = parseCsv(text);
  if (!rows.length) return { headers: [], rows: [] };

  const headers = rows[0].map((h) => String(h || "").trim());
  const keyMap = headers.map((h) => normalizeHeaderKey(h));

  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const obj = {};
    for (let c = 0; c < keyMap.length; c++) {
      const k = keyMap[c];
      if (!k) continue;
      obj[k] = r[c] != null ? String(r[c]) : "";
    }
    const isEmpty = Object.values(obj).every((v) => String(v || "").trim() === "");
    if (!isEmpty) out.push(obj);
  }

  return { headers, rows: out };
}

function escapeCsvCell(v) {
  const s = v == null ? "" : String(v);
  if (/["\n,]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function objectsToCsv({ headers, rows }) {
  const headerLine = headers.map((h) => escapeCsvCell(h.label)).join(",");
  const lines = [headerLine];

  for (const r of rows) {
    const line = headers.map((h) => escapeCsvCell(r?.[h.key])).join(",");
    lines.push(line);
  }

  return lines.join("\n") + "\n";
}

export function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 250);
}

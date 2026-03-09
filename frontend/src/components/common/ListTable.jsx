import React from "react";
import { formatRecordDisplayId } from "../../lib/utils";

const TH_CLASS = "px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600";
const TD_CLASS = "px-4 py-3";
const ID_CELL_CLASS = "font-mono text-xs text-violet-600 font-medium";

/**
 * ListTable – Reusable list table component that enforces ID as the first column.
 * Displays the database ID (row.id) for each record.
 *
 * @param {Object} props
 * @param {Array} props.data – Array of row objects
 * @param {boolean} [props.loading] – Show loading state
 * @param {number} [props.page=1] – Current page (used only if getDisplayId not provided)
 * @param {number} [props.limit=20] – Page limit (used only if getDisplayId not provided)
 * @param {string} [props.emptyMessage] – Message when no rows
 * @param {React.ReactNode} [props.emptyComponent] – Custom empty state (overrides emptyMessage)
 * @param {Array<{key:string,label:string,align?:'left'|'right',render:(row)=>React.ReactNode}>} props.columns – Column definitions
 * @param {(row)=>string} [props.getRowKey] – Key for each row (default: row.id)
 * @param {string} [props.rowClassName] – Additional class for tr
 * @param {boolean} [props.selectable] – Show checkbox column
 * @param {Set<string>} [props.selectedIds] – Set of selected row ids
 * @param {(id)=>void} [props.onSelect] – Toggle single row
 * @param {()=>void} [props.onSelectAll] – Toggle all rows
 * @param {boolean} [props.allSelected] – All rows selected
 * @param {(row)=>string} [props.getCheckboxLabel] – Aria-label for row checkbox
 * @param {(row)=>string} [props.getDisplayId] – Display value for ID column (default: row.id)
 */
export default function ListTable({
  data = [],
  loading = false,
  page = 1,
  limit = 20,
  emptyMessage = "No items.",
  emptyComponent,
  columns = [],
  getRowKey = (row) => row?.id,
  getDisplayId,
  rowClassName = "hover:bg-slate-50/50",
  selectable = false,
  selectedIds,
  onSelect,
  onSelectAll,
  allSelected = false,
  getCheckboxLabel = () => "Select row",
}) {
  const items = Array.isArray(data) ? data : [];
  const colCount = (selectable ? 1 : 0) + 1 + columns.length; // checkbox? + ID + columns

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {selectable && (
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                  aria-label="Select all"
                />
              </th>
            )}
            <th className={`${TH_CLASS} text-left`}>ID</th>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`${TH_CLASS} ${col.align === "right" ? "text-right" : "text-left"}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {loading ? (
            <tr>
              <td colSpan={colCount} className="px-4 py-8 text-center text-sm text-slate-500">
                Loading…
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={colCount} className="px-4 py-8 text-center text-sm text-slate-500">
                {emptyComponent ?? emptyMessage}
              </td>
            </tr>
          ) : (
            items.map((row, index) => {
              const displayId = (getDisplayId || ((r, i) => formatRecordDisplayId(r, { page, limit, index: i })))(row, index);
              const rowId = getRowKey(row);
              return (
                <tr key={rowId ?? index} className={rowClassName}>
                  {selectable && (
                    <td className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds?.has(rowId)}
                        onChange={() => onSelect?.(rowId)}
                        className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={getCheckboxLabel(row)}
                      />
                    </td>
                  )}
                  <td
                    className={`${TD_CLASS} ${ID_CELL_CLASS}`}
                    title={row?.id != null ? String(row.id) : undefined}
                  >
                    {displayId ?? "—"}
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`${TD_CLASS} ${col.align === "right" ? "text-right" : ""} ${col.cellClassName ?? ""}`}
                    >
                      {col.render ? col.render(row, displayId) : row[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

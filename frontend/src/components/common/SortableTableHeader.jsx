import React from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

/**
 * Sortable column header with chevron icon.
 * Click to sort; active column shows direction (up/down), inactive shows both.
 */
export default function SortableTableHeader({
  label,
  columnKey,
  sortKey,
  sortDir,
  onSort,
  className = "",
  align = "left",
}) {
  const isActive = sortKey === columnKey;
  const canSort = onSort != null;

  const handleClick = () => {
    if (canSort) onSort(columnKey);
  };

  return (
    <th
      className={`py-3 px-3 whitespace-nowrap ${align === "right" ? "text-right" : "text-left"} ${className}`}
    >
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1 w-full ${align === "right" ? "justify-end" : "justify-start"} text-left font-medium transition-colors ${
          canSort ? "cursor-pointer hover:text-violet-600" : "cursor-default"
        } ${isActive ? "text-violet-600" : "text-slate-600"}`}
        disabled={!canSort}
      >
        <span>{label}</span>
        {canSort ? (
          isActive ? (
            sortDir === "asc" ? (
              <ChevronUp className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0" />
            )
          ) : (
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          )
        ) : null}
      </button>
    </th>
  );
}

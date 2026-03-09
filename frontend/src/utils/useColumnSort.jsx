import { useCallback, useState } from "react";

/**
 * Hook for column-based sorting on list tables.
 * @param {Array<{key: string, label: string, sortable?: boolean, getValue?: (row) => any}>} columnDefs
 * @returns { sortKey, sortDir, setSort, sortRows }
 */
export function useColumnSort(columnDefs = []) {
  const [sortKey, setSortKey] = useState("");
  const [sortDir, setSortDir] = useState("asc"); // "asc" | "desc"

  const toggleSort = useCallback((key) => {
    setSortKey((prevKey) => {
      if (prevKey === key) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortDir("asc");
      }
      return key;
    });
  }, []);

  const setSort = toggleSort;

  const sortRows = useCallback(
    (rows = []) => {
      if (!sortKey || rows.length === 0) return rows;

      const col = columnDefs.find((c) => c.key === sortKey);
      const getVal = col?.getValue || ((r) => r?.[sortKey]);

      return [...rows].sort((a, b) => {
        const va = getVal(a);
        const vb = getVal(b);

        const aStr = String(va ?? "").toLowerCase();
        const bStr = String(vb ?? "").toLowerCase();

        if (typeof va === "number" && typeof vb === "number") {
          return sortDir === "asc" ? va - vb : vb - va;
        }

        const cmp = aStr.localeCompare(bStr, undefined, { numeric: true });
        return sortDir === "asc" ? cmp : -cmp;
      });
    },
    [sortKey, sortDir, columnDefs]
  );

  return {
    sortKey,
    sortDir,
    setSort,
    toggleSort,
    sortRows,
  };
}

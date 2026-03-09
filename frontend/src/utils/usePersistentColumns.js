import { useCallback } from "react";
import { useLocalStorageState } from "./useLocalStorageState";

function sanitizeColumns(next, columnOrder, requiredKeys, fallback) {
  const order = Array.isArray(columnOrder) ? columnOrder : [];
  const required = new Set(Array.isArray(requiredKeys) ? requiredKeys : []);
  const base = Array.isArray(next) ? next : fallback;
  const unique = Array.from(new Set(base)).filter((k) => order.includes(k));

  for (const k of required) {
    if (!unique.includes(k)) unique.unshift(k);
  }

  return unique.length > 0 ? unique : fallback;
}

export function usePersistentColumns({ storageKey, columnOrder, defaultVisibleColumns, requiredKeys = [] }) {
  const [visibleColumns, setVisibleColumnsRaw] = useLocalStorageState(storageKey, defaultVisibleColumns);

  const setVisibleColumns = useCallback(
    (updater) => {
      setVisibleColumnsRaw((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        return sanitizeColumns(next, columnOrder, requiredKeys, defaultVisibleColumns);
      });
    },
    [setVisibleColumnsRaw, columnOrder, requiredKeys, defaultVisibleColumns]
  );

  const resetVisibleColumns = useCallback(() => {
    setVisibleColumnsRaw(sanitizeColumns(defaultVisibleColumns, columnOrder, requiredKeys, defaultVisibleColumns));
  }, [setVisibleColumnsRaw, defaultVisibleColumns, columnOrder, requiredKeys]);

  return [sanitizeColumns(visibleColumns, columnOrder, requiredKeys, defaultVisibleColumns), setVisibleColumns, resetVisibleColumns];
}

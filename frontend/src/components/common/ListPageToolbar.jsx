import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, MoreHorizontal, Palette, Plus, Search } from "lucide-react";
import Input from "../ui/input";
import Button from "../ui/button";
import Select from "../ui/select";
import { cn } from "../../lib/utils";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

function ActionsDropdown({ items, children }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const resolved = (items || []).filter((it) => it && !it.hidden);

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e) {
      const t = e.target;
      if (btnRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
      setPos(null);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  function toggle() {
    if (open) {
      setOpen(false);
      setPos(null);
    } else {
      const rect = btnRef.current?.getBoundingClientRect?.();
      if (rect) {
        setPos({ top: rect.bottom + 4, left: rect.left });
        setOpen(true);
      }
    }
  }

  const menuEl =
    open && pos && resolved.length > 0 ? (
      <div
        ref={menuRef}
        role="menu"
        className="fixed z-[9999] w-48 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        style={{ top: pos.top, left: pos.left }}
      >
        {resolved.map((it) => (
          <button
            key={it.key}
            type="button"
            role="menuitem"
            className={cn(
              "w-full px-3 py-2 text-left text-sm hover:bg-slate-50 focus:outline-none",
              it.tone === "danger" ? "text-red-700" : "text-slate-700",
              it.disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={it.disabled}
            onClick={(e) => {
              e.stopPropagation();
              if (!it.disabled) it.onSelect?.();
              setOpen(false);
              setPos(null);
            }}
          >
            {it.label}
          </button>
        ))}
      </div>
    ) : null;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {children}
        <ChevronDown className="h-4 w-4 text-slate-500" />
      </button>
      {typeof document !== "undefined" && menuEl ? createPortal(menuEl, document.body) : null}
    </>
  );
}

function MoreActionsMenu({ items, onMoreClick }) {
  if (items?.length > 0) {
    return (
      <ActionsDropdown items={items}>
        <MoreHorizontal className="h-4 w-4" />
      </ActionsDropdown>
    );
  }
  return (
    <Button
      variant="outline"
      className="h-9 w-9 shrink-0 rounded-lg border border-slate-200 bg-white p-0"
      onClick={onMoreClick}
      aria-label="More options"
    >
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  );
}

/**
 * Reusable toolbar for list pages.
 * Layout: [Actions] [Show X entries] ... [Search] [Palette] [More]
 */
export default function ListPageToolbar({
  actionsItems = [],
  onAddNew,
  addNewLabel,
  addNewAriaLabel = "Add new",
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search",
  limit,
  onLimitChange,
  onColumnsClick,
  onMoreClick,
  moreMenuItems,
  className,
}) {
  const showEntries = limit != null && onLimitChange != null;
  const showSearch = onSearchChange != null;
  const showColumns = onColumnsClick != null;
  const showMore = onMoreClick != null || (Array.isArray(moreMenuItems) && moreMenuItems.length > 0);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-2.5",
        className
      )}
    >
      {/* Add new (+) button */}
      {typeof onAddNew === "function" ? (
        <Button
          variant="default"
          className="h-9 shrink-0 rounded-lg bg-violet-600 px-3 text-white hover:bg-violet-700"
          onClick={onAddNew}
          aria-label={addNewAriaLabel}
        >
          <Plus className="h-4 w-4 shrink-0 mr-2" />
          {addNewLabel ?? addNewAriaLabel}
        </Button>
      ) : null}

      {/* Actions dropdown */}
      {actionsItems.length > 0 ? (
        <ActionsDropdown items={actionsItems}>
          <span>Actions</span>
        </ActionsDropdown>
      ) : null}

      {/* Show X entries */}
      {showEntries ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Show</span>
          <Select
            value={String(limit)}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="h-9 w-20 rounded-lg border border-slate-200 bg-white text-sm"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
          <span className="text-sm text-slate-600">entries</span>
        </div>
      ) : null}

      {/* Spacer */}
      <div className="flex-1 min-w-[1rem]" />

      {/* Search */}
      {showSearch ? (
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 pl-9 rounded-lg border border-slate-200 bg-white text-sm"
          />
        </div>
      ) : null}

      {/* Palette (columns) button */}
      {showColumns ? (
        <Button
          variant="outline"
          className="h-9 w-9 shrink-0 rounded-lg border border-slate-300 bg-slate-700 p-0 text-white hover:bg-slate-600"
          onClick={onColumnsClick}
          aria-label="Columns"
        >
          <Palette className="h-4 w-4" />
        </Button>
      ) : null}

      {/* More options */}
      {showMore ? (
        <MoreActionsMenu items={moreMenuItems} onMoreClick={onMoreClick} />
      ) : null}
    </div>
  );
}

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";
import { cn } from "../../lib/utils";

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export default function ActionsMenu({
  items,
  ariaLabel = "Actions",
  buttonClassName,
  menuClassName,
  menuWidthClassName = "w-44",
  buttonIconClassName = "h-4 w-4",
  disabled,
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const menuId = useId();

  const resolvedItems = useMemo(() => {
    const base = Array.isArray(items) ? items : [];
    return base.filter((it) => it && !it.hidden);
  }, [items]);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (!open) return;
      const t = e.target;
      if (btnRef.current && btnRef.current.contains(t)) return;
      if (menuRef.current && menuRef.current.contains(t)) return;
      setOpen(false);
      setPos(null);
    }

    function onKeyDown(e) {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        setPos(null);
        btnRef.current?.focus?.();
      }

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const nodes = Array.from(menuRef.current?.querySelectorAll('[role="menuitem"]') || []);
        if (nodes.length === 0) return;
        const active = document.activeElement;
        const idx = nodes.indexOf(active);
        const dir = e.key === "ArrowDown" ? 1 : -1;
        const next = nodes[clamp(idx === -1 ? 0 : idx + dir, 0, nodes.length - 1)];
        next?.focus?.();
      }
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function openMenu() {
    const rect = btnRef.current?.getBoundingClientRect?.();
    if (!rect) return;
    const gap = 4;
    const menuWidth = 208; // w-52
    const spaceRight = typeof window !== "undefined" ? window.innerWidth - rect.right - gap : menuWidth;
    const openRight = spaceRight >= menuWidth;
    const left = openRight ? rect.right + gap : rect.left - menuWidth - gap;
    setPos({ top: rect.bottom + gap, left });
    setOpen(true);

    window.requestAnimationFrame(() => {
      const first = menuRef.current?.querySelector('[role="menuitem"]');
      first?.focus?.();
    });
  }

  const menuEl =
    open && pos ? (
      <div
        id={menuId}
        ref={menuRef}
        role="menu"
        className={cn(
          "fixed z-[9999] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg",
          menuWidthClassName,
          menuClassName
        )}
        style={{ top: pos.top, left: pos.left }}
      >
        {resolvedItems.map((it) => (
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
            title={it.hint || ""}
            onClick={(e) => {
              e.stopPropagation();
              if (it.disabled) return;
              setOpen(false);
              setPos(null);
              it.onSelect?.();
            }}
          >
            {it.label}
          </button>
        ))}
      </div>
    ) : null;

  return (
    <>
      <div className="inline-block">
        <button
          ref={btnRef}
          type="button"
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300",
            buttonClassName
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (disabled) return;
            if (open) {
              setOpen(false);
              setPos(null);
            } else {
              openMenu();
            }
          }}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={ariaLabel}
          disabled={disabled}
        >
          <MoreVertical className={buttonIconClassName} />
        </button>
      </div>
      {typeof document !== "undefined" && menuEl
        ? createPortal(menuEl, document.body)
        : null}
    </>
  );
}

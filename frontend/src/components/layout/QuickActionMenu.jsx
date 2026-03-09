import React, { useEffect, useId, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { cn } from "../../lib/utils";

export default function QuickActionMenu({ open: openProp, onOpenChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openUncontrolled, setOpenUncontrolled] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const menuId = useId();

  const open = openProp != null ? Boolean(openProp) : openUncontrolled;
  const setOpen = (v) => {
    if (typeof onOpenChange === "function") onOpenChange(Boolean(v));
    if (openProp == null) setOpenUncontrolled(Boolean(v));
  };

  useEffect(() => {
    setOpen(false);
  }, [location?.pathname]);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (!open) return;
      const t = e.target;
      if (btnRef.current && btnRef.current.contains(t)) return;
      if (menuRef.current && menuRef.current.contains(t)) return;
      setOpen(false);
    }

    function onKeyDown(e) {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        btnRef.current?.focus();
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
    setOpen(true);
    window.requestAnimationFrame(() => {
      const first = menuRef.current?.querySelector('[role="menuitem"]');
      if (first) first.focus();
    });
  }

  const items = [
    { label: "Create Invoice", to: "/invoices/new" },
    { label: "Add Quote", to: "/quotes/new" },
    { label: "Add Recurring Invoice", to: "/recurring?new=1" },
    { label: "Add Payment", to: "/payments" },
    { label: "Add Credit Note", to: "/invoices" },
    { label: "Send Statement", to: "/statements/client" },
    { label: "New Customer", to: "/customers?new=1" },
  ];

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300",
          open && "bg-slate-50"
        )}
        aria-label="Quick actions"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => (open ? setOpen(false) : openMenu())}
      >
        <Plus className="h-4 w-4" />
      </button>

      {open ? (
        <div
          id={menuId}
          ref={menuRef}
          role="menu"
          className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          {items.map((it) => (
            <button
              key={it.label}
              type="button"
              role="menuitem"
              className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 focus:outline-none"
              onClick={() => {
                setOpen(false);
                navigate(it.to);
              }}
            >
              {it.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

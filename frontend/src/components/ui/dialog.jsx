import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

const SIZES = {
  sm: "max-w-md",
  default: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  "2xl": "max-w-6xl",
  full: "max-w-[calc(100vw-2rem)]",
};

export default function Dialog({ open, onOpenChange, title, description, children, footer, className, size = "default", fullscreen }) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onOpenChange?.(false);
    }
    if (open) {
      window.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  const sizeClass = SIZES[size] || SIZES.default;

  return (
    <div className="fixed inset-0 z-50 animate-in fade-in">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity"
        onClick={() => onOpenChange?.(false)}
      />
      <div
        className={cn(
          "absolute inset-0 flex",
          fullscreen ? "p-0 items-stretch justify-stretch" : "items-start justify-center p-4 pt-[10vh] sm:items-center sm:pt-4"
        )}
      >
        <div
          className={cn(
            "bg-white shadow-2xl border border-slate-200/80 flex flex-col",
            fullscreen
              ? "w-full h-full rounded-none min-w-0 min-h-0"
              : cn("w-full rounded-xl max-h-[calc(100vh-2rem)]", sizeClass),
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {title ? (
            <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-slate-100 shrink-0">
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-slate-900 leading-6">{title}</h2>
                {description ? <p className="mt-0.5 text-sm text-slate-500">{description}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => onOpenChange?.(false)}
                className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors -mr-1 -mt-0.5"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}
          <div className={cn("overflow-auto", fullscreen ? "flex-1 p-6" : "p-6")}>{children}</div>
          {footer ? (
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 shrink-0 bg-slate-50/50">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

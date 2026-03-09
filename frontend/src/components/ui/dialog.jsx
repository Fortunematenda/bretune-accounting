import React, { useEffect } from "react";
import { cn } from "../../lib/utils";

export default function Dialog({ open, onOpenChange, title, children, className, fullscreen }) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onOpenChange?.(false);
    }
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={() => onOpenChange?.(false)}
      />
      <div
        className={cn(
          "absolute inset-0 flex",
          fullscreen ? "p-0 items-stretch justify-stretch" : "items-center justify-center p-4"
        )}
      >
        <div
          className={cn(
            "bg-white shadow-2xl border border-slate-200 flex flex-col",
            fullscreen
              ? "w-full h-full rounded-none min-w-0 min-h-0"
              : "w-full max-w-lg rounded-2xl max-h-[calc(100vh-2rem)]",
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {title ? (
            <div className="px-5 py-4 border-b border-slate-200 shrink-0">
              <div className="text-base font-semibold text-slate-900">{title}</div>
            </div>
          ) : null}
          <div className={cn("overflow-auto", fullscreen ? "flex-1 p-5" : "p-5")}>{children}</div>
        </div>
      </div>
    </div>
  );
}

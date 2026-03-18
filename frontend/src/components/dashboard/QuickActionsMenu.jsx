import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import {
  FileText,
  CreditCard,
  Receipt,
  Plus,
  UserPlus,
  ChevronDown,
  Zap,
} from "lucide-react";

const ACTIONS = [
  { key: "invoice", label: "Create Invoice", icon: FileText, to: "/invoices/new", color: "text-violet-600 bg-violet-50" },
  { key: "payment", label: "Record Payment", icon: CreditCard, to: "/payments", color: "text-emerald-600 bg-emerald-50" },
  { key: "bill", label: "Create Bill", icon: Receipt, to: "/bills/new", color: "text-amber-600 bg-amber-50" },
  { key: "expense", label: "Add Expense", icon: Plus, to: "/expenses/new", color: "text-rose-600 bg-rose-50" },
  { key: "client", label: "Add Client", icon: UserPlus, to: "/customers", color: "text-blue-600 bg-blue-50" },
];

export default function QuickActionsMenu() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "h-9 rounded-xl px-3.5 text-xs font-medium inline-flex items-center gap-2 transition-all",
          "bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-600/20"
        )}
      >
        <Zap className="h-3.5 w-3.5" />
        Quick Actions
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 z-[60] mt-2 w-56 rounded-xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50 py-1.5 animate-in fade-in slide-in-from-top-2">
          {ACTIONS.map((a) => (
            <button
              key={a.key}
              type="button"
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-slate-50 transition-colors"
              onClick={() => {
                setOpen(false);
                navigate(a.to);
              }}
            >
              <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", a.color)}>
                <a.icon className="h-4 w-4" strokeWidth={1.8} />
              </div>
              <span className="font-medium text-slate-700">{a.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

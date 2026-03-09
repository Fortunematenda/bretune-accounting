import React from "react";
import { cn } from "../../lib/utils";

export default function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  const variants = {
    default: "bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-700",
    secondary: "bg-violet-100 text-violet-800 hover:bg-violet-200 dark:bg-violet-800 dark:text-violet-100 dark:hover:bg-violet-700",
    outline:
      "border border-violet-200 bg-white text-slate-700 hover:bg-violet-50 hover:border-violet-300 dark:border-violet-700 dark:text-slate-300 dark:hover:bg-violet-900/20",
    ghost: "text-slate-700 hover:bg-violet-100 dark:text-slate-300 dark:hover:bg-violet-800",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-6",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 ease-in-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

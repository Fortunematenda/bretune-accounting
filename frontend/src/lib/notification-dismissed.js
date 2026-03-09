const KEY = "ba_dismissed_notifications";

export function getDismissed() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { invoices: new Set(), tasks: new Set() };
    const parsed = JSON.parse(raw);
    return {
      invoices: new Set(parsed.invoices || []),
      tasks: new Set(parsed.tasks || []),
    };
  } catch {
    return { invoices: new Set(), tasks: new Set() };
  }
}

export function addDismissedInvoice(id) {
  const d = getDismissed();
  d.invoices.add(id);
  saveDismissed(d);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("notifications-dismissed"));
  }
}

export function addDismissedTask(id) {
  const d = getDismissed();
  d.tasks.add(id);
  saveDismissed(d);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("notifications-dismissed"));
  }
}

function saveDismissed({ invoices, tasks }) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        invoices: [...invoices],
        tasks: [...tasks],
      })
    );
  } catch {
    // ignore
  }
}

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { api } from "../../lib/api";
import { cn } from "../../lib/utils";

function useDebounced(value, delayMs) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return v;
}

function normalize(s) {
  return String(s || "").trim();
}

export default function GlobalSearch({ open: openProp, onOpenChange, iconOnly = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [openUncontrolled, setOpenUncontrolled] = useState(false);
  const [q, setQ] = useState("");
  const debounced = useDebounced(q, 250);

  const open = openProp != null ? Boolean(openProp) : openUncontrolled;
  const setOpen = (v) => {
    if (typeof onOpenChange === "function") onOpenChange(Boolean(v));
    if (openProp == null) setOpenUncontrolled(Boolean(v));
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState({ clients: [], invoices: [], quotes: [], payments: [] });
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef(null);
  const panelRef = useRef(null);

  const flat = useMemo(() => {
    const items = [];

    results.clients.forEach((c) => {
      const label = c.companyName || c.contactName || c.email;
      items.push({
        group: "Customers",
        label,
        meta: "",
        onSelect: () => navigate(`/customers?q=${encodeURIComponent(label || "")}`),
      });
    });

    results.invoices.forEach((i) => {
      items.push({
        group: "Invoices",
        label: i.invoiceNumber,
        meta: i.client?.companyName || i.client?.contactName || "",
        onSelect: () => navigate(`/invoices?q=${encodeURIComponent(i.invoiceNumber || "")}`),
      });
    });

    results.quotes.forEach((r) => {
      items.push({
        group: "Quotes",
        label: r.quoteNumber,
        meta: r.client?.companyName || r.client?.contactName || "",
        onSelect: () => navigate(`/quotes?q=${encodeURIComponent(r.quoteNumber || "")}`),
      });
    });

    results.payments.forEach((p) => {
      items.push({
        group: "Payments",
        label: p.paymentNumber,
        meta: p.reference || p.transactionId || "",
        onSelect: () => navigate(`/payments?q=${encodeURIComponent(p.paymentNumber || "")}`),
      });
    });

    return items;
  }, [results, navigate]);

  useEffect(() => {
    setOpen(false);
  }, [location?.pathname]);

  useEffect(() => {
    if (open) return;
    if (!q) return;
    setQ("");
    setResults({ clients: [], invoices: [], quotes: [], payments: [] });
    setActiveIndex(0);
    setError(null);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (!open) return;
      const t = e.target;
      if (inputRef.current && inputRef.current.contains(t)) return;
      if (panelRef.current && panelRef.current.contains(t)) return;
      close();
    }

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open, q]);

  useEffect(() => {
    const query = normalize(debounced);
    setError(null);

    if (!open) return;
    if (query.length < 1) {
      setResults({ clients: [], invoices: [], quotes: [], payments: [] });
      setActiveIndex(0);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const isSingleLetter = /^[a-zA-Z]$/.test(query);
    const searchPromise = isSingleLetter
      ? api.listCustomers({ q: query, page: 1, limit: 50 }).then((clients) => ({
          clients: clients?.data || [],
          invoices: [],
          quotes: [],
          payments: [],
        }))
      : Promise.all([
          api.listCustomers({ q: query, page: 1, limit: 5 }),
          api.listInvoices({ q: query, page: 1, limit: 5 }),
          api.listQuotes({ q: query, page: 1, limit: 5 }),
          api.listPayments({ q: query, page: 1, limit: 5 }),
        ]).then(([clients, invoices, quotes, payments]) => ({
          clients: clients?.data || [],
          invoices: invoices?.data || [],
          quotes: quotes?.data || [],
          payments: payments?.data || [],
        }));

    searchPromise
      .then((res) => {
        if (cancelled) return;
        setResults(res);
        setActiveIndex(0);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e?.message ? String(e.message) : "Search failed");
        setResults({ clients: [], invoices: [], quotes: [], payments: [] });
        setActiveIndex(0);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debounced, open]);

  function close() {
    setOpen(false);
    setQ("");
    setResults({ clients: [], invoices: [], quotes: [], payments: [] });
    setActiveIndex(0);
    setError(null);
  }

  const isEmpty = flat.length === 0 && normalize(q).length >= 1 && !loading && !error;

  function onKeyDown(e) {
    if (!open) return;

    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((v) => Math.min(v + 1, Math.max(0, flat.length - 1)));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((v) => Math.max(v - 1, 0));
    }

    if (e.key === "Enter") {
      const item = flat[activeIndex];
      if (!item) return;
      e.preventDefault();
      close();
      item.onSelect();
    }
  }

  return (
    <>
      {!iconOnly ? (
        <div className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              placeholder="Search customers, invoices, quotes, payments"
              className="h-9 w-80 rounded-md border border-violet-200 bg-white pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300"
            />
            {q ? (
              <button
                type="button"
                className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded hover:bg-slate-100"
                onClick={() => {
                  setQ("");
                  setResults({ clients: [], invoices: [], quotes: [], payments: [] });
                  setActiveIndex(0);
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-slate-600" />
              </button>
            ) : null}

            {open ? (
              <div
                ref={panelRef}
                className="absolute right-0 mt-2 w-[520px] overflow-hidden rounded-xl border border-violet-200 bg-white shadow-lg"
              >
                <SearchResults
                  q={q}
                  flat={flat}
                  activeIndex={activeIndex}
                  loading={loading}
                  error={error}
                  empty={isEmpty}
                  onSelect={(idx) => {
                    const item = flat[idx];
                    if (!item) return;
                    close();
                    item.onSelect();
                  }}
                  onHover={(idx) => setActiveIndex(idx)}
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {iconOnly ? (
        <div className="relative hidden md:block">
          <button
            type="button"
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-md border border-violet-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-violet-300",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
            )}
            onClick={() => {
              setOpen(true);
              window.requestAnimationFrame(() => inputRef.current?.focus());
            }}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          {open ? (
            <div
              ref={panelRef}
              className="absolute right-0 mt-2 w-[520px] overflow-hidden rounded-xl border border-violet-200 bg-white shadow-lg"
            >
              <div className="border-b border-slate-100 px-3 py-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    ref={inputRef}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Search customers, invoices, quotes, payments"
                    className="h-9 w-full rounded-md border border-violet-200 bg-white pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300"
                    autoFocus
                  />
                  {q ? (
                    <button
                      type="button"
                      className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded hover:bg-slate-100"
                      onClick={() => {
                        setQ("");
                        setResults({ clients: [], invoices: [], quotes: [], payments: [] });
                        setActiveIndex(0);
                        inputRef.current?.focus();
                      }}
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4 text-slate-600" />
                    </button>
                  ) : null}
                </div>
              </div>

              <SearchResults
                q={q}
                flat={flat}
                activeIndex={activeIndex}
                loading={loading}
                error={error}
                empty={isEmpty}
                onSelect={(idx) => {
                  const item = flat[idx];
                  if (!item) return;
                  close();
                  item.onSelect();
                }}
                onHover={(idx) => setActiveIndex(idx)}
              />
            </div>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-md border border-violet-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-violet-300",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300",
          !iconOnly && "md:hidden",
          iconOnly && "md:hidden"
        )}
        onClick={() => {
          setOpen(true);
          window.requestAnimationFrame(() => inputRef.current?.focus());
        }}
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-900/30" onClick={close} />
          <div className="absolute left-0 right-0 top-0 bg-white border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search…"
                  className="h-9 w-full rounded-md border border-violet-200 bg-white pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300"
                />
                {q ? (
                  <button
                    type="button"
                    className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded hover:bg-slate-100"
                    onClick={() => {
                      setQ("");
                      setResults({ clients: [], invoices: [], quotes: [], payments: [] });
                      setActiveIndex(0);
                      inputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4 text-slate-600" />
                  </button>
                ) : null}
              </div>

              <button
                type="button"
                className="text-sm font-medium text-slate-700"
                onClick={close}
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="absolute left-0 right-0 top-[60px] bottom-0 overflow-auto bg-white px-4 py-3">
            <div className="mx-auto max-w-xl">
              <SearchResults
                q={q}
                flat={flat}
                activeIndex={activeIndex}
                loading={loading}
                error={error}
                empty={isEmpty}
                onSelect={(idx) => {
                  const item = flat[idx];
                  if (!item) return;
                  close();
                  item.onSelect();
                }}
                onHover={(idx) => setActiveIndex(idx)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function SearchResults({ q, flat, activeIndex, loading, error, empty, onSelect, onHover }) {
  const query = normalize(q);

  if (query.length < 1) {
    return <div className="px-3 py-3 text-sm text-slate-600">Type to search customers, invoices, quotes and payments.</div>;
  }

  if (loading) {
    return <div className="px-3 py-3 text-sm text-slate-600">Searching…</div>;
  }

  if (error) {
    return <div className="px-3 py-3 text-sm text-red-600">{error}</div>;
  }

  if (empty) {
    return <div className="px-3 py-3 text-sm text-slate-600">No results.</div>;
  }

  return (
    <div className="max-h-[420px] overflow-auto">
      {flat.map((r, idx) => (
        <button
          key={`${r.group}-${r.label}-${idx}`}
          type="button"
          className={cn(
            "w-full px-3 py-2 text-left hover:bg-slate-50",
            idx === activeIndex && "bg-violet-50"
          )}
          onMouseEnter={() => onHover(idx)}
          onClick={() => onSelect(idx)}
        >
          <div className="min-w-0">
            <div className="text-sm font-medium text-slate-900 truncate">{r.label}</div>
            {r.meta ? <div className="text-xs text-slate-500 truncate">{r.meta}</div> : null}
          </div>
        </button>
      ))}
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Users, Search, RefreshCw, Phone, Mail, MapPin, ChevronRight } from "lucide-react";

export default function IspCustomersPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const custData = await api.ispCustomers({ limit: 500 });
      setCustomers((custData.items || []).filter((c) => c.status !== "LEAD"));
    } catch (err) {
      console.error("Customers load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      c.firstName?.toLowerCase().includes(s) ||
      c.lastName?.toLowerCase().includes(s) ||
      c.pppoeUsername?.toLowerCase().includes(s) ||
      c.email?.toLowerCase().includes(s) ||
      c.phone?.toLowerCase().includes(s)
    );
  });

  const statusBadge = (status) => {
    const map = {
      ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
      INACTIVE: "bg-slate-100 text-slate-500 border-slate-200",
      BLOCKED: "bg-red-50 text-red-700 border-red-200",
    };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${map[status] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  const active = customers.filter((c) => c.status === "ACTIVE").length;
  const blocked = customers.filter((c) => c.status === "BLOCKED").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">ISP Customers</h1>
          <p className="text-sm text-slate-500">{customers.length} customers total</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-emerald-200/60 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-700">{active}</div>
              <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">Active</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-red-200/60 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center">
              <Users className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{blocked}</div>
              <div className="text-[10px] text-red-400 uppercase tracking-wider font-semibold">Blocked</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-700">{customers.length}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input type="text" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/80 border-b border-slate-100">
              <tr>
                {["Name", "PPPoE Username", "Contact", "Category", "Status", "Date Added", ""].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-400">
                    <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                    No customers found
                  </td>
                </tr>
              ) : filtered.map((c) => (
                <tr key={c.id}
                  className="border-b border-slate-50 hover:bg-violet-50/30 cursor-pointer transition-colors"
                  onClick={() => navigate(`/isp-customers/${c.id}`)}
                >
                  <td className="px-4 py-3 text-sm font-semibold text-slate-800">
                    {c.firstName} {c.lastName}
                    {c.companyName && <div className="text-[10px] text-slate-400">{c.companyName}</div>}
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-slate-600">{c.pppoeUsername}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5 text-xs text-slate-500">
                      {c.phone && <div className="flex items-center gap-1"><Phone className="h-3 w-3" />{c.phone}</div>}
                      {c.email && <div className="flex items-center gap-1"><Mail className="h-3 w-3" />{c.email}</div>}
                      {(c.city || c.street) && <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{[c.street, c.city].filter(Boolean).join(", ")}</div>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{c.category}</td>
                  <td className="px-4 py-3">{statusBadge(c.status)}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {c.dateAdded ? new Date(c.dateAdded).toLocaleDateString("en-GB") : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

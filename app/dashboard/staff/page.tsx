"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authFetch } from "@/lib/api";

interface StaffMember {
  id:             string;
  email:          string;
  full_name:      string | null;
  created_at:     string;
  total_accounts: number;
  converted:      number;
  commission:     number;
}

const AVATAR_COLORS = [
  "bg-neutral-900",
  "bg-blue-600",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-rose-600",
  "bg-amber-600",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

function getInitials(s: StaffMember) {
  const name = s.full_name ?? s.email;
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

export default function StaffPage() {
  const [staff,    setStaff]    = useState<StaffMember[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirm,  setConfirm]  = useState<StaffMember | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ full_name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const setField = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setError(null);
    };

  useEffect(() => {
    authFetch("/api/staff")
      .then((r) => r.json())
      .then((d) => setStaff(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    const res  = await authFetch("/api/staff", { method: "POST", body: JSON.stringify(form) });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) { setError(data.error ?? "Failed to add staff member"); return; }
    setStaff((prev) => [{ ...data, total_accounts: 0, converted: 0, commission: 0 }, ...prev]);
    setForm({ full_name: "", email: "", password: "" });
    setShowForm(false);
    toast.success(`${data.full_name ?? data.email} added to the team`);
  };

  const handleDelete = async (member: StaffMember) => {
    setConfirm(null);
    setDeleting(member.id);
    const res = await authFetch(`/api/staff/${member.id}`, { method: "DELETE" });
    setDeleting(null);
    if (res.ok) {
      setStaff((prev) => prev.filter((s) => s.id !== member.id));
      toast.success(`${member.full_name ?? member.email} removed`);
    } else {
      toast.error("Failed to remove staff member");
    }
  };

  const totalAccounts  = staff.reduce((a, s) => a + s.total_accounts, 0);
  const totalConverted = staff.reduce((a, s) => a + s.converted, 0);
  const totalCommission = staff.reduce((a, s) => a + s.commission, 0);

  return (
    <div className="flex flex-col gap-6">

      {/* Confirm delete modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="p-6">
              <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 5v4M8 11v.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="8" cy="8" r="6" stroke="#ef4444" strokeWidth="1.3" />
                </svg>
              </div>
              <h2 className="text-sm font-black text-neutral-900 mb-1">Remove team member?</h2>
              <p className="text-sm text-neutral-500">
                <span className="font-semibold text-neutral-700">{confirm.full_name ?? confirm.email}</span> will lose access to the sales app immediately.
              </p>
            </div>
            <div className="flex border-t border-neutral-100">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 py-3.5 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors border-r border-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirm)}
                className="flex-1 py-3.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Sales Team</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {loading ? "Loading…" : `${staff.length} member${staff.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => { setShowForm((v) => !v); setError(null); }}
          className="flex items-center gap-2 bg-neutral-900 text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-neutral-700 transition-colors shrink-0"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Add Member
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Team Size",        value: loading ? "—" : staff.length.toString() },
          { label: "Total Accounts",   value: loading ? "—" : totalAccounts.toString() },
          { label: "Conversions",      value: loading ? "—" : totalConverted.toString() },
          { label: "Total Commission", value: loading ? "—" : `₦${totalCommission.toLocaleString()}` },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-neutral-200 rounded-2xl p-5">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-2">{s.label}</p>
            <p className="text-2xl font-black text-neutral-900 tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Add member form */}
      {showForm && (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-neutral-900">New Team Member</h2>
              <p className="text-[11px] text-neutral-400 mt-0.5">They&apos;ll be able to log in to the sales app immediately.</p>
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleCreate} className="p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M7 4.5v3M7 9v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">Full Name</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={setField("full_name")}
                  placeholder="Jane Doe"
                  className="border border-neutral-200 bg-neutral-50 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 focus:bg-white transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">
                  Email <span className="text-red-400 normal-case tracking-normal">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={setField("email")}
                  placeholder="rep@viklance.dev"
                  className="border border-neutral-200 bg-neutral-50 rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 focus:bg-white transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">
                  Password <span className="text-red-400 normal-case tracking-normal">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={setField("password")}
                    placeholder="Min. 8 characters"
                    className="w-full border border-neutral-200 bg-neutral-50 rounded-xl px-4 py-3 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
                  >
                    {showPass ? (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3" />
                        <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.3" />
                        <path d="M3 3l10 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 8s2.5-4 6-4 6 4 6 4-2.5 4-6 4-6-4-6-4z" stroke="currentColor" strokeWidth="1.3" />
                        <circle cx="8" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="bg-neutral-900 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {creating ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="22" strokeDashoffset="10" strokeLinecap="round" />
                    </svg>
                    Adding…
                  </>
                ) : "Add to Team"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff table */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-100 animate-pulse shrink-0" />
                <div className="flex-1 grid grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-3 bg-neutral-100 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : staff.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 19c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="11" cy="8" r="4" stroke="#d4d4d4" strokeWidth="1.5" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-neutral-400">No team members yet</p>
            <p className="text-[11px] text-neutral-300 mt-1">Click &quot;Add Member&quot; to onboard your first sales rep.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Rep</th>
                  <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden sm:table-cell">Accounts</th>
                  <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden md:table-cell">Converted</th>
                  <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden lg:table-cell">Commission</th>
                  <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden lg:table-cell">Joined</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {staff.map((s, i) => (
                  <tr key={s.id} className="hover:bg-neutral-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                          <span className="text-[11px] font-black text-white">{getInitials(s)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">
                            {s.full_name ?? <span className="text-neutral-400 italic font-normal">No name</span>}
                          </p>
                          <p className="text-[11px] text-neutral-400">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="font-semibold text-neutral-900">{s.total_accounts}</span>
                      <span className="text-neutral-400 text-[11px] ml-1">total</span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={`font-semibold ${s.converted > 0 ? "text-green-700" : "text-neutral-400"}`}>
                        {s.converted}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className={`font-bold ${s.commission > 0 ? "text-green-700" : "text-neutral-300"}`}>
                        {s.commission > 0 ? `₦${s.commission.toLocaleString()}` : "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-400 text-[11px] hidden lg:table-cell">
                      {formatDate(s.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setConfirm(s)}
                        disabled={deleting === s.id}
                        className="opacity-0 group-hover:opacity-100 text-[11px] font-semibold text-red-400 hover:text-red-600 transition-all disabled:opacity-40"
                      >
                        {deleting === s.id ? "…" : "Remove"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

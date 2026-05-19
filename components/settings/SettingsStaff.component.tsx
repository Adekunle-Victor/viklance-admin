"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authFetch } from "@/lib/api";

interface StaffMember {
  id:         string;
  email:      string;
  full_name:  string | null;
  created_at: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

function initials(s: StaffMember) {
  const name = s.full_name ?? s.email;
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function SettingsStaff() {
  const [staff, setStaff]             = useState<StaffMember[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [deleting, setDeleting]       = useState<string | null>(null);
  const [confirm, setConfirm]         = useState<StaffMember | null>(null);

  const [form, setForm]         = useState({ email: "", password: "", full_name: "" });
  const [showPass, setShowPass] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setError(null);
    };

  useEffect(() => {
    authFetch("/api/staff")
      .then((r) => r.json())
      .then((d) => setStaff(Array.isArray(d) ? d : []))
      .finally(() => setLoadingList(false));
  }, []);

  const createStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    const res = await authFetch("/api/staff", { method: "POST", body: JSON.stringify(form) });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) { setError(data.error ?? "Failed to create staff"); return; }
    setStaff((prev) => [data, ...prev]);
    setForm({ email: "", password: "", full_name: "" });
    toast.success(`Staff added — ${data.email} can now log in`);
  };

  const deleteStaff = async (member: StaffMember) => {
    setConfirm(null);
    setDeleting(member.id);
    const res = await authFetch(`/api/staff/${member.id}`, { method: "DELETE" });
    setDeleting(null);
    if (res.ok) {
      setStaff((prev) => prev.filter((s) => s.id !== member.id));
      toast.success(`${member.email} removed`);
    } else {
      toast.error("Failed to remove staff");
    }
  };

  return (
    <>
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
              <h2 className="text-sm font-black text-neutral-900 mb-1">Remove staff member?</h2>
              <p className="text-sm text-neutral-500">
                <span className="font-semibold text-neutral-700">{confirm.full_name ?? confirm.email}</span> will lose access to the admin panel immediately.
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
                onClick={() => deleteStaff(confirm)}
                className="flex-1 py-3.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        {/* Left — Add staff form */}
        <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100">
            <h2 className="text-sm font-black text-neutral-900">Add Staff Member</h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">They'll be able to log in and register prospects.</p>
          </div>

          <form onSubmit={createStaff} className="p-6 flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M7 4.5v3M7 9v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">Full name</label>
              <input
                type="text"
                value={form.full_name}
                onChange={set("full_name")}
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
                onChange={set("email")}
                placeholder="staff@viklance.dev"
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
                  onChange={set("password")}
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

            <button
              type="submit"
              disabled={creating}
              className="mt-1 w-full bg-neutral-900 text-white text-sm font-bold py-3 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {creating ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="22" strokeDashoffset="10" strokeLinecap="round" />
                  </svg>
                  Adding…
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Add staff member
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right — Staff list */}
        <div className="lg:col-span-3 bg-white border border-neutral-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-neutral-900">Current Staff</h2>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {loadingList ? "Loading…" : `${staff.length} member${staff.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {loadingList ? (
            <div className="p-6 flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 animate-pulse shrink-0" />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="h-3 bg-neutral-100 rounded animate-pulse w-32" />
                    <div className="h-2.5 bg-neutral-100 rounded animate-pulse w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : staff.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="10" cy="7" r="4" stroke="#d4d4d4" strokeWidth="1.5" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-neutral-400">No staff members yet</p>
              <p className="text-[11px] text-neutral-300 mt-1">Add your first staff member using the form.</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {staff.map((s) => (
                <div key={s.id} className="flex items-center gap-4 px-6 py-4 hover:bg-neutral-50 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-black text-white">{initials(s)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 truncate">
                      {s.full_name ?? <span className="text-neutral-400 italic">No name</span>}
                    </p>
                    <p className="text-[11px] text-neutral-400 truncate">{s.email}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-neutral-300 hidden sm:block">{formatDate(s.created_at)}</span>
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-neutral-100 text-neutral-500 px-2 py-1 rounded-full">
                      Staff
                    </span>
                    <button
                      onClick={() => setConfirm(s)}
                      disabled={deleting === s.id}
                      className="opacity-0 group-hover:opacity-100 text-[11px] font-semibold text-red-400 hover:text-red-600 transition-all disabled:opacity-40"
                    >
                      {deleting === s.id ? "…" : "Remove"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}

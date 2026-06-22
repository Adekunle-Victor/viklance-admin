"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createAccount, clearError } from "@/store/slices/accounts.slice";
import { SOURCES, PRODUCTS } from "@/lib/accounts.types";
import toast from "react-hot-toast";

interface AddAccountDrawerProps {
  onClose: () => void;
}

export default function AddAccountDrawer({ onClose }: AddAccountDrawerProps) {
  const dispatch = useAppDispatch();
  const error    = useAppSelector((s) => s.accounts.error);

  const [form, setForm] = useState({
    name:           "",
    contact_person: "",
    phone:          "",
    email:          "",
    source:         "Other" as typeof SOURCES[number],
    product:        "Other" as typeof PRODUCTS[number],
    notes:          "",
  });
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof typeof form>(field: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (error) dispatch(clearError());
    };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await dispatch(createAccount({
      name:           form.name,
      contact_person: form.contact_person || undefined,
      phone:          form.phone          || undefined,
      email:          form.email          || undefined,
      source:         form.source,
      product:        form.product,
      notes:          form.notes          || undefined,
    }));
    setLoading(false);
    if (createAccount.fulfilled.match(result)) {
      toast.success("Account added");
      onClose();
    } else {
      toast.error((result.payload as string) || "Failed to add");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-neutral-200 flex flex-col shadow-xl">

        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200 shrink-0">
          <p className="text-sm font-black text-neutral-900">Add Account</p>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={submit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">
              Name <span className="text-red-400">*</span>
            </label>
            <input type="text" required value={form.name} onChange={set("name")} placeholder="Company or person name"
              className="border border-neutral-300 bg-white rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">Contact Person</label>
            <input type="text" value={form.contact_person} onChange={set("contact_person")} placeholder="e.g. Jane Doe, Head of Marketing"
              className="border border-neutral-300 bg-white rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">Source</label>
              <select value={form.source} onChange={set("source")}
                className="border border-neutral-300 bg-white rounded-xl px-3 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-600 transition-colors">
                {SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">Product</label>
              <select value={form.product} onChange={set("product")}
                className="border border-neutral-300 bg-white rounded-xl px-3 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-600 transition-colors">
                {PRODUCTS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">Phone</label>
            <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+234 800 000 0000"
              className="border border-neutral-300 bg-white rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">Email</label>
            <input type="email" value={form.email} onChange={set("email")} placeholder="contact@company.com"
              className="border border-neutral-300 bg-white rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">Notes</label>
            <textarea value={form.notes} onChange={set("notes")} rows={3} placeholder="Context about this account…"
              className="border border-neutral-300 bg-white rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 bg-neutral-900 text-white text-sm font-bold py-3 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="22" strokeDashoffset="10" strokeLinecap="round" />
                  </svg>
                  Adding…
                </>
              ) : "Add Account"}
            </button>
            <button type="button" onClick={onClose}
              className="flex-1 border border-neutral-200 text-neutral-700 text-sm font-semibold py-3 rounded-xl hover:border-neutral-400 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

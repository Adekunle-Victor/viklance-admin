"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { createProspect, clearError } from "@/store/slices/prospects.slice";
import { useAppSelector } from "@/store/hooks";
import toast from "react-hot-toast";

interface AddProspectDrawerProps {
  onClose: () => void;
}

export default function AddProspectDrawer({ onClose }: AddProspectDrawerProps) {
  const dispatch = useAppDispatch();
  const error    = useAppSelector((s) => s.prospects.error);

  const [form, setForm] = useState({
    instagram_handle: "",
    name:             "",
    phone:            "",
    email:            "",
    notes:            "",
  });
  const [loading, setLoading] = useState(false);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) dispatch(clearError());
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await dispatch(createProspect({
      instagram_handle: form.instagram_handle,
      name:             form.name,
      phone:            form.phone || undefined,
      email:            form.email || undefined,
      notes:            form.notes || undefined,
    }));
    setLoading(false);
    if (createProspect.fulfilled.match(result)) {
      toast.success(`Prospect added — @${form.instagram_handle} registered`);
      onClose();
    } else {
      toast.error((result.payload as string) || "Failed to add");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-neutral-200 flex flex-col shadow-xl">

        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200 shrink-0">
          <p className="text-sm font-black text-neutral-900">Add Prospect</p>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">
              Instagram Handle <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">@</span>
              <input
                type="text"
                required
                value={form.instagram_handle}
                onChange={set("instagram_handle")}
                placeholder="username"
                className="w-full border border-neutral-300 bg-white rounded-xl pl-8 pr-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={set("name")}
              placeholder="Jane Doe"
              className="border border-neutral-300 bg-white rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">
              Phone <span className="text-neutral-300">(optional)</span>
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={set("phone")}
              placeholder="+234 800 000 0000"
              className="border border-neutral-300 bg-white rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">
              Email <span className="text-neutral-300">(optional)</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="jane@example.com"
              className="border border-neutral-300 bg-white rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">
              Notes <span className="text-neutral-300">(optional)</span>
            </label>
            <textarea
              value={form.notes}
              onChange={set("notes")}
              rows={3}
              placeholder="What they do, why they might need us..."
              className="border border-neutral-300 bg-white rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors resize-none"
            />
          </div>

          <p className="text-[11px] text-neutral-400 leading-relaxed -mt-2">
            If this Instagram account is already registered by another rep, the submission will be rejected.
          </p>

          {/* Footer */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-neutral-900 text-white text-sm font-bold py-3 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="22" strokeDashoffset="10" strokeLinecap="round" />
                  </svg>
                  Adding...
                </>
              ) : "Add prospect"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-neutral-200 text-neutral-700 text-sm font-semibold py-3 rounded-xl hover:border-neutral-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

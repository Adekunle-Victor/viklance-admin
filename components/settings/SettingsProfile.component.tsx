"use client";

import { useState } from "react";

export default function SettingsProfile() {
  const [saved, setSaved] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8">
      <h2 className="text-sm font-black text-neutral-900 mb-1">Admin Profile</h2>
      <p className="text-[11px] text-neutral-500 mb-6">Update your name, email, and password.</p>

      <form onSubmit={submit} className="flex flex-col gap-4 max-w-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">First name</label>
            <input
              type="text"
              defaultValue="Admin"
              className="border border-neutral-300 bg-white rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-600 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">Last name</label>
            <input
              type="text"
              defaultValue="Viklance"
              className="border border-neutral-300 bg-white rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-600 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">Email</label>
          <input
            type="email"
            defaultValue="admin@viklance.dev"
            className="border border-neutral-300 bg-white rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-600 transition-colors"
          />
        </div>

        <div className="border-t border-neutral-100 pt-4 flex flex-col gap-4">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">Change Password</p>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">Current password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="border border-neutral-300 bg-white rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">New password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="border border-neutral-300 bg-white rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">Confirm password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="border border-neutral-300 bg-white rounded-xl px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="bg-neutral-900 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-neutral-700 transition-colors"
          >
            Save changes
          </button>
          {saved && <p className="text-sm text-green-600 font-semibold">Saved!</p>}
        </div>
      </form>
    </div>
  );
}

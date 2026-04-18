"use client";

import { useState } from "react";

export default function SettingsReferral() {
  const [fee, setFee]         = useState("100000");
  const [window_, setWindow]  = useState("30");
  const [saved, setSaved]     = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8">
      <h2 className="text-sm font-black text-neutral-900 mb-1">Referral Program</h2>
      <p className="text-[11px] text-neutral-500 mb-6">Configure payout amount and cookie tracking window.</p>

      <form onSubmit={submit} className="flex flex-col gap-4 max-w-md">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">
            Flat fee per conversion (₦)
          </label>
          <input
            type="number"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            className="border border-neutral-300 bg-white rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-600 transition-colors"
          />
          <p className="text-[11px] text-neutral-400">Currently: ₦{Number(fee).toLocaleString()} per signed contract</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-600">
            Cookie tracking window (days)
          </label>
          <input
            type="number"
            value={window_}
            onChange={(e) => setWindow(e.target.value)}
            className="border border-neutral-300 bg-white rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-600 transition-colors"
          />
          <p className="text-[11px] text-neutral-400">Referral attribution window after first click</p>
        </div>

        <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">Payout Methods</p>
          {["Bank Transfer", "Paystack", "PayPal"].map((method) => (
            <label key={method} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-neutral-300 accent-neutral-900"
              />
              <span className="text-sm font-semibold text-neutral-700">{method}</span>
            </label>
          ))}
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

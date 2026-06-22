"use client";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">General configuration.</p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="2.5" stroke="#d4d4d4" strokeWidth="1.4" />
            <path d="M9 2v1.5M9 14.5V16M2 9h1.5M14.5 9H16M3.9 3.9l1 1M13.1 13.1l1 1M14.1 3.9l-1 1M4.9 13.1l-1 1" stroke="#d4d4d4" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-neutral-400">More settings coming soon</p>
        <p className="text-[11px] text-neutral-300 mt-1">To manage team members, go to the Staff page.</p>
      </div>
    </div>
  );
}

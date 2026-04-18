"use client";

import { usePathname } from "next/navigation";

const pageLabels: Record<string, string> = {
  "/dashboard":            "Overview",
  "/dashboard/leads":      "Leads",
  "/dashboard/projects":   "Projects",
  "/dashboard/referrals":  "Referrals",
  "/dashboard/payouts":    "Payouts",
  "/dashboard/settings":   "Settings",
};

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const label    = pageLabels[pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-neutral-200 flex items-center px-6 gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-neutral-600 hover:text-neutral-900 transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <p className="text-sm font-semibold text-neutral-500 hidden sm:block">{label}</p>

      <div className="ml-auto flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-neutral-900">Admin</p>
          <p className="text-[11px] text-neutral-400">admin@viklance.dev</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center">
          <span className="text-[11px] font-black text-white">A</span>
        </div>
      </div>
    </header>
  );
}

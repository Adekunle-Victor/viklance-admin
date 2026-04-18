"use client";

import { ALL_LEADS } from "@/lib/leads.types";

export const TABS = ["All", "New", "In Review", "Replied", "Closed"] as const;
export type Tab = typeof TABS[number];

interface LeadsFiltersProps {
  tab:      Tab;
  search:   string;
  onTab:    (t: Tab) => void;
  onSearch: (s: string) => void;
}

export default function LeadsFilters({ tab, search, onTab, onSearch }: LeadsFiltersProps) {
  const counts = TABS.map((t) => ({
    tab: t,
    count: t === "All" ? ALL_LEADS.length : ALL_LEADS.filter((l) => l.status === t).length,
  }));

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1 max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" />
          <path d="M9.5 9.5l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, email, company..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full border border-neutral-300 bg-white rounded-xl pl-9 pr-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors"
        />
      </div>

      <div className="flex items-center gap-1 bg-neutral-100 border border-neutral-200 rounded-xl p-1">
        {counts.map(({ tab: t, count }) => (
          <button
            key={t}
            onClick={() => onTab(t)}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap
              ${tab === t ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
          >
            {t} <span className="ml-1 opacity-60">{count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

export const FILTER_TABS = ["All", "Paid", "Pending", "—"] as const;
export type FilterTab = typeof FILTER_TABS[number];

interface ReferralsFiltersProps {
  search:   string;
  filter:   FilterTab;
  onSearch: (s: string) => void;
  onFilter: (f: FilterTab) => void;
}

export default function ReferralsFilters({ search, filter, onSearch, onFilter }: ReferralsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1 max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" />
          <path d="M9.5 9.5l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, code, email..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full border border-neutral-300 bg-white rounded-xl pl-9 pr-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors"
        />
      </div>

      <div className="flex items-center gap-1 bg-neutral-100 border border-neutral-200 rounded-xl p-1">
        {FILTER_TABS.map((f) => (
          <button
            key={f}
            onClick={() => onFilter(f)}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap
              ${filter === f ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
          >
            {f === "—" ? "No Activity" : f}
          </button>
        ))}
      </div>
    </div>
  );
}

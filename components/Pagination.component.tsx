"use client";

interface PaginationProps {
  page:      number;
  total:     number;
  pageSize:  number;
  onChange:  (page: number) => void;
}

export default function Pagination({ page, total, pageSize, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end   = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100">
      <p className="text-[11px] text-neutral-400 font-medium">
        Showing <span className="text-neutral-700 font-semibold">{start}–{end}</span> of <span className="text-neutral-700 font-semibold">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M8.5 10.5L5 7l3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
          if (totalPages > 7 && Math.abs(p - page) > 2 && p !== 1 && p !== totalPages) {
            if (p === 2 || p === totalPages - 1) return <span key={p} className="text-neutral-300 text-xs px-1">…</span>;
            return null;
          }
          return (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-[11px] font-bold transition-all
                ${p === page
                  ? "bg-neutral-900 text-white"
                  : "border border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-900"}`}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-900 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5.5 3.5L9 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

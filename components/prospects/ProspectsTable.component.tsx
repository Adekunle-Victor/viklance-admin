"use client";

import { useState } from "react";
import { Prospect, STATUS_COLORS } from "@/lib/prospects.types";
import Pagination from "@/components/Pagination.component";

const PAGE_SIZE = 10;

interface ProspectsTableProps {
  prospects: Prospect[];
  loading:   boolean;
  isAdmin:   boolean;
  onSelect:  (p: Prospect) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function ProspectsTable({ prospects, loading, isAdmin, onSelect }: ProspectsTableProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(prospects.length / PAGE_SIZE);
  const safePage   = Math.min(page, Math.max(1, totalPages));
  const paginated  = prospects.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 w-10">#</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Instagram</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden sm:table-cell">Name</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden md:table-cell">Contact</th>
              {isAdmin && (
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden lg:table-cell">Rep</th>
              )}
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden lg:table-cell">Added</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Status</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: isAdmin ? 8 : 7 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-3 bg-neutral-100 rounded animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 8 : 7} className="px-6 py-12 text-center text-sm text-neutral-400">
                  No prospects found.
                </td>
              </tr>
            ) : paginated.map((p, i) => (
              <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4 text-[11px] font-semibold text-neutral-300">
                  {(safePage - 1) * PAGE_SIZE + i + 1}
                </td>
                <td className="px-6 py-4">
                  <a
                    href={`https://instagram.com/${p.instagram_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-semibold text-neutral-900 hover:underline"
                  >
                    @{p.instagram_handle}
                  </a>
                </td>
                <td className="px-6 py-4 text-neutral-600 hidden sm:table-cell">{p.name}</td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <p className="text-neutral-500 text-[11px]">{p.email ?? "—"}</p>
                  <p className="text-neutral-400 text-[11px]">{p.phone ?? ""}</p>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-neutral-500 hidden lg:table-cell">{p.assigned_name}</td>
                )}
                <td className="px-6 py-4 text-neutral-400 hidden lg:table-cell">{formatDate(p.created_at)}</td>
                <td className="px-6 py-4">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onSelect(p)}
                    className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    View →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={safePage} total={prospects.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Referrer, PAYOUT_COLORS } from "@/lib/referrals.types";
import Pagination from "@/components/Pagination.component";

const PAGE_SIZE = 10;

interface ReferralsTableProps {
  referrers: Referrer[];
  loading:   boolean;
  onSelect:  (r: Referrer) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function ReferralsTable({ referrers, loading, onSelect }: ReferralsTableProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(referrers.length / PAGE_SIZE);
  const safePage   = Math.min(page, Math.max(1, totalPages));
  const paginated  = referrers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 w-10">#</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Referrer</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden sm:table-cell">Code</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Clicks</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden md:table-cell">Leads</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden md:table-cell">Conversions</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden lg:table-cell">Earned</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Payout</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-3 bg-neutral-100 rounded animate-pulse w-20" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-sm text-neutral-400">No referrers found.</td>
              </tr>
            ) : paginated.map((r, i) => (
              <tr key={r.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4 text-[11px] font-semibold text-neutral-300">{(safePage - 1) * PAGE_SIZE + i + 1}</td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-neutral-900">{r.name}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{r.email}</p>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <span className="font-mono text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded-lg">{r.code}</span>
                </td>
                <td className="px-6 py-4 font-semibold text-neutral-900">{r.clicks}</td>
                <td className="px-6 py-4 text-neutral-500 hidden md:table-cell">{r.leads}</td>
                <td className="px-6 py-4 text-neutral-500 hidden md:table-cell">{r.conversions}</td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <span className={`font-bold ${Number(r.earned) === 0 ? "text-neutral-300" : "text-green-700"}`}>
                    {Number(r.earned) === 0 ? "—" : `₦${Number(r.earned).toLocaleString()}`}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${PAYOUT_COLORS[r.payout_status]}`}>
                    {r.payout_status === "None" ? "—" : r.payout_status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onSelect(r)}
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
      <Pagination page={safePage} total={referrers.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}

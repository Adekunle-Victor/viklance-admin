"use client";

import { Referrer, PAYOUT_COLORS } from "@/lib/referrals.types";

interface ReferralsTableProps {
  referrers: Referrer[];
  onSelect:  (r: Referrer) => void;
}

export default function ReferralsTable({ referrers, onSelect }: ReferralsTableProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100">
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
            {referrers.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-sm text-neutral-400">No referrers found.</td>
              </tr>
            ) : referrers.map((r) => (
              <tr key={r.id} className="hover:bg-neutral-50 transition-colors">
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
                  <span className={`font-bold ${r.earned === 0 ? "text-neutral-300" : "text-green-700"}`}>
                    {r.earned === 0 ? "—" : `₦${r.earned.toLocaleString()}`}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${PAYOUT_COLORS[r.payoutStatus]}`}>
                    {r.payoutStatus}
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
    </div>
  );
}

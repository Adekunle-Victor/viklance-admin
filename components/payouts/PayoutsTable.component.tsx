"use client";

import { Payout, PAYOUT_STATUS_COLORS } from "@/lib/payouts.types";

interface PayoutsTableProps {
  payouts:   Payout[];
  onMarkPaid: (id: number) => void;
  onReject:   (id: number) => void;
}

export default function PayoutsTable({ payouts, onMarkPaid, onReject }: PayoutsTableProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Referrer</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden sm:table-cell">Code</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Amount</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden md:table-cell">Method</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden lg:table-cell">Requested</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden lg:table-cell">Paid On</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Status</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {payouts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-sm text-neutral-400">No payouts found.</td>
              </tr>
            ) : payouts.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-neutral-900">{p.referrer}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{p.email}</p>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <span className="font-mono text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded-lg">{p.code}</span>
                </td>
                <td className="px-6 py-4 font-bold text-neutral-900">₦{p.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-neutral-500 hidden md:table-cell">{p.method}</td>
                <td className="px-6 py-4 text-neutral-400 hidden lg:table-cell">{p.requested}</td>
                <td className="px-6 py-4 text-neutral-400 hidden lg:table-cell">{p.paid ?? "—"}</td>
                <td className="px-6 py-4">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${PAYOUT_STATUS_COLORS[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {p.status === "Pending" && (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onMarkPaid(p.id)}
                        className="text-[11px] font-bold text-green-700 hover:text-green-900 transition-colors"
                      >
                        Approve
                      </button>
                      <span className="text-neutral-200">|</span>
                      <button
                        onClick={() => onReject(p.id)}
                        className="text-[11px] font-bold text-red-500 hover:text-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

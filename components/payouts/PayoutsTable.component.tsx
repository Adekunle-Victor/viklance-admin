"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updatePayoutStatus } from "@/store/slices/payouts.slice";
import { Payout, PAYOUT_STATUS_COLORS } from "@/lib/payouts.types";
import { gooeyToast } from "goey-toast";
import Pagination from "@/components/Pagination.component";

const PAGE_SIZE = 10;

interface PayoutsTableProps {
  payouts:  Payout[];
  loading:  boolean;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function PayoutsTable({ payouts, loading }: PayoutsTableProps) {
  const dispatch        = useAppDispatch();
  const [busy, setBusy] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(payouts.length / PAGE_SIZE);
  const safePage   = Math.min(page, Math.max(1, totalPages));
  const paginated  = payouts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleAction = async (id: number, status: "Paid" | "Rejected") => {
    setBusy(id);
    const result = await dispatch(updatePayoutStatus({ id: String(id), status }));
    setBusy(null);
    if (updatePayoutStatus.fulfilled.match(result)) {
      gooeyToast.success(
        status === "Paid" ? "Payout approved" : "Payout rejected",
        { description: status === "Paid" ? "Marked as paid successfully." : "This request has been rejected." }
      );
    } else {
      gooeyToast.error("Action failed", { description: "Could not update payout." });
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 w-10">#</th>
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
                <td colSpan={9} className="px-6 py-12 text-center text-sm text-neutral-400">No payouts found.</td>
              </tr>
            ) : paginated.map((p, i) => (
              <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4 text-[11px] font-semibold text-neutral-300">{(safePage - 1) * PAGE_SIZE + i + 1}</td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-neutral-900">{p.referrer_name ?? "—"}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{p.referrer_email ?? p.ref_code}</p>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <span className="font-mono text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded-lg">{p.ref_code}</span>
                </td>
                <td className="px-6 py-4 font-bold text-neutral-900">₦{p.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-neutral-500 hidden md:table-cell">{p.method}</td>
                <td className="px-6 py-4 text-neutral-400 hidden lg:table-cell">{formatDate(p.created_at)}</td>
                <td className="px-6 py-4 text-neutral-400 hidden lg:table-cell">{formatDate(p.paid_at)}</td>
                <td className="px-6 py-4">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${PAYOUT_STATUS_COLORS[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {p.status === "Pending" && (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        disabled={busy === p.id}
                        onClick={() => handleAction(p.id, "Paid")}
                        className="text-[11px] font-bold text-green-700 hover:text-green-900 transition-colors disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <span className="text-neutral-200">|</span>
                      <button
                        disabled={busy === p.id}
                        onClick={() => handleAction(p.id, "Rejected")}
                        className="text-[11px] font-bold text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
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
      <Pagination page={safePage} total={payouts.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}

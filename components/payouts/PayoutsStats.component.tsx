"use client";

import { Payout } from "@/lib/payouts.types";

interface PayoutsStatsProps {
  payouts: Payout[];
}

export default function PayoutsStats({ payouts }: PayoutsStatsProps) {
  const pending      = payouts.filter((p) => p.status === "Pending");
  const paid         = payouts.filter((p) => p.status === "Paid");
  const totalPending = pending.reduce((a, p) => a + p.amount, 0);
  const totalPaid    = paid.reduce((a, p) => a + p.amount, 0);

  const stats = [
    { label: "Pending Requests", value: pending.length.toString()           },
    { label: "Amount Pending",   value: `₦${totalPending.toLocaleString()}` },
    { label: "Paid Out",         value: paid.length.toString()              },
    { label: "Total Paid",       value: `₦${totalPaid.toLocaleString()}`    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-white border border-neutral-200 rounded-2xl p-5">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-2">{s.label}</p>
          <p className="text-2xl font-black text-neutral-900 tracking-tight">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

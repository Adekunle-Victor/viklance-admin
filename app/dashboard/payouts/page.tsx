"use client";

import { useState } from "react";
import { ALL_PAYOUTS, Payout, PayoutStatus } from "@/lib/payouts.types";
import PayoutsStats from "@/components/payouts/PayoutsStats.component";
import PayoutsTable from "@/components/payouts/PayoutsTable.component";

const TABS = ["All", "Pending", "Paid", "Rejected"] as const;
type Tab = typeof TABS[number];

export default function PayoutsPage() {
  const [tab, setTab]       = useState<Tab>("All");
  const [payouts, setPayouts] = useState<Payout[]>(ALL_PAYOUTS);

  const filtered = payouts.filter((p) => tab === "All" || p.status === tab);

  const markPaid = (id: number) =>
    setPayouts((prev) => prev.map((p) => p.id === id ? { ...p, status: "Paid" as PayoutStatus, paid: "Today" } : p));

  const reject = (id: number) =>
    setPayouts((prev) => prev.map((p) => p.id === id ? { ...p, status: "Rejected" as PayoutStatus } : p));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Payouts</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage referral payout requests.</p>
      </div>

      <PayoutsStats />

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-neutral-100 border border-neutral-200 rounded-xl p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap
              ${tab === t ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
          >
            {t}
            <span className="ml-1 opacity-60">
              {t === "All" ? payouts.length : payouts.filter((p) => p.status === t).length}
            </span>
          </button>
        ))}
      </div>

      <PayoutsTable payouts={filtered} onMarkPaid={markPaid} onReject={reject} />
    </div>
  );
}

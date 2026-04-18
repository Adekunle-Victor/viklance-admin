"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPayouts } from "@/store/slices/payouts.slice";
import PayoutsStats from "@/components/payouts/PayoutsStats.component";
import PayoutsTable from "@/components/payouts/PayoutsTable.component";

const TABS = ["All", "Pending", "Paid", "Rejected"] as const;
type Tab = typeof TABS[number];

export default function PayoutsPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.payouts);

  const [tab, setTab] = useState<Tab>("All");

  useEffect(() => {
    dispatch(fetchPayouts());
  }, [dispatch]);

  const filtered = items.filter((p) => tab === "All" || p.status === tab);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Payouts</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {loading ? "Loading…" : "Manage referral payout requests."}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <PayoutsStats payouts={items} />

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
              {t === "All" ? items.length : items.filter((p) => p.status === t).length}
            </span>
          </button>
        ))}
      </div>

      <PayoutsTable payouts={filtered} loading={loading} />
    </div>
  );
}

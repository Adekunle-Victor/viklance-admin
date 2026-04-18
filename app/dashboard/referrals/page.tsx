"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchReferrers } from "@/store/slices/referrals.slice";
import { Referrer } from "@/lib/referrals.types";
import ReferralsStats from "@/components/referrals/ReferralsStats.component";
import ReferralsFilters, { FilterTab } from "@/components/referrals/ReferralsFilters.component";
import ReferralsTable from "@/components/referrals/ReferralsTable.component";
import ReferralDrawer from "@/components/referrals/ReferralDrawer.component";

export default function ReferralsPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.referrals);

  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState<FilterTab>("All");
  const [selected, setSelected] = useState<Referrer | null>(null);

  useEffect(() => {
    dispatch(fetchReferrers());
  }, [dispatch]);

  const filtered = items.filter((r) => {
    const matchFilter = filter === "All" || r.payout_status === filter;
    const matchSearch = search === "" ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Referrals</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {loading ? "Loading…" : "Track referrers, conversions, and payouts."}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <ReferralsStats referrers={items} />
      <ReferralsFilters search={search} filter={filter} onSearch={setSearch} onFilter={setFilter} />
      <ReferralsTable referrers={filtered} loading={loading} onSelect={setSelected} />

      {selected && (
        <ReferralDrawer
          referrer={selected}
          onClose={() => setSelected(null)}
          onPaid={(updated) => setSelected(updated)}
        />
      )}
    </div>
  );
}

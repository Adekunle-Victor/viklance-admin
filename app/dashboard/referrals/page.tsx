"use client";

import { useState } from "react";
import { ALL_REFERRERS, Referrer } from "@/lib/referrals.types";
import ReferralsStats from "@/components/referrals/ReferralsStats.component";
import ReferralsFilters, { FilterTab } from "@/components/referrals/ReferralsFilters.component";
import ReferralsTable from "@/components/referrals/ReferralsTable.component";
import ReferralDrawer from "@/components/referrals/ReferralDrawer.component";

export default function ReferralsPage() {
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState<FilterTab>("All");
  const [selected, setSelected] = useState<Referrer | null>(null);

  const filtered = ALL_REFERRERS.filter((r) => {
    const matchFilter = filter === "All" || r.payoutStatus === filter;
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
        <p className="text-sm text-neutral-500 mt-1">Track referrers, conversions, and payouts.</p>
      </div>

      <ReferralsStats />
      <ReferralsFilters search={search} filter={filter} onSearch={setSearch} onFilter={setFilter} />
      <ReferralsTable referrers={filtered} onSelect={setSelected} />

      {selected && <ReferralDrawer referrer={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

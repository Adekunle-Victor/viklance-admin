"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchLeads } from "@/store/slices/leads.slice";
import { Lead } from "@/lib/leads.types";
import LeadsFilters, { Tab } from "@/components/leads/LeadsFilters.component";
import LeadsTable from "@/components/leads/LeadsTable.component";
import LeadDrawer from "@/components/leads/LeadDrawer.component";

export default function LeadsPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.leads);

  const [tab, setTab]           = useState<Tab>("All");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);

  useEffect(() => {
    dispatch(fetchLeads({}));
  }, [dispatch]);

  const filtered = items.filter((l) => {
    const matchTab    = tab === "All" || l.status === tab;
    const matchSearch = search === "" ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      (l.company ?? "").toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Leads</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {loading ? "Loading…" : `${items.length} total inquiries`}
          </p>
        </div>
        <button className="self-start sm:self-auto bg-neutral-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-neutral-700 transition-colors">
          Export CSV
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <LeadsFilters leads={items} tab={tab} search={search} onTab={setTab} onSearch={setSearch} />
      <LeadsTable leads={filtered} loading={loading} onSelect={setSelected} />

      {selected && (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onStatusChange={(updated) => setSelected(updated)}
        />
      )}
    </div>
  );
}

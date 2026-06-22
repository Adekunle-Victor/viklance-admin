"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAccounts } from "@/store/slices/accounts.slice";
import { Account, ACCOUNT_STATUSES } from "@/lib/accounts.types";
import AccountsTable from "@/components/prospects/AccountsTable.component";
import AccountDrawer from "@/components/prospects/AccountDrawer.component";
import AddAccountDrawer from "@/components/prospects/AddAccountDrawer.component";

type Tab = "All" | typeof ACCOUNT_STATUSES[number];
const TABS: Tab[] = ["All", ...ACCOUNT_STATUSES];

export default function AccountsPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((s) => s.accounts);
  const user    = useAppSelector((s) => s.auth.user);
  const isAdmin = user?.user_metadata?.role === "super_admin";

  const [tab,      setTab]      = useState<Tab>("All");
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState<Account | null>(null);
  const [adding,   setAdding]   = useState(false);

  useEffect(() => {
    dispatch(fetchAccounts({}));
  }, [dispatch]);

  const filtered = items.filter((a) => {
    const matchTab    = tab === "All" || a.status === tab;
    const matchSearch = search === "" ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.contact_person ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (a.email ?? "").toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Accounts</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {loading ? "Loading…" : `${items.length} ${isAdmin ? "total across all reps" : "in your pipeline"}`}
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="self-start sm:self-auto bg-neutral-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-neutral-700 transition-colors flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Add Account
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" />
            <path d="M9.5 9.5l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, contact, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-neutral-300 bg-white rounded-xl pl-9 pr-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 bg-neutral-100 border border-neutral-200 rounded-xl p-1 overflow-x-auto">
          {TABS.map((t) => {
            const count = t === "All" ? items.length : items.filter((a) => a.status === t).length;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap
                  ${tab === t ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
              >
                {t} <span className="ml-1 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AccountsTable accounts={filtered} loading={loading} isAdmin={isAdmin} onSelect={setSelected} />

      {selected && (
        <AccountDrawer
          account={selected}
          isAdmin={isAdmin}
          onClose={() => setSelected(null)}
          onUpdated={(updated) => setSelected(updated)}
        />
      )}

      {adding && <AddAccountDrawer onClose={() => setAdding(false)} />}
    </div>
  );
}

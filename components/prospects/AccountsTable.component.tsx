"use client";

import { useState } from "react";
import { Account, STATUS_COLORS, SOURCE_COLORS } from "@/lib/accounts.types";
import Pagination from "@/components/Pagination.component";

const PAGE_SIZE = 25;

interface AccountsTableProps {
  accounts: Account[];
  loading:  boolean;
  isAdmin:  boolean;
  onSelect: (a: Account) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function AccountsTable({ accounts, loading, isAdmin, onSelect }: AccountsTableProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(accounts.length / PAGE_SIZE);
  const safePage   = Math.min(page, Math.max(1, totalPages));
  const paginated  = accounts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const colCount = isAdmin ? 8 : 7;

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 w-10">#</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Name</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden sm:table-cell">Contact</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden md:table-cell">Source</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden md:table-cell">Product</th>
              {isAdmin && (
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden lg:table-cell">Rep</th>
              )}
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden lg:table-cell">Added</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Status</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: colCount }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-3 bg-neutral-100 rounded animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="px-6 py-12 text-center text-sm text-neutral-400">
                  No accounts found.
                </td>
              </tr>
            ) : paginated.map((a, i) => (
              <tr key={a.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4 text-[11px] font-semibold text-neutral-300">
                  {(safePage - 1) * PAGE_SIZE + i + 1}
                </td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-neutral-900">{a.name}</p>
                  {a.contact_person && <p className="text-[11px] text-neutral-400">{a.contact_person}</p>}
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <p className="text-neutral-500 text-[11px]">{a.email ?? "—"}</p>
                  <p className="text-neutral-400 text-[11px]">{a.phone ?? ""}</p>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${SOURCE_COLORS[a.source]}`}>
                    {a.source}
                  </span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-neutral-50 text-neutral-600 border-neutral-200">
                    {a.product}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 text-neutral-500 hidden lg:table-cell">{a.assigned_name}</td>
                )}
                <td className="px-6 py-4 text-neutral-400 hidden lg:table-cell">{formatDate(a.created_at)}</td>
                <td className="px-6 py-4">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[a.status]}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => onSelect(a)} className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors">
                    View →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={safePage} total={accounts.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}

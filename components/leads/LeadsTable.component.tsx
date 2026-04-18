"use client";

import { useState } from "react";
import { Lead, STATUS_COLORS } from "@/lib/leads.types";
import Pagination from "@/components/Pagination.component";

const PAGE_SIZE = 10;

interface LeadsTableProps {
  leads:    Lead[];
  loading:  boolean;
  onSelect: (lead: Lead) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function LeadsTable({ leads, loading, onSelect }: LeadsTableProps) {
  const [page, setPage] = useState(1);

  const totalPages  = Math.ceil(leads.length / PAGE_SIZE);
  const safePage    = Math.min(page, Math.max(1, totalPages));
  const paginated   = leads.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 w-10">#</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Name</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden sm:table-cell">Company</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden md:table-cell">Service</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden lg:table-cell">Budget</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden lg:table-cell">Date</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Status</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-3 bg-neutral-100 rounded animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-sm text-neutral-400">No leads found.</td>
              </tr>
            ) : paginated.map((lead, i) => (
              <tr key={lead.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4 text-[11px] font-semibold text-neutral-300">{(safePage - 1) * PAGE_SIZE + i + 1}</td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-neutral-900">{lead.name}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{lead.email}</p>
                </td>
                <td className="px-6 py-4 text-neutral-500 hidden sm:table-cell">{lead.company ?? "—"}</td>
                <td className="px-6 py-4 text-neutral-500 hidden md:table-cell">{lead.service}</td>
                <td className="px-6 py-4 text-neutral-500 hidden lg:table-cell">{lead.budget ?? "—"}</td>
                <td className="px-6 py-4 text-neutral-400 hidden lg:table-cell">{formatDate(lead.created_at)}</td>
                <td className="px-6 py-4">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => onSelect(lead)} className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors">
                    View →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={safePage} total={leads.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}

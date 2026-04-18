"use client";

import { Lead, STATUS_COLORS } from "@/lib/leads.types";

interface LeadsTableProps {
  leads:    Lead[];
  onSelect: (lead: Lead) => void;
}

export default function LeadsTable({ leads, onSelect }: LeadsTableProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100">
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
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-neutral-400">
                  No leads found.
                </td>
              </tr>
            ) : leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-neutral-900">{lead.name}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{lead.email}</p>
                </td>
                <td className="px-6 py-4 text-neutral-500 hidden sm:table-cell">{lead.company}</td>
                <td className="px-6 py-4 text-neutral-500 hidden md:table-cell">{lead.service}</td>
                <td className="px-6 py-4 text-neutral-500 hidden lg:table-cell">{lead.budget}</td>
                <td className="px-6 py-4 text-neutral-400 hidden lg:table-cell">{lead.date}</td>
                <td className="px-6 py-4">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onSelect(lead)}
                    className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    View →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

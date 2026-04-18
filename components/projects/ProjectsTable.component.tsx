"use client";

import { useState } from "react";
import { Project, PROJECT_STATUS_COLORS } from "@/lib/projects.types";
import Pagination from "@/components/Pagination.component";

const PAGE_SIZE = 10;

interface ProjectsTableProps {
  projects: Project[];
  loading:  boolean;
  onSelect: (p: Project) => void;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function ProjectsTable({ projects, loading, onSelect }: ProjectsTableProps) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(projects.length / PAGE_SIZE);
  const safePage   = Math.min(page, Math.max(1, totalPages));
  const paginated  = projects.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 w-10">#</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Project</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden sm:table-cell">Client</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden md:table-cell">Service</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden lg:table-cell">Budget</th>
              <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden lg:table-cell">Deadline</th>
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
                <td colSpan={8} className="px-6 py-12 text-center text-sm text-neutral-400">No projects found.</td>
              </tr>
            ) : paginated.map((p, i) => (
              <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4 text-[11px] font-semibold text-neutral-300">{(safePage - 1) * PAGE_SIZE + i + 1}</td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-neutral-900">{p.name}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{p.email}</p>
                </td>
                <td className="px-6 py-4 text-neutral-500 hidden sm:table-cell">{p.client}</td>
                <td className="px-6 py-4 text-neutral-500 hidden md:table-cell">{p.service}</td>
                <td className="px-6 py-4 text-neutral-500 hidden lg:table-cell">{p.budget ?? "—"}</td>
                <td className="px-6 py-4 text-neutral-400 hidden lg:table-cell">{formatDate(p.deadline)}</td>
                <td className="px-6 py-4">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${PROJECT_STATUS_COLORS[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onSelect(p)}
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
      <Pagination page={safePage} total={projects.length} pageSize={PAGE_SIZE} onChange={setPage} />
    </div>
  );
}

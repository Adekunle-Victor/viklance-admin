"use client";

import { Project, PROJECT_STATUS_COLORS } from "@/lib/projects.types";

interface ProjectsTableProps {
  projects: Project[];
  onSelect: (p: Project) => void;
}

export default function ProjectsTable({ projects, onSelect }: ProjectsTableProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100">
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
            {projects.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-sm text-neutral-400">No projects found.</td>
              </tr>
            ) : projects.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-neutral-900">{p.name}</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{p.email}</p>
                </td>
                <td className="px-6 py-4 text-neutral-500 hidden sm:table-cell">{p.client}</td>
                <td className="px-6 py-4 text-neutral-500 hidden md:table-cell">{p.service}</td>
                <td className="px-6 py-4 text-neutral-500 hidden lg:table-cell">{p.budget}</td>
                <td className="px-6 py-4 text-neutral-400 hidden lg:table-cell">{p.deadline}</td>
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
    </div>
  );
}

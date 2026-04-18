"use client";

import { useState } from "react";
import { ALL_PROJECTS, Project, ProjectStatus } from "@/lib/projects.types";
import ProjectsTable from "@/components/projects/ProjectsTable.component";
import ProjectDrawer from "@/components/projects/ProjectDrawer.component";

const TABS = ["All", "In Progress", "Under Review", "Completed", "On Hold"] as const;
type Tab = typeof TABS[number];

const stats = [
  { label: "Total Projects",   value: ALL_PROJECTS.length.toString() },
  { label: "In Progress",      value: ALL_PROJECTS.filter((p) => p.status === "In Progress").length.toString() },
  { label: "Completed",        value: ALL_PROJECTS.filter((p) => p.status === "Completed").length.toString() },
  { label: "Total Value",      value: "₦53,000,000+" },
];

export default function ProjectsPage() {
  const [tab, setTab]           = useState<Tab>("All");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered = ALL_PROJECTS.filter((p) => {
    const matchTab    = tab === "All" || p.status === tab;
    const matchSearch = search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Projects</h1>
          <p className="text-sm text-neutral-500 mt-1">{ALL_PROJECTS.length} total projects</p>
        </div>
        <button className="self-start sm:self-auto bg-neutral-900 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-neutral-700 transition-colors">
          + New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-neutral-200 rounded-2xl p-5">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-2">{s.label}</p>
            <p className="text-2xl font-black text-neutral-900 tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3" />
            <path d="M9.5 9.5l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search by project or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-neutral-300 bg-white rounded-xl pl-9 pr-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-600 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 bg-neutral-100 border border-neutral-200 rounded-xl p-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all whitespace-nowrap
                ${tab === t ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-700"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <ProjectsTable projects={filtered} onSelect={setSelected} />
      {selected && <ProjectDrawer project={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateProjectStatus } from "@/store/slices/projects.slice";
import { Project, ProjectStatus, PROJECT_STATUS_COLORS } from "@/lib/projects.types";
import { gooeyToast } from "goey-toast";

interface ProjectDrawerProps {
  project:        Project;
  onClose:        () => void;
  onStatusChange: (updated: Project) => void;
}

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function ProjectDrawer({ project, onClose, onStatusChange }: ProjectDrawerProps) {
  const dispatch    = useAppDispatch();
  const [busy, setBusy] = useState(false);

  const changeStatus = async (status: ProjectStatus) => {
    if (status === project.status || busy) return;
    setBusy(true);
    const result = await dispatch(updateProjectStatus({ id: String(project.id), status }));
    setBusy(false);
    if (updateProjectStatus.fulfilled.match(result)) {
      gooeyToast.success("Status updated", { description: `Moved to "${status}"` });
      onStatusChange(result.payload as Project);
    } else {
      gooeyToast.error("Update failed", { description: "Could not change project status." });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-neutral-200 flex flex-col shadow-xl">

        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200 shrink-0">
          <p className="text-sm font-black text-neutral-900">Project Detail</p>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-black text-neutral-900 text-lg">{project.name}</p>
              <p className="text-sm text-neutral-500 mt-0.5">{project.client} · {project.email}</p>
            </div>
            <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${PROJECT_STATUS_COLORS[project.status]}`}>
              {project.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Service",  value: project.service              },
              { label: "Budget",   value: project.budget ?? "—"        },
              { label: "Started",  value: formatDate(project.start_date) },
              { label: "Deadline", value: formatDate(project.deadline)  },
            ].map((d) => (
              <div key={d.label} className="bg-neutral-50 border border-neutral-200 rounded-xl p-3">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-1">{d.label}</p>
                <p className="text-sm font-semibold text-neutral-900">{d.value}</p>
              </div>
            ))}
          </div>

          {project.description && (
            <div>
              <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-2">Description</p>
              <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 border border-neutral-200 rounded-xl p-4">
                {project.description}
              </p>
            </div>
          )}

          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-2">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {(["In Progress", "Under Review", "Completed", "On Hold"] as ProjectStatus[]).map((s) => (
                <button
                  key={s}
                  disabled={busy}
                  onClick={() => changeStatus(s)}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all disabled:opacity-50
                    ${project.status === s
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-400"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-neutral-200 shrink-0 flex gap-3">
          <a
            href={`mailto:${project.email}`}
            className="flex-1 bg-neutral-900 text-white text-sm font-bold py-3 rounded-xl text-center hover:bg-neutral-700 transition-colors"
          >
            Email client
          </a>
          <button
            onClick={onClose}
            className="flex-1 border border-neutral-200 text-neutral-700 text-sm font-semibold py-3 rounded-xl hover:border-neutral-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

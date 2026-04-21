"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateProspectStatus, updateProspectNotes } from "@/store/slices/prospects.slice";
import { Prospect, ProspectStatus, PROSPECT_STATUSES, STATUS_COLORS } from "@/lib/prospects.types";
import { gooeyToast } from "goey-toast";

interface ProspectDrawerProps {
  prospect:  Prospect;
  isAdmin:   boolean;
  onClose:   () => void;
  onUpdated: (updated: Prospect) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function ProspectDrawer({ prospect, isAdmin, onClose, onUpdated }: ProspectDrawerProps) {
  const dispatch = useAppDispatch();
  const [busy, setBusy]       = useState(false);
  const [editNotes, setEditNotes] = useState(false);
  const [notes, setNotes]     = useState(prospect.notes ?? "");

  const changeStatus = async (status: ProspectStatus) => {
    if (status === prospect.status || busy) return;
    setBusy(true);
    const result = await dispatch(updateProspectStatus({ id: prospect.id, status }));
    setBusy(false);
    if (updateProspectStatus.fulfilled.match(result)) {
      gooeyToast.success("Status updated", { description: `Moved to "${status}"` });
      onUpdated(result.payload as Prospect);
    } else {
      gooeyToast.error("Update failed", { description: "Could not change status." });
    }
  };

  const saveNotes = async () => {
    setBusy(true);
    const result = await dispatch(updateProspectNotes({ id: prospect.id, notes }));
    setBusy(false);
    if (updateProspectNotes.fulfilled.match(result)) {
      gooeyToast.success("Notes saved");
      setEditNotes(false);
      onUpdated(result.payload as Prospect);
    } else {
      gooeyToast.error("Save failed", { description: "Could not save notes." });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-neutral-200 flex flex-col shadow-xl">

        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200 shrink-0">
          <p className="text-sm font-black text-neutral-900">Prospect Detail</p>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
              <span className="text-sm font-black text-white">{prospect.name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-black text-neutral-900">{prospect.name}</p>
              <a
                href={`https://instagram.com/${prospect.instagram_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-500 hover:text-neutral-900 hover:underline transition-colors"
              >
                @{prospect.instagram_handle}
              </a>
            </div>
            <span className={`ml-auto text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[prospect.status]}`}>
              {prospect.status}
            </span>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Email",   value: prospect.email ?? "—"         },
              { label: "Phone",   value: prospect.phone ?? "—"         },
              { label: "Added",   value: formatDate(prospect.created_at) },
              { label: "Updated", value: formatDate(prospect.updated_at) },
              ...(isAdmin ? [{ label: "Rep", value: prospect.assigned_name }] : []),
            ].map((d) => (
              <div key={d.label} className="bg-neutral-50 border border-neutral-200 rounded-xl p-3">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-1">{d.label}</p>
                <p className="text-sm font-semibold text-neutral-900">{d.value}</p>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">Notes</p>
              {!editNotes && (
                <button
                  onClick={() => setEditNotes(true)}
                  className="text-[11px] font-semibold text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  Edit
                </button>
              )}
            </div>
            {editNotes ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full border border-neutral-300 rounded-xl px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-600 transition-colors resize-none"
                  placeholder="Add notes about this prospect..."
                />
                <div className="flex gap-2">
                  <button
                    disabled={busy}
                    onClick={saveNotes}
                    className="flex-1 bg-neutral-900 text-white text-sm font-bold py-2.5 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => { setEditNotes(false); setNotes(prospect.notes ?? ""); }}
                    className="flex-1 border border-neutral-200 text-neutral-700 text-sm font-semibold py-2.5 rounded-xl hover:border-neutral-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 border border-neutral-200 rounded-xl p-4 min-h-16">
                {prospect.notes || <span className="text-neutral-400 italic">No notes yet.</span>}
              </p>
            )}
          </div>

          {/* Status update */}
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-2">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {PROSPECT_STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={busy}
                  onClick={() => changeStatus(s)}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all disabled:opacity-50
                    ${prospect.status === s
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "border-neutral-200 text-neutral-600 hover:border-neutral-400"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 shrink-0 flex gap-3">
          {prospect.email && (
            <a
              href={`mailto:${prospect.email}`}
              className="flex-1 bg-neutral-900 text-white text-sm font-bold py-3 rounded-xl text-center hover:bg-neutral-700 transition-colors"
            >
              Email
            </a>
          )}
          <a
            href={`https://instagram.com/${prospect.instagram_handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 border border-neutral-200 text-neutral-700 text-sm font-semibold py-3 rounded-xl text-center hover:border-neutral-400 transition-colors"
          >
            Instagram ↗
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

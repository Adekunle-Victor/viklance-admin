"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateLeadStatus, markDemoReady } from "@/store/slices/leads.slice";
import { Lead, LeadStatus, STATUS_COLORS } from "@/lib/leads.types";
import { gooeyToast } from "goey-toast";

interface LeadDrawerProps {
  lead:           Lead;
  onClose:        () => void;
  onStatusChange: (updated: Lead) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function LeadDrawer({ lead, onClose, onStatusChange }: LeadDrawerProps) {
  const dispatch = useAppDispatch();
  const role     = useAppSelector((s) => s.auth.role);

  const [busy,    setBusy]    = useState(false);
  const [demoUrl, setDemoUrl] = useState(lead.demo_url ?? "");
  const [demoSaving, setDemoSaving] = useState(false);

  const saveDemoReady = async () => {
    if (!demoUrl.trim() || demoSaving) return;
    setDemoSaving(true);
    const result = await dispatch(markDemoReady({ id: String(lead.id), demo_url: demoUrl.trim() }));
    setDemoSaving(false);
    if (markDemoReady.fulfilled.match(result)) {
      gooeyToast.success("Demo marked as ready", { description: "All staff have been notified." });
      onStatusChange(result.payload as Lead);
    } else {
      gooeyToast.error("Failed", { description: "Could not mark demo as ready." });
    }
  };

  const changeStatus = async (status: LeadStatus) => {
    if (status === lead.status || busy) return;
    setBusy(true);
    const result = await dispatch(updateLeadStatus({ id: String(lead.id), status }));
    setBusy(false);
    if (updateLeadStatus.fulfilled.match(result)) {
      gooeyToast.success("Status updated", { description: `Moved to "${status}"` });
      onStatusChange(result.payload as Lead);
    } else {
      gooeyToast.error("Update failed", { description: "Could not change lead status." });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-neutral-200 flex flex-col shadow-xl">

        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200 shrink-0">
          <p className="text-sm font-black text-neutral-900">Lead Detail</p>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {/* Person */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
              <span className="text-sm font-black text-white">{lead.name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-black text-neutral-900">{lead.name}</p>
              <p className="text-sm text-neutral-500">{lead.email}</p>
            </div>
            <span className={`ml-auto text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[lead.status]}`}>
              {lead.status}
            </span>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Company",  value: lead.company ?? "—"           },
              { label: "Service",  value: lead.service                   },
              { label: "Budget",   value: lead.budget ?? "—"            },
              { label: "Date",     value: formatDate(lead.created_at)    },
              { label: "Referred", value: lead.ref_code ?? "Direct"      },
            ].map((d) => (
              <div key={d.label} className="bg-neutral-50 border border-neutral-200 rounded-xl p-3">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-1">{d.label}</p>
                <p className="text-sm font-semibold text-neutral-900">{d.value}</p>
              </div>
            ))}
          </div>

          {/* Message */}
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-2">Message</p>
            <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 border border-neutral-200 rounded-xl p-4">
              {lead.message}
            </p>
          </div>

          {/* Demo section — super_admin only */}
          {role === "super_admin" && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500">Demo</p>
                {lead.demo_ready && (
                  <span className="text-[10px] font-bold tracking-widest uppercase text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                    Ready
                  </span>
                )}
              </div>

              <input
                type="url"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://demo.viklance.dev/..."
                className="border border-neutral-200 bg-white rounded-xl px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-500 transition-colors"
              />

              <button
                onClick={saveDemoReady}
                disabled={demoSaving || !demoUrl.trim()}
                className="flex items-center justify-center gap-2 bg-neutral-900 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-40"
              >
                {demoSaving ? (
                  <>
                    <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="18" strokeDashoffset="8" strokeLinecap="round" />
                    </svg>
                    Saving…
                  </>
                ) : lead.demo_ready ? (
                  "Update Demo Link"
                ) : (
                  "Mark Demo Ready & Notify Staff"
                )}
              </button>

              {lead.demo_ready && lead.demo_url && (
                <a
                  href={lead.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-neutral-400 hover:text-neutral-700 transition-colors truncate"
                >
                  {lead.demo_url}
                </a>
              )}
            </div>
          )}

          {/* Status update */}
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-2">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {(["New", "In Review", "Replied", "Closed"] as LeadStatus[]).map((s) => (
                <button
                  key={s}
                  disabled={busy}
                  onClick={() => changeStatus(s)}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all disabled:opacity-50
                    ${lead.status === s
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
          <a
            href={`mailto:${lead.email}`}
            className="flex-1 bg-neutral-900 text-white text-sm font-bold py-3 rounded-xl text-center hover:bg-neutral-700 transition-colors"
          >
            Reply via email
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

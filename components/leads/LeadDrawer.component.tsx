"use client";

import { Lead, LeadStatus, STATUS_COLORS } from "@/lib/leads.types";

interface LeadDrawerProps {
  lead:    Lead;
  onClose: () => void;
}

export default function LeadDrawer({ lead, onClose }: LeadDrawerProps) {
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
              { label: "Company",  value: lead.company        },
              { label: "Service",  value: lead.service        },
              { label: "Budget",   value: lead.budget         },
              { label: "Date",     value: lead.date           },
              { label: "Referred", value: lead.ref ?? "Direct" },
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

          {/* Status update */}
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-2">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {(["New", "In Review", "Replied", "Closed"] as LeadStatus[]).map((s) => (
                <button
                  key={s}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all
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

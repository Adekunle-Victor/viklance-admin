"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { markReferrerPaid } from "@/store/slices/referrals.slice";
import { Referrer, PAYOUT_COLORS } from "@/lib/referrals.types";
import { gooeyToast } from "goey-toast";

interface ReferralDrawerProps {
  referrer: Referrer;
  onClose:  () => void;
  onPaid:   (updated: Referrer) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function ReferralDrawer({ referrer, onClose, onPaid }: ReferralDrawerProps) {
  const dispatch    = useAppDispatch();
  const [busy, setBusy] = useState(false);

  const handleMarkPaid = async () => {
    if (busy) return;
    setBusy(true);
    const result = await dispatch(markReferrerPaid(referrer.id));
    setBusy(false);
    if (markReferrerPaid.fulfilled.match(result)) {
      gooeyToast.success("Payout marked as paid", { description: `${referrer.name}'s payout has been recorded.` });
      onPaid({ ...referrer, payout_status: "Paid" });
    } else {
      gooeyToast.error("Failed", { description: "Could not update payout status." });
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-neutral-200 flex flex-col shadow-xl">

        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200 shrink-0">
          <p className="text-sm font-black text-neutral-900">Referrer Detail</p>
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
              <span className="text-sm font-black text-white">{referrer.name.charAt(0)}</span>
            </div>
            <div>
              <p className="font-black text-neutral-900">{referrer.name}</p>
              <p className="text-sm text-neutral-500">{referrer.email}</p>
            </div>
          </div>

          {/* Code */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-1">Referral Code</p>
            <p className="font-mono text-sm font-bold text-neutral-900">{referrer.code}</p>
            <p className="text-[11px] text-neutral-400 mt-1">viklance.dev/r/{referrer.code}</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Clicks",      value: referrer.clicks                   },
              { label: "Leads",       value: referrer.leads                    },
              { label: "Conversions", value: referrer.conversions              },
              { label: "Joined",      value: formatDate(referrer.created_at)   },
            ].map((d) => (
              <div key={d.label} className="bg-neutral-50 border border-neutral-200 rounded-xl p-3">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-1">{d.label}</p>
                <p className="text-sm font-bold text-neutral-900">{d.value}</p>
              </div>
            ))}
          </div>

          {/* Payout */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-1">Total Earned</p>
              <p className={`text-2xl font-black tracking-tight ${Number(referrer.earned) === 0 ? "text-neutral-300" : "text-neutral-900"}`}>
                {Number(referrer.earned) === 0 ? "—" : `₦${Number(referrer.earned).toLocaleString()}`}
              </p>
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${PAYOUT_COLORS[referrer.payout_status]}`}>
              {referrer.payout_status === "None" ? "—" : referrer.payout_status}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 shrink-0 flex gap-3">
          {referrer.payout_status === "Pending" && (
            <button
              onClick={handleMarkPaid}
              disabled={busy}
              className="flex-1 bg-neutral-900 text-white text-sm font-bold py-3 rounded-xl hover:bg-neutral-700 transition-colors disabled:opacity-50"
            >
              {busy ? "Updating…" : "Mark as Paid"}
            </button>
          )}
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

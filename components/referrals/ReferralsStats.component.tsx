import { ALL_REFERRERS } from "@/lib/referrals.types";

const stats = [
  { label: "Total Referrers",   value: ALL_REFERRERS.length.toString() },
  { label: "Total Clicks",      value: ALL_REFERRERS.reduce((a, r) => a + r.clicks, 0).toString() },
  { label: "Total Conversions", value: ALL_REFERRERS.reduce((a, r) => a + r.conversions, 0).toString() },
  { label: "Total Paid Out",    value: `₦${ALL_REFERRERS.filter((r) => r.payoutStatus === "Paid").reduce((a, r) => a + r.earned, 0).toLocaleString()}` },
];

export default function ReferralsStats() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-white border border-neutral-200 rounded-2xl p-5">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-2">{s.label}</p>
          <p className="text-2xl font-black text-neutral-900 tracking-tight">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/api";

interface StaffKPI {
  staff_id:        string;
  full_name:       string | null;
  email:           string;
  period:          string | null;
  total_added:     number;
  contacted:       number;
  engaged:         number;
  converted:       number;
  lost:            number;
  active:          number;
  contacted_rate:  number;
  conversion_rate: number;
  loss_rate:       number;
  total_deal_value: number;
  commission:       number;
}

const AVATAR_COLORS = [
  "bg-neutral-900",
  "bg-blue-600",
  "bg-emerald-600",
  "bg-violet-600",
  "bg-rose-600",
  "bg-amber-600",
];

function getInitials(kpi: StaffKPI) {
  const name = kpi.full_name ?? kpi.email;
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

function currentPeriod() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function formatPeriod(p: string) {
  const [y, m] = p.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleDateString("en-NG", { month: "long", year: "numeric" });
}

type RateLevel = "green" | "yellow" | "red";

function contactedLevel(r: number): RateLevel {
  if (r >= 60) return "green";
  if (r >= 30) return "yellow";
  return "red";
}

function conversionLevel(r: number): RateLevel {
  if (r >= 20) return "green";
  if (r >= 10) return "yellow";
  return "red";
}

function commissionLevel(c: number): RateLevel {
  if (c >= 100000) return "green";
  if (c >= 50000)  return "yellow";
  return "red";
}

function addedLevel(n: number): RateLevel {
  if (n >= 10) return "green";
  if (n >= 5)  return "yellow";
  return "red";
}

const RATE_CLASSES: Record<RateLevel, string> = {
  green:  "text-emerald-700 bg-emerald-50 border border-emerald-200",
  yellow: "text-amber-700 bg-amber-50 border border-amber-200",
  red:    "text-red-700 bg-red-50 border border-red-200",
};

function RateBadge({ value, label, level }: { value: string; label?: string; level: RateLevel }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full tabular-nums ${RATE_CLASSES[level]}`}>
      {value}{label}
    </span>
  );
}

function ScoreBar({ rate, level }: { rate: number; level: RateLevel }) {
  const barColor = level === "green" ? "bg-emerald-500" : level === "yellow" ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${Math.min(rate, 100)}%` }} />
      </div>
      <span className="text-[11px] font-bold tabular-nums text-neutral-700">{rate}%</span>
    </div>
  );
}

export default function KPIPage() {
  const [kpis,    setKpis]    = useState<StaffKPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [period,  setPeriod]  = useState(currentPeriod());

  useEffect(() => {
    setLoading(true);
    authFetch(`/api/staff/kpi?period=${period}`)
      .then((r) => r.json())
      .then((d) => setKpis(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, [period]);

  const totalAdded    = kpis.reduce((a, k) => a + k.total_added,    0);
  const totalConverted = kpis.reduce((a, k) => a + k.converted,     0);
  const totalCommission = kpis.reduce((a, k) => a + k.commission,   0);
  const teamConvRate  = totalAdded > 0 ? Math.round((totalConverted / totalAdded) * 100) : 0;

  const sorted = [...kpis].sort((a, b) => b.commission - a.commission);

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Staff KPIs</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {loading ? "Loading…" : `${kpis.length} rep${kpis.length !== 1 ? "s" : ""} · ${formatPeriod(period)}`}
          </p>
        </div>

        {/* Period picker */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400">Period</label>
          <input
            type="month"
            value={period}
            onChange={(e) => e.target.value && setPeriod(e.target.value)}
            className="border border-neutral-200 bg-white rounded-xl px-3 py-2 text-sm text-neutral-900 outline-none focus:border-neutral-600 transition-colors"
          />
        </div>
      </div>

      {/* Team summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Accounts Added",   value: loading ? "—" : totalAdded.toString() },
          { label: "Conversions",      value: loading ? "—" : totalConverted.toString() },
          { label: "Team Conv. Rate",  value: loading ? "—" : `${teamConvRate}%` },
          { label: "Total Commission", value: loading ? "—" : `₦${totalCommission.toLocaleString()}` },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-neutral-200 rounded-2xl p-5">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-2">{s.label}</p>
            <p className="text-2xl font-black text-neutral-900 tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Targets legend */}
      <div className="bg-white border border-neutral-200 rounded-2xl px-5 py-4">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400 mb-3">Monthly Targets</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[11px]">
          <div className="flex flex-col gap-1.5">
            <span className="font-bold text-neutral-600">Accounts Added</span>
            <span className="text-emerald-700 font-semibold">10 or more — on track</span>
            <span className="text-amber-600 font-semibold">5 to 9 — needs improvement</span>
            <span className="text-red-600 font-semibold">Less than 5 — underperforming</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-bold text-neutral-600">Contacted Rate</span>
            <span className="text-emerald-700 font-semibold">60% or more — on track</span>
            <span className="text-amber-600 font-semibold">30 to 59% — needs improvement</span>
            <span className="text-red-600 font-semibold">Less than 30% — underperforming</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-bold text-neutral-600">Conversion Rate</span>
            <span className="text-emerald-700 font-semibold">20% or more — on track</span>
            <span className="text-amber-600 font-semibold">10 to 19% — needs improvement</span>
            <span className="text-red-600 font-semibold">Less than 10% — underperforming</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-bold text-neutral-600">Commission</span>
            <span className="text-emerald-700 font-semibold">₦100,000 or more — on track</span>
            <span className="text-amber-600 font-semibold">₦50,000 to ₦99,999 — needs improvement</span>
            <span className="text-red-600 font-semibold">Less than ₦50,000 — underperforming</span>
          </div>
        </div>
      </div>

      {/* KPI table */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 flex flex-col gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-neutral-100 animate-pulse shrink-0" />
                <div className="flex-1 grid grid-cols-5 gap-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="h-3 bg-neutral-100 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 19c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="11" cy="8" r="4" stroke="#d4d4d4" strokeWidth="1.5" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-neutral-400">No staff data</p>
            <p className="text-[11px] text-neutral-300 mt-1">No accounts were added in {formatPeriod(period)}.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/70">
                  <th className="text-left text-[10px] font-bold tracking-widest uppercase text-neutral-400 px-5 py-3">Rep</th>
                  <th className="text-left text-[10px] font-bold tracking-widest uppercase text-neutral-400 px-5 py-3">Added</th>
                  <th className="text-left text-[10px] font-bold tracking-widest uppercase text-neutral-400 px-5 py-3 hidden md:table-cell">Pipeline</th>
                  <th className="text-left text-[10px] font-bold tracking-widest uppercase text-neutral-400 px-5 py-3 hidden sm:table-cell">Contacted</th>
                  <th className="text-left text-[10px] font-bold tracking-widest uppercase text-neutral-400 px-5 py-3">Conv. Rate</th>
                  <th className="text-left text-[10px] font-bold tracking-widest uppercase text-neutral-400 px-5 py-3 hidden lg:table-cell">Lost</th>
                  <th className="text-left text-[10px] font-bold tracking-widest uppercase text-neutral-400 px-5 py-3">Commission</th>
                  <th className="text-left text-[10px] font-bold tracking-widest uppercase text-neutral-400 px-5 py-3 hidden xl:table-cell">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {sorted.map((k, i) => (
                  <tr key={k.staff_id} className="hover:bg-neutral-50 transition-colors">

                    {/* Rep */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                            <span className="text-[11px] font-black text-white">{getInitials(k)}</span>
                          </div>
                          {i === 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-[8px] font-black text-white">1</span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 whitespace-nowrap">
                            {k.full_name ?? <span className="italic font-normal text-neutral-400">No name</span>}
                          </p>
                          <p className="text-[10px] text-neutral-400">{k.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Accounts added */}
                    <td className="px-5 py-4">
                      <RateBadge value={k.total_added.toString()} level={addedLevel(k.total_added)} />
                    </td>

                    {/* Active pipeline */}
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-semibold text-neutral-700 tabular-nums">{k.active} active</span>
                        <span className="text-[10px] text-neutral-400 tabular-nums">{k.engaged} engaged</span>
                      </div>
                    </td>

                    {/* Contacted rate */}
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <ScoreBar rate={k.contacted_rate} level={contactedLevel(k.contacted_rate)} />
                    </td>

                    {/* Conversion rate */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <ScoreBar rate={k.conversion_rate} level={conversionLevel(k.conversion_rate)} />
                        <span className="text-[10px] text-neutral-400 tabular-nums">{k.converted} won</span>
                      </div>
                    </td>

                    {/* Lost */}
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className={`text-[11px] font-semibold tabular-nums ${k.lost > 0 ? "text-red-500" : "text-neutral-300"}`}>
                        {k.lost > 0 ? `${k.lost} lost` : "—"}
                      </span>
                      {k.loss_rate > 0 && (
                        <span className="block text-[10px] text-neutral-400">{k.loss_rate}% loss rate</span>
                      )}
                    </td>

                    {/* Commission */}
                    <td className="px-5 py-4">
                      <RateBadge value={`₦${k.commission.toLocaleString()}`} level={commissionLevel(k.commission)} />
                      {k.total_deal_value > 0 && (
                        <p className="text-[10px] text-neutral-400 mt-0.5 tabular-nums">
                          ₦{k.total_deal_value.toLocaleString()} revenue
                        </p>
                      )}
                    </td>

                    {/* Status breakdown */}
                    <td className="px-5 py-4 hidden xl:table-cell">
                      <div className="flex flex-col gap-0.5 text-[10px] text-neutral-500 tabular-nums font-medium">
                        <span>{k.contacted} Contacted</span>
                        <span>{k.engaged} Interested/Proposal</span>
                        <span className="text-emerald-600">{k.converted} Converted</span>
                        <span className="text-red-400">{k.lost} Lost</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

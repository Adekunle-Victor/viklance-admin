"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchLeads } from "@/store/slices/leads.slice";
import { fetchReferrers } from "@/store/slices/referrals.slice";
import { STATUS_COLORS } from "@/lib/leads.types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const router   = useRouter();

  const { items: leads,     loading: leadsLoading }     = useAppSelector((s) => s.leads);
  const { items: referrers, loading: referrersLoading } = useAppSelector((s) => s.referrals);

  useEffect(() => {
    dispatch(fetchLeads({}));
    dispatch(fetchReferrers());
  }, [dispatch]);

  const totalLeads     = leads.length;
  const referralSignups = referrers.length;
  const pendingPayouts = referrers
    .filter((r) => r.payout_status === "Pending")
    .reduce((a, r) => a + Number(r.earned), 0);
  const pendingCount   = referrers.filter((r) => r.payout_status === "Pending").length;

  const stats = [
    { label: "Total Leads",      value: leadsLoading     ? "—" : totalLeads.toString(),      up: true,  delta: `${leads.filter((l) => l.status === "New").length} new`                                     },
    { label: "Referral Signups", value: referrersLoading ? "—" : referralSignups.toString(),  up: true,  delta: `${referrers.filter((r) => r.conversions > 0).length} converted`                            },
    { label: "Pending Payouts",  value: referrersLoading ? "—" : `₦${pendingPayouts.toLocaleString()}`, up: false, delta: `${pendingCount} requests`                                                         },
    { label: "Conversions",      value: referrersLoading ? "—" : referrers.reduce((a, r) => a + Number(r.conversions), 0).toString(), up: true, delta: "closed leads"                                       },
  ];

  const recentLeads     = leads.slice(0, 5);
  const recentReferrers = referrers.slice(0, 4);

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Overview</h1>
        <p className="text-sm text-neutral-500 mt-1">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-neutral-200 rounded-2xl p-6">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-3">{s.label}</p>
            <p className="text-3xl font-black text-neutral-900 tracking-tight mb-2">{s.value}</p>
            <p className={`text-[11px] font-semibold flex items-center gap-1 ${s.up ? "text-green-600" : "text-neutral-400"}`}>
              {s.up && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 8V2M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {s.delta}
            </p>
          </div>
        ))}
      </div>

      {/* Recent leads */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-neutral-900">Recent Leads</h2>
          <button
            onClick={() => router.push("/dashboard/leads")}
            className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Name</th>
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden sm:table-cell">Email</th>
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden md:table-cell">Service</th>
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden lg:table-cell">Date</th>
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {leadsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-3 bg-neutral-100 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-neutral-400">No leads yet.</td>
                </tr>
              ) : recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-neutral-900">{lead.name}</td>
                  <td className="px-6 py-4 text-neutral-500 hidden sm:table-cell">{lead.email}</td>
                  <td className="px-6 py-4 text-neutral-500 hidden md:table-cell">{lead.service}</td>
                  <td className="px-6 py-4 text-neutral-400 hidden lg:table-cell">{formatDate(lead.created_at)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent referrals */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-neutral-900">Recent Referrals</h2>
          <button
            onClick={() => router.push("/dashboard/referrals")}
            className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Referrer</th>
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Clicks</th>
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden sm:table-cell">Leads</th>
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden md:table-cell">Conversions</th>
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {referrersLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-3 bg-neutral-100 rounded animate-pulse w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : recentReferrers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-sm text-neutral-400">No referrers yet.</td>
                </tr>
              ) : recentReferrers.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-neutral-900">{r.name}</p>
                    <p className="font-mono text-[11px] text-neutral-400 mt-0.5">{r.code}</p>
                  </td>
                  <td className="px-6 py-4 text-neutral-900 font-semibold">{r.clicks}</td>
                  <td className="px-6 py-4 text-neutral-500 hidden sm:table-cell">{r.leads}</td>
                  <td className="px-6 py-4 text-neutral-500 hidden md:table-cell">{r.conversions}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${Number(r.earned) === 0 ? "text-neutral-300" : "text-green-700"}`}>
                      {Number(r.earned) === 0 ? "—" : `₦${Number(r.earned).toLocaleString()}`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

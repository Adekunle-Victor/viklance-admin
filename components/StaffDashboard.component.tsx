"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProspects } from "@/store/slices/prospects.slice";
import { STATUS_COLORS, PROSPECT_STATUSES, type ProspectStatus } from "@/lib/prospects.types";
import { fetchNotifications } from "@/store/slices/notifications.slice";

const STATUS_BAR_COLORS: Record<ProspectStatus, string> = {
  "New":           "bg-blue-400",
  "Contacted":     "bg-yellow-400",
  "Interested":    "bg-purple-400",
  "Proposal Sent": "bg-orange-400",
  "Converted":     "bg-green-500",
  "Lost":          "bg-neutral-300",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

export default function StaffDashboard() {
  const dispatch = useAppDispatch();
  const router   = useRouter();

  const { items: prospects, loading } = useAppSelector((s) => s.prospects);
  const notifications = useAppSelector((s) => s.notifications.items);
  const user = useAppSelector((s) => s.auth.user);

  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ??
    user?.user_metadata?.name?.split(" ")[0] ??
    "there";

  useEffect(() => {
    dispatch(fetchProspects({}));
    dispatch(fetchNotifications());
  }, [dispatch]);

  const total     = prospects.length;
  const contacted = prospects.filter((p) => p.status !== "New").length;
  const converted = prospects.filter((p) => p.status === "Converted").length;
  const demoReady = notifications.filter((n) => n.type === "demo_ready" && !n.read).length;

  const statusCounts = PROSPECT_STATUSES.reduce((acc, s) => {
    acc[s] = prospects.filter((p) => p.status === s).length;
    return acc;
  }, {} as Record<ProspectStatus, number>);

  const recentProspects = [...prospects]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">My Overview</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Hey {firstName}, here&apos;s your pipeline at a glance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* Total Pipeline */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-3">Total Pipeline</p>
          <p className="text-3xl font-black text-neutral-900 tracking-tight mb-2">
            {loading ? "—" : total}
          </p>
          <p className="text-[11px] font-semibold text-neutral-400">prospects added</p>
        </div>

        {/* Contacted */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-3">Contacted</p>
          <p className="text-3xl font-black text-neutral-900 tracking-tight mb-2">
            {loading ? "—" : contacted}
          </p>
          <p className="text-[11px] font-semibold text-neutral-400">
            {!loading && total > 0
              ? `${Math.round((contacted / total) * 100)}% outreach rate`
              : "reached out to"}
          </p>
        </div>

        {/* Converted */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-3">Converted</p>
          <p className="text-3xl font-black text-green-600 tracking-tight mb-2">
            {loading ? "—" : converted}
          </p>
          <p className="text-[11px] font-semibold text-green-500">
            {!loading && contacted > 0
              ? `${Math.round((converted / contacted) * 100)}% close rate`
              : "became clients"}
          </p>
        </div>

        {/* Demo Ready */}
        <div className={`rounded-2xl p-6 border transition-colors ${
          demoReady > 0
            ? "bg-blue-50 border-blue-200"
            : "bg-white border-neutral-200"
        }`}>
          <p className={`text-[11px] font-semibold tracking-widest uppercase mb-3 ${
            demoReady > 0 ? "text-blue-600" : "text-neutral-500"
          }`}>Demo Ready</p>
          <p className={`text-3xl font-black tracking-tight mb-2 ${
            demoReady > 0 ? "text-blue-700" : "text-neutral-900"
          }`}>
            {demoReady}
          </p>
          <p className={`text-[11px] font-semibold ${
            demoReady > 0 ? "text-blue-500" : "text-neutral-400"
          }`}>
            {demoReady > 0 ? "awaiting your action" : "all caught up"}
          </p>
        </div>

        {/* Earned — placeholder */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-3">Earned</p>
          <p className="text-3xl font-black text-neutral-300 tracking-tight mb-2">—</p>
          <p className="text-[11px] font-semibold text-neutral-300 flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <rect x="1.5" y="5" width="8" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <path d="M3.5 5V3.5a2 2 0 014 0V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            coming soon
          </p>
        </div>
      </div>

      {/* Pipeline breakdown */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6">
        <h2 className="text-sm font-black text-neutral-900 mb-5">Pipeline Breakdown</h2>

        <div className="flex flex-wrap gap-2 mb-5">
          {PROSPECT_STATUSES.map((status) => (
            <div
              key={status}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-semibold ${STATUS_COLORS[status]}`}
            >
              <span>{status}</span>
              <span className="font-black text-xs">{loading ? "—" : statusCounts[status]}</span>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {!loading && total > 0 ? (
          <div className="h-2 rounded-full overflow-hidden flex gap-px">
            {PROSPECT_STATUSES.filter((s) => statusCounts[s] > 0).map((status) => (
              <div
                key={status}
                style={{ width: `${(statusCounts[status] / total) * 100}%` }}
                className={`h-full ${STATUS_BAR_COLORS[status]}`}
              />
            ))}
          </div>
        ) : (
          <div className="h-2 rounded-full bg-neutral-100" />
        )}
      </div>

      {/* Recent activity */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-neutral-900">Recent Activity</h2>
          <button
            onClick={() => router.push("/dashboard/prospects")}
            className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Handle</th>
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden sm:table-cell">Name</th>
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden md:table-cell">Updated</th>
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-3 bg-neutral-100 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : recentProspects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-sm text-neutral-400">
                    No prospects yet. Head to Prospects to add your first one.
                  </td>
                </tr>
              ) : (
                recentProspects.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <a
                        href={`https://instagram.com/${p.instagram_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm text-neutral-900 hover:text-blue-600 transition-colors"
                      >
                        @{p.instagram_handle}
                      </a>
                    </td>
                    <td className="px-6 py-4 font-semibold text-neutral-900 hidden sm:table-cell">{p.name}</td>
                    <td className="px-6 py-4 text-neutral-400 hidden md:table-cell">{formatDate(p.updated_at)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[p.status]}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAccounts } from "@/store/slices/accounts.slice";
import { STATUS_COLORS, ACCOUNT_STATUSES, type AccountStatus } from "@/lib/accounts.types";
import { fetchNotifications } from "@/store/slices/notifications.slice";

const STATUS_BAR_COLORS: Record<AccountStatus, string> = {
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

function daysAgo(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

function daysAgoLabel(days: number) {
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

const STALE_DAYS = 7;
const ACTIVE_STATUSES: AccountStatus[] = ["New", "Contacted", "Interested", "Proposal Sent"];
const FOLLOWUP_STATUSES: AccountStatus[] = ["Contacted", "Interested"];

export default function StaffDashboard() {
  const dispatch = useAppDispatch();
  const router   = useRouter();

  const { items: accounts, loading } = useAppSelector((s) => s.accounts);
  const notifications = useAppSelector((s) => s.notifications.items);
  const user = useAppSelector((s) => s.auth.user);

  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ??
    user?.user_metadata?.name?.split(" ")[0] ??
    "there";

  useEffect(() => {
    dispatch(fetchAccounts({}));
    dispatch(fetchNotifications());
  }, [dispatch]);

  const total     = accounts.length;
  const contacted = accounts.filter((a) => a.status !== "New").length;
  const converted = accounts.filter((a) => a.status === "Converted").length;
  const demoReady = notifications.filter((n) => n.type === "demo_ready" && !n.read).length;

  const statusCounts = ACCOUNT_STATUSES.reduce((acc, s) => {
    acc[s] = accounts.filter((a) => a.status === s).length;
    return acc;
  }, {} as Record<AccountStatus, number>);

  const staleAccounts = accounts
    .filter((a) => ACTIVE_STATUSES.includes(a.status as AccountStatus) && daysAgo(a.updated_at) >= STALE_DAYS)
    .sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());

  const followUpQueue = accounts
    .filter((a) => FOLLOWUP_STATUSES.includes(a.status as AccountStatus))
    .sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime())
    .slice(0, 6);

  const recentAccounts = [...accounts]
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
        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-3">Total Pipeline</p>
          <p className="text-3xl font-black text-neutral-900 tracking-tight mb-2">{loading ? "—" : total}</p>
          <p className="text-[11px] font-semibold text-neutral-400">accounts added</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-3">Contacted</p>
          <p className="text-3xl font-black text-neutral-900 tracking-tight mb-2">{loading ? "—" : contacted}</p>
          <p className="text-[11px] font-semibold text-neutral-400">
            {!loading && total > 0 ? `${Math.round((contacted / total) * 100)}% outreach rate` : "reached out to"}
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-3">Converted</p>
          <p className="text-3xl font-black text-green-600 tracking-tight mb-2">{loading ? "—" : converted}</p>
          <p className="text-[11px] font-semibold text-green-500">
            {!loading && contacted > 0 ? `${Math.round((converted / contacted) * 100)}% close rate` : "became clients"}
          </p>
        </div>

        <div className={`rounded-2xl p-6 border transition-colors ${demoReady > 0 ? "bg-blue-50 border-blue-200" : "bg-white border-neutral-200"}`}>
          <p className={`text-[11px] font-semibold tracking-widest uppercase mb-3 ${demoReady > 0 ? "text-blue-600" : "text-neutral-500"}`}>Demo Ready</p>
          <p className={`text-3xl font-black tracking-tight mb-2 ${demoReady > 0 ? "text-blue-700" : "text-neutral-900"}`}>{demoReady}</p>
          <p className={`text-[11px] font-semibold ${demoReady > 0 ? "text-blue-500" : "text-neutral-400"}`}>
            {demoReady > 0 ? "awaiting your action" : "all caught up"}
          </p>
        </div>

        <div className={`rounded-2xl p-6 border transition-colors ${staleAccounts.length > 0 ? "bg-amber-50 border-amber-200" : "bg-white border-neutral-200"}`}>
          <p className={`text-[11px] font-semibold tracking-widest uppercase mb-3 ${staleAccounts.length > 0 ? "text-amber-600" : "text-neutral-500"}`}>
            Needs Attention
          </p>
          <p className={`text-3xl font-black tracking-tight mb-2 ${staleAccounts.length > 0 ? "text-amber-700" : "text-neutral-900"}`}>
            {loading ? "—" : staleAccounts.length}
          </p>
          <p className={`text-[11px] font-semibold ${staleAccounts.length > 0 ? "text-amber-500" : "text-neutral-400"}`}>
            {staleAccounts.length > 0 ? `silent ${STALE_DAYS}+ days` : "all up to date"}
          </p>
        </div>
      </div>

      {/* Stale accounts alert */}
      {!loading && staleAccounts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="text-amber-600 shrink-0">
                <path d="M7.5 2L13.5 12.5H1.5L7.5 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M7.5 6v3.5M7.5 11h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <p className="text-sm font-black text-amber-800">
                {staleAccounts.length} account{staleAccounts.length !== 1 ? "s" : ""} haven&apos;t been touched in {STALE_DAYS}+ days
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/prospects")}
              className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 transition-colors whitespace-nowrap"
            >
              View all →
            </button>
          </div>
          <div className="divide-y divide-amber-100">
            {staleAccounts.slice(0, 4).map((a) => {
              const days = daysAgo(a.updated_at);
              return (
                <div key={a.id} className="flex items-center justify-between px-6 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-amber-900 truncate">{a.name}</p>
                    {a.contact_person && <p className="text-[11px] text-amber-600 truncate">{a.contact_person}</p>}
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[a.status as AccountStatus]}`}>
                      {a.status}
                    </span>
                    <span className="text-[11px] font-bold text-amber-600 tabular-nums">
                      {daysAgoLabel(days)}
                    </span>
                  </div>
                </div>
              );
            })}
            {staleAccounts.length > 4 && (
              <div className="px-6 py-3 text-[11px] text-amber-600 font-semibold">
                + {staleAccounts.length - 4} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pipeline breakdown */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6">
        <h2 className="text-sm font-black text-neutral-900 mb-5">Pipeline Breakdown</h2>
        <div className="flex flex-wrap gap-2 mb-5">
          {ACCOUNT_STATUSES.map((status) => (
            <div key={status} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-semibold ${STATUS_COLORS[status]}`}>
              <span>{status}</span>
              <span className="font-black text-xs">{loading ? "—" : statusCounts[status]}</span>
            </div>
          ))}
        </div>
        {!loading && total > 0 ? (
          <div className="h-2 rounded-full overflow-hidden flex gap-px">
            {ACCOUNT_STATUSES.filter((s) => statusCounts[s] > 0).map((status) => (
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

      {/* Follow-up queue */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-neutral-900">Follow-up Queue</h2>
            <p className="text-[11px] text-neutral-400 mt-0.5">Contacted & Interested — oldest first</p>
          </div>
          <button onClick={() => router.push("/dashboard/prospects")} className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors">
            View all →
          </button>
        </div>

        {loading ? (
          <div className="divide-y divide-neutral-100">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4">
                <div className="h-3 bg-neutral-100 rounded animate-pulse w-32" />
                <div className="h-3 bg-neutral-100 rounded animate-pulse w-16 ml-auto" />
              </div>
            ))}
          </div>
        ) : followUpQueue.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-neutral-400">
            No accounts in Contacted or Interested yet.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {followUpQueue.map((a) => {
              const days = daysAgo(a.updated_at);
              const isUrgent = days >= STALE_DAYS;
              return (
                <div key={a.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-neutral-900 truncate">{a.name}</p>
                    {a.contact_person && <p className="text-[11px] text-neutral-400 truncate">{a.contact_person}</p>}
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[a.status as AccountStatus]}`}>
                      {a.status}
                    </span>
                    <span className={`text-[11px] font-bold tabular-nums ${isUrgent ? "text-amber-500" : "text-neutral-400"}`}>
                      {daysAgoLabel(days)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-sm font-black text-neutral-900">Recent Activity</h2>
          <button onClick={() => router.push("/dashboard/prospects")} className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors">
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Account</th>
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden md:table-cell">Updated</th>
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 3 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-3 bg-neutral-100 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : recentAccounts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-sm text-neutral-400">
                    No accounts yet. Head to Accounts to add your first one.
                  </td>
                </tr>
              ) : (
                recentAccounts.map((a) => (
                  <tr key={a.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-neutral-900">{a.name}</p>
                      {a.contact_person && <p className="text-[11px] text-neutral-400">{a.contact_person}</p>}
                    </td>
                    <td className="px-6 py-4 text-neutral-400 hidden md:table-cell">{formatDate(a.updated_at)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLORS[a.status as AccountStatus]}`}>
                        {a.status}
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

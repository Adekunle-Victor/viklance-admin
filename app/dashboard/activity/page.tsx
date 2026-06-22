"use client";

import { useEffect, useState, useCallback } from "react";
import { authFetch } from "@/lib/api";

interface ActivityLog {
  id:          number;
  user_id:     string;
  user_name:   string;
  user_email:  string;
  action:      string;
  entity_type: string | null;
  entity_id:   number | null;
  entity_name: string | null;
  details:     Record<string, string> | null;
  ip_address:  string | null;
  created_at:  string;
}

const ACTION_LABELS: Record<string, string> = {
  login:                  "Logged in",
  logout:                 "Logged out",
  account_created:        "Added account",
  account_status_changed: "Changed status",
};

const ACTION_COLORS: Record<string, string> = {
  login:                  "bg-emerald-50 text-emerald-700 border-emerald-200",
  logout:                 "bg-neutral-100 text-neutral-500 border-neutral-200",
  account_created:        "bg-blue-50 text-blue-700 border-blue-200",
  account_status_changed: "bg-violet-50 text-violet-700 border-violet-200",
};

const ACTION_ICONS: Record<string, React.ReactNode> = {
  login: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M5 2H2.5A1.5 1.5 0 001 3.5v6A1.5 1.5 0 002.5 11H5M8.5 9.5L11 7l-2.5-2.5M11 7H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  logout: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M8 2h2.5A1.5 1.5 0 0112 3.5v6A1.5 1.5 0 0110.5 11H8M4.5 9.5L2 7l2.5-2.5M2 7h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  account_created: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M6.5 1.5v10M1.5 6.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  account_status_changed: (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path d="M2 7.5l3 3 6-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const AVATAR_COLORS = [
  "bg-neutral-900", "bg-blue-600", "bg-emerald-600",
  "bg-violet-600",  "bg-rose-600", "bg-amber-600",
];

const avatarColorCache: Record<string, string> = {};
let colorIndex = 0;
function getAvatarColor(userId: string) {
  if (!avatarColorCache[userId]) {
    avatarColorCache[userId] = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
    colorIndex++;
  }
  return avatarColorCache[userId];
}

function getInitials(name: string, email: string) {
  const src = name || email;
  return src.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?";
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs  < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30)  return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function ActionBadge({ action }: { action: string }) {
  const label = ACTION_LABELS[action] ?? action.replace(/_/g, " ");
  const color = ACTION_COLORS[action] ?? "bg-neutral-100 text-neutral-500 border-neutral-200";
  const icon  = ACTION_ICONS[action];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${color}`}>
      {icon}{label}
    </span>
  );
}

const PAGE_SIZE = 50;

const ACTION_OPTIONS = [
  { value: "",                       label: "All actions" },
  { value: "login",                  label: "Logins" },
  { value: "logout",                 label: "Logouts" },
  { value: "account_created",        label: "Accounts added" },
  { value: "account_status_changed", label: "Status changes" },
];

export default function ActivityPage() {
  const [logs,    setLogs]    = useState<ActivityLog[]>([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [page,    setPage]    = useState(0);
  const [action,  setAction]  = useState("");

  const fetchLogs = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      limit:  String(PAGE_SIZE),
      offset: String(page * PAGE_SIZE),
    });
    if (action) params.set("action", action);

    authFetch(`/api/activity?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setLogs(Array.isArray(d.logs) ? d.logs : []);
        setTotal(d.total ?? 0);
      })
      .finally(() => setLoading(false));
  }, [page, action]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleActionChange = (v: string) => {
    setAction(v);
    setPage(0);
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Activity Log</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {loading ? "Loading…" : `${total.toLocaleString()} event${total !== 1 ? "s" : ""} recorded`}
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <select
            value={action}
            onChange={(e) => handleActionChange(e.target.value)}
            className="border border-neutral-200 bg-white rounded-xl px-3 py-2 text-sm text-neutral-700 outline-none focus:border-neutral-600 transition-colors"
          >
            {ACTION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={fetchLogs}
            className="flex items-center gap-1.5 border border-neutral-200 bg-white rounded-xl px-3 py-2 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M11.5 6.5A5 5 0 112.5 3.2M2.5 1v2.2H4.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Log table */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-6 flex flex-col gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-neutral-100 animate-pulse shrink-0" />
                <div className="flex-1 grid grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-2.5 bg-neutral-100 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 4h14v14H4z" stroke="#d4d4d4" strokeWidth="1.5" rx="2" />
                <path d="M8 8h6M8 12h4" stroke="#d4d4d4" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-neutral-400">No activity yet</p>
            <p className="text-[11px] text-neutral-300 mt-1">Events will appear here once the table is created in Supabase.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50/70">
                    <th className="text-left text-[10px] font-bold tracking-widest uppercase text-neutral-400 px-5 py-3">Staff</th>
                    <th className="text-left text-[10px] font-bold tracking-widest uppercase text-neutral-400 px-5 py-3">Action</th>
                    <th className="text-left text-[10px] font-bold tracking-widest uppercase text-neutral-400 px-5 py-3 hidden md:table-cell">Details</th>
                    <th className="text-left text-[10px] font-bold tracking-widest uppercase text-neutral-400 px-5 py-3 hidden lg:table-cell">IP</th>
                    <th className="text-left text-[10px] font-bold tracking-widest uppercase text-neutral-400 px-5 py-3">When</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-neutral-50 transition-colors">

                      {/* Staff */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${getAvatarColor(log.user_id)}`}>
                            <span className="text-[10px] font-black text-white">{getInitials(log.user_name, log.user_email)}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-neutral-900 text-xs leading-tight">
                              {log.user_name || <span className="italic text-neutral-400 font-normal">Unknown</span>}
                            </p>
                            <p className="text-[10px] text-neutral-400">{log.user_email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3.5">
                        <ActionBadge action={log.action} />
                      </td>

                      {/* Details */}
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        {log.entity_name ? (
                          <div>
                            <p className="text-xs font-semibold text-neutral-700">{log.entity_name}</p>
                            {log.details?.from && log.details?.to && (
                              <p className="text-[10px] text-neutral-400">
                                {log.details.from} → {log.details.to}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-neutral-300 text-[11px]">—</span>
                        )}
                      </td>

                      {/* IP */}
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <span className="text-[11px] text-neutral-400 font-mono">
                          {log.ip_address ?? "—"}
                        </span>
                      </td>

                      {/* When */}
                      <td className="px-5 py-3.5">
                        <p className="text-[11px] text-neutral-700 font-medium" title={formatTime(log.created_at)}>
                          {relativeTime(log.created_at)}
                        </p>
                        <p className="text-[10px] text-neutral-400">{formatTime(log.created_at)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-5 py-3 border-t border-neutral-100 flex items-center justify-between bg-neutral-50/70">
                <p className="text-[11px] text-neutral-400 tabular-nums">
                  {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total.toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1.5 text-xs font-semibold text-neutral-600 border border-neutral-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Prev
                  </button>
                  <span className="text-[11px] text-neutral-400 tabular-nums">{page + 1} / {totalPages}</span>
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1.5 text-xs font-semibold text-neutral-600 border border-neutral-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

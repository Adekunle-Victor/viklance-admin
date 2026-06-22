"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from "@/store/slices/notifications.slice";

const pageLabels: Record<string, string> = {
  "/dashboard":            "Overview",
  "/dashboard/leads":      "Leads",
  "/dashboard/projects":   "Projects",
  "/dashboard/referrals":  "Referrals",
  "/dashboard/payouts":    "Payouts",
  "/dashboard/prospects":  "Accounts",
  "/dashboard/staff":      "Sales Team",
  "/dashboard/outreach":   "Outreach",
  "/dashboard/settings":   "Settings",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const label    = pageLabels[pathname] ?? "Dashboard";
  const dispatch = useAppDispatch();

  const user  = useAppSelector((s) => s.auth.user);
  const items = useAppSelector((s) => s.notifications.items);

  const fullName  = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? "";
  const initials  = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0].toUpperCase())
    .join("") || "?";
  const roleLabel = "Admin";

  const unread = items.filter((n) => !n.read).length;

  const [open,    setOpen]    = useState(false);
  const [mounted, setMounted] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkRead = async (id: number) => {
    dispatch(markNotificationRead(id));
  };

  const handleMarkAll = () => {
    dispatch(markAllNotificationsRead());
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-neutral-200 flex items-center px-4 sm:px-6 gap-4">

      {/* Menu + page title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden shrink-0 text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="lg:hidden w-px h-4 bg-neutral-200 shrink-0" />
        <h1 className="text-sm font-black text-neutral-900 tracking-tight truncate">{label}</h1>
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2 shrink-0">

        {/* Everything below is client-only (depends on localStorage-derived auth state) */}
        {mounted && <>

        {/* Notification bell */}
        <div ref={bellRef} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2a5 5 0 00-5 5v2.5L2.5 12h13L14 9.5V7a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M7 14a2 2 0 004 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {open && (
            <div className="fixed left-4 right-4 top-18.25 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 bg-white border border-neutral-200 rounded-2xl shadow-lg overflow-hidden z-50">

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                <p className="text-xs font-black text-neutral-900">Notifications</p>
                {unread > 0 && (
                  <button
                    onClick={handleMarkAll}
                    className="text-[11px] font-semibold text-neutral-400 hover:text-neutral-700 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-neutral-50">
                {items.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-neutral-400">No notifications yet.</p>
                ) : (
                  items.slice(0, 8).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.read && handleMarkRead(n.id)}
                      className={`px-4 py-3 flex flex-col gap-1 transition-colors ${
                        n.read ? "bg-white" : "bg-blue-50 cursor-pointer hover:bg-blue-100"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs font-bold leading-snug ${n.read ? "text-neutral-600" : "text-neutral-900"}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-neutral-400 shrink-0 mt-0.5">{timeAgo(n.created_at)}</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 leading-snug">{n.body}</p>
                      {n.demo_url && (
                        <a
                          href={n.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors mt-0.5 inline-flex items-center gap-1"
                        >
                          View Demo
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M2 8L8 2M8 2H4M8 2v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-neutral-200" />

        {/* Name + role */}
        <div className="hidden md:flex flex-col items-end gap-0.5">
          <span className="text-xs font-bold text-neutral-900 leading-none">{fullName || "—"}</span>
          {roleLabel && (
            <span className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 leading-none">
              {roleLabel}
            </span>
          )}
        </div>

        {/* Role pill — sm only */}
        {roleLabel && (
          <span className="md:hidden text-[10px] font-bold tracking-widest uppercase text-neutral-500 bg-neutral-100 rounded-full px-2.5 py-1">
            {roleLabel}
          </span>
        )}

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-neutral-900 ring-2 ring-neutral-100 flex items-center justify-center shrink-0">
          <span className="text-[11px] font-black text-white tracking-tight">{initials}</span>
        </div>

        </> /* end mounted */}
      </div>
    </header>
  );
}

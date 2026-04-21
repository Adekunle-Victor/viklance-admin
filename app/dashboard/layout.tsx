"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMe } from "@/store/slices/auth.slice";
import Topbar from "@/components/Topbar.component";

const Sidebar = dynamic(() => import("@/components/Sidebar.component"), {
  ssr: false,
  loading: () => (
    <aside className="fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-neutral-200 hidden lg:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-neutral-200 shrink-0">
        <span className="text-sm font-black tracking-widest uppercase text-neutral-900">Viklance</span>
      </div>
    </aside>
  ),
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const dispatch     = useAppDispatch();
  const accessToken  = useAppSelector((s) => s.auth.accessToken);
  const user         = useAppSelector((s) => s.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (accessToken && !user) {
      dispatch(fetchMe());
    }
  }, [accessToken, user, dispatch]);

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:ml-60 min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

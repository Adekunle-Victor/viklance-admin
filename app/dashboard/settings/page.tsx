"use client";

import SettingsStaff from "@/components/settings/SettingsStaff.component";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage staff access.</p>
      </div>

      <SettingsStaff />
    </div>
  );
}

import SettingsProfile from "@/components/settings/SettingsProfile.component";
import SettingsReferral from "@/components/settings/SettingsReferral.component";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Settings</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage your admin profile and referral configuration.</p>
      </div>

      <SettingsProfile />
      <SettingsReferral />
    </div>
  );
}

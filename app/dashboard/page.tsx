const stats = [
  { label: "Total Leads",       value: "84",        delta: "+12 this month",  up: true  },
  { label: "Active Projects",   value: "7",         delta: "+2 this month",   up: true  },
  { label: "Referral Signups",  value: "31",        delta: "+8 this month",   up: true  },
  { label: "Pending Payouts",   value: "₦600,000",  delta: "3 requests",      up: false },
];

const recentLeads = [
  { name: "Emeka Osei",      email: "emeka@osei.ng",      service: "Web App",     date: "Apr 17",  status: "New"        },
  { name: "Sarah K.",        email: "sarah@buildco.io",   service: "Mobile App",  date: "Apr 16",  status: "In Review"  },
  { name: "Tunde Bello",     email: "tunde@myshop.com",   service: "AI Integration", date: "Apr 15", status: "Replied"  },
  { name: "Grace Mensah",    email: "grace@gmensah.com",  service: "Product Design", date: "Apr 14", status: "New"      },
  { name: "Femi Adeyemi",    email: "femi@fintechco.io",  service: "Web App",     date: "Apr 13",  status: "Closed"     },
];

const recentReferrals = [
  { code: "emeka-xy9z",   clicks: 24,  leads: 3,  conversions: 1,  earned: "₦100,000"  },
  { code: "sarah-k2mp",   clicks: 11,  leads: 1,  conversions: 0,  earned: "—"          },
  { code: "victor-a1bc",  clicks: 47,  leads: 12, conversions: 3,  earned: "₦300,000"  },
  { code: "tolu-m8yz",    clicks: 6,   leads: 0,  conversions: 0,  earned: "—"          },
];

const statusColor: Record<string, string> = {
  "New":       "bg-blue-50 text-blue-700 border-blue-200",
  "In Review": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Replied":   "bg-neutral-100 text-neutral-700 border-neutral-200",
  "Closed":    "bg-green-50 text-green-700 border-green-200",
};

export default function DashboardPage() {
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
            <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 mb-3">
              {s.label}
            </p>
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
          <button className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors">
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
              {recentLeads.map((lead) => (
                <tr key={lead.email} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-neutral-900">{lead.name}</td>
                  <td className="px-6 py-4 text-neutral-500 hidden sm:table-cell">{lead.email}</td>
                  <td className="px-6 py-4 text-neutral-500 hidden md:table-cell">{lead.service}</td>
                  <td className="px-6 py-4 text-neutral-400 hidden lg:table-cell">{lead.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusColor[lead.status]}`}>
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
          <button className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors">
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Code</th>
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Clicks</th>
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden sm:table-cell">Leads</th>
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3 hidden md:table-cell">Conversions</th>
                <th className="text-left text-[11px] font-semibold tracking-widest uppercase text-neutral-400 px-6 py-3">Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {recentReferrals.map((r) => (
                <tr key={r.code} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-neutral-700 font-semibold">{r.code}</td>
                  <td className="px-6 py-4 text-neutral-900 font-semibold">{r.clicks}</td>
                  <td className="px-6 py-4 text-neutral-500 hidden sm:table-cell">{r.leads}</td>
                  <td className="px-6 py-4 text-neutral-500 hidden md:table-cell">{r.conversions}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${r.earned === "—" ? "text-neutral-300" : "text-green-700"}`}>
                      {r.earned}
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

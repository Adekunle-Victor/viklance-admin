export type PayoutStatus = "Paid" | "Pending" | "—";

export interface Referrer {
  id:            number;
  name:          string;
  email:         string;
  code:          string;
  clicks:        number;
  leads:         number;
  conversions:   number;
  earned:        number;
  payoutStatus:  PayoutStatus;
  joined:        string;
}

export const PAYOUT_COLORS: Record<PayoutStatus, string> = {
  "Paid":    "bg-green-50 text-green-700 border-green-200",
  "Pending": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "—":       "bg-neutral-100 text-neutral-400 border-neutral-200",
};

export const ALL_REFERRERS: Referrer[] = [
  { id: 1, name: "Victor A.",    email: "victor@example.com", code: "victor-a1bc", clicks: 47, leads: 12, conversions: 3, earned: 300000, payoutStatus: "Paid",    joined: "Mar 1, 2026"  },
  { id: 2, name: "Emeka Osei",   email: "emeka@osei.ng",      code: "emeka-xy9z",  clicks: 24, leads: 3,  conversions: 1, earned: 100000, payoutStatus: "Pending", joined: "Mar 8, 2026"  },
  { id: 3, name: "Sarah K.",     email: "sarah@buildco.io",   code: "sarah-k2mp",  clicks: 11, leads: 1,  conversions: 0, earned: 0,      payoutStatus: "—",       joined: "Mar 15, 2026" },
  { id: 4, name: "Tolu M.",      email: "tolu@example.com",   code: "tolu-m8yz",   clicks: 6,  leads: 0,  conversions: 0, earned: 0,      payoutStatus: "—",       joined: "Mar 22, 2026" },
  { id: 5, name: "Dami O.",      email: "dami@example.com",   code: "dami-p3qr",   clicks: 19, leads: 4,  conversions: 1, earned: 100000, payoutStatus: "Pending", joined: "Apr 1, 2026"  },
  { id: 6, name: "Chidi N.",     email: "chidi@example.com",  code: "chidi-b7st",  clicks: 31, leads: 6,  conversions: 2, earned: 200000, payoutStatus: "Paid",    joined: "Apr 5, 2026"  },
  { id: 7, name: "Amara Diallo", email: "amara@healthng.com", code: "amara-d4uv",  clicks: 8,  leads: 1,  conversions: 0, earned: 0,      payoutStatus: "—",       joined: "Apr 10, 2026" },
];

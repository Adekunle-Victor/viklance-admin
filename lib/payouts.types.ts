export type PayoutStatus = "Pending" | "Paid" | "Rejected";

export interface Payout {
  id:        number;
  referrer:  string;
  email:     string;
  code:      string;
  amount:    number;
  method:    string;
  requested: string;
  paid:      string | null;
  status:    PayoutStatus;
}

export const PAYOUT_STATUS_COLORS: Record<PayoutStatus, string> = {
  "Pending":  "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Paid":     "bg-green-50 text-green-700 border-green-200",
  "Rejected": "bg-red-50 text-red-700 border-red-200",
};

export const ALL_PAYOUTS: Payout[] = [
  { id: 1, referrer: "Victor A.",    email: "victor@example.com", code: "victor-a1bc", amount: 100000, method: "Bank Transfer", requested: "Mar 15, 2026", paid: "Mar 18, 2026", status: "Paid"     },
  { id: 2, referrer: "Victor A.",    email: "victor@example.com", code: "victor-a1bc", amount: 100000, method: "Bank Transfer", requested: "Mar 28, 2026", paid: "Apr 1, 2026",  status: "Paid"     },
  { id: 3, referrer: "Victor A.",    email: "victor@example.com", code: "victor-a1bc", amount: 100000, method: "Bank Transfer", requested: "Apr 10, 2026", paid: null,           status: "Pending"  },
  { id: 4, referrer: "Emeka Osei",   email: "emeka@osei.ng",      code: "emeka-xy9z",  amount: 100000, method: "Paystack",      requested: "Apr 12, 2026", paid: null,           status: "Pending"  },
  { id: 5, referrer: "Chidi N.",     email: "chidi@example.com",  code: "chidi-b7st",  amount: 100000, method: "Bank Transfer", requested: "Apr 3, 2026",  paid: "Apr 6, 2026",  status: "Paid"     },
  { id: 6, referrer: "Chidi N.",     email: "chidi@example.com",  code: "chidi-b7st",  amount: 100000, method: "Bank Transfer", requested: "Apr 8, 2026",  paid: null,           status: "Pending"  },
  { id: 7, referrer: "Dami O.",      email: "dami@example.com",   code: "dami-p3qr",   amount: 100000, method: "PayPal",        requested: "Apr 14, 2026", paid: null,           status: "Pending"  },
];

export type PayoutStatus = "Paid" | "Pending" | "None";

export interface Referrer {
  id:            number;
  name:          string;
  email:         string;
  code:          string;
  clicks:        number;
  leads:         number;   // computed by backend
  conversions:   number;   // computed by backend
  earned:        number;   // computed by backend
  payout_status: PayoutStatus;
  created_at:    string;
}

export const PAYOUT_COLORS: Record<PayoutStatus, string> = {
  "Paid":    "bg-green-50 text-green-700 border-green-200",
  "Pending": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "None":    "bg-neutral-100 text-neutral-400 border-neutral-200",
};

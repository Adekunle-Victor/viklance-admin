export type PayoutStatus = "Pending" | "Paid" | "Rejected";

export interface Payout {
  id:             number;
  ref_code:       string;
  amount:         number;
  method:         string;
  status:         PayoutStatus;
  paid_at:        string | null;
  created_at:     string;
  referrer_name:  string | null;  // joined from referrers table
  referrer_email: string | null;
}

export const PAYOUT_STATUS_COLORS: Record<PayoutStatus, string> = {
  "Pending":  "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Paid":     "bg-green-50 text-green-700 border-green-200",
  "Rejected": "bg-red-50 text-red-700 border-red-200",
};

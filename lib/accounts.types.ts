export type AccountStatus  = "New" | "Contacted" | "Interested" | "Proposal Sent" | "Converted" | "Lost";
export type AccountSource  = "Instagram" | "LinkedIn" | "Facebook" | "Google" | "In-person" | "Referral" | "Other";
export type AccountProduct = "Showcase" | "Listings" | "Other";

export interface Account {
  id:             number;
  name:           string;
  contact_person: string | null;
  email:          string | null;
  phone:          string | null;
  source:         AccountSource;
  product:        AccountProduct;
  status:         AccountStatus;
  notes:          string | null;
  deal_value:     string | null;
  assigned_to:    string;
  assigned_name:  string;
  created_at:     string;
  updated_at:     string;
}

export const ACCOUNT_STATUSES: AccountStatus[] = [
  "New", "Contacted", "Interested", "Proposal Sent", "Converted", "Lost",
];

export const SOURCES: AccountSource[] = [
  "Instagram", "LinkedIn", "Facebook", "Google", "In-person", "Referral", "Other",
];

export const PRODUCTS: AccountProduct[] = ["Showcase", "Listings", "Other"];

export const STATUS_COLORS: Record<AccountStatus, string> = {
  "New":           "bg-blue-50 text-blue-700 border-blue-200",
  "Contacted":     "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Interested":    "bg-purple-50 text-purple-700 border-purple-200",
  "Proposal Sent": "bg-orange-50 text-orange-700 border-orange-200",
  "Converted":     "bg-green-50 text-green-700 border-green-200",
  "Lost":          "bg-neutral-100 text-neutral-500 border-neutral-200",
};

export const SOURCE_COLORS: Record<AccountSource, string> = {
  "Instagram": "bg-pink-50 text-pink-700 border-pink-200",
  "LinkedIn":  "bg-sky-50 text-sky-700 border-sky-200",
  "Facebook":  "bg-blue-50 text-blue-700 border-blue-200",
  "Google":    "bg-red-50 text-red-700 border-red-200",
  "In-person": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Referral":  "bg-violet-50 text-violet-700 border-violet-200",
  "Other":     "bg-neutral-50 text-neutral-500 border-neutral-200",
};

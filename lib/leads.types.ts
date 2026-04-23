export type LeadStatus = "New" | "In Review" | "Replied" | "Closed";

export interface Lead {
  id:          number;
  name:        string;
  email:       string;
  company:     string | null;
  service:     string;
  budget:      string | null;
  message:     string;
  ref_code:    string | null;
  status:      LeadStatus;
  demo_ready:  boolean;
  demo_url:    string | null;
  created_at:  string;
}

export const STATUS_COLORS: Record<LeadStatus, string> = {
  "New":       "bg-blue-50 text-blue-700 border-blue-200",
  "In Review": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Replied":   "bg-neutral-100 text-neutral-700 border-neutral-200",
  "Closed":    "bg-green-50 text-green-700 border-green-200",
};

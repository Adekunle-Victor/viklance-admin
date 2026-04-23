export type ProspectStatus =
  | "New"
  | "Contacted"
  | "Interested"
  | "Proposal Sent"
  | "Converted"
  | "Lost";

export const PROSPECT_STATUSES: ProspectStatus[] = [
  "New", "Contacted", "Interested", "Proposal Sent", "Converted", "Lost",
];

export interface Prospect {
  id:               number;
  instagram_handle: string;
  name:             string;
  phone:            string | null;
  email:            string | null;
  notes:            string | null;
  status:           ProspectStatus;
  assigned_to:      string;
  assigned_name:    string;
  demo_ready:       boolean;
  demo_url:         string | null;
  created_at:       string;
  updated_at:       string;
}

export const STATUS_COLORS: Record<ProspectStatus, string> = {
  "New":           "bg-blue-50 text-blue-700 border-blue-200",
  "Contacted":     "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Interested":    "bg-purple-50 text-purple-700 border-purple-200",
  "Proposal Sent": "bg-orange-50 text-orange-700 border-orange-200",
  "Converted":     "bg-green-50 text-green-700 border-green-200",
  "Lost":          "bg-neutral-100 text-neutral-500 border-neutral-200",
};

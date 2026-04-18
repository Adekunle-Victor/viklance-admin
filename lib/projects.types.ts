export type ProjectStatus = "In Progress" | "Under Review" | "Completed" | "On Hold";

export interface Project {
  id:          number;
  name:        string;
  client:      string;
  email:       string;
  service:     string;
  budget:      string | null;
  start_date:  string | null;
  deadline:    string | null;
  description: string | null;
  status:      ProjectStatus;
  created_at:  string;
}

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  "In Progress":  "bg-blue-50 text-blue-700 border-blue-200",
  "Under Review": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Completed":    "bg-green-50 text-green-700 border-green-200",
  "On Hold":      "bg-neutral-100 text-neutral-500 border-neutral-200",
};

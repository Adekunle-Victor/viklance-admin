export interface Notification {
  id:           number;
  recipient_id: string;
  type:         string;
  title:        string;
  body:         string;
  lead_id:      number | null;
  demo_url:     string | null;
  read:         boolean;
  created_at:   string;
}

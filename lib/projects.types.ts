export type ProjectStatus = "In Progress" | "Under Review" | "Completed" | "On Hold";

export interface Project {
  id:       number;
  name:     string;
  client:   string;
  email:    string;
  service:  string;
  budget:   string;
  start:    string;
  deadline: string;
  status:   ProjectStatus;
  desc:     string;
}

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  "In Progress":   "bg-blue-50 text-blue-700 border-blue-200",
  "Under Review":  "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Completed":     "bg-green-50 text-green-700 border-green-200",
  "On Hold":       "bg-neutral-100 text-neutral-500 border-neutral-200",
};

export const ALL_PROJECTS: Project[] = [
  { id: 1, name: "Customer Portal",     client: "Osei Ventures",  email: "emeka@osei.ng",        service: "Web App",        budget: "₦2,500,000",  start: "Mar 1, 2026",  deadline: "May 15, 2026",  status: "In Progress",  desc: "Multi-role customer portal with real-time shipment tracking and invoice management." },
  { id: 2, name: "Field Worker App",    client: "BuildCo",        email: "sarah@buildco.io",     service: "Mobile App",     budget: "₦8,000,000",  start: "Feb 15, 2026", deadline: "Jun 1, 2026",   status: "In Progress",  desc: "React Native app for field workers with offline-first support and GPS tracking." },
  { id: 3, name: "AI Recommender",      client: "MyShop",         email: "tunde@myshop.com",     service: "AI Integration", budget: "₦3,200,000",  start: "Jan 10, 2026", deadline: "Apr 10, 2026",  status: "Under Review", desc: "OpenAI-powered product recommendation engine integrated into existing e-commerce stack." },
  { id: 4, name: "Core Banking System", client: "FintechCo",      email: "femi@fintechco.io",    service: "Web App",        budget: "₦22,000,000", start: "Nov 1, 2025",  deadline: "Jul 1, 2026",   status: "In Progress",  desc: "Full-featured core banking system with multi-currency wallets and transaction processing." },
  { id: 5, name: "Telemedicine App",    client: "HealthNG",       email: "amara@healthng.com",   service: "Mobile App",     budget: "₦9,500,000",  start: "Dec 5, 2025",  deadline: "May 1, 2026",   status: "Completed",    desc: "Doctor-patient telemedicine platform with scheduling, video calls, and Paystack integration." },
  { id: 6, name: "HR Platform",         client: "EZ Solutions",   email: "chukwudi@ez.io",       service: "Web App",        budget: "₦4,000,000",  start: "Mar 15, 2026", deadline: "Jun 30, 2026",  status: "In Progress",  desc: "SME HR management system with payroll automation, leave tracking, and employee self-service." },
  { id: 7, name: "Fashion Marketplace", client: "FashionHub",     email: "fatima@fashionhub.ng", service: "Web App",        budget: "₦3,800,000",  start: "Feb 1, 2026",  deadline: "Apr 30, 2026",  status: "On Hold",      desc: "Multi-vendor fashion marketplace with AI size recommendations and vendor analytics." },
];

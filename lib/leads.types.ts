export type LeadStatus = "New" | "In Review" | "Replied" | "Closed";

export interface Lead {
  id:      number;
  name:    string;
  email:   string;
  company: string;
  service: string;
  budget:  string;
  date:    string;
  status:  LeadStatus;
  ref:     string | null;
  message: string;
}

export const STATUS_COLORS: Record<LeadStatus, string> = {
  "New":       "bg-blue-50 text-blue-700 border-blue-200",
  "In Review": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Replied":   "bg-neutral-100 text-neutral-700 border-neutral-200",
  "Closed":    "bg-green-50 text-green-700 border-green-200",
};

export const ALL_LEADS: Lead[] = [
  { id: 1,  name: "Emeka Osei",      email: "emeka@osei.ng",        company: "Osei Ventures", service: "Web App",        budget: "₦1M–₦5M",   date: "Apr 17, 2026", status: "New",       ref: "victor-a1bc", message: "We need a customer portal for our logistics firm with real-time tracking." },
  { id: 2,  name: "Sarah K.",        email: "sarah@buildco.io",     company: "BuildCo",       service: "Mobile App",     budget: "₦5M–₦20M",  date: "Apr 16, 2026", status: "In Review", ref: null,          message: "Looking for a React Native app for field workers with offline support." },
  { id: 3,  name: "Tunde Bello",     email: "tunde@myshop.com",     company: "MyShop",        service: "AI Integration", budget: "₦1M–₦5M",   date: "Apr 15, 2026", status: "Replied",   ref: "emeka-xy9z",  message: "We want to add AI-powered product recommendations to our e-commerce store." },
  { id: 4,  name: "Grace Mensah",    email: "grace@gmensah.com",    company: "—",             service: "Product Design", budget: "Under ₦1M", date: "Apr 14, 2026", status: "New",       ref: null,          message: "Need a full redesign of our SaaS dashboard, currently using Figma." },
  { id: 5,  name: "Femi Adeyemi",    email: "femi@fintechco.io",    company: "FintechCo",     service: "Web App",        budget: "₦20M+",     date: "Apr 13, 2026", status: "Closed",    ref: "victor-a1bc", message: "Core banking system with multi-currency wallet support." },
  { id: 6,  name: "Amara Diallo",    email: "amara@healthng.com",   company: "HealthNG",      service: "Mobile App",     budget: "₦5M–₦20M",  date: "Apr 11, 2026", status: "Replied",   ref: null,          message: "Telemedicine app for Nigerian patients — needs doctor scheduling and payments." },
  { id: 7,  name: "Chukwudi Eze",    email: "chukwudi@ez.io",       company: "EZ Solutions",  service: "Web App",        budget: "₦1M–₦5M",   date: "Apr 10, 2026", status: "In Review", ref: "tolu-m8yz",   message: "HR management platform for SMEs with payroll and leave tracking." },
  { id: 8,  name: "Ngozi Okonkwo",   email: "ngozi@ngozilaw.com",   company: "Ngozi Law",     service: "Product Design", budget: "Under ₦1M", date: "Apr 9, 2026",  status: "Closed",    ref: null,          message: "Simple legal consultation booking site with payment integration." },
  { id: 9,  name: "Babatunde A.",    email: "babs@agritech.ng",     company: "AgriTech NG",   service: "AI Integration", budget: "₦5M–₦20M",  date: "Apr 7, 2026",  status: "New",       ref: "sarah-k2mp",  message: "Crop disease detection model using mobile camera — need full MLOps setup." },
  { id: 10, name: "Fatima Musa",     email: "fatima@fashionhub.ng", company: "FashionHub",    service: "Web App",        budget: "₦1M–₦5M",   date: "Apr 5, 2026",  status: "Replied",   ref: null,          message: "Multi-vendor fashion marketplace — inspired by Zara meets Jumia." },
];

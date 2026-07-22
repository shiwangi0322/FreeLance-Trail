import {
  ShoppingCart,
  Smartphone,
  Globe,
  Palette,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| mockData.js
|--------------------------------------------------------------------------
*/

export const mockStats = {
  totalProjects: 8,
  totalClients: 6,
  totalEarnings: 2480000,
  overdueCount: 6,
  overdueAmount: 160000,

  // New dashboard values
  totalRevenue: "₹24.8L",
  activeProjects: 8,
  pendingInvoices: 12,
  aiProposals: 18,
};

export const mockSparklines = {
  revenue: [12, 18, 15, 22, 28, 35, 40],
  projects: [4, 5, 5, 6, 7, 8, 8],
  invoices: [8, 9, 10, 11, 12, 12, 12],
  proposals: [10, 12, 13, 15, 16, 17, 18],
};

export const mockRevenueData = [
  { label: "1 May", revenue: 0 },
  { label: "8 May", revenue: 950000 },
  { label: "15 May", revenue: 1600000 },
  { label: "22 May", revenue: 2050000 },
  { label: "29 May", revenue: 2480000 },
];

export const mockInvoiceStatus = [
  { label: "Paid", count: 16, color: "#10b981" },
  { label: "Sent", count: 10, color: "#3b82f6" },
  { label: "Overdue", count: 6, color: "#ef4444" },
  { label: "Draft", count: 4, color: "#94a3b8" },
];

export const mockRecentActivity = [
  {
    id: 1,
    type: "payment",
    message: "Invoice INV-2026-0042 marked as paid",
    timeAgo: "2m ago",
  },
  {
    id: 2,
    type: "proposal",
    message: "New proposal generated for TechNova Inc.",
    timeAgo: "1h ago",
  },
  {
    id: 3,
    type: "document",
    message: 'Document "Project Plan.pdf" uploaded',
    timeAgo: "3h ago",
  },
  {
    id: 4,
    type: "client",
    message: "Client BrightWave Solutions added",
    timeAgo: "5h ago",
  },
  {
    id: 5,
    type: "project",
    message: 'Project "Mobile App Development" completed',
    timeAgo: "1d ago",
  },
];

export const mockTopProjects = [
  {
    id: 1,
    name: "E-commerce Platform",
    clientName: "BrightWave Solutions",
    progress: 75,
    status: "Active",
    icon: ShoppingCart,
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
  },
  {
    id: 2,
    name: "Mobile App Development",
    clientName: "NextGen Labs",
    progress: 60,
    status: "Active",
    icon: Smartphone,
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
  },
  {
    id: 3,
    name: "Website Redesign",
    clientName: "Visionary Enterprises",
    progress: 40,
    status: "On Hold",
    icon: Globe,
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
  },
  {
    id: 4,
    name: "Brand Identity Design",
    clientName: "Creative Minds Co.",
    progress: 20,
    status: "Planning",
    icon: Palette,
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
  },
];

export const mockUpcomingSchedule = [
  {
    id: 1,
    title: "Client Meeting",
    subtitle: "BrightWave Solutions",
    time: "10:00 AM",
    color: "#10b981",
  },
  {
    id: 2,
    title: "Project Deadline",
    subtitle: "E-commerce Platform",
    time: "02:30 PM",
    color: "#7c3aed",
  },
  {
    id: 3,
    title: "Invoice Follow-up",
    subtitle: "3 invoices pending",
    time: "04:00 PM",
    color: "#f97316",
  },
];

export const mockAIInsight = {
  title: "AI Insight",
  message:
    "You have 6 overdue invoices worth ₹1,60,000. Send reminders to improve cash flow.",
  buttonText: "Send Reminders",
};

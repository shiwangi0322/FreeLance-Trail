// src/data/mockProjects.example.js
// Reference only — merge these fields into your existing projectService.js
// mock data. Each project needs: startDate, endDate (ISO strings), a status
// of "in_progress" | "completed" | "on_hold" | "planned", and an `icon`
// (a lucide-react component reference, not a string, so ProjectTimeline can
// render it directly).

import { ShoppingCart, Smartphone, Palette, Globe, LayoutDashboard, Megaphone, FileText } from "lucide-react";

export const mockProjects = [
    {
        id: 1,
        title: "E-commerce Platform",
        client: "BrightWave Solutions",
        status: "in_progress",
        startDate: "2026-07-01",
        endDate: "2026-07-20",
        icon: ShoppingCart,
    },
    {
        id: 2,
        title: "Mobile App Development",
        client: "NextGen Labs",
        status: "planned",
        startDate: "2026-07-03",
        endDate: "2026-07-15",
        icon: Smartphone,
    },
    {
        id: 3,
        title: "Brand Identity Design",
        client: "Creative Minds Co.",
        status: "on_hold",
        startDate: "2026-07-05",
        endDate: "2026-07-13",
        icon: Palette,
    },
    {
        id: 4,
        title: "Website Redesign",
        client: "Visionary Enterprises",
        status: "completed",
        startDate: "2026-06-28",
        endDate: "2026-07-05",
        icon: Globe,
    },
    {
        id: 5,
        title: "SaaS Dashboard",
        client: "TechNova Inc.",
        status: "in_progress",
        startDate: "2026-07-02",
        endDate: "2026-07-12",
        icon: LayoutDashboard,
    },
    {
        id: 6,
        title: "Marketing Landing Page",
        client: "Marketify Digital",
        status: "on_hold",
        startDate: "2026-06-29",
        endDate: "2026-07-06",
        icon: Megaphone,
    },
    {
        id: 7,
        title: "Product Documentation",
        client: "SoftSync Solutions",
        status: "completed",
        startDate: "2026-07-04",
        endDate: "2026-07-11",
        icon: FileText,
    },
];

// Example activity feed data — in your real app this would come from an
// /api/activity endpoint or be derived from project update timestamps.
export const mockActivity = [
    { id: 1, actorInitial: "E", actorName: "Ethan", message: 'E-commerce Platform: milestone "Payment Gateway" completed', timestamp: "2h ago" },
    { id: 2, actorInitial: "W", actorName: "Website Redesign", message: "Website Redesign: design review completed", timestamp: "5h ago" },
    { id: 3, actorInitial: "M", actorName: "Mobile App", message: 'Mobile App Development: new task "API Integration" added', timestamp: "1d ago" },
];
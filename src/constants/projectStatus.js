// src/constants/projectStatus.js
// Single source of truth for status colors/labels — used by ProjectCard,
// ProjectTimeline, ProjectOverviewDonut, and UpcomingDeadlines so adding a
// new status later is a one-line change here instead of scattered conditionals.

export const STATUS_LABELS = {
    in_progress: "In Progress",
    completed: "Completed",
    on_hold: "On Hold",
    planned: "Planned",
};

// Hex values for Recharts (SVG fill needs real hex, not Tailwind classes)
export const STATUS_HEX = {
    in_progress: "#8B5CF6", // violet
    completed: "#22C55E",   // green
    on_hold: "#F97316",     // orange
    planned: "#3B82F6",     // blue
};

// Tailwind classes for DOM elements (badges, bars, dots)
export const STATUS_STYLES = {
    in_progress: {
        bar: "bg-violet-500",
        dot: "bg-violet-500",
        badge: "bg-violet-100 text-violet-700",
    },
    completed: {
        bar: "bg-emerald-500",
        dot: "bg-emerald-500",
        badge: "bg-emerald-100 text-emerald-700",
    },
    on_hold: {
        bar: "bg-orange-500",
        dot: "bg-orange-500",
        badge: "bg-orange-100 text-orange-700",
    },
    planned: {
        bar: "bg-blue-500",
        dot: "bg-blue-500",
        badge: "bg-blue-100 text-blue-700",
    },
};

export const STATUS_ORDER = ["in_progress", "completed", "on_hold", "planned"];
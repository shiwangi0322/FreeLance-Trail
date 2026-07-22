// src/data/mockClients.example.js
// Reference only — merge these fields into your existing clientService.js
// mock data / API response shape. Each client needs: initials, avatarColor
// (hex, used for the logo square), projectsCount, totalSpent, status
// ("active" | "inactive"), and addedDate (ISO string).

export const mockClients = [
    { id: 1, name: "BrightWave Solutions", email: "contact@brightwave.com", initials: "B", avatarColor: "#111827", projectsCount: 3, totalSpent: 124000, status: "active", addedDate: "2026-05-10" },
    { id: 2, name: "NextGen Labs", email: "hello@nextgenlabs.io", initials: "N", avatarColor: "#3B82F6", projectsCount: 2, totalSpent: 87500, status: "active", addedDate: "2026-05-18" },
    { id: 3, name: "Creative Minds Co.", email: "info@creativeminds.co", initials: "C", avatarColor: "#F97316", projectsCount: 1, totalSpent: 42000, status: "inactive", addedDate: "2026-04-02" },
    { id: 4, name: "Visionary Enterprises", email: "business@visionary.com", initials: "V", avatarColor: "#10B981", projectsCount: 4, totalSpent: 158000, status: "active", addedDate: "2026-03-22" },
    { id: 5, name: "TechNova Inc.", email: "hello@technova.com", initials: "T", avatarColor: "#8B5CF6", projectsCount: 2, totalSpent: 63000, status: "active", addedDate: "2026-06-24" },
    { id: 6, name: "Marketify Digital", email: "hi@marketifydigital.com", initials: "M", avatarColor: "#F59E0B", projectsCount: 1, totalSpent: 215000, status: "inactive", addedDate: "2026-05-28" },
    { id: 7, name: "SoftSync Solutions", email: "team@softsync.com", initials: "A", avatarColor: "#3B82F6", projectsCount: 3, totalSpent: 90000, status: "active", addedDate: "2026-05-24" },
    { id: 8, name: "Elite Partners", email: "contact@elitepartners.com", initials: "E", avatarColor: "#EC4899", projectsCount: 1, totalSpent: 190000, status: "inactive", addedDate: "2026-05-18" },
];

// Cumulative client growth by month — feed real data by counting clients
// with addedDate <= end of each month, or track it server-side.
export const mockClientGrowth = [
    { month: "Jan", total: 8 },
    { month: "Feb", total: 11 },
    { month: "Mar", total: 14 },
    { month: "Apr", total: 16 },
    { month: "May", total: 21 },
    { month: "Jun", total: 24 },
];
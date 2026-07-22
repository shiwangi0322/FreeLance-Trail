// src/constants/clientStatus.js
// Single source of truth for client status colors/labels — same pattern as
// projectStatus.js, so adding a status later is a one-line change here.

export const CLIENT_STATUS_LABELS = {
    active: "Active",
    inactive: "Inactive",
};

export const CLIENT_STATUS_HEX = {
    active: "#22C55E",   // green
    inactive: "#9CA3AF", // gray
    new: "#8B5CF6",      // violet — used only in the overview donut's 3rd slice
};

export const CLIENT_STATUS_STYLES = {
    active: { dot: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700" },
    inactive: { dot: "bg-gray-400", badge: "bg-gray-100 text-gray-500" },
};
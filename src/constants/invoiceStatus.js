// src/constants/invoiceStatus.js
// Single source of truth for invoice status colors/labels — same pattern as
// projectStatus.js / clientStatus.js.

export const INVOICE_STATUS_LABELS = {
    paid: "Paid",
    pending: "Pending",
    overdue: "Overdue",
    draft: "Draft",
};

export const INVOICE_STATUS_STYLES = {
    paid: { badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
    pending: { badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
    overdue: { badge: "bg-red-100 text-red-700", dot: "bg-red-500" },
    draft: { badge: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
};

export const INVOICE_STATUS_ORDER = ["paid", "pending", "overdue", "draft"];
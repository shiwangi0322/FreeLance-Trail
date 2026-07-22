// src/components/invoices/InvoiceListItem.jsx
import { MoreVertical } from "lucide-react";
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_STYLES } from "../../constants/invoiceStatus";

function formatCurrency(amount) {
    return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Purely presentational — Invoices.jsx owns which invoice is selected and
 * passes `isSelected` + `onSelect` down, so this stays reusable (e.g. inside
 * a client's own invoice history later) without dragging routing along.
 */
export default function InvoiceListItem({ invoice, isSelected, onSelect, onOpenMenu }) {
    const styles = INVOICE_STATUS_STYLES[invoice.status];

    return (
        <button
            type="button"
            onClick={() => onSelect(invoice)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${isSelected ? "bg-violet-50 ring-1 ring-violet-200" : "hover:bg-gray-50"
                }`}
        >
            <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white"
                style={{ backgroundColor: invoice.client.avatarColor }}
            >
                {invoice.client.initials}
            </span>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{invoice.number}</p>
                <p className="truncate text-xs text-gray-400">{invoice.client.name}</p>
            </div>

            <div className="shrink-0 text-right">
                <p className="text-xs text-gray-400">{formatDate(invoice.issueDate)}</p>
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(invoice.total)}</p>
            </div>

            <span className={`ml-1 shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${styles.badge}`}>
                {INVOICE_STATUS_LABELS[invoice.status]}
            </span>

            <span
                role="button"
                tabIndex={-1}
                onClick={(e) => {
                    e.stopPropagation();
                    onOpenMenu?.(invoice);
                }}
                className="ml-1 shrink-0 rounded p-1 text-gray-300 hover:bg-gray-100 hover:text-gray-500"
            >
                <MoreVertical size={14} />
            </span>
        </button>
    );
}
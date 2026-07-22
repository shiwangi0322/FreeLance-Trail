
import { CheckCircle2, Mail, Pencil, Trash2, Receipt } from "lucide-react";

/*
|--------------------------------------------------------------------------
| InvoiceTable
|--------------------------------------------------------------------------
|
| Same presentational pattern as DocumentTable/ClientCard — no service
| calls here, just props in, callbacks out. Invoices.jsx owns the data
| fetching and mutations.
|
| Props:
|   invoices     — array of {
|                    id, invoiceNumber, clientName, projectName,
|                    amount, dueDate, status
|                  }
|                  status: "draft" | "sent" | "paid" | "overdue"
|   onEdit       — called with the invoice when the edit icon is clicked
|   onDelete     — called with the invoice when the trash icon is clicked
|   onMarkPaid   — called with the invoice's id when "Mark Paid" is clicked
|   onRemind     — called with the invoice's id when the reminder icon is clicked
|
| Mark Paid and Remind only make sense for unpaid invoices — a paid
| invoice doesn't need either action, so both are hidden (not just
| disabled) once status is "paid", to keep the row uncluttered.
|
*/

const STATUS_STYLES = {
    draft: "bg-slate-100 text-slate-600",
    sent: "bg-blue-100 text-blue-700",
    paid: "bg-emerald-100 text-emerald-700",
    overdue: "bg-red-100 text-red-700",
};

const STATUS_LABELS = {
    draft: "Draft",
    sent: "Sent",
    paid: "Paid",
    overdue: "Overdue",
};

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function InvoiceTable({ invoices, onEdit, onDelete, onMarkPaid, onRemind }) {
    if (invoices.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900 py-16 text-center">
                <Receipt size={32} className="mx-auto text-slate-300" />
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    No invoices yet — create your first one to get started.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
                    <tr className="text-xs text-slate-500 dark:text-slate-400">
                        <th className="px-5 py-3 font-medium">Invoice</th>
                        <th className="px-5 py-3 font-medium">Client</th>
                        <th className="px-5 py-3 font-medium">Due Date</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 text-right font-medium">Amount</th>
                        <th className="px-5 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => {
                        const isPaid = invoice.status === "paid";

                        return (
                            <tr
                                key={invoice.id}
                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                            >
                                <td className="px-5 py-4">
                                    <p className="font-medium text-slate-900 dark:text-white">{invoice.invoiceNumber}</p>
                                    <p className="text-xs text-slate-400">{invoice.projectName}</p>
                                </td>
                                <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{invoice.clientName}</td>
                                <td className="px-5 py-4 text-slate-500 dark:text-slate-400">{formatDate(invoice.dueDate)}</td>
                                <td className="px-5 py-4">
                                    <span
                                        className={[
                                            "rounded-full px-2.5 py-1 text-xs font-medium",
                                            STATUS_STYLES[invoice.status],
                                        ].join(" ")}
                                    >
                                        {STATUS_LABELS[invoice.status]}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-right font-medium text-slate-900 dark:text-white">
                                    {formatCurrency(invoice.amount)}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                        {!isPaid && (
                                            <>
                                                <button
                                                    type="button"
                                                    aria-label={`Mark ${invoice.invoiceNumber} as paid`}
                                                    onClick={() => onMarkPaid(invoice.id)}
                                                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                                                    title="Mark as paid"
                                                >
                                                    <CheckCircle2 size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    aria-label={`Send reminder for ${invoice.invoiceNumber}`}
                                                    onClick={() => onRemind(invoice.id)}
                                                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                                    title="Send reminder"
                                                >
                                                    <Mail size={16} />
                                                </button>
                                            </>
                                        )}
                                        <button
                                            type="button"
                                            aria-label={`Edit ${invoice.invoiceNumber}`}
                                            onClick={() => onEdit(invoice)}
                                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label={`Delete ${invoice.invoiceNumber}`}
                                            onClick={() => onDelete(invoice)}
                                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
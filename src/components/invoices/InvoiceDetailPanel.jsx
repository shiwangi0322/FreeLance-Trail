// src/components/invoices/InvoiceDetailPanel.jsx
import { Check, Send, Download, MoreHorizontal, Calendar, Clock, FileText, Paperclip, Plus } from "lucide-react";
import { INVOICE_STATUS_LABELS, INVOICE_STATUS_STYLES } from "../../constants/invoiceStatus";

function formatCurrency(amount) {
    return `₹${amount.toLocaleString("en-IN")}`;
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * `invoice` shape: { number, status, from, billTo, issueDate, dueDate,
 * paymentTerms, items: [{ id, name, description, qty, rate }], notes,
 * taxRate, amountPaid, paymentHistory: [], attachments: [] }
 *
 * Subtotal/tax/total/amountDue are all derived from `items` + `amountPaid`
 * here rather than trusting stored totals, so the numbers can never drift
 * out of sync with the line items shown above them.
 */
export default function InvoiceDetailPanel({ invoice, onMarkAsPaid, onSendReminder, onAddAttachment }) {
    if (!invoice) {
        return (
            <div className="flex h-full min-h-[400px] items-center justify-center rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-400 shadow-sm">
                Select an invoice to see the details.
            </div>
        );
    }

    const subtotal = invoice.items.reduce((sum, item) => sum + item.qty * item.rate, 0);
    const tax = Math.round(subtotal * (invoice.taxRate / 100));
    const total = subtotal + tax;
    const amountDue = total - invoice.amountPaid;
    const styles = INVOICE_STATUS_STYLES[invoice.status];

    return (
        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-gray-900">{invoice.number}</h2>
                    <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${styles.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                        {INVOICE_STATUS_LABELS[invoice.status]}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {invoice.status !== "paid" && (
                        <button
                            type="button"
                            onClick={() => onMarkAsPaid?.(invoice)}
                            className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700"
                        >
                            <Check size={14} />
                            Mark as Paid
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => onSendReminder?.(invoice)}
                        className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <Send size={14} />
                        Send Reminder
                    </button>
                    <button
                        type="button"
                        className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50"
                        aria-label="Download invoice"
                    >
                        <Download size={14} />
                    </button>
                    <button
                        type="button"
                        className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50"
                        aria-label="More options"
                    >
                        <MoreHorizontal size={14} />
                    </button>
                </div>
            </div>

            {/* From / Bill To */}
            <div className="grid grid-cols-1 gap-4 border-t border-gray-50 pt-4 sm:grid-cols-2">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">From</p>
                    <div className="mt-2 flex items-start gap-2">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-xs font-bold text-white">
                            {invoice.from.initials}
                        </span>
                        <div className="text-sm">
                            <p className="font-medium text-gray-900">{invoice.from.name}</p>
                            <p className="text-gray-400">{invoice.from.address}</p>
                            <p className="text-gray-400">{invoice.from.email}</p>
                            <p className="text-gray-400">{invoice.from.phone}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Bill To</p>
                    <div className="mt-2 flex items-start gap-2">
                        <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                            style={{ backgroundColor: invoice.billTo.avatarColor }}
                        >
                            {invoice.billTo.initials}
                        </span>
                        <div className="text-sm">
                            <p className="font-medium text-gray-900">{invoice.billTo.name}</p>
                            <p className="text-gray-400">{invoice.billTo.address}</p>
                            <p className="text-gray-400">{invoice.billTo.email}</p>
                            <p className="text-gray-400">{invoice.billTo.phone}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-6 border-t border-gray-50 pt-4 text-sm">
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-400">Issue Date</p>
                        <p className="font-medium text-gray-900">{formatDate(invoice.issueDate)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-400">Due Date</p>
                        <p className="font-medium text-gray-900">{formatDate(invoice.dueDate)}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <FileText size={14} className="text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-400">Payment Terms</p>
                        <p className="font-medium text-gray-900">{invoice.paymentTerms}</p>
                    </div>
                </div>
            </div>

            {/* Items table */}
            <div className="border-t border-gray-50 pt-4">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs text-gray-400">
                            <th className="pb-2 font-medium">Item</th>
                            <th className="pb-2 font-medium">Description</th>
                            <th className="pb-2 text-right font-medium">Qty</th>
                            <th className="pb-2 text-right font-medium">Rate</th>
                            <th className="pb-2 text-right font-medium">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {invoice.items.map((item) => (
                            <tr key={item.id}>
                                <td className="py-2 font-medium text-gray-900">{item.name}</td>
                                <td className="py-2 text-gray-500">{item.description}</td>
                                <td className="py-2 text-right text-gray-700">{item.qty}</td>
                                <td className="py-2 text-right text-gray-700">{formatCurrency(item.rate)}</td>
                                <td className="py-2 text-right font-medium text-gray-900">{formatCurrency(item.qty * item.rate)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Notes + Totals */}
            <div className="grid grid-cols-1 gap-4 border-t border-gray-50 pt-4 sm:grid-cols-2">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Notes</p>
                    <p className="mt-2 text-sm text-gray-600">{invoice.notes}</p>
                </div>

                <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-gray-500">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>Tax ({invoice.taxRate}%)</span>
                        <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-gray-900">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>Amount Paid</span>
                        <span>{formatCurrency(invoice.amountPaid)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-red-500">
                        <span>Amount Due</span>
                        <span>{formatCurrency(Math.max(amountDue, 0))}</span>
                    </div>
                </div>
            </div>

            {/* Payment History + Attachments */}
            <div className="grid grid-cols-1 gap-4 border-t border-gray-50 pt-4 sm:grid-cols-2">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Payment History</p>
                    {invoice.paymentHistory.length === 0 ? (
                        <p className="mt-4 text-center text-sm text-gray-400">No payments made yet.</p>
                    ) : (
                        <ul className="mt-2 space-y-2 text-sm">
                            {invoice.paymentHistory.map((payment) => (
                                <li key={payment.id} className="flex justify-between text-gray-600">
                                    <span>{formatDate(payment.date)}</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(payment.amount)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Attachments</p>
                    <ul className="mt-2 space-y-2">
                        {invoice.attachments.map((file) => (
                            <li key={file.id} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm">
                                <span className="flex items-center gap-2 text-gray-700">
                                    <Paperclip size={14} className="text-gray-400" />
                                    <span>
                                        {file.name}
                                        <span className="ml-1 text-xs text-gray-400">{file.size}</span>
                                    </span>
                                </span>
                                <Download size={14} className="cursor-pointer text-gray-400 hover:text-gray-600" />
                            </li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        onClick={() => onAddAttachment?.(invoice)}
                        className="mt-2 flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700"
                    >
                        <Plus size={14} />
                        Add Attachment
                    </button>
                </div>
            </div>
        </div>
    );
}
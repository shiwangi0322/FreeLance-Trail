// src/components/AI/cards/EmailResultCard.jsx
import { Pencil, Copy, Send, FileStack, Download } from "lucide-react";

/**
 * `data` shape: { to, subject, body (plain text, newlines preserve paragraphs),
 * signOffName, signOffTitle, signOffContact }
 */
export default function EmailResultCard({ data, onEdit, onCopy, onSendLater, onSaveTemplate, onExportPdf }) {
    return (
        <div className="max-w-2xl rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900">Here's your email:</h4>
                <button
                    type="button"
                    onClick={onCopy}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                    <Copy size={12} /> Copy Email
                </button>
            </div>

            <div className="mt-3 space-y-1 border-b border-gray-50 pb-3 text-sm">
                <p><span className="text-gray-400">To </span><span className="text-gray-700">{data.to}</span></p>
                <p><span className="text-gray-400">Subject </span><span className="font-medium text-gray-900">{data.subject}</span></p>
            </div>

            <div className="mt-3 whitespace-pre-line text-sm text-gray-700">{data.body}</div>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-50 pt-3">
                <button
                    type="button"
                    onClick={onEdit}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                    <Pencil size={13} /> Edit Email
                </button>
                <button
                    type="button"
                    onClick={onCopy}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                    <Copy size={13} /> Copy
                </button>
                <button
                    type="button"
                    onClick={onSendLater}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                    <Send size={13} /> Send Later
                </button>
                <button
                    type="button"
                    onClick={onSaveTemplate}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                    <FileStack size={13} /> Save as Template
                </button>
                <button
                    type="button"
                    onClick={onExportPdf}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                    <Download size={13} /> Export PDF
                </button>
            </div>
        </div>
    );
}
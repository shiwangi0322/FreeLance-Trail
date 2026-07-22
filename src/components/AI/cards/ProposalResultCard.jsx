// src/components/AI/cards/ProposalResultCard.jsx
import { Sparkles, Pencil, Copy, Download, Save } from "lucide-react";

function formatCurrency(amount) {
    return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * `data` shape: { project, client, timelineWeeks, budget, deliverables: [string] }
 */
export default function ProposalResultCard({ data, onEdit, onCopy, onExportPdf, onSave }) {
    return (
        <div className="max-w-xl rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-violet-700">
                    <Sparkles size={14} />
                    Proposal Generated
                </span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">Ready</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                    <p className="text-xs text-gray-400">Project</p>
                    <p className="font-medium text-gray-900">{data.project}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Client</p>
                    <p className="font-medium text-gray-900">{data.client}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Timeline</p>
                    <p className="font-medium text-gray-900">{data.timelineWeeks} Weeks</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Budget</p>
                    <p className="font-medium text-gray-900">{formatCurrency(data.budget)}</p>
                </div>
            </div>

            <div className="mt-3">
                <p className="text-xs text-gray-400">Deliverables</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {data.deliverables.map((item) => (
                        <span key={item} className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={onEdit}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                    <Pencil size={13} /> Edit
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
                    onClick={onExportPdf}
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                    <Download size={13} /> Export PDF
                </button>
                <button
                    type="button"
                    onClick={onSave}
                    className="ml-auto flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700"
                >
                    <Save size={13} /> Save
                </button>
            </div>
        </div>
    );
}
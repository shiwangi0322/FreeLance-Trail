// src/components/AI/AIContextSidebar.jsx
import { FileText, ChevronRight } from "lucide-react";

/**
 * `context` shape: {
 *   currentProject: { name, status },
 *   currentClient: { name, status },
 *   documents: [{ id, name, size, type }],
 *   activity: [{ id, label, time }],
 *   suggestions: [{ id, label, description }],
 *   quickActions: [{ id, label }],
 * }
 * All sections are optional — pass only what's relevant for the active tool
 * (e.g. summarize shows "Document" + "Summary Details" instead).
 */
export default function AIContextSidebar({ context, onSuggestionClick, onQuickActionClick, onViewAllDocuments, onViewAllActivity }) {
    return (
        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            {context.currentProject && (
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Current Project</p>
                    <div className="mt-2 flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                        <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-100 text-violet-600">
                                <FileText size={14} />
                            </span>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{context.currentProject.name}</p>
                                <p className="text-xs text-gray-400">{context.currentProject.status}</p>
                            </div>
                        </div>
                        <ChevronRight size={14} className="text-gray-300" />
                    </div>
                </div>
            )}

            {context.currentClient && (
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Current Client</p>
                    <div className="mt-2 flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                        <div className="flex items-center gap-2">
                            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-100 text-emerald-600 text-xs font-semibold">
                                {context.currentClient.name[0]}
                            </span>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{context.currentClient.name}</p>
                                <p className="text-xs text-gray-400">{context.currentClient.status}</p>
                            </div>
                        </div>
                        <ChevronRight size={14} className="text-gray-300" />
                    </div>
                </div>
            )}

            {context.documents?.length > 0 && (
                <div>
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            {context.documents.length === 1 ? "Document" : "Uploaded Documents"}
                        </p>
                        {context.documents.length > 1 && (
                            <button type="button" onClick={onViewAllDocuments} className="text-xs font-medium text-violet-600 hover:text-violet-700">
                                View all
                            </button>
                        )}
                    </div>
                    <ul className="mt-2 space-y-2">
                        {context.documents.map((doc) => (
                            <li key={doc.id} className="flex items-center gap-2 text-sm">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-500">
                                    <FileText size={13} />
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate font-medium text-gray-900">{doc.name}</p>
                                    <p className="text-xs text-gray-400">{doc.size} · {doc.type}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {context.activity?.length > 0 && (
                <div>
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Recent Activity</p>
                        <button type="button" onClick={onViewAllActivity} className="text-xs font-medium text-violet-600 hover:text-violet-700">
                            View all
                        </button>
                    </div>
                    <ul className="mt-2 space-y-2 text-sm">
                        {context.activity.map((item) => (
                            <li key={item.id} className="flex items-center justify-between">
                                <span className="text-gray-700">{item.label}</span>
                                <span className="text-xs text-gray-400">{item.time}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {context.suggestions?.length > 0 && (
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">AI Suggestions</p>
                    <ul className="mt-2 space-y-1">
                        {context.suggestions.map((s) => (
                            <li key={s.id}>
                                <button
                                    type="button"
                                    onClick={() => onSuggestionClick?.(s)}
                                    className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left hover:bg-gray-50"
                                >
                                    <div>
                                        <p className="text-sm text-gray-700">{s.label}</p>
                                        {s.description && <p className="text-xs text-gray-400">{s.description}</p>}
                                    </div>
                                    <ChevronRight size={13} className="shrink-0 text-gray-300" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {context.quickActions?.length > 0 && (
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Quick Actions</p>
                    <ul className="mt-2 space-y-1">
                        {context.quickActions.map((qa) => (
                            <li key={qa.id}>
                                <button
                                    type="button"
                                    onClick={() => onQuickActionClick?.(qa)}
                                    className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    {qa.label}
                                    <ChevronRight size={13} className="text-gray-300" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
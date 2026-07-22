import { FileSignature, FileText, Receipt, FileStack, Eye, Download, Trash2 } from "lucide-react";

/*
|--------------------------------------------------------------------------
| DocumentTable
|--------------------------------------------------------------------------
|
| Presentational table listing generated documents. Same "dumb component"
| pattern as ClientCard/ProjectCard — no service calls here, just props
| in, callbacks out. Documents.jsx owns the data fetching and mutations.
|
| Props:
|   documents  — array of {
|                  id, title, type, projectName, fileUrl,
|                  createdAt, status
|                }
|                type:   "contract" | "proposal" | "invoice" | other
|                status: "generating" | "ready" | "failed"
|   onPreview  — called with the document when the eye icon is clicked
|   onDelete   — called with the document when the trash icon is clicked
|
| Note on download: unlike preview/delete, download doesn't need a
| callback — it's a plain <a href={fileUrl} download> pointing straight
| at the S3 URL your backend already generated. No extra request needed.
|
*/

const TYPE_CONFIG = {
    contract: { icon: FileSignature, color: "text-blue-600 bg-blue-50" },
    proposal: { icon: FileText, color: "text-purple-600 bg-purple-50" },
    invoice: { icon: Receipt, color: "text-amber-600 bg-amber-50" },
};

const STATUS_STYLES = {
    generating: "bg-amber-100 text-amber-700",
    ready: "bg-emerald-100 text-emerald-700",
    failed: "bg-red-100 text-red-700",
};

const STATUS_LABELS = {
    generating: "Generating...",
    ready: "Ready",
    failed: "Failed",
};

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function DocumentTable({ documents, onPreview, onDelete }) {
    if (documents.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
                <FileStack size={32} className="mx-auto text-slate-300" />
                <p className="mt-3 text-sm text-slate-500">
                    No documents yet. Generate one from a project to see it here.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                    <tr className="text-xs text-slate-500">
                        <th className="px-5 py-3 font-medium">Document</th>
                        <th className="px-5 py-3 font-medium">Project</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium">Created</th>
                        <th className="px-5 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((doc) => {
                        const config = TYPE_CONFIG[doc.type] ?? {
                            icon: FileStack,
                            color: "text-slate-600 bg-slate-100",
                        };
                        const Icon = config.icon;
                        const isReady = doc.status === "ready";

                        return (
                            <tr key={doc.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={["rounded-lg p-2", config.color].join(" ")}>
                                            <Icon size={16} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900">{doc.title}</p>
                                            <p className="text-xs capitalize text-slate-400">{doc.type}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-slate-500">{doc.projectName}</td>
                                <td className="px-5 py-4">
                                    <span
                                        className={[
                                            "rounded-full px-2.5 py-1 text-xs font-medium",
                                            STATUS_STYLES[doc.status],
                                        ].join(" ")}
                                    >
                                        {STATUS_LABELS[doc.status]}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-slate-500">{formatDate(doc.createdAt)}</td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            type="button"
                                            aria-label={`Preview ${doc.title}`}
                                            onClick={() => onPreview(doc)}
                                            disabled={!isReady}
                                            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            <Eye size={16} />
                                        </button>

                                        {isReady ? (
                                            <a
                                                href={doc.fileUrl}
                                                download
                                                aria-label={`Download ${doc.title}`}
                                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600"
                                            >
                                                <Download size={16} />
                                            </a>
                                        ) : (
                                            <span className="rounded-lg p-1.5 text-slate-200">
                                                <Download size={16} />
                                            </span>
                                        )}

                                        <button
                                            type="button"
                                            aria-label={`Delete ${doc.title}`}
                                            onClick={() => onDelete(doc)}
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
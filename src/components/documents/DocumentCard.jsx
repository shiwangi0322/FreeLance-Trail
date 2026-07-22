// src/components/documents/DocumentCard.jsx
import { MoreVertical, Download } from "lucide-react";
import { getFileTypeConfig, getExtension } from "../../constants/documentTypes";

function formatSize(mb) {
    return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(1)} MB`;
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Purely presentational — Documents.jsx owns fetching/deleting/renaming and
 * passes callbacks down, same pattern as ClientCard/ProjectCard, so this
 * stays reusable (e.g. inside a project's own "attached files" tab) later.
 */
export default function DocumentCard({ document, onOpen, onOpenMenu, onDownload }) {
    const config = getFileTypeConfig(getExtension(document.name));
    const Icon = config.icon;

    return (
        <div className="group relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-start justify-between">
                <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: config.bg, color: config.color }}
                >
                    <Icon size={20} />
                </span>

                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                        type="button"
                        onClick={() => onDownload?.(document)}
                        className="rounded p-1 text-gray-300 hover:bg-gray-50 hover:text-gray-500"
                        aria-label={`Download ${document.name}`}
                    >
                        <Download size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={() => onOpenMenu?.(document)}
                        className="rounded p-1 text-gray-300 hover:bg-gray-50 hover:text-gray-500"
                        aria-label={`More options for ${document.name}`}
                    >
                        <MoreVertical size={15} />
                    </button>
                </div>
            </div>

            <button type="button" onClick={() => onOpen?.(document)} className="mt-3 block text-left">
                <p className="truncate text-sm font-medium text-gray-900 hover:text-violet-600">{document.name}</p>
            </button>
            <p className="mt-0.5 text-xs text-gray-400">
                {formatSize(document.sizeMB)} · {formatDate(document.uploadedAt)}
            </p>

            {(document.project || document.client) && (
                <span className="mt-3 inline-block rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    {document.project ?? document.client}
                </span>
            )}
        </div>
    );
}
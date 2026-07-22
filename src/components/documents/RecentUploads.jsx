// src/components/documents/RecentUploads.jsx
import { getFileTypeConfig, getExtension } from "../../constants/documentTypes";

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", { day: "2-digit", month: "short" });
}

export default function RecentUploads({ documents = [], limit = 5, onOpen }) {
    const recent = [...documents]
        .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
        .slice(0, limit);

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Recent Uploads</h3>

            {recent.length === 0 ? (
                <p className="mt-3 text-sm text-gray-400">No documents uploaded yet.</p>
            ) : (
                <ul className="mt-3 space-y-2.5">
                    {recent.map((doc) => {
                        const config = getFileTypeConfig(getExtension(doc.name));
                        const Icon = config.icon;
                        return (
                            <li key={doc.id}>
                                <button
                                    type="button"
                                    onClick={() => onOpen?.(doc)}
                                    className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1 text-left hover:bg-gray-50"
                                >
                                    <span
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                                        style={{ backgroundColor: config.bg, color: config.color }}
                                    >
                                        <Icon size={15} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-gray-900">{doc.name}</p>
                                        <p className="text-xs text-gray-400">{doc.client ?? doc.project ?? "—"}</p>
                                    </div>
                                    <span className="shrink-0 text-xs text-gray-400">{formatDate(doc.uploadedAt)}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
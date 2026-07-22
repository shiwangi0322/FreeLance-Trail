// src/pages/Documents.jsx
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Upload, LayoutGrid, List } from "lucide-react";

import DocumentCard from "../components/documents/DocumentCard";
import StorageOverview from "../components/documents/StorageOverview";
import RecentUploads from "../components/documents/RecentUploads";
import { DOCUMENT_FOLDERS } from "../constants/documentTypes";

// Swap for documentService.getAll() once wired to your API — kept static
// here so the page renders standalone. See mockDocuments.example.js.
import { mockDocuments } from "../data/mockDocuments.example";

export default function Documents() {
    const [documents, setDocuments] = useState(mockDocuments);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFolder, setActiveFolder] = useState("all");
    const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

    const folderCounts = {
        all: documents.length,
        proposals: documents.filter((d) => d.folder === "proposals").length,
        contracts: documents.filter((d) => d.folder === "contracts").length,
        invoices: documents.filter((d) => d.folder === "invoices").length,
        design: documents.filter((d) => d.folder === "design").length,
        other: documents.filter((d) => d.folder === "other").length,
    };

    const filteredDocuments = useMemo(() => {
        let result = documents;
        if (activeFolder !== "all") result = result.filter((d) => d.folder === activeFolder);
        if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            result = result.filter(
                (d) =>
                    d.name.toLowerCase().includes(q) ||
                    d.client?.toLowerCase().includes(q) ||
                    d.project?.toLowerCase().includes(q)
            );
        }
        return [...result].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    }, [documents, activeFolder, searchTerm]);

    function handleUploadClick() {
        // Swap for a real file input + documentService.upload(file) once wired up.
        alert("Hook this up to a file input + documentService.upload(file)");
    }

    function handleOpen(doc) {
        // Swap for opening a preview modal / new tab to the file's real URL.
        alert(`Open ${doc.name}`);
    }

    function handleDownload(doc) {
        // Swap for documentService.download(doc.id) once wired up.
        alert(`Download ${doc.name}`);
    }

    function handleOpenMenu(doc) {
        // Swap for a real dropdown (rename/move/delete).
        if (confirm(`Delete "${doc.name}"?`)) {
            setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
        }
    }

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-wrap justify-end gap-2">
                <div className="relative">
                    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search documents..."
                        className="rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                    />
                </div>

                <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    <SlidersHorizontal size={16} />
                    Filter
                </button>

                <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
                    <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        className={`p-2 ${viewMode === "grid" ? "bg-violet-50 text-violet-600" : "text-gray-400 hover:bg-gray-50"}`}
                        aria-label="Grid view"
                    >
                        <LayoutGrid size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        className={`p-2 ${viewMode === "list" ? "bg-violet-50 text-violet-600" : "text-gray-400 hover:bg-gray-50"}`}
                        aria-label="List view"
                    >
                        <List size={16} />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={handleUploadClick}
                    className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"
                >
                    <Upload size={16} />
                    Upload
                </button>
            </div>

            {/* Folder tabs */}
            <div className="flex flex-wrap gap-2">
                {DOCUMENT_FOLDERS.map((folder) => (
                    <button
                        key={folder.key}
                        type="button"
                        onClick={() => setActiveFolder(folder.key)}
                        className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${activeFolder === folder.key ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {folder.label} ({folderCounts[folder.key]})
                    </button>
                ))}
            </div>

            {/* Main grid: documents (left, wide) + sidebar (right) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                <div className="lg:col-span-3">
                    {filteredDocuments.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
                            <p className="text-sm text-gray-400">No documents found. Try a different search or folder.</p>
                        </div>
                    ) : viewMode === "grid" ? (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {filteredDocuments.map((doc) => (
                                <DocumentCard
                                    key={doc.id}
                                    document={doc}
                                    onOpen={handleOpen}
                                    onOpenMenu={handleOpenMenu}
                                    onDownload={handleDownload}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50 rounded-2xl border border-gray-100 bg-white shadow-sm">
                            {filteredDocuments.map((doc) => (
                                <button
                                    key={doc.id}
                                    type="button"
                                    onClick={() => handleOpen(doc)}
                                    className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                                >
                                    <span className="truncate text-sm font-medium text-gray-900">{doc.name}</span>
                                    <span className="shrink-0 text-xs text-gray-400">
                                        {doc.sizeMB >= 1024 ? `${(doc.sizeMB / 1024).toFixed(1)} GB` : `${doc.sizeMB.toFixed(1)} MB`}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-6 lg:col-span-1">
                    <StorageOverview documents={documents} />
                    <RecentUploads documents={documents} onOpen={handleOpen} />
                </div>
            </div>
        </div>
    );
}
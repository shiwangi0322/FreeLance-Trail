// src/constants/documentTypes.js
import { FileText, FileSpreadsheet, FileImage, FileArchive, File } from "lucide-react";

// Single source of truth for how each file type looks — used by
// DocumentCard and DocumentUploadModal so adding a new type (e.g. "pptx")
// later is a one-line addition here instead of scattered conditionals.
export const FILE_TYPE_CONFIG = {
    pdf: { icon: FileText, bg: "#FEE2E2", color: "#DC2626", label: "PDF" },
    doc: { icon: FileText, bg: "#DBEAFE", color: "#2563EB", label: "DOC" },
    docx: { icon: FileText, bg: "#DBEAFE", color: "#2563EB", label: "DOCX" },
    xls: { icon: FileSpreadsheet, bg: "#D1FAE5", color: "#059669", label: "XLS" },
    xlsx: { icon: FileSpreadsheet, bg: "#D1FAE5", color: "#059669", label: "XLSX" },
    zip: { icon: FileArchive, bg: "#FEF3C7", color: "#D97706", label: "ZIP" },
    png: { icon: FileImage, bg: "#EDE9FE", color: "#7C3AED", label: "PNG" },
    jpg: { icon: FileImage, bg: "#EDE9FE", color: "#7C3AED", label: "JPG" },
    jpeg: { icon: FileImage, bg: "#EDE9FE", color: "#7C3AED", label: "JPEG" },
};

export const DEFAULT_FILE_TYPE = { icon: File, bg: "#F3F4F6", color: "#6B7280", label: "FILE" };

export function getFileTypeConfig(extension) {
    return FILE_TYPE_CONFIG[extension?.toLowerCase()] ?? DEFAULT_FILE_TYPE;
}

export function getExtension(fileName) {
    return fileName.split(".").pop();
}

// Folders/categories shown as filter tabs — mirrors how your other pages
// (Clients, Invoices) use a fixed tab list rather than fetching categories.
export const DOCUMENT_FOLDERS = [
    { key: "all", label: "All Documents" },
    { key: "proposals", label: "Proposals" },
    { key: "contracts", label: "Contracts" },
    { key: "invoices", label: "Invoices" },
    { key: "design", label: "Design Files" },
    { key: "other", label: "Other" },
];
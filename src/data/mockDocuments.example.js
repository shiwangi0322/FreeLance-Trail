// src/data/mockDocuments.example.js
// Reference only — merge these fields into your existing documentService.js
// mock data. Each document needs: name (with extension), sizeMB, folder
// (matches DOCUMENT_FOLDERS keys), uploadedAt (ISO string), and optionally
// project/client for the tag shown on the card.

export const mockDocuments = [
    { id: 1, name: "Project Brief.pdf", sizeMB: 2.4, folder: "proposals", uploadedAt: "2026-07-08", client: "Creative Minds Co." },
    { id: 2, name: "Wireframes.zip", sizeMB: 18.7, folder: "design", uploadedAt: "2026-07-07", project: "Website Redesign" },
    { id: 3, name: "Brand Guidelines.pdf", sizeMB: 3.1, folder: "design", uploadedAt: "2026-07-05", client: "Creative Minds Co." },
    { id: 4, name: "Service Agreement.docx", sizeMB: 0.8, folder: "contracts", uploadedAt: "2026-07-04", client: "BrightWave Solutions" },
    { id: 5, name: "INV-2025-00148.pdf", sizeMB: 0.3, folder: "invoices", uploadedAt: "2026-07-03", client: "BrightWave Solutions" },
    { id: 6, name: "Q4 Financial Report 2024.pdf", sizeMB: 2.4, folder: "other", uploadedAt: "2026-07-01", client: "TechNova Inc." },
    { id: 7, name: "Design System.pdf", sizeMB: 3.2, folder: "design", uploadedAt: "2026-06-29", project: "SaaS Dashboard" },
    { id: 8, name: "Proposal - Mobile App.docx", sizeMB: 1.1, folder: "proposals", uploadedAt: "2026-06-27", client: "NextGen Labs" },
    { id: 9, name: "NDA Template.docx", sizeMB: 0.2, folder: "contracts", uploadedAt: "2026-06-24", client: "Elite Partners" },
    { id: 10, name: "Logo Assets.zip", sizeMB: 24.5, folder: "design", uploadedAt: "2026-06-20", client: "Marketify Digital" },
];
import { Sparkles, Download } from "lucide-react";

import Modal from "../common/Modal";
import Button from "../common/Button";

/*
|--------------------------------------------------------------------------
| ProposalPreview
|--------------------------------------------------------------------------
|
| Modal showing a generated proposal's full text content. Unlike
| DocumentPreview (which shows a PDF via iframe, since documents are
| already-rendered files), proposals are shown as formatted TEXT here —
| because the whole point of this module is that the content is still
| editable/optimizable, not a finished PDF yet. A proposal only becomes
| a PDF document (via PDFKit, landing in the Documents module) once the
| freelancer is happy with it and exports it.
|
| Props:
|   isOpen, onClose — same as Modal
|   proposal — { id, title, projectName, tone, content, createdAt } or null
|   onOptimize — called when "Optimize with AI" is clicked, opens
|                ProposalOptimizerModal from the parent page
|
| content is expected to be plain text with paragraph breaks (\n\n) —
| rendered via whitespace-pre-wrap rather than dangerouslySetInnerHTML,
| since AI output should never be trusted as safe HTML without
| sanitization, and plain text avoids that risk entirely.
|
*/

export default function ProposalPreview({ isOpen, onClose, proposal, onOptimize }) {
    if (!proposal) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={proposal.title} size="lg">
            <div className="flex flex-col gap-4">
                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                    <span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Project:</span>{" "}
                        {proposal.projectName}
                    </span>
                    <span className="capitalize">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Tone:</span>{" "}
                        {proposal.tone}
                    </span>
                    <span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Created:</span>{" "}
                        {new Date(proposal.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                </div>

                {/* Proposal content — plain text, never raw HTML from the AI */}
                <div className="max-h-[50vh] overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                        {proposal.content}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onOptimize}>
                        <Sparkles size={16} />
                        Optimize with AI
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            const blob = new Blob([proposal.content], { type: "text/plain" });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement("a");
                            link.href = url;
                            link.download = `${proposal.title}.txt`;
                            link.click();
                            URL.revokeObjectURL(url);
                        }}
                    >
                        <Download size={16} />
                        Download
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
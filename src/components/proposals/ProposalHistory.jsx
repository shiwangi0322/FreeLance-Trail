import { FileText, Trash2 } from "lucide-react";

/*
|--------------------------------------------------------------------------
| ProposalHistory
|--------------------------------------------------------------------------
|
| List of previously generated proposals, shown alongside the generator
| form on ProposalGenerator.jsx (page). Clicking a row opens
| ProposalPreview; the trash icon deletes it via proposalService.delete().
|
| Presentational only — no service calls here, same pattern as every
| other *Table/*List component in this app.
|
| Props:
|   proposals — array of { id, title, projectName, createdAt }
|   onSelect  — called with the proposal when a row is clicked (opens preview)
|   onDelete  — called with the proposal when the trash icon is clicked
|
*/

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
    });
}

export default function ProposalHistory({ proposals, onSelect, onDelete }) {
    if (proposals.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center dark:border-slate-700 dark:bg-slate-900">
                <FileText size={28} className="mx-auto text-slate-300 dark:text-slate-600" />
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    No proposals yet. Generate your first one.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
            {proposals.map((proposal) => (
                <div
                    key={proposal.id}
                    className="group flex cursor-pointer items-center justify-between gap-3 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    onClick={() => onSelect(proposal)}
                >
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="shrink-0 rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400">
                            <FileText size={16} />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                                {proposal.title}
                            </p>
                            <p className="truncate text-xs text-slate-400">
                                {proposal.projectName} · {formatDate(proposal.createdAt)}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        aria-label={`Delete ${proposal.title}`}
                        onClick={(e) => {
                            e.stopPropagation(); // don't trigger onSelect underneath
                            onDelete(proposal);
                        }}
                        className="shrink-0 rounded-lg p-1.5 text-slate-300 opacity-0 transition-colors hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:text-slate-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            ))}
        </div>
    );
}
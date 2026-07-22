import { useState } from "react";
import { Sparkles, Check, RotateCcw } from "lucide-react";

import Modal from "../common/Modal";
import Button from "../common/Button";

/*
|--------------------------------------------------------------------------
| ProposalOptimizerModal
|--------------------------------------------------------------------------
|
| Lets the user send a plain-English revision instruction to
| proposalService.optimize() and see the result before committing to it.
|
| State ownership: this component is intentionally NOT the one calling
| proposalService — ProposalGenerator.jsx (the page) owns the mutation,
| passes down `optimizedContent` (null until a result comes back) and
| `isOptimizing`, and receives `onSubmit(instruction)` calls. This keeps
| the same "dumb component, smart page" split used everywhere else, and
| means the page controls what happens to React Query's proposal cache
| when the user applies or discards a result.
|
| Flow:
|   1. User types an instruction (or clicks a preset chip) and submits
|   2. isOptimizing shows a loading state
|   3. optimizedContent appears — shown alongside the original for
|      comparison
|   4. User clicks "Apply" (parent replaces the proposal's content and
|      closes) or "Try Again" (parent clears optimizedContent so the
|      user can submit a different instruction without losing the
|      original)
|
| Props:
|   isOpen, onClose
|   originalContent  — the current proposal text, always shown
|   optimizedContent — the AI's revised text, or null if not requested yet
|   isOptimizing     — true while the optimize() call is in flight
|   onSubmit         — called with the instruction string
|   onApply          — called when the user accepts optimizedContent
|   onDiscard        — called when the user wants to try a different instruction
|
*/

const PRESET_INSTRUCTIONS = [
    "Make it more concise",
    "Make it more formal",
    "Emphasize the timeline",
    "Add more detail on pricing",
];

export default function ProposalOptimizerModal({
    isOpen,
    onClose,
    originalContent,
    optimizedContent,
    isOptimizing = false,
    onSubmit,
    onApply,
    onDiscard,
}) {
    const [instruction, setInstruction] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (!instruction.trim()) return;
        onSubmit(instruction.trim());
    }

    function handlePresetClick(preset) {
        setInstruction(preset);
        onSubmit(preset);
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Optimize with AI" size="lg">
            <div className="flex flex-col gap-4">
                {/* Instruction input — hidden once a result is showing, so the
            user focuses on reviewing rather than typing a new one by
            accident while a result is on screen. */}
                {!optimizedContent && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                        <div className="flex flex-wrap gap-2">
                            {PRESET_INSTRUCTIONS.map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => handlePresetClick(preset)}
                                    disabled={isOptimizing}
                                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-purple-500/10"
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={instruction}
                                onChange={(e) => setInstruction(e.target.value)}
                                placeholder="Or describe your own revision..."
                                disabled={isOptimizing}
                                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                            />
                            <Button type="submit" isLoading={isOptimizing} disabled={!instruction.trim()}>
                                <Sparkles size={16} />
                                Optimize
                            </Button>
                        </div>
                    </form>
                )}

                {/* Result comparison */}
                {optimizedContent && (
                    <>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Original
                                </p>
                                <div className="h-64 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                                    <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                                        {originalContent}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-purple-500">
                                    Optimized
                                </p>
                                <div className="h-64 overflow-y-auto rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-500/30 dark:bg-purple-500/10">
                                    <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                                        {optimizedContent}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={onDiscard}>
                                <RotateCcw size={16} />
                                Try a different instruction
                            </Button>
                            <Button type="button" onClick={onApply}>
                                <Check size={16} />
                                Apply this version
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}
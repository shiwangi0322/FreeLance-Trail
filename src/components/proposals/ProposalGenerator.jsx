import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";

import proposalService from "../services/proposalService";
import projectService from "../services/projectService";
import ProposalHistory from "../components/proposals/ProposalHistory";
import ProposalPreview from "../components/proposals/ProposalPreview";
import ProposalOptimizerModal from "../components/proposals/ProposalOptimizerModal";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import { showToast } from "../components/common/Toast";

/*
|--------------------------------------------------------------------------
| ProposalGenerator
|--------------------------------------------------------------------------
|
| Two-column layout: generation form + result on the left, history list
| on the right (collapses to stacked on mobile via the grid below).
|
| Three mutations:
|   generateMutation — form submit -> proposalService.generate() ->
|                       opens ProposalPreview with the new draft
|   optimizeMutation — from inside the optimizer modal -> stores the
|                       result in optimizedContent, does NOT touch the
|                       proposal shown in preview until "Apply" is clicked
|   deleteMutation   — from ProposalHistory's trash icon
|
| Note on "Apply" in the optimizer: proposalService.optimize() is a POST
| with a side effect on the backend (it should persist the revision),
| so applying is just: update what THIS page shows locally + invalidate
| the ["proposals"] query so the list reflects the change too. There's
| no separate proposalService.update() call needed here.
|
*/

const generateSchema = z.object({
    projectId: z.string().min(1, "Please select a project"),
    tone: z.enum(["formal", "friendly", "confident"]),
    keyPoints: z.string().optional(),
});

export default function ProposalGenerator() {
    const queryClient = useQueryClient();

    const [previewProposal, setPreviewProposal] = useState(null);
    const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);
    const [optimizedContent, setOptimizedContent] = useState(null);

    /* ------------------------------------------------------------------ */
    /* Data                                                                  */
    /* ------------------------------------------------------------------ */
    const { data: projects = [] } = useQuery({
        queryKey: ["projects"],
        queryFn: projectService.getAll,
    });

    const { data: proposals = [], isLoading } = useQuery({
        queryKey: ["proposals"],
        queryFn: proposalService.getAll,
    });

    /* ------------------------------------------------------------------ */
    /* Generate form                                                        */
    /* ------------------------------------------------------------------ */
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(generateSchema),
        defaultValues: { projectId: "", tone: "confident", keyPoints: "" },
    });

    const generateMutation = useMutation({
        mutationFn: (data) => proposalService.generate(data),
        onSuccess: (newProposal) => {
            queryClient.invalidateQueries({ queryKey: ["proposals"] });
            showToast.success("Proposal generated");
            setPreviewProposal(newProposal);
            reset();
        },
        onError: (err) => {
            showToast.error(
                err.response?.data?.message ?? "Could not generate proposal"
            );
        },
    });

    /* ------------------------------------------------------------------ */
    /* Delete                                                               */
    /* ------------------------------------------------------------------ */
    const deleteMutation = useMutation({
        mutationFn: (id) => proposalService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["proposals"] });
            showToast.success("Proposal deleted");
        },
        onError: (err) => {
            showToast.error(err.response?.data?.message ?? "Could not delete proposal");
        },
    });

    function handleDelete(proposal) {
        if (window.confirm(`Delete "${proposal.title}"? This cannot be undone.`)) {
            deleteMutation.mutate(proposal.id);
            if (previewProposal?.id === proposal.id) setPreviewProposal(null);
        }
    }

    /* ------------------------------------------------------------------ */
    /* Optimize                                                             */
    /* ------------------------------------------------------------------ */
    const optimizeMutation = useMutation({
        mutationFn: ({ id, instruction }) => proposalService.optimize(id, instruction),
        onSuccess: (result) => {
            // result is expected to be { content: "..." } — the revised text
            setOptimizedContent(result.content);
        },
        onError: (err) => {
            showToast.error(err.response?.data?.message ?? "Could not optimize proposal");
        },
    });

    function handleOptimizeSubmit(instruction) {
        optimizeMutation.mutate({ id: previewProposal.id, instruction });
    }

    function handleApplyOptimization() {
        // Update what preview shows locally, refetch history so it's
        // consistent everywhere, then close the optimizer and reset its state.
        setPreviewProposal((prev) => ({ ...prev, content: optimizedContent }));
        queryClient.invalidateQueries({ queryKey: ["proposals"] });
        showToast.success("Optimized version applied");
        setOptimizedContent(null);
        setIsOptimizerOpen(false);
    }

    function handleDiscardOptimization() {
        setOptimizedContent(null);
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
                    AI Proposal Generator
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Draft a proposal in seconds, then refine it with AI.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Generator form */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
                    <form
                        onSubmit={handleSubmit((data) => generateMutation.mutate(data))}
                        className="flex flex-col gap-4"
                    >
                        <div className="space-y-1.5">
                            <label htmlFor="projectId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Project<span className="ml-1 text-red-500">*</span>
                            </label>
                            <select
                                id="projectId"
                                {...register("projectId")}
                                className={[
                                    "w-full rounded-lg border px-3 py-2 text-sm transition-all duration-200",
                                    "focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-slate-100",
                                    errors.projectId
                                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                        : "border-slate-300 focus:border-purple-500 focus:ring-purple-500 dark:border-slate-700",
                                ].join(" ")}
                            >
                                <option value="">Select a project...</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                            {errors.projectId && (
                                <p className="text-sm text-red-600">{errors.projectId.message}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Tone
                            </label>
                            <div className="flex gap-2">
                                {["formal", "friendly", "confident"].map((tone) => (
                                    <label key={tone} className="flex-1">
                                        <input
                                            type="radio"
                                            value={tone}
                                            {...register("tone")}
                                            className="peer sr-only"
                                        />
                                        <div className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-medium capitalize text-slate-600 transition-colors peer-checked:border-purple-500 peer-checked:bg-purple-50 peer-checked:text-purple-700 dark:border-slate-700 dark:text-slate-300 dark:peer-checked:bg-purple-500/10 dark:peer-checked:text-purple-400">
                                            {tone}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="keyPoints" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Key points to emphasize (optional)
                            </label>
                            <textarea
                                id="keyPoints"
                                rows={4}
                                {...register("keyPoints")}
                                placeholder="E.g. our React Native experience, a 4-week timeline, fixed pricing..."
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all duration-200 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                            />
                        </div>

                        <Button type="submit" isLoading={generateMutation.isPending} className="self-start">
                            <Sparkles size={16} />
                            Generate Proposal
                        </Button>
                    </form>
                </div>

                {/* History */}
                <div className="flex flex-col gap-3">
                    <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Proposal History
                    </h2>
                    {isLoading ? (
                        <Spinner label="Loading proposals..." />
                    ) : (
                        <ProposalHistory
                            proposals={proposals}
                            onSelect={(proposal) => setPreviewProposal(proposal)}
                            onDelete={handleDelete}
                        />
                    )}
                </div>
            </div>

            {/* Preview modal */}
            <ProposalPreview
                isOpen={Boolean(previewProposal) && !isOptimizerOpen}
                onClose={() => setPreviewProposal(null)}
                proposal={previewProposal}
                onOptimize={() => setIsOptimizerOpen(true)}
            />

            {/* Optimizer modal */}
            <ProposalOptimizerModal
                isOpen={isOptimizerOpen}
                onClose={() => {
                    setIsOptimizerOpen(false);
                    setOptimizedContent(null);
                }}
                originalContent={previewProposal?.content}
                optimizedContent={optimizedContent}
                isOptimizing={optimizeMutation.isPending}
                onSubmit={handleOptimizeSubmit}
                onApply={handleApplyOptimization}
                onDiscard={handleDiscardOptimization}
            />
        </div>
    );
}
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";

/*
|--------------------------------------------------------------------------
| ProjectModal
|--------------------------------------------------------------------------
|
| Logic unchanged from before. Restyled: <select> elements now match
| Input's blue-focus-ring look, Cancel button uses the new "outline"
| variant instead of "secondary".
|
*/

const projectSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    clientId: z.string().min(1, "Please select a client"),
    status: z.enum(["pending", "in_progress", "completed"]),
    budget: z.coerce
        .number({ invalid_type_error: "Budget must be a number" })
        .positive("Budget must be greater than 0"),
    deadline: z.string().optional(),
    description: z.string().optional(),
});

export default function ProjectModal({
    isOpen,
    onClose,
    onSubmit,
    project,
    clients = [],
    isSaving = false,
}) {
    const isEditMode = Boolean(project);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: "",
            clientId: "",
            status: "pending",
            budget: "",
            deadline: "",
            description: "",
        },
    });

    useEffect(() => {
        if (isOpen) {
            reset(
                project
                    ? {
                        name: project.name ?? "",
                        clientId: project.clientId ?? "",
                        status: project.status ?? "pending",
                        budget: project.budget ?? "",
                        deadline: project.deadline ?? "",
                        description: project.description ?? "",
                    }
                    : {
                        name: "",
                        clientId: "",
                        status: "pending",
                        budget: "",
                        deadline: "",
                        description: "",
                    }
            );
        }
    }, [isOpen, project, reset]);

    function handleFormSubmit(data) {
        onSubmit(data);
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? "Edit Project" : "Add Project"}
        >
            <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="flex flex-col gap-4"
            >
                <Input
                    label="Project name"
                    required
                    placeholder="E-commerce Redesign"
                    {...register("name")}
                    error={errors.name?.message}
                />

                <div className="space-y-1.5">
                    <label htmlFor="clientId" className="block text-sm font-medium text-slate-700">
                        Client<span className="ml-1 text-red-500">*</span>
                    </label>
                    <select
                        id="clientId"
                        {...register("clientId")}
                        className={[
                            "w-full rounded-lg border px-3 py-2 text-sm transition-all duration-200",
                            "focus:outline-none focus:ring-2 focus:ring-offset-0",
                            errors.clientId
                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                : "border-slate-300 focus:border-blue-500 focus:ring-blue-500",
                        ].join(" ")}
                    >
                        <option value="">Select a client...</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                    {errors.clientId && (
                        <p className="text-sm text-red-600">{errors.clientId.message}</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="status" className="block text-sm font-medium text-slate-700">
                        Status
                    </label>
                    <select
                        id="status"
                        {...register("status")}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <Input
                    label="Budget (₹)"
                    required
                    type="number"
                    placeholder="45000"
                    {...register("budget")}
                    error={errors.budget?.message}
                />

                <Input
                    label="Deadline"
                    type="date"
                    {...register("deadline")}
                    error={errors.deadline?.message}
                />

                <div className="mt-2 flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isSaving}>
                        {isEditMode ? "Save Changes" : "Add Project"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
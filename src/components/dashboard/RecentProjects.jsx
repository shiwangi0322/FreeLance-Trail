import { Link } from "react-router-dom";

/*
|--------------------------------------------------------------------------
| RecentProjects
|--------------------------------------------------------------------------
|
| Same props/behavior as before — restyled: rounded-xl (was rounded-lg)
| to match StatCard/RevenueChart, and the "View all" link is now blue
| instead of slate, matching the app's accent color.
|
*/

const STATUS_STYLES = {
    pending: "bg-slate-100 text-slate-600",
    in_progress: "bg-amber-100 text-amber-700",
    completed: "bg-emerald-100 text-emerald-700",
};

const STATUS_LABELS = {
    pending: "Pending",
    in_progress: "In Progress",
    completed: "Completed",
};

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

export default function RecentProjects({ projects }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Recent Projects</h2>
                <Link
                    to="/projects"
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                    View all
                </Link>
            </div>

            {projects.length === 0 ? (
                <p className="mt-6 text-center text-sm text-slate-400">
                    No projects yet. Create your first one to see it here.
                </p>
            ) : (
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs text-slate-400">
                                <th className="pb-2 font-medium">Project</th>
                                <th className="pb-2 font-medium">Client</th>
                                <th className="pb-2 font-medium">Status</th>
                                <th className="pb-2 text-right font-medium">Budget</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id} className="border-b border-slate-50 last:border-0">
                                    <td className="py-3 font-medium text-slate-900">{project.name}</td>
                                    <td className="py-3 text-slate-500">{project.client}</td>
                                    <td className="py-3">
                                        <span
                                            className={[
                                                "rounded-full px-2.5 py-1 text-xs font-medium",
                                                STATUS_STYLES[project.status],
                                            ].join(" ")}
                                        >
                                            {STATUS_LABELS[project.status]}
                                        </span>
                                    </td>
                                    <td className="py-3 text-right text-slate-700">
                                        {formatCurrency(project.budget)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
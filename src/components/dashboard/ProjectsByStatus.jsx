/*
|--------------------------------------------------------------------------
| ProjectsByStatus
|--------------------------------------------------------------------------
|
| Small panel sitting next to RevenueChart, showing how many projects
| are in each pipeline stage. Purely presentational — Dashboard.jsx
| computes the counts (or later, the backend returns them pre-aggregated)
| and passes them in.
|
| Props:
|   statuses — array of { label, count, color }
|              color is a Tailwind bg-* class for the status dot, e.g.
|              "bg-emerald-500" for Active, "bg-amber-500" for Pending
|
*/

export default function ProjectsByStatus({ statuses }) {
    const total = statuses.reduce((sum, s) => sum + s.count, 0);

    return (
        <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Projects by Status
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">Pipeline distribution</p>

            {/* Stacked bar showing relative proportions */}
            <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                {statuses.map((status) => (
                    <div
                        key={status.label}
                        className={status.color}
                        style={{ width: `${total > 0 ? (status.count / total) * 100 : 0}%` }}
                    />
                ))}
            </div>

            {/* List with counts */}
            <div className="mt-5 flex flex-col gap-3">
                {statuses.map((status) => (
                    <div key={status.label} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <span className={["h-2.5 w-2.5 rounded-full", status.color].join(" ")} />
                            <span className="text-slate-600 dark:text-slate-300">{status.label}</span>
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                            {status.count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
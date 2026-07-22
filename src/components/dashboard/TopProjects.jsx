import { Link } from "react-router-dom";

/*
|--------------------------------------------------------------------------
| TopProjects
|--------------------------------------------------------------------------
|
| Replaces ActiveProjectsList.jsx — restyled to match the reference: a
| colored square icon per project, status badge on the right, "View All"
| link in the header.
|
| Props:
|   projects — array of {
|     id, name, clientName, progress, status,
|     icon: LucideIconComponent, iconBg, iconText
|   }
|   status: "Active" | "On Hold" | "Done" | "Pending"
|
*/

const STATUS_STYLES = {
    Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    "On Hold": "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    Done: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
    Pending: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export default function TopProjects({ projects }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Top Projects</h2>
                <Link
                    to="/projects"
                    className="text-xs font-medium text-purple-600 hover:text-purple-700 hover:underline dark:text-purple-400"
                >
                    View All
                </Link>
            </div>

            <div className="mt-4 flex flex-col gap-4">
                {projects.map(({ id, name, clientName, progress, status, icon: Icon, iconBg, iconText }) => (
                    <div key={id} className="flex items-center gap-3">
                        <div className={["flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", iconBg].join(" ")}>
                            <Icon size={16} className={iconText} />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                                    {name}
                                </p>
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    {progress}%
                                </span>
                            </div>
                            <p className="truncate text-xs text-slate-400">{clientName}</p>
                            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                <div
                                    className="h-full rounded-full bg-purple-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        <span
                            className={[
                                "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium",
                                STATUS_STYLES[status] ?? STATUS_STYLES.Pending,
                            ].join(" ")}
                        >
                            {status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
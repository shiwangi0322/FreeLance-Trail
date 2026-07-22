import { IndianRupee, Receipt, UserPlus, FolderPlus, FileText } from "lucide-react";

/*
|--------------------------------------------------------------------------
| RecentActivity
|--------------------------------------------------------------------------
|
| Full-width feed at the bottom of the dashboard, showing recent events
| across all modules (payments, invoices, clients, projects, documents)
| in one timeline — this is what makes it feel like a real "activity
| log" rather than duplicating what's already on the Clients/Projects
| pages individually.
|
| Props:
|   activities — array of { id, type, message, timeAgo }
|                type: "payment" | "invoice" | "client" | "project" | "document"
|
| TODO(Phase 7): once Socket.IO exists, new activity items should be
| prepended here in real time (e.g. the moment a document finishes
| generating) rather than only appearing after a page refresh / refetch.
*/

const TYPE_CONFIG = {
    payment: { icon: IndianRupee, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400" },
    invoice: { icon: Receipt, color: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400" },
    client: { icon: UserPlus, color: "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400" },
    project: { icon: FolderPlus, color: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400" },
    document: { icon: FileText, color: "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/15 dark:text-fuchsia-400" },
};

export default function RecentActivity({ activities }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Recent Activity
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">Latest changes across all modules</p>

            {activities.length === 0 ? (
                <p className="mt-6 text-center text-sm text-slate-400">No recent activity yet.</p>
            ) : (
                <div className="mt-4 flex flex-col gap-4">
                    {activities.map((activity) => {
                        const config = TYPE_CONFIG[activity.type] ?? TYPE_CONFIG.project;
                        const Icon = config.icon;

                        return (
                            <div key={activity.id} className="flex items-start gap-3">
                                <div className={["shrink-0 rounded-lg p-2", config.color].join(" ")}>
                                    <Icon size={15} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm text-slate-700 dark:text-slate-200">
                                        {activity.message}
                                    </p>
                                    <p className="text-xs text-slate-400">{activity.timeAgo}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// src/components/projects/ProjectActivityFeed.jsx

// Same palette rotation used elsewhere so avatar colors stay consistent
// across the app rather than being random per-render.
const AVATAR_COLORS = [
    "bg-violet-100 text-violet-700",
    "bg-emerald-100 text-emerald-700",
    "bg-blue-100 text-blue-700",
    "bg-orange-100 text-orange-700",
];

function colorFor(name) {
    const index = name.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
}

/**
 * activities: [{ id, actorInitial, actorName, message, timestamp }]
 * `timestamp` should already be a human string (e.g. "2h ago") — computing
 * relative time is the caller's job (usually via date-fns formatDistanceToNow)
 * since it needs to stay live if the page is left open.
 */
export default function ProjectActivityFeed({ activities = [], onViewAll }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>

            {activities.length === 0 ? (
                <p className="mt-3 text-sm text-gray-400">No recent activity yet.</p>
            ) : (
                <ul className="mt-3 space-y-3">
                    {activities.map((activity) => (
                        <li key={activity.id} className="flex items-start gap-3">
                            <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${colorFor(
                                    activity.actorName
                                )}`}
                            >
                                {activity.actorInitial}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm text-gray-700">{activity.message}</p>
                                <span className="text-xs text-gray-400">{activity.timestamp}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <button
                type="button"
                onClick={onViewAll}
                className="mt-3 text-sm font-medium text-violet-600 hover:text-violet-700"
            >
                View all activity →
            </button>
        </div>
    );
}
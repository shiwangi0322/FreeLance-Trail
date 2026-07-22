/*
|--------------------------------------------------------------------------
| DocumentActivityFeed
|--------------------------------------------------------------------------
|
| Same letter-avatar activity list pattern as ProjectActivityFeed.jsx —
| shows recent document-related events (generated, downloaded, deleted).
|
| Props:
|   activities — array of { id, initial, avatarColor, title, subtitle, timeAgo }
|
*/

export default function DocumentActivityFeed({ activities }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Recent Activity
            </h2>

            <div className="mt-3 flex flex-col gap-3">
                {activities.length === 0 ? (
                    <p className="text-xs text-slate-400">No recent activity.</p>
                ) : (
                    activities.map((a) => (
                        <div key={a.id} className="flex items-start gap-2.5">
                            <div
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                                style={{ backgroundColor: a.avatarColor }}
                            >
                                {a.initial}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm text-slate-700 dark:text-slate-200">
                                    {a.title}
                                </p>
                                <p className="truncate text-xs text-slate-400">{a.subtitle}</p>
                            </div>
                            <span className="shrink-0 text-[10px] text-slate-400">{a.timeAgo}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
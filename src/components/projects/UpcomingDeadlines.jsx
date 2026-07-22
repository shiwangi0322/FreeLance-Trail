// src/components/projects/UpcomingDeadlines.jsx
import { STATUS_STYLES } from "../../constants/projectStatus";

function formatDeadline(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Shows the next N projects by end date, nearest first. Only projects that
 * aren't already completed count as an "upcoming" deadline.
 */
export default function UpcomingDeadlines({ projects = [], limit = 4, onViewAll }) {
    const upcoming = [...projects]
        .filter((p) => p.status !== "completed")
        .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
        .slice(0, limit);

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Upcoming Deadlines</h3>

            {upcoming.length === 0 ? (
                <p className="mt-3 text-sm text-gray-400">No upcoming deadlines.</p>
            ) : (
                <ul className="mt-3 divide-y divide-gray-50">
                    {upcoming.map((project) => (
                        <li key={project.id} className="flex items-center justify-between py-2.5 text-sm">
                            <span className="flex items-center gap-2 text-gray-700">
                                <span className={`h-2 w-2 rounded-full ${STATUS_STYLES[project.status].dot}`} />
                                {project.title}
                            </span>
                            <span className="text-xs text-gray-400">{formatDeadline(project.endDate)}</span>
                        </li>
                    ))}
                </ul>
            )}

            <button
                type="button"
                onClick={onViewAll}
                className="mt-3 text-sm font-medium text-violet-600 hover:text-violet-700"
            >
                View all deadlines →
            </button>
        </div>
    );
}
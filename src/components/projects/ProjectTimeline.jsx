// src/components/projects/ProjectTimeline.jsx
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { STATUS_LABELS, STATUS_STYLES } from "../../constants/projectStatus";

const DAY_MS = 1000 * 60 * 60 * 24;
const DAYS_VISIBLE = 24; // how many day-columns are shown at once
const DAY_WIDTH = 34; // px per day column — drives every bar's position/width

function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function addDays(date, days) {
    return new Date(date.getTime() + days * DAY_MS);
}

function formatRangeLabel(viewStart, viewEnd) {
    const sameMonth = viewStart.getMonth() === viewEnd.getMonth();
    const startLabel = viewStart.toLocaleDateString("en-US", { month: "long" });
    const endLabel = viewEnd.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    return sameMonth ? `${startLabel} ${viewStart.getFullYear()}` : `${startLabel} – ${endLabel}`;
}

/**
 * Renders `projects` as horizontal bars on a day-grid.
 * Each project needs: id, title, client, status, startDate, endDate, Icon (lucide component).
 */
export default function ProjectTimeline({ projects = [], onProjectMenuClick }) {
    // viewStart anchors the visible window; navigation just shifts this date.
    const [viewStart, setViewStart] = useState(() => addDays(startOfDay(new Date()), -5));

    const days = useMemo(
        () => Array.from({ length: DAYS_VISIBLE }, (_, i) => addDays(viewStart, i)),
        [viewStart]
    );
    const viewEnd = days[days.length - 1];
    const today = startOfDay(new Date());

    const goToday = () => setViewStart(addDays(today, -5));
    const goPrev = () => setViewStart((d) => addDays(d, -7));
    const goNext = () => setViewStart((d) => addDays(d, 7));

    // Position/width for a project bar, clamped so bars starting before or
    // ending after the visible window still render (rather than disappearing).
    function getBarStyle(project) {
        const start = startOfDay(project.startDate);
        const end = startOfDay(project.endDate);
        const offsetDays = (start - viewStart) / DAY_MS;
        const durationDays = Math.max(1, (end - start) / DAY_MS);

        const left = Math.max(0, offsetDays) * DAY_WIDTH;
        const visibleDuration = Math.min(offsetDays + durationDays, DAYS_VISIBLE) - Math.max(offsetDays, 0);
        const width = Math.max(visibleDuration, 0) * DAY_WIDTH;

        return { left, width, isOutOfView: offsetDays + durationDays < 0 || offsetDays > DAYS_VISIBLE };
    }

    // Group day columns into month segments so we can print one month label
    // spanning multiple day-columns, like the reference design.
    const monthSegments = useMemo(() => {
        const segments = [];
        days.forEach((day, i) => {
            const label = day.toLocaleDateString("en-US", { month: "short" });
            const last = segments[segments.length - 1];
            if (last && last.label === label) {
                last.span += 1;
            } else {
                segments.push({ label, span: 1, startIndex: i });
            }
        });
        return segments;
    }, [days]);

    const gridWidth = DAYS_VISIBLE * DAY_WIDTH;

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            {/* Header: Today / prev / next + month-year label */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={goPrev}
                        className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50"
                        aria-label="Previous week"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={goToday}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Today
                    </button>
                    <button
                        type="button"
                        onClick={goNext}
                        className="rounded-lg border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50"
                        aria-label="Next week"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
                <span className="text-sm font-medium text-gray-500">
                    {formatRangeLabel(viewStart, viewEnd)}
                </span>
            </div>

            <div className="overflow-x-auto">
                <div style={{ width: gridWidth + 180 }}>
                    {/* Month + day-number header row */}
                    <div className="flex border-b border-gray-100 pb-2" style={{ paddingLeft: 180 }}>
                        {monthSegments.map((seg) => (
                            <div
                                key={seg.startIndex}
                                style={{ width: seg.span * DAY_WIDTH }}
                                className="text-xs font-medium text-gray-400"
                            >
                                {seg.label}
                            </div>
                        ))}
                    </div>
                    <div className="flex" style={{ paddingLeft: 180 }}>
                        {days.map((day) => {
                            const isToday = startOfDay(day).getTime() === today.getTime();
                            return (
                                <div
                                    key={day.toISOString()}
                                    style={{ width: DAY_WIDTH }}
                                    className="flex flex-col items-center py-1"
                                >
                                    <span
                                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${isToday ? "bg-violet-600 font-semibold text-white" : "text-gray-400"
                                            }`}
                                    >
                                        {day.getDate()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Project rows */}
                    <div className="mt-2 divide-y divide-gray-50">
                        {projects.map((project) => {
                            const { left, width, isOutOfView } = getBarStyle(project);
                            const Icon = project.icon;
                            const styles = STATUS_STYLES[project.status];

                            return (
                                <div key={project.id} className="flex items-center py-3">
                                    {/* Label column */}
                                    <div className="flex w-[180px] shrink-0 items-center gap-2 pr-3">
                                        {Icon && (
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                                                <Icon size={16} />
                                            </span>
                                        )}
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-gray-900">{project.title}</p>
                                            <p className="truncate text-xs text-gray-400">{project.client}</p>
                                        </div>
                                    </div>

                                    {/* Bar track */}
                                    <div className="relative h-8 flex-1" style={{ width: gridWidth }}>
                                        {!isOutOfView && width > 0 && (
                                            <div
                                                className={`absolute top-1/2 h-2.5 -translate-y-1/2 rounded-full ${styles.bar}`}
                                                style={{ left, width: Math.max(width, 10) }}
                                                title={`${project.title}: ${STATUS_LABELS[project.status]}`}
                                            />
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => onProjectMenuClick?.(project)}
                                        className="ml-2 shrink-0 rounded p-1 text-gray-300 hover:bg-gray-50 hover:text-gray-500"
                                        aria-label={`More options for ${project.title}`}
                                    >
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-gray-50 pt-4">
                {Object.entries(STATUS_LABELS).map(([status, label]) => (
                    <span key={status} className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className={`h-2 w-2 rounded-full ${STATUS_STYLES[status].dot}`} />
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
}
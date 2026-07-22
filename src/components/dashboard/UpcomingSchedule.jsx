import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/*
|--------------------------------------------------------------------------
| UpcomingSchedule
|--------------------------------------------------------------------------
|
| Compact calendar widget: month grid (highlighting today) + a list of
| upcoming events below it. This is a real calendar (built from actual
| JS Date math, not a hardcoded image) — but the prev/next arrows are
| currently VISUAL ONLY. TODO(later): wire them to change `viewDate` for
| real month navigation.
|
| Props:
|   events — array of { id, title, subtitle, time, color }
|            color: a hex string for the small dot next to each event
|
*/

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function UpcomingSchedule({ events }) {
    const [viewDate] = useState(new Date());

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const today = new Date();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    const calendarCells = [
        ...Array(firstDayOfMonth).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    function isToday(day) {
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Upcoming Schedule
                </h2>
                <div className="flex gap-1">
                    <button
                        type="button"
                        aria-label="Previous month"
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <button
                        type="button"
                        aria-label="Next month"
                        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
            <p className="mt-0.5 text-xs text-slate-400">{monthLabel}</p>

            <div className="mt-3 grid grid-cols-7 gap-y-1 text-center">
                {WEEKDAYS.map((day, i) => (
                    <span key={i} className="text-[10px] font-medium text-slate-400">
                        {day}
                    </span>
                ))}
                {calendarCells.map((day, i) => (
                    <span
                        key={i}
                        className={[
                            "mx-auto flex h-6 w-6 items-center justify-center rounded-full text-xs",
                            day === null
                                ? ""
                                : isToday(day)
                                    ? "bg-purple-600 font-semibold text-white"
                                    : "text-slate-600 dark:text-slate-300",
                        ].join(" ")}
                    >
                        {day ?? ""}
                    </span>
                ))}
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                {events.length === 0 ? (
                    <p className="text-center text-xs text-slate-400">Nothing scheduled.</p>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2">
                                <span
                                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                                    style={{ backgroundColor: event.color }}
                                />
                                <div>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                        {event.title}
                                    </p>
                                    <p className="text-xs text-slate-400">{event.subtitle}</p>
                                </div>
                            </div>
                            <span className="shrink-0 text-xs text-slate-400">{event.time}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
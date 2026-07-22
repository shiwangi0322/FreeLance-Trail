import { useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";

/*
|--------------------------------------------------------------------------
| RevenueChart
|--------------------------------------------------------------------------
|
| Added a period dropdown ("This Month" / "Last 3 Months" / "This Year")
| in the header, matching the reference. NOTE: this is currently
| VISUAL ONLY — selecting a different period doesn't refetch different
| data yet, since there's no backend to ask for period-specific data.
| TODO(once backend exists): pass `period` into a real data-fetching
| call and have `data` reflect the selection.
|
*/

const PERIODS = ["This Month", "Last 3 Months", "This Year"];

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                ₹{payload[0].value.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-slate-400">{label}</p>
        </div>
    );
}

export default function RevenueChart({ data, total, changePercent }) {
    const [period, setPeriod] = useState(PERIODS[0]);
    const [isPeriodOpen, setIsPeriodOpen] = useState(false);

    return (
        <div className="h-full rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Revenue Trend
                </h2>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsPeriodOpen((v) => !v)}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        {period}
                        <ChevronDown size={13} />
                    </button>

                    {isPeriodOpen && (
                        <div className="absolute right-0 top-full z-10 mt-1 w-40 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                            {PERIODS.map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => {
                                        setPeriod(p);
                                        setIsPeriodOpen(false);
                                    }}
                                    className="block w-full px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {total && (
                <div className="mt-1">
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{total}</p>
                    {changePercent && (
                        <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            ↑ {changePercent}% vs last month
                        </p>
                    )}
                </div>
            )}

            <div className="mt-4 h-56 text-slate-400 dark:text-slate-500">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.15} vertical={false} />
                        <XAxis
                            dataKey="label"
                            tick={{ fontSize: 11, fill: "currentColor" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 11, fill: "currentColor" }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `₹${value / 100000}L`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#7c3aed"
                            strokeWidth={2}
                            fill="url(#revenueFill)"
                            dot={{ r: 3, fill: "#7c3aed", strokeWidth: 0 }}
                            activeDot={{ r: 5 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
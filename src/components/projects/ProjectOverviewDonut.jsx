// src/components/projects/ProjectOverviewDonut.jsx
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { STATUS_LABELS, STATUS_HEX, STATUS_ORDER } from "../../constants/projectStatus";

/**
 * Donut chart + legend showing project count by status.
 * `projects` is the raw project list — counting happens here so callers
 * never have to pre-aggregate.
 */
export default function ProjectOverviewDonut({ projects = [] }) {
    const counts = STATUS_ORDER.reduce((acc, status) => {
        acc[status] = projects.filter((p) => p.status === status).length;
        return acc;
    }, {});

    const total = projects.length;

    const data = STATUS_ORDER.filter((status) => counts[status] > 0).map((status) => ({
        name: STATUS_LABELS[status],
        value: counts[status],
        status,
    }));

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Project Overview</h3>

            <div className="relative mt-2 h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={total > 1 ? 3 : 0}
                            startAngle={90}
                            endAngle={-270}
                            stroke="none"
                        >
                            {data.map((entry) => (
                                <Cell key={entry.status} fill={STATUS_HEX[entry.status]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Center label sits on top of the donut hole */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{total}</span>
                    <span className="text-xs text-gray-500">Total</span>
                </div>
            </div>

            <ul className="mt-3 space-y-2">
                {STATUS_ORDER.map((status) => (
                    <li key={status} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-600">
                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: STATUS_HEX[status] }}
                            />
                            {STATUS_LABELS[status]}
                        </span>
                        <span className="font-medium text-gray-900">{counts[status] || 0}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
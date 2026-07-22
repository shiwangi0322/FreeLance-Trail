// src/components/clients/ClientOverviewDonut.jsx
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { CLIENT_STATUS_LABELS, CLIENT_STATUS_HEX } from "../../constants/clientStatus";

function isThisMonth(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

/**
 * Donut shows Active vs Inactive split (the two mutually-exclusive states).
 * "New this month" is shown as a separate stat line below, since it's a
 * subset of Active/Inactive rather than its own slice — matches the
 * reference where the counts (18 + 6 = 24) account for the whole donut.
 */
export default function ClientOverviewDonut({ clients = [] }) {
    const active = clients.filter((c) => c.status === "active").length;
    const inactive = clients.filter((c) => c.status === "inactive").length;
    const newThisMonth = clients.filter((c) => isThisMonth(c.addedDate)).length;
    const total = clients.length;

    const data = [
        { name: CLIENT_STATUS_LABELS.active, value: active, key: "active" },
        { name: CLIENT_STATUS_LABELS.inactive, value: inactive, key: "inactive" },
    ].filter((d) => d.value > 0);

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Client Overview</h3>

            <div className="relative mt-2 h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={data.length > 1 ? 3 : 0}
                            startAngle={90}
                            endAngle={-270}
                            stroke="none"
                        >
                            {data.map((entry) => (
                                <Cell key={entry.key} fill={CLIENT_STATUS_HEX[entry.key]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{total}</span>
                    <span className="text-xs text-gray-500">Total</span>
                </div>
            </div>

            <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-600">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CLIENT_STATUS_HEX.active }} />
                        Active
                    </span>
                    <span className="font-medium text-gray-900">
                        {active} ({total ? Math.round((active / total) * 100) : 0}%)
                    </span>
                </li>
                <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-600">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CLIENT_STATUS_HEX.inactive }} />
                        Inactive
                    </span>
                    <span className="font-medium text-gray-900">
                        {inactive} ({total ? Math.round((inactive / total) * 100) : 0}%)
                    </span>
                </li>
                <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-600">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CLIENT_STATUS_HEX.new }} />
                        New This Month
                    </span>
                    <span className="font-medium text-gray-900">
                        {newThisMonth} ({total ? Math.round((newThisMonth / total) * 100) : 0}%)
                    </span>
                </li>
            </ul>
        </div>
    );
}
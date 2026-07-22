// src/components/clients/ClientGrowthChart.jsx
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-xs shadow-md">
            <p className="font-medium text-gray-900">{label}</p>
            <p className="text-violet-600">{payload[0].value} clients</p>
        </div>
    );
}

/**
 * `growthData` shape: [{ month: "Jan", total: 8 }, ...]
 * Pass cumulative client counts per month — same ResponsiveContainer pattern
 * as RevenueChart.jsx so it resizes with its parent grid cell automatically.
 */
export default function ClientGrowthChart({ growthData = [] }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Client Growth</h3>
            <div className="mt-3 h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="clientGrowthFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#8B5CF6"
                            strokeWidth={2}
                            fill="url(#clientGrowthFill)"
                            dot={{ r: 3, fill: "#8B5CF6", strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
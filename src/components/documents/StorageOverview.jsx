// src/components/documents/StorageOverview.jsx
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const CATEGORY_COLORS = {
    proposals: "#8B5CF6",
    contracts: "#3B82F6",
    invoices: "#22C55E",
    design: "#F97316",
    other: "#9CA3AF",
};

const CATEGORY_LABELS = {
    proposals: "Proposals",
    contracts: "Contracts",
    invoices: "Invoices",
    design: "Design Files",
    other: "Other",
};

function formatSize(mb) {
    return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb.toFixed(0)} MB`;
}

/**
 * `documents` need a `sizeMB` (number) and `folder` field so storage-by-
 * category can be computed here rather than trusting a separately
 * maintained total that could drift out of sync with the actual file list.
 */
export default function StorageOverview({ documents = [], planLimitMB = 5120 }) {
    const usedByCategory = Object.keys(CATEGORY_LABELS).reduce((acc, key) => {
        acc[key] = documents.filter((d) => d.folder === key).reduce((sum, d) => sum + d.sizeMB, 0);
        return acc;
    }, {});

    const totalUsed = Object.values(usedByCategory).reduce((a, b) => a + b, 0);
    const percentUsed = Math.min(100, Math.round((totalUsed / planLimitMB) * 100));

    const chartData = Object.entries(usedByCategory)
        .filter(([, size]) => size > 0)
        .map(([key, size]) => ({ key, size }));

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900">Storage Overview</h3>

            <div className="relative mt-2 h-[130px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={chartData} dataKey="size" nameKey="key" innerRadius={40} outerRadius={58} stroke="none">
                            {chartData.map((entry) => (
                                <Cell key={entry.key} fill={CATEGORY_COLORS[entry.key]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-gray-900">{percentUsed}%</span>
                    <span className="text-xs text-gray-400">Used</span>
                </div>
            </div>

            <p className="mt-2 text-center text-xs text-gray-400">
                {formatSize(totalUsed)} of {formatSize(planLimitMB)} used
            </p>

            <ul className="mt-3 space-y-1.5">
                {Object.entries(usedByCategory)
                    .filter(([, size]) => size > 0)
                    .map(([key, size]) => (
                        <li key={key} className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-gray-600">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[key] }} />
                                {CATEGORY_LABELS[key]}
                            </span>
                            <span className="font-medium text-gray-900">{formatSize(size)}</span>
                        </li>
                    ))}
            </ul>
        </div>
    );
}
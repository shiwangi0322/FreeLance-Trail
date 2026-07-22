import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

/*
|--------------------------------------------------------------------------
| DocumentOverviewDonut
|--------------------------------------------------------------------------
|
| Same centered-total-donut technique as ProjectOverviewDonut and
| InvoiceStatusDonut — this one breaks down documents by type.
|
| Props:
|   documents — raw document list; aggregated by `type` here.
|
*/

const TYPE_CONFIG = {
    contract: { label: "Contracts", color: "#7c3aed" },
    proposal: { label: "Proposals", color: "#3b82f6" },
    invoice: { label: "Invoices", color: "#f97316" },
};

export default function DocumentOverviewDonut({ documents = [] }) {
    const counts = documents.reduce((acc, d) => {
        acc[d.type] = (acc[d.type] ?? 0) + 1;
        return acc;
    }, {});

    const segments = Object.keys(TYPE_CONFIG)
        .map((key) => ({
            key,
            label: TYPE_CONFIG[key].label,
            color: TYPE_CONFIG[key].color,
            count: counts[key] ?? 0,
        }))
        .filter((s) => s.count > 0);

    const total = documents.length;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Document Overview
            </h2>

            {total === 0 ? (
                <p className="mt-4 text-center text-xs text-slate-400">No documents yet.</p>
            ) : (
                <>
                    <div className="relative mt-3 h-36">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={segments}
                                    dataKey="count"
                                    nameKey="label"
                                    innerRadius="65%"
                                    outerRadius="90%"
                                    paddingAngle={2}
                                    stroke="none"
                                >
                                    {segments.map((s) => (
                                        <Cell key={s.key} fill={s.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-bold text-slate-900 dark:text-white">{total}</span>
                            <span className="text-[10px] text-slate-400">Total</span>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-col gap-1.5">
                        {segments.map((s) => (
                            <div key={s.key} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                                    <span className="text-slate-600 dark:text-slate-300">{s.label}</span>
                                </div>
                                <span className="font-medium text-slate-900 dark:text-white">{s.count}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
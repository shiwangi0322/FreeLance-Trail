import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";

/*
|--------------------------------------------------------------------------
| InvoiceStatusDonut
|--------------------------------------------------------------------------
|
| Donut chart + legend showing how invoices break down by status
| (Paid/Sent/Overdue/Draft), with the total shown in the donut's center
| hole. Recharts doesn't support a "big number in the middle" natively —
| it's done by absolutely positioning text ON TOP of the chart.
|
| Props:
|   statuses — array of { label, count, color: hex string }
|              (hex, not a Tailwind class, since Recharts' <Cell fill>
|              needs an actual CSS color value)
|
*/

export default function InvoiceStatusDonut({ data }) {
    const statuses = data ?? [];
    const total = statuses.reduce((sum, s) => sum + s.count, 0);
    const overdue = statuses.find((s) => s.label === "Overdue");

    return (
        <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Invoice Status
            </h2>

            <div className="relative mt-2 h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={statuses}
                            dataKey="count"
                            nameKey="label"
                            innerRadius="65%"
                            outerRadius="90%"
                            paddingAngle={2}
                            stroke="none"
                        >
                            {statuses.map((s) => (
                                <Cell key={s.label} fill={s.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs text-slate-400">Total</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{total}</span>
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
                {statuses.map((s) => (
                    <div key={s.label} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                            <span className="text-slate-600 dark:text-slate-300">{s.label}</span>
                        </div>
                        <span className="text-slate-400">
                            {s.count} ({Math.round((s.count / total) * 100)}%)
                        </span>
                    </div>
                ))}
            </div>

            {overdue && overdue.count > 0 && (
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <p className="text-xs text-red-600 dark:text-red-400">
                        <span className="font-semibold">{overdue.count}</span> overdue invoices
                    </p>
                    <Link
                        to="/invoices"
                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                        View All Invoices
                    </Link>
                </div>
            )}
        </div>
    );
}
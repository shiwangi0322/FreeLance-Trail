// src/components/AI/cards/ReportResultCard.jsx
import { Download, Copy } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

function formatCurrency(amount) {
    return `₹${amount.toLocaleString("en-IN")}`;
}

const TASK_COLORS = { completed: "#22C55E", in_progress: "#8B5CF6", pending: "#F59E0B", overdue: "#EF4444" };
const TASK_LABELS = { completed: "Completed", in_progress: "In Progress", pending: "Pending", overdue: "Overdue" };

/**
 * `data` shape: { project, generatedOn, status, progressPercent, startDate,
 * dueDate, budget, spent, executiveSummary, taskCounts: { completed, in_progress, pending, overdue },
 * keyHighlights: [string] }
 */
export default function ReportResultCard({ data, onExportPdf, onCopy }) {
    const totalTasks = Object.values(data.taskCounts).reduce((a, b) => a + b, 0);
    const chartData = Object.entries(data.taskCounts)
        .filter(([, count]) => count > 0)
        .map(([status, count]) => ({ status, count }));

    const budgetUtilization = data.budget ? Math.round((data.spent / data.budget) * 100) : 0;

    return (
        <div className="max-w-2xl rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-semibold text-gray-900">Project Report</h4>
                    <p className="text-xs text-gray-400">{data.project} · Generated on {data.generatedOn}</p>
                </div>
                <div className="flex gap-2">
                    <button type="button" onClick={onExportPdf} className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
                        <Download size={12} /> Export PDF
                    </button>
                    <button type="button" onClick={onCopy} className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
                        <Copy size={12} /> Copy
                    </button>
                </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-gray-50 pt-3 text-sm sm:grid-cols-4">
                <div>
                    <p className="text-xs text-gray-400">Status</p>
                    <span className="mt-0.5 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">{data.status}</span>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Progress</p>
                    <p className="font-medium text-gray-900">{data.progressPercent}%</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Start Date</p>
                    <p className="font-medium text-gray-900">{data.startDate}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Due Date</p>
                    <p className="font-medium text-gray-900">{data.dueDate}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Budget</p>
                    <p className="font-medium text-gray-900">{formatCurrency(data.budget)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400">Spent</p>
                    <p className="font-medium text-gray-900">{formatCurrency(data.spent)}</p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-50 pt-3 sm:grid-cols-2">
                <div>
                    <p className="text-xs font-semibold text-violet-600">Executive Summary</p>
                    <p className="mt-1.5 text-sm text-gray-600">{data.executiveSummary}</p>
                </div>

                <div>
                    <p className="text-xs font-semibold text-violet-600">Task Status</p>
                    <div className="mt-1 flex items-center gap-3">
                        <div className="h-[90px] w-[90px] shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} dataKey="count" nameKey="status" innerRadius={26} outerRadius={40} stroke="none">
                                        {chartData.map((entry) => (
                                            <Cell key={entry.status} fill={TASK_COLORS[entry.status]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <ul className="space-y-1 text-xs">
                            {chartData.map((entry) => (
                                <li key={entry.status} className="flex items-center gap-1.5 text-gray-600">
                                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: TASK_COLORS[entry.status] }} />
                                    {TASK_LABELS[entry.status]} {totalTasks ? Math.round((entry.count / totalTasks) * 100) : 0}%
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 border-t border-gray-50 pt-3 sm:grid-cols-2">
                <div>
                    <p className="text-xs font-semibold text-violet-600">Key Highlights</p>
                    <ul className="mt-1.5 space-y-1 text-sm text-gray-700">
                        {data.keyHighlights.map((point) => (
                            <li key={point} className="flex items-start gap-1.5">
                                <span className="mt-0.5 text-emerald-500">✓</span> {point}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="text-xs font-semibold text-violet-600">Budget Overview</p>
                    <div className="mt-1.5 space-y-1 text-sm text-gray-600">
                        <p>Total Budget: <span className="font-medium text-gray-900">{formatCurrency(data.budget)}</span></p>
                        <p>Total Spent: <span className="font-medium text-gray-900">{formatCurrency(data.spent)}</span></p>
                        <p>Remaining: <span className="font-medium text-gray-900">{formatCurrency(data.budget - data.spent)}</span></p>
                        <div className="mt-1.5">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Budget Utilization</span>
                                <span>{budgetUtilization}%</span>
                            </div>
                            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                                <div className="h-full rounded-full bg-violet-500" style={{ width: `${Math.min(budgetUtilization, 100)}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
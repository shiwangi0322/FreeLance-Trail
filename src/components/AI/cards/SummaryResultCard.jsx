// src/components/AI/cards/SummaryResultCard.jsx
import { Copy, ArrowUpRight, ArrowDown, ArrowUp } from "lucide-react";

/**
 * `data` shape: { fileName, summary, highlights: [string], metrics: [{ label, value, change }],
 * conclusion, sourceFileName }
 * `change` on a metric is a signed number (%) — sign drives arrow + color,
 * same pattern as InvoiceStatCard, so they never disagree.
 */
export default function SummaryResultCard({ data, onCopy, onViewInsights }) {
    return (
        <div className="max-w-2xl rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900">Document Summary</h4>
                <button
                    type="button"
                    onClick={onCopy}
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                    <Copy size={12} /> Copy
                </button>
            </div>

            <p className="mt-3 text-sm text-gray-600">{data.summary}</p>

            <div className="mt-3 space-y-1.5">
                {data.highlights.map((point) => (
                    <div key={point} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                        {point}
                    </div>
                ))}
            </div>

            {data.metrics?.length > 0 && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <p className="text-xs font-semibold text-violet-600">Financial Overview</p>
                        <div className="mt-2 space-y-1.5 text-sm">
                            {data.metrics.map((metric) => {
                                const positive = metric.change >= 0;
                                return (
                                    <div key={metric.label} className="flex items-center justify-between">
                                        <span className="text-gray-500">{metric.label}</span>
                                        <span className="flex items-center gap-1.5 font-medium text-gray-900">
                                            {metric.value}
                                            <span className={`flex items-center text-xs ${positive ? "text-emerald-600" : "text-red-500"}`}>
                                                {positive ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                                                {Math.abs(metric.change)}%
                                            </span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-violet-600">Conclusion</p>
                        <p className="mt-2 text-sm text-gray-600">{data.conclusion}</p>
                        <button
                            type="button"
                            onClick={onViewInsights}
                            className="mt-2 flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700"
                        >
                            View Key Insights <ArrowUpRight size={12} />
                        </button>
                    </div>
                </div>
            )}

            <p className="mt-3 text-xs text-gray-400">Source: {data.sourceFileName}</p>
        </div>
    );
}
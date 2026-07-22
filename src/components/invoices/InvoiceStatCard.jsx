// src/components/invoices/InvoiceStatCard.jsx
import { ArrowUp, ArrowDown } from "lucide-react";

/**
 * `trend` is a signed number (e.g. 12 or -6) representing % change from last
 * month — the arrow direction and color are derived from its sign, so you
 * never need to also pass a separate "isPositive" flag that could disagree.
 */
export default function InvoiceStatCard({ icon: Icon, iconBg, iconColor, label, value, trend }) {
    const isPositive = trend >= 0;

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
                <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: iconBg, color: iconColor }}
                >
                    <Icon size={16} />
                </span>
                <span className="text-sm text-gray-500">{label}</span>
            </div>

            <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>

            {trend !== undefined && (
                <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
                    {isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    {Math.abs(trend)}% from last month
                </p>
            )}
        </div>
    );
}
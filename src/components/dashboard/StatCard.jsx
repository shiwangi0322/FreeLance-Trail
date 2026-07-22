import { TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

// Convert title into a safe SVG id
function slugify(text) {
    return String(text)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export default function StatCard({
    title,
    value,
    change,
    trend = "up",
    subtitle,
    icon: Icon,
    iconBg = "bg-violet-100",
    iconText = "text-violet-600",
    sparklineData = [10, 14, 12, 18, 16, 22, 28],
    sparklineColor = "#7c3aed",
}) {
    const gradientId = `spark-${slugify(title)}`;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500">{title}</p>

                    <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                        {value}
                    </h2>

                    {change && (
                        <div className="mt-2 flex items-center gap-1 text-sm">
                            {trend === "up" ? (
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                            )}

                            <span
                                className={
                                    trend === "up"
                                        ? "font-medium text-emerald-600"
                                        : "font-medium text-red-600"
                                }
                            >
                                {change}
                            </span>

                            <span className="text-slate-400">
                                vs last month
                            </span>
                        </div>
                    )}

                    {subtitle && (
                        <p className="mt-1 text-sm text-slate-500">
                            {subtitle}
                        </p>
                    )}
                </div>

                {Icon && (
                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}
                    >
                        <Icon className={`h-6 w-6 ${iconText}`} />
                    </div>
                )}
            </div>

            <div className="mt-4 h-16">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={sparklineData.map((v) => ({
                            value: v,
                        }))}
                        margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient
                                id={gradientId}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor={sparklineColor}
                                    stopOpacity={0.28}
                                />
                                <stop
                                    offset="100%"
                                    stopColor={sparklineColor}
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>

                        <Area
                            type="natural"
                            dataKey="value"
                            stroke={sparklineColor}
                            strokeWidth={2}
                            strokeLinecap="round"
                            fill={`url(#${gradientId})`}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
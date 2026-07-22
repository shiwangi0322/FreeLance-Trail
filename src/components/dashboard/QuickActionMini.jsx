import { Link } from "react-router-dom";
import { FolderPlus, Receipt, Upload, Sparkles } from "lucide-react";

/*
|--------------------------------------------------------------------------
| QuickActionMini
|--------------------------------------------------------------------------
|
| Compact 4-icon action row, sized to fit inside the third dashboard
| column (stacked under UpcomingSchedule and AIInsightCard) — different
| from the older full-width QuickActions.jsx (6 large cards spanning the
| whole dashboard width, no longer used on Dashboard). This one matches
| the reference's small "Quick Action" card in the bottom-right.
|
*/

const ACTIONS = [
    { label: "New Project", to: "/projects", icon: FolderPlus, color: "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400" },
    { label: "New Invoice", to: "/invoices", icon: Receipt, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400" },
    { label: "Upload Doc", to: "/documents", icon: Upload, color: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400" },
    { label: "AI Proposal", to: "/proposal", icon: Sparkles, color: "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/15 dark:text-fuchsia-400" },
];

export default function QuickActionMini() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Quick Action</h2>

            <div className="mt-3 grid grid-cols-4 gap-2">
                {ACTIONS.map(({ label, to, icon: Icon, color }) => (
                    <Link
                        key={label}
                        to={to}
                        className="flex flex-col items-center gap-1.5 rounded-lg p-2 text-center transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                        <div className={["flex h-9 w-9 items-center justify-center rounded-lg", color].join(" ")}>
                            <Icon size={16} />
                        </div>
                        <span className="text-[10px] font-medium leading-tight text-slate-600 dark:text-slate-300">
                            {label}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
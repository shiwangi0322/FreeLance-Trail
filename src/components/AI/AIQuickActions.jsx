// src/components/AI/AIQuickActions.jsx
import { AI_ACTIONS } from "../../constants/aiActions";

/**
 * Grid of the 6 starter tiles. Purely presentational — AIAssistant.jsx owns
 * what happens when one is clicked (usually: set activeAction + seed the
 * first user message), so this stays reusable if you ever want the same
 * tile grid inside a modal or onboarding flow.
 */
export default function AIQuickActions({ onSelect }) {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {AI_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                    <button
                        key={action.key}
                        type="button"
                        onClick={() => onSelect(action)}
                        className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <span
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                            style={{ backgroundColor: action.iconBg, color: action.iconColor }}
                        >
                            <Icon size={18} />
                        </span>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{action.label}</p>
                            <p className="mt-0.5 text-xs text-gray-400">{action.description}</p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
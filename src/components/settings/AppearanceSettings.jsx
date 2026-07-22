// src/components/settings/AppearanceSettings.jsx
import { Sun, Moon, Monitor } from "lucide-react";
import { useThemeStore, resolveTheme } from "../../store/themeStore";

const THEME_OPTIONS = [
    { key: "light", label: "Light", icon: Sun },
    { key: "dark", label: "Dark", icon: Moon },
    { key: "system", label: "System", icon: Monitor },
];

/**
 * Reads/writes the SAME useThemeStore your Header's sun/monitor/moon
 * toggle already uses, so changing it here and there stay in sync
 * automatically — no separate local state duplicating the preference.
 */
export default function AppearanceSettings() {
    const theme = useThemeStore((s) => s.theme);
    const setTheme = useThemeStore((s) => s.setTheme);
    const activeResolved = resolveTheme(theme);

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Appearance</h2>
            <p className="mt-1 text-sm text-gray-400">Choose how ProManage AI looks on your device.</p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {THEME_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isActive = theme === option.key;
                    return (
                        <button
                            key={option.key}
                            type="button"
                            onClick={() => setTheme(option.key)}
                            className={`flex flex-col items-center gap-2 rounded-xl border-2 px-4 py-5 transition-colors ${isActive ? "border-violet-500 bg-violet-50" : "border-gray-100 hover:border-gray-200"
                                }`}
                        >
                            <Icon size={22} className={isActive ? "text-violet-600" : "text-gray-400"} />
                            <span className={`text-sm font-medium ${isActive ? "text-violet-700" : "text-gray-600"}`}>
                                {option.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            <p className="mt-4 text-xs text-gray-400">
                Currently applied: <span className="font-medium text-gray-600">{activeResolved === "dark" ? "Dark" : "Light"}</span>
                {theme === "system" && " (following your device setting)"}
            </p>
        </div>
    );
}
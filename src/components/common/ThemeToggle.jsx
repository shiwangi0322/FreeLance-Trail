import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "../../store/themeStore";

/*
|--------------------------------------------------------------------------
| ThemeToggle
|--------------------------------------------------------------------------
|
| Two-option theme switch:
|   ☀️ Light
|   🌙 Dark
|
| Reads/writes the theme from themeStore.
|
*/

const OPTIONS = [
    {
        value: "light",
        icon: Sun,
        label: "Light theme",
    },
    {
        value: "dark",
        icon: Moon,
        label: "Dark theme",
    },
];

export default function ThemeToggle() {
    const theme = useThemeStore((state) => state.theme);
    const setTheme = useThemeStore((state) => state.setTheme);

    return (
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {OPTIONS.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    type="button"
                    aria-label={label}
                    onClick={() => setTheme(value)}
                    className={[
                        "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
                        theme === value
                            ? "bg-white text-purple-600 shadow-sm dark:bg-slate-700 dark:text-purple-400"
                            : "text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white",
                    ].join(" ")}
                >
                    <Icon size={18} />
                </button>
            ))}
        </div>
    );
}
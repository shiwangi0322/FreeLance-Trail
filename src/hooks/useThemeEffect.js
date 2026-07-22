import { useEffect } from "react";
import { useThemeStore, resolveTheme } from "../store/themeStore";

/*
|--------------------------------------------------------------------------
| useThemeEffect
|--------------------------------------------------------------------------
|
| Call this ONCE, near the root of the app (App.jsx). It's the bridge
| between themeStore's stored preference and the actual DOM: Tailwind's
| dark: variant (configured via @custom-variant dark in index.css) looks
| for a `.dark` class on an ancestor element — this hook is what adds or
| removes that class on <html> whenever the theme changes.
|
| Two effects:
|   1. Whenever `theme` changes (light/dark/system), resolve it to an
|      actual light/dark value and toggle the class.
|   2. If theme is "system", also listen for the OS preference changing
|      WHILE the app is open (e.g. user's OS auto-switches to dark mode
|      at sunset) and react live, without needing a page refresh.
|
*/
export function useThemeEffect() {
    const theme = useThemeStore((s) => s.theme);

    useEffect(() => {
        function applyTheme() {
            const resolved = resolveTheme(theme);
            document.documentElement.classList.toggle("dark", resolved === "dark");
        }

        applyTheme();

        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            mediaQuery.addEventListener("change", applyTheme);
            return () => mediaQuery.removeEventListener("change", applyTheme);
        }
    }, [theme]);
}
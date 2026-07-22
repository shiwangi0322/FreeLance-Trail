import { create } from "zustand";
import { persist } from "zustand/middleware";

/*
|--------------------------------------------------------------------------
| themeStore.js
|--------------------------------------------------------------------------
|
| Holds the current theme: "light" | "dark" | "system".
|
| "system" means "follow the OS preference" (prefers-color-scheme) rather
| than forcing one — this is why there are three toggle icons in the
| header (sun / monitor / moon), not just a two-way light/dark switch.
|
| Persisted to localStorage via Zustand's `persist` middleware, so the
| choice survives a page refresh. (Note: this is a real browser app, not
| a Claude artifact — localStorage is fine here, unlike in-chat
| artifacts which can't use browser storage APIs.)
|
| This store only holds the PREFERENCE. Actually applying it (adding/
| removing the "dark" class on <html>) happens in a small effect —
| see useThemeEffect below — because that's a side effect, not state.
|
*/

export const useThemeStore = create(
    persist(
        (set) => ({
            theme: "system",
            setTheme: (theme) => set({ theme }),
        }),
        { name: "theme-storage" }
    )
);

/*
|--------------------------------------------------------------------------
| resolveTheme
|--------------------------------------------------------------------------
| Converts the stored preference into an actual "light" | "dark" value,
| resolving "system" against the OS-level media query at call time.
*/
export function resolveTheme(theme) {
    if (theme === "system") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }
    return theme;
}
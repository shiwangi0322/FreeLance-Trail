import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    FolderKanban,
    Users,
    Receipt,
    FileStack,
    Layers,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Settings,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { useUIStore } from "../../store/uiStore";

/*
|--------------------------------------------------------------------------
| Sidebar
|--------------------------------------------------------------------------
|
| A "workspace" header (logo badge + app name + tagline), and simple
| single-line nav items (icon + label only — no subtitle caption under
| each label, kept intentionally minimal).
|
| Full light/dark support via dark: classes, driven by the .dark class
| useThemeEffect toggles on <html>. Active nav state uses a purple accent
| to match the theme; a small left-border indicator (border-l-2
| border-purple-500) reinforces the active item alongside the background
| tint, so it stays legible even for someone with reduced color perception.
|
| CHANGED: added "/settings" — Settings.jsx existed as a page + route but
| had no nav item pointing to it, so there was no way to reach it from
| the sidebar itself.
|
*/

const NAV_ITEMS = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/projects", label: "Projects", icon: FolderKanban },
    { to: "/clients", label: "Clients", icon: Users },
    { to: "/invoices", label: "Invoices", icon: Receipt },
    { to: "/documents", label: "Documents", icon: FileStack },
    { to: "/ai", label: "AI Assistant", icon: Sparkles },
    { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
    const collapsed = useUIStore((s) => s.isSidebarCollapsed);
    const toggleSidebar = useUIStore((s) => s.toggleSidebar);
    const { logout } = useAuth();

    return (
        <aside
            className={[
                "fixed left-0 top-0 z-40 h-screen border-r transition-all duration-300",
                "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
                collapsed ? "w-20" : "w-64",
            ].join(" ")}
        >
            <div className="flex h-full flex-col">
                {/* Workspace header */}
                <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4 dark:border-slate-800">
                    {!collapsed && (
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-purple-500 to-fuchsia-500">
                                <Layers className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold leading-tight text-slate-900 dark:text-white">
                                    Paper Trail
                                </p>
                                <p className="text-xs leading-tight text-slate-400">Freelance Studio</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={toggleSidebar}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    >
                        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                {/* Section label */}
                {!collapsed && (
                    <p className="px-4 pt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Workspace
                    </p>
                )}

                {/* Nav links */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-2">
                    {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                [
                                    "flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 transition-all duration-200",
                                    isActive
                                        ? "border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400"
                                        : "border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                                    collapsed ? "justify-center" : "",
                                ].join(" ")
                            }
                        >
                            <Icon size={19} className="shrink-0" />
                            {!collapsed && <span className="truncate text-sm font-medium">{label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Upgrade card */}
                {!collapsed && (
                    <div className="mx-3 mb-3 rounded-xl bg-linear-to-br from-purple-600 to-fuchsia-600 p-4 text-white">
                        <p className="text-sm font-semibold">Pro Plan</p>
                        <p className="mt-1 text-xs text-purple-100">
                            Unlock automated invoicing & tax reports.
                        </p>
                        <button className="mt-3 w-full rounded-lg bg-white/15 py-1.5 text-xs font-semibold backdrop-blur-sm transition-colors hover:bg-white/25">
                            Upgrade
                        </button>
                    </div>
                )}

                {/* Logout */}
                <div className="border-t border-slate-200 p-2 dark:border-slate-800">
                    <button
                        onClick={logout}
                        className={[
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400",
                            collapsed ? "justify-center" : "",
                        ].join(" ")}
                    >
                        <LogOut size={19} />
                        {!collapsed && <span className="text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </div>
        </aside>
    );
}
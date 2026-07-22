import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Search, User as UserIcon } from "lucide-react";

import useAuth from "../../hooks/useAuth";
import ThemeToggle from "../common/ThemeToggle";

/*
|--------------------------------------------------------------------------
| Header
|--------------------------------------------------------------------------
|
| Redesigned to match the reference: page title + subtitle on the left,
| a search bar with a keyboard-shortcut hint, the ThemeToggle
| (sun/monitor/moon), notification bell, and a user profile block that
| now shows a role label (e.g. "Studio Owner") under the name, not just
| the email.
|
| Full dark mode support via dark: classes.
|
*/

const PAGE_META = {
    "/dashboard": { title: "Studio Dashboard", subtitle: "Your freelance business at a glance" },
    "/projects": { title: "Projects", subtitle: "All your active and past work" },
    "/clients": { title: "Clients", subtitle: "People you work with" },
    "/documents": { title: "Documents", subtitle: "AI-generated contracts & proposals" },
    "/invoices": { title: "Invoices", subtitle: "Track billing and payments" },
    "/ai": { title: "AI Assistant", subtitle: "Automate your paperwork" },
    "/proposal": { title: "AI Proposals", subtitle: "Draft and optimize proposals" },
    "/settings": { title: "Settings", subtitle: "Manage your account" },
};

export default function Header() {
    const { user } = useAuth();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");

    const meta = PAGE_META[location.pathname] ?? {
        title: "Freelance Paper Trail",
        subtitle: "",
    };

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
            <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">{meta.title}</h1>
                {meta.subtitle && (
                    <p className="text-xs text-slate-400">{meta.subtitle}</p>
                )}
            </div>

            <div className="flex items-center gap-3">
                {/* Search with keyboard shortcut hint */}
                <div className="relative hidden sm:block">
                    <Search
                        size={15}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        placeholder="Search projects, clients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-56 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-12 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                    <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400">
                        ⌘K
                    </kbd>
                </div>

                <ThemeToggle />

                {/* Notifications */}
                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                    <Bell size={19} />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
                </button>

                {/* User */}
                <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3 dark:border-slate-800">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-purple-500 to-fuchsia-500">
                        {user?.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt={user.name}
                                className="h-full w-full rounded-full object-cover"
                            />
                        ) : (
                            <UserIcon size={17} className="text-white" />
                        )}
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                            {user?.name ?? "User"}
                        </p>
                        <p className="text-xs text-slate-400">{user?.role ?? "Studio Owner"}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
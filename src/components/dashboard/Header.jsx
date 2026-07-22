import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Bell, Search, User as UserIcon, Plus, ChevronDown, FolderPlus, Receipt, UserPlus, Sparkles } from "lucide-react";

import useAuth from "../../hooks/useAuth";
import ThemeToggle from "../common/ThemeToggle";

/*
|--------------------------------------------------------------------------
| Header
|--------------------------------------------------------------------------
|
| CHANGED: on /dashboard specifically, the title area shows a dynamic
| time-of-day greeting ("Good morning/afternoon/evening, {firstName}! 👋")
| instead of a static title — matching the new reference. Every other
| page still uses the plain PAGE_META title/subtitle as before.
|
| Also added a "+ New" split button with a dropdown (New Project, New
| Client, New Invoice, AI Proposal) — a global shortcut so the user
| doesn't have to navigate to a specific page first just to start
| creating something.
|
*/

const PAGE_META = {
    "/projects": { title: "Projects", subtitle: "All your active and past work" },
    "/clients": { title: "Clients", subtitle: "People you work with" },
    "/documents": { title: "Documents", subtitle: "AI-generated contracts & proposals" },
    "/invoices": { title: "Invoices", subtitle: "Track billing and payments" },
    "/ai": { title: "AI Assistant", subtitle: "Automate your paperwork" },
    "/proposal": { title: "AI Proposals", subtitle: "Draft and optimize proposals" },
    "/settings": { title: "Settings", subtitle: "Manage your account" },
};

const NEW_ACTIONS = [
    { label: "New Project", to: "/projects", icon: FolderPlus },
    { label: "New Client", to: "/clients", icon: UserPlus },
    { label: "New Invoice", to: "/invoices", icon: Receipt },
    { label: "AI Proposal", to: "/proposal", icon: Sparkles },
];

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

export default function Header() {
    const { user } = useAuth();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [isNewOpen, setIsNewOpen] = useState(false);

    const isDashboard = location.pathname === "/dashboard";
    const firstName = user?.name?.split(" ")[0] ?? "there";

    const meta = isDashboard
        ? {
            title: `${getGreeting()}, ${firstName}! 👋`,
            subtitle: "Here's an overview of your business today.",
        }
        : PAGE_META[location.pathname] ?? { title: "Freelance Paper Trail", subtitle: "" };

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
            <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">{meta.title}</h1>
                {meta.subtitle && <p className="text-xs text-slate-400">{meta.subtitle}</p>}
            </div>

            <div className="flex items-center gap-3">
                <div className="relative hidden sm:block">
                    <Search
                        size={15}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-56 rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-12 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    />
                    <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400">
                        ⌘K
                    </kbd>
                </div>

                <ThemeToggle />

                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                    <Bell size={19} />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
                </button>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsNewOpen((v) => !v)}
                        className="flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-purple-700"
                    >
                        <Plus size={15} />
                        New
                        <ChevronDown size={13} />
                    </button>

                    {isNewOpen && (
                        <div className="absolute right-0 top-full z-10 mt-1 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                            {NEW_ACTIONS.map(({ label, to, icon: Icon }) => (
                                <Link
                                    key={label}
                                    to={to}
                                    onClick={() => setIsNewOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    <Icon size={14} />
                                    {label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

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
                        <p className="text-xs text-slate-400">{user?.role ?? "Founder"}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
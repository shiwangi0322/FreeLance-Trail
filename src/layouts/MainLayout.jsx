import { Outlet, useLocation } from "react-router-dom";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import AIChatWidget from "../components/AI/AIChatWidget";
import { useUIStore } from "../store/uiStore";

/*
|--------------------------------------------------------------------------
| MainLayout
|--------------------------------------------------------------------------
|
| FIXED: previously used a hardcoded ml-64, which only matched the
| sidebar's EXPANDED width — collapsing the sidebar (to w-20) left a
| large blank gap since the content area's margin never shrank to
| match. Now reads the SAME isSidebarCollapsed value from uiStore that
| Sidebar.jsx uses for its own width, so both stay in sync: ml-64 when
| expanded, ml-20 when collapsed, with a matching transition duration
| (duration-300) so they animate together instead of one snapping
| instantly while the other slides.
|
*/

export default function MainLayout() {
    const location = useLocation();
    const isOnFullAssistantPage = location.pathname === "/ai";
    const isSidebarCollapsed = useUIStore((s) => s.isSidebarCollapsed);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Sidebar />

            <div
                className={[
                    "flex min-h-screen flex-col transition-all duration-300",
                    isSidebarCollapsed ? "ml-20" : "ml-64",
                ].join(" ")}
            >
                <Header />

                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>

            {/* Skip the floating widget on the full AI Assistant page itself —
          having both the full chat AND a floating chat button open would
          be redundant and confusing. */}
            {!isOnFullAssistantPage && <AIChatWidget />}
        </div>
    );
}
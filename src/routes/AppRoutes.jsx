import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import useAuth from "../hooks/useAuth";

/* ============================================================================
 * AppRoutes.jsx
 * ----------------------------------------------------------------------------
 * Owns all navigation decisions: which URL shows which page, which pages
 * require login, and what happens on an unknown URL.
 *
 * CHANGED in this version: protected pages no longer render directly.
 * They now nest under a single <MainLayout> "layout route" — MainLayout
 * renders Sidebar + Header once, and <Outlet /> swaps in whichever child
 * route matched (Dashboard, Clients, Projects, ...). Without this nesting,
 * every protected page would need to import and wrap itself in
 * <Sidebar>/<Header> individually.
 *
 * ALSO CHANGED: added the missing /settings route — Settings.jsx existed
 * as a page component but had no matching <Route>, so the Sidebar's
 * Settings link had nowhere valid to go.
 * ==========================================================================*/

const AuthPage = lazy(() => import("../pages/AuthPage"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Clients = lazy(() => import("../pages/Clients"));
const Projects = lazy(() => import("../pages/Projects"));
const Documents = lazy(() => import("../pages/Documents"));
const Invoices = lazy(() => import("../pages/Invoices"));
const ProposalGenerator = lazy(() => import("../pages/ProposalGenerator"));
const AIAssistant = lazy(() => import("../pages/AIAssistant"));
const Settings = lazy(() => import("../pages/Settings"));

function PageFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| ProtectedLayout
|--------------------------------------------------------------------------
|
| Combines the auth check AND the MainLayout shell into one wrapper route.
| If not authenticated → redirect to /login (preserving where they were
| headed). If authenticated → render <MainLayout /> directly. MainLayout
| already renders Sidebar + Header + its OWN internal <Outlet /> for
| whichever child page matched — we do NOT pass children into it here,
| since that would create two competing Outlets.
|
*/
function ProtectedLayout() {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) return <PageFallback />;

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <MainLayout />;
}

function AppRoutes() {
    return (
        <Suspense fallback={<PageFallback />}>
            <Routes>
                {/* Public routes — both point to the same sliding-card AuthPage */}
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />

                {/* Protected routes — all nested under one MainLayout instance */}
                <Route element={<ProtectedLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/proposal" element={<ProposalGenerator />} />
                    <Route path="/ai" element={<AIAssistant />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>

                {/* Fallback redirects — ProtectedLayout decides login vs dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Suspense>
    );
}

export default AppRoutes;
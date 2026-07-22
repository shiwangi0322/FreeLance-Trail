import { create } from "zustand";

/*
|--------------------------------------------------------------------------
| uiStore.js
|--------------------------------------------------------------------------
|
| Holds UI state that needs to be shared between components that aren't
| parent/child — specifically, whether the sidebar is collapsed.
|
| Why this needs to be a store and not local useState:
| Sidebar.jsx renders the collapse/expand toggle button. MainLayout.jsx
| needs to know that SAME state to set the correct left margin on the
| content area (ml-64 when expanded, ml-20 when collapsed). A small
| shared store is simpler than lifting state through props for
| something this small, needed by only two components.
|
*/

export const useUIStore = create((set) => ({
    isSidebarCollapsed: false,
    toggleSidebar: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));
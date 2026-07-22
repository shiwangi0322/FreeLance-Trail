import { create } from "zustand";
import { persist } from "zustand/middleware";

/*
|--------------------------------------------------------------------------
| authStore.js
|--------------------------------------------------------------------------
|
| Global authentication state, powered by Zustand.
|
| Holds:
| ✔ user            → the logged-in user's info (name, email, etc.)
| ✔ token           → JWT returned by the backend on login
| ✔ isAuthenticated → derived flag, true once a token exists
|
| Any component anywhere in the tree can read this directly:
|
|   const { user, logout } = useAuthStore();
|
| Persistence: wrapped with Zustand's `persist` middleware (same pattern
| as themeStore.js), so user/token/isAuthenticated are saved to
| localStorage under the "auth-storage" key and automatically rehydrated
| on load. Without this, auth state could reset back to false between
| renders, which sends ProtectedLayout straight back to /login even
| right after a successful login — the "flash then bounce back" bug.
|
*/

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            /*
            | Called by authService.js after a successful login/register response.
            | Stores the user object and JWT, and flips isAuthenticated to true —
            | this is what ProtectedLayout in AppRoutes.jsx reads.
            */
            login: (user, token) =>
                set({
                    user,
                    token,
                    isAuthenticated: true,
                }),

            /*
            | Clears everything. Called on manual logout, or automatically by
            | api.js's response interceptor if the backend returns 401.
            */
            logout: () =>
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                }),
        }),
        { name: "auth-storage" }
    )
);

export default useAuthStore;
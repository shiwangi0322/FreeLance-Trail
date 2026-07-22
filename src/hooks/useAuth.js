import { create } from "zustand";

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
| — no prop-drilling through App → Layout → Sidebar → Profile → Avatar.
|
| Persistence note: this version keeps state in memory only, so a page
| refresh logs the user out. TODO(later): wrap `create` with Zustand's
| `persist` middleware to save token/user to localStorage and rehydrate
| on app load, so refreshing the page doesn't force a re-login.
|
*/

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  /*
  | Called by authService.js after a successful login/register response.
  | Stores the user object and JWT, and flips isAuthenticated to true —
  | this is what ProtectedRoute in AppRoutes.jsx will eventually read.
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
}));

export default useAuthStore;
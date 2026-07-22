/*
|--------------------------------------------------------------------------
| Authentication Service — MOCK MODE
|--------------------------------------------------------------------------
|
| TEMPORARY: accepts ANY email/password combination and returns a fake
| user + token, instead of calling a real backend. This is why "SIGN IN"
| may not have appeared to do anything before — it was trying to reach
| POST /api/auth/login on a server that doesn't exist. Only the dev
| bypass button worked until now, since it skipped authService entirely.
|
| With this change, the REAL Sign In / Sign Up forms now work too — the
| dev bypass button becomes redundant but harmless.
|
| Switch back to real API calls later: uncomment the block under each
| method and delete the mock lines above it, once your real Express
| backend exists. You'll also need to bring back:
|   import api from "./api";
| at the top of this file.
|
*/

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const authService = {
  async login(credentials) {
    await delay(400);
    return {
      user: {
        id: "u1",
        name: credentials.email?.split("@")[0] ?? "Demo User",
        email: credentials.email ?? "demo@example.com",
      },
      token: "mock-jwt-token",
    };

    // TODO(once backend exists): delete the block above, uncomment below
    // const response = await api.post("/auth/login", credentials);
    // return response.data;
  },

  async register(userData) {
    await delay(400);
    return {
      user: {
        id: "u1",
        name: userData.name ?? "Demo User",
        email: userData.email ?? "demo@example.com",
      },
      token: "mock-jwt-token",
    };

    // TODO(once backend exists): delete the block above, uncomment below
    // const response = await api.post("/auth/register", userData);
    // return response.data;
  },

  async logout() {
    await delay(200);
    return { success: true };

    // TODO(once backend exists): delete the lines above, uncomment below
    // const response = await api.post("/auth/logout");
    // return response.data;
  },

  async forgotPassword(email) {
    await delay(400);
    return { success: true, message: "Reset link sent (mock)" };

    // TODO(once backend exists): delete the two lines above, uncomment below
    // const response = await api.post("/auth/forgot-password", { email });
    // return response.data;
  },

  async resetPassword(token, password) {
    await delay(400);
    return { success: true };

    // TODO(once backend exists): delete the two lines above, uncomment below
    // const response = await api.post("/auth/reset-password", { token, password });
    // return response.data;
  },
};

export default authService;
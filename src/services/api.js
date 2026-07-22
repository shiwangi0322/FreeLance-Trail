import axios from "axios";

/*
|--------------------------------------------------------------------------
| Axios Instance
|--------------------------------------------------------------------------
|
| Every API request in the application uses this instance instead of
| importing axios directly. That means baseURL, timeout, headers, and
| (soon) auth tokens are all configured in exactly one place.
|
| Future additions (added when authStore + interceptors are wired up):
| ✔ Attach JWT token to every outgoing request
| ✔ Handle 401 responses (auto-logout / refresh token)
| ✔ Global error logging
|
*/

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
|--------------------------------------------------------------------------
| Request Interceptor (placeholder)
|--------------------------------------------------------------------------
|
| TODO(Phase 3, after authStore.js exists):
| Attach the JWT token to every request automatically, so individual
| services (clientService.js, projectService.js, etc.) never have to
| think about auth headers.
|
| import useAuthStore from "../store/authStore";
|
| api.interceptors.request.use((config) => {
|   const token = useAuthStore.getState().token;
|   if (token) {
|     config.headers.Authorization = `Bearer ${token}`;
|   }
|   return config;
| });
|
*/

/*
|--------------------------------------------------------------------------
| Response Interceptor (placeholder)
|--------------------------------------------------------------------------
|
| TODO(Phase 3): if the backend ever responds with 401 (token expired or
| invalid), automatically log the user out and redirect to /login instead
| of letting every single page handle that case separately.
|
| api.interceptors.response.use(
|   (response) => response,
|   (error) => {
|     if (error.response?.status === 401) {
|       useAuthStore.getState().logout();
|       window.location.href = "/login";
|     }
|     return Promise.reject(error);
|   }
| );
|
*/

export default api;
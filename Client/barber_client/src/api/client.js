// Single axios instance for the whole app.
// - baseURL points to the local Express server
// - withCredentials: true so the httpOnly "jwt" refresh cookie is sent
// - Interceptor attaches the accessToken to every request
// - On 401, tries /auth/refresh once and retries the original request

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/Api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// In-memory access token. NOT localStorage — so a refresh of the page
// drops the token and we re-issue via /auth/refresh (using the cookie).
let accessToken = null;
export const setAccessToken = (t) => { accessToken = t; };
export const getAccessToken = () => accessToken;
export const clearAccessToken = () => { accessToken = null; };

// Attach the access token to every outgoing request.
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// On 401, try to refresh once, then retry. Prevents infinite loops with a flag.
let isRefreshing = false;
let pendingQueue = [];

function flushQueue(newToken) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (newToken) resolve(newToken);
    else reject(new Error("refresh failed"));
  });
  pendingQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const isAuthRoute =
      original?.url?.includes("/auth/login") ||
      original?.url?.includes("/auth/register") ||
      original?.url?.includes("/auth/refresh");

    if (error.response?.status !== 401 || original._retry || isAuthRoute) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Another request is already refreshing — wait for it
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          },
          reject,
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await api.post("/auth/refresh");
      const newToken = data.accessToken;
      setAccessToken(newToken);
      flushQueue(newToken);
      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch (refreshError) {
      flushQueue(null);
      clearAccessToken();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
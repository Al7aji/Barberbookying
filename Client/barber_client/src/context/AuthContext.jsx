import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api, { setAccessToken, clearAccessToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until we know if the user is logged in

  // Try to restore the session on first load using the httpOnly refresh cookie.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { data } = await api.post("/auth/refresh");
        if (cancelled) return;
        setAccessToken(data.accessToken);
        // Fetch the user's own profile so we have name + role
        const profile = await api.get("/users/me");
        if (cancelled) return;
        setUser(profile.data.user);
      } catch {
        // No valid session — stay logged out
        clearAccessToken();
        setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (first_name, Last_name, email, password) => {
    const { data } = await api.post("/auth/register", { first_name, Last_name, email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try { await api.post("/auth/logout"); } catch { /* ignore */ }
    clearAccessToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
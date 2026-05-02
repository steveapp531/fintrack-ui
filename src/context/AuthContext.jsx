// ============================================================
//  src/context/AuthContext.jsx — Global Authentication State
//
//  WHY: React Context gives every component access to the
//  current user without prop-drilling. This context:
//   • Reads token + user from localStorage on mount (auto-login)
//   • Exposes login(), logout(), register() helpers
//   • Exposes the user object and loading state
//   • Any component can call useAuth() to access all of this
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../utils/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true); // true while we check localStorage

  // ── Rehydrate session on page load ────────────────────────
  // If a token exists in localStorage, verify it with /auth/me
  // so we always have a fresh user object (subscription status etc.)
  useEffect(() => {
    const token = localStorage.getItem("fintrack_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authAPI.getMe()
      .then((res) => setUser(res.data.user))
      .catch(() => {
        // Token invalid or expired — clear storage
        localStorage.removeItem("fintrack_token");
        localStorage.removeItem("fintrack_user");
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Persist token + user ──────────────────────────────────
  const persistSession = useCallback((token, userData) => {
    localStorage.setItem("fintrack_token", token);
    localStorage.setItem("fintrack_user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  // ── Auth actions ──────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    persistSession(res.data.token, res.data.user);
    return res.data.user;
  }, [persistSession]);

  const register = useCallback(async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    persistSession(res.data.token, res.data.user);
    return res.data.user;
  }, [persistSession]);

  const logout = useCallback(() => {
    localStorage.removeItem("fintrack_token");
    localStorage.removeItem("fintrack_user");
    setUser(null);
  }, []);

  // Refresh user object from server (call after upload to update counter)
  const refreshUser = useCallback(async () => {
    try {
      const res = await authAPI.getMe();
      setUser(res.data.user);
    } catch { /* silently ignore */ }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — shorthand for consuming the context
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
// ============================================================
//  src/utils/api.js — Axios API Client v2
//
//  Changes: attaches JWT from localStorage to every request
//  via a request interceptor. On 401, clears token so the
//  AuthContext can redirect to login.
// ============================================================

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://fintrack-server-gr6j.onrender.com/api"
    : "/api",
  timeout: 120000,
});

// ── Request interceptor — attach JWT ─────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fintrack_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor — handle global 401 ─────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("fintrack_token");
      localStorage.removeItem("fintrack_user");
      // Let the AuthContext / ProtectedRoute handle redirect
    }
    return Promise.reject(err);
  }
);

// ── Auth helpers ─────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) => api.post("/auth/reset-password", { token, password }),
};

// ── Upload helpers ────────────────────────────────────────────
export async function uploadStatement(file, onProgress) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post("/upload", formData, {
    onUploadProgress: (e) => {
      if (e.total) onProgress?.(Math.round((e.loaded * 100) / e.total));
    },
  });
  return response.data;
}

export async function getStatementHistory() {
  const res = await api.get("/upload/history");
  return res.data;
}

// ── Stats ─────────────────────────────────────────────────────
export async function getPublicStats() {
  try {
    const res = await api.get("/stats/public");
    return res.data;
  } catch {
    return { statementsAnalysed: 2000 };
  }
}

export async function checkHealth() {
  try {
    const res = await api.get("/health");
    return res.data.status === "ok";
  } catch { return false; }
}

export default api;
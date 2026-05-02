// ============================================================
//  src/App.jsx — Root Application v2
//
//  Now uses React Router for proper page navigation:
//    /                → LandingPage (public)
//    /login           → LoginPage
//    /register        → RegisterPage
//    /forgot-password → ForgotPasswordPage
//    /reset-password  → ResetPasswordPage
//    /dashboard       → DashboardApp (protected)
//    /subscribe       → SubscribePage (protected)
//
//  AuthProvider wraps everything so any component can
//  access the current user via useAuth().
// ============================================================

import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";

// Pages
import LandingPage         from "./pages/LandingPage.jsx";
import LoginPage           from "./pages/LoginPage.jsx";
import RegisterPage        from "./pages/RegisterPage.jsx";
import ForgotPasswordPage  from "./pages/ForgotPassword.jsx";
import ResetPasswordPage   from "./pages/ResetPasswordPage.jsx";
import SubscribePage       from "./pages/SubscribePage.jsx";

// Dashboard components (the existing app shell)
import Header          from "./components/dashboard/Header.jsx";
import UploadPage      from "./pages/UploadPage.jsx";
import DashboardPage   from "./pages/DashboardPage.jsx";

// ── Protected dashboard shell ─────────────────────────────────
// Manages the upload → dashboard state transition inside the
// protected area. Exists as a separate component so it can
// use its own local state independently of routing.
function DashboardApp() {
  const [data, setData] = useState(null);
  return (
    <div className="min-h-screen bg-slate-950 font-sans">
      <Header onReset={data ? () => setData(null) : null} hasData={!!data} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!data
          ? <UploadPage onSuccess={setData} />
          : <DashboardPage data={data} onReset={() => setData(null)} />
        }
      </main>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/"                element={<LandingPage />} />
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/register"        element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password"  element={<ResetPasswordPage />} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardApp /></ProtectedRoute>} />
          <Route path="/subscribe" element={<ProtectedRoute><SubscribePage /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
// src/components/dashboard/Header.jsx v2 — with auth context
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Header({ onReset, hasData }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/", { replace: true }); };

  const trialDaysLeft = user?.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(user.trialEndsAt) - Date.now()) / 86400000))
    : null;

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <span className="text-slate-950 font-bold text-sm font-mono">F</span>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              Fin<span className="text-emerald-400">Track</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {user?.subscriptionStatus === "trial" && trialDaysLeft !== null && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-amber-400 text-xs">{trialDaysLeft}d trial left</span>
              </div>
            )}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400 text-xs font-mono">AI Ready</span>
            </div>
            {hasData && onReset && (
              <button onClick={onReset} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-sm transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                New Statement
              </button>
            )}
            {user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} className="text-slate-500 hover:text-slate-300 text-xs transition-colors hidden sm:block">Sign out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
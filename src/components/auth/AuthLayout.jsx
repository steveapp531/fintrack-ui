// ============================================================
//  src/components/auth/AuthLayout.jsx — Shared Auth Page Shell
//
//  WHY: Login, Register, and Reset all share the same centered
//  card layout. One component handles the chrome so each page
//  only writes its form.
// ============================================================

import React from "react";
import { Link } from "react-router-dom";

/**
 * @param {string}    title     — heading inside the card
 * @param {string}    subtitle  — muted line under the heading
 * @param {ReactNode} children  — the form content
 */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
      {/* Background grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#34d399 1px,transparent 1px),linear-gradient(90deg,#34d399 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Brand mark at top */}
      <Link to="/" className="flex items-center gap-2 mb-8 z-10">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
          <span className="text-slate-950 font-bold text-sm font-mono">F</span>
        </div>
        <span className="text-white font-semibold text-lg">
          Fin<span className="text-emerald-400">Track</span>
        </span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md z-10 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        {/* Heading */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
          {subtitle && <p className="text-slate-400 text-sm">{subtitle}</p>}
        </div>

        {/* Form content injected here */}
        {children}
      </div>
    </div>
  );
}
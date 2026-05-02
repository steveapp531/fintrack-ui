// ============================================================
//  src/components/dashboard/RecommendationPanel.jsx
//
//  WHY: Presenting AI recommendations in a dedicated panel
//  gives the data narrative context. Status-driven colour
//  coding (healthy / warning / critical) lets users understand
//  their position at a glance before reading any numbers.
// ============================================================

import React, { useState } from "react";

/**
 * @param {Object} props
 * @param {Object} props.recommendation — { status, message, tips[] }
 */
export default function RecommendationPanel({ recommendation }) {
  const [expanded, setExpanded] = useState(true);

  if (!recommendation) return null;

  const { status, message, tips } = recommendation;

  // ── Status Config ──────────────────────────────────────────
  const statusConfig = {
    healthy: {
      label: "Financially Healthy",
      icon: "✓",
      border: "border-emerald-500/30",
      bg: "bg-emerald-500/5",
      iconBg: "bg-emerald-500/15 text-emerald-400",
      badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      dot: "bg-emerald-400",
    },
    warning: {
      label: "Needs Attention",
      icon: "⚠",
      border: "border-amber-500/30",
      bg: "bg-amber-500/5",
      iconBg: "bg-amber-500/15 text-amber-400",
      badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      dot: "bg-amber-400",
    },
    critical: {
      label: "Action Required",
      icon: "!",
      border: "border-red-500/30",
      bg: "bg-red-500/5",
      iconBg: "bg-red-500/15 text-red-400",
      badge: "bg-red-500/15 text-red-400 border-red-500/30",
      dot: "bg-red-400",
    },
  };

  const cfg = statusConfig[status] || statusConfig.warning;

  return (
    <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} overflow-hidden`}>
      {/* ── Header ─────────────────────────────────────────── */}
      <button
        className="w-full flex items-center justify-between p-5 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3">
          {/* Status icon */}
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center
                        font-bold text-sm ${cfg.iconBg}`}
          >
            {cfg.icon}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">
                Financial Health Report
              </span>
              {/* Status badge */}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium
                            border ${cfg.badge}`}
              >
                {cfg.label}
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">
              AI-generated recommendations based on your statement
            </p>
          </div>
        </div>

        {/* Expand/collapse chevron */}
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200
                      ${expanded ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* ── Expandable Content ─────────────────────────────── */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4">
          {/* Summary message */}
          <p className="text-slate-300 text-sm leading-relaxed border-t border-white/5 pt-4">
            {message}
          </p>

          {/* Tips list */}
          {tips && tips.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">
                Recommendations
              </p>
              {tips.map((tip, idx) => (
                <div key={idx} className="flex gap-3">
                  {/* Numbered indicator */}
                  <div
                    className={`w-5 h-5 rounded-full ${cfg.dot} opacity-70
                                flex-shrink-0 flex items-center justify-center
                                text-slate-950 text-xs font-bold mt-0.5`}
                  >
                    {idx + 1}
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
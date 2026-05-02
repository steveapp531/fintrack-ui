// ============================================================
//  src/components/charts/MonthlyTrendChart.jsx — Bar Chart
//
//  WHY: Recharts is React-native and works well with Tailwind.
//  We use a grouped bar chart (income vs expenses per month)
//  so the user can instantly see seasonality and cash-flow gaps.
//  ResponsiveContainer makes it fluid without a hardcoded width.
// ============================================================

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrencyCompact, formatCurrency } from "../../utils/formatters.js";

// ── Custom Tooltip ──────────────────────────────────────────
// Recharts' default tooltip is unstyled. This matches our dark theme.
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-2xl">
      <p className="text-slate-300 text-xs font-medium mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-xs mb-1">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-400 capitalize">{entry.name}:</span>
          <span className="font-financial text-white font-medium">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
      {/* Show profit/loss for the month in the tooltip */}
      {payload.length === 2 && (
        <div className="border-t border-slate-700 mt-2 pt-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Net:</span>
            <span
              className={`font-financial font-semibold ${
                payload[0].value - payload[1].value >= 0
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {formatCurrency(payload[0].value - payload[1].value)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * @param {Object}   props
 * @param {Array}    props.data — monthlyTrends from summary
 *   Each item: { month: "Mar 2024", income: 8000, expenses: 5500, profit: 2500 }
 */
export default function MonthlyTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        No monthly data available
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          barCategoryGap="30%"  // Space between month groups
          barGap={4}            // Space between income/expense bars
        >
          {/* ── Grid ──────────────────────────────────────── */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"       // slate-800
            vertical={false}       // Horizontal gridlines only — cleaner
          />

          {/* ── X Axis (months) ───────────────────────────── */}
          <XAxis
            dataKey="month"
            tick={{ fill: "#64748b", fontSize: 11, fontFamily: "DM Sans" }}
            axisLine={{ stroke: "#1e293b" }}
            tickLine={false}
          />

          {/* ── Y Axis (amounts) ──────────────────────────── */}
          <YAxis
            tickFormatter={formatCurrencyCompact}
            tick={{ fill: "#64748b", fontSize: 11, fontFamily: "IBM Plex Mono" }}
            axisLine={false}
            tickLine={false}
            width={60}
          />

          {/* ── Tooltip ───────────────────────────────────── */}
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />

          {/* ── Legend ────────────────────────────────────── */}
          <Legend
            wrapperStyle={{
              fontSize: "12px",
              color: "#94a3b8",
              paddingTop: "12px",
              fontFamily: "DM Sans",
            }}
          />

          {/* ── Bars ──────────────────────────────────────── */}
          {/* Income — emerald green */}
          <Bar
            dataKey="income"
            name="Income"
            fill="#34d399"        // emerald-400
            radius={[4, 4, 0, 0]} // Rounded top corners only
            maxBarSize={40}
          />

          {/* Expenses — muted red */}
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill="#f87171"        // red-400
            radius={[4, 4, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
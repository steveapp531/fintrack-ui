// ============================================================
//  src/pages/DashboardPage.jsx — Main Analytics Dashboard
//
//  WHY: DashboardPage is the composition layer. It receives the
//  full API response and distributes data to the right child
//  components. Keeping it as a "smart" container (data logic)
//  means the child components stay "dumb" (display only).
// ============================================================

import React from "react";
import KpiCard from "../components/dashboard/KpiCard.jsx";
import MonthlyTrendChart from "../components/charts/MonthlyTrendChart.jsx";
import RecommendationPanel from "../components/dashboard/RecomendationPanel.jsx";
import TransactionsTable from "../components/dashboard/TransactionsTable.jsx";
import { formatCurrency, formatPercent } from "../utils/formatters.js";

/**
 * @param {Object}   props
 * @param {Object}   props.data     — full API response
 * @param {Function} props.onReset  — navigates back to upload
 */
export default function DashboardPage({ data, onReset }) {
  const { transactions, summary, recommendation, filename } = data;
  const {
    totalIncome,
    totalExpenses,
    netProfit,
    profitMargin,
    transactionCount,
    monthlyTrends,
    categoryBreakdown,
  } = summary;

  return (
    <div className="space-y-6 pb-12">

      {/* ── Page Title Row ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Financial Dashboard</h2>
          <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-2">
            {/* File icon */}
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {filename} · {transactionCount} transactions analysed
          </p>
        </div>

        {/* Upload new statement shortcut */}
        <button
          onClick={onReset}
          className="self-start sm:self-auto px-4 py-2 rounded-xl
                     bg-emerald-500 hover:bg-emerald-400
                     text-slate-950 text-sm font-semibold
                     transition-all duration-150 shadow-lg shadow-emerald-500/20"
        >
          + New Statement
        </button>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Revenue"
          value={formatCurrency(totalIncome)}
          icon="💰"
          accent="emerald"
          sublabel="All income transactions"
        />
        <KpiCard
          label="Total Expenses"
          value={formatCurrency(totalExpenses)}
          icon="📉"
          accent="red"
          sublabel="All expense transactions"
        />
        <KpiCard
          label="Net Profit"
          value={formatCurrency(Math.abs(netProfit))}
          icon={netProfit >= 0 ? "📈" : "⚠️"}
          accent={netProfit >= 0 ? "emerald" : "red"}
          isPositive={netProfit >= 0}
          sublabel={netProfit >= 0 ? "Revenue surplus" : "Operating at a loss"}
        />
        <KpiCard
          label="Profit Margin"
          value={formatPercent(profitMargin)}
          icon="🎯"
          accent={profitMargin >= 20 ? "emerald" : profitMargin >= 5 ? "amber" : "red"}
          isPositive={profitMargin >= 0}
          sublabel="Net margin on revenue"
        />
      </div>

      {/* ── AI Recommendation ──────────────────────────────── */}
      <RecommendationPanel recommendation={recommendation} />

      {/* ── Monthly Trend Chart ─────────────────────────────── */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold">Monthly Cash Flow</h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Income vs expenses by month
            </p>
          </div>
          {/* Legend hint */}
          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block" />
              Income
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block" />
              Expenses
            </span>
          </div>
        </div>
        <MonthlyTrendChart data={monthlyTrends} />
      </div>

      {/* ── Category Breakdown + Transactions ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Category Breakdown — top 6 categories */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-1">Top Categories</h3>
          <p className="text-slate-500 text-xs mb-5">Spend by category</p>
          <div className="space-y-3">
            {categoryBreakdown.slice(0, 6).map((cat) => {
              // Calculate bar width as % of the largest category
              const max = categoryBreakdown[0]?.total || 1;
              const pct = Math.round((cat.total / max) * 100);

              return (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-400 text-xs truncate max-w-[140px]">
                      {cat.category}
                    </span>
                    <span
                      className={`font-financial text-xs font-medium ${
                        cat.type === "income" ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {formatCurrency(cat.total)}
                    </span>
                  </div>
                  {/* Proportional progress bar */}
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        cat.type === "income" ? "bg-emerald-500" : "bg-red-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary stats column */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-1">Statement Summary</h3>
          <p className="text-slate-500 text-xs mb-5">
            Breakdown of all AI-detected transactions
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Income Transactions",
                value: transactions.filter((t) => t.type === "income").length,
                color: "text-emerald-400",
              },
              {
                label: "Expense Transactions",
                value: transactions.filter((t) => t.type === "expense").length,
                color: "text-red-400",
              },
              {
                label: "Unique Categories",
                value: new Set(transactions.map((t) => t.category)).size,
                color: "text-blue-400",
              },
              {
                label: "Months Covered",
                value: monthlyTrends.length,
                color: "text-amber-400",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
              >
                <div className={`text-2xl font-bold font-financial ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-slate-500 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Full Transactions Table ─────────────────────────── */}
      <TransactionsTable transactions={transactions} />
    </div>
  );
}
// ============================================================
//  src/utils/formatters.js — Display Formatting Helpers
//
//  WHY: Keeping number/currency formatting logic here prevents
//  duplication across components and ensures consistency.
//  One change here updates every KPI card, table, and tooltip.
// ============================================================

/**
 * Formats a number as a currency string.
 * e.g. 12500.5 → "$12,500.50"
 *
 * @param {number} value
 * @param {string} currency — ISO 4217 currency code (default: USD)
 * @returns {string}
 */
export function formatCurrency(value, currency = "USD") {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats a number as a percentage string.
 * e.g. 23.7 → "23.7%"
 *
 * @param {number} value
 * @returns {string}
 */
export function formatPercent(value) {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return `${parseFloat(value).toFixed(1)}%`;
}

/**
 * Formats a large number with thousands separators.
 * e.g. 1234567 → "1,234,567"
 *
 * @param {number} value
 * @returns {string}
 */
export function formatNumber(value) {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US").format(value);
}

/**
 * Abbreviates large numbers for compact display in chart tooltips.
 * e.g. 1500000 → "$1.5M" | 45000 → "$45K"
 *
 * @param {number} value
 * @returns {string}
 */
export function formatCurrencyCompact(value) {
  if (!value && value !== 0) return "—";
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toFixed(0)}`;
}
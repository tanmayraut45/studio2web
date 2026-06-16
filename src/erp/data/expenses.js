// ============================================================================
// DUMMY SEED DATA — BUSINESS EXPENSES (Office / Marketing / Other)
// ============================================================================
// Seed for the operating-expense view in HR & Payroll. See
// src/erp/lib/storage.js for persistence.
//
// ----------------------------------------------------------------------------
// EXPENSE LINE — FIELD CONTRACT
//   label   string   line item label (e.g. "Rent", "Meta Ads")
//   amount  number   rupees, whole. No decimals, no separators.
//
// `officeExpenses`     — rent, electricity, water, stationary, internet, etc.
// `marketingExpenses`  — ad spend, influencer, print, photoshoots
// `otherExpenses`      — travel, software, professional fees, bank charges
// `expenseTotals`      — DERIVED. { office, marketing, other } sums.
// `expenseMonth`       — string label, e.g. "June 2026". Update monthly OR
//                        replace with a real period filter when wiring API.
//
// Employee salaries are NOT in this file — they come from team.js
// (payrollRun.net) and are added to the displayed total at the page level.
// ============================================================================

// Business expenses (operating costs). Categorised for HR / Finance views.
// Amounts are in INR (whole rupees).

export const officeExpenses = [];

export const marketingExpenses = [];

export const otherExpenses = [];

const sum = (rows) => rows.reduce((s, r) => s + r.amount, 0);

export const expenseTotals = {
  office: sum(officeExpenses),
  marketing: sum(marketingExpenses),
  other: sum(otherExpenses),
};

export const expenseMonth = "June 2026";

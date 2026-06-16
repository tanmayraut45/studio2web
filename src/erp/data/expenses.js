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

export const officeExpenses = [
  { label: "Rent", amount: 185000 },
  { label: "Electricity", amount: 42500 },
  { label: "Water", amount: 6800 },
  { label: "Stationary", amount: 14200 },
  { label: "Internet & Phone", amount: 18500 },
  { label: "Housekeeping", amount: 22000 },
];

export const marketingExpenses = [
  { label: "Meta Ads", amount: 95000 },
  { label: "Google Ads", amount: 68000 },
  { label: "Influencer Collaborations", amount: 45000 },
  { label: "Print & Brochures", amount: 28500 },
  { label: "Photoshoots", amount: 62000 },
];

export const otherExpenses = [
  { label: "Travel & Conveyance", amount: 38000 },
  { label: "Software Subscriptions", amount: 27500 },
  { label: "Professional Fees (CA/Legal)", amount: 35000 },
  { label: "Bank Charges", amount: 4200 },
  { label: "Miscellaneous", amount: 12000 },
];

const sum = (rows) => rows.reduce((s, r) => s + r.amount, 0);

export const expenseTotals = {
  office: sum(officeExpenses),
  marketing: sum(marketingExpenses),
  other: sum(otherExpenses),
};

export const expenseMonth = "June 2026";

// ============================================================================
// DUMMY SEED DATA — FINANCE (invoices, payments, ledger, cashflow, GST)
// ============================================================================
// Seeds for the GST module and dashboard cashflow widgets. See
// src/erp/lib/storage.js for the persistence contract.
//
// NOTE: the standalone /erp/finance page was removed in a prior iteration;
// these exports are still consumed by the dashboard and the GST page.
//
// ----------------------------------------------------------------------------
// INVOICE — FIELD CONTRACT
//   id       string
//   code     string   "INV-YYYY-NNN"
//   project  string   FK → projects.id
//   client   string   FK → clients.id
//   type     string   advance | milestone | retention | full
//   amount   number   pre-GST rupees
//   gst      number   GST component in rupees
//   issued   string   ISO date
//   due      string   ISO date
//   status   string   draft | sent | partially paid | paid | overdue
//
// PAYMENT — FK invoice → invoices.id
//   id        string
//   invoice   string
//   amount    number
//   method    string   bank | upi | cheque | cash
//   when      string   ISO date
//   reference string
//
// EXPENSE — line items charged to projects (vendor bills, materials, etc.)
//   id, project, vendor, category, amount, when, status
//   NOTE: distinct from src/erp/data/expenses.js which is OFFICE operating
//   expense; this file's `expenses` is per-project cost-of-delivery.
//
// CASHFLOW — monthly aggregate { month, inflow, outflow, net, projected }
// LEDGER — generic double-entry rows { id, date, account, debit, credit, ref }
// GST SUMMARY — { input, output, payable, period }
// GST RETURNS — filed-return records { id, period, type, status, filedOn }
// ============================================================================

// Finance & accounting — invoices, payments, expenses, ledger, GST. Linked to projects/clients.

export const invoices = [];

export const payments = [];

export const expenses = [];

// 8-month cash flow (Rs lakhs) — drives forecasting charts.
export const cashFlow = [];

export const ledger = [];

export const gstSummary = {
  period: "—",
  outputGst: 0,
  inputGst: 0,
  netPayable: 0,
  gstr1: "Pending",
  gstr3b: "Pending",
  tdsDeducted: 0,
};

export const gstReturns = [];

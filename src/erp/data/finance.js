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

export const invoices = [
  { id: "inv1", code: "INV-2026-031", client: "c1", project: "p1", type: "Milestone", amount: 4260000, gst: 766800, status: "Paid", issued: "2026-02-28", due: "2026-03-15" },
  { id: "inv2", code: "INV-2026-038", client: "c1", project: "p1", type: "Running", amount: 2130000, gst: 383400, status: "Partially Paid", issued: "2026-05-20", due: "2026-06-15" },
  { id: "inv3", code: "INV-2026-040", client: "c2", project: "p2", type: "Milestone", amount: 5700000, gst: 1026000, status: "Overdue", issued: "2026-04-30", due: "2026-05-30" },
  { id: "inv4", code: "INV-2026-044", client: "c3", project: "p3", type: "Milestone", amount: 3960000, gst: 712800, status: "Sent", issued: "2026-06-05", due: "2026-06-25" },
  { id: "inv5", code: "INV-2026-029", client: "c4", project: "p4", type: "Advance", amount: 8200000, gst: 1476000, status: "Paid", issued: "2025-12-05", due: "2025-12-20" },
  { id: "inv6", code: "INV-2026-046", client: "c5", project: "p5", type: "Advance", amount: 4680000, gst: 842400, status: "Paid", issued: "2026-02-15", due: "2026-03-01" },
];

export const payments = [
  { id: "pay1", invoice: "inv1", client: "c1", amount: 5026800, mode: "RTGS", date: "2026-03-12", status: "Cleared" },
  { id: "pay2", invoice: "inv2", client: "c1", amount: 1500000, mode: "NEFT", date: "2026-06-02", status: "Cleared" },
  { id: "pay3", invoice: "inv5", client: "c4", amount: 9676000, mode: "RTGS", date: "2025-12-18", status: "Cleared" },
  { id: "pay4", invoice: "inv6", client: "c5", amount: 5522400, mode: "Cheque", date: "2026-02-26", status: "Cleared" },
];

export const expenses = [
  { id: "ex1", project: "p1", category: "Material", vendor: "v1", amount: 960000, date: "2026-06-08", desc: "Statuario marble — PO-2026-014", costCenter: "Finishing" },
  { id: "ex2", project: "p2", category: "Labour", vendor: null, amount: 184000, date: "2026-06-07", desc: "Civil contractor weekly", costCenter: "Civil" },
  { id: "ex3", project: "p4", category: "Material", vendor: "v3", amount: 96000, date: "2026-06-06", desc: "LED profiles — PO-2026-018", costCenter: "Electrical" },
  { id: "ex4", project: "p3", category: "Transport", vendor: null, amount: 28500, date: "2026-06-06", desc: "Material movement Pune→Lonavala", costCenter: "Logistics" },
  { id: "ex5", project: "p1", category: "Labour", vendor: null, amount: 142000, date: "2026-06-05", desc: "Carpentry team", costCenter: "Carpentry" },
  { id: "ex6", project: "p2", category: "Material", vendor: "v7", amount: 79800, date: "2026-06-05", desc: "Toughened glass — PO-2026-015", costCenter: "Glass" },
  { id: "ex7", project: "p4", category: "Misc", vendor: null, amount: 41000, date: "2026-06-04", desc: "Site facilities & safety", costCenter: "Overheads" },
];

// 8-month cash flow (Rs lakhs) — drives forecasting charts.
export const cashFlow = [
  { month: "Nov", inflow: 92, outflow: 64, net: 28 },
  { month: "Dec", inflow: 138, outflow: 88, net: 50 },
  { month: "Jan", inflow: 76, outflow: 71, net: 5 },
  { month: "Feb", inflow: 124, outflow: 83, net: 41 },
  { month: "Mar", inflow: 158, outflow: 96, net: 62 },
  { month: "Apr", inflow: 88, outflow: 79, net: 9 },
  { month: "May", inflow: 142, outflow: 101, net: 41 },
  { month: "Jun", inflow: 64, outflow: 58, net: 6, projected: true },
];

export const ledger = [
  { id: "gl1", date: "2026-06-08", account: "Material Purchases", type: "Debit", amount: 960000, ref: "PO-2026-014" },
  { id: "gl2", date: "2026-06-02", account: "Client Receipts", type: "Credit", amount: 1500000, ref: "INV-2026-038" },
  { id: "gl3", date: "2026-06-07", account: "Labour Charges", type: "Debit", amount: 184000, ref: "EXP-2026-211" },
  { id: "gl4", date: "2026-03-12", account: "Client Receipts", type: "Credit", amount: 5026800, ref: "INV-2026-031" },
  { id: "gl5", date: "2026-06-06", account: "Transport", type: "Debit", amount: 28500, ref: "EXP-2026-208" },
];

export const gstSummary = {
  period: "May 2026",
  outputGst: 2884600,
  inputGst: 1346200,
  netPayable: 1538400,
  gstr1: "Filed",
  gstr3b: "Pending",
  tdsDeducted: 184000,
};

export const gstReturns = [
  { id: "g1", form: "GSTR-1", period: "Apr 2026", status: "Filed", value: 2410000, due: "2026-05-11" },
  { id: "g2", form: "GSTR-3B", period: "Apr 2026", status: "Filed", value: 1390000, due: "2026-05-20" },
  { id: "g3", form: "GSTR-1", period: "May 2026", status: "Filed", value: 2884600, due: "2026-06-11" },
  { id: "g4", form: "GSTR-3B", period: "May 2026", status: "Pending", value: 1538400, due: "2026-06-20" },
];

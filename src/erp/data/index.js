// Central data layer — re-exports + relational selectors + derived KPIs.
// The frontend reads ONLY from here (dummy data, no backend calls yet).

import { employees, departments, attendanceWeek, leaveRequests, payrollRun } from "./team";
import { clients } from "./clients";
import { vendors } from "./vendors";
import { materials, stockMovements, warehouses } from "./inventory";
import { projects, projectStages, milestones, tasks, taskStatuses, dailyReports, snags, checklistTemplates } from "./projects";
import { boqDocs, boqLines, boqTemplates } from "./boq";
import { purchaseRequests, purchaseOrders, rfqComparison } from "./procurement";
import { invoices, payments, expenses, cashFlow, ledger, gstSummary, gstReturns } from "./finance";
import { leads, leadStages, leadActivity, leadFunnel } from "./leads";
import { documents, designAssets, activityLog, automations, aiInsights } from "./documents";
import { officeExpenses, marketingExpenses, otherExpenses, expenseTotals, expenseMonth } from "./expenses";

export {
  employees, departments, attendanceWeek, leaveRequests, payrollRun,
  clients, vendors,
  materials, stockMovements, warehouses,
  projects, projectStages, milestones, tasks, taskStatuses, dailyReports, snags, checklistTemplates,
  boqDocs, boqLines, boqTemplates,
  purchaseRequests, purchaseOrders, rfqComparison,
  invoices, payments, expenses, cashFlow, ledger, gstSummary, gstReturns,
  leads, leadStages, leadActivity, leadFunnel,
  documents, designAssets, activityLog, automations, aiInsights,
  officeExpenses, marketingExpenses, otherExpenses, expenseTotals, expenseMonth,
};

/* ----------------------------- selectors ------------------------------- */
export const getClient = (id) => clients.find((c) => c.id === id);
export const getProject = (id) => projects.find((p) => p.id === id);
export const getEmployee = (id) => employees.find((e) => e.id === id);
export const getVendor = (id) => vendors.find((v) => v.id === id);
export const getMaterial = (id) => materials.find((m) => m.id === id);

export const clientName = (id) => getClient(id)?.company || getClient(id)?.name || "—";
export const projectName = (id) => getProject(id)?.name || "—";
export const employeeName = (id) => getEmployee(id)?.name || (id === "system" ? "Automation" : "—");
export const vendorName = (id) => getVendor(id)?.name || "—";
export const materialName = (id) => getMaterial(id)?.name || "—";

export const tasksForProject = (pid) => tasks.filter((t) => t.project === pid);
export const reportsForProject = (pid) => dailyReports.filter((r) => r.project === pid);
export const snagsForProject = (pid) => snags.filter((s) => s.project === pid);

const inr = (n) => n;

/* --------------------------- derived KPIs ------------------------------ */
const totalContractValue = projects.reduce((s, p) => s + (p.budget || 0), 0);
const totalActual = projects.reduce((s, p) => s + (p.actual || 0), 0);
const totalCommitted = projects.reduce((s, p) => s + (p.committed || 0), 0);
const portfolioMargin = totalContractValue
  ? projects.reduce((s, p) => s + (p.margin || 0) * (p.budget || 0), 0) / totalContractValue
  : 0;

const outstanding = invoices
  .filter((i) => i.status !== "Paid")
  .reduce((s, i) => s + (i.amount || 0) + (i.gst || 0), 0);

const collected = payments.reduce((s, p) => s + (p.amount || 0), 0);

const bestVendor = vendors.length ? [...vendors].sort((a, b) => b.rating - a.rating)[0] : null;
const bestEmployee = employees.length ? [...employees].sort((a, b) => b.productivity - a.productivity)[0] : null;

const delayedProjects = projects.filter(
  (p) => p.health === "delayed" || p.health === "at-risk"
);

const wonValue = leads.filter((l) => l.stage === "Won").reduce((s, l) => s + (l.value || 0), 0);
const pipelineValue = leads
  .filter((l) => !["Won", "Lost"].includes(l.stage))
  .reduce((s, l) => s + (l.value || 0), 0);
const wonOrLost = leads.filter((l) => ["Won", "Lost"].includes(l.stage)).length;
const conversionRate = wonOrLost
  ? Math.round((leads.filter((l) => l.stage === "Won").length / wonOrLost) * 100)
  : 0;

// "Where is money wasted" — overruns + damaged stock + wastage estimate
const damagedValue = materials.reduce((s, m) => s + ((m.damaged || 0) * (m.rate || 0)), 0);
const overrunProjects = projects.filter((p) => p.actual / Math.max(1, p.budget) > (p.progress / 100) + 0.1);

export const kpis = {
  totalContractValue,
  totalActual,
  totalCommitted,
  portfolioMargin: Math.round(portfolioMargin * 10) / 10,
  outstanding,
  collected,
  activeProjects: projects.length,
  onTrack: projects.filter((p) => p.health === "on-track").length,
  delayedCount: delayedProjects.length,
  bestVendor,
  bestEmployee,
  delayedProjects,
  overrunProjects,
  wonValue,
  pipelineValue,
  conversionRate,
  damagedValue,
  cashPosition: collected - totalActual,
  netForecast: cashFlow.length ? cashFlow[cashFlow.length - 1].net : 0,
  avgDealSize: Math.round(wonValue / Math.max(leads.filter((l) => l.stage === "Won").length, 1)),
};

// Profitability ranking — answers "which projects are profitable?"
export const projectProfitability = [...projects]
  .map((p) => ({
    ...p,
    profit: Math.round((p.budget || 0) * ((p.margin || 0) / 100)),
    spent: p.budget ? Math.round(((p.actual || 0) / p.budget) * 100) : 0,
  }))
  .sort((a, b) => (b.margin || 0) - (a.margin || 0));

export { inr };

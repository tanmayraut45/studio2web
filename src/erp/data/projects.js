// ============================================================================
// DUMMY SEED DATA — PROJECTS / SITE / TASKS
// ============================================================================
// Seed for the "projects" collection plus its child collections (milestones,
// tasks, dailyReports, snags, checklistTemplates). See src/erp/lib/storage.js
// for the persistence contract.
//
// ----------------------------------------------------------------------------
// PROJECT — FIELD CONTRACT
//   id          string  primary key (p1…p6)
//   code        string  project code "ST2-YYYY-NNN"
//   name        string  display name
//   client      string  FK → clients.id
//   location    string  "<Area>, <City>"
//   type        string  Residential | Commercial | Hospitality
//   manager     string  FK → employees.id (employee leading the project)
//   team        string[] FK array → employees.id
//   stage       string  one of `projectStages` (Design → Handover)
//   progress    number  0–100 percent complete
//   health      string  on-track | at-risk | delayed
//   budget      number  contract value in rupees
//   actual      number  rupees spent to date
//   committed   number  rupees obligated (POs etc.)
//   margin      number  expected margin %
//   start, due  string  ISO dates
//   cover       string  image path under /public
//   risk        string  Low | Medium | High
//
// `projectStages`  — ordered enum for project lifecycle
// `milestones`     — keyed by project. FK: milestone.project → project.id
// `tasks`          — work items. FK: task.project, task.assignee → employee.id
// `taskStatuses`   — ordered enum for task kanban columns
// `dailyReports`   — site reports. FK: report.project
// `snags`          — site issues. FK: snag.project
// `checklistTemplates` — reusable QC checklists
// ============================================================================

// Project backbone — the system's core. Links clients, team, budget, tasks, sites.

export const projectStages = [
  "Design", "BOQ", "Procurement", "Civil", "Electrical",
  "Plumbing", "Carpentry", "Paint", "Finishing", "Handover",
];

export const projects = [];

export const milestones = [];

// Task system — assigned to employees, linked to projects + stages.
export const tasks = [];

export const taskStatuses = ["To Do", "In Progress", "Blocked", "Done"];

// Daily site reports — mobile-first capture by site engineers.
export const dailyReports = [];

// Snag / defect tracking.
export const snags = [];

export const checklistTemplates = [];

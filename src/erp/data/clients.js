// ============================================================================
// DUMMY SEED DATA — CLIENTS
// ============================================================================
// Seed for the "clients" collection. See src/erp/lib/storage.js for the
// persistence contract and the migration-to-API path documented in
// src/erp/data/leads.js (the same applies here — only the storage layer
// changes when switching to a real backend).
//
// ----------------------------------------------------------------------------
// FIELD CONTRACT — each client:
//   id             string   primary key (c1…c6 in seed)
//   name           string   primary contact full name
//   company        string   business name (or "Private Residence")
//   type           string   Residential | Commercial | Hospitality
//   initials       string   2-letter avatar fallback
//   email          string
//   phone          string   E.164-ish
//   gst            string   GSTIN if commercial, "—" if individual
//   pan            string
//   billing        string   billing address
//   site           string   site / project location
//   since          string   ISO date the relationship started
//   decisionMaker  string   primary decision maker name + role
//   budgetFlex     string   Low | Medium | High — flexibility on cost
//   rating         number   1–5 stars (internal qualitative score)
//   style          string   preferred design style
//   lifetimeValue  number   total billed rupees across all projects
//   projects       string[] FK array → src/erp/data/projects.js (project.id)
//   status         string   Active | Inactive | Archived
// ============================================================================

// Client master — central client intelligence. Linked to projects, invoices, leads.

export const clients = [];

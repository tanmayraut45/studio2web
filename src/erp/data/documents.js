// ============================================================================
// DUMMY SEED DATA — DOCUMENTS / DESIGN ASSETS / ACTIVITY / AUTOMATIONS / AI
// ============================================================================
// This file seeds several loosely-related collections. See src/erp/lib/
// storage.js for the persistence contract.
//
// ----------------------------------------------------------------------------
// DOCUMENT — FIELD CONTRACT
//   id        string   primary key
//   name      string   filename / title
//   type      string   PDF | DWG | XLSX | image | …
//   project   string   FK → projects.id (or null if cross-project)
//   uploadedBy string  FK → employees.id
//   uploadedAt string  ISO date
//   size      number   bytes
//   revision  string   "R1" | "R2" | … version label
//   status    string   draft | in-review | locked | final
//   url       string   storage URL (in dummy data this is just a path)
//
// DESIGN ASSET — FIELD CONTRACT
//   id     string
//   project string  FK → projects.id
//   type   string   mood-board | 2d-drawing | 3d-render | sample | spec
//   title  string
//   thumb  string   thumbnail path
//   stage  string   Draft | Submitted | Revision | Approved
//   sentTo string   FK → clients.id (or "internal")
//
// ACTIVITY LOG — global cross-module audit feed
//   id     string
//   actor  string   FK → employees.id | clients.id | "system"
//   action string   short verb phrase
//   target string   what was acted on (free text)
//   time   string   relative time ("2h ago") — replace with timestamp when
//                   wiring to a real backend
//   module string   which area emitted the event (CRM, Site, Finance, …)
//
// AUTOMATION — rule definition (read-only seed for the Automation module)
//   id      string
//   name    string
//   trigger string   event that fires the rule
//   action  string   what happens
//   active  boolean
//
// AI INSIGHT — pre-computed insight cards
//   id         string
//   title      string
//   body       string   one-sentence summary
//   module     string   which module the insight relates to
//   confidence number   0–100
// ============================================================================

// Document management + design assets. Versioned, linked to projects.

export const documents = [];

export const designAssets = [];

// System-wide activity / audit trail.
export const activityLog = [];

export const automations = [];

// AI engine — generated insights surfaced across the platform.
export const aiInsights = [];

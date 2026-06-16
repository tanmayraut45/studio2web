// ============================================================================
// DUMMY SEED DATA — LEADS / CRM PIPELINE
// ============================================================================
// This file is a FIRST-RUN seed for the "leads" collection in localStorage
// (see src/erp/lib/storage.js + src/erp/stores/useLeadsStore.js).
// After hydration, the runtime source of truth is the Zustand store, not
// this array. Editing this file only affects fresh browsers / a manual reset.
//
// ----------------------------------------------------------------------------
// MIGRATION TO A REAL API (future):
//   1. Edit src/erp/lib/storage.js — replace the localStorage internals
//      with fetch() calls against your /api/leads endpoints (GET / POST /
//      PATCH / DELETE). Keep the createCollection() interface identical.
//   2. Leave this file untouched, or delete it once the backend is the
//      single source of truth. Other code paths do not import these arrays
//      directly anymore — they read from the store.
//
// ----------------------------------------------------------------------------
// FIELD CONTRACT — each lead in the `leads` array:
//   id           string  primary key. Seed uses "l1"…"l10". API may use uuid.
//   name         string  full name of the lead
//   phone        string  E.164-ish, e.g. "+91 98765 30001"
//   email        string  primary contact email
//   location     string  "<Area>, <City>"
//   budget       number  rupees (whole — no decimals, no separators)
//   propertyType string  "3BHK Apartment", "Villa", "Office 4000 sqft", …
//   requirement  string  what they need ("Full Interior", "Turnkey", …)
//   source       string  one of: Instagram | Referral | Website | Meta Ads |
//                        WhatsApp | Google Ads
//   style        string  preferred design style
//   timeline     string  human readable, e.g. "3 months"
//   stage        string  one of `leadStages` below
//   score        number  lead quality 0–100; >= 80 is "hot"
//   owner        string  employee id (e1, e2, …) → src/erp/data/team.js
//   lastTouch    string  ISO date of last interaction (YYYY-MM-DD)
//   value        number  estimated deal value in rupees
//   lostReason   string  OPTIONAL — only present when stage === "Lost"
//
// `leadStages` — ordered enum used by the kanban board.
// `leadActivity` — recent touches per lead. FK: activity.lead -> lead.id
// `leadFunnel`   — aggregated counts per stage (used by dashboard).
// ============================================================================

// CRM leads + pipeline. Sources, scoring, conversion. Won leads become clients.

export const leadStages = [
  "New", "Contacted", "Meeting Scheduled", "Proposal Sent",
  "Negotiation", "Won", "Lost", "On Hold",
];

export const leads = [];

export const leadActivity = [];

export const leadFunnel = [];

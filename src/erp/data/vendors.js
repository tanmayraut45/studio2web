// ============================================================================
// DUMMY SEED DATA — VENDORS / SUPPLIERS
// ============================================================================
// Seed for the vendor master. See src/erp/lib/storage.js for the persistence
// contract.
//
// NOTE: the /erp/procurement and /erp/boq pages were removed in a prior
// iteration; vendors are still referenced by inventory.js (material.supplier)
// and the dashboard.
//
// ----------------------------------------------------------------------------
// VENDOR — FIELD CONTRACT
//   id         string  primary key (v1…)
//   name       string  business name
//   initials   string  avatar fallback
//   category   string  Civil | Carpentry | Electrical | Tiles | Veneer | …
//   gst        string  GSTIN
//   pan        string
//   contact    string  primary contact name
//   phone, email string
//   location   string  city
//   rating     number  1–5 stars
//   onTime     number  on-time delivery % (0–100)
//   rejection  number  % units rejected (0–100, lower is better)
//   paymentTerms string  "Net 30" | "Advance 50%" | …
//   since      string  ISO date relationship started
//   status     string  preferred | active | inactive | blacklisted
// ============================================================================

// Vendor master + performance scorecards. Linked to materials, purchase orders.

export const vendors = [];

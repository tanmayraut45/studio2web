// ============================================================================
// ORPHAN SEED DATA — BOQ & ESTIMATION
// ============================================================================
// The /erp/boq page was removed in a prior iteration (commit 5f7b41d).
// This data has NO current consumers. It is retained because:
//   - re-exports in src/erp/data/index.js still reference these names
//   - the BOQ module may be reintroduced as a Phase-2 feature
//
// If you decide to permanently drop the BOQ module:
//   1. Delete this file.
//   2. Remove `boqDocs, boqLines, boqTemplates` from the import / re-export
//      in src/erp/data/index.js.
//
// FIELD CONTRACT — preserved for future use:
//   BOQ DOC: { id, code, project, client, version, status, total, gstTotal,
//              createdBy, createdAt, lines: number }
//   BOQ LINE: { id, boq, category, item, uom, qty, rate, amount, vendor? }
//   BOQ TEMPLATE: { id, name, category, lines[] } — reusable line bundles
// ============================================================================

// BOQ & Estimation — versioned, area-wise, linked to projects + materials + vendors.

export const boqDocs = [];

export const boqLines = [];

export const boqTemplates = [];

// ============================================================================
// ORPHAN SEED DATA — PROCUREMENT / RFQ / PURCHASE ORDERS
// ============================================================================
// The /erp/procurement page was removed in a prior iteration (commit 5f7b41d).
// This data has NO current consumers. It is retained because:
//   - re-exports in src/erp/data/index.js still reference these names
//   - the Procurement module may be reintroduced as a Phase-2 feature
//
// If you decide to permanently drop the Procurement module:
//   1. Delete this file.
//   2. Remove `purchaseRequests, purchaseOrders, rfqComparison` from the
//      import / re-export in src/erp/data/index.js.
//
// FIELD CONTRACT — preserved for future use:
//   PURCHASE REQUEST: { id, code, project, material, qty, urgency, status,
//                       raisedBy, raisedAt }
//   PURCHASE ORDER:   { id, code, vendor, project, items: [{material, qty,
//                       rate}], total, status, eta, raisedBy, raisedAt }
//   RFQ COMPARISON:   { id, material, qty, project, vendorQuotes: [{vendor,
//                       rate, leadTime, terms, score}], chosen }
// ============================================================================

// Procurement workflow — PR -> RFQ -> PO -> GRN. Linked to projects, vendors, materials.

export const purchaseRequests = [];

export const purchaseOrders = [];

export const rfqComparison = {};

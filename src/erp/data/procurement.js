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

export const purchaseRequests = [
  { id: "pr1", project: "p4", item: "Linear LED Profile 24V", material: "m4", qty: 300, neededBy: "2026-06-14", raisedBy: "e7", status: "Approved", priority: "Urgent" },
  { id: "pr2", project: "p2", item: "Toughened Glass 12mm", material: "m11", qty: 380, neededBy: "2026-06-20", raisedBy: "e4", status: "RFQ Sent", priority: "High" },
  { id: "pr3", project: "p1", item: "Teak Veneer Ply 19mm", material: "m2", qty: 30, neededBy: "2026-06-18", raisedBy: "e8", status: "Pending", priority: "Medium" },
  { id: "pr4", project: "p5", item: "Designer Pendant Light", material: "m5", qty: 12, neededBy: "2026-07-01", raisedBy: "e8", status: "Pending", priority: "Low" },
];

export const purchaseOrders = [
  { id: "po1", code: "PO-2026-014", vendor: "v1", project: "p1", value: 960000, items: 1, status: "Delivered", grn: true, ordered: "2026-05-28", eta: "2026-06-08", payment: "Paid" },
  { id: "po2", code: "PO-2026-012", vendor: "v2", project: "p1", value: 126000, items: 2, status: "Delivered", grn: true, ordered: "2026-05-30", eta: "2026-06-06", payment: "Net 30" },
  { id: "po3", code: "PO-2026-015", vendor: "v7", project: "p2", value: 79800, items: 1, status: "Delivered", grn: true, ordered: "2026-06-01", eta: "2026-06-05", payment: "Net 30" },
  { id: "po4", code: "PO-2026-018", vendor: "v3", project: "p4", value: 96000, items: 1, status: "In Transit", grn: false, ordered: "2026-06-06", eta: "2026-06-11", payment: "Net 30" },
  { id: "po5", code: "PO-2026-019", vendor: "v5", project: "p3", value: 53200, items: 2, status: "Confirmed", grn: false, ordered: "2026-06-07", eta: "2026-06-13", payment: "Net 30" },
  { id: "po6", code: "PO-2026-020", vendor: "v4", project: "p2", value: 199200, items: 1, status: "Pending Approval", grn: false, ordered: "2026-06-08", eta: "2026-06-18", payment: "Net 21" },
];

// RFQ comparison for the glass requirement (pr2) across vendors.
export const rfqComparison = {
  request: "pr2",
  item: "Toughened Glass 12mm — 380 sq.ft",
  quotes: [
    { vendor: "v7", price: 79800, perUnit: 210, delivery: "5 days", quality: 90, credit: "Net 30", recommended: true },
    { vendor: "v6", price: 76000, perUnit: 200, delivery: "9 days", quality: 84, credit: "Net 15", recommended: false },
    { vendor: "v1", price: 83600, perUnit: 220, delivery: "4 days", quality: 95, credit: "Net 45", recommended: false },
  ],
};

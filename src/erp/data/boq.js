// BOQ & Estimation — versioned, area-wise, linked to projects + materials + vendors.

export const boqDocs = [
  { id: "b1", project: "p1", title: "Malhotra Residence — Interior BOQ", version: "v4", status: "Approved", locked: true, total: 13860000, margin: 22.4, revisions: 4, updated: "2026-01-12", approvedBy: "c1" },
  { id: "b2", project: "p2", title: "Vertex Office — Fit-out BOQ", version: "v3", status: "Under Review", locked: false, total: 27940000, margin: 14.8, revisions: 3, updated: "2026-06-08", approvedBy: null },
  { id: "b3", project: "p3", title: "Serenity Villa — Interior BOQ", version: "v5", status: "Approved", locked: true, total: 19320000, margin: 26.1, revisions: 5, updated: "2025-08-04", approvedBy: "c3" },
  { id: "b4", project: "p4", title: "Coastal Retreat — Civil + Interior", version: "v2", status: "Approved", locked: true, total: 40100000, margin: 18.2, revisions: 2, updated: "2026-01-28", approvedBy: "c4" },
  { id: "b5", project: "p5", title: "Skyline Penthouse — Concept BOQ", version: "v1", status: "Draft", locked: false, total: 22680000, margin: 28.9, revisions: 1, updated: "2026-06-02", approvedBy: null },
  { id: "b6", project: "p6", title: "Greenfield Centre — Concept BOQ", version: "v1", status: "Draft", locked: false, total: 9180000, margin: 16.5, revisions: 1, updated: "2026-06-05", approvedBy: null },
];

// Example line items for the active Vertex BOQ (b2) — area-wise.
export const boqLines = [
  { id: "bl1", boq: "b2", area: "Reception", item: "RCC civil works", unit: "sq.ft", qty: 1200, rate: 1850, material: "m10", category: "Civil" },
  { id: "bl2", boq: "b2", area: "Reception", item: "Toughened glass partition", unit: "sq.ft", qty: 380, rate: 540, material: "m11", category: "Glass" },
  { id: "bl3", boq: "b2", area: "Workspace", item: "Teak veneer panelling", unit: "sq.ft", qty: 920, rate: 720, material: "m2", category: "Carpentry" },
  { id: "bl4", boq: "b2", area: "Workspace", item: "Linear LED profile lighting", unit: "mtr", qty: 460, rate: 520, material: "m4", category: "Electrical" },
  { id: "bl5", boq: "b2", area: "Cabins", item: "Premium emulsion finish", unit: "sq.ft", qty: 2400, rate: 64, material: "m8", category: "Paint" },
  { id: "bl6", boq: "b2", area: "Washrooms", item: "Wall-hung WC + fittings", unit: "nos", qty: 8, rate: 24900, material: "m6", category: "Plumbing" },
  { id: "bl7", boq: "b2", area: "Pantry", item: "MS framework fabrication", unit: "kg", qty: 640, rate: 142, material: "m10", category: "Metal" },
];

export const boqTemplates = [
  { id: "tpl1", name: "2BHK Premium Interior", areas: 7, items: 142, avgValue: 4200000 },
  { id: "tpl2", name: "Corporate Office (per floor)", areas: 9, items: 218, avgValue: 9800000 },
  { id: "tpl3", name: "Luxury Villa Turnkey", areas: 14, items: 386, avgValue: 18500000 },
  { id: "tpl4", name: "Boutique Hospitality Room", areas: 5, items: 96, avgValue: 1450000 },
];

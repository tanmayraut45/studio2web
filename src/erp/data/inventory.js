// Materials + multi-location inventory. Linked to vendors, BOQ, procurement, sites.

export const materials = [
  { id: "m1", name: "Statuario Italian Marble", sku: "MRB-STA-18", unit: "sq.ft", vendor: "v1", rate: 480, hsn: "2515", reorder: 400, warehouse: 320, site: 180, transit: 200, reserved: 150, damaged: 8, category: "Stone" },
  { id: "m2", name: "Teak Veneer Ply 19mm", sku: "PLY-TVN-19", unit: "sheet", vendor: "v2", rate: 4200, hsn: "4412", reorder: 60, warehouse: 88, site: 24, transit: 30, reserved: 18, damaged: 2, category: "Wood" },
  { id: "m3", name: "Marine Ply 18mm", sku: "PLY-MAR-18", unit: "sheet", vendor: "v2", rate: 3100, hsn: "4412", reorder: 80, warehouse: 145, site: 40, transit: 0, reserved: 35, damaged: 4, category: "Wood" },
  { id: "m4", name: "Linear LED Profile 24V", sku: "LGT-LED-24", unit: "mtr", vendor: "v3", rate: 320, hsn: "9405", reorder: 300, warehouse: 210, site: 120, transit: 150, reserved: 90, damaged: 6, category: "Lighting" },
  { id: "m5", name: "Designer Pendant Light", sku: "LGT-PND-09", unit: "nos", vendor: "v3", rate: 8500, hsn: "9405", reorder: 20, warehouse: 14, site: 6, transit: 12, reserved: 8, damaged: 1, category: "Lighting" },
  { id: "m6", name: "Wall-hung WC (Premium)", sku: "SAN-WC-07", unit: "nos", vendor: "v4", rate: 18500, hsn: "6910", reorder: 12, warehouse: 9, site: 4, transit: 6, reserved: 5, damaged: 0, category: "Sanitary" },
  { id: "m7", name: "Single-lever Basin Mixer", sku: "SAN-MIX-03", unit: "nos", vendor: "v4", rate: 6400, hsn: "8481", reorder: 25, warehouse: 31, site: 10, transit: 0, reserved: 12, damaged: 1, category: "Sanitary" },
  { id: "m8", name: "Premium Emulsion (Pearl)", sku: "PNT-EML-20", unit: "ltr", vendor: "v5", rate: 380, hsn: "3209", reorder: 200, warehouse: 260, site: 90, transit: 80, reserved: 70, damaged: 0, category: "Paint" },
  { id: "m9", name: "PU Matte Lacquer", sku: "PNT-PU-05", unit: "ltr", vendor: "v5", rate: 620, hsn: "3208", reorder: 80, warehouse: 64, site: 30, transit: 0, reserved: 22, damaged: 2, category: "Paint" },
  { id: "m10", name: "MS Section 50x50", sku: "MTL-MS-50", unit: "kg", vendor: "v6", rate: 78, hsn: "7308", reorder: 1500, warehouse: 1180, site: 600, transit: 0, reserved: 420, damaged: 30, category: "Metal" },
  { id: "m11", name: "Toughened Glass 12mm", sku: "GLS-TGH-12", unit: "sq.ft", vendor: "v7", rate: 210, hsn: "7007", reorder: 500, warehouse: 380, site: 220, transit: 300, reserved: 180, damaged: 12, category: "Glass" },
  { id: "m12", name: "Upholstery Fabric (Linen)", sku: "FAB-LIN-11", unit: "mtr", vendor: "v8", rate: 950, hsn: "5309", reorder: 150, warehouse: 96, site: 40, transit: 60, reserved: 50, damaged: 3, category: "Fabric" },
];

export const stockMovements = [
  { id: "sm1", material: "m1", type: "Inward", qty: 200, ref: "PO-2026-014", location: "Warehouse A", date: "2026-06-08", by: "e6" },
  { id: "sm2", material: "m4", type: "Transfer", qty: 120, ref: "TRF-0091", location: "Warehouse A → Koregaon Site", date: "2026-06-08", by: "e5" },
  { id: "sm3", material: "m8", type: "Consumption", qty: 60, ref: "Koregaon Park", location: "Koregaon Site", date: "2026-06-07", by: "e5" },
  { id: "sm4", material: "m2", type: "Inward", qty: 30, ref: "PO-2026-012", location: "Warehouse A", date: "2026-06-06", by: "e6" },
  { id: "sm5", material: "m10", type: "Consumption", qty: 220, ref: "Vertex Office", location: "BKC Site", date: "2026-06-06", by: "e7" },
  { id: "sm6", material: "m11", type: "Inward", qty: 300, ref: "PO-2026-015", location: "Warehouse B", date: "2026-06-05", by: "e6" },
  { id: "sm7", material: "m5", type: "Return", qty: 2, ref: "RET-0033", location: "Warehouse A", date: "2026-06-04", by: "e6" },
];

export const warehouses = [
  { id: "wh1", name: "Warehouse A — Pune", utilization: 78, items: 184, value: 6840000 },
  { id: "wh2", name: "Warehouse B — Mumbai", utilization: 64, items: 122, value: 4120000 },
  { id: "wh3", name: "Site Stores (combined)", utilization: 52, items: 96, value: 2380000 },
];

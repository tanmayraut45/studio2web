// ============================================================================
// DUMMY SEED DATA — INVENTORY (materials, stock movements, warehouses)
// ============================================================================
// Seed for the Inventory module. See src/erp/lib/storage.js for the
// persistence contract.
//
// ----------------------------------------------------------------------------
// MATERIAL — FIELD CONTRACT
//   id          string  primary key
//   name        string  display name
//   sku         string  internal SKU code
//   category    string  Tiles | Veneer | Hardware | Paint | …
//   uom         string  unit of measure: sqft | piece | kg | litre | …
//   rate        number  rupees per UOM
//   onHand      number  current quantity in stock
//   reorder     number  reorder threshold
//   damaged     number  damaged quantity (subtracted from sellable)
//   warehouse   string  FK → warehouses.id
//   supplier    string  FK → vendors.id (preferred supplier)
//
// STOCK MOVEMENT — every in/out of stock
//   id       string
//   material string  FK → materials.id
//   type     string  inward | outward | transfer | adjustment | damage
//   qty      number  positive = added, negative = removed
//   when     string  ISO date-time
//   ref      string  PO number / project code / damage report id
//   by       string  FK → employees.id
//
// WAREHOUSE
//   id        string   primary key
//   name      string
//   location  string   address
//   capacity  number   % occupied (0–100)
//   items     number   count of distinct SKUs stored here
// ============================================================================

// Materials + multi-location inventory. Linked to vendors, BOQ, procurement, sites.

export const materials = [];

export const stockMovements = [];

export const warehouses = [];

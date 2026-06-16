"use client";

/*
 * Warehouses store — CRUD source of truth for the Inventory module's
 * warehouse list. Backed by `createCollection("warehouses", …)` (see
 * src/erp/lib/storage.js), seeded once per browser from
 * src/erp/data/inventory.js. Swapping to a real API only requires editing
 * storage.js — this store and its consumers stay identical.
 */

import { create } from "zustand";
import { createCollection } from "@/erp/lib/storage";
import { warehouses as warehousesSeed } from "@/erp/data/inventory";

const Warehouses = createCollection("warehouses", warehousesSeed);

export const useWarehousesStore = create((set, get) => ({
  warehouses: warehousesSeed,
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;
    const items = await Warehouses.list();
    set({ warehouses: items, hydrated: true });
    Warehouses.subscribe((next) => set({ warehouses: next }));
  },

  async addWarehouse(input) {
    return await Warehouses.create(input);
  },

  async updateWarehouse(id, patch) {
    return await Warehouses.update(id, patch);
  },

  async removeWarehouse(id) {
    return await Warehouses.remove(id);
  },
}));

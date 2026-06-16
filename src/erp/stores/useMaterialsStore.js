"use client";

/*
 * Materials store — CRUD source of truth for the Inventory module.
 *
 * Backed by `createCollection("materials", …)` (see src/erp/lib/storage.js),
 * which today persists to window.localStorage under key
 * "studio2-erp:materials" and is seeded once per browser from
 * src/erp/data/inventory.js. Swapping to a real API only requires editing
 * storage.js — this store and its consumers stay identical.
 *
 * Stock movements live in a sibling store (useStockMovementsStore) — this
 * file is concerned only with the material master records.
 */

import { create } from "zustand";
import { createCollection } from "@/erp/lib/storage";
import { materials as materialsSeed } from "@/erp/data/inventory";

const Materials = createCollection("materials", materialsSeed);

export const useMaterialsStore = create((set, get) => ({
  materials: materialsSeed,
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;
    const items = await Materials.list();
    set({ materials: items, hydrated: true });
    Materials.subscribe((next) => set({ materials: next }));
  },

  async addMaterial(input) {
    const created = await Materials.create(input);
    return created;
  },

  async updateMaterial(id, patch) {
    const updated = await Materials.update(id, patch);
    return updated;
  },

  async removeMaterial(id) {
    await Materials.remove(id);
  },

  async resetDemo() {
    await Materials.reset();
  },
}));

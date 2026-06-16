"use client";

/*
 * Stock movements store — append-only log of inward / outward / transfer /
 * adjustment / damage events against materials. Movements are immutable
 * once logged (no edit) — the only mutations exposed are `logMovement`
 * (create) and `removeMovement` (admin cleanup).
 *
 * Backed by `createCollection("stock-movements", …)` (see
 * src/erp/lib/storage.js), which persists to window.localStorage under key
 * "studio2-erp:stock-movements" and is seeded from src/erp/data/inventory.js.
 *
 * Field contract (matches seed in src/erp/data/inventory.js):
 *   id        string
 *   material  string  FK → materials.id
 *   type      string  inward | outward | transfer | adjustment | damage
 *                     (legacy seed rows use TitleCase: Inward, Transfer, …)
 *   qty       number  signed — positive = added, negative = removed
 *   date      string  ISO date / date-time
 *   ref       string  PO number / project code / damage report id
 *   by        string  FK → employees.id
 *   location  string  optional human-readable location label (legacy seed)
 */

import { create } from "zustand";
import { createCollection } from "@/erp/lib/storage";
import { stockMovements as movementsSeed } from "@/erp/data/inventory";

const Movs = createCollection("stock-movements", movementsSeed);

export const useStockMovementsStore = create((set, get) => ({
  movements: movementsSeed,
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;
    const items = await Movs.list();
    set({ movements: items, hydrated: true });
    Movs.subscribe((next) => set({ movements: next }));
  },

  async logMovement(input) {
    return await Movs.create(input);
  },

  async removeMovement(id) {
    return await Movs.remove(id);
  },

  async resetDemo() {
    await Movs.reset();
  },
}));

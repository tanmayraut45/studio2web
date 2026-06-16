"use client";

/*
 * useExpensesStore — Business expense CRUD for HR & Payroll.
 *
 * Three independent collections (office / marketing / other), each backed by
 * its own localStorage key via `createCollection` so they're independently
 * mutable from the HR page UI.
 *
 * Seed quirk:
 *   The seed items in `src/erp/data/expenses.js` are `{ label, amount }` — no
 *   `id` fields. The storage layer assigns ids only on `create()`. To support
 *   editing and deleting seed lines, `hydrate()` does a one-time normalization
 *   the FIRST time it sees a collection with id-less items: it resets the
 *   collection and re-creates each item, which assigns and persists ids. From
 *   that point onward every line has a stable id.
 */

import { create } from "zustand";
import { createCollection } from "@/erp/lib/storage";
import {
  officeExpenses as officeSeed,
  marketingExpenses as marketingSeed,
  otherExpenses as otherSeed,
} from "@/erp/data/expenses";

const Office = createCollection("expenses-office", officeSeed);
const Marketing = createCollection("expenses-marketing", marketingSeed);
const Other = createCollection("expenses-other", otherSeed);

const COLS = { office: Office, marketing: Marketing, other: Other };

export const useExpensesStore = create((set, get) => ({
  office: officeSeed,
  marketing: marketingSeed,
  other: otherSeed,
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;

    // Pass 1: normalize legacy seed items (no `id`) into id'd records that
    // persist in localStorage. After this, every line has a stable id and
    // edit/remove work uniformly.
    for (const [name, col] of Object.entries(COLS)) {
      const items = await col.list();
      if (items.some((it) => !it.id)) {
        await col.reset();
        for (const it of items) {
          await col.create(it); // create() auto-assigns id
        }
      }
      const fresh = await col.list();
      set({ [name]: fresh });
    }

    set({ hydrated: true });

    // Pass 2: subscribe so the store stays in sync with any future mutations.
    for (const [name, col] of Object.entries(COLS)) {
      col.subscribe((next) => set({ [name]: next }));
    }
  },

  async addLine(category, input) {
    const col = COLS[category];
    if (!col) return null;
    const payload = {
      label: String(input?.label ?? "").trim(),
      amount: Number(input?.amount) || 0,
    };
    return await col.create(payload);
  },

  async updateLine(category, id, patch) {
    const col = COLS[category];
    if (!col || !id) return null;
    const clean = {
      ...(patch?.label !== undefined ? { label: String(patch.label).trim() } : {}),
      ...(patch?.amount !== undefined ? { amount: Number(patch.amount) || 0 } : {}),
    };
    return await col.update(id, clean);
  },

  async removeLine(category, id) {
    const col = COLS[category];
    if (!col || !id) return false;
    return await col.remove(id);
  },

  async resetCategory(category) {
    const col = COLS[category];
    if (!col) return;
    await col.reset();
  },
}));

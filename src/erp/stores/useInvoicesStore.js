"use client";

/*
 * Invoices store — CRUD for finance invoices used by the GST page.
 *
 * Source of truth: `useInvoicesStore` (Zustand) backed by
 * `createCollection("invoices", …)` from `src/erp/lib/storage.js`. Today
 * this persists to window.localStorage under key "studio2-erp:invoices";
 * swapping to a real API only requires editing storage.js — pages and
 * stores stay identical. The seed in `src/erp/data/finance.js` is used
 * once per browser (first-run hydration) and on `resetDemo()`.
 */

import { create } from "zustand";
import { createCollection } from "@/erp/lib/storage";
import { invoices as invoicesSeed } from "@/erp/data/finance";

const Invoices = createCollection("invoices", invoicesSeed);

export const useInvoicesStore = create((set, get) => ({
  invoices: invoicesSeed,
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;
    const items = await Invoices.list();
    set({ invoices: items, hydrated: true });

    Invoices.subscribe((next) => set({ invoices: next }));
  },

  async addInvoice(input) {
    const created = await Invoices.create(input);
    return created;
  },

  async updateInvoice(id, patch) {
    const updated = await Invoices.update(id, patch);
    return updated;
  },

  async markPaid(id) {
    const updated = await Invoices.update(id, { status: "Paid" });
    return updated;
  },

  async removeInvoice(id) {
    await Invoices.remove(id);
  },

  async resetDemo() {
    await Invoices.reset();
  },
}));

"use client";

import { create } from "zustand";
import { createCollection } from "@/erp/lib/storage";
import { vendors as vendorsSeed } from "@/erp/data/vendors";

const Vendors = createCollection("vendors", vendorsSeed);

export const useVendorsStore = create((set, get) => ({
  vendors: vendorsSeed,
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;
    const items = await Vendors.list();
    set({ vendors: items, hydrated: true });
    Vendors.subscribe((next) => set({ vendors: next }));
  },

  async addVendor(input) {
    return await Vendors.create(input);
  },

  async updateVendor(id, patch) {
    return await Vendors.update(id, patch);
  },

  async removeVendor(id) {
    return await Vendors.remove(id);
  },
}));

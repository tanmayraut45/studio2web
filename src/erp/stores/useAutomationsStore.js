"use client";

import { create } from "zustand";
import { createCollection } from "@/erp/lib/storage";
import { automations as automationsSeed } from "@/erp/data/documents";

const Autom = createCollection("automations", automationsSeed);

export const useAutomationsStore = create((set, get) => ({
  automations: automationsSeed,
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;
    const items = await Autom.list();
    set({ automations: items, hydrated: true });
    Autom.subscribe((next) => set({ automations: next }));
  },

  async addAutomation(input) {
    return await Autom.create({ active: true, ...input });
  },

  async updateAutomation(id, patch) {
    return await Autom.update(id, patch);
  },

  async toggle(id) {
    const items = get().automations;
    const item = items.find((a) => a.id === id);
    if (!item) return null;
    return await Autom.update(id, { active: !item.active });
  },

  async removeAutomation(id) {
    return await Autom.remove(id);
  },
}));

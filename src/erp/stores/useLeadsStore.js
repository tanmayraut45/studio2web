"use client";

import { create } from "zustand";
import { createCollection } from "@/erp/lib/storage";
import { leads as leadsSeed, leadStages } from "@/erp/data/leads";

const Leads = createCollection("leads", leadsSeed);

export const useLeadsStore = create((set, get) => ({
  leads: leadsSeed,
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;
    const items = await Leads.list();
    set({ leads: items, hydrated: true });

    Leads.subscribe((next) => set({ leads: next }));
  },

  async addLead(input) {
    const created = await Leads.create(input);
    return created;
  },

  async updateLead(id, patch) {
    const updated = await Leads.update(id, patch);
    return updated;
  },

  async removeLead(id) {
    await Leads.remove(id);
  },

  async resetDemo() {
    await Leads.reset();
  },
}));

export { leadStages };

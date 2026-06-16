"use client";

import { create } from "zustand";
import { createCollection } from "@/erp/lib/storage";
import { clients as clientsSeed } from "@/erp/data/clients";

const Clients = createCollection("clients", clientsSeed);

export const useClientsStore = create((set, get) => ({
  clients: clientsSeed,
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;
    const items = await Clients.list();
    set({ clients: items, hydrated: true });

    Clients.subscribe((next) => set({ clients: next }));
  },

  async addClient(input) {
    const created = await Clients.create(input);
    return created;
  },

  async updateClient(id, patch) {
    const updated = await Clients.update(id, patch);
    return updated;
  },

  async removeClient(id) {
    await Clients.remove(id);
  },

  async resetDemo() {
    await Clients.reset();
  },
}));

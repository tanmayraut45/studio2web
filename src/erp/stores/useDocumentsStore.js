"use client";

import { create } from "zustand";
import { createCollection } from "@/erp/lib/storage";
import { documents as documentsSeed } from "@/erp/data/documents";

const Docs = createCollection("documents", documentsSeed);

export const useDocumentsStore = create((set, get) => ({
  documents: documentsSeed,
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;
    const items = await Docs.list();
    set({ documents: items, hydrated: true });

    Docs.subscribe((next) => set({ documents: next }));
  },

  async addDocument(input) {
    const created = await Docs.create(input);
    return created;
  },

  async updateDocument(id, patch) {
    const updated = await Docs.update(id, patch);
    return updated;
  },

  async removeDocument(id) {
    await Docs.remove(id);
  },

  async resetDemo() {
    await Docs.reset();
  },
}));

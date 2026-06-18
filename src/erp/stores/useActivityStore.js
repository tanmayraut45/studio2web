"use client";

import { create } from "zustand";
import { createCollection } from "@/erp/lib/storage";

const Activities = createCollection("activities", []);

export function getEntityActivities(activities, entityType, entityId) {
  return activities
    .filter((a) => a.entityType === entityType && a.entityId === entityId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export const useActivityStore = create((set, get) => ({
  activities: [],
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;
    const items = await Activities.list();
    set({ activities: items, hydrated: true });
    Activities.subscribe((next) => set({ activities: next }));
  },

  async addActivity(input) {
    const created = await Activities.create({
      ...input,
      createdAt: input.createdAt || new Date().toISOString(),
    });
    return created;
  },

  async removeActivity(id) {
    await Activities.remove(id);
  },
}));

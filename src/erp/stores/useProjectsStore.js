"use client";
import { create } from "zustand";
import { createCollection } from "@/erp/lib/storage";
import { projects as projectsSeed } from "@/erp/data/projects";

const Projects = createCollection("projects", projectsSeed);

export const useProjectsStore = create((set, get) => ({
  projects: projectsSeed,
  hydrated: false,
  async hydrate() {
    if (get().hydrated) return;
    const items = await Projects.list();
    set({ projects: items, hydrated: true });
    Projects.subscribe((next) => set({ projects: next }));
  },
  async addProject(input) { return await Projects.create(input); },
  async updateProject(id, patch) { return await Projects.update(id, patch); },
  async removeProject(id) { return await Projects.remove(id); },
}));

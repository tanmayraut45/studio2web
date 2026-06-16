"use client";

import { create } from "zustand";
import { createCollection } from "@/erp/lib/storage";
import { employees as employeesSeed } from "@/erp/data/team";

const Employees = createCollection("employees", employeesSeed);

export const useEmployeesStore = create((set, get) => ({
  employees: employeesSeed,
  hydrated: false,

  async hydrate() {
    if (get().hydrated) return;
    const items = await Employees.list();
    set({ employees: items, hydrated: true });

    Employees.subscribe((next) => set({ employees: next }));
  },

  async addEmployee(input) {
    const created = await Employees.create(input);
    return created;
  },

  async updateEmployee(id, patch) {
    const updated = await Employees.update(id, patch);
    return updated;
  },

  async removeEmployee(id) {
    await Employees.remove(id);
  },

  async resetDemo() {
    await Employees.reset();
  },
}));

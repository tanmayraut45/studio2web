"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Role catalogue — drives RBAC-style nav + dummy login.
export const ROLES = {
  owner: {
    id: "owner",
    label: "Owner",
    name: "Aarav Mehta",
    email: "aarav@studio2.in",
    initials: "AM",
    desc: "Full access · business intelligence",
  },
  admin: {
    id: "admin",
    label: "Admin",
    name: "Priya Nair",
    email: "priya@studio2.in",
    initials: "PN",
    desc: "Operations & configuration",
  },
  accountant: {
    id: "accountant",
    label: "Accountant",
    name: "Rohan Shah",
    email: "rohan@studio2.in",
    initials: "RS",
    desc: "Finance, GST & payroll",
  },
  designer: {
    id: "designer",
    label: "Designer",
    name: "Sara Iyer",
    email: "sara@studio2.in",
    initials: "SI",
    desc: "Design & drawings",
  },
  site_engineer: {
    id: "site_engineer",
    label: "Site Engineer",
    name: "Vikram Patil",
    email: "vikram@studio2.in",
    initials: "VP",
    desc: "Site execution & reports",
  },
  purchase: {
    id: "purchase",
    label: "Purchase Manager",
    name: "Neha Gupta",
    email: "neha@studio2.in",
    initials: "NG",
    desc: "Procurement & vendors",
  },
};

export const ROLE_LIST = Object.values(ROLES);

export const useSession = create(
  persist(
    (set) => ({
      user: null,
      isAuthed: false,
      _hydrated: false,
      login: (roleId) => {
        const role = ROLES[roleId] || ROLES.owner;
        set({ user: { ...role }, isAuthed: true });
      },
      logout: () => set({ user: null, isAuthed: false }),
      setHydrated: () => set({ _hydrated: true }),
    }),
    {
      name: "studio-os-session",
      partialize: (s) => ({ user: s.user, isAuthed: s.isAuthed }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    }
  )
);

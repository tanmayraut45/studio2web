"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Studio OS uses just TWO logins:
//   - Owner  : full ERP access (everything under /erp/(app)/*)
//   - Client : restricted to the Client Portal (/erp/portal) only
//
// Backend integration later will replace this dummy persona system with
// real JWT auth + RBAC. For now this drives login UI, AuthGate routing,
// and Sidebar visibility.
export const ROLES = {
  owner: {
    id: "owner",
    label: "Owner",
    name: "Aarav Mehta",
    email: "aarav@studio2.in",
    initials: "AM",
    desc: "Full ERP access · runs Studio II",
    landing: "/erp",
  },
  client: {
    id: "client",
    label: "Client",
    name: "Rohan Malhotra",
    email: "rohan.malhotra@example.com",
    initials: "RM",
    desc: "Track your project, approvals & invoices",
    landing: "/erp/portal",
  },
};

export const ROLE_LIST = Object.values(ROLES);

export const isOwner = (role) => role === "owner";
export const isClient = (role) => role === "client";

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

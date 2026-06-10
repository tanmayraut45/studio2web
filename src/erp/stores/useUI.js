"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUI = create(
  persist(
    (set) => ({
      theme: "dark", // default dark to match the Studio II brand
      sidebarCollapsed: false,
      mobileNavOpen: false,
      commandOpen: false,
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setMobileNav: (open) => set({ mobileNavOpen: open }),
      setCommandOpen: (open) => set({ commandOpen: open }),
    }),
    {
      name: "studio-os-ui",
      partialize: (s) => ({ theme: s.theme, sidebarCollapsed: s.sidebarCollapsed }),
    }
  )
);

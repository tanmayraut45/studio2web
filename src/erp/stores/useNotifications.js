"use client";

import { create } from "zustand";

const seed = [
  {
    id: "n1",
    type: "danger",
    title: "Budget variance alert",
    body: "Vertex Office is 8.2% over its civil budget.",
    time: "12m ago",
    read: false,
  },
  {
    id: "n2",
    type: "warn",
    title: "Low stock",
    body: "Italian marble (Statuario) below reorder level at Warehouse A.",
    time: "44m ago",
    read: false,
  },
  {
    id: "n3",
    type: "info",
    title: "Approval pending",
    body: "BOQ revision v3 for Serenity Villa awaits client sign-off.",
    time: "2h ago",
    read: false,
  },
  {
    id: "n4",
    type: "success",
    title: "Payment received",
    body: "Milestone 2 payment of Rs 18,00,000 cleared for Skyline Penthouse.",
    time: "5h ago",
    read: true,
  },
  {
    id: "n5",
    type: "warn",
    title: "Site delay",
    body: "False ceiling work delayed 3 days at Coastal Retreat (rain).",
    time: "1d ago",
    read: true,
  },
];

export const useNotifications = create((set) => ({
  items: seed,
  markAllRead: () =>
    set((s) => ({ items: s.items.map((i) => ({ ...i, read: true })) })),
  markRead: (id) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, read: true } : i)),
    })),
}));

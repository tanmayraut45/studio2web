"use client";
import { create } from "zustand";
import { createCollection } from "@/erp/lib/storage";
import { aiInsights as insightsSeed } from "@/erp/data/documents";

const Insights = createCollection("ai-insights", insightsSeed);

const CANDIDATE_TITLES = [
  "Cash forecast tightening",
  "Vendor delivery risk",
  "Project margin opportunity",
  "Inventory reorder signal",
  "Client retention check-in",
];
const CANDIDATE_BODIES = [
  "Outflow next 30 days exceeds receivables by 12%. Consider releasing one milestone invoice early.",
  "Two vendors slipped past 7-day SLA on the last batch. Recommend reviewing alternates.",
  "Pattern shows projects with higher early-stage burn finish 2.4% margin lower than baseline.",
  "Hardware SKUs HW-* are approaching reorder threshold ahead of cycle. Pre-confirm vendor.",
  "Three clients haven't been touched in 30+ days despite active projects. Schedule check-in.",
];
const MODULES = ["Operations", "Procurement", "Finance", "Inventory", "CRM"];

export const useAiInsightsStore = create((set, get) => ({
  insights: insightsSeed,
  hydrated: false,
  async hydrate() {
    if (get().hydrated) return;
    const items = await Insights.list();
    set({ insights: items, hydrated: true });
    Insights.subscribe((next) => set({ insights: next }));
  },
  async dismiss(id) { return await Insights.update(id, { dismissed: true }); },
  async generate() {
    const idx = Math.floor(Math.random() * CANDIDATE_TITLES.length);
    return await Insights.create({
      title: CANDIDATE_TITLES[idx],
      body: CANDIDATE_BODIES[idx],
      module: MODULES[idx],
      confidence: 70 + Math.floor(Math.random() * 30),
      generatedAt: new Date().toISOString(),
      dismissed: false,
    });
  },
  async restoreAll() {
    const items = get().insights;
    for (const i of items.filter((x) => x.dismissed)) {
      await Insights.update(i.id, { dismissed: false });
    }
  },
}));

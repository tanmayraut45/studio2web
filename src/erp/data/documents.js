// ============================================================================
// DUMMY SEED DATA — DOCUMENTS / DESIGN ASSETS / ACTIVITY / AUTOMATIONS / AI
// ============================================================================
// This file seeds several loosely-related collections. See src/erp/lib/
// storage.js for the persistence contract.
//
// ----------------------------------------------------------------------------
// DOCUMENT — FIELD CONTRACT
//   id        string   primary key
//   name      string   filename / title
//   type      string   PDF | DWG | XLSX | image | …
//   project   string   FK → projects.id (or null if cross-project)
//   uploadedBy string  FK → employees.id
//   uploadedAt string  ISO date
//   size      number   bytes
//   revision  string   "R1" | "R2" | … version label
//   status    string   draft | in-review | locked | final
//   url       string   storage URL (in dummy data this is just a path)
//
// DESIGN ASSET — FIELD CONTRACT
//   id     string
//   project string  FK → projects.id
//   type   string   mood-board | 2d-drawing | 3d-render | sample | spec
//   title  string
//   thumb  string   thumbnail path
//   stage  string   Draft | Submitted | Revision | Approved
//   sentTo string   FK → clients.id (or "internal")
//
// ACTIVITY LOG — global cross-module audit feed
//   id     string
//   actor  string   FK → employees.id | clients.id | "system"
//   action string   short verb phrase
//   target string   what was acted on (free text)
//   time   string   relative time ("2h ago") — replace with timestamp when
//                   wiring to a real backend
//   module string   which area emitted the event (CRM, Site, Finance, …)
//
// AUTOMATION — rule definition (read-only seed for the Automation module)
//   id      string
//   name    string
//   trigger string   event that fires the rule
//   action  string   what happens
//   active  boolean
//
// AI INSIGHT — pre-computed insight cards
//   id         string
//   title      string
//   body       string   one-sentence summary
//   module     string   which module the insight relates to
//   confidence number   0–100
// ============================================================================

// Document management + design assets. Versioned, linked to projects.

export const documents = [
  { id: "d1", project: "p1", name: "Malhotra_Floor_Plan_R3.dwg", type: "CAD", size: "4.2 MB", version: "R3", uploadedBy: "e4", date: "2026-01-10", locked: true, tags: ["floor-plan", "approved"] },
  { id: "d2", project: "p1", name: "Living_3D_Render_Final.jpg", type: "Render", size: "8.8 MB", version: "Final", uploadedBy: "e8", date: "2026-01-12", locked: false, tags: ["3d", "living"] },
  { id: "d3", project: "p2", name: "Vertex_BOQ_v3.xlsx", type: "BOQ", size: "1.1 MB", version: "v3", uploadedBy: "e4", date: "2026-06-08", locked: false, tags: ["boq", "review"] },
  { id: "d4", project: "p3", name: "Serenity_Agreement_Signed.pdf", type: "Agreement", size: "2.4 MB", version: "Signed", uploadedBy: "e2", date: "2025-06-09", locked: true, tags: ["legal", "signed"] },
  { id: "d5", project: "p4", name: "Coastal_Elevation_R2.pdf", type: "Drawing", size: "6.1 MB", version: "R2", uploadedBy: "e4", date: "2026-01-28", locked: true, tags: ["elevation"] },
  { id: "d6", project: "p1", name: "Site_Progress_Jun08.zip", type: "Photos", size: "42 MB", version: "—", uploadedBy: "e5", date: "2026-06-08", locked: false, tags: ["site", "progress"] },
  { id: "d7", project: "p5", name: "Skyline_MoodBoard.pdf", type: "Mood Board", size: "3.3 MB", version: "v1", uploadedBy: "e8", date: "2026-06-02", locked: false, tags: ["concept", "art-deco"] },
];

export const designAssets = [
  { id: "da1", project: "p1", title: "Living Room — Modern Luxury", stage: "Approved", type: "3D Render", thumb: "/images/project1.png", revisions: 3, approvedBy: "c1", date: "2026-01-12" },
  { id: "da2", project: "p3", title: "Master Suite — Contemporary", stage: "Approved", type: "3D Render", thumb: "/images/project3.png", revisions: 5, approvedBy: "c3", date: "2025-08-01" },
  { id: "da3", project: "p5", title: "Penthouse Concept — Art Deco", stage: "In Review", type: "Mood Board", thumb: "/images/project1.png", revisions: 2, approvedBy: null, date: "2026-06-02" },
  { id: "da4", project: "p2", title: "Reception — Corporate Minimal", stage: "Revision", type: "2D Layout", thumb: "/images/project2.png", revisions: 4, approvedBy: null, date: "2026-06-06" },
  { id: "da5", project: "p4", title: "Lobby — Resort Luxe", stage: "In Review", type: "3D Render", thumb: "/images/project2.png", revisions: 1, approvedBy: null, date: "2026-05-30" },
  { id: "da6", project: "p3", title: "Material Board — Stone + Veneer", stage: "Approved", type: "Material Board", thumb: "/images/project3.png", revisions: 2, approvedBy: "c3", date: "2025-07-22" },
];

// System-wide activity / audit trail.
export const activityLog = [
  { id: "ac1", actor: "e6", action: "created PO", target: "PO-2026-020 · Sanitary Solutions", module: "Procurement", time: "8 min ago", type: "create" },
  { id: "ac2", actor: "e4", action: "updated BOQ", target: "Vertex Office BOQ v3", module: "BOQ", time: "26 min ago", type: "update" },
  { id: "ac3", actor: "c1", action: "approved", target: "Living 3D Render", module: "Design", time: "1h ago", type: "approve" },
  { id: "ac4", actor: "e3", action: "recorded payment", target: "Rs 15,00,000 · INV-2026-038", module: "Finance", time: "2h ago", type: "create" },
  { id: "ac5", actor: "e5", action: "submitted daily report", target: "Malhotra Residence", module: "Site", time: "3h ago", type: "create" },
  { id: "ac6", actor: "e7", action: "raised snag", target: "Reception wall plumb", module: "Site", time: "4h ago", type: "alert" },
  { id: "ac7", actor: "e1", action: "won lead", target: "Tata Realty Phase 3", module: "CRM", time: "1d ago", type: "approve" },
  { id: "ac8", actor: "e2", action: "logged in", target: "from 49.36.x.x · Pune", module: "Security", time: "1d ago", type: "auth" },
];

export const automations = [
  { id: "au1", name: "Payment due reminder", trigger: "Invoice due in 3 days", channel: "WhatsApp + Email", status: "Active", runs: 142 },
  { id: "au2", name: "Low stock reorder alert", trigger: "Stock < reorder level", channel: "In-app + Email", status: "Active", runs: 38 },
  { id: "au3", name: "Site delay escalation", trigger: "Daily report flags delay", channel: "Push + WhatsApp", status: "Active", runs: 17 },
  { id: "au4", name: "Lead follow-up nudge", trigger: "No touch in 48h", channel: "WhatsApp", status: "Active", runs: 89 },
  { id: "au5", name: "BOQ variance warning", trigger: "Actual > 90% of budget", channel: "In-app", status: "Paused", runs: 11 },
  { id: "au6", name: "Approval pending digest", trigger: "Daily 9 AM", channel: "Email", status: "Active", runs: 205 },
];

// AI engine — generated insights surfaced across the platform.
export const aiInsights = [
  { id: "ai1", title: "Vertex Office margin risk", body: "Civil actuals are tracking 8.2% above BOQ. At current burn, margin could drop to 11.3%. Recommend freezing scope changes and renegotiating MS fabrication rate with SteelLine.", confidence: 91, type: "risk", module: "Projects" },
  { id: "ai2", title: "Vendor switch opportunity", body: "GlassEdge offers better quality (90 vs 84) at +5% price vs SteelLine for toughened glass. Net rejection savings outweigh price delta on volumes > 300 sq.ft.", confidence: 84, type: "optimize", module: "Procurement" },
  { id: "ai3", title: "Cash flow tightening", body: "June projected net inflow is Rs 6L — lowest in 8 months due to INV-2026-040 being overdue. Prioritize Vertex collection of Rs 67.3L.", confidence: 88, type: "finance", module: "Finance" },
  { id: "ai4", title: "Material waste prediction", body: "Statuario marble wastage trending at 6.4% vs 4% target on Malhotra site. Suggest slab-optimized cutting layout to recover ~Rs 38k.", confidence: 79, type: "optimize", module: "Inventory" },
];

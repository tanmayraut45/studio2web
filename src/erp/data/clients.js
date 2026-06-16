// ============================================================================
// DUMMY SEED DATA — CLIENTS
// ============================================================================
// Seed for the "clients" collection. See src/erp/lib/storage.js for the
// persistence contract and the migration-to-API path documented in
// src/erp/data/leads.js (the same applies here — only the storage layer
// changes when switching to a real backend).
//
// ----------------------------------------------------------------------------
// FIELD CONTRACT — each client:
//   id             string   primary key (c1…c6 in seed)
//   name           string   primary contact full name
//   company        string   business name (or "Private Residence")
//   type           string   Residential | Commercial | Hospitality
//   initials       string   2-letter avatar fallback
//   email          string
//   phone          string   E.164-ish
//   gst            string   GSTIN if commercial, "—" if individual
//   pan            string
//   billing        string   billing address
//   site           string   site / project location
//   since          string   ISO date the relationship started
//   decisionMaker  string   primary decision maker name + role
//   budgetFlex     string   Low | Medium | High — flexibility on cost
//   rating         number   1–5 stars (internal qualitative score)
//   style          string   preferred design style
//   lifetimeValue  number   total billed rupees across all projects
//   projects       string[] FK array → src/erp/data/projects.js (project.id)
//   status         string   Active | Inactive | Archived
// ============================================================================

// Client master — central client intelligence. Linked to projects, invoices, leads.

export const clients = [
  {
    id: "c1",
    name: "Rajesh & Kavita Malhotra",
    company: "Private Residence",
    type: "Residential",
    initials: "RM",
    email: "rajesh.malhotra@gmail.com",
    phone: "+91 99300 22001",
    gst: "—",
    pan: "AKLPM1234C",
    billing: "12 Koregaon Park, Pune 411001",
    site: "Plot 14, Koregaon Park Annexe, Pune",
    since: "2023-02-11",
    decisionMaker: "Kavita Malhotra",
    budgetFlex: "Medium",
    rating: 5,
    style: "Modern Luxury",
    lifetimeValue: 14200000,
    projects: ["p1"],
    status: "Active",
  },
  {
    id: "c2",
    name: "Vertex Technologies Pvt Ltd",
    company: "Vertex Technologies",
    type: "Commercial",
    initials: "VT",
    email: "facilities@vertex.io",
    phone: "+91 99300 22002",
    gst: "27AABCV1234D1Z5",
    pan: "AABCV1234D",
    billing: "Tower B, BKC, Mumbai 400051",
    site: "5th Floor, Vertex HQ, BKC, Mumbai",
    since: "2023-09-04",
    decisionMaker: "Sandeep Rao (Admin Head)",
    budgetFlex: "Low",
    rating: 4,
    style: "Corporate Minimal",
    lifetimeValue: 28500000,
    projects: ["p2"],
    status: "Active",
  },
  {
    id: "c3",
    name: "Dr. Anil Kapoor",
    company: "Serenity Villa",
    type: "Residential",
    initials: "AK",
    email: "anil.kapoor@outlook.com",
    phone: "+91 99300 22003",
    gst: "—",
    pan: "AFKPK4567L",
    billing: "Sunrise Estate, Lonavala 410401",
    site: "Serenity Villa, Tungarli, Lonavala",
    since: "2024-01-19",
    decisionMaker: "Dr. Anil Kapoor",
    budgetFlex: "High",
    rating: 5,
    style: "Contemporary",
    lifetimeValue: 19800000,
    projects: ["p3"],
    status: "Active",
  },
  {
    id: "c4",
    name: "Sunrise Hospitality LLP",
    company: "Sunrise Hospitality",
    type: "Hospitality",
    initials: "SH",
    email: "projects@sunrisehotels.in",
    phone: "+91 99300 22004",
    gst: "27AADCS7788P1Z2",
    pan: "AADCS7788P",
    billing: "MG Road, Pune 411001",
    site: "Coastal Retreat, Alibaug",
    since: "2024-06-02",
    decisionMaker: "Ritu Sanghvi (Director)",
    budgetFlex: "Medium",
    rating: 4,
    style: "Resort Luxe",
    lifetimeValue: 41000000,
    projects: ["p4"],
    status: "Active",
  },
  {
    id: "c5",
    name: "Mr. Aditya Verma",
    company: "Skyline Penthouse",
    type: "Residential",
    initials: "AV",
    email: "aditya.verma@icloud.com",
    phone: "+91 99300 22005",
    gst: "—",
    pan: "BKTPV9911H",
    billing: "World Towers, Lower Parel, Mumbai 400013",
    site: "Penthouse 41A, World Towers, Mumbai",
    since: "2024-11-15",
    decisionMaker: "Aditya Verma",
    budgetFlex: "High",
    rating: 5,
    style: "Art Deco Revival",
    lifetimeValue: 23400000,
    projects: ["p5"],
    status: "Active",
  },
  {
    id: "c6",
    name: "Greenfield Developers",
    company: "Greenfield Developers",
    type: "Commercial",
    initials: "GD",
    email: "design@greenfield.co.in",
    phone: "+91 99300 22006",
    gst: "27AAFCG3344K1Z9",
    pan: "AAFCG3344K",
    billing: "Hinjewadi Phase 2, Pune 411057",
    site: "Greenfield Experience Centre, Hinjewadi",
    since: "2025-03-21",
    decisionMaker: "Procurement Committee",
    budgetFlex: "Low",
    rating: 3,
    style: "Biophilic Modern",
    lifetimeValue: 9600000,
    projects: ["p6"],
    status: "Active",
  },
];

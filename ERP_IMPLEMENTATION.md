# Studio2 ERP — Complete Implementation Documentation

> **Project:** Studio2 Web — Marketing site + Studio OS ERP platform  
> **Date:** June 2026  
> **Scope:** Phase 1 — Full ERP shell (18 modules), dummy data frontend, disconnected NestJS backend scaffold  
> **Total files touched:** **161** (153 new + 8 modified) · **14 additional marketing page relocations**

---

## Deployment Status (Phase 1)

| Surface | Where it lives | Hosted? | Connected? |
|---|---|---|---|
| Frontend (Next.js + ERP) | `/src` | Vercel (auto-deploy from GitHub `main`) | N/A |
| Marketing site | `/src/app/(marketing)` | Vercel (live) | N/A |
| Studio OS ERP | `/src/app/erp` | Vercel (live, demo with dummy data) | **Not connected to backend** |
| Dummy data | `/src/erp/data/*.js` | Bundled in frontend | Source of truth for ERP UI |
| Backend (NestJS) | `/backend` | **Not deployed** | Dormant scaffold |
| Database (PostgreSQL) | `backend/prisma/schema.prisma` | **Not deployed** | Not connected |

## Authentication Model (2 logins only)

Studio OS uses just two login personas — defined in `src/erp/stores/useSession.js`:

| Role | Lands on | Access |
|---|---|---|
| **Owner** (Aarav Mehta — `aarav@studio2.in`) | `/erp` (Dashboard) | Full ERP — all 18 modules |
| **Client** (Rohan Malhotra — `rohan.malhotra@example.com`) | `/erp/portal` (Client Portal) | Read-only Client Portal only |

Enforcement points:
- **`src/components/erp/AuthGate.js`** — redirects unauthenticated users to `/erp/login`; if a client tries to visit any non-portal route, they're sent back to `/erp/portal`.
- **`src/components/erp/Sidebar.js`** — clients see only the "Client Portal" nav item; owner sees all 7 groups.
- **`src/app/erp/login/page.js`** — only two role chips ("Owner", "Client"); landing route comes from `ROLES[id].landing`.

The five role personas that used to exist (Admin, Accountant, Designer, Site Engineer, Purchase Manager) were removed in favour of this two-login model. When the backend goes live (Phase 3), these two roles map to:
- Owner → `UserRole.OWNER`
- Client → `UserRole.CLIENT`

(Backend `prisma/schema.prisma` still defines the broader enum for forward-compat — Owner+Client are the only two used by the frontend.)

**Vercel excludes the `/backend` folder** via `.vercelignore` at the repo root — the backend stays in this repo as the single source of truth, but never ships to the CDN. When you're ready to host the backend (Phase 3), pick a provider (Railway/Render recommended), point a `NEXT_PUBLIC_API_URL` env var at it, and migrate ERP modules off mock data one at a time.

### Repository Structure
```
studio2web/
├── src/                         # Next.js frontend (Vercel)
│   ├── app/
│   │   ├── (marketing)/        # Public site: /, /about, /portfolio, etc.
│   │   └── erp/                # Studio OS: /erp/login, /erp/(app)/*
│   ├── components/
│   │   ├── erp/                # ERP-only UI primitives (Sidebar, Charts, etc.)
│   │   └── [Navbar, Footer, BottomNav, ...]
│   └── erp/
│       ├── data/               # Dummy data (frontend reads ONLY from here)
│       ├── stores/             # Zustand: useSession, useUI, useNotifications
│       └── lib/format.js       # inr(), pct(), dateShort(), etc.
│
├── backend/                     # NestJS API (NOT deployed)
│   ├── src/modules/            # 14 API modules
│   ├── prisma/                 # schema.prisma + seed.ts
│   ├── Dockerfile              # Ready for Railway/Render
│   └── docker-compose.yml      # Local Postgres + Redis
│
├── .vercelignore               # Excludes backend/ from Vercel deploys
└── ERP_IMPLEMENTATION.md       # This file
```

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [File Change Summary (161 Files)](#3-file-change-summary-161-files)
4. [Complete Directory Structure](#4-complete-directory-structure)
5. [Marketing Site Changes](#5-marketing-site-changes)
6. [Frontend ERP — Routes & Modules](#6-frontend-erp--routes--modules)
7. [Frontend ERP — Design System & Components](#7-frontend-erp--design-system--components)
8. [Frontend ERP — State & Mock Data](#8-frontend-erp--state--mock-data)
9. [Backend — NestJS API Scaffold](#9-backend--nestjs-api-scaffold)
10. [Backend — Database Schema (Prisma)](#10-backend--database-schema-prisma)
11. [Configuration & Dependency Changes](#11-configuration--dependency-changes)
12. [Bugs Fixed During Implementation](#12-bugs-fixed-during-implementation)
13. [How to Run](#13-how-to-run)
14. [What Is NOT Connected Yet](#14-what-is-not-connected-yet)
15. [Complete File Index](#15-complete-file-index)

---

## 1. Executive Summary

Studio2's existing Next.js marketing website was extended with a full **Studio OS ERP** platform without breaking existing URLs or design language. The ERP runs at `/erp/*` and is entered via the marketing footer ("Enter Studio OS" button + clickable copyright).

**What was built:**

| Layer | Description |
|-------|-------------|
| **Marketing restructure** | Route groups separate marketing chrome from ERP; existing pages keep same URLs |
| **ERP frontend** | Login, dashboard, 16 navigable modules, dark/light theme, responsive shell |
| **Shared UI library** | Charts, tables, kanban, Gantt, modals, command palette, skeleton loaders |
| **Mock data layer** | Relationally-linked dummy data for all modules (no API calls) |
| **Backend scaffold** | NestJS + Prisma + PostgreSQL, JWT/RBAC, Docker, Swagger — **decoupled** |

**Core business questions answered on the dashboard:**

- Which projects are profitable?
- Where is money getting wasted?
- Which vendor performs best?
- Which employee performs best?
- What is current and projected cash flow?

---

## 2. Architecture Overview

```
studio2web/
├── src/app/
│   ├── layout.js                    # Root: html/body/fonts only
│   ├── (marketing)/                 # Public website (Navbar/Footer/BottomNav)
│   │   ├── layout.js
│   │   ├── page.js                  # Home
│   │   ├── about/ contact/ portfolio/ services/
│   │   └── projects/[id]/
│   └── erp/                         # Studio OS ERP
│       ├── layout.js                # Theme provider (dark/light)
│       ├── erp-theme.css            # ERP design tokens
│       ├── login/                   # Public login (outside AuthGate)
│       └── (app)/                   # Authenticated shell
│           ├── layout.js            # Sidebar + Topbar + AuthGate
│           ├── page.js              # Dashboard
│           └── [16 modules]/        # leads, clients, projects, …
├── src/components/
│   ├── Footer.js                    # Updated: ERP entry + © 2026
│   └── erp/                         # Reusable ERP components
├── src/erp/
│   ├── data/                        # Mock datasets + selectors + KPIs
│   ├── stores/                      # Zustand: session, UI, notifications
│   └── lib/format.js                # INR, dates, percentages
└── backend/                         # NestJS API (NOT wired to frontend)
    ├── prisma/schema.prisma
    ├── prisma/seed.ts
    └── src/modules/                 # Auth, Clients, Leads, Projects, …
```

**Data flow (Phase 1):**

```
ERP Pages → src/erp/data/index.js → Mock JSON datasets
                ↓
         Zustand stores (session, theme, notifications)
                ↓
         Shared ERP components (Charts, DataTable, Kanban, …)

Backend API → PostgreSQL (standalone, ready for Phase 2 integration)
```

**Design philosophy:** Everything revolves around **Project → Client → Site**. All mock entities share relational IDs (`clientId`, `projectId`, `vendorId`, etc.).

---

## 3. File Change Summary (161 Files)

| Category | Count | Action |
|----------|------:|--------|
| Modified (root config + shared components) | 8 | Updated |
| New — Backend (`backend/`) | 74 | Created |
| New — ERP app routes (`src/app/erp/`) | 41 | Created |
| New — ERP components (`src/components/erp/`) | 22 | Created |
| New — ERP data/stores (`src/erp/`) | 15 | Created |
| New — Marketing layout | 1 | Created |
| **Subtotal (161)** | **161** | |
| Relocated — Marketing pages → `(marketing)/` | 14 | Moved (rename) |
| **Grand total git operations** | **175** | |

### 3.1 Modified Files (8)

| File | Change |
|------|--------|
| `eslint.config.mjs` | Added `backend/**` to `globalIgnores` |
| `next.config.mjs` | Added `images.qualities: [75, 100]` |
| `package.json` | Added `zustand` dependency |
| `package-lock.json` | Lockfile updated for zustand |
| `src/app/layout.js` | Slimmed to html/body/fonts; removed Navbar/Footer/BottomNav |
| `src/components/Footer.js` | © 2026, removed "Designed for Mobile", added Studio OS entry links |
| `src/components/Footer.module.css` | Styles for `.osButton`, `.osPulse`, `.copyright` |
| `src/components/ProjectDetails.js` | Fixed CSS import path after marketing route move |

### 3.2 Relocated Marketing Files (14)

| From | To |
|------|-----|
| `src/app/page.js` | `src/app/(marketing)/page.js` |
| `src/app/page.module.css` | `src/app/(marketing)/page.module.css` |
| `src/app/template.js` | `src/app/(marketing)/template.js` |
| `src/app/about/page.js` | `src/app/(marketing)/about/page.js` |
| `src/app/about/page.module.css` | `src/app/(marketing)/about/page.module.css` |
| `src/app/contact/page.js` | `src/app/(marketing)/contact/page.js` |
| `src/app/contact/page.module.css` | `src/app/(marketing)/contact/page.module.css` |
| `src/app/portfolio/page.js` | `src/app/(marketing)/portfolio/page.js` |
| `src/app/portfolio/page.module.css` | `src/app/(marketing)/portfolio/page.module.css` |
| `src/app/services/page.js` | `src/app/(marketing)/services/page.js` |
| `src/app/services/page.module.css` | `src/app/(marketing)/services/page.module.css` |
| `src/app/projects/[id]/page.js` | `src/app/(marketing)/projects/[id]/page.js` |
| `src/app/projects/[id]/page.module.css` | `src/app/(marketing)/projects/[id]/page.module.css` |

---

## 4. Complete Directory Structure

```
studio2web/
│
├── ERP_IMPLEMENTATION.md              ← this file
├── eslint.config.mjs                  [M]
├── next.config.mjs                    [M]
├── package.json                       [M]
├── package-lock.json                  [M]
│
├── backend/                           [NEW — 74 files]
│   ├── .gitignore
│   ├── Dockerfile
│   ├── README.md
│   ├── docker-compose.yml
│   ├── nest-cli.json
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── config/
│       │   └── configuration.ts
│       ├── prisma/
│       │   ├── prisma.module.ts
│       │   └── prisma.service.ts
│       ├── common/
│       │   ├── decorators/
│       │   │   ├── current-user.decorator.ts
│       │   │   ├── public.decorator.ts
│       │   │   └── roles.decorator.ts
│       │   ├── dto/
│       │   │   └── pagination.dto.ts
│       │   ├── filters/
│       │   │   └── all-exceptions.filter.ts
│       │   ├── guards/
│       │   │   ├── jwt-auth.guard.ts
│       │   │   └── roles.guard.ts
│       │   └── interceptors/
│       │       └── audit.interceptor.ts
│       └── modules/
│           ├── auth/
│           │   ├── auth.controller.ts
│           │   ├── auth.module.ts
│           │   ├── auth.service.ts
│           │   ├── dto/login.dto.ts
│           │   ├── dto/register.dto.ts
│           │   └── strategies/jwt.strategy.ts
│           ├── boq/
│           │   ├── boq.controller.ts
│           │   ├── boq.module.ts
│           │   └── boq.service.ts
│           ├── clients/
│           │   ├── clients.controller.ts
│           │   ├── clients.module.ts
│           │   ├── clients.service.ts
│           │   └── dto/client.dto.ts
│           ├── documents/
│           │   ├── documents.controller.ts
│           │   ├── documents.module.ts
│           │   └── documents.service.ts
│           ├── employees/
│           │   ├── employees.controller.ts
│           │   ├── employees.module.ts
│           │   ├── employees.service.ts
│           │   └── dto/employee.dto.ts
│           ├── health/
│           │   ├── health.controller.ts
│           │   └── health.module.ts
│           ├── inventory/
│           │   ├── inventory.controller.ts
│           │   ├── inventory.module.ts
│           │   └── inventory.service.ts
│           ├── invoices/
│           │   ├── invoices.controller.ts
│           │   ├── invoices.module.ts
│           │   ├── invoices.service.ts
│           │   └── dto/invoice.dto.ts
│           ├── leads/
│           │   ├── leads.controller.ts
│           │   ├── leads.module.ts
│           │   ├── leads.service.ts
│           │   └── dto/lead.dto.ts
│           ├── procurement/
│           │   ├── procurement.controller.ts
│           │   ├── procurement.module.ts
│           │   └── procurement.service.ts
│           ├── projects/
│           │   ├── projects.controller.ts
│           │   ├── projects.module.ts
│           │   ├── projects.service.ts
│           │   └── dto/project.dto.ts
│           ├── tasks/
│           │   ├── tasks.controller.ts
│           │   ├── tasks.module.ts
│           │   └── tasks.service.ts
│           ├── users/
│           │   ├── users.controller.ts
│           │   ├── users.module.ts
│           │   └── users.service.ts
│           └── vendors/
│               ├── vendors.controller.ts
│               ├── vendors.module.ts
│               ├── vendors.service.ts
│               └── dto/vendor.dto.ts
│
└── src/
    ├── app/
    │   ├── layout.js                  [M]
    │   ├── globals.css                (unchanged)
    │   │
    │   ├── (marketing)/               [NEW layout + 14 relocated pages]
    │   │   ├── layout.js
    │   │   ├── page.js
    │   │   ├── page.module.css
    │   │   ├── template.js
    │   │   ├── about/
    │   │   │   ├── page.js
    │   │   │   └── page.module.css
    │   │   ├── contact/
    │   │   │   ├── page.js
    │   │   │   └── page.module.css
    │   │   ├── portfolio/
    │   │   │   ├── page.js
    │   │   │   └── page.module.css
    │   │   ├── services/
    │   │   │   ├── page.js
    │   │   │   └── page.module.css
    │   │   └── projects/
    │   │       └── [id]/
    │   │           ├── page.js
    │   │           └── page.module.css
    │   │
    │   └── erp/                       [NEW — 41 files]
    │       ├── layout.js
    │       ├── erp-theme.css
    │       ├── login/
    │       │   ├── page.js
    │       │   └── login.module.css
    │       └── (app)/
    │           ├── layout.js
    │           ├── page.js
    │           ├── dashboard.module.css
    │           ├── leads/
    │           │   ├── page.js
    │           │   └── leads.module.css
    │           ├── clients/
    │           │   ├── page.js
    │           │   └── clients.module.css
    │           ├── projects/
    │           │   ├── page.js
    │           │   └── projects.module.css
    │           ├── site/
    │           │   ├── page.js
    │           │   └── site.module.css
    │           ├── design/
    │           │   ├── page.js
    │           │   └── design.module.css
    │           ├── documents/
    │           │   ├── page.js
    │           │   └── documents.module.css
    │           ├── boq/
    │           │   ├── page.js
    │           │   └── boq.module.css
    │           ├── procurement/
    │           │   ├── page.js
    │           │   └── procurement.module.css
    │           ├── inventory/
    │           │   ├── page.js
    │           │   └── inventory.module.css
    │           ├── finance/
    │           │   ├── page.js
    │           │   └── finance.module.css
    │           ├── gst/
    │           │   ├── page.js
    │           │   └── gst.module.css
    │           ├── hr/
    │           │   ├── page.js
    │           │   └── hr.module.css
    │           ├── portal/
    │           │   ├── page.js
    │           │   └── portal.module.css
    │           ├── analytics/
    │           │   ├── page.js
    │           │   └── analytics.module.css
    │           ├── automation/
    │           │   ├── page.js
    │           │   └── automation.module.css
    │           ├── ai/
    │           │   ├── page.js
    │           │   └── ai.module.css
    │           └── settings/
    │               ├── page.js
    │               └── settings.module.css
    │
    ├── components/
    │   ├── Footer.js                  [M]
    │   ├── Footer.module.css          [M]
    │   ├── ProjectDetails.js          [M]
    │   └── erp/                       [NEW — 22 files]
    │       ├── AuthGate.js
    │       ├── Charts.js
    │       ├── Charts.module.css
    │       ├── CommandPalette.js
    │       ├── Command.module.css
    │       ├── DataTable.js
    │       ├── DataTable.module.css
    │       ├── Gantt.js
    │       ├── Gantt.module.css
    │       ├── KanbanBoard.js
    │       ├── KanbanBoard.module.css
    │       ├── Modal.js
    │       ├── Modal.module.css
    │       ├── nav.js
    │       ├── Sidebar.js
    │       ├── Skeleton.js
    │       ├── Skeleton.module.css
    │       ├── Shell.module.css
    │       ├── Topbar.js
    │       ├── layout.module.css
    │       ├── ui.js
    │       └── ui.module.css
    │
    └── erp/                           [NEW — 15 files]
        ├── data/
        │   ├── index.js
        │   ├── boq.js
        │   ├── clients.js
        │   ├── documents.js
        │   ├── finance.js
        │   ├── inventory.js
        │   ├── leads.js
        │   ├── procurement.js
        │   ├── projects.js
        │   ├── team.js
        │   └── vendors.js
        ├── lib/
        │   └── format.js
        └── stores/
            ├── useNotifications.js
            ├── useSession.js
            └── useUI.js
```

---

## 5. Marketing Site Changes

### 5.1 Layout Split

**Before:** Single `src/app/layout.js` wrapped all pages with Navbar, Footer, BottomNav, SmoothScrolling.

**After:**
- `src/app/layout.js` — fonts + html/body only (shared by marketing + ERP)
- `src/app/(marketing)/layout.js` — marketing chrome restored here
- Route group `(marketing)` is invisible in URLs — `/`, `/about`, `/contact` unchanged

### 5.2 Footer Updates

| Before | After |
|--------|-------|
| `© 2025 Studio II Designed for Mobile` | `© 2026 Studio II` (clickable → `/erp/login`) |
| No ERP entry | **"Enter Studio OS"** button with gold pulse animation → `/erp/login` |

### 5.3 Fonts

Added **JetBrains Mono** to root layout for ERP tabular figures (currency, KPIs). Existing fonts preserved:
- **Bodoni Moda** — display/headings
- **Plus Jakarta Sans** — body/UI

---

## 6. Frontend ERP — Routes & Modules

### 6.1 Entry & Auth

| Route | File | Description |
|-------|------|-------------|
| `/erp/login` | `src/app/erp/login/page.js` | Split-screen login with role selector (dummy auth) |

**Dummy roles:** Owner, Admin, Accountant, Designer, Site Engineer, Purchase Manager

### 6.2 Authenticated Routes (16 Modules)

| # | Module | Route | Page File | Depth |
|---|--------|-------|-----------|-------|
| 1 | Dashboard | `/erp` | `(app)/page.js` | Deep — owner BI, 5 core KPIs |
| 2 | CRM & Leads | `/erp/leads` | `(app)/leads/page.js` | Deep — kanban pipeline, detail drawer |
| 3 | Clients | `/erp/clients` | `(app)/clients/page.js` | Deep — client cards, project history |
| 4 | Projects | `/erp/projects` | `(app)/projects/page.js` | Deep — Gantt, tasks, daily reports, snags |
| 5 | Site Execution | `/erp/site` | `(app)/site/page.js` | Medium — daily reports, GPS attendance, QC |
| 6 | Design Studio | `/erp/design` | `(app)/design/page.js` | Medium — assets, approvals, integrations |
| 7 | Documents | `/erp/documents` | `(app)/documents/page.js` | Medium — folder tree, file list |
| 8 | BOQ & Estimation | `/erp/boq` | `(app)/boq/page.js` | Deep — line items, area-wise donut |
| 9 | Procurement | `/erp/procurement` | `(app)/procurement/page.js` | Deep — PR/PO, vendor comparison |
| 10 | Inventory | `/erp/inventory` | `(app)/inventory/page.js` | Deep — stock, warehouses, movements |
| 11 | Finance | `/erp/finance` | `(app)/finance/page.js` | Deep — invoices, cash flow, cost centers |
| 12 | GST & Tax | `/erp/gst` | `(app)/gst/page.js` | Medium — returns, HSN/SAC, compliance |
| 13 | HR & Payroll | `/erp/hr` | `(app)/hr/page.js` | Medium — directory, attendance heat map |
| 14 | Client Portal | `/erp/portal` | `(app)/portal/page.js` | Medium — timeline, approvals, chat preview |
| 15 | Analytics & BI | `/erp/analytics` | `(app)/analytics/page.js` | Medium — performance charts |
| 16 | Automation | `/erp/automation` | `(app)/automation/page.js` | Medium — rules, channel insights |
| 17 | AI Engine | `/erp/ai` | `(app)/ai/page.js` | Medium — copilot chat, insights |
| 18 | Security & Settings | `/erp/settings` | `(app)/settings/page.js` | Medium — RBAC matrix, audit log, sessions |

### 6.3 Navigation Groups

Defined in `src/components/erp/nav.js`:

```
Overview          → Dashboard
Sales & Clients   → CRM & Leads, Clients, Client Portal
Delivery          → Projects, Site Execution, Design Studio, Documents
Commercial        → BOQ, Procurement, Inventory
Finance           → Finance, GST & Tax, HR & Payroll
Intelligence      → Analytics, Automation, AI Engine
System            → Security & Settings
```

### 6.4 Shell Features

| Feature | Component | Details |
|---------|-----------|---------|
| Sidebar | `Sidebar.js` | Collapsible, grouped nav, mobile drawer |
| Topbar | `Topbar.js` | Search, notifications, theme toggle, user menu |
| Command palette | `CommandPalette.js` | `⌘K` / `Ctrl+K` global navigation |
| Auth gate | `AuthGate.js` | Redirects to login; boot screen during hydration |
| Theme | `erp-theme.css` + `useUI` | Dark (default) / light, persisted to localStorage |

---

## 7. Frontend ERP — Design System & Components

### 7.1 Theme (`src/app/erp/erp-theme.css`)

- Scoped via `[data-erp-theme="dark"]` / `[data-erp-theme="light"]`
- Gold accent palette inherited from marketing site (`--accent-gold`, glass effects)
- CSS variables: surfaces, borders, text, shadows, radii, spacing
- Modal portals carry `data-erp-theme` for correct styling outside main tree

### 7.2 UI Primitives (`src/components/erp/ui.js`)

| Component | Purpose |
|-----------|---------|
| `Avatar` | User/entity initials with color |
| `Badge` / `Tag` | Status labels |
| `Panel` | Glass card container |
| `KpiCard` | Metric with sparkline/trend |
| `PageHeader` | Title, subtitle, actions slot |
| `Stat` | Inline stat display |
| `EmptyState` | Placeholder when no data |
| `ComingSoon` | Feature placeholder |
| `Btn` | Primary/secondary/ghost buttons |

### 7.3 Data Visualization (`src/components/erp/Charts.js`)

Custom lightweight SVG charts (no Chart.js/Recharts — zero extra bundle weight):

| Chart | Use |
|-------|-----|
| `Sparkline` | KPI trend lines |
| `AreaChart` | Cash flow, revenue |
| `DualBars` | Budget vs actual |
| `Donut` | Category breakdown |
| `Ring` | Progress indicators |
| `Meter` | Utilization gauges |

All animated with `framer-motion`.

### 7.4 Data Components

| Component | File | Features |
|-----------|------|----------|
| `DataTable` | `DataTable.js` | Search, sort, pagination |
| `KanbanBoard` | `KanbanBoard.js` | Column-based workflow boards |
| `Gantt` | `Gantt.js` | Project timeline bars |
| `Modal` / `Drawer` | `Modal.js` | Overlay panels with theme context |
| `Skeleton` | `Skeleton.js` | Loading placeholders |

### 7.5 Layout Utilities

`src/components/erp/layout.module.css` — shared grids, flex rows, filter bars, responsive breakpoints used across all module pages.

---

## 8. Frontend ERP — State & Mock Data

### 8.1 Zustand Stores

| Store | File | State |
|-------|------|-------|
| Session | `useSession.js` | User, role, login/logout (dummy), localStorage persistence |
| UI | `useUI.js` | Theme, sidebar collapsed, mobile nav, command palette open |
| Notifications | `useNotifications.js` | In-app notification list, read/unread |

### 8.2 Mock Data Files

| File | Entities |
|------|----------|
| `team.js` | Employees, departments, attendance, leave, payroll |
| `clients.js` | Client companies, contacts, project history |
| `leads.js` | Lead pipeline, stages, activity, funnel metrics |
| `projects.js` | Projects, milestones, tasks, daily reports, snags, checklists |
| `vendors.js` | Vendor directory, ratings, specializations |
| `boq.js` | BOQ documents, line items, templates |
| `procurement.js` | Purchase requests, orders, RFQ comparisons |
| `inventory.js` | Materials, warehouses, stock movements |
| `finance.js` | Invoices, payments, expenses, cash flow, ledger, GST |
| `documents.js` | Document folders, design assets, automations, AI insights, activity log |

### 8.3 Data Layer (`src/erp/data/index.js`)

- Re-exports all datasets
- **Selectors:** `getClient`, `getProject`, `getEmployee`, `getVendor`, `getMaterial`
- **Name helpers:** `clientName`, `projectName`, `employeeName`, `vendorName`
- **Filters:** `tasksForProject`, `reportsForProject`, `snagsForProject`
- **Derived KPIs:** portfolio margin, cash position, pipeline value, vendor scores, employee utilization

### 8.4 Format Utilities (`src/erp/lib/format.js`)

- `inr()` / `inrCompact()` — Indian Rupee formatting
- `pct()` — percentage
- `num()` — number formatting
- `dateShort()` — short date strings
- `initials()` — avatar initials from name

---

## 9. Backend — NestJS API Scaffold

> **Status:** Complete scaffold, **NOT connected to frontend.**

### 9.1 Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| NestJS | 10.4 | Modular API framework |
| Prisma | 5.20 | ORM + migrations |
| PostgreSQL | 16 (Docker) | Primary database |
| Redis | 7 (Docker) | Cache/queue ready |
| JWT + Passport | — | Authentication |
| Swagger | 7.4 | API docs at `/docs` |
| Helmet | 7.1 | Security headers |
| Throttler | 6.2 | Rate limiting |
| bcrypt | 5.1 | Password hashing |

### 9.2 Security Pipeline (Global)

```
Request → JwtAuthGuard → RolesGuard → Throttler → AuditInterceptor → Handler
              ↓
         @Public() bypasses JWT (login, register, health)
```

### 9.3 API Modules (14)

| Module | Controller | Service | Endpoints |
|--------|-----------|---------|-----------|
| Auth | `auth.controller.ts` | `auth.service.ts` | Login, register, refresh |
| Users | `users.controller.ts` | `users.service.ts` | User CRUD, activation |
| Clients | `clients.controller.ts` | `clients.service.ts` | Client CRUD |
| Leads | `leads.controller.ts` | `leads.service.ts` | Lead CRUD, stage updates |
| Projects | `projects.controller.ts` | `projects.service.ts` | Project CRUD, stats |
| Tasks | `tasks.controller.ts` | `tasks.service.ts` | Task CRUD |
| Vendors | `vendors.controller.ts` | `vendors.service.ts` | Vendor CRUD |
| Inventory | `inventory.controller.ts` | `inventory.service.ts` | Materials, warehouses, movements, low stock |
| Procurement | `procurement.controller.ts` | `procurement.service.ts` | PR/PO management |
| BOQ | `boq.controller.ts` | `boq.service.ts` | BOQ docs, lines, locking |
| Invoices | `invoices.controller.ts` | `invoices.service.ts` | Invoice CRUD, outstanding |
| Employees | `employees.controller.ts` | `employees.service.ts` | Employee CRUD |
| Documents | `documents.controller.ts` | `documents.service.ts` | Document CRUD |
| Health | `health.controller.ts` | — | Liveness + DB check |

### 9.4 Common Infrastructure

| Path | Purpose |
|------|---------|
| `common/decorators/public.decorator.ts` | Mark routes as public |
| `common/decorators/roles.decorator.ts` | RBAC role requirements |
| `common/decorators/current-user.decorator.ts` | Inject authenticated user |
| `common/guards/jwt-auth.guard.ts` | JWT validation |
| `common/guards/roles.guard.ts` | Role-based access |
| `common/filters/all-exceptions.filter.ts` | Consistent error responses |
| `common/interceptors/audit.interceptor.ts` | Log mutating requests |
| `common/dto/pagination.dto.ts` | Paginated query params |

### 9.5 Docker

| File | Services |
|------|----------|
| `docker-compose.yml` | `postgres`, `redis`, `api` (profile: full) |
| `Dockerfile` | Multi-stage NestJS build |

### 9.6 Seeded Users (password: `studio2`)

| Role | Email |
|------|-------|
| Owner | aarav@studio2.in |
| Admin | priya@studio2.in |
| Accountant | rohan@studio2.in |
| Designer | sara@studio2.in |
| Site Engineer | vikram@studio2.in |
| Purchase Manager | neha@studio2.in |

---

## 10. Backend — Database Schema (Prisma)

**File:** `backend/prisma/schema.prisma`

### 10.1 Cross-Cutting Patterns

- **Multi-tenancy:** `orgId` on all tenant-scoped models
- **Soft deletes:** `deletedAt` timestamp
- **Audit fields:** `createdAt`, `updatedAt`, `createdBy`, `updatedBy`
- **Enums:** ProjectStatus, LeadStage, InvoiceStatus, TaskStatus, etc.

### 10.2 Models (27)

| Model | Domain |
|-------|--------|
| `Organization` | Tenant root |
| `User` | Auth + MFA-ready |
| `Role` / `Permission` | RBAC |
| `Employee` / `Attendance` | HR |
| `Client` | CRM |
| `Lead` | Sales pipeline |
| `Project` / `ProjectMember` / `Milestone` | Project delivery |
| `Task` | Work items |
| `DailyReport` / `Snag` | Site execution |
| `Vendor` | Supplier management |
| `Material` / `Warehouse` / `StockItem` / `StockMovement` | Inventory |
| `PurchaseRequest` / `PurchaseOrder` | Procurement |
| `BoqDoc` / `BoqLine` | Estimation |
| `Invoice` / `Payment` / `Expense` | Finance |
| `Document` | File management |
| `AuditLog` | Compliance trail |

---

## 11. Configuration & Dependency Changes

### 11.1 Frontend (`package.json`)

**Added:**
```json
"zustand": "^5.0.14"
```

**Existing stack preserved:**
- Next.js 16, React 19, framer-motion, lucide-react, lenis, clsx, tailwind-merge

### 11.2 `next.config.mjs`

```javascript
images: {
  qualities: [75, 100],
}
```

### 11.3 `eslint.config.mjs`

```javascript
globalIgnores: ["backend/**", ...]
```

---

## 12. Bugs Fixed During Implementation

| # | Issue | File | Fix |
|---|-------|------|-----|
| 1 | React Compiler: setState in effect | `src/app/erp/layout.js` | Replaced `useEffect`+`useState` with `useSyncExternalStore` for hydration |
| 2 | React Compiler: variable reassignment in render | `src/components/erp/Charts.js` (Donut) | Immutable `lens`/`offsets` arrays via `map`/`reduce` |
| 3 | React Compiler: setState in effect | `src/components/erp/CommandPalette.js` | Extracted `PaletteInner` sub-component that remounts on open |
| 4 | React Compiler: impure `Date.now()` in render | `src/components/erp/Gantt.js` | Static `TODAY = new Date("2026-06-09")` |
| 5 | React Compiler: hydration in AuthGate | `src/components/erp/AuthGate.js` | `useSyncExternalStore` for session hydration |
| 6 | Module not found after route move | `src/components/ProjectDetails.js` | Import path → `@/app/(marketing)/projects/[id]/page.module.css` |
| 7 | GST badge styling in compliance rows | `src/app/erp/(app)/gst/page.js` | Wrapped label in `.cLabel` span |
| 8 | Backend: tsconfig-paths version | `backend/package.json` | Changed `^4.2.1` → `^4.2.0` |
| 9 | Backend: missing DATABASE_URL | `backend/.env` | Copied from `.env.example` |
| 10 | Backend: Postgres port conflict | `backend/.env` | Used Docker Postgres on port 5433 |
| 11 | Backend: seed TS never[] inference | `backend/prisma/seed.ts` | Explicit `any[]` typing on seed arrays |

---

## 13. How to Run

### 13.1 Frontend (Marketing + ERP)

```bash
# From repo root
npm install
npm run dev          # http://localhost:3000

# Marketing site
open http://localhost:3000

# Enter ERP
open http://localhost:3000/erp/login
# Select any role → Continue
```

**Verify:**
```bash
npm run lint         # ESLint (React Compiler rules)
npm run build        # Production build
```

### 13.2 Backend (Standalone)

```bash
cd backend
cp .env.example .env
npm install

# Start database
docker compose up -d postgres redis

# Setup schema + seed
npm run prisma:generate
npm run prisma:migrate
npm run db:seed

# Run API
npm run start:dev    # http://localhost:4000/api
                     # Swagger: http://localhost:4000/docs
```

**Verify:**
```bash
npm run prisma:validate
npm run build
curl http://localhost:4000/api/health
```

---

## 14. What Is NOT Connected Yet

| Item | Status |
|------|--------|
| Frontend → Backend API calls | Not implemented — frontend uses `src/erp/data/` only |
| Real authentication | Dummy login with role selector |
| File uploads (S3) | UI placeholders only |
| WebSockets / real-time | Not implemented |
| ElasticSearch | Not implemented |
| GraphQL | REST only in backend scaffold |
| MFA | User model ready, UI not built |
| Email/SMS notifications | Mock notification store only |
| PWA / offline | Not implemented |
| Mobile native apps | Responsive web only |

**Phase 2 integration path:** Replace `src/erp/data/` imports with TanStack Query hooks calling `backend/` REST endpoints, module by module.

---

## 15. Complete File Index

### 15.1 Modified (8)

```
eslint.config.mjs
next.config.mjs
package.json
package-lock.json
src/app/layout.js
src/components/Footer.js
src/components/Footer.module.css
src/components/ProjectDetails.js
```

### 15.2 New — Backend (74)

```
backend/.gitignore
backend/Dockerfile
backend/README.md
backend/docker-compose.yml
backend/nest-cli.json
backend/package.json
backend/package-lock.json
backend/tsconfig.json
backend/tsconfig.build.json
backend/prisma/schema.prisma
backend/prisma/seed.ts
backend/src/main.ts
backend/src/app.module.ts
backend/src/config/configuration.ts
backend/src/prisma/prisma.module.ts
backend/src/prisma/prisma.service.ts
backend/src/common/decorators/current-user.decorator.ts
backend/src/common/decorators/public.decorator.ts
backend/src/common/decorators/roles.decorator.ts
backend/src/common/dto/pagination.dto.ts
backend/src/common/filters/all-exceptions.filter.ts
backend/src/common/guards/jwt-auth.guard.ts
backend/src/common/guards/roles.guard.ts
backend/src/common/interceptors/audit.interceptor.ts
backend/src/modules/auth/auth.controller.ts
backend/src/modules/auth/auth.module.ts
backend/src/modules/auth/auth.service.ts
backend/src/modules/auth/dto/login.dto.ts
backend/src/modules/auth/dto/register.dto.ts
backend/src/modules/auth/strategies/jwt.strategy.ts
backend/src/modules/boq/boq.controller.ts
backend/src/modules/boq/boq.module.ts
backend/src/modules/boq/boq.service.ts
backend/src/modules/clients/clients.controller.ts
backend/src/modules/clients/clients.module.ts
backend/src/modules/clients/clients.service.ts
backend/src/modules/clients/dto/client.dto.ts
backend/src/modules/documents/documents.controller.ts
backend/src/modules/documents/documents.module.ts
backend/src/modules/documents/documents.service.ts
backend/src/modules/employees/dto/employee.dto.ts
backend/src/modules/employees/employees.controller.ts
backend/src/modules/employees/employees.module.ts
backend/src/modules/employees/employees.service.ts
backend/src/modules/health/health.controller.ts
backend/src/modules/health/health.module.ts
backend/src/modules/inventory/inventory.controller.ts
backend/src/modules/inventory/inventory.module.ts
backend/src/modules/inventory/inventory.service.ts
backend/src/modules/invoices/dto/invoice.dto.ts
backend/src/modules/invoices/invoices.controller.ts
backend/src/modules/invoices/invoices.module.ts
backend/src/modules/invoices/invoices.service.ts
backend/src/modules/leads/dto/lead.dto.ts
backend/src/modules/leads/leads.controller.ts
backend/src/modules/leads/leads.module.ts
backend/src/modules/leads/leads.service.ts
backend/src/modules/procurement/procurement.controller.ts
backend/src/modules/procurement/procurement.module.ts
backend/src/modules/procurement/procurement.service.ts
backend/src/modules/projects/dto/project.dto.ts
backend/src/modules/projects/projects.controller.ts
backend/src/modules/projects/projects.module.ts
backend/src/modules/projects/projects.service.ts
backend/src/modules/tasks/tasks.controller.ts
backend/src/modules/tasks/tasks.module.ts
backend/src/modules/tasks/tasks.service.ts
backend/src/modules/users/users.controller.ts
backend/src/modules/users/users.module.ts
backend/src/modules/users/users.service.ts
backend/src/modules/vendors/dto/vendor.dto.ts
backend/src/modules/vendors/vendors.controller.ts
backend/src/modules/vendors/vendors.module.ts
backend/src/modules/vendors/vendors.service.ts
```

### 15.3 New — ERP App Routes (41)

```
src/app/(marketing)/layout.js
src/app/erp/layout.js
src/app/erp/erp-theme.css
src/app/erp/login/page.js
src/app/erp/login/login.module.css
src/app/erp/(app)/layout.js
src/app/erp/(app)/page.js
src/app/erp/(app)/dashboard.module.css
src/app/erp/(app)/leads/page.js
src/app/erp/(app)/leads/leads.module.css
src/app/erp/(app)/clients/page.js
src/app/erp/(app)/clients/clients.module.css
src/app/erp/(app)/projects/page.js
src/app/erp/(app)/projects/projects.module.css
src/app/erp/(app)/site/page.js
src/app/erp/(app)/site/site.module.css
src/app/erp/(app)/design/page.js
src/app/erp/(app)/design/design.module.css
src/app/erp/(app)/documents/page.js
src/app/erp/(app)/documents/documents.module.css
src/app/erp/(app)/boq/page.js
src/app/erp/(app)/boq/boq.module.css
src/app/erp/(app)/procurement/page.js
src/app/erp/(app)/procurement/procurement.module.css
src/app/erp/(app)/inventory/page.js
src/app/erp/(app)/inventory/inventory.module.css
src/app/erp/(app)/finance/page.js
src/app/erp/(app)/finance/finance.module.css
src/app/erp/(app)/gst/page.js
src/app/erp/(app)/gst/gst.module.css
src/app/erp/(app)/hr/page.js
src/app/erp/(app)/hr/hr.module.css
src/app/erp/(app)/portal/page.js
src/app/erp/(app)/portal/portal.module.css
src/app/erp/(app)/analytics/page.js
src/app/erp/(app)/analytics/analytics.module.css
src/app/erp/(app)/automation/page.js
src/app/erp/(app)/automation/automation.module.css
src/app/erp/(app)/ai/page.js
src/app/erp/(app)/ai/ai.module.css
src/app/erp/(app)/settings/page.js
src/app/erp/(app)/settings/settings.module.css
```

### 15.4 New — ERP Components (22)

```
src/components/erp/AuthGate.js
src/components/erp/Charts.js
src/components/erp/Charts.module.css
src/components/erp/CommandPalette.js
src/components/erp/Command.module.css
src/components/erp/DataTable.js
src/components/erp/DataTable.module.css
src/components/erp/Gantt.js
src/components/erp/Gantt.module.css
src/components/erp/KanbanBoard.js
src/components/erp/KanbanBoard.module.css
src/components/erp/Modal.js
src/components/erp/Modal.module.css
src/components/erp/nav.js
src/components/erp/Sidebar.js
src/components/erp/Skeleton.js
src/components/erp/Skeleton.module.css
src/components/erp/Shell.module.css
src/components/erp/Topbar.js
src/components/erp/layout.module.css
src/components/erp/ui.js
src/components/erp/ui.module.css
```

### 15.5 New — ERP Data & Stores (15)

```
src/erp/data/index.js
src/erp/data/boq.js
src/erp/data/clients.js
src/erp/data/documents.js
src/erp/data/finance.js
src/erp/data/inventory.js
src/erp/data/leads.js
src/erp/data/procurement.js
src/erp/data/projects.js
src/erp/data/team.js
src/erp/data/vendors.js
src/erp/lib/format.js
src/erp/stores/useNotifications.js
src/erp/stores/useSession.js
src/erp/stores/useUI.js
```

### 15.6 Relocated Marketing Pages (14)

```
src/app/(marketing)/page.js                          ← from src/app/page.js
src/app/(marketing)/page.module.css                  ← from src/app/page.module.css
src/app/(marketing)/template.js                      ← from src/app/template.js
src/app/(marketing)/about/page.js                    ← from src/app/about/page.js
src/app/(marketing)/about/page.module.css            ← from src/app/about/page.module.css
src/app/(marketing)/contact/page.js                  ← from src/app/contact/page.js
src/app/(marketing)/contact/page.module.css          ← from src/app/contact/page.module.css
src/app/(marketing)/portfolio/page.js                ← from src/app/portfolio/page.js
src/app/(marketing)/portfolio/page.module.css        ← from src/app/portfolio/page.module.css
src/app/(marketing)/services/page.js                 ← from src/app/services/page.js
src/app/(marketing)/services/page.module.css         ← from src/app/services/page.module.css
src/app/(marketing)/projects/[id]/page.js            ← from src/app/projects/[id]/page.js
src/app/(marketing)/projects/[id]/page.module.css    ← from src/app/projects/[id]/page.module.css
```

---

## Summary Counts

| Bucket | Files |
|--------|------:|
| Modified | 8 |
| New — Backend | 74 |
| New — ERP routes + theme + login | 41 |
| New — ERP components | 22 |
| New — ERP data/stores/lib | 15 |
| New — Marketing layout | 1 |
| **Total (161)** | **161** |
| Relocated marketing pages | 14 |
| **Grand total operations** | **175** |

---

*End of ERP Implementation Documentation*

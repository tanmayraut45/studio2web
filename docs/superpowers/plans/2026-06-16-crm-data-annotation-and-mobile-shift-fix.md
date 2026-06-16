# CRM Polish + Dummy-Data Annotation + Mobile Shift Fix — Implementation Plan

> **For agentic workers:** Each task below targets a single concern with explicit files and edits. Tasks tagged `[parallel-safe]` can run concurrently; tasks tagged `[serial-after: X]` must wait for task X.

**Goal:** Make CRM the production-ready model module (with localStorage-backed CRUD demonstrating where async storage plugs in), annotate every dummy-data file with crystal-clear "replace-with-API" instructions, and fix the mobile-only horizontal shift that's pushing all ERP content cards to the right.

**Architecture:**
- **Storage layer** — new `src/erp/lib/storage.js` exposes `createCollection(key, seed)` returning an async CRUD interface backed by `localStorage` (SSR-safe). Each dummy-data file gets a header comment + a `seed` export that the storage layer consumes on first load.
- **CRM example** — `src/erp/stores/useLeadsStore.js` (Zustand) hydrates from the storage layer; `src/app/erp/(app)/leads/page.js` becomes a real CRUD flow: Add / Edit / Delete via a Drawer-based form.
- **Mobile shift** — root-cause first (likely the `.searchBtn` in `Topbar.js` not collapsing to zero width on small screens, *or* a stale `min-width` in a child of `.content`). Apply targeted fix, then sweep every module's CSS module for incidental contributors.

**Tech Stack:** Next.js 16 (Turbopack), React 19, Zustand, Framer Motion, Lucide, custom CSS modules. No new deps.

---

## PART A — Mobile content shift fix

### Task A1 — Diagnose root cause `[wave 1, parallel-safe]`

**Files (read-only):**
- `src/components/erp/Shell.module.css`
- `src/components/erp/Topbar.js`
- `src/components/erp/Sidebar.js`
- `src/components/erp/ui.module.css` (the `.kpi`, `.panel`, `.pageHead` classes)
- `src/components/erp/layout.module.css`
- `src/app/erp/erp-theme.css`
- `src/app/erp/(app)/layout.js`

**Method:** Render the breakdown in your head: on `< 640px` viewport, sidebar is `display:none`, so `.main` is the only flex child of `.appShell`. `.content` has `padding: 0.85rem` on all sides and `margin: 0 auto`. If the cards visibly have *more* left margin than right, something inside `.content` must be wider than `.content`'s box (causing overflow that `overflow-x: hidden` clips on the right) OR something inside has `margin-left` larger than `margin-right`.

**Likely suspects (verify each):**
1. `.searchBtn` in Topbar has `min-width: 200px` (line 161 of Shell.module.css). The mobile override (line 301-302) only removes `min-width: 0` and hides children — verify the rule actually applies.
2. The `KpiCard`'s `.kpi` class might have `margin-left` baked in.
3. `motion.div` initial transform leftover.
4. A panel header with horizontal scroll.
5. The Topbar's `.searchBtn kbd` has `display: none` on mobile but the `<kbd>` outer wrapper might still leave width.

**Deliverable:** A short written diagnosis (under 200 words) naming the file, line number, and exact rule causing the shift. Hand back to the next task; do not make edits.

### Task A2 — Apply the fix to Shell + ui.module.css `[wave 2, serial-after: A1]`

**Files:**
- Modify whatever A1 identifies.

**Method:** Surgical edit only — change the smallest possible thing. After editing, mentally walk through the layout: `.appShell` → `.main` → `.content` → child cards. Each link should have symmetric horizontal box behavior on `< 640px`.

**Verify:** `npm run build` succeeds. (Visual verification happens after the user reloads in browser.)

### Task A3 — Sweep every module CSS for left-right asymmetry `[wave 3, parallel-safe after A2]`

**Files (audit, edit only if violations found):**
- All `*.module.css` under `src/app/erp/(app)/**`
- `src/components/erp/*.module.css`

**Method:** grep each file for any of these patterns inside a `@media (max-width: ...)` block — flag for review:
- `margin-left:` / `margin-right:` with different values
- `padding-left:` / `padding-right:` with different values
- `transform: translateX(...)` that's not zero
- `width:` larger than `100%` on a child of `.content`
- `min-width:` on grid/flex items that breaks on small screens

For each match, decide if it's intentional (e.g., drawer slide-in) or a bug; fix bugs only.

### Task A4 — `.kpi` card mobile rhythm `[wave 3, parallel-safe after A2]`

**Files:**
- `src/components/erp/ui.module.css` (the `.kpi`, `.kpiTop`, `.kpiValue`, `.kpiFoot`, `.kpiSpark`, `.tone_*` rules)

**Method:** Read the current rules; check that mobile (`@media (max-width: 640px)` or similar) gives the KPI cards:
- Even internal padding (no `padding-left ≠ padding-right`)
- `width: auto` (filling grid cell, not min-content)
- No `margin` on the card itself
If anything's off, fix. Otherwise leave untouched and report "no changes needed".

### Task A5 — `PageHeader` mobile balance `[wave 3, parallel-safe after A2]`

**Files:**
- `src/components/erp/ui.module.css` (the `.pageHead`, `.pageHeadLeft`, `.pageActions`, `.pageIcon`, `.pageTitle`, `.pageSub` rules)

**Method:** On mobile, the page header should stack icon+title+subtitle in a clean vertical or horizontal arrangement without a left-shifted icon dragging the title rightward. Audit and apply small fixes if needed (e.g., `flex-wrap: wrap`, even padding, max-width on subtitle so it doesn't push past the icon column).

---

## PART B — Dummy data annotation + async storage scaffold

### Task B1 — Build `src/erp/lib/storage.js` `[wave 1, parallel-safe]`

**Files:**
- Create: `src/erp/lib/storage.js`

**Required exports:**

```js
// SSR-safe async wrapper around localStorage.
// Each "collection" is keyed by name. On first load it seeds from the provided
// seed array; subsequent loads hydrate from storage.
//
// Usage:
//   const leadsStore = createCollection("leads", seedLeads);
//   await leadsStore.list()             // -> array
//   await leadsStore.get(id)            // -> item | null
//   await leadsStore.create(item)       // -> created item (id auto-assigned if absent)
//   await leadsStore.update(id, patch)  // -> updated item
//   await leadsStore.remove(id)         // -> boolean
//   leadsStore.subscribe(fn)            // -> unsubscribe; fires on every mutation
//
// When wiring to a real backend later, replace the internals of createCollection
// while keeping the same async interface. Pages/stores won't need to change.

export function createCollection(key, seed = []) { ... }
export function resetCollection(key) { ... }     // wipes localStorage for the key
export function exportAll() { ... }              // dump every collection (debug)
```

**Implementation notes:**
- Use `typeof window === "undefined"` guards so SSR doesn't crash.
- All methods return Promises (even though localStorage is sync) — this is intentional, so swapping in `fetch()` later is a no-op for consumers.
- Use a simple in-memory subscriber set so React stores can re-read on writes.
- ID generation: if item lacks `id`, generate `${key}-${Date.now()}-${randHex}`.
- Add a top-of-file comment explaining the contract and the migration path to a real API.

### Task B2 — CRM leads store + working CRUD UI `[wave 2, serial-after: B1]`

**Files:**
- Create: `src/erp/stores/useLeadsStore.js`
- Modify: `src/app/erp/(app)/leads/page.js`
- Possibly create: `src/app/erp/(app)/leads/LeadForm.js` (form component used inside Drawer)
- Possibly modify: `src/app/erp/(app)/leads/leads.module.css`

**Goal:** Make leads a real working CRUD demo so the user can see the pattern that will be replicated across modules.

**Store shape (Zustand):**
```js
useLeadsStore = {
  leads: [],
  hydrated: false,
  hydrate(): Promise<void>,           // calls leadsStore.list() and populates
  addLead(input): Promise<lead>,
  updateLead(id, patch): Promise<lead>,
  removeLead(id): Promise<void>,
}
```

**Page changes:**
- On mount, call `hydrate()`.
- Show a small "● Local store" badge in the header (so user sees that the data is now coming from localStorage, not the static module).
- Wire up the existing `Add Lead` button to open a Drawer with a form (name, phone, email, location, requirement, stage, value, source, score).
- Wire up the Drawer's `selected` lead to allow editing (form pre-filled) + a `Delete` button.
- Keep the existing kanban + table views working — they should re-render via the store.
- Keep all existing static imports (`leads`, `leadStages` from `@/erp/data`) — the store SEEDS from those on first hydration, so we keep them as the canonical default data.

**Comments inside the page file** explain the pattern:
```js
// HOW THIS WORKS:
// 1. On mount we call useLeadsStore.hydrate() which reads from localStorage.
// 2. First-ever load: storage is empty → seeded from src/erp/data/leads.js.
// 3. Every CRUD action goes through the store, which persists to localStorage.
// 4. To replace localStorage with a real API: change src/erp/lib/storage.js
//    only. Store + page stay identical.
```

### Task B3 — Annotate `leads.js` + `clients.js` `[wave 1, parallel-safe]`

**Files:**
- Modify: `src/erp/data/leads.js`
- Modify: `src/erp/data/clients.js`

**At the top of each file**, add a header comment block:

```js
// ============================================================================
// DUMMY SEED DATA — Leads
// ============================================================================
// This array is the FIRST-RUN seed for the leads collection in localStorage
// (see src/erp/lib/storage.js). After hydration, the runtime source of truth
// is the Zustand store (src/erp/stores/useLeadsStore.js), not this file.
//
// To swap to a real API:
//   1. Edit src/erp/lib/storage.js → replace localStorage internals with
//      fetch() calls to your /api/leads endpoints.
//   2. Leave this file untouched — it can either remain as fallback seed
//      data or be deleted once the backend is the only source.
//
// FIELD CONTRACT — each lead:
//   id          string  — primary key; "l1", "l2", … in seed; uuid in API
//   name        string  — full name of the lead
//   phone       string  — E.164-ish formatted
//   email       string
//   location    string  — "Area, City"
//   budget      number  — rupees (whole)
//   propertyType string
//   requirement string  — what they need (Full Interior, BOQ, etc.)
//   source      enum    — Instagram | Referral | Website | Meta Ads | …
//   style       string
//   timeline    string  — human readable ("3 months")
//   stage       enum    — see leadStages export below
//   score       number  — 0–100; >= 80 is "hot"
//   owner       string  — employee id (e1, e2, …)
//   lastTouch   string  — ISO date
//   value       number  — deal value in rupees
//   lostReason? string  — only present when stage === "Lost"
// ============================================================================
```

Replicate the pattern for `clients.js` with that file's field contract documented in detail.

### Task B4 — Annotate `projects.js` + `team.js` + `expenses.js` `[wave 1, parallel-safe]`

**Files:**
- Modify: `src/erp/data/projects.js`
- Modify: `src/erp/data/team.js`
- Modify: `src/erp/data/expenses.js`

Same treatment as B3. For each, document:
- It's first-run seed
- Where the live data will come from
- Complete field contract for every exported array
- Cross-references (e.g., `project.client` is a foreign key into `clients`)

### Task B5 — Annotate `documents.js` + `finance.js` + `inventory.js` + `vendors.js` `[wave 1, parallel-safe]`

**Files:**
- Modify: `src/erp/data/documents.js`
- Modify: `src/erp/data/finance.js`
- Modify: `src/erp/data/inventory.js`
- Modify: `src/erp/data/vendors.js`

Same treatment as B3/B4.

### Task B6 — Mark orphan data files as deprecated `[wave 1, parallel-safe]`

**Files:**
- Modify: `src/erp/data/boq.js`
- Modify: `src/erp/data/procurement.js`

These two were referenced by the modules we deleted in the previous PR. They're orphan data with no consumers right now. Add a top-of-file comment:

```js
// ============================================================================
// ORPHAN SEED DATA — kept for future BOQ/Procurement module reintroduction.
// No current consumers. Re-export from src/erp/data/index.js remains so
// removal here is a non-event for existing pages.
// ============================================================================
```

Do NOT delete the files or remove the re-exports — the user may want these modules back.

---

## Wave Dispatch

- **Wave 1 (parallel)** — A1, B1, B3, B4, B5, B6 → 6 agents
- **Wave 2 (after A1, B1)** — A2, B2 → 2 agents (run in parallel with each other since they touch different files)
- **Wave 3 (after A2)** — A3, A4, A5 → 3 agents in parallel
- **Final** — `npm run build`, commit, push (parent agent does this)

Total: **11 agent invocations**, 5 of which are design/UI-focused (A1, A2, A3, A4, A5).

---

## Acceptance criteria

1. On mobile (≤ 640px), every ERP page shows content cards with **visually equal left and right margins**. No card touches the right edge while the left has padding.
2. The leads page actually supports Add / Edit / Delete and persists via localStorage. Reloading the browser preserves new leads.
3. Every dummy-data file has a clearly-labeled header explaining it's a seed, what fields mean, and how to switch to a real API.
4. `npm run build` produces a clean build with 28 routes (unchanged route count).
5. No regressions in modules untouched by this plan.

---

## Self-review checklist (done by parent before dispatch)

- [x] Every task names actual files with paths
- [x] Every code-producing task has either complete code or an explicit contract
- [x] A2 depends on A1 (diagnosis before fix); B2 depends on B1 (storage lib before consumer)
- [x] No "TODO", "TBD", or "implement appropriately" placeholders
- [x] Field contracts in B3–B5 are real, not generic

# Full-ERP CRUD via localStorage Implementation Plan

> **For agentic workers:** Each task is a complete vertical slice (store → form → page wiring) for one entity. Tasks are independent — dispatch all 10 in parallel.

**Goal:** Every page in the ERP gets working CRUD via the existing `createCollection()` storage seam, so the user can Add / Edit / Delete data and have it persist across reloads. Pattern matches the already-shipped Leads module (commit `27cae7c`).

**Architecture:** Per-entity Zustand store backed by `src/erp/lib/storage.js`. Each page hydrates from store on mount, subscribes to mutations, and renders forms inside `<Drawer>` for Create/Edit. Delete uses `window.confirm`. No backend yet — every method is async-shaped so swapping to `fetch()` later is a single-file change.

**Tech Stack:** Next.js 16, React 19, Zustand 5, Framer Motion, custom CSS modules. The `LeadForm` pattern at `src/app/erp/(app)/leads/{page.js,LeadForm.js,LeadForm.module.css}` is the canonical reference — copy its shape for every entity.

---

## Canonical pattern (every agent follows this)

Per entity `X` in module `M`:

1. **`src/erp/stores/use{X}Store.js`** — Zustand store. Identical shape to `useLeadsStore.js`:

```js
"use client";
import { create } from "zustand";
import { createCollection } from "@/erp/lib/storage";
import { /* seed */ as seed } from "@/erp/data/{module}";

const Coll = createCollection("{collectionKey}", seed);

export const use{X}Store = create((set, get) => ({
  items: seed,
  hydrated: false,
  async hydrate() {
    if (get().hydrated) return;
    const items = await Coll.list();
    set({ items, hydrated: true });
    Coll.subscribe((next) => set({ items: next }));
  },
  async add(input)         { return await Coll.create(input); },
  async update(id, patch)  { return await Coll.update(id, patch); },
  async remove(id)         { return await Coll.remove(id); },
  async resetDemo()        { return await Coll.reset(); },
}));
```

2. **`src/app/erp/(app)/{module}/{X}Form.js`** + `{X}Form.module.css` — form modeled on `LeadForm.js`. Reuse the same `.form/.row/.field/.label/.input/.actions` class names — copy `LeadForm.module.css` if no module-specific styling is needed.

3. **`src/app/erp/(app)/{module}/page.js`** — refactor:
   - Import `use{X}Store` and the new `{X}Form`.
   - On mount: `useEffect(() => { hydrate(); }, [hydrate])`.
   - The "Add X" button opens a `<Drawer>` with `<{X}Form onSubmit={...} onCancel={...} />`.
   - Existing detail Drawer gets an Edit toggle (renders `<{X}Form initial={selected} ...>`) + Delete button (with `window.confirm`).
   - All KPIs/derived state computed inside the component from store items, not from the static import.

---

## Tasks (10 parallel agents)

### Task 1 — Clients CRUD
- Create: `src/erp/stores/useClientsStore.js`
- Create: `src/app/erp/(app)/clients/ClientForm.js`
- Create: `src/app/erp/(app)/clients/ClientForm.module.css`
- Modify: `src/app/erp/(app)/clients/page.js`
- Collection key: `"clients"`. Seed: `clients` from `@/erp/data/clients`.
- Form fields (from client field contract): name, company, type (Residential/Commercial/Hospitality), email, phone, gst, pan, billing, site, decisionMaker, budgetFlex (Low/Medium/High), rating (1–5), style, lifetimeValue (number), since (date), status (Active/Inactive/Archived).
- Initials auto-derived from company on submit if missing.
- "Add Client" button opens form. Click client card → drawer with Edit/Delete. KPIs (Total Clients, Lifetime Value) re-computed from store on every render.

### Task 2 — Projects CRUD
- Create: `src/erp/stores/useProjectsStore.js`
- Create: `src/app/erp/(app)/projects/ProjectForm.js`
- Create: `src/app/erp/(app)/projects/ProjectForm.module.css`
- Modify: `src/app/erp/(app)/projects/page.js`
- Collection key: `"projects"`. Seed: `projects` from `@/erp/data/projects`.
- Form fields: name, code, client (select from clients), location, type, manager (select from employees), team (multi-select employees — render as checklist), stage (select from projectStages), progress (0–100), health (on-track/at-risk/delayed), budget, actual, committed, margin, start (date), due (date), risk (Low/Medium/High).
- "New Project" button opens form. Click project card → drawer; add Edit + Delete buttons at the top of the drawer. All KPIs (Active Projects, Contract Value, Avg Completion, Open Snags) derive from store.
- Do NOT touch tasks/snags/milestones data on this task — those remain static for now.

### Task 3 — Documents CRUD
- Create: `src/erp/stores/useDocumentsStore.js`
- Create: `src/app/erp/(app)/documents/DocumentForm.js`
- Create: `src/app/erp/(app)/documents/DocumentForm.module.css`
- Modify: `src/app/erp/(app)/documents/page.js`
- Collection key: `"documents"`. Seed: `documents` from `@/erp/data/documents`.
- Form fields: name, type (select PDF/DWG/XLSX/image/Other), project (select from projects via `useProjectsStore` if hydrated, else seed projects from `@/erp/data`), uploadedBy → use current `useSession.user.id` if available else default to "e1", uploadedAt (auto = today ISO), size (number, KB), revision (text e.g. "R1"), status (draft/in-review/locked/final), url (text path).
- "Upload" button opens the form (metadata-only — no real file upload). Each document row gets an inline Delete button or a click → confirm → delete flow.
- KPIs (Total Files, Locked / Final, Latest Revisions, Storage) re-computed from store.

### Task 4 — Inventory Materials CRUD
- Create: `src/erp/stores/useMaterialsStore.js`
- Create: `src/app/erp/(app)/inventory/MaterialForm.js`
- Create: `src/app/erp/(app)/inventory/MaterialForm.module.css`
- Modify: `src/app/erp/(app)/inventory/page.js`
- Collection key: `"materials"`. Seed: `materials` from `@/erp/data/inventory`.
- Form fields: name, sku, category, uom (sqft/piece/kg/litre/m), rate (number), onHand (number), reorder (number), damaged (number, default 0), warehouse (select from warehouses static data), supplier (select from vendors static data).
- "Add Material" button opens form. Each material row → click opens a small drawer with Edit + Delete.
- KPIs (Stock Value, Low Stock, Damaged Value, Locations) computed from store.

### Task 5 — Stock Movements log
- Create: `src/erp/stores/useStockMovementsStore.js`
- Create: `src/app/erp/(app)/inventory/MovementForm.js` (no CSS module — reuse `MaterialForm.module.css`)
- Modify: `src/app/erp/(app)/inventory/page.js` (only: add the "Log Movement" button + drawer wiring; do NOT touch other inventory functionality — that's Task 4's territory)
- **Dependency on Task 4**: this task touches the same page.js. Convention: Task 4 owns Add Material; Task 5 owns Log Movement. Both write to the same page.js — Task 5 should layer ITS changes on top of Task 4's (assume Task 4 completes first, OR write defensively).
- Collection key: `"stock-movements"`. Seed: `stockMovements` from `@/erp/data/inventory`.
- Form fields: material (select from materials store), type (inward/outward/transfer/adjustment/damage), qty (number — positive for inward, negative auto-applied for outward/damage), when (datetime-local, auto = now), ref (text — PO/project code), by (select from employees, default current user).
- "Log Movement" button next to "Add Material" opens this form. On submit also updates the material's `onHand` field (subtract for outward/damage; add for inward; transfer no-op for now).
- **NOTE**: to avoid race conditions with Task 4, this task should be dispatched AFTER Task 4 completes. Mark it serial.

### Task 6 — Invoices CRUD (GST page)
- Create: `src/erp/stores/useInvoicesStore.js`
- Create: `src/app/erp/(app)/gst/InvoiceForm.js`
- Create: `src/app/erp/(app)/gst/InvoiceForm.module.css`
- Modify: `src/app/erp/(app)/gst/page.js`
- Collection key: `"invoices"`. Seed: `invoices` from `@/erp/data/finance`.
- Form fields: code (auto-suggest "INV-YYYY-NNN"), project (select from projects), client (select from clients), type (advance/milestone/retention/full), amount (number, pre-GST), gst (number — auto-fill 18% of amount on first entry, editable), issued (date), due (date), status (draft/sent/partially paid/paid/overdue).
- "Add Invoice" button (currently doesn't exist on the GST page — add it to PageHeader). Click invoice row → drawer with Edit + Delete + "Mark as Paid" quick button.
- Read the existing `gst/page.js` first to understand its current layout before refactoring.

### Task 7 — Expenses (HR page) — editable + add
- Create: `src/erp/stores/useExpensesStore.js` — manages all three collections (office, marketing, other) under one store
- Create: `src/app/erp/(app)/hr/ExpenseForm.js`
- Create: `src/app/erp/(app)/hr/ExpenseForm.module.css`
- Modify: `src/app/erp/(app)/hr/page.js`
- Collection keys: `"expenses-office"`, `"expenses-marketing"`, `"expenses-other"`. Seed each from the corresponding export in `@/erp/data/expenses`.
- Store exposes `office`, `marketing`, `other` arrays + `add(category, item)`, `update(category, id, patch)`, `remove(category, id)`. Each expense line gets an `id` if missing (storage lib handles that).
- In `hr/page.js`: each expense sub-card now has an "+ Add" link in its header that opens a small form (label + amount). Each line item has an inline pencil + trash icon on hover/tap → edit/delete.
- KPIs at top (Total Expenses, Salaries Net, Operating Burn) recompute on store change.

### Task 8 — Automations toggle + edit + add
- Create: `src/erp/stores/useAutomationsStore.js`
- Create: `src/app/erp/(app)/automation/AutomationForm.js`
- Create: `src/app/erp/(app)/automation/AutomationForm.module.css`
- Modify: `src/app/erp/(app)/automation/page.js`
- Collection key: `"automations"`. Seed: `automations` from `@/erp/data/documents`.
- Form fields: name, trigger (text), action (text), active (boolean toggle).
- The existing automation toggle UI (`.switch.on .knob` with `translateX`) wires to `update(id, { active: !active })`. Add "New Automation" button → form drawer. Each rule row gets Edit + Delete.

### Task 9 — AI Insights acknowledge/dismiss
- Create: `src/erp/stores/useAiInsightsStore.js`
- Modify: `src/app/erp/(app)/ai/page.js`
- Modify: `src/app/erp/(app)/page.js` (dashboard, where insights are also shown)
- Collection key: `"ai-insights"`. Seed: `aiInsights` from `@/erp/data/documents`.
- Each insight item gains a `dismissed: boolean` field; default false (mutate the seed-derived array shape conservatively — preserve unknown fields).
- Add a "Dismiss" button on each insight card. Dismissed insights are filtered out of the page render but remain in storage (so reset shows them again).
- Add a "Generate" button at the top that does NOT call anything real — it pushes a synthetic insight (title "New insight detected", body randomized from a small fixed list, module = "Operations", confidence = 70 + Math.floor(Math.random()*30)) via `add()`. Use a small static array of 5 candidate insight bodies so this is deterministic per click but not boring on repeat.
- No new form file — actions are just buttons in the page.

### Task 10 — Dashboard reads from stores
- Modify: `src/app/erp/(app)/page.js`
- The dashboard currently imports static data: `kpis`, `projectProfitability`, `cashFlow`, `leadFunnel`, `activityLog`, `aiInsights`. After Tasks 1, 2, 6, 9 ship, four of those derivatives go stale.
- Wire the dashboard to read from `useLeadsStore`, `useProjectsStore`, `useInvoicesStore`, `useAiInsightsStore` on mount (`hydrate()` for each). Recompute the KPI numbers from the live store data instead of from `kpis` (drop the `kpis` import or use it as fallback only when stores aren't hydrated yet).
- Specifically:
  - `Portfolio Value` = sum of `projects.budget` from store
  - `Profit Margin` = weighted by budget, from store
  - `Receivables` = unpaid invoices total (amount + gst) from store
  - `Active Projects` = `projects.length` from store
  - `leadFunnel` regenerated from `useLeadsStore` (count by stage)
  - `aiInsights` first 3 from `useAiInsightsStore`, filtered for not-dismissed
- **Dependency**: this task MUST run last (after 1, 2, 6, 9). Mark it serial.

---

## Wave dispatch

- **Wave A (parallel, 7 agents)**: Tasks 1, 2, 3, 4, 6, 7, 8
- **Wave B (parallel, 2 agents)**: Tasks 5 (after Task 4) and Task 9 (independent — could be in wave A but kept here for batch sizing)
- **Wave C (1 agent)**: Task 10 (after Tasks 1, 2, 6, 9 complete)
- **Parent**: build verification + commit + push

Total: **10 agents**.

---

## Acceptance criteria

1. Every page lists below works for Add / Edit / Delete and persists across reload:
   - Clients, Projects, Documents, Inventory (materials), Stock Movements, Invoices, Expenses, Automations, AI Insights.
2. Dashboard KPIs update when underlying data changes (verified by editing a project budget and watching the Portfolio Value KPI change).
3. `npx --no-install next build` succeeds — 28 routes, no new warnings.
4. No regressions in pages not covered here (analytics, portal, hr-attendance, leads).

---

## Self-review

- [x] Every task names exact files
- [x] Pattern is documented once at the top and referenced
- [x] Dependencies marked (Task 5 → after Task 4, Task 10 → after 1/2/6/9)
- [x] No "TODO" / "implement appropriately" placeholders
- [x] Field contracts match the data files (we documented those in commit 27cae7c)
- [x] Storage keys are unique (`leads`, `clients`, `projects`, `documents`, `materials`, `stock-movements`, `invoices`, `expenses-office/marketing/other`, `automations`, `ai-insights`)

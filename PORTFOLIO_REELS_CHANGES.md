# Portfolio Reels — Local Change Log

**Status:** Local only. Nothing committed, nothing pushed.
**Date:** 2026-06-22

Replaced the AI-generated portfolio imagery with real on-site walkthrough videos from the Studio II YouTube channel (`@studio2_arch`) and Instagram (`@studio_2_arch`). The old AI data and image assets remain untouched on disk so reverting is one git command.

---

## What the user sees now

| Page | Before | After |
| --- | --- | --- |
| `/portfolio` | 6 generic AI cards (Traditional, Modern Luxury, Contemporary, Commercial Space, Villas, Architectural Planning) | Editorial header → 16:9 featured hero for the long-form "Site" walkthrough → 4 portrait cards "Site 2 / 3 / 4 / 5" → follow chip (IG + YouTube). Cinema lightbox plays any reel with ←/→/ESC navigation. |
| `/projects/site` (and 4 short slugs) | AI hero image + static gallery | Real walkthrough detail page. Wide layout for the long-form; **side-by-side** layout for portrait shorts (video left, notes + sidebar right). "Watch on YouTube" + Instagram CTAs. Continue strip with sibling reels. |
| `/projects/1` … `/projects/6` (old AI URLs) | Rendered AI project page | **404** — unreachable. Data file still on disk for one-command revert. |
| `/` (homepage Selected Works) | 3 hard-coded AI ProjectCards (`/images/project1.png` etc.) | 3 real `HomeReelTile` cards (Site 5, 4, 3) — zero AI imagery in rendered HTML. |
| Footer Instagram icon | `https://instagram.com` placeholder | `https://www.instagram.com/studio_2_arch` |

Posters come from YouTube's CDN (`i.ytimg.com`):
- Vertical Shorts → `/oar2.jpg` (native 9:16, high-res)
- Long-form video → `/sddefault.jpg` (`maxresdefault.jpg` 404s for that ID)
- Both fall back to `/hqdefault.jpg` via `onError` (universal 200 across all video IDs).

---

## All 19 file changes

### Modified (6)

#### 1. `src/app/(marketing)/page.js`
- Replaced `ProjectCard` import with `HomeReelTile` + `shortReels` data.
- Replaced the 3 hard-coded `<ProjectCard image="/images/projectN.png">` blocks with a `.map` over `shortReels.slice(0, 3)` rendering `<HomeReelTile reel={...} />`.
- Section label changed: "Selected Works" → "Selected Works · On Site".
- "View All" link now carries an `ArrowUpRight` icon.

#### 2. `src/app/(marketing)/page.module.css`
- `.projectCardWrapper` width reduced from `80vw` → `72vw` (mobile) and `40vw` → `34vw` (desktop) to suit the new 4:5 tile aspect ratio.
- Added `.sectionHeader .viewAllBtn` flex rule for the new icon alignment.

#### 3. `src/app/(marketing)/portfolio/page.js`
- Completely rewritten.
- Removed `ProjectCard` + `projects` data import.
- Now renders an editorial header (gold eyebrow, "The *Work*, filmed where it lives" title, subtitle, pulsing marker row) + `<ReelsShowcase />`.

#### 4. `src/app/(marketing)/portfolio/page.module.css`
- Completely rewritten.
- New tokens: gold corner ornaments on `.headerWrap::before/::after`, gold-underline `.eyebrow`, italic-gold "Work" treatment, pulsing dot in `.markersRow`.

#### 5. `src/app/(marketing)/projects/[id]/page.js`
- `generateStaticParams` now sources only `reels` (not the legacy `projects` array). Old `/projects/1..6` URLs return 404 by design.
- Renders the new `<ReelDetails />` component instead of `<ProjectDetails />`.

#### 6. `src/components/Footer.js`
- Instagram anchor `href` fixed: `https://instagram.com` → `https://www.instagram.com/studio_2_arch`.
- Added an `aria-label` for the icon.

### Added (13 — 6 new components × js/css pair + 1 data file)

#### 7. `src/data/reels.js`
Single source of truth for all real reels. 5 entries (1 featured long-form + 4 shorts). Exports:
- `reels` — full array
- `featuredReel` — first entry with `featured: true`
- `shortReels` — only `ytType: "short"` entries
- `getReel(slug)` — lookup helper
- `ytPoster(reel)` / `ytPosterFallback(reel)` / `ytPosterWide(reel)` — picks the right YT CDN thumbnail per video type
- `studioChannel` — IG handle / IG URL / YouTube URL constants

#### 8 + 9. `src/components/ReelLightbox.js` / `.module.css`
The cinema-style modal player.
- React portal to `document.body` (escapes any z-index/overflow trap).
- Locks page scroll while open.
- ESC closes; ←/→ navigate between reels.
- Backdrop blur + faint film-grain SVG overlay.
- YT iframe with `autoplay=1, rel=0, modestbranding=1, playsinline=1, controls=1, color=white`.
- Portrait (9:16) sizing for shorts, wide (16:9) for long-form.
- Gold close button (rotates 90° on hover), gold side-arrow nav buttons, "Watch on YouTube" caption link.

#### 10 + 11. `src/components/ReelHero.js` / `.module.css`
Featured 16:9 hero player used at the top of `/portfolio`.
- Full-bleed poster (sddefault for video), gold eyebrow with pulse dot + duration, large Bodoni Moda title, location/year/category meta.
- Large gold play button top-right (custom ring + filled triangle).
- Decorative viewfinder corner brackets that brighten on hover.
- Hover: Ken Burns zoom on image + skewed scan-line sweep across the frame + gold halo box-shadow.
- Entire frame is a single accessible button → opens `ReelLightbox`.

#### 12 + 13. `src/components/ReelCard.js` / `.module.css`
Portrait 9:16 card used in the "On Site" grid.
- YT vertical thumbnail (`oar2.jpg`), gold play button bottom-right, mono index badge top-left (01/02/03/04), gold viewfinder corners on hover.
- Hover: lift -4px, gold border-glow, image saturate/zoom, title becomes gold.
- Click opens the lightbox via the parent showcase.
- Framer Motion stagger entry per `index` prop.

#### 14 + 15. `src/components/ReelsShowcase.js` / `.module.css`
The orchestrator that owns lightbox state for `/portfolio`.
- Renders `ReelHero` (featured) + "On Site" section header + `ReelCard` grid + follow bar + `ReelLightbox`.
- Manages `openIndex` state, `navigate(delta)` cycles through `reels` with wrap-around (mod length).
- Follow bar: subtle hairlines top/bottom centered on a gold pin, two pill buttons (`@studio_2_arch` IG primary gold-tinted + `@studio2_arch` YT secondary).
- Grid: 1 col (mobile) → 2 col (≥600px) → 4 col (≥1024px).

#### 16 + 17. `src/components/ReelDetails.js` / `.module.css`
The `/projects/[slug]` detail page component.
- Atmospheric backdrop: the poster image blurred 80px + dimmed, sits behind page content. Gives each detail page its own ambient palette without leaving the dark theme.
- Top row: gold "back" pill linking to `/portfolio`, crumb with pulsing gold dot.
- Header: category eyebrow, big Bodoni Moda title, meta row (location · year · duration).
- **Two layout modes:**
  - `layoutWide` (long-form video) — block flow, full-width 16:9 stage on top, 2-col body below (description left / sidebar right on desktop).
  - `layoutPortrait` (shorts) — on desktop, CSS grid: sticky 9:16 stage left (max 400px), description + sidebar single-column right.
- Player itself is a static `<section>` (no framer-motion gate) — content-critical UI never hidden behind animations. Click the gold play button → swaps poster for autoplay iframe.
- Sidebar: glass card with 40px gold hairline top, stat list (Discipline / Location / Year / Length), `Watch on YouTube` + IG CTAs.
- Continue strip: 3 sibling reels as portrait cards linking to their detail pages.

#### 18 + 19. `src/components/HomeReelTile.js` / `.module.css`
Lightweight teaser card used on the homepage horizontal-scroll strip.
- 4:5 aspect (not 9:16) so the homepage strip doesn't tower at mobile widths.
- YT vertical thumbnail + film-grain overlay + bottom gradient veil.
- Category pill (top-left), gold play button (bottom-right, fills gold on hover).
- Whole tile is a `<Link>` to `/portfolio` (homepage is a teaser, not the destination).
- Hover: lift, gold border, image zoom, title gold-shift.

---

## What is INTACT (revert insurance)

These files were **not touched**:
- `src/data/projects.js` — still contains all 6 AI project entries.
- `src/components/ProjectCard.js` + `.module.css` — still works.
- `src/components/ProjectDetails.js` — still works (just not referenced any more).
- `public/images/project1.png`, `project2.png`, `project3.png`, `hero.png` — still on disk.

So `/projects/1..6` will reappear instantly if `src/app/(marketing)/projects/[id]/page.js` is reverted.

---

## How to revert (if you don't like it)

**Restore the 6 modified files:**
```bash
git restore src/app/\(marketing\)/page.js \
            src/app/\(marketing\)/page.module.css \
            src/app/\(marketing\)/portfolio/page.js \
            src/app/\(marketing\)/portfolio/page.module.css \
            src/app/\(marketing\)/projects/\[id\]/page.js \
            src/components/Footer.js
```

**Remove the 13 added files:**
```bash
rm src/data/reels.js \
   src/components/Reel{Hero,Card,Lightbox,Details,sShowcase}.js \
   src/components/Reel{Hero,Card,Lightbox,Details,sShowcase}.module.css \
   src/components/HomeReelTile.js \
   src/components/HomeReelTile.module.css
```

**Remove this doc** (optional):
```bash
rm PORTFOLIO_REELS_CHANGES.md
```

---

## How to add a new reel later

Open `src/data/reels.js`, copy any entry, change:
- `id` / `slug` (used for `/projects/{slug}` URL)
- `title`, `subtitle`, `category`, `location`, `year`
- `ytId` (just the ID — extract from `https://youtube.com/shorts/<ID>` or `https://youtu.be/<ID>`)
- `ytUrl` (full link)
- `ytType: "short"` for vertical 9:16, `"video"` for horizontal 16:9
- `description`

The new entry appears in `/portfolio` and gets its own `/projects/<slug>` detail page automatically. Posters come from YouTube; no asset upload needed.

---

## Verification done

- Dev server at `http://localhost:3000` confirmed: `/`, `/portfolio`, `/projects/site`, `/projects/site-{2,3,4,5}` all return 200.
- `/projects/1` returns 404 (AI URL correctly hidden).
- HTML scan: 0 references to `/images/project1.png`, `project2.png`, `project3.png` in `/` or `/portfolio` rendered HTML.
- 5 YouTube poster URLs (`i.ytimg.com/vi/...`) rendered on `/portfolio` (4 × `oar2.jpg` for shorts + 1 × `sddefault.jpg` for the long-form).
- Headless screenshots captured at `/tmp/studio2-shots/` for desktop + mobile of `/`, `/portfolio`, `/projects/site`, `/projects/site-2`.
- Both layouts (wide + portrait) confirmed visually correct; cinema lightbox opens and closes via JS.

Nothing committed. Nothing pushed.

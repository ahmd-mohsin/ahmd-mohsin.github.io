# Website Revamp Design Spec
**Date:** 2026-06-11  
**Scope:** Full visual revamp of ahmd-mohsin.github.io — same content, completely new aesthetic  
**Reference:** blackforest.ai color language + editorial list layout

---

## 1. Design Goals

- Replace the amber/yellow academic card aesthetic with a dark forest-green-black palette
- Convert multi-column card grids (publications, news) to spacious editorial list layouts
- Achieve a "simple, classy, aesthetic" feel — no glows, no gradients on content, no rounded corners
- Keep all existing content, section order, and animations (simplified to fade-only)
- Zero regressions: mobile responsive, all links/interactions preserved

---

## 2. Color System

Replace all Tailwind `yellow-*` and `amber-*` classes. New tokens defined in `globals.css` as CSS custom properties:

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#070d07` | Page background |
| `--surface` | `#0d150c` | Lifted surfaces (used sparingly) |
| `--border` | `#1a2818` | All hairline borders |
| `--text-primary` | `#f0f4ee` | Strong emphasis: headings, org names |
| `--text-body` | `#c8d4c0` | Main body text |
| `--text-secondary` | `#7a9472` | Labels, captions, descriptions |
| `--text-muted` | `#3d5239` | Dates, metadata, mono labels |
| `--accent` | `#5a8c52` | Links, active states, accent text |
| `--accent-bright` | `#7ab870` | Hover state for accent elements |

Map these to Tailwind via `tailwind.config.ts` extensions so classes like `text-body`, `text-secondary`, `border-border`, `bg-surface`, `text-accent` work throughout. Also update `fontFamily.display` in `tailwind.config.ts` from `Space Grotesk` to `Inter` so existing `font-display` classes still compile without error.

---

## 3. Typography

- **Remove** Space Grotesk as the display font. Use **Inter** for all headings and body — unified, clean.
- **Keep** JetBrains Mono for all monospace elements (venue labels, dates, nav links, metadata).
- **Font weights:** `font-normal` (400) for body, `font-medium` (500) for secondary labels, `font-semibold` (600) for org/paper titles, `font-bold` (700) for section headings and name.
- **Section heading size:** `text-xs font-mono uppercase tracking-[0.2em]` in `text-muted` — small label style above content, not giant h2.
- **Update** `globals.css`: remove Space Grotesk import, keep Inter + JetBrains Mono.

---

## 4. Global Geometry Rules

- **No rounded corners** anywhere — remove all `rounded-*` classes, replace with `rounded-none` or nothing.
- **Borders are always `1px`** in `--border` color. No thick borders.
- **No box shadows.** No glow effects (`shadow-[...]`). No `blur-*` on content elements.
- **No background gradients** on cards or section content.
- **Animations:** Framer Motion fade-in only — `opacity: 0 → 1`, `duration: 0.4`, no `y` translation, no `scale`. `whileInView` stays with `viewport={{ once: true }}`.

---

## 5. Component Changes

### 5.1 Navigation (`Navigation.tsx`)
- Height: `h-10` (from `h-14`)
- Background: `bg-[#070d07]/90` — no `backdrop-blur`
- Bottom border: `border-b border-[#1a2818]`
- Logo `mohsin`: `text-[#f0f4ee] font-mono text-sm`
- Nav links: `text-[#7a9472] hover:text-[#f0f4ee]` — remove `uppercase tracking-widest`, keep `font-mono text-xs`
- Mobile menu background: `bg-[#070d07]`

### 5.2 Hero Section (`HeroSection.tsx`)
- Section background: `bg-[#070d07]` — remove all radial gradient blobs and glow `div`s
- Photo ring: `border border-[#1a2818]` — remove `ring-*`, remove `shadow-[...]`, remove glow `div`
- Photo container background: `bg-[#0d150c]`
- Name `h1`: `text-[#f0f4ee] font-bold` — remove `lowercase`, remove `drop-shadow-[...]`
- Affiliation `p`: `text-[#7a9472] italic` — remove yellow link colors, links become `text-[#5a8c52] hover:text-[#7ab870]`
- Divider line: `bg-[#1a2818]` (keep the `h-px` line)
- Research description `p`: `text-[#c8d4c0]`
- Social icons: remove `border` wrapper circles — render as plain icon buttons: `text-[#3d5239] hover:text-[#7ab870] transition-colors`
- Conoid badge: `border border-[#1a2818] text-[#5a8c52] hover:text-[#7ab870] hover:border-[#5a8c52]` — remove background tint

### 5.3 Section Component (`Section.tsx`)
- Remove the decorative `w-8 h-[1px] bg-primary/50 block` span from section titles
- Section title: change to `text-xs font-mono uppercase tracking-[0.2em] text-[#3d5239] mb-8` — small label above content, not a large h2
- Section padding: keep `py-24 md:py-32`
- `border-b border-[#1a2818]` divider between sections — keep

### 5.4 Research Interests (`ResearchInterestsSection.tsx`)
- Remove the `fieldset` + `legend` "Main Area" box entirely — render the main paragraph as a plain `p` in `text-[#7a9472]` with `mb-10`
- Interest rows: remove the outer `rounded-2xl border` wrapper box
- Each row: `border-t border-[#1a2818] py-6` (top border only, no bottom)
- Row title: `text-[#f0f4ee] font-semibold text-sm mb-2`
- Row description: `text-[#7a9472] text-sm leading-relaxed mb-3`
- Venue tag: `font-mono text-xs text-[#3d5239]` — plain text, no border

### 5.5 Experience (`ExperienceSection.tsx`)
- Remove outer `rounded-2xl border` wrapper — use a plain stacked list
- Each experience: `border-t border-[#1a2818] py-8` (first item has no top border)
- Org name: `text-[#f0f4ee] font-semibold text-base mb-1`
- Date/advisor line: `font-mono text-xs text-[#3d5239] mb-4`
- Project name: `text-[#c8d4c0] text-sm font-medium mb-2`
- Bullet text: `text-[#7a9472] text-sm leading-relaxed`

### 5.6 Publications (`ResearchSection.tsx`)
- Remove all `PaperCard` grid layout — replace with flat editorial list
- Each paper row: `border-t border-[#1a2818] py-6 flex flex-col gap-2`
- Venue+year: `font-mono text-xs text-[#3d5239]` on its own line (e.g. `NeurIPS 2026 · in progress`)
- Title: `text-[#f0f4ee] text-sm font-semibold leading-snug`
- Authors: `text-[#7a9472] text-xs leading-relaxed`
- Links: `font-mono text-xs text-[#5a8c52] hover:text-[#7ab870] underline underline-offset-4`
- "Show More" button: plain text `font-mono text-xs text-[#3d5239] hover:text-[#7a9472] mt-8` — no border pill
- Initial visible count: first 6 papers (not 8), expand to show all

### 5.7 Conference Travels (`ConferenceTravelsSection.tsx`)
- Remove outer `border border-white/20 bg-white/[0.02]` wrapper
- Carousel wrapper: plain `relative overflow-hidden`
- Arrow buttons: remove background/border — plain `text-[#3d5239] hover:text-[#c8d4c0]` with `←` / `→` icon only
- Dot indicators: replace circles with `w-6 h-px` dash lines — `bg-[#1a2818]` inactive, `bg-[#5a8c52]` active
- Caption overlay gradient: `from-[#070d07]/80` (match new background)
- Event/location text: `text-[#f0f4ee]` / `text-[#7a9472]`

### 5.8 News (`NewsSection.tsx`)
- Remove the outer `rounded-2xl border` grid wrapper
- Layout: single-column list of rows
- Each row: `border-t border-[#1a2818] py-5 flex gap-8 items-start`
- Date (left): `font-mono text-xs text-[#3d5239] w-28 shrink-0 pt-0.5` — no badge box
- Content (right): `text-[#7a9472] text-sm leading-relaxed`
- Remove all `md:grid-cols-3` — fully linear

### 5.9 Service & Awards (`ReviewerSection.tsx`)
- Remove all `fieldset` / `legend` elements — replace each with a plain subsection:
  - Label: `font-mono text-xs uppercase tracking-[0.2em] text-[#3d5239] mb-4`
  - Followed by content
- Conference/journal/TPC tags: `border border-[#1a2818] px-3 py-1.5 font-mono text-xs text-[#7a9472]` — no rounded corners
- Leadership items: same tag style with `text-[#5a8c52]` for the role
- Awards: plain lines `text-[#7a9472] text-sm` — no `★` emoji, just an em-dash prefix `—`
- Travel grants: same tag style as other chips
- Space between subsections: `pt-10 border-t border-[#1a2818]` (first subsection has no top border)
- Remove `bg-white/[0.02]` section background

### 5.10 Contact (`ContactSection.tsx`)
- Intro text: `text-[#7a9472]`
- Email row: icon in `text-[#3d5239]`, text in `text-[#5a8c52] hover:text-[#7ab870]`
- Location row: icon in `text-[#3d5239]`, text in `text-[#7a9472]`
- Remove square icon box wrappers — plain inline icons

### 5.11 Footer (`Footer.tsx`)
- `border-t border-[#1a2818]`
- Text: `text-[#3d5239] font-mono text-xs`

---

## 6. Files to Change

| File | Change type |
|------|-------------|
| `src/app/globals.css` | New CSS custom properties, remove Space Grotesk import |
| `tailwind.config.ts` | Extend colors with new design tokens |
| `src/components/Navigation.tsx` | Restyle |
| `src/components/HeroSection.tsx` | Restyle (remove glows, update colors) |
| `src/components/Section.tsx` | Restyle heading to mono label |
| `src/components/ResearchInterestsSection.tsx` | Remove fieldset, restyle rows |
| `src/components/ExperienceSection.tsx` | Remove card border wrapper, restyle |
| `src/components/ResearchSection.tsx` | New editorial list layout (replace PaperCard) |
| `src/components/ConferenceTravelsSection.tsx` | Restyle carousel |
| `src/components/NewsSection.tsx` | New two-col editorial list (replace grid) |
| `src/components/ReviewerSection.tsx` | Remove fieldsets, restyle tags and awards |
| `src/components/ContactSection.tsx` | Restyle |
| `src/components/Footer.tsx` | Update colors |

---

## 7. Out of Scope

- No content changes (text, papers, news items, links)
- No new sections or removed sections
- No routing or Next.js config changes
- No new npm packages
- Paper `href="#"` links remain as-is (placeholder)

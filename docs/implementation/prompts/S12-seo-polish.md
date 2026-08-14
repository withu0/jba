# S12 — SEO + design polish

Copy everything below the line into a new chat (or `@` this file).

---

## Agent prompt

Implement **S12 only** for the JBA project — final MVP polish pass.

### Goal

1. Meta tags / OGP basics on public pages.
2. Responsive + design-guide compliance sweep.
3. Dead-link and empty-state cleanup across nav.

### Prerequisites

- S05–S11 feature sections largely complete (work with whatever exists; fix gaps in chrome/SEO only)

### Key references

- `docs/design_guide.md`
- `docs/JBA_要件定義書.md` §5 non-functional (SEO, responsive)
- All public Inertia pages
- `ROADMAP.md`

### Scope — do

- Per-page `<title>`, meta description, OGP (title/description/image) via Inertia head or shared layout
- Default OGP image (brand or hero)
- Mobile nav usability check; fix obvious layout breaks
- Align public UI with design guide (colors, radius 4–8px, spacing, fonts)
- Fix broken nav links; empty states for lists with no content
- Quick pass on auth/admin pages for consistency (no full redesign)
- Mark all completed section checkboxes accurate in `ROADMAP.md`

### Scope — do not

- New product features (payments, live stream, etc.)
- Large refactors unrelated to polish
- Perfect structured data for every schema.org type — basic WebSite/Article is enough if added

### Acceptance criteria

- [ ] Public pages have sensible titles and OGP
- [ ] Key flows usable on mobile viewport
- [ ] Nav has no intentional dead ends for MVP routes
- [ ] Design guide tokens visibly applied on public chrome
- [ ] `ROADMAP.md` S12 checkbox marked done

### After done

Mark S12 complete in `ROADMAP.md`. Summarize remaining known gaps for Phase 2. Stop.

# S01 — Foundation: brand, public layout, move manga

Copy everything below the line into a new chat (or `@` this file).

---

## Agent prompt

Implement **S01 only** for the JBA project. Do not start S02 or later sections.

### Goal

1. Apply brand tokens from `docs/design_guide.md` (colors, Noto fonts, button/radius rules) in CSS.
2. Add a public site layout: header nav (sitemap links), footer, keep the existing language switcher.
3. Move the manga flip-book from `/` to `/manga` (reuse `WelcomeBook`; rename to `MangaBook` if clean).
4. Build a new top page shell at `/` (hero + nav CTAs; placeholder content is OK).
5. Add i18n keys for nav labels (ja / en / zh).

### Prerequisites

- Laravel + Inertia + React starter already running
- Manga UI currently on `/` via `resources/js/pages/welcome.tsx` + `resources/js/components/welcome-book.tsx`
- Locale switcher already exists

### Key references

- `docs/design_guide.md`
- `docs/JBA_要件定義書.md` (site map)
- `docs/implementation/ROADMAP.md`
- `resources/css/app.css`
- `resources/js/pages/welcome.tsx`
- `resources/js/components/welcome-book.tsx`
- `resources/js/data/welcome-book.ts`
- `resources/js/components/language-switcher.tsx`
- `resources/js/i18n/locales/{ja,en,zh}.ts`
- `routes/web.php`

### Scope — do

- CSS variables / theme tokens matching design guide (turquoise `#59DAE6`, blue `#349CCA`, neutrals, semantic colors)
- Load Noto Sans / Noto Serif (JP + SC + Latin) appropriately
- Public layout component(s) wrapping public pages
- Nav links for: Home, About, News, Interviews, Counseling, Before/After, Contraindications, Manga, Login/Register (or My Page when auth)
- Route `GET /manga` serving the flip-book
- Route `GET /` as new marketing/home shell
- Keep locale cookie switch working

### Scope — do not

- Database migrations / CMS / admin
- Real CMS content for About/News/etc. (placeholder links/pages are fine if needed for nav)
- Lesson LMS, contact form, SEO polish (S12)

### Acceptance criteria

- [ ] `/` shows a branded home shell (not the manga book)
- [ ] `/manga` shows the existing flip-book UX with prev/next and enlarge
- [ ] Header + footer present on public pages; language switcher works
- [ ] Design tokens from the guide are applied (no purple/default Instrument-only look for public chrome)
- [ ] Nav labels exist in ja / en / zh
- [ ] `docs/implementation/ROADMAP.md` S01 checkbox marked done when finished

### After done

Mark S01 complete in `ROADMAP.md`. Stop. Do not begin S02 unless the user asks.

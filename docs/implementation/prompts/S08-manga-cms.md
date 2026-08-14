# S08 — Manga CMS (DB-backed viewer)

Copy everything below the line into a new chat (or `@` this file).

---

## Agent prompt

Implement **S08 only** for the JBA project.

### Goal

Make `/manga` DB-backed: admin can upload and reorder pages; public flip-book reads from DB. **Create** `MangaPageSeeder.php` from existing static assets under `public/manga`. Document zh fallback (use `en` images if no zh set).

### Prerequisites

- S01 moved manga UI to `/manga` (still static is OK as starting point)
- S03 admin shell
- S02 `manga_pages` model

### Key references

- `resources/js/components/welcome-book.tsx` (or renamed MangaBook)
- `resources/js/data/welcome-book.ts`
- `public/manga/en/`, `public/manga/jp/` → moved to `database/seeders/data/manga/{en,jp}` (must not live under `public/` or `/manga` is shadowed)
- `docs/implementation/SEEDING.md`

### Seeding rule

Create `database/seeders/MangaPageSeeder.php` in this section and register it in `DatabaseSeeder`.

### Scope — do

- Public `/manga` loads ordered pages for current locale from DB
- Locale mapping: `ja` → jp assets, `en` → en, `zh` → fallback to `en` if missing
- Admin: upload page images, reorder (sort_order), delete, per-locale pages
- New `MangaPageSeeder` seeds from existing `public/manga` files (copy into storage or reference public paths — pick one approach and document it)
- Preserve flip-book UX (prev/next, enlarge/zoom)

### Scope — do not

- Lessons, news, contact
- Fancy page-turn physics beyond current react-pageflip behavior

### Acceptance criteria

- [ ] `/manga` works without hard-coded `welcome-book.ts` page lists (or that file only as fallback during migration — prefer remove)
- [ ] Admin can reorder and upload pages
- [ ] Seeder restores jp/en books
- [ ] zh UI falls back to en pages as documented
- [ ] `ROADMAP.md` S08 checkbox marked done

### After done

Mark S08 complete in `ROADMAP.md`. Stop.

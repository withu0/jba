# S05 — Static CMS pages (About / Counseling / Contraindications)

Copy everything below the line into a new chat (or `@` this file).

---

## Agent prompt

Implement **S05 only** for the JBA project.

### Goal

Public pages for **JBAについて (About)**, **カウンセリング (Counseling)**, and **禁忌事項 (Contraindications)**, editable via admin CMS with ja/en/zh translations. **Create** `PageContentSeeder.php` with placeholder copy.

### Prerequisites

- S03 complete (admin auth + layout)
- S02 `page_contents` + translations models

### Key references

- `docs/JBA_要件定義書.md` site map + §4.3
- `docs/design_guide.md`
- Public layout from S01
- `docs/implementation/SEEDING.md`

### Seeding rule

Create `database/seeders/PageContentSeeder.php` in this section (separate file) and register it in `DatabaseSeeder`. Do not put page content into `DatabaseSeeder` directly.

### Scope — do

- Public routes e.g. `/about`, `/counseling`, `/contraindications` (or Japanese slugs if already used in nav — stay consistent with S01 nav)
- Inertia pages rendering localized title/body for current locale
- Admin CRUD (or edit-only for fixed keys) under `/admin/pages`
- Multilingual fields (ja / en / zh) in admin forms
- New `PageContentSeeder` with placeholder content for all three keys × locales
- Wire nav links from S01 to real routes

### Scope — do not

- News/Interviews, Before/After, Manga CMS, Contact submit (S06–S11)
- Contact form on counseling (S11) — a “coming soon” or link placeholder is OK

### Acceptance criteria

- [ ] Three public pages render seeded content in ja/en/zh via language switcher
- [ ] Admin can edit and save translations
- [ ] `php artisan db:seed --class=PageContentSeeder` works
- [ ] `ROADMAP.md` S05 checkbox marked done

### After done

Mark S05 complete in `ROADMAP.md`. Stop.

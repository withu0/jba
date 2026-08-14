# S02 — Domain schema + models

Copy everything below the line into a new chat (or `@` this file).

---

## Agent prompt

Implement **S02 only** for the JBA project. Do not implement admin UI, public CMS pages, or lesson players.

### Goal

Create all domain migrations, Eloquent models, and relationships. **Do not create empty seeder stub files** — later sections create their own seeders when they need data (see `docs/implementation/SEEDING.md`).

### Prerequisites

- S01 complete (public layout + manga at `/manga`)

### Key references

- `docs/JBA_要件定義書.md` §7 data model
- `docs/implementation/SEEDING.md`
- `docs/implementation/ROADMAP.md`
- Existing `User` model + migrations
- `database/seeders/DatabaseSeeder.php` (keep test user here for now)

### Entities to create

| Entity | Notes |
|---|---|
| `admins` | Separate from users; name, email, password, timestamps |
| `lesson_categories` | slug/sort_order; translations for name |
| `lessons` | category_id, video path/url, sort_order, published flags; translations for title/body |
| `lesson_images` | lesson_id, image path, sort_order; translations for caption |
| `lesson_view_logs` | user_id, lesson_id, started_at, completed_at (nullable) |
| `news` | publish state, published_at; translations for title/body/slug if needed |
| `interviews` | same pattern as news |
| `before_afters` | before/after image paths, sort_order; translations for title/caption |
| `manga_pages` | locale (or translation of image?), image path, sort_order |
| `contacts` | name, email, body, status, timestamps |
| `page_contents` | key (`about`, `counseling`, `contraindications`); translations for title/body |

**Translation strategy (required):** use dedicated `*_translations` tables (locale `ja`|`en`|`zh`), not JSON columns — better for CMS editability.

### Scope — do

- Migrations (MySQL/PostgreSQL-compatible; works on SQLite)
- Models + relationships + fillable/casts
- Factories optional but helpful for tests
- Update `SEEDING.md` if table/column names differ from the doc
- Run migrations successfully locally

### Scope — do not

- Create empty `*Seeder.php` stubs (S03+ create seeders when filling real data)
- Admin login UI (S03)
- Filling rich seed content (later sections)
- Public pages CRUD, file upload controllers

### Acceptance criteria

- [ ] `php artisan migrate:fresh` succeeds
- [ ] All listed models exist with relationships
- [ ] Translation tables exist for translatable content
- [ ] No empty domain seeder stubs added
- [ ] `docs/implementation/ROADMAP.md` S02 checkbox marked done

### After done

Mark S02 complete in `ROADMAP.md`. Stop.

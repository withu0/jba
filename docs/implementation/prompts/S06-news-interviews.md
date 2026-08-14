# S06 — News + Interviews

Copy everything below the line into a new chat (or `@` this file).

---

## Agent prompt

Implement **S06 only** for the JBA project.

### Goal

Public news and interview list (paginated) + detail pages, plus admin CRUD with publish/draft and `published_at`. **Create** `NewsSeeder.php` and `InterviewSeeder.php`.

### Prerequisites

- S03 admin shell
- S02 news / interviews + translation models

### Key references

- `docs/JBA_要件定義書.md` §4.3
- Public layout (S01)
- `docs/implementation/SEEDING.md`

### Seeding rule

Create separate `NewsSeeder` and `InterviewSeeder` files in this section and register both in `DatabaseSeeder`. Do not inline sample posts in `DatabaseSeeder`.

### Scope — do

- Public routes: `/news`, `/news/{slug|id}`, `/interviews`, `/interviews/{slug|id}`
- Only show published items with `published_at <= now()` on public side
- Pagination on lists
- Localized title/body (and excerpt if useful) via translations
- Admin CRUD under `/admin/news` and `/admin/interviews`
- New seeders with a few sample posts in ja/en/zh
- Optional featured image via Storage

### Scope — do not

- Before/After, Manga, Lessons, Contact
- Full-text search

### Acceptance criteria

- [ ] Public list + detail work for news and interviews
- [ ] Drafts are hidden from public
- [ ] Admin can create/edit/delete and set publish state
- [ ] Seeders populate sample data
- [ ] `ROADMAP.md` S06 checkbox marked done

### After done

Mark S06 complete in `ROADMAP.md`. Stop.

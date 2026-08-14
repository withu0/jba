# S07 — Before / After gallery

Copy everything below the line into a new chat (or `@` this file).

---

## Agent prompt

Implement **S07 only** for the JBA project.

### Goal

Public before/after gallery (simple side-by-side image pairs — **no comparison slider** unless already trivial). Admin CRUD for pairs. **Create** `BeforeAfterSeeder.php`.

### Prerequisites

- S03 admin shell
- S02 `before_afters` + translations

### Key references

- `docs/JBA_要件定義書.md` §4.3 / §9 (slider is optional — skip for MVP)
- `docs/design_guide.md` (photo tone notes)
- `docs/implementation/SEEDING.md`

### Seeding rule

Create `database/seeders/BeforeAfterSeeder.php` in this section and register it in `DatabaseSeeder`.

### Scope — do

- Public route e.g. `/before-after`
- Gallery grid of before | after pairs with localized title/caption
- Admin CRUD: upload before/after images, sort order, translations
- New seeder with placeholder images (use existing public assets or simple placeholders)
- Storage on `public` disk

### Scope — do not

- Comparison slider UX
- Lessons / manga / news work

### Acceptance criteria

- [ ] Public gallery shows published pairs in order
- [ ] Admin can create/edit/reorder/delete pairs
- [ ] Images load correctly after seed/upload
- [ ] `ROADMAP.md` S07 checkbox marked done

### After done

Mark S07 complete in `ROADMAP.md`. Stop.

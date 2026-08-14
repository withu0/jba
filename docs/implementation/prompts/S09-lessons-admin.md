# S09 — Lessons admin + storage

Copy everything below the line into a new chat (or `@` this file).

---

## Agent prompt

Implement **S09 only** for the JBA project. Member-facing lesson player/history is **S10** — keep member UI minimal or stub.

### Goal

Admin management for the 6 lesson categories and lessons: video upload, multilingual text, step images with captions, sort order. **Create** `LessonCategorySeeder.php` and `LessonSeeder.php`.

### Prerequisites

- S03 admin shell
- S02 lesson models + translations + `lesson_images`

### Key references

- `docs/JBA_要件定義書.md` §3, §4.2, §4.4
- Fixed categories: 頭皮ほぐし, マッサージ美容鍼, 電気美容鍼, 指鍼, 金鍼, まとめ
- `docs/implementation/SEEDING.md`
- Laravel `Storage` public disk

### Seeding rule

Create separate `LessonCategorySeeder` and `LessonSeeder` files in this section and register both in `DatabaseSeeder`.

### Scope — do

- Admin category list/create/edit/reorder (seed the six; allow rename via translations)
- Admin lesson CRUD: category, sort_order, published flag, video file upload, title/body translations (ja/en/zh), step images + caption translations
- Store video/images on `public` disk (paths on models); structure folders e.g. `lessons/{id}/`
- New sample seeders: categories + at least one lesson per category (video can be null or tiny placeholder; document in SEEDING.md)
- Optional: stub member route that 404s or shows “coming in S10”

### Scope — do not

- Full member lesson player / view logs (S10)
- Live streaming, certificates
- S3 configuration beyond optional disk comment

### Acceptance criteria

- [ ] Admin can manage categories and lessons including uploads
- [ ] Six categories seeded with ja/en/zh names
- [ ] Sample lessons seed without breaking migrate:fresh --seed
- [ ] `ROADMAP.md` S09 checkbox marked done

### After done

Mark S09 complete in `ROADMAP.md`. Stop.

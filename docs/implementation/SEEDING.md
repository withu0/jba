# JBA Database Seeding

**Do not pre-create empty seeder stubs.** Each implementation section creates its own seeder file(s) when that section needs seed data.

## Rule for every section

When a section needs seed data:

1. Create a **separate** seeder class under `database/seeders/` (e.g. `AdminSeeder.php`, `NewsSeeder.php`) — never dump domain data into `DatabaseSeeder` directly.
2. Optionally put static payloads under `database/seeders/data/` (e.g. `page_contents.php`) and `require` them from that seeder.
3. Register the new class in `DatabaseSeeder` via `$this->call([...])`.
4. Document credentials / notes in this file when you add them.

## Commands

```bash
# Full reset + all registered seeders
php artisan migrate:fresh --seed

# Single domain seeder (after it exists)
php artisan db:seed --class=AdminSeeder
```

## Expected seeders (create when the section runs)

| Seeder | Create in | Purpose |
|---|---|---|
| `UserSeeder` | S02 or S04 (optional; test user may stay in `DatabaseSeeder` until then) | Test member account |
| `AdminSeeder` | S03 ✅ | Default CMS admin (`admin@jba.local` / `password`) |
| `PageContentSeeder` | S05 ✅ | About / Counseling / Contraindications |
| `NewsSeeder` | S06 ✅ | Sample news posts |
| `InterviewSeeder` | S06 ✅ | Sample interviews |
| `BeforeAfterSeeder` | S07 ✅ | Gallery pairs |
| `MangaPageSeeder` | S08 ✅ | Default `welcome` category + `episode-1`; pages from `database/seeders/data/manga` copied into `storage/app/public/manga/{episode_id}/{ja,en}` |
| `LessonCategorySeeder` | S09 ✅ | Six fixed categories + translations |
| `LessonSeeder` | S09 ✅ | Sample lessons / images |
| `ContactSeeder` | S11 ✅ | Sample inquiries |

## Default credentials

| Role | Email | Password | Set by |
|---|---|---|---|
| Member | `test@example.com` | `password` | `DatabaseSeeder` (factory default) until moved |
| Admin | `admin@jba.local` | `password` | `AdminSeeder` (S03) |

Update this table when credentials change.

## Locale conventions

- UI / content locales: `ja`, `en`, `zh` (简体)
- Manga asset folders: `database/seeders/data/manga/jp`, `database/seeders/data/manga/en` — map `ja` → `jp` assets; `zh` falls back to `en` when missing (S08). Kept out of `public/` so they do not shadow the `/manga` route.

### Manga seeding (S08)

- `MangaPageSeeder` upserts category `welcome` and published episode `episode-1` (第1話 / Episode 1 / 第1集), then copies `database/seeders/data/manga/jp/*` → `storage/app/public/manga/{episode_id}/ja/` and `database/seeders/data/manga/en/*` → `storage/app/public/manga/{episode_id}/en/`.
- Admin uploads also land under `storage/app/public/manga/{episode_id}/{locale}/` on the `public` disk (requires `php artisan storage:link`).
- **zh fallback:** no zh book is seeded. If an episode has no `locale = zh` pages, the public viewer serves that episode's `en` pages (`MangaPage::LOCALE_FALLBACKS`). Upload zh pages in admin to override.

### Lesson seeding (S09)

- `LessonCategorySeeder` upserts the six fixed categories by `slug` (`scalp-release`, `massage-acupuncture`, `electric-acupuncture`, `finger-acupuncture`, `gold-acupuncture`, `summary`) with ja/en/zh names, so renaming a category in admin survives a re-seed only if the slug is unchanged.
- `LessonSeeder` adds one published lesson per category, matched by category + Japanese title so re-runs update instead of duplicate.
- **Videos are not seeded.** `video_path` and `video_url` stay `null`; upload real files through the admin screen. This keeps the repo free of large binaries.
- Step images are generated placeholder SVGs written to `storage/app/public/lessons/{lesson}/images/{key}.svg` (skipped if the file already exists). Admin uploads land in the same `lessons/{lesson}/` folder on the `public` disk, so `php artisan storage:link` is required to see them.

## Schema notes (S02 / S04)

Locales on `*_translations` and `manga_pages.locale`: `ja` | `en` | `zh`.

| Table | Key columns |
|---|---|
| `users` | name, email, bio, avatar_path, email_verified_at, password (+ Fortify 2FA columns) |
| `admins` | name, email, password, remember_token |
| `lesson_categories` | slug, sort_order → `lesson_category_translations` (name) |
| `lessons` | lesson_category_id, video_path, video_url, sort_order, is_published → `lesson_translations` (title, body) |
| `lesson_images` | lesson_id, image_path, sort_order → `lesson_image_translations` (caption) |
| `lesson_view_logs` | user_id, lesson_id (unique pair), started_at, completed_at |
| `news` / `interviews` | is_published, published_at, featured_image_path → `*_translations` (slug, title, excerpt, body) |
| `before_afters` | before_image_path, after_image_path, sort_order, is_published → `before_after_translations` (title, caption) |
| `manga_categories` | slug, sort_order → `manga_category_translations` (name) |
| `manga_episodes` | manga_category_id, slug, sort_order, is_published → `manga_episode_translations` (title, description) |
| `manga_pages` | manga_episode_id, locale, image_path, sort_order (no translation table; image per locale) |
| `contacts` | name, email, subject, body, status (`new` / `in_progress` / `closed`) |
| `page_contents` | key (`about`, `counseling`, `contraindications`) → `page_content_translations` (title, body) |

## Notes

- Prefer idempotent seeders (`updateOrCreate` by slug/key/email).
- Store uploaded media under `storage/app/public` and run `php artisan storage:link`.
- Keep seed media small; do not commit large video binaries.

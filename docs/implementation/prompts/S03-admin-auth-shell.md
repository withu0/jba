# S03 — Admin auth + admin shell

Copy everything below the line into a new chat (or `@` this file).

---

## Agent prompt

Implement **S03 only** for the JBA project. Do not build content CRUD modules yet (those are S05+).

### Goal

1. Separate admin authentication (guard) using the `admins` table from S02.
2. Admin login / logout.
3. Admin middleware protecting `/admin/*`.
4. Admin layout + dashboard home with links/placeholders to future modules.
5. **Create** `AdminSeeder.php` (new separate file) with a documented default admin, and register it in `DatabaseSeeder`.

### Prerequisites

- S02 complete (`Admin` model + `admins` migration)
- Member Fortify auth already exists — do not break it

### Key references

- `docs/JBA_要件定義書.md` §4.4
- `docs/implementation/SEEDING.md`
- `docs/design_guide.md` (admin UI can be denser but use brand colors)
- `config/auth.php`, Fortify setup
- `database/seeders/DatabaseSeeder.php`

### Seeding rule

Create `database/seeders/AdminSeeder.php` in this section — do not dump admin rows into `DatabaseSeeder`. Call it via `$this->call()`.

### Scope — do

- `auth` guard / provider for admins (session)
- Admin login page (Inertia) + logout
- Middleware e.g. `admin` / `auth:admin`
- Routes under `/admin` prefix
- Admin layout (sidebar or header nav): Dashboard, Members, Lessons, News, Interviews, Before/After, Manga, Pages, Contacts — links may 404 until later sections
- New `AdminSeeder`: e.g. `admin@jba.local` / documented password in `SEEDING.md`
- Keep member and admin sessions isolated

### Scope — do not

- Member/lesson/news CRUD implementations
- Member mypage redesign (S04)
- Real CMS forms

### Acceptance criteria

- [ ] Admin can log in and log out at `/admin/login` (or agreed path)
- [ ] Unauthenticated users cannot access `/admin` dashboard
- [ ] Member auth still works independently
- [ ] `php artisan db:seed --class=AdminSeeder` creates usable admin
- [ ] Credentials documented in `SEEDING.md`
- [ ] `ROADMAP.md` S03 checkbox marked done

### After done

Mark S03 complete in `ROADMAP.md`. Stop.

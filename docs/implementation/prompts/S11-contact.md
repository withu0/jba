# S11 — Contact form

Copy everything below the line into a new chat (or `@` this file).

---

## Agent prompt

Implement **S11 only** for the JBA project.

### Goal

Contact/inquiry form (from counseling page and/or dedicated route), persist to `contacts`, optional email notification, admin list + status management. **Create** `ContactSeeder.php` with sample rows.

### Prerequisites

- S03 admin shell
- S02 `contacts` model
- S05 counseling page preferred (form can live on counseling and/or `/contact`)

### Key references

- `docs/JBA_要件定義書.md` §4.3 / §4.4
- `docs/implementation/SEEDING.md`

### Seeding rule

Create `database/seeders/ContactSeeder.php` in this section and register it in `DatabaseSeeder`.

### Scope — do

- Public form: name, email, message (and optional subject)
- Validation + CSRF; store status default e.g. `new`
- Thank-you / flash on success
- Optional: `Mail` notification to admin address from `.env`
- Admin: list, filter by status, view detail, update status (`new` / `in_progress` / `closed`)
- New `ContactSeeder` with sample inquiries
- i18n for form labels/errors

### Scope — do not

- Spam services beyond basic honeypot/rate limit if easy
- CRM integrations
- Other CMS modules

### Acceptance criteria

- [ ] Guest can submit a contact form; row appears in DB
- [ ] Admin can view and update status
- [ ] Seeder creates sample contacts
- [ ] `ROADMAP.md` S11 checkbox marked done

### After done

Mark S11 complete in `ROADMAP.md`. Stop.

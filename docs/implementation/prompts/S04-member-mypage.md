# S04 — Member mypage polish

Copy everything below the line into a new chat (or `@` this file).

---

## Agent prompt

Implement **S04 only** for the JBA project. Do not implement lesson viewing or watch-history recording (S10).

### Goal

1. Replace the placeholder dashboard with a real **mypage**.
2. Show profile summary and links to lessons / watch history (history can be empty until S10).
3. Add profile fields required by the requirements (bio, avatar) if missing.
4. Ensure email verification works end-to-end (`MustVerifyEmail`).

### Prerequisites

- S02 complete (User may need migration for `bio` / `avatar_path`)
- Fortify registration/login/reset already present
- Auth-gated `dashboard` route exists

### Key references

- `docs/JBA_要件定義書.md` §4.1
- `resources/js/pages/dashboard.tsx`
- `resources/js/pages/settings/profile.tsx`
- `app/Models/User.php`
- Fortify / verified middleware

### Scope — do

- Mypage UI (rename route/page to mypage if clearer; keep `/dashboard` redirect OK)
- Profile display: name, email, avatar, bio
- Edit profile via existing settings or mypage forms (avatar upload via Storage)
- Enable `MustVerifyEmail` on User if not already; verify register → email → dashboard flow
- Soft placeholders for “Lessons” and “Watch history” linking to future routes
- i18n for mypage strings

### Scope — do not

- Lesson list/player (S09/S10)
- Admin member management UI (can be a later addition under S03 shell; skip unless trivial)
- Watch log writing

### Acceptance criteria

- [ ] Authenticated verified user sees a branded mypage (not starter placeholder cards only)
- [ ] Bio + avatar can be saved
- [ ] Unverified users are blocked from mypage per Fortify verified middleware
- [ ] `ROADMAP.md` S04 checkbox marked done

### After done

Mark S04 complete in `ROADMAP.md`. Stop.

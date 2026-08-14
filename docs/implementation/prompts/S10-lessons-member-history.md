# S10 — Member lessons + watch history

Copy everything below the line into a new chat (or `@` this file).

---

## Agent prompt

Implement **S10 only** for the JBA project.

### Goal

Auth-gated member lesson list/detail (video + text + step images), record view start/complete in `lesson_view_logs`, and show watched list on mypage. No certificates or progress percentages.

### Prerequisites

- S04 mypage
- S09 lessons admin + seeded lessons

### Key references

- `docs/JBA_要件定義書.md` §4.2
- Mypage from S04
- `Lesson`, `LessonImage`, `LessonViewLog` models
- Public/member layouts

### Scope — do

- Routes under auth + verified: lesson categories/list, lesson detail
- Detail: HTML5 video (or suitable player) from storage URL, localized text, image gallery with captions
- On open/start: write or update view log (`started_at`)
- On complete (ended event or explicit button): set `completed_at`
- List shows watched/completed flag
- Mypage section: watched/completed lessons
- i18n for UI chrome
- Only published lessons visible

### Scope — do not

- Admin lesson CRUD changes (unless bugfix)
- Certificates, quizzes, % progress
- Payment gates

### Acceptance criteria

- [ ] Guests cannot access lesson pages
- [ ] Members can browse categories and watch a lesson
- [ ] View logs persist start/complete
- [ ] Mypage shows watch history
- [ ] `ROADMAP.md` S10 checkbox marked done

### After done

Mark S10 complete in `ROADMAP.md`. Stop.

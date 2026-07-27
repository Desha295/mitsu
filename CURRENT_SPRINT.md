# CURRENT_SPRINT.md

## MITSU

Tracks the currently active sprint. Companion to `PROJECT_STATE.md` (full
history) and `CHANGELOG.md` (versioned change log).

---

**Version:** v0.16.0
**Current Phase:** Phase 3 — Admin Dashboard
**Current Sprint:** Sprint 3.5 — Student Union Management
**Status:** READY TO START

---

## Previous Sprint (Completed)

**Sprint 3.4 — Events Management** ✅ COMPLETE (v0.16.0)

Third real CRUD admin page. `/admin/events` reads/writes through
Sprint 2.2's `eventsService`, extending Sprint 3.3's Announcements list
pattern, reusing `ConfirmDialog` unchanged. Also folded in a hotfix to
`HeroForm`'s controlled-input state initialization (no functional
change, no separate version). See `CHANGELOG.md` v0.16.0 for detail.

---

## Current Sprint Scope (pending approval)

Sprint 3.5 is expected to extend the established list/CRUD pattern to
Student Union content:

- New management page(s) under `/admin` (e.g. `/admin/union`) covering
  Leadership and/or Committees.
- Backed by Sprint 2.2's `unionService` (already built, unused until
  now).
- List view + create/edit form + validation + delete, following the
  same structure as `EventForm`/`EventListItem`/`/admin/events`,
  reusing `ConfirmDialog` as-is.
- Corresponding sidebar item and dashboard quick action to be marked
  `isImplemented: true` once built.

**Not yet approved or started — do not implement until explicitly scoped.**

---

See `PROJECT_STATE.md` for full sprint history and `CHANGELOG.md` for
detailed per-version changes.

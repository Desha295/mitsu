# CURRENT_SPRINT.md

## MITSU

Tracks the currently active sprint. Companion to `PROJECT_STATE.md` (full
history) and `CHANGELOG.md` (versioned change log).

---

**Version:** v0.14.0
**Current Phase:** Phase 3 — Admin Dashboard
**Current Sprint:** Sprint 3.3 — next content-management page
**Status:** READY TO START

---

## Previous Sprint (Completed)

**Sprint 3.2 — Hero Management** ✅ COMPLETE (v0.14.0)

First real CRUD admin page. `/admin/hero` reads/writes through Sprint
2.2's `heroService`, with full form validation and image upload via
Sprint 2.2/2.3's Storage helpers. See `CHANGELOG.md` v0.14.0 for detail.

---

## Current Sprint Scope (pending approval)

Sprint 3.3 is expected to extend the Sprint 3.2 pattern to the next
content area — likely Announcements or Events management:

- New management page under `/admin` (e.g. `/admin/announcements`).
- Backed by Sprint 2.2's `announcementsService`/`eventsService`
  (already built, unused until now).
- List view + create/edit form + validation, following the same
  structure as `HeroForm`/`/admin/hero`.
- Corresponding sidebar item and dashboard quick action to be marked
  `isImplemented: true` once built.

**Not yet approved or started — do not implement until explicitly scoped.**

---

See `PROJECT_STATE.md` for full sprint history and `CHANGELOG.md` for
detailed per-version changes.

# CURRENT_SPRINT.md

## MITSU

Tracks the currently active sprint. Companion to `PROJECT_STATE.md` (full
history) and `CHANGELOG.md` (versioned change log).

---

**Version:** v0.15.0
**Current Phase:** Phase 3 — Admin Dashboard
**Current Sprint:** Sprint 3.4 — Events Management
**Status:** READY TO START

---

## Previous Sprint (Completed)

**Sprint 3.3 — Announcements Management** ✅ COMPLETE (v0.15.0)

Second real CRUD admin page. `/admin/announcements` reads/writes through
Sprint 2.2's `announcementsService`, extending Sprint 3.2's Hero pattern
from a singleton document to a true list (create/edit/delete), plus a
new reusable `ConfirmDialog`. See `CHANGELOG.md` v0.15.0 for detail.

---

## Current Sprint Scope (pending approval)

Sprint 3.4 is expected to extend the Sprint 3.3 pattern to Events:

- New management page under `/admin` (e.g. `/admin/events`).
- Backed by Sprint 2.2's `eventsService` (already built, unused until
  now).
- List view + create/edit form + validation + delete, following the
  same structure as `AnnouncementForm`/`AnnouncementListItem`/
  `/admin/announcements`, reusing `ConfirmDialog` as-is.
- Corresponding sidebar item and dashboard quick action to be marked
  `isImplemented: true` once built.

**Not yet approved or started — do not implement until explicitly scoped.**

---

See `PROJECT_STATE.md` for full sprint history and `CHANGELOG.md` for
detailed per-version changes.

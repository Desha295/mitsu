# CURRENT_SPRINT.md

## MITSU

Tracks the currently active sprint. Companion to `PROJECT_STATE.md` (full
history) and `CHANGELOG.md` (versioned change log).

---

**Version:** v0.18.0
**Current Phase:** Phase 3 — Admin Dashboard
**Current Sprint:** Sprint 3.7 — Freshman Guide Management
**Status:** READY TO START

---

## Previous Sprint (Completed)

**Sprint 3.6 — University Systems Management** ✅ COMPLETE (v0.18.0)

Fifth real CRUD admin page. `/admin/systems` reads/writes through
Sprint 2.2's `systemsService`, extending Sprint 3.3/3.4/3.5's list
pattern, reusing `ConfirmDialog` unchanged for a third sprint. No new
Firestore collections — `systems` already existed. See `CHANGELOG.md`
v0.18.0 for detail.

---

## Current Sprint Scope (pending approval)

Sprint 3.7 is expected to extend the established list/CRUD pattern to
the Freshman Guide:

- New management page under `/admin` (e.g. `/admin/guide`).
- Backed by Sprint 2.2's `guideService` (already built, unused until
  now).
- List view + create/edit form + validation + delete, following the
  same structure as `SystemForm`/`SystemListItem`/`/admin/systems`,
  reusing `ConfirmDialog` as-is.
- Corresponding sidebar item to be marked `isImplemented: true` once
  built.

This would close out the two CMS candidates identified after Sprint
3.5 (Systems now done in Sprint 3.6, Guide remains).

**Not yet approved or started — do not implement until explicitly scoped.**

---

See `PROJECT_STATE.md` for full sprint history and `CHANGELOG.md` for
detailed per-version changes.

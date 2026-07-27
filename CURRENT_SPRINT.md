# CURRENT_SPRINT.md

## MITSU

Tracks the currently active sprint. Companion to `PROJECT_STATE.md` (full
history) and `CHANGELOG.md` (versioned change log).

---

**Version:** v0.17.0
**Current Phase:** Phase 3 — Admin Dashboard
**Current Sprint:** Sprint 3.6 — University Systems Management
**Status:** READY TO START

---

## Previous Sprint (Completed)

**Sprint 3.5 — Student Union (Committees) Management** ✅ COMPLETE (v0.17.0)

Fourth real CRUD admin page. `/admin/union` reads/writes through
Sprint 2.2's `unionService` (the `committees` collection), extending
Sprint 3.3/3.4's list pattern, reusing `ConfirmDialog` unchanged for a
second sprint. Leadership remains out of scope — `unionService` only
wraps Committees. See `CHANGELOG.md` v0.17.0 for detail.

---

## Current Sprint Scope (pending approval)

Sprint 3.6 is expected to extend the established list/CRUD pattern to
University Systems:

- New management page under `/admin` (e.g. `/admin/systems`).
- Backed by Sprint 2.2's `systemsService` (already built, unused until
  now).
- List view + create/edit form + validation + delete, following the
  same structure as `CommitteeForm`/`CommitteeListItem`/`/admin/union`,
  reusing `ConfirmDialog` as-is.
- Corresponding sidebar item to be marked `isImplemented: true` once
  built.

Freshman Guide management (`/admin/guide`, backed by `guideService`,
also already built) is the other remaining CMS candidate and may be
folded in or done as its own sprint — needs explicit scoping.

**Not yet approved or started — do not implement until explicitly scoped.**

---

See `PROJECT_STATE.md` for full sprint history and `CHANGELOG.md` for
detailed per-version changes.

# CURRENT_SPRINT.md

## MITSU

Tracks the currently active sprint. Companion to `PROJECT_STATE.md` (full
history) and `CHANGELOG.md` (versioned change log).

---

**Version:** v0.13.0
**Current Phase:** Phase 3 — Admin Dashboard
**Current Sprint:** Sprint 3.2 — Hero Management
**Status:** READY TO START

---

## Previous Sprint (Completed)

**Sprint 3.1 — Admin Dashboard Foundation** ✅ COMPLETE (v0.13.0)

Built the reusable Admin Dashboard UI foundation: 13 admin components,
protected `/admin` route (reusing `RequireAuth`/`useAuthGuard`), and a
static-placeholder Dashboard Home. No CRUD, no forms, no Firestore
reads/writes. See `CHANGELOG.md` v0.13.0 for full detail.

---

## Current Sprint Scope (pending approval)

Sprint 3.2 is expected to be the first sprint to implement real CRUD
against Firebase, likely starting with Hero content management:

- First real management page under `/admin` (e.g. `/admin/hero`).
- Backed by Sprint 2.2's `heroService` (already built, unused until now).
- Real Firestore reads/writes, form UI, validation.
- Would need a real Firebase project + `.env.local` populated + a
  `super_admin` document to actually exercise end-to-end.

**Not yet approved or started — do not implement until explicitly scoped.**

---

See `PROJECT_STATE.md` for full sprint history and `CHANGELOG.md` for
detailed per-version changes.

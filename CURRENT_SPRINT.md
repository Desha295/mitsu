# CURRENT_SPRINT.md

## MITSU

Tracks the currently active sprint. Companion to `PROJECT_STATE.md` (full
history) and `CHANGELOG.md` (versioned change log).

---

**Version:** v0.19.0
**Current Phase:** Phase 3 — Admin Dashboard
**Current Sprint:** Sprint 3.8 — TBD (scope needs explicit confirmation)
**Status:** NOT YET SCOPED

---

## Previous Sprint (Completed)

**Sprint 3.7 — Freshman Guide Management** ✅ COMPLETE (v0.19.0)

Sixth real CRUD admin page. `/admin/guide` reads/writes through
Sprint 2.2's `guideService`, extending Sprint 3.3–3.6's list pattern,
reusing `ConfirmDialog` unchanged for a fourth sprint. First schema
with array fields (`facts`, `stats`), handled with inline add/remove
list editors in `GuideForm`. No new Firestore collections — `guide`
already existed. See `CHANGELOG.md` v0.19.0 for detail.

---

## Current Sprint Scope (pending approval)

Both CMS candidates identified after Sprint 3.5 (Systems, Guide) are
now complete. Remaining unimplemented sidebar items: Study Plans,
Contact, About, Settings. None has confirmed scope yet. Candidates,
in no particular priority:

- **Study Plans** (`/admin/study-plans`) — per `guideService`'s own
  Sprint 2.2 comment, a natural fit for the existing `documents`
  collection ("downloadable resources" per `06_FIREBASE_SCHEMA.md`
  #11) rather than a new collection. However, no `documentsService`
  exists yet — this sprint would need to create one first (small,
  same `createFirestoreService` factory), not just an admin page.
- **Contact / About** (`/admin/contact`, `/admin/about`) — likely
  singleton-style pages (like Hero), scope and backing collection not
  yet confirmed.
- **Settings** (`/admin/settings`) — maps to `06_FIREBASE_SCHEMA.md`
  #10's `/settings/general` document; no service exists yet either.

**Not yet approved or started — do not implement until explicitly scoped.**

---

See `PROJECT_STATE.md` for full sprint history and `CHANGELOG.md` for
detailed per-version changes.

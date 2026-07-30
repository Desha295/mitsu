# CURRENT_SPRINT.md

## MITSU

Tracks the currently active sprint. Companion to `PROJECT_STATE.md` (full
history) and `CHANGELOG.md` (versioned change log).

---

**Version:** v0.22.0
**Current Phase:** Phase 3 — Admin Dashboard
**Current Sprint:** Sprint 3.11 — TBD (scope needs explicit confirmation)
**Status:** NOT YET SCOPED

---

## Previous Sprint (Completed)

**Sprint 3.10 — Study Plans / Documents Management** ✅ COMPLETE (v0.22.0)

Ninth real CRUD admin page, and the second (after Sprint 3.9's
`leadershipService`) requiring a genuinely new domain service
(`documentsService`). `/admin/study-plans` reads/writes through the new
service, ordered by `uploadedAt` descending (no `order` field on this
schema). Added a new `uploadDocument()` storage helper — identical to
`uploadImage()`, added under its own name, `uploadImage` untouched —
plus a new `manageStudyPlans` permission. `ConfirmDialog` reused
unchanged for a seventh sprint. Existing Study Plans sidebar entry
flipped to implemented (no new entry needed, unlike Sprint 3.8/3.9).
No new Firestore collections — `documents` already existed, and both
`firestore.rules`/`storage.rules` already covered it. See
`CHANGELOG.md` v0.22.0 for detail.

---

## Current Sprint Scope (pending approval)

Per the Sprint 3.8 scoping analysis, updated after Sprints 3.9 and 3.10:

1. **Site Settings** — maps to `/settings/general` (`SettingsDoc`).
   No service yet; `getSettingsDocRef` is a single `DocumentReference`,
   not a collection, so this needs a new singleton-document service
   shape — the first real architectural decision in the remaining
   backlog. Medium complexity.
2. **Contact / About Management** — no existing collection, schema, or
   service at all, and both pages are currently 100% translation-key
   driven. Raises an unresolved bilingual-content-in-Firestore
   question no prior sprint has had to answer. High complexity —
   needs its own scoping conversation.
3. **Security Foundation** (original Sprint 2.10) — Firestore/Storage
   rules hardening and permission review across all collections.
   Not a CRUD feature; cross-cutting and security-critical. Medium
   complexity, best done as its own dedicated pass.
4. **Student Union remainder** (Vision/Mission/Social Media/President
   Information) — still unaddressed; President Information may
   already be covered once Leadership content is populated, but
   Vision/Mission/Social Media have no confirmed schema or collection.
5. **"External Links"** (original Sprint 2.9 remainder) — may already
   be partially covered by Documents' `fileUrl` supporting any valid
   href, not just uploaded PDFs; needs confirmation whether a distinct
   feature is still wanted.

**Not yet approved or started — do not implement until explicitly scoped.**

---

See `PROJECT_STATE.md` for full sprint history and `CHANGELOG.md` for
detailed per-version changes.

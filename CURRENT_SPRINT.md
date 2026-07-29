# CURRENT_SPRINT.md

## MITSU

Tracks the currently active sprint. Companion to `PROJECT_STATE.md` (full
history) and `CHANGELOG.md` (versioned change log).

---

**Version:** v0.21.0
**Current Phase:** Phase 3 — Admin Dashboard
**Current Sprint:** Sprint 3.10 — TBD (scope needs explicit confirmation)
**Status:** NOT YET SCOPED

---

## Previous Sprint (Completed)

**Sprint 3.9 — Leadership Management** ✅ COMPLETE (v0.21.0)

Eighth real CRUD admin page, and the first since Sprint 3.2 requiring a
genuinely new domain service (`leadershipService`) rather than wiring
up one already built — every sprint from 3.3 through 3.8 found its
service sitting unused since Sprint 2.2. Closes the deliberate
deferral from Sprint 3.5, when `unionService` was scoped to Committees
only. Also required a new `manageLeadership` permission (no existing
permission fit Leadership as its own resource). `ConfirmDialog` reused
unchanged for a sixth sprint. New sidebar entry added (didn't exist
before, same situation as Sprint 3.8's Quick Access). No new Firestore
collections — `leadership` already existed, and `firestore.rules`
already had a matching rule. See `CHANGELOG.md` v0.21.0 for detail.

---

## Current Sprint Scope (pending approval)

Per the Sprint 3.8 scoping analysis, updated after Sprint 3.9:

1. **Study Plans / PDF Management** — collection exists (`documents`),
   no service yet. Needs a new `documentsService` (same shape as
   Sprint 3.9's `leadershipService`) plus a new upload helper, since
   `uploadImage`/`isValidImageFile` are image-only. Medium complexity.
2. **Site Settings** — maps to `/settings/general` (`SettingsDoc`).
   No service yet; `getSettingsDocRef` is a single `DocumentReference`,
   not a collection, so this needs a new singleton-document service
   shape — the first real architectural decision in the remaining
   backlog. Medium complexity.
3. **Contact / About Management** — no existing collection, schema, or
   service at all, and both pages are currently 100% translation-key
   driven. Raises an unresolved bilingual-content-in-Firestore
   question no prior sprint has had to answer. High complexity —
   needs its own scoping conversation.
4. **Security Foundation** (original Sprint 2.10) — Firestore/Storage
   rules hardening and permission review across all collections.
   Not a CRUD feature; cross-cutting and security-critical. Medium
   complexity, best done as its own dedicated pass.
5. **Student Union remainder** (Vision/Mission/Social Media/President
   Information) — still unaddressed; President Information may
   already be covered once Leadership content is populated, but
   Vision/Mission/Social Media have no confirmed schema or collection.

**Not yet approved or started — do not implement until explicitly scoped.**

---

See `PROJECT_STATE.md` for full sprint history and `CHANGELOG.md` for
detailed per-version changes.

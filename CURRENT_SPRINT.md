# CURRENT_SPRINT.md

## MITSU

Tracks the currently active sprint. Companion to `PROJECT_STATE.md` (full
history) and `CHANGELOG.md` (versioned change log).

---

**Version:** v0.20.0
**Current Phase:** Phase 3 — Admin Dashboard
**Current Sprint:** Sprint 3.9 — TBD (scope needs explicit confirmation)
**Status:** NOT YET SCOPED

---

## Previous Sprint (Completed)

**Sprint 3.8 — Quick Access Management** ✅ COMPLETE (v0.20.0)

Seventh real CRUD admin page, preceded by a dedicated scoping pass
reconciling `ROADMAP.md` against `PROJECT_STATE.md`/this file/the
actual codebase. `/admin/quick-access` reads/writes through Sprint
2.2's `homepageService` — fully built since Sprint 2.2 but unused
until now — extending Sprint 3.3–3.7's list pattern and reusing
`ConfirmDialog` unchanged for a fifth sprint. Added a **new** sidebar
entry (unlike every prior sprint, which just flipped an existing
one). No new Firestore collections — `homepage` already existed.
Completes the original `ROADMAP.md` Sprint 2.7 "Homepage CMS" item
(Hero + Quick Access), minus Homepage Images/Links (mapped to a
future Settings sprint instead). See `CHANGELOG.md` v0.20.0 for detail.

---

## Current Sprint Scope (pending approval)

Per the Sprint 3.8 scoping analysis, the reconciled remaining backlog,
in recommended order:

1. **Leadership Management** — closes the Student Union CMS remainder.
   Collection exists (`leadership`), no service yet — needs one small
   new service file (same `createFirestoreService` factory). Low
   complexity; schema nearly identical to `CommitteeDoc`.
2. **Study Plans / PDF Management** — collection exists (`documents`),
   no service yet. Needs a new `documentsService` plus a new upload
   helper (existing `uploadImage` is image-only). Medium complexity.
3. **Site Settings** — maps to `/settings/general` (`SettingsDoc`).
   No service yet; `getSettingsDocRef` is a single `DocumentReference`,
   not a collection, so this needs a new singleton-document service
   shape — the first real architectural decision in the remaining
   backlog. Medium complexity.
4. **Contact / About Management** — no existing collection, schema, or
   service at all, and both pages are currently 100% translation-key
   driven. Raises an unresolved bilingual-content-in-Firestore
   question no prior sprint has had to answer. High complexity —
   needs its own scoping conversation.
5. **Security Foundation** (original Sprint 2.10) — Firestore/Storage
   rules hardening and permission review across all collections.
   Not a CRUD feature; cross-cutting and security-critical. Medium
   complexity, best done as its own dedicated pass.

**Not yet approved or started — do not implement until explicitly scoped.**

---

See `PROJECT_STATE.md` for full sprint history and `CHANGELOG.md` for
detailed per-version changes.

# CURRENT_SPRINT.md

## MITSU

Tracks the currently active sprint. Companion to `PROJECT_STATE.md` (full
history) and `CHANGELOG.md` (versioned change log).

---

**Version:** v0.23.0
**Current Phase:** Phase 4 — Public Site Firebase Migration (complete) / Phase 5 — TBD
**Current Sprint:** Sprint 5 — TBD (scope needs explicit confirmation)
**Status:** NOT YET SCOPED

---

## Previous Sprint (Completed)

**Sprint 4 (Phases 4.0–4.8) — Public Site Firebase Migration** ✅ COMPLETE (v0.23.0)

Migrated 8 of 9 public sections from static `src/data/*.ts` files to live Firestore reads, reusing the nine domain services already built in Phase 3 — Hero, Quick Access, Announcements, Events, University Systems, Freshman Guide, Committees, and Leadership. One new shared hook (`useFirestoreList`) was introduced; no Firestore schema, admin form, or admin dashboard page was changed anywhere in this sprint.

Two corrections were made and approved along the way: Hero's query was missing the `isActive == true` filter required by the deployed security rules (caught in Phase 4.1, fixed retroactively); an initial Announcements implementation inferred a "featured" item from recency, which was identified as an invented business rule and removed.

Study Plans/Documents (Phase 4.8) was **intentionally not migrated** — the public UI (image gallery with zoom viewer) and the Firestore `documents` collection (generic downloadable PDFs) are different content models, not two representations of the same data. Documented as an explicit exception in `StudyPlansSection.tsx` and in `PROJECT_STATE.md`.

Three temporary compatibility layers remain, each isolated to its own section file and clearly marked for removal once the corresponding Firestore schema is extended: Systems' `category`/`required`, Committees' `icon`, and Leadership's `socialLinks` — all still sourced from static `src/data` files, joined to Firestore docs by `order` (Leadership uses a fixed `order = 1` → President / `order = 2` → Vice President convention, since the static data has no `order` field of its own).

`LeaderCard`'s prop contract was cleaned up since it's shared with the still-fully-static `ContactSection` (out of scope this sprint) — `ContactSection`'s one call site was updated mechanically to match, with no behavior, data-source, or content change there.

A closing runtime-import audit found `Footer.tsx` independently sourced its "University Systems" column from static data, separately from `SystemsSection.tsx`. Fixed as Phase 4.4 cleanup (Footer now reads `systemsService` via the same exported query, no duplicated logic, no new compatibility layer) before this sprint was considered fully closed.

See `CHANGELOG.md` v0.23.0 and `PROJECT_STATE.md`'s Phase 4 entry for full detail.

---

## Current Sprint Scope (pending approval)

Carried forward unchanged from the pre-Sprint-4 backlog, plus three new Sprint 4 follow-ups:

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
4. **Student Union remainder** (Vision/Mission/Social Media) — still
   unaddressed; no confirmed schema or collection.
5. **"External Links"** (original Sprint 2.9 remainder) — may already
   be partially covered by Documents' `fileUrl` supporting any valid
   href, not just uploaded PDFs; needs confirmation whether a distinct
   feature is still wanted.
6. **Retire the three Sprint 4 temporary compatibility layers** — add
   `category`/`required` to `SystemDoc`, `icon` to `CommitteeDoc`,
   `socialLinks` to `LeadershipDoc`; update the corresponding admin
   forms; remove each static overlay.
7. **Study Plans / Documents content model** — decide whether to
   extend `DocumentResourceDoc` with image/dimension fields, or rework
   the public section into a PDF/download list backed by
   `documentsService` as-is.
8. **Bilingual Firestore content** — every collection migrated in
   Sprint 4 (and every collection already backing the admin dashboard)
   stores single-language strings only; a future sprint needs to
   decide and implement the bilingual field strategy.

**Not yet approved or started — do not implement until explicitly scoped.**

---

See `PROJECT_STATE.md` for full sprint history and `CHANGELOG.md` for
detailed per-version changes.

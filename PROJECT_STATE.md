# PROJECT_STATE.md

## MITSU

Tracks current progress, completed work, current sprint, and next actions.
Must be updated at the end of every sprint (00_PROJECT_RULES.md #22, #26).

---

## Current Status

**Phase:** Phase 2 — Dynamic Platform
**Current Sprint:** Sprint 2.2 — Firebase Services
**Status:** Complete
**Version:** v0.10.0

---

## Completed Work

### Phase 0 — Planning & Foundation (v0.1.0)

- Scaffolded Next.js 16 project, design tokens, fonts, theme/language systems, Git init.

### Phase 1 — Core Platform (v0.2.0 – v0.8.0)

- 7 sprints delivered: Layout Foundation, Homepage, University Systems, Freshman Guide, Student Union, Announcements & Events, About & Contact.
- 8 total public routes, fully bilingual (EN/AR), dark mode, RTL/LTR, accessible, 100% data-driven.

### Phase 2 — Sprint 2.1: Firebase Foundation (v0.9.0)

- Restructured Phase 0's flat `src/lib/firebase.ts` into `src/lib/firebase/` (`config.ts`, `collections.ts`, `index.ts`).
- Typed document interfaces + collection reference helpers for the original 8 Firestore collections (announcements, events, systems, committees, leadership, settings, documents, admins).
- Verified zero existing imports before/after the restructure — zero risk to any of the 8 public pages.

### Phase 2 — Sprint 2.2: Firebase Services (v0.10.0)

**Objective:** build the reusable backend service layer on top of Sprint 2.1, with zero UI changes and zero public page migration (per `CURRENT_SPRINT.md`).

**Extended `src/lib/firebase/collections.ts` (additive only — all 8 Sprint 2.1 exports untouched):**
- Added 3 new collections (`hero`, `homepage`, `guide`) and their document types (`HeroDoc`, `QuickAccessItemDoc`, `GuideSectionDoc`) plus reference getters (`getHeroCollection`, `getHomepageCollection`, `getGuideCollection`) — needed because these 3 domains didn't have a Firestore collection in the original Phase 0 schema. Mirror their equivalent local data files (`home.ts`, `guide.ts`) field-for-field.

**New: `src/lib/firebase/query-helpers.ts`**
- `buildQuery()` composes ordering, filtering, and pagination (`OrderOption`, `FilterOption`, `QueryOptions`) into one Firestore `Query`.
- `timestampToDate()` / `dateToTimestamp()` — Firestore Timestamp ⇄ JS Date conversion helpers.

**New: `src/lib/firebase/storage.ts`**
- `uploadImage(path, file)`, `deleteImage(path)`, `getDownloadURL(path)` — all take `path` as a parameter (no hardcoded Firebase Storage paths anywhere).

**New: `src/lib/firebase/services/createFirestoreService.ts`**
- Generic CRUD factory: `createFirestoreService<T>(getCollectionRef)` → `{ getAll, getById, create, update, remove }`. `getAll` accepts optional `QueryOptions` and uses `buildQuery` internally. One implementation, reused by all 7 domain services below — zero duplicated CRUD logic.

**New: 7 domain services (`src/lib/firebase/services/*.service.ts`), each ~3-10 lines:**
- `heroService`, `homepageService` — back new `hero`/`homepage` collections.
- `announcementsService`, `eventsService`, `systemsService` — reuse the existing Sprint 2.1 `announcements`/`events`/`systems` collections directly.
- `unionService` — reuses the existing Sprint 2.1 `committees` collection (the Student Union domain's clearest multi-document CRUD fit; `leadership` already has its own Sprint 2.1 collection reference too, available for a future dedicated service if needed — not duplicated here since exactly one "Student Union" service was requested).
- `guideService` — backs the new `guide` collection (Study Plans noted as a natural future fit for the existing `documents` collection instead of a new one).
- `src/lib/firebase/services/index.ts` — barrel export of all 7 services + the factory.

**Updated `src/lib/firebase/index.ts` (additive):** now also re-exports `query-helpers.ts`, `storage.ts`, and `services/`, alongside the untouched Sprint 2.1 `config.ts`/`collections.ts` exports.

**Verification:**
- `npm run lint` → passes, zero errors.
- `tsc --noEmit` → passes, zero TypeScript errors (confirms the generic factory, query helpers, and all 7 services are fully type-safe with no barrel-export collisions).
- `npm run build` → succeeds; all 8 existing public routes (`/`, `/about`, `/announcements`, `/contact`, `/guide`, `/systems`, `/union`, `/_not-found`) generate exactly as before — zero UI changes, as required.

**Constraints honored (per `CURRENT_SPRINT.md`):**
- No UI work, no Admin Dashboard, no Authentication pages, no public page migration.
- No hardcoded Firebase paths — all collection names centralized in `COLLECTIONS`, all Storage paths caller-provided.
- Fully typed, no duplicated code, builds directly on Sprint 2.1 (4 of 7 services reuse Sprint 2.1 collection getters unchanged).

---

## Current Sprint

**Sprint 2.2: Firebase Services** — CLOSED

Tasks completed:
- [x] Recovery audit (PROJECT_STATE.md, CURRENT_SPRINT.md, Sprint 2.1 verification, workspace inspection)
- [x] Extended `collections.ts` with hero/homepage/guide (additive, Sprint 2.1 untouched)
- [x] `query-helpers.ts` (ordering, filtering, pagination, timestamps)
- [x] `storage.ts` (uploadImage/deleteImage/getDownloadURL)
- [x] Generic CRUD factory (`createFirestoreService`)
- [x] All 7 domain services (hero, homepage, announcements, events, union, systems, guide)
- [x] Barrel exports (services/index.ts + top-level firebase/index.ts updated)
- [x] Verification: lint passes, TypeScript passes, build succeeds (8 routes unaffected)
- [x] PROJECT_STATE.md updated
- [x] CHANGELOG.md updated
- [x] Git commit created
- [x] Project archive created

---

## Next Actions (Sprint 2.3+ — not yet scoped/approved)

Per the Phase 2 roadmap:
- **Sprint 2.3 — Security Foundation:** Firestore/Storage security rules, auth roles, permission helpers.

Beyond that, Phase 3 (Dynamic Platform — migrating public pages from local data to these new services) and Phase 4 (Admin Dashboard) remain future work.

**Not yet started — awaiting explicit sprint scope approval before any implementation.**

---

## Outstanding Items / Blockers

- No real Firebase project exists yet — `.env.local` is not populated; all 8 public pages continue running entirely on local static data. The new service layer is fully built but unused until a future migration sprint.
- All Phase 1 outstanding items remain (official brand colors/photos pending, sample announcement content, unused Phase 0 `committees.ts`/`committee.types.ts` local data file, static-only search/filter on `/announcements`, unconfirmed Student Union office details).

---

## File Summary

### New in Sprint 2.2

**Backend services (10 files):**
- `src/lib/firebase/query-helpers.ts`
- `src/lib/firebase/storage.ts`
- `src/lib/firebase/services/createFirestoreService.ts`
- `src/lib/firebase/services/hero.service.ts`
- `src/lib/firebase/services/homepage.service.ts`
- `src/lib/firebase/services/announcements.service.ts`
- `src/lib/firebase/services/events.service.ts`
- `src/lib/firebase/services/union.service.ts`
- `src/lib/firebase/services/systems.service.ts`
- `src/lib/firebase/services/guide.service.ts`
- `src/lib/firebase/services/index.ts`

### Modified in Sprint 2.2 (additive only)

- `src/lib/firebase/collections.ts` — added hero/homepage/guide collections, types, getters; all 8 Sprint 2.1 exports unchanged
- `src/lib/firebase/index.ts` — added exports for the 3 new modules; Sprint 2.1's 2 exports unchanged

---

## Version History

See `CHANGELOG.md` for detailed change log by version.

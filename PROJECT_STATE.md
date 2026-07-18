# PROJECT_STATE.md

## MITSU

Tracks current progress, completed work, current sprint, and next actions.
Must be updated at the end of every sprint (00_PROJECT_RULES.md #22, #26).

---

## Current Status

**Phase:** Phase 2 — Backend Foundation
**Current Sprint:** Sprint 2.1 — Firebase Foundation
**Status:** Complete
**Version:** v0.9.0

---

## Completed Work

### Phase 0 — Planning & Foundation (v0.1.0)

- Scaffolded Next.js 16 project, design tokens, fonts, theme/language systems, Git init.
- Original flat `src/lib/firebase.ts` skeleton (safe no-op until configured) — superseded in Sprint 2.1.

### Phase 1 — Core Platform (v0.2.0 – v0.8.0)

**Sprint 1.1:** Reusable layout foundation — Navbar, Footer, MobileMenu, Container, Logo, Theme/Language switchers.
**Sprint 1.2:** Homepage — HeroSection, QuickAccessSection.
**Sprint 1.3:** University Systems — 5 official systems (Banner, Smart Learning, MUSTER, Teams, Outlook).
**Sprint 1.4:** Freshman Guide — 8 official academic-rule topics, 4 official study plan images.
**Sprint 1.5:** Student Union — overview, vision, mission, leadership, 7 committees, social links.
**Sprint 1.6:** Announcements & Events — sample/placeholder content (flagged for real-data replacement), static search/filter UI.
**Sprint 1.7:** About MITSU & Contact — platform identity, platform goals, office info (pending), President contact, official channels.

*(Bug fix between 1.5/1.6: unified WhatsApp Community URL to one source of truth.)*

Phase 1 is complete: all 7 public content sprints delivered, 8 total routes, fully bilingual (EN/AR), dark mode, RTL/LTR, accessible, 100% data-driven.

### Phase 2 — Sprint 2.1: Firebase Foundation (v0.9.0)

**Objective:** build the backend foundation without changing any existing public functionality (per `CURRENT_SPRINT.md`).

**Restructured (zero-risk — verified nothing imported the old file before moving it):**
- Replaced the flat `src/lib/firebase.ts` (Phase 0) with a proper `src/lib/firebase/` folder, per this sprint's explicit "Backend folder structure" requirement:
  - `src/lib/firebase/config.ts` — Firebase app/Firestore/Storage/Auth initialization, relocated from the old file with the same safe-`null`-until-configured behavior preserved exactly.
  - `src/lib/firebase/collections.ts` — **new.** Typed Firestore document interfaces (`AnnouncementDoc`, `EventDoc`, `SystemDoc`, `CommitteeDoc`, `LeadershipDoc`, `SettingsDoc`, `DocumentResourceDoc`, `AdminDoc`) mirroring `06_FIREBASE_SCHEMA.md` #5-12 exactly, plus typed `CollectionReference`/`DocumentReference` getter functions for all 8 canonical collections (`announcements`, `events`, `systems`, `committees`, `leadership`, `settings` — a single doc at `/settings/general`, `documents`, `admins`).
  - `src/lib/firebase/index.ts` — barrel export so future code can `import { db, getAnnouncementsCollection } from "@/lib/firebase"` without knowing the internal layout.
- `.env.local.example` — verified unchanged; already exactly matches the 6 env vars `config.ts` reads (Phase 0 got this right the first time, confirmed via diff, not assumed).

**Explicitly NOT built (reserved for Sprint 2.2 — Firebase Services, per `10_ROADMAP.md`):**
- No generic CRUD functions (`getAll`, `create`, `update`, `delete`).
- No `getDocs`/`addDoc`/`setDoc`/`onSnapshot` calls anywhere — the collection helpers only return typed references, never read or write data.
- No upload service, query helpers, or pagination helpers.

**Safety verification performed before touching anything:**
- Searched the entire `src/` tree for any import of `@/lib/firebase` — found none, confirming the Phase 0 file was completely unused and this restructure carries zero risk to any of the 8 existing public pages.
- Re-ran the same search after the move — still zero references to the old path, and the build's route list is unchanged (`/`, `/about`, `/announcements`, `/contact`, `/guide`, `/systems`, `/union`, `/_not-found`).

**Verification:**
- `npm run lint` → passes, zero errors.
- `tsc --noEmit` → passes, zero TypeScript errors (confirms the typed converters/collection generics are sound).
- `npm run build` → succeeds; all 8 existing routes generate exactly as before — no public page behavior changed.

**Constraints honored (per `CURRENT_SPRINT.md`):**
- No completed public page was modified.
- No static data was migrated to Firebase.
- No UI changed.
- No authentication screens or placeholder auth created.
- Only backend infrastructure was built.

---

## Current Sprint

**Sprint 2.1: Firebase Foundation** — CLOSED

Tasks completed:
- [x] Firebase SDK installation (already present from Phase 0, verified)
- [x] Firebase configuration (`config.ts`, relocated + preserved)
- [x] Environment variable setup (`.env.local.example`, verified matching, unchanged)
- [x] Firebase initialization (app)
- [x] Firestore initialization
- [x] Firebase Storage initialization
- [x] Firebase Authentication initialization
- [x] Shared Firebase service layer (`src/lib/firebase/` module, barrel-exported)
- [x] Collection reference helpers (all 8 collections, typed)
- [x] Folder structure for future backend services
- [x] Verification: lint passes, TypeScript passes, build succeeds (all 8 public routes unaffected)
- [x] PROJECT_STATE.md updated
- [x] CHANGELOG.md updated
- [x] Git commit created
- [x] Project archive created

---

## Next Actions (Sprint 2.2+ — not yet scoped/approved)

Per `10_ROADMAP.md` Phase 2:
- **Sprint 2.2 — Firebase Services:** generic CRUD services, upload service, query helpers, pagination helpers, built on top of this sprint's typed collection references.
- **Sprint 2.3 — Security Foundation:** Firestore/Storage security rules, auth roles, permission helpers.

**Not yet started — awaiting explicit sprint scope approval before any implementation.**

---

## Outstanding Items / Blockers

- No real Firebase project exists yet — `.env.local` is not populated; all 8 public pages continue running entirely on local static data.
- All Phase 1 outstanding items remain (official brand colors/photos pending, sample announcement content, unused Phase 0 `committees.ts`/`committee.types.ts`, static-only search/filter on `/announcements`, unconfirmed Student Union office details).

---

## File Summary

### New in Sprint 2.1

**Backend foundation (2 files):**
- `src/lib/firebase/collections.ts`
- `src/lib/firebase/index.ts`

### Moved/Restructured in Sprint 2.1

- `src/lib/firebase.ts` → `src/lib/firebase/config.ts` (content preserved exactly; confirmed zero existing imports before moving)

### Removed in Sprint 2.1

- `src/lib/firebase.ts` (flat file, superseded by the folder)

---

## Version History

See `CHANGELOG.md` for detailed change log by version.

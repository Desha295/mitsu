# PROJECT_STATE.md

## MITSU

Tracks current progress, completed work, current sprint, and next actions.
Must be updated at the end of every sprint (00_PROJECT_RULES.md #22, #26).

---

## Current Status

**Phase:** Phase 2 — Dynamic Platform
**Current Sprint:** Sprint 2.3 — Security Foundation
**Status:** Complete
**Version:** v0.11.0

---

## Completed Work

### Phase 0 — Planning & Foundation (v0.1.0)

- Scaffolded Next.js 16 project, design tokens, fonts, theme/language systems, Git init.

### Phase 1 — Core Platform (v0.2.0 – v0.8.0)

- 7 sprints delivered: Layout Foundation, Homepage, University Systems, Freshman Guide, Student Union, Announcements & Events, About & Contact.
- 8 total public routes, fully bilingual (EN/AR), dark mode, RTL/LTR, accessible, 100% data-driven.

### Phase 2 — Sprint 2.1: Firebase Foundation (v0.9.0)

- `src/lib/firebase/` folder (`config.ts`, `collections.ts`, `index.ts`) — typed document interfaces + collection reference helpers for the original 8 Firestore collections.

### Phase 2 — Sprint 2.2: Firebase Services (v0.10.0)

- Generic CRUD factory (`createFirestoreService`), 7 domain services (hero, homepage, announcements, events, union, systems, guide), query helpers (ordering/filtering/pagination), Storage helper (upload/delete/getDownloadURL).
- 3 new collections added (hero, homepage, guide), 8 Sprint 2.1 collections reused unchanged.

### Phase 2 — Sprint 2.3: Security Foundation (v0.11.0)

**Objective:** build the authorization/security foundation — rules, roles, permissions, session/route-guard utilities — with zero UI, zero admin dashboard, zero login page (per `CURRENT_SPRINT.md`).

**Firestore Security Rules (`firestore.rules`, project root):**
- All 11 collections (the original 8 from Sprint 2.1 plus hero/homepage/guide from Sprint 2.2): public read when `isPublished`/`isActive` is `true`, admin-only write.
- `/settings/general`: always publicly readable (site-wide config, no publish flag), admin-writable.
- `/admins/{uid}`: a user may read their own document (required for the `isAdmin()` check itself to function) or any document if `super_admin`; only `super_admin`s may write — granting admin access is a deliberately higher bar than managing content.
- Default-deny fallback for anything not explicitly matched.

**Firebase Storage Security Rules (`storage.rules`, project root):**
- `/images/**`: public read, admin write, 5MB limit, JPEG/PNG/WebP/SVG only.
- `/documents/**`: public read, admin write, 10MB limit.
- Admin status resolved via Storage's `firestore.exists()` cross-service rules feature against the same `/admins/{uid}` collection.
- Size/type limits deliberately duplicated in `src/lib/auth/constants.ts` for client-side validation — `.rules` files can't import TypeScript, so the two are documented as needing to stay in sync manually.

**New: `src/lib/auth/` module (9 files):**
- `types.ts` — `UserRole`, `AuthenticatedAdmin`, `AuthGuardState`.
- `constants.ts` — `ROLES`, `PERMISSIONS`, `ROLE_PERMISSIONS` mapping, file-validation size/type constants (kept in sync with `storage.rules`).
- `roles.ts` — `isValidRole`, `roleMeetsMinimum`, `isSuperAdmin`.
- `permissions.ts` — `hasPermission`, `hasAnyPermission`, `hasAllPermissions`, `getPermissionsForRole`.
- `validation.ts` — `isValidImageFile`, `isValidDocumentFile` (client-side pre-checks; the Storage rules remain the actual security boundary).
- `session.ts` — `signInWithEmail`, `signOutUser`, `getCurrentUser`, `subscribeToAuthState` (Firebase Auth wrappers; no login form built).
- `adminAuth.ts` — `getAdminForUser` (bridges a Firebase Auth user to their `/admins/{uid}` Firestore document and role).
- `routeGuard.ts` — `useAuthGuard` hook + `canAccess` helper (reusable client-side guard logic for a future protected admin layout; no layout/page uses it yet).
- `index.ts` — barrel export.

**New: `SECURITY.md` (project root)** — documents the role/permission model, how admin status is resolved, a summary of both rules files, deployment steps/checklist, and an explicit list of what this sprint deliberately did not build.

**Verification:**
- `npm run lint` → passes, zero errors.
- `tsc --noEmit` → passes, zero TypeScript errors (confirms the entire auth module is fully type-safe with no barrel-export collisions).
- `npm run build` → succeeds; all 8 existing public routes generate exactly as before — zero UI changes, as required.

**Constraints honored (per `CURRENT_SPRINT.md`):**
- No login page, no admin dashboard, no CRUD screens, no public page migration, no dynamic homepage/announcements/events.
- No Sprint 2.1/2.2 file modified — Sprint 2.3 only added new files.
- `.rules` files are **not yet deployed** — no real Firebase project exists; documented explicitly in `SECURITY.md` as a pre-deploy checklist item, since `.rules` syntax isn't validated by this project's lint/tsc/build pipeline.

---

## Current Sprint

**Sprint 2.3: Security Foundation** — CLOSED

Tasks completed:
- [x] Recovery audit (PROJECT_STATE.md, CURRENT_SPRINT.md, Sprint 2.2 verification, workspace/commit inspection)
- [x] `firestore.rules` — 11 collections + settings + admins, default-deny fallback
- [x] `storage.rules` — images/documents paths, size/type limits, cross-service admin check
- [x] Role definitions (`src/lib/auth/constants.ts`, `roles.ts`)
- [x] Permission helpers (`src/lib/auth/permissions.ts`)
- [x] Admin authorization foundation (`src/lib/auth/adminAuth.ts`)
- [x] Session helpers (`src/lib/auth/session.ts`)
- [x] Route guard utilities (`src/lib/auth/routeGuard.ts`)
- [x] Shared auth/permission constants and types (`constants.ts`, `types.ts`)
- [x] File-validation helpers (`validation.ts`)
- [x] Barrel export (`src/lib/auth/index.ts`)
- [x] `SECURITY.md` documentation
- [x] Verification: lint passes, TypeScript passes, build succeeds (8 routes unaffected)
- [x] PROJECT_STATE.md updated
- [x] CHANGELOG.md updated
- [x] Git commit created
- [x] Project archive created

---

## Next Actions (Sprint 2.4+ — not yet scoped/approved)

Phase 2's backend foundation (Firebase config, services, security) is now complete across Sprints 2.1–2.3. Likely next candidates:
- **Admin Dashboard Foundation:** login page, protected layout (using this sprint's `useAuthGuard`), dashboard shell.
- **Public page migration:** begin moving one or more of the 8 public pages from local data to the Sprint 2.2 services.

**Not yet started — awaiting explicit sprint scope approval before any implementation.**

---

## Outstanding Items / Blockers

- No real Firebase project exists yet — `.env.local` is not populated. The entire Sprint 2.1–2.3 backend/security foundation is built but unused until a migration sprint.
- **New this sprint:** `firestore.rules`/`storage.rules` have not been deployed or validated against a live project or the Firebase Emulator Suite — flagged as a required pre-deploy step in `SECURITY.md`.
- **New this sprint:** the first `super_admin` document must be created manually in `/admins/{uid}` once a project exists — there is no self-service sign-up by design.
- All prior outstanding items remain (official brand colors/photos, sample announcement content, unused Phase 0 `committees.ts` local data file, static-only search/filter on `/announcements`, unconfirmed Student Union office details).

---

## File Summary

### New in Sprint 2.3

**Security rules (2 files, project root):**
- `firestore.rules`
- `storage.rules`

**Documentation (1 file, project root):**
- `SECURITY.md`

**Auth foundation (9 files):**
- `src/lib/auth/types.ts`
- `src/lib/auth/constants.ts`
- `src/lib/auth/roles.ts`
- `src/lib/auth/permissions.ts`
- `src/lib/auth/validation.ts`
- `src/lib/auth/session.ts`
- `src/lib/auth/adminAuth.ts`
- `src/lib/auth/routeGuard.ts`
- `src/lib/auth/index.ts`

### Modified in Sprint 2.3

None — Sprint 2.3 only added new files; no Sprint 2.1/2.2 file was touched.

---

## Version History

See `CHANGELOG.md` for detailed change log by version.

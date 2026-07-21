# PROJECT_STATE.md

## MITSU

Tracks current progress, completed work, current sprint, and next actions.
Must be updated at the end of every sprint (00_PROJECT_RULES.md #22, #26).

---

## Current Status

**Phase:** Phase 2 — Dynamic Platform
**Current Sprint:** Sprint 2.4 — Authentication Integration
**Status:** Complete
**Version:** v0.12.0

---

## Completed Work

### Phase 0 — Planning & Foundation (v0.1.0)

- Scaffolded Next.js 16 project, design tokens, fonts, theme/language systems, Git init.

### Phase 1 — Core Platform (v0.2.0 – v0.8.0)

- 7 sprints delivered: Layout Foundation, Homepage, University Systems, Freshman Guide, Student Union, Announcements & Events, About & Contact.
- 8 total public routes, fully bilingual (EN/AR), dark mode, RTL/LTR, accessible, 100% data-driven.

### Phase 2 — Sprint 2.1: Firebase Foundation (v0.9.0)

- `src/lib/firebase/` — typed document interfaces + collection reference helpers for the original 8 Firestore collections.

### Phase 2 — Sprint 2.2: Firebase Services (v0.10.0)

- Generic CRUD factory, 7 domain services, query helpers, Storage helper.

### Phase 2 — Sprint 2.3: Security Foundation (v0.11.0)

- `firestore.rules`, `storage.rules`, `src/lib/auth/` (roles, permissions, session helpers, admin authorization, route guard scaffolding), `SECURITY.md`.

### Phase 2 — Sprint 2.4: Authentication Integration (v0.12.0)

**Objective:** build the complete reusable authentication layer using Firebase Authentication — no Admin Dashboard yet (per `CURRENT_SPRINT.md`).

**New: `src/context/AuthContext.tsx` (`AuthProvider` + `AuthContext`):**
- Follows the exact same Context+hook pattern as `ThemeContext`/`LanguageContext` (Phase 0) — no external state library.
- Exposes `{ user, loading, loginWithGoogle, loginWithEmail, logout }`. `loading` starts `true` and only resolves once Firebase's first `onAuthStateChanged` callback fires, since (unlike theme/language's synchronous `localStorage` reads) Firebase Auth session restoration is inherently asynchronous.
- Delegates every method to Sprint 2.3's `session.ts` helpers (`signInWithEmail`, `signOutUser`) rather than reimplementing Firebase calls — thin wrapper, not a duplicate.

**New: `src/hooks/useAuth.ts`** — mirrors `useTheme.ts`/`useLanguage.ts` exactly.

**New: `src/components/shared/RequireAuth.tsx`** — gates children behind authentication: loading state while resolving, redirect to `/login` if signed out, renders children once authenticated. Not used by any page yet (no Admin Dashboard this sprint) — the reusable primitive a future protected layout will wrap itself in.

**New: `src/components/sections/LoginSection.tsx` + `src/app/login/page.tsx`** — real, working login form (email/password + Google Sign-In button), calling `useAuth()`'s methods directly. No registration, no password reset (out of scope). Not linked from main navigation (admin-facing utility page). `robots: noindex` set in page metadata.

**Extended `src/lib/auth/session.ts` (additive):**
- Added `signInWithGoogle()` (`GoogleAuthProvider` + `signInWithPopup`). All Sprint 2.3 exports (`signInWithEmail`, `signOutUser`, `getCurrentUser`, `subscribeToAuthState`) unchanged.

**Refactored `src/lib/auth/routeGuard.ts` (required, not gratuitous):**
- `useAuthGuard()` previously ran its own independent `subscribeToAuthState` subscription (Sprint 2.3, before `useAuth()` existed). Now consumes the new `useAuth()` hook instead, so there's exactly one Firebase Auth subscription shared by both — directly satisfies this sprint's explicit "do not duplicate logic" requirement. Public return shape (`AuthGuardState`) unchanged; verified zero existing consumers before making this change, so nothing broke.
- Along the way, fixed a real `react-hooks/set-state-in-effect` lint error (calling `setState` synchronously in an effect body) by deriving the loading flag instead of setting it directly — the same category of fix already applied to `ThemeContext`/`LanguageContext` in Sprint 1.1.

**Extended `src/context/Providers.tsx` (additive):** now wraps `<AuthProvider>` around `Navbar`/`main`/`Footer`, inside `ThemeProvider`/`LanguageProvider`. `useAuth()` is available anywhere in the tree, including the new login page.

**Localization:** added `login.*` keys to `en.json`/`ar.json` (heading, labels, submit states, Google sign-in, generic error message). Reused the existing `common.loading` key for `RequireAuth`'s loading state.

**Verification:**
- `npm run lint` → passes, zero errors (after fixing the set-state-in-effect issue above).
- `tsc --noEmit` → passes, zero TypeScript errors.
- `npm run build` → succeeds; all 8 prior public routes generate unchanged, plus the new `/login` route — 9 total.

**Constraints honored (per `CURRENT_SPRINT.md`):**
- No Admin Dashboard, no CRUD, no Firestore content editing, no media management, no role management UI, no registration, no password reset, no analytics.
- No placeholder implementations — the login form genuinely calls Firebase Authentication and works end-to-end (once a real project is configured).

---

## Current Sprint

**Sprint 2.4: Authentication Integration** — CLOSED

Tasks completed:
- [x] Firebase Authentication integration (email/password + Google, via Sprint 2.3/2.4 `session.ts`)
- [x] `AuthProvider` / `AuthContext`
- [x] `useAuth()` hook
- [x] `loginWithGoogle()`, `loginWithEmail()`, `logout()`
- [x] Session persistence (Firebase's default persistence, surfaced via `subscribeToAuthState`)
- [x] Current user helper (`getCurrentUser`, reused from Sprint 2.3)
- [x] Authentication loading state
- [x] `RequireAuth` component
- [x] Login page (`/login`, real working form)
- [x] Refactored `useAuthGuard` to eliminate duplicated Firebase Auth subscription
- [x] Verification: lint passes (after a real fix), TypeScript passes, build succeeds (9 routes)
- [x] PROJECT_STATE.md updated
- [x] CHANGELOG.md updated
- [x] Git commit created
- [x] Project archive created

---

## Next Actions (Sprint 2.5+ — not yet scoped/approved)

Per the Phase 2/3 roadmap:
- **Sprint 2.5 — Dynamic Content Integration:** begin migrating public pages from local data to the Sprint 2.2 services.
- **Sprint 3.1 — Admin Dashboard Foundation:** the first consumer of this sprint's `RequireAuth`/`useAuthGuard`/login page.

**Not yet started — awaiting explicit sprint scope approval before any implementation.**

---

## Outstanding Items / Blockers

- No real Firebase project exists yet — `.env.local` is not populated. The entire auth layer resolves to its safe "not configured" paths at runtime until then.
- No admin account exists to actually sign in with yet — the first `super_admin` document must be created manually in `/admins/{uid}` (per `SECURITY.md`), and Firebase Console must have Email/Password and Google sign-in providers enabled.
- All prior outstanding items remain (official brand colors/photos, sample announcement content, unused Phase 0 `committees.ts` local data file, static-only search/filter on `/announcements`, unconfirmed Student Union office details, undeployed `firestore.rules`/`storage.rules`).

---

## File Summary

### New in Sprint 2.4

**Context & hooks (2 files):**
- `src/context/AuthContext.tsx`
- `src/hooks/useAuth.ts`

**Components (2 files):**
- `src/components/shared/RequireAuth.tsx`
- `src/components/sections/LoginSection.tsx`

**Routes (1 file):**
- `src/app/login/page.tsx`

### Modified in Sprint 2.4

- `src/lib/auth/session.ts` — added `signInWithGoogle()` (additive; Sprint 2.3 exports unchanged)
- `src/lib/auth/routeGuard.ts` — refactored to consume `useAuth()`, eliminating duplicated subscription; fixed a real set-state-in-effect lint error
- `src/context/Providers.tsx` — added `AuthProvider` to the tree
- `src/locales/en.json` / `ar.json` — added `login.*` section

---

## Version History

See `CHANGELOG.md` for detailed change log by version.

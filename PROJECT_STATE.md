# PROJECT_STATE.md

## MITSU

Tracks current progress, completed work, current sprint, and next actions.
Must be updated at the end of every sprint (00_PROJECT_RULES.md #22, #26).

---

## Current Status

**Phase:** Phase 3 — Admin Dashboard
**Current Sprint:** Sprint 3.1 — Admin Dashboard Foundation
**Status:** Complete
**Version:** v0.13.0

---

## Completed Work

### Phase 0 — Planning & Foundation (v0.1.0)

- Scaffolded Next.js 16 project, design tokens, fonts, theme/language systems, Git init.

### Phase 1 — Core Platform (v0.2.0 – v0.8.0)

- 7 sprints delivered: Layout Foundation, Homepage, University Systems, Freshman Guide, Student Union, Announcements & Events, About & Contact.
- 8 total public routes, fully bilingual (EN/AR), dark mode, RTL/LTR, accessible, 100% data-driven.

### Phase 2 — Dynamic Platform (v0.9.0 – v0.12.0)

- **Sprint 2.1 — Firebase Foundation:** `src/lib/firebase/` (config, typed collections for 8 Firestore collections).
- **Sprint 2.2 — Firebase Services:** generic CRUD factory, 7 domain services, query helpers, Storage helper.
- **Sprint 2.3 — Security Foundation:** `firestore.rules`, `storage.rules`, `src/lib/auth/` (roles, permissions, session, admin authorization, route guard scaffolding), `SECURITY.md`.
- **Sprint 2.4 — Authentication Integration:** `AuthProvider`/`useAuth`, `RequireAuth`, real login page (email/password + Google), `useAuthGuard` refactored to share one Firebase Auth subscription.

### Phase 3 — Sprint 3.1: Admin Dashboard Foundation (v0.13.0)

**Objective:** build the reusable Admin Dashboard UI foundation — layout, navigation, placeholder dashboard home, protected routing — with zero CRUD, zero forms, zero Firestore reads/writes (per `CURRENT_SPRINT.md`).

**New: `src/components/admin/` (13 components):**
- `AdminLayout` — shell composing Sidebar + Topbar + content, owns collapsed/mobile-open state.
- `AdminSidebar` — 11 nav items (`data/adminNavigation.ts`); only "Dashboard" is a real link this sprint, the other 10 render as non-interactive "Coming soon" items rather than linking to routes that don't exist yet. Collapsible on desktop (icon-only width), off-canvas on mobile with the same accessible pattern as `MobileMenu` (Sprint 1.1): Escape-to-close, scroll lock, backdrop click.
- `AdminTopbar` — mobile menu toggle, desktop collapse toggle, reused `ThemeSwitcher`/`LanguageSwitcher`, User Profile Area (real Firebase user info), Logout button calling `useAuth().logout()` directly.
- `AdminHeader` — page-level breadcrumb + title + description + actions slot.
- `Breadcrumb` — generic trail component, RTL-aware separator (`rtl:rotate-180`).
- `PageContainer` — admin content-width wrapper, mirrors the public `Container`.
- `SectionHeader` — small heading for individual sections within a page.
- `AdminCard` — base card primitive; `StatCard` and `QuickActionCard` build on it.
- `StatCard` — icon + label + value; dashboard passes a translated "Coming soon" placeholder value, never a fabricated number.
- `QuickActionCard` — rendered disabled/"coming soon" this sprint, since its target management pages don't exist yet — avoids dead links.
- `EmptyState` — generic reusable "nothing here yet" placeholder.
- `Unauthorized` — 403 state for signed-in users who aren't registered admins.
- `LoadingDashboard` — loading state shown while auth/admin status resolves.

**New: `src/data/adminNavigation.ts`, `src/data/adminDashboard.ts`** — sidebar nav items and dashboard stats/quick-actions data, fully data-driven per project convention (zero hardcoded content in components).

**New routes:**
- `src/app/admin/layout.tsx` — protects the entire `/admin` segment (and every future nested route under it) by layering `RequireAuth` (Sprint 2.4: not signed in → redirect to `/login`) around `useAuthGuard` (Sprint 2.3/2.4: signed in but not an admin → `Unauthorized`). Neither piece was reimplemented.
- `src/app/admin/page.tsx` — Dashboard Home: welcome section with real logged-in user info, placeholder stat cards, disabled quick-action cards, empty-state Recent Activity, and a genuinely accurate (not fabricated) System Status check via `isFirebaseConfigured`.

**Localization:** added a full `admin.*` section to `en.json`/`ar.json` (nav labels, sidebar/topbar strings, breadcrumb root, dashboard headings, stat/quick-action labels, unauthorized copy, loading message).

**New: `CURRENT_SPRINT.md`** (project root) — didn't previously exist in the working repository; created to track the active sprint alongside `PROJECT_STATE.md`/`CHANGELOG.md`.

**Verification:**
- `npm run lint` → passes, zero errors.
- `tsc --noEmit` → passes, zero TypeScript errors (all 13 components, the layout, and the page were type-safe on the first pass).
- `npm run build` → succeeds; `/admin` now included as a static route alongside all 9 prior routes (10 total).

**Constraints honored (per `CURRENT_SPRINT.md`):**
- No CRUD, no forms, no Firestore reads/writes anywhere in this sprint's code.
- No Sprint 1.x page or Sprint 2.x backend/auth file was modified — Sprint 3.1 only added new files.
- Reused `AuthProvider`/`useAuth`/`RequireAuth`/`useAuthGuard` exactly as built in Sprint 2.3/2.4 — no duplicated authentication logic.

**Known architectural tradeoff (flagged for follow-up, not fixed this sprint):**
- `/admin` currently renders **nested inside** the public root layout's `Navbar`/`Footer` (from `src/context/Providers.tsx`), rather than replacing them with dedicated full-page admin chrome. Giving `/admin` its own separate root layout would require restructuring routing into Next.js route groups (e.g. moving every existing public page into a `(public)` segment) — a structural change to every Sprint 1.x route's file location, which this sprint's explicit "do not modify Sprint 1.x/2.x" constraint rules out. The dashboard is fully functional as built; this is a visual/UX cleanup candidate for an explicitly-scoped future sprint, not a functional gap.

---

## Current Sprint

**Sprint 3.1: Admin Dashboard Foundation** — CLOSED

Tasks completed:
- [x] 13 reusable admin components (`components/admin/`)
- [x] `data/adminNavigation.ts`, `data/adminDashboard.ts`
- [x] `admin.*` localization (EN/AR)
- [x] `/admin` protected layout (`RequireAuth` + `useAuthGuard`, no duplicated auth logic)
- [x] `/admin` Dashboard Home page (welcome, stats, quick actions, recent activity, system status — all static placeholders)
- [x] Loading / Unauthorized / Empty states wired correctly
- [x] Verification: lint passes, TypeScript passes, build succeeds (10 routes)
- [x] Production fonts restored
- [x] `CURRENT_SPRINT.md` created
- [x] PROJECT_STATE.md updated
- [x] CHANGELOG.md updated
- [x] Git commit created

---

## Next Actions — Sprint 3.2 (current, not yet implemented)

**Phase:** Phase 3 — Admin Dashboard
**Sprint:** Sprint 3.2 — Hero Management (per the original Phase 3 roadmap naming)
**Status:** READY TO START

Likely scope (pending explicit approval before implementation):
- First real CRUD management page under `/admin`, backed by Sprint 2.2's `heroService`.
- Would be the first sprint to actually exercise Sprint 2.1's Firestore collections and Sprint 2.2's services against real data.

---

## Outstanding Items / Blockers

- No real Firebase project exists yet — `.env.local` is not populated. The dashboard is fully built but shows only placeholders until then.
- No admin account exists yet — the first `super_admin` document must still be created manually in `/admins/{uid}` per `SECURITY.md`, and Email/Password + Google providers must be enabled in the Firebase Console.
- **New this sprint:** `/admin` nests inside the public Navbar/Footer rather than having dedicated admin-only page chrome — see the architectural tradeoff note above.
- All prior outstanding items remain (official brand colors/photos, sample announcement content, unused Phase 0 `committees.ts` local data file, static-only search/filter on `/announcements`, unconfirmed Student Union office details, undeployed `firestore.rules`/`storage.rules`).

---

## File Summary

### New in Sprint 3.1

**Components (13 files, `src/components/admin/`):**
AdminLayout, AdminSidebar, AdminTopbar, AdminHeader, AdminCard, StatCard, QuickActionCard, Breadcrumb, PageContainer, SectionHeader, EmptyState, Unauthorized, LoadingDashboard.

**Data (2 files):**
- `src/data/adminNavigation.ts`
- `src/data/adminDashboard.ts`

**Routes (2 files):**
- `src/app/admin/layout.tsx`
- `src/app/admin/page.tsx`

**Project docs (1 file):**
- `CURRENT_SPRINT.md` (new to the working repository)

### Modified in Sprint 3.1

- `src/locales/en.json` / `ar.json` — added `admin.*` section

### Removed in Sprint 3.1

- `src/app/admin/.gitkeep` — superseded by real `layout.tsx`/`page.tsx`

---

## Version History

See `CHANGELOG.md` for detailed change log by version.

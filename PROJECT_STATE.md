# PROJECT_STATE.md

## MITSU

Tracks current progress, completed work, current sprint, and next actions.
Must be updated at the end of every sprint (00_PROJECT_RULES.md #22, #26).

---

## Current Status

**Phase:** Phase 3 — Admin Dashboard
**Current Sprint:** Sprint 3.3 — Announcements Management
**Status:** Complete
**Version:** v0.15.0

---

## Completed Work

### Phase 0 — Planning & Foundation (v0.1.0)

- Scaffolded Next.js 16 project, design tokens, fonts, theme/language systems, Git init.

### Phase 1 — Core Platform (v0.2.0 – v0.8.0)

- 7 sprints delivered: Layout Foundation, Homepage, University Systems, Freshman Guide, Student Union, Announcements & Events, About & Contact.
- 8 public routes, fully bilingual (EN/AR), dark mode, RTL/LTR, accessible, 100% data-driven.

### Phase 2 — Dynamic Platform (v0.9.0 – v0.12.0)

- Firebase Foundation, Firebase Services (generic CRUD factory, 7 domain services), Security Foundation (rules, roles, permissions), Authentication Integration (AuthProvider/useAuth/RequireAuth/login page).

### Phase 3 — Sprint 3.1: Admin Dashboard Foundation (v0.13.0)

- 13 reusable admin components, protected `/admin` route, static-placeholder Dashboard Home. No CRUD.

### Phase 3 — Sprint 3.2: Hero Management (v0.14.0)

**Objective:** first real CRUD admin page, backed entirely by Sprint 2.2's `heroService` and Sprint 2.2's `storage.ts` — no new backend architecture, only its first real consumer.

**New: `src/app/admin/hero/page.tsx`**
- Fetches existing hero content via `heroService.getAll()`. When multiple documents exist, prefers the one with `isActive: true`, falling back to the first — ensures exactly one document is treated as "the" hero content for editing, without adding new query infrastructure.
- Shows `EmptyState` + creation form when no hero document exists yet; shows the populated edit form otherwise.
- Gated by a new `manageHero` permission (see below) via `useAuthGuard`/`canAccess`, on top of the same `Unauthorized`/`LoadingDashboard` states from Sprint 3.1.
- Loading state derived (not set synchronously in an effect body) — same fix pattern as Sprint 1.1/2.4.

**New: `src/components/admin/HeroForm.tsx`**
- Reusable form for both creating and editing hero content (same component, different `onSubmit`).
- Full field validation: required fields, and href/URL format validation (accepts relative paths like `/guide` or absolute URLs) — inline error messages per field, submission blocked until valid.
- Image upload wired to Sprint 2.2's `uploadImage()` and Sprint 2.3's `isValidImageFile()` — own loading/error state, auto-fills the `imageUrl` field on success. The manual URL field remains available alongside upload.
- Success/error/saving states surfaced to the user throughout.

**Extended (additive) `src/lib/auth/constants.ts`:** added `manageHero` permission, granted to both `admin` and `super_admin` roles. All other Sprint 2.3 permissions unchanged.

**Extended `src/components/admin/QuickActionCard.tsx`:** now supports a real linked state (`href` prop) in addition to the existing disabled/"coming soon" state — Hero is the first quick action to use it.

**Extended `src/data/adminNavigation.ts`:** Hero sidebar item marked `isImplemented: true` (now a real link, no longer "coming soon").

**Extended `src/app/admin/page.tsx`:** Hero quick-action card now passes a real `href`; all other quick actions remain disabled pending their own future sprints.

**Localization:** added `admin.hero.*` to `en.json`/`ar.json` (page heading/subheading, empty state, all form field labels, upload states, validation messages).

**Verification:**
- `npm run lint` → passes, zero errors (after fixing one real `react-hooks/set-state-in-effect` issue, same category as prior sprints).
- `tsc --noEmit` → passes, zero TypeScript errors.
- `npm run build` → succeeds; `/admin/hero` now included as a static route alongside all 10 prior routes (11 total).

**Constraints honored:**
- No Sprint 1.x page, Sprint 2.x backend file, or Sprint 3.1 component was redesigned — only `QuickActionCard` and `adminNavigation.ts`/dashboard page were extended additively to reflect Hero becoming real.
- Reused `heroService`, `uploadImage`, `isValidImageFile`, `useAuthGuard`, `canAccess` exactly as built — no duplicated CRUD or storage logic.

### Phase 3 — Sprint 3.3: Announcements Management (v0.15.0)

**Objective:** second real CRUD admin page, extending Sprint 3.2's pattern from a singleton (Hero) to a true list, backed entirely by Sprint 2.2's `announcementsService` — no new backend architecture.

**New: `src/app/admin/announcements/page.tsx`**
- Fetches all announcements via `announcementsService.getAll()`, ordered by `createdAt` descending.
- Tracks a `formTarget` of `WithId<AnnouncementDoc> | "new" | null` to switch between list, create, and edit views.
- Shows `EmptyState` when no announcements exist; otherwise a list of `AnnouncementListItem` rows with edit/delete actions.
- Delete routes through the new `ConfirmDialog` before calling `.remove()`.
- Gated by the existing `manageAnnouncements` permission (defined in Sprint 2.3, unused until now) via `useAuthGuard`/`canAccess`, same `Unauthorized`/`LoadingDashboard` states as Sprint 3.1/3.2.
- Sets `createdAt`/`updatedAt` explicitly via `Timestamp.now()` (both on create, only `updatedAt` on edit) since `AnnouncementDoc` requires both fields.

**New: `src/components/admin/AnnouncementForm.tsx`**
- Reusable form for both creating and editing (same component, different `onSubmit`) — same shape as `HeroForm`.
- Required-field validation plus href/URL format validation via the newly-shared `isValidHref()`.
- Category and priority `<select>` fields reuse the public site's own taxonomy (`src/data/announcements.ts` types and `announcements.filters.*`/`announcements.priority.*` translation keys) instead of a separate admin vocabulary.
- Image upload wired to Sprint 2.2's `uploadImage()` and Sprint 2.3's `isValidImageFile()`, identical flow to `HeroForm`'s.

**New: `src/components/admin/AnnouncementListItem.tsx`**
- Reuses the public `AnnouncementCard`'s badge vocabulary (category icons/labels, priority emphasis) so the admin list matches what students actually see.

**New: `src/components/admin/ConfirmDialog.tsx`**
- Generic confirmation dialog, no Announcements-specific text — first reusable Modal-category component per `07_COMPONENT_RULES.md`, ready for Events/Union/etc. Reuses the existing `bg-overlay`/`animate-fade-in` tokens from `MobileMenu`.

**Extended (additive) `src/lib/utils.ts`:** added shared `isValidHref()` export. `HeroForm`'s own inline copy is untouched.

**Extended `src/data/adminNavigation.ts`:** Announcements sidebar item marked `isImplemented: true`.

**Extended `src/app/admin/page.tsx`:** Announcements quick-action card now passes a real `href`, alongside Hero's.

**Localization:** added `admin.announcements.*` to `en.json`/`ar.json`.

**Verification:**
- `npm run lint` → passes, zero errors.
- `tsc --noEmit` → passes, zero TypeScript errors.
- `npm run build` → succeeds; `/admin/announcements` now included as a static route alongside all 11 prior routes (12 total).

**Constraints honored:**
- No Sprint 1.x page, Sprint 2.x backend file, or Sprint 3.1/3.2 component was redesigned — only additive extensions (navigation, quick actions, shared util, locales).
- Reused `announcementsService`, `uploadImage`, `isValidImageFile`, `useAuthGuard`, `canAccess` exactly as built — no duplicated CRUD or storage logic.

---

## Current Sprint

**Sprint 3.3: Announcements Management** — CLOSED

Tasks completed:
- [x] Announcements management page (`/admin/announcements`) using `announcementsService`
- [x] `AnnouncementForm` — create/edit, field validation, image upload
- [x] `AnnouncementListItem` — list row, reuses public `AnnouncementCard` badge vocabulary
- [x] `ConfirmDialog` — generic reusable delete confirmation
- [x] Shared `isValidHref()` extracted to `lib/utils.ts`
- [x] Sidebar/dashboard quick-action updated to reflect Announcements as implemented
- [x] Localization (EN/AR)
- [x] Verification: lint, TypeScript, build all pass (12 routes)
- [x] Production fonts restored
- [x] PROJECT_STATE.md updated
- [x] CHANGELOG.md updated
- [x] CURRENT_SPRINT.md advanced to Sprint 3.4
- [x] Git commit created

---

## Next Actions — Sprint 3.4 (current, not yet implemented)

**Phase:** Phase 3 — Admin Dashboard
**Status:** READY TO START

Likely scope (pending explicit approval): Events management under `/admin/events`, backed by Sprint 2.2's `eventsService` (already built, unused until now), following the same list/create/edit/delete pattern established in Sprint 3.3 — including reuse of `ConfirmDialog`.

---

## Outstanding Items / Blockers

- No real Firebase project exists yet — `.env.local` is not populated, so Hero and Announcements management cannot be exercised end-to-end until then.
- No admin account exists yet — first `super_admin` document must be created manually per `SECURITY.md`.
- `/admin` still nests inside the public Navbar/Footer (flagged in Sprint 3.1, unchanged).
- All other prior outstanding items remain unchanged.

---

## File Summary

### New in Sprint 3.3

- `src/app/admin/announcements/page.tsx`
- `src/components/admin/AnnouncementForm.tsx`
- `src/components/admin/AnnouncementListItem.tsx`
- `src/components/admin/ConfirmDialog.tsx`

### Modified in Sprint 3.3

- `src/lib/utils.ts` — added shared `isValidHref()`
- `src/data/adminNavigation.ts` — Announcements marked implemented
- `src/app/admin/page.tsx` — Announcements quick action now links to real page
- `src/locales/en.json` / `ar.json` — added `admin.announcements.*`

---

## Version History

See `CHANGELOG.md` for detailed change log by version.

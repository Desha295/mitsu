# PROJECT_STATE.md

## MITSU

Tracks current progress, completed work, current sprint, and next actions.
Must be updated at the end of every sprint (00_PROJECT_RULES.md #22, #26).

---

## Current Status

**Phase:** Phase 5 — Site Settings Foundation
**Current Sprint:** Sprint 5.0 — Site Settings Foundation
**Status:** Complete
**Version:** v0.24.0

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

### Phase 3 — Sprint 3.4: Events Management (v0.16.0)

**Objective:** third real CRUD admin page, extending Sprint 3.3's list pattern to Events, backed entirely by Sprint 2.2's `eventsService` — no new backend architecture, and the first sprint to prove out `ConfirmDialog`'s reusability by using it unchanged.

**New: `src/app/admin/events/page.tsx`**
- Fetches all events via `eventsService.getAll()`, ordered by `date` ascending (soonest first) — matches the public `EventsSection`'s own sort, and is more useful for managing upcoming activities than `createdAt`.
- Same `formTarget`/list/create/edit structure as Sprint 3.3's Announcements page.
- Delete routes through the existing `ConfirmDialog` — reused with zero modifications.
- Gated by the existing `manageEvents` permission (defined in Sprint 2.3, unused until now).

**New: `src/components/admin/EventForm.tsx`**
- Same create/edit shape as `AnnouncementForm`. `EventDoc.date` (`Timestamp`) is tracked as an isolated `dateInput` string, converted via the existing `dateToTimestamp()` query helper only on submit — consistent with how `isActive`/`isPublished` are handled outside the generic values object in the two prior forms.
- Category is optional (unlike Announcement's), so a "no category" option is offered alongside the public site's `EventCategory` values and `events.categories.*` translation keys.
- Image upload wired to the same `uploadImage()`/`isValidImageFile()` as the prior two forms.

**New: `src/components/admin/EventListItem.tsx`**
- Reuses the public `EventCard`'s category icons/labels; mirrors `AnnouncementListItem`'s published/draft badge and edit/delete buttons. Always shows the event date and location (when present).

**Extended `src/data/adminNavigation.ts`:** Events sidebar item marked `isImplemented: true`.

**Extended `src/app/admin/page.tsx`:** Events quick-action card now passes a real `href`, alongside Hero's and Announcements'.

**Localization:** added `admin.events.*` to `en.json`/`ar.json`.

**Also included — HeroForm hotfix (internal quality fix, no separate version bump):**
- `src/components/admin/HeroForm.tsx` — fixed a real "uncontrolled input becoming controlled" React warning. An existing hero document fetched from Firestore could be missing a field at runtime (schemaless storage) even though `HeroDoc` types it as required, leaving an input's `value` as `undefined` until the user typed into it. Fixed via `normalizeHeroValues()`, which coalesces every field to an empty-string/`false` fallback before the initial `useState` call. No functional change.

**Verification:**
- `npm run lint` → passes, zero errors, zero warnings.
- `tsc --noEmit` → passes, zero TypeScript errors.
- `npm run build` → succeeds; `/admin/events` now included as a static route alongside all 12 prior routes (13 total).

**Constraints honored:**
- No Sprint 1.x page, Sprint 2.x backend file, or Sprint 3.1/3.2/3.3 component was redesigned — only additive extensions (navigation, quick actions, locales) plus the contained HeroForm state-initialization fix.
- Reused `eventsService`, `uploadImage`, `isValidImageFile`, `isValidHref`, `ConfirmDialog`, `useAuthGuard`, `canAccess` exactly as built — no duplicated CRUD, storage, or dialog logic.

### Phase 3 — Sprint 3.5: Student Union (Committees) Management (v0.17.0)

**Objective:** fourth real CRUD admin page, extending Sprint 3.3/3.4's list pattern to Student Union committees, backed entirely by Sprint 2.2's `unionService` — no new backend architecture, and second sprint running to reuse `ConfirmDialog` with zero modifications.

**New: `src/app/admin/union/page.tsx`**
- Fetches all committees via `unionService.getAll()`, ordered by `order` ascending — the field `CommitteeDoc` defines specifically for display sequence.
- Same `formTarget`/list/create/edit structure as Sprint 3.3/3.4.
- Delete routes through the existing `ConfirmDialog` — reused unchanged for a second sprint.
- Gated by the existing `manageUnion` permission (defined in Sprint 2.3, unused until now).
- Computes a sensible next `order` value from the current list whenever "New Committee" is opened.

**New: `src/components/admin/CommitteeForm.tsx`**
- Same create/edit shape as `AnnouncementForm`/`EventForm`. Simplest schema so far — no category, priority, or date.
- Reuses `isActive` (like Hero, not `isPublished` like Announcement/Event) and adds `order`, tracked as an isolated `orderInput` string (same approach `EventForm` used for `date`), parsed back to a number only on submit.
- Image upload wired to the same `uploadImage()`/`isValidImageFile()` as the prior three forms.

**New: `src/components/admin/CommitteeListItem.tsx`**
- Mirrors `AnnouncementListItem`/`EventListItem`'s structure; shows an active/inactive badge and the committee's display order.

**Extended `src/data/adminNavigation.ts`:** Student Union sidebar item marked `isImplemented: true`.

**Localization:** added `admin.union.*` to `en.json`/`ar.json`.

**Deliberately not touched:** `src/app/admin/page.tsx` / `src/data/adminDashboard.ts` — the dashboard's Quick Actions list (Sprint 3.1) never included a "Student Union" card, so there was no existing quick-action entry to link, unlike Hero/Announcements/Events. Adding one would introduce new dashboard content beyond this sprint's scope.

**Also confirmed, no code change:** `unionService` manages the `committees` collection only, not Leadership — Leadership has its own collection reference but no service yet, per Sprint 2.2's documented deferral.

**Verification:**
- `npm run lint` → passes, zero errors, zero warnings.
- `tsc --noEmit` → passes, zero TypeScript errors.
- `npm run build` → succeeds; `/admin/union` now included as a static route alongside all 13 prior routes (14 total).

**Constraints honored:**
- No Sprint 1.x page, Sprint 2.x backend file, or Sprint 3.1–3.4 component was redesigned — only additive extensions (navigation, locales).
- Reused `unionService`, `uploadImage`, `isValidImageFile`, `isValidHref`, `ConfirmDialog`, `useAuthGuard`, `canAccess` exactly as built — no duplicated CRUD, storage, or dialog logic.

### Phase 3 — Sprint 3.6: University Systems Management (v0.18.0)

**Objective:** fifth real CRUD admin page, extending Sprint 3.3/3.4/3.5's list pattern to University Systems, backed entirely by Sprint 2.2's `systemsService` — no new backend architecture, and third sprint running to reuse `ConfirmDialog` with zero modifications.

**New: `src/app/admin/systems/page.tsx`**
- Fetches all systems via `systemsService.getAll()`, ordered by `order` ascending.
- Same `formTarget`/list/create/edit structure as Sprint 3.3/3.4/3.5.
- Delete routes through the existing `ConfirmDialog` — reused unchanged for a third sprint.
- Gated by the existing `manageSystems` permission (defined in Sprint 2.3, unused until now).

**New: `src/components/admin/SystemForm.tsx`**
- Same create/edit shape as `CommitteeForm`. `SystemDoc` has no image field — `icon` is a plain Lucide icon-name string, matching the public `SystemCard`'s own lookup, so this form shows a small live icon preview instead of an upload control.
- `officialUrl` is required by the schema's type but validated as effectively optional (format-checked only when non-empty), matching the public `data/systems.ts`'s real usage where MUSTER's `officialUrl` is an empty string meaning "no portal yet" — `SystemCard` already treats that as a legitimate "Coming soon" state.

**New: `src/components/admin/SystemListItem.tsx`**
- Mirrors `CommitteeListItem`'s active/inactive + order badges; shows a "Visit official site" link or "Coming soon" label depending on `officialUrl`.

**Extended `src/data/adminNavigation.ts`:** University Systems sidebar item marked `isImplemented: true`.

**Localization:** added `admin.systems.*` to `en.json`/`ar.json`.

**Deliberately not touched:** `src/app/admin/page.tsx` / `src/data/adminDashboard.ts` — same reasoning as Sprint 3.5, no existing "Systems" quick-action card to link.

**No new Firestore collections:** `systems` already existed in `COLLECTIONS` from Sprint 2.1 — nothing new to create manually.

**Verification:**
- `npm run lint` → passes, zero errors, zero warnings.
- `tsc --noEmit` → passes, zero TypeScript errors.
- `npm run build` → succeeds; `/admin/systems` now included as a static route alongside all 14 prior routes (15 total).

**Constraints honored:**
- No Sprint 1.x page, Sprint 2.x backend file, or Sprint 3.1–3.5 component was redesigned — only additive extensions (navigation, locales).
- Reused `systemsService`, `isValidHref`, `ConfirmDialog`, `useAuthGuard`, `canAccess` exactly as built — no duplicated CRUD or dialog logic.

### Phase 3 — Sprint 3.7: Freshman Guide Management (v0.19.0)

**Objective:** sixth real CRUD admin page, extending Sprint 3.3–3.6's list pattern to the Freshman Guide, backed entirely by Sprint 2.2's `guideService` — no new backend architecture, and fourth sprint running to reuse `ConfirmDialog` with zero modifications. First schema with array fields (`facts`, `stats`).

**New: `src/app/admin/guide/page.tsx`**
- Fetches all guide sections via `guideService.getAll()`, ordered by `order` ascending.
- Same `formTarget`/list/create/edit structure as Sprint 3.3–3.6.
- Delete routes through the existing `ConfirmDialog` — reused unchanged for a fourth sprint.
- Gated by the existing `manageGuide` permission (defined in Sprint 2.3, unused until now).

**New: `src/components/admin/GuideForm.tsx`**
- Same create/edit shape as `SystemForm`/`CommitteeForm`, extended with dynamic add/remove-row editors for `facts` (string bullets) and `stats` (label/value pairs) — the first schema needing array-field UI.
- Blank rows silently dropped on submit rather than validated — matches the fields' own optionality.
- `icon` required (unlike `SystemDoc`'s optional icon); `highlight` tracked separately from `isActive`, same isolate-boolean pattern used throughout.

**New: `src/components/admin/GuideListItem.tsx`**
- Mirrors `SystemListItem`'s icon/active/order badges; adds a "Highlighted" badge and fact/stat counts.

**Extended `src/data/adminNavigation.ts`:** Freshman Guide sidebar item marked `isImplemented: true`.

**Localization:** added `admin.guide.*` to `en.json`/`ar.json`.

**Deliberately not touched:** `src/app/admin/page.tsx` / `src/data/adminDashboard.ts` — same reasoning as Sprint 3.5/3.6, no existing "Guide" quick-action card to link.

**No new Firestore collections:** `guide` already existed in `COLLECTIONS` from Sprint 2.1.

**Verification:**
- `npm run lint` → passes, zero errors, zero warnings.
- `tsc --noEmit` → passes, zero TypeScript errors.
- `npm run build` → succeeds; `/admin/guide` now included as a static route alongside all 15 prior routes (16 total).

**Constraints honored:**
- No Sprint 1.x page, Sprint 2.x backend file, or Sprint 3.1–3.6 component was redesigned — only additive extensions (navigation, locales).
- Reused `guideService`, `ConfirmDialog`, `useAuthGuard`, `canAccess` exactly as built — no duplicated CRUD or dialog logic.
- No speculative "generic list editor" component extracted for facts/stats — kept inline since there's only one consumer so far.

### Phase 3 — Sprint 3.8: Quick Access Management (v0.20.0)

**Objective:** seventh real CRUD admin page, extending Sprint 3.3–3.7's list pattern to the homepage's Quick Access cards, backed entirely by Sprint 2.2's `homepageService` — a service that has existed fully wired since Sprint 2.2 but was never used until this sprint. Preceded by a dedicated Sprint 3.8 scoping pass reconciling `ROADMAP.md` against `PROJECT_STATE.md`/`CURRENT_SPRINT.md`/the actual codebase.

**New: `src/app/admin/quick-access/page.tsx`**
- Fetches all Quick Access cards via `homepageService.getAll()`, ordered by `order` ascending.
- Same `formTarget`/list/create/edit structure as Sprint 3.3–3.7.
- Delete routes through the existing `ConfirmDialog` — reused unchanged for a fifth sprint.
- Gated by the existing `manageHomepage` permission (defined in Sprint 2.3, unused until now).

**New: `src/components/admin/QuickAccessForm.tsx`**
- Same create/edit shape as `SystemForm`, including the live icon preview. Every field on `QuickAccessItemDoc` is required (unlike `SystemDoc`'s optional `officialUrl`/`icon`), so validation is uniform across all four text fields.

**New: `src/components/admin/QuickAccessListItem.tsx`**
- Mirrors `SystemListItem`'s icon/active/order badges; shows `href` as plain text rather than a clickable link, since it's typically an internal route.

**Extended `src/data/adminNavigation.ts`:** added a **new** Quick Access sidebar entry — unlike every prior sprint, this nav item didn't already exist and need flipping; the Sprint 3.8 scoping pass specifically surfaced that gap.

**Localization:** added `admin.nav.quickAccess` and `admin.quickAccess.*` to `en.json`/`ar.json`.

**Deliberately not touched:** `src/app/admin/page.tsx` / `src/data/adminDashboard.ts` — same reasoning as Sprints 3.5–3.7, no existing quick-action card to link.

**No new Firestore collections:** `homepage` already existed in `COLLECTIONS` from Sprint 2.1.

**Completes:** the original `ROADMAP.md` Sprint 2.7 "Homepage CMS" deliverable (Hero in Sprint 3.2, Quick Access here) — except Homepage Images/Links, which the scoping pass mapped to a future Settings sprint instead (`SettingsDoc` already covers logos/campus image/social links; distinct schema from `homepage`'s Quick Access cards).

**Verification:**
- `npm run lint` → passes, zero errors, zero warnings.
- `tsc --noEmit` → passes, zero TypeScript errors.
- `npm run build` → succeeds; `/admin/quick-access` now included as a static route alongside all 16 prior routes (17 total).

**Constraints honored:**
- No Sprint 1.x page, Sprint 2.x backend file, or Sprint 3.1–3.7 component was redesigned — only additive extensions (navigation, locales).
- Reused `homepageService`, `isValidHref`, `ConfirmDialog`, `useAuthGuard`, `canAccess` exactly as built — no duplicated CRUD or dialog logic.

### Phase 3 — Sprint 3.9: Leadership Management (v0.21.0)

**Objective:** eighth real CRUD admin page, extending Sprint 3.3–3.8's list pattern to Leadership — the first sprint since 3.2 requiring a genuinely new domain service rather than wiring up one already built. Closes the deliberate deferral from Sprint 3.5, when `unionService` was scoped to Committees only.

**New: `src/lib/firebase/services/leadership.service.ts`**
- Wraps the `leadership` collection reference (existing since Sprint 2.1) with the same `createFirestoreService` factory used by all six prior domain services.

**New: `src/app/admin/leadership/page.tsx`**
- Fetches all leadership members via `leadershipService.getAll()`, ordered by `order` ascending.
- Same `formTarget`/list/create/edit structure as Sprint 3.3–3.8.
- Delete routes through the existing `ConfirmDialog` — reused unchanged for a sixth sprint.
- Gated by the new `manageLeadership` permission.

**New: `src/components/admin/LeadershipForm.tsx`**
- Mirrors `CommitteeForm` almost exactly. `position` replaces `description` as the second required field; a new optional `bio` textarea added. Same image upload flow as Committee/Announcement/Event, different storage path.

**New: `src/components/admin/LeadershipListItem.tsx`**
- Mirrors `CommitteeListItem`'s badges; `position` shown as a subtitle, `bio` shown only when present.

**Extended `src/lib/auth/constants.ts`:** added a **new** `manageLeadership` permission — no existing permission fit Leadership as its own distinct resource, since `manageUnion` was already scoped specifically to Committees. Follows the same one-per-content-area pattern as every other permission; granted to `admin` (and `super_admin` automatically).

**Extended `src/lib/firebase/services/index.ts`:** new `leadership.service` export.

**Extended `src/data/adminNavigation.ts`:** added a **new** Leadership sidebar entry (didn't exist before, same situation as Sprint 3.8's Quick Access), placed right after Student Union.

**Localization:** added `admin.nav.leadership` and `admin.leadership.*` to `en.json`/`ar.json`.

**Verified, no change needed:** `firestore.rules` already had a matching `/leadership/{id}` rule (written ahead of any UI, same as every other collection) — Firestore rules gate on `isAdmin()` at the role level and don't reference the fine-grained `PERMISSIONS` constants, so no rules update was required.

**No new Firestore collections:** `leadership` already existed in `COLLECTIONS` from Sprint 2.1.

**Verification:**
- `npm run lint` → passes, zero errors, zero warnings.
- `tsc --noEmit` → passes, zero TypeScript errors.
- `npm run build` → succeeds; `/admin/leadership` now included as a static route alongside all 17 prior routes (18 total).

**Constraints honored:**
- No Sprint 1.x page, Sprint 2.x backend file, or Sprint 3.1–3.8 component was redesigned — only additive extensions (new service, new permission, navigation, locales).
- Reused `ConfirmDialog`, `uploadImage`, `isValidImageFile`, `isValidHref`, `useAuthGuard`, `canAccess`, and the `createFirestoreService` factory exactly as built.

### Phase 3 — Sprint 3.10: Study Plans / Documents Management (v0.22.0)

**Objective:** ninth real CRUD admin page, extending Sprint 3.3–3.9's list pattern to downloadable documents (study plans, regulations, PDFs) — the second sprint requiring a genuinely new domain service (`documentsService`), after Sprint 3.9's `leadershipService`.

**New: `src/lib/firebase/services/documents.service.ts`**
- Wraps the `documents` collection reference (existing since Sprint 2.1) with the same `createFirestoreService` factory used by all eight prior domain services.

**New: `src/app/admin/study-plans/page.tsx`**
- Fetches all documents via `documentsService.getAll()`, ordered by `uploadedAt` descending — this schema has no `order` field, so recency (like Announcements) is the meaningful sort, not sequence (like Committees/Systems/Guide/Quick Access).
- Same `formTarget`/list/create/edit structure as Sprint 3.3–3.9.
- Delete routes through the existing `ConfirmDialog` — reused unchanged for a seventh sprint.
- Gated by the new `manageStudyPlans` permission.

**New: `src/components/admin/DocumentForm.tsx`**
- title/description/category (required) plus `fileUrl` (manual entry or PDF upload). `category` is a plain text field — no fixed vocabulary exists for it anywhere, unlike Announcement/Event's categories.

**New: `src/components/admin/DocumentListItem.tsx`**
- Published/draft badge, plain category badge, always-present "Open PDF" link, uploaded date.

**New: `uploadDocument()` in `src/lib/firebase/storage.ts`**
- Identical implementation to `uploadImage()`, added under its own name for callers' clarity. `uploadImage` untouched.

**Extended `src/lib/auth/constants.ts`:** added a **new** `manageStudyPlans` permission — no existing permission fit, same situation as Sprint 3.9's `manageLeadership`.

**Extended `src/lib/firebase/services/index.ts`:** new `documents.service` export.

**Extended `src/data/adminNavigation.ts`:** existing Study Plans sidebar entry flipped to `isImplemented: true` (this one already existed — no new nav entry needed, unlike Sprint 3.8/3.9).

**Localization:** added `admin.studyPlans.*` to `en.json`/`ar.json`.

**Verified, no changes needed:** `isValidDocumentFile`/`MAX_DOCUMENT_SIZE_BYTES` already existed (Sprint 2.3, unused until now); `firestore.rules`'s `/documents/{id}` and `storage.rules`'s `/documents/{allPaths=**}` (10MB) already existed too — all pre-built ahead of this UI, same pattern found repeatedly across this project.

**No new Firestore collections:** `documents` already existed in `COLLECTIONS` from Sprint 2.1.

**Verification:**
- `npm run lint` → passes, zero errors, zero warnings.
- `tsc --noEmit` → passes, zero TypeScript errors.
- `npm run build` → succeeds; `/admin/study-plans` now included as a static route alongside all 18 prior routes (19 total).

**Constraints honored:**
- No Sprint 1.x page, Sprint 2.x backend file, or Sprint 3.1–3.9 component was redesigned — only additive extensions (new service, new storage helper, new permission, navigation, locales).
- Reused `ConfirmDialog`, `isValidHref`, `formatDate`, `timestampToDate`, `useAuthGuard`, `canAccess`, and the `createFirestoreService` factory exactly as built.

### Phase 4 — Public Site Firebase Migration: Sprint 4 (v0.23.0)

**Objective:** migrate the public website's runtime data source from static `src/data/*.ts` files to Firestore, section by section, reusing the nine domain services already built in Phase 3 — no schema redesign, no admin dashboard changes, Firestore becomes the only runtime source of truth for migrated sections.

**Migrated (8 of 9 public sections), each via its existing service, filtered/ordered to match the deployed security rules, with loading/empty/error states added:**

| Phase | Section | Service | Query filter | Order |
|---|---|---|---|---|
| 4.0 | Hero | `heroService` | `isActive == true` | — |
| 4.1 | Quick Access | `homepageService` | `isActive == true` | `order` asc |
| 4.2 | Announcements | `announcementsService` | `isPublished == true` | `createdAt` desc |
| 4.3 | Events | `eventsService` | `isPublished == true` | `date` asc |
| 4.4 | University Systems | `systemsService` | `isActive == true` | `order` asc |
| 4.5 | Freshman Guide | `guideService` | `isActive == true` | `order` asc |
| 4.6 | Committees | `unionService` | `isActive == true` | `order` asc |
| 4.7 | Leadership | `leadershipService` | `isActive == true` | `order` asc |

**New: `src/hooks/useFirestoreList.ts`**
- Single shared client hook wrapping any `FirestoreService.getAll()` call with loading/error/data state via `useEffect`/`useState`. The one new abstraction this sprint introduces; reused by all 8 migrated sections rather than duplicated per section.

**Correctness fix (Phase 4.0):** Hero's initial query omitted the `isActive == true` filter required by the already-deployed `firestore.rules`. A filter-less `list` call fails entirely for signed-out visitors, since Firestore can't verify every possible result satisfies the rule without the constraint being part of the query itself. Caught during review and corrected before final approval; the equivalent filter was applied correctly from the start in every subsequent phase.

**Business-logic correction (Phase 4.2):** an initial Announcements implementation inferred a "featured" announcement from the most recently created published item, since `AnnouncementDoc` has no `featured` field. Identified as an invented business rule not present in the schema and removed at explicit direction — all published announcements now render in a single grid, newest first, with no featured-slot inference.

**Intentional exception — Study Plans / Documents (Phase 4.8, not migrated):** `StudyPlansSection` remains on `src/data/studyPlans.ts` as a live runtime source, not just historical reference. The public UI is an image gallery with a zoom viewer (raster images with required intrinsic width/height); Firestore's `documents` collection / `documentsService` models generic downloadable PDFs (`DocumentForm.tsx` enforces `accept="application/pdf"` on upload; no width/height field exists anywhere in `DocumentResourceDoc`). These are different content models, not two representations of the same data — no field-level compatibility mapping was possible without either fabricating a correspondence between unrelated items or redesigning the section into a document/download list, both ruled out for this sprint. Documented directly in `StudyPlansSection.tsx`'s file comment. Revisit once the content model itself is decided.

**Temporary compatibility layers (three, each isolated to its own section file, none shared or exported):**

| Section | Field(s) kept on static data | Source | Join key |
|---|---|---|---|
| Systems (4.4) | `category`, `required` | `src/data/systems.ts` | `order` (1–5) |
| Committees (4.6) | `icon` | `src/data/union.ts` | `order` (1–7) |
| Leadership (4.7) | `socialLinks` | `src/data/union.ts` | fixed convention: `order = 1` → President, `order = 2` → Vice President |

None of `SystemDoc`, `CommitteeDoc`, or `LeadershipDoc` have these fields today; each was flagged and approved before implementation rather than invented. All three are clearly commented as temporary Sprint 4 shims to be removed once the corresponding schema fields exist. `PASSWORD_RESET_URL` (Systems) and `unionSocialLinks` (Committees page) remain static for a different reason — no Firestore field exists anywhere for either, not a migration gap.

**Shared component contract changes:**
- `QuickAccessCard`, `AnnouncementCard`, `EventCard`, `SystemCard`, `GuideCard`, `CommitteeCard` — each changed from accepting a whole static translation-key object to resolved primitive props, since Firestore stores plain strings, not translation keys. Each confirmed to have exactly one real consumer before its contract changed.
- `LeaderCard` — shared by `LeadershipSection` (now Firestore-backed) and `ContactSection` (fully static, out of scope for Sprint 4). Given a single clean prop contract; `ContactSection`'s one call site was updated mechanically to match, with zero change to its behavior, data source, or content.

**Modified, supporting infrastructure:**
- `next.config.ts` — added `images.remotePatterns` for `firebasestorage.googleapis.com`, required for `next/image` to render Storage-hosted URLs now flowing through Hero/Leadership.
- `src/locales/en.json` / `ar.json` — added loading/empty/error copy for every migrated section (most never needed empty/error states before, since static data was always non-empty).

**Verification:**
- `npm run lint` → passes, zero errors, zero warnings (checked after every phase).
- `tsc --noEmit` → passes, zero TypeScript errors (checked after every phase).
- `npm run build` → succeeds; still 21 routes (no new pages added — only data-source changes to existing ones). Production-font stub/restore procedure applied and confirmed reverted at every build check.

**Constraints honored:**
- No Firestore schema, admin form, or admin dashboard page was modified.
- `src/data/*.ts` files remain in the repo — as pure historical reference for the 8 fully-migrated sections, and as live (temporary) sources for the three compatibility layers plus Study Plans.

**Post-completion cleanup — Footer (treated as Phase 4.4 cleanup, not a new sprint):**
A runtime-import audit conducted at sprint close found that `src/components/layout/Footer.tsx` independently built its own "University Systems" link column directly from static `src/data/systems.ts`, separately from `SystemsSection.tsx` — a real gap Phase 4.4 had missed, since Footer doesn't render `SystemsSection` itself. Fixed: `Footer.tsx` now reads via `useFirestoreList(systemsService, ACTIVE_SYSTEMS_ORDERED)`, reusing the exact same exported query constant `SystemsSection.tsx` defines (no duplicated query logic, no new compatibility layer — Footer only needed `name`/`officialUrl`, both already in `SystemDoc`). `PASSWORD_RESET_URL` untouched (Footer never imported it). Re-verified: `lint`/`tsc`/`build` all pass; a repeat runtime-import audit confirms `src/data/systems` now has exactly one remaining import (`SystemsSection.tsx`'s own compatibility-layer usage) anywhere in the codebase.

**Post-Sprint-4 infrastructure fix — Firestore composite indexes:**
Every public section combining a `filters` equality clause with `orderByField` on a different field (Quick Access, Announcements, Events, Systems, Guide, Committees, Leadership — 7 total) failed at runtime once real Firestore data existed, because no composite index had ever been defined for the project (no `firestore.indexes.json`, no `firebase.json` existed at all). Root cause was confirmed via actual runtime execution of the real `firebase/firestore` SDK (not inference), and via a full re-trace of `buildQuery()`/`createFirestoreService`/`useFirestoreList` confirming none of them swallow errors. Fix: added `firestore.indexes.json` (7 composite indexes, one per affected query) and `firebase.json` (didn't exist before — ties `firestore.rules`/`storage.rules`/the new indexes file together). No query, hook, or service code changed; `orderByField` was kept exactly as architected in every section. Requires `firebase deploy --only firestore:indexes` to actually take effect on the live project.

### Phase 5 — Site Settings Foundation: Sprint 5.0 (v0.24.0)

**Objective:** build the first singleton-document admin CRUD page (`/settings/general`), the architectural piece flagged as needed since Sprint 4's own backlog, and move global site configuration (site name, WhatsApp Community URL, footer social links, contact email/phone/office location, logo URLs) off hardcoded constants/data files and into Firestore — additive only, no redesign of the public site.

**New: singleton-document service architecture**
- `src/lib/firebase/services/createFirestoreDocService.ts` — new factory parallel to `createFirestoreService`, for a single fixed-path document instead of a collection. `update()` uses `setDoc(ref, data, { merge: true })`, collapsing create-if-missing/update-if-present into one operation — no separate create/update branching needed, and this sidesteps the exact bug class fixed in Hero (a stray `undefined` field crashing a raw write).
- `src/lib/firebase/services/settings.service.ts` — `settingsService = createFirestoreDocService(getSettingsDocRef)`, reusing the doc reference from Sprint 2.1.
- `src/hooks/useFirestoreDoc.ts` — singleton-doc counterpart to `useFirestoreList`, same loading/error/cancelled-guard pattern, for public sections.

**Schema — additive only:** `SettingsDoc` extended with `contactEmail?`, `contactPhone?`, `officeLocation?` (all optional, unset by default — no admin page or public consumer existed for this collection before this sprint, so nothing depended on the old shape).

**New admin page:** `src/app/admin/settings/page.tsx` + `src/components/admin/SettingsForm.tsx`. Simpler than every other admin page — one document, one form, one save handler, no list/create/delete. **No `ConfirmDialog`** — genuinely not applicable (nothing to ever delete). Validation reuses `isValidHref` for every URL field; a small new `isValidEmail` for `contactEmail`. `adminNavigation.ts` flipped to implemented — the dashboard Quick Action that pointed here since Sprint 3 is no longer dangling.

**Public-site wiring (three deliberately scoped changes):**
- `FooterSocialLinks.tsx` — WhatsApp/Facebook/Instagram hrefs now from Settings; icon/label metadata still from the existing static file. Exact same disabled-vs-real-link rendering preserved; "Coming soon" caption only shows while every link is unset.
- `Logo.tsx` — site name now Settings-driven, but with an instant-default pattern (`BRAND_NAME` renders immediately, silently upgrades if Settings has a different value) since this is universally-rendered, above-the-fold chrome where a loading flicker would be a real UX regression.
- `ContactSection.tsx` — `location`/`email` office-info cards now read `officeLocation`/`contactEmail` from Settings, falling back to the exact same "Coming soon" treatment as before when unset. `hours` untouched (not requested).

**Explicit scope boundaries (deliberate):** no `<img>` logo added anywhere (schema/admin-form fields exist, but no public component renders an image logo today — adding one would be new UI, not a data-source swap); page `<title>`/metadata exports untouched (still use `BRAND_NAME` — converting Next.js static metadata to async `generateMetadata()` across 9+ pages was out of scope); `contactPhone` has a schema field and admin input but no new public UI card (none exists to replace); `unionSocialLinks`/`WHATSAPP_COMMUNITY_URL` in `CommitteesSection.tsx` untouched ("Footer social links" was requested, not the separate Union-page social block).

**Verification:** `npm run lint` → passes (one warning found and fixed during implementation). `tsc --noEmit` → passes (one export-visibility issue found and fixed). `npm run build` → succeeds; 22 routes (new `/admin/settings`).

**Constraints honored:** No existing Firestore schema field was changed or removed. No existing admin page, form, or public section's established behavior changed — only additive extensions and the three explicitly-scoped public-consumer wirings above.

---

## Current Sprint

**Sprint 5.0: Site Settings Foundation** — CLOSED

Tasks completed:
- [x] `createFirestoreDocService` factory created — one new abstraction, for singleton documents (parallel to `createFirestoreService`)
- [x] `settingsService` created, backed by `/settings/general`
- [x] `useFirestoreDoc` hook created — singleton-doc counterpart to `useFirestoreList`
- [x] `SettingsDoc` extended (additive): `contactEmail?`, `contactPhone?`, `officeLocation?`
- [x] Admin Settings page + form built — load, update, validation, loading/success/error states, no ConfirmDialog (not applicable)
- [x] `adminNavigation.ts` Settings entry flipped to implemented
- [x] `FooterSocialLinks.tsx` wired to Settings (WhatsApp/Facebook/Instagram)
- [x] `Logo.tsx` wired to Settings (site name), with a flicker-safe instant-default pattern
- [x] `ContactSection.tsx` wired to Settings (office location/email), "Coming soon" fallback preserved
- [x] Localization (EN/AR) — full `admin.settings.*` namespace
- [x] Verification: lint, TypeScript, build all pass (22 routes — new `/admin/settings`)
- [x] Production fonts restored after every build check
- [x] PROJECT_STATE.md updated
- [x] CHANGELOG.md updated
- [x] CURRENT_SPRINT.md advanced to Sprint 6
- [x] Git commit created

---

## Next Actions — Sprint 6 (not yet scoped)

**Phase:** Phase 6 — TBD (naming pending)
**Status:** READY TO START — scope needs explicit confirmation

Carried forward, unchanged, from the pre-Sprint-5 backlog (Site Settings itself is now done):

1. **Contact / About Management** — no existing collection, schema, or service at all, and both pages are still mostly translation-key driven (office location/email now Settings-driven per Sprint 5.0; the rest of About/Contact content is not). Raises an unresolved bilingual-content-in-Firestore question. High complexity — needs its own scoping conversation.
2. **Security Foundation** (original Sprint 2.10) — Firestore/Storage rules hardening and permission review across all collections. Medium complexity, best done as its own dedicated pass.
3. **Student Union remainder** (Vision/Mission/Social Media) — still unaddressed; no confirmed schema or collection.
4. **"External Links"** (original Sprint 2.9 remainder) — may already be partially covered by Documents' `fileUrl`; needs confirmation.

Carried forward from Sprint 4:

5. **Retire the three temporary compatibility layers** — add `category`/`required` to `SystemDoc`, `icon` to `CommitteeDoc`, `socialLinks` to `LeadershipDoc`; update the corresponding admin forms; remove each static overlay and its `order`-based join.
6. **Study Plans / Documents content model** — decide whether to extend `DocumentResourceDoc` with image/dimension fields, or rework the public section into a PDF/download list backed by `documentsService` as-is.
7. **Bilingual Firestore content** — every migrated collection still stores single-language strings; a future sprint needs to decide and implement the bilingual field strategy.

New follow-ups from Sprint 5.0:

8. **Image logo wiring** — `logoUrl`/`universityLogoUrl`/`campusImageUrl` are in the schema and admin form but have no public `<img>` consumer yet; add one if/when desired.
9. **Dynamic page metadata** — page `<title>`/meta description still use the static `BRAND_NAME` constant; converting to Firestore-driven `generateMetadata()` across all pages was out of scope for Sprint 5.0.
10. **Deploy the Firestore composite indexes** (`firestore.indexes.json`, added post-Sprint-4) and the Site Settings Firestore rule coverage once a real Firebase project is connected.

No sprint has been approved yet — needs explicit direction before starting.

---

## Outstanding Items / Blockers

- No real Firebase project exists yet — `.env.local` is not populated, so no admin module or public section can be exercised end-to-end until then.
- No admin account exists yet — first `super_admin` document must be created manually per `SECURITY.md`.
- `/admin` still nests inside the public Navbar/Footer (flagged in Sprint 3.1, unchanged).
- Dashboard Quick Actions still only cover Hero/Announcements/Events/Settings — Student Union, Leadership, University Systems, Freshman Guide, Quick Access, and Study Plans (and any future CMS page) have no quick-action card unless one is deliberately added.
- Contact/About have no Firestore schema, collection, or service for their remaining content (office location/email now come from Settings; the rest is still translation-key driven) — and raise an unresolved bilingual-content-in-Firestore question.
- Vision/Mission/Social Media (Student Union remainder) have no confirmed schema or collection.
- Three temporary compatibility layers remain in place (Systems' `category`/`required`, Committees' `icon`, Leadership's `socialLinks`), each isolated to its own section file and clearly marked, pending future schema additions.
- Study Plans/Documents public section intentionally remains on static data — different content model from the Firestore `documents` collection, not yet reconciled.
- Every Firestore collection migrated in Sprint 4 (and Settings, added in Sprint 5.0) stores single-language content only; bilingual strategy remains undecided.
- The Firestore composite indexes (`firestore.indexes.json`, added post-Sprint-4) still need `firebase deploy --only firestore:indexes` run against a real project before ordered public queries will work live.
- **New:** `logoUrl`/`universityLogoUrl`/`campusImageUrl` (Settings) have no public `<img>` consumer yet — schema/admin-form only.
- **New:** page `<title>`/meta description still use the static `BRAND_NAME` constant, not Settings — out of scope for Sprint 5.0.
- **Resolved in Sprint 5.0:** no singleton-document service pattern existed for `/settings/general` — `createFirestoreDocService`/`settingsService` now provide this. No longer an outstanding item.
- All other prior outstanding items remain unchanged.

---

## File Summary

### New in Sprint 3.10

- `src/lib/firebase/services/documents.service.ts`
- `src/app/admin/study-plans/page.tsx`
- `src/components/admin/DocumentForm.tsx`
- `src/components/admin/DocumentListItem.tsx`

### Modified in Sprint 3.10

- `src/lib/firebase/storage.ts` — new `uploadDocument()` export
- `src/lib/auth/constants.ts` — new `manageStudyPlans` permission
- `src/lib/firebase/services/index.ts` — new export added
- `src/data/adminNavigation.ts` — Study Plans marked implemented
- `src/locales/en.json` / `ar.json` — added `admin.studyPlans.*`

### New in Sprint 4

- `src/hooks/useFirestoreList.ts` — the sprint's one new shared abstraction

### Modified in Sprint 4

- `src/components/sections/HeroSection.tsx`
- `src/components/sections/QuickAccessSection.tsx`
- `src/components/sections/AnnouncementsSection.tsx`
- `src/components/sections/EventsSection.tsx`
- `src/components/sections/SystemsSection.tsx`
- `src/components/sections/FreshmanGuideSection.tsx`
- `src/components/sections/CommitteesSection.tsx`
- `src/components/sections/LeadershipSection.tsx`
- `src/components/sections/ContactSection.tsx` — mechanical `LeaderCard` call-site adaptation only; no behavior/data-source change
- `src/components/sections/StudyPlansSection.tsx` — comment only, documenting the intentional Sprint 4 exception; no code/behavior change
- `src/components/shared/QuickAccessCard.tsx`
- `src/components/shared/AnnouncementCard.tsx`
- `src/components/shared/EventCard.tsx`
- `src/components/shared/SystemCard.tsx`
- `src/components/shared/GuideCard.tsx`
- `src/components/shared/CommitteeCard.tsx`
- `src/components/shared/LeaderCard.tsx` — prop contract cleaned up, shared by two callers
- `next.config.ts` — Firebase Storage `remotePatterns`
- `src/locales/en.json` / `ar.json` — loading/empty/error copy for every migrated section
- `src/components/layout/Footer.tsx` — Phase 4.4 cleanup: University Systems column migrated to Firestore (found via runtime-import audit)
- `src/components/sections/SystemsSection.tsx` — `ACTIVE_SYSTEMS_ORDERED` exported (no logic change) so Footer could reuse it without duplication

### New in Sprint 5.0

- `src/lib/firebase/services/createFirestoreDocService.ts` — singleton-document service factory
- `src/lib/firebase/services/settings.service.ts` — `settingsService`
- `src/hooks/useFirestoreDoc.ts` — singleton-doc counterpart to `useFirestoreList`
- `src/app/admin/settings/page.tsx` — Site Settings admin page
- `src/components/admin/SettingsForm.tsx` — Site Settings admin form
- `firestore.indexes.json` / `firebase.json` — added post-Sprint-4, finalized alongside Sprint 5.0

### Modified in Sprint 5.0

- `src/lib/firebase/collections.ts` — `SettingsDoc` extended with `contactEmail?`, `contactPhone?`, `officeLocation?`
- `src/lib/firebase/services/index.ts` — new exports added
- `src/data/adminNavigation.ts` — Settings marked implemented
- `src/components/layout/FooterSocialLinks.tsx` — hrefs now from Settings
- `src/components/shared/Logo.tsx` — site name now from Settings (instant-default pattern)
- `src/components/sections/ContactSection.tsx` — office location/email now from Settings
- `src/locales/en.json` / `ar.json` — added `admin.settings.*`

---

## Version History

See `CHANGELOG.md` for detailed change log by version.

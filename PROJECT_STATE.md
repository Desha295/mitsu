# PROJECT_STATE.md

## MITSU

Tracks current progress, completed work, current sprint, and next actions.
Must be updated at the end of every sprint (00_PROJECT_RULES.md #22, #26).

---

## Current Status

**Phase:** Phase 3 — Admin Dashboard
**Current Sprint:** Sprint 3.9 — Leadership Management
**Status:** Complete
**Version:** v0.21.0

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

---

## Current Sprint

**Sprint 3.9: Leadership Management** — CLOSED

Tasks completed:
- [x] New `leadershipService` created, wrapping the existing `leadership` collection reference
- [x] Leadership management page (`/admin/leadership`) using `leadershipService`
- [x] `LeadershipForm` — create/edit, field validation, optional bio, image upload
- [x] `LeadershipListItem` — list row, active/inactive + order badges, position subtitle
- [x] `ConfirmDialog` reused unchanged for delete confirmation (sixth sprint running)
- [x] New `manageLeadership` permission added
- [x] New sidebar entry added for Leadership (didn't exist before)
- [x] Localization (EN/AR), including new `admin.nav.leadership` key
- [x] Verified `firestore.rules` already covers `/leadership/{id}` — no change needed
- [x] Verification: lint, TypeScript, build all pass (18 routes)
- [x] Production fonts restored
- [x] PROJECT_STATE.md updated
- [x] CHANGELOG.md updated
- [x] CURRENT_SPRINT.md advanced to Sprint 3.10
- [x] Git commit created

---

## Next Actions — Sprint 3.10 (current, not yet implemented)

**Phase:** Phase 3 — Admin Dashboard
**Status:** READY TO START — scope needs explicit confirmation

Per the Sprint 3.8 scoping analysis, updated after Sprint 3.9's completion:

1. **Study Plans / PDF Management** — collection exists (`documents`), no service yet. Needs a new `documentsService` (small, same `createFirestoreService` factory — same shape as this sprint's `leadershipService`) plus a new upload helper, since the existing `uploadImage`/`isValidImageFile` are image-only, not PDF-capable. Medium complexity.
2. **Site Settings** — maps to `/settings/general` (`SettingsDoc`). No service yet; `getSettingsDocRef` is a single `DocumentReference`, not a collection, so this needs a new singleton-document service shape — the first real architectural decision in the remaining backlog. Medium complexity.
3. **Contact / About Management** — no existing collection, schema, or service at all, and both pages are currently 100% translation-key driven. Raises an unresolved bilingual-content-in-Firestore question no prior sprint has had to answer. High complexity — needs its own scoping conversation.
4. **Security Foundation** (original Sprint 2.10) — Firestore/Storage rules hardening and permission review across all collections. Not a CRUD feature; cross-cutting and security-critical. Medium complexity, best done as its own dedicated pass.
5. **Student Union remainder** (Vision/Mission/Social Media/President Information) — still unaddressed; President Information may already be covered once Leadership content is populated, but Vision/Mission/Social Media have no confirmed schema or collection yet.

No sprint has been approved yet — needs explicit direction before starting.

---

## Outstanding Items / Blockers

- No real Firebase project exists yet — `.env.local` is not populated, so Hero, Quick Access, Announcements, Events, Student Union, Leadership, University Systems, and Freshman Guide management cannot be exercised end-to-end until then.
- No admin account exists yet — first `super_admin` document must be created manually per `SECURITY.md`.
- `/admin` still nests inside the public Navbar/Footer (flagged in Sprint 3.1, unchanged).
- Dashboard Quick Actions still only cover Hero/Announcements/Events/Settings — Student Union, Leadership, University Systems, Freshman Guide, and Quick Access (and any future CMS page) have no quick-action card unless one is deliberately added.
- No `documentsService` exists yet for Study Plans or other downloadable-resource use cases.
- No singleton-document service pattern exists yet for `/settings/general`.
- Contact/About have no Firestore schema, collection, or service — and raise an unresolved bilingual-content-in-Firestore question.
- Vision/Mission/Social Media (Student Union remainder) have no confirmed schema or collection.
- All other prior outstanding items remain unchanged.

---

## File Summary

### New in Sprint 3.9

- `src/lib/firebase/services/leadership.service.ts`
- `src/app/admin/leadership/page.tsx`
- `src/components/admin/LeadershipForm.tsx`
- `src/components/admin/LeadershipListItem.tsx`

### Modified in Sprint 3.9

- `src/lib/auth/constants.ts` — new `manageLeadership` permission
- `src/lib/firebase/services/index.ts` — new export added
- `src/data/adminNavigation.ts` — new Leadership sidebar entry added
- `src/locales/en.json` / `ar.json` — added `admin.nav.leadership` and `admin.leadership.*`

---

## Version History

See `CHANGELOG.md` for detailed change log by version.

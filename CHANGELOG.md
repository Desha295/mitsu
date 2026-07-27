# CHANGELOG.md

## MITSU

All notable changes to this project are documented in this file, grouped by version.

---

## [v0.16.0] — Phase 3 Sprint 3.4: Events Management

### Added

- `src/app/admin/events/page.tsx` — third real CRUD admin page, backed entirely by Sprint 2.2's `eventsService`. Extends Sprint 3.3's Announcements list pattern: fetches all events via `getAll()`, renders `EmptyState` when none exist, otherwise a list with per-item edit/delete via one shared `EventForm`; delete reuses the same `ConfirmDialog` component from Sprint 3.3 as-is. Gated by the existing `manageEvents` permission (defined in Sprint 2.3, unused until now). Ordered by `date` ascending (soonest first) rather than `createdAt` descending — matches how the public `EventsSection` already sorts events, and is the more useful order for managing upcoming activities.
- `src/components/admin/EventForm.tsx` — reusable create/edit form, same shape as `AnnouncementForm`. `EventDoc.date` (a Firestore `Timestamp`) is tracked as its own `dateInput` string state — the same way `isActive`/`isPublished` are already tracked outside the generic `values` object in `HeroForm`/`AnnouncementForm` — and converted back via the existing `dateToTimestamp()` query helper only on submit. Category is optional (unlike Announcement's), so a "no category" option is offered alongside the public site's own `EventCategory` values (`src/data/announcements.ts`, `events.categories.*` translation keys).
- `src/components/admin/EventListItem.tsx` — single list row; reuses the public `EventCard`'s category icons/labels and mirrors `AnnouncementListItem`'s published/draft badge and edit/delete button style. Always shows the event date (the primary fact for an event, not just metadata) and location when present.

### Fixed

- **`src/components/admin/HeroForm.tsx`** — a real "component is changing an uncontrolled input to be controlled" React warning. Firestore documents are schemaless at runtime, so an existing hero document missing a field (even though `HeroDoc` types it as required) could leave an input's `value` as `undefined` on first render, only becoming a string once the user typed. Fixed by normalizing every field to an empty-string/`false` fallback (`normalizeHeroValues()`) before the initial `useState` call, so every input is controlled for its entire lifecycle. No functional change — an internal quality fix, folded into this sprint rather than given its own entry.

### Changed (Additive)

- `src/data/adminNavigation.ts` — Events sidebar item marked `isImplemented: true`.
- `src/app/admin/page.tsx` — Events quick-action card now passes a real `href`, alongside Hero's and Announcements'.
- `src/locales/en.json` / `ar.json` — added `admin.events.*` (heading, empty state, list actions, published/draft status, feedback messages, all form field labels including date/location/no-category, delete-confirmation copy).

### Architecture Decisions

- **`ConfirmDialog` reused unchanged:** built generic in Sprint 3.3 specifically so a second list page wouldn't need its own — Events is the first sprint to prove that out, with zero modifications to the component.
- **Date handled outside the generic form-values object:** rather than adding date-string-to-Timestamp conversion machinery to the generic `values` state, `EventForm` keeps `dateInput` as an isolated string, converting only at submit time — consistent with how boolean toggles (`isActive`/`isPublished`) are already handled outside the generic object in the two prior forms.
- **List ordering follows the resource, not a house style:** Announcements orders by `createdAt` (newest first, since recency is what matters for a feed); Events orders by `date` (soonest first, since upcoming-ness is what matters for planning) — same `getAll({ orderByField })` mechanism, different field, chosen deliberately per resource rather than copied blindly.

### Verification

- `npm run lint` — passes, zero errors, zero warnings.
- `tsc --noEmit` — passes, zero TypeScript errors.
- `npm run build` — succeeds; `/admin/events` now included as a static route alongside all 12 prior routes (13 total).

### Breaking Changes

None. Purely additive — no Sprint 1.x page, Sprint 2.x backend file, or Sprint 3.1/3.2/3.3 component was redesigned. The HeroForm fix changes internal state initialization only, not its props, behavior, or output.

### Known Issues

- No real Firebase project exists yet, so Events management cannot be exercised end-to-end until `.env.local` is populated.
- No admin account exists yet — first `super_admin` document must be created manually per `SECURITY.md`.

---

## [v0.15.0] — Phase 3 Sprint 3.3: Announcements Management

### Added

- `src/app/admin/announcements/page.tsx` — second real CRUD admin page, backed entirely by Sprint 2.2's `announcementsService`. Unlike Sprint 3.2's Hero (a singleton document), this is a true list: fetches all announcements via `getAll()` ordered by `createdAt` descending, renders `EmptyState` when none exist, otherwise a list with per-item edit/delete. Create and edit reuse one `AnnouncementForm` component; delete goes through a confirmation dialog before calling `.remove()`. Gated by the existing `manageAnnouncements` permission (defined in Sprint 2.3, unused until now).
- `src/components/admin/AnnouncementForm.tsx` — reusable create/edit form, same shape as Sprint 3.2's `HeroForm`: required-field + href/URL validation with inline errors, image upload wired to Sprint 2.2's `uploadImage()` and Sprint 2.3's `isValidImageFile()`. Category and priority are `<select>` fields reusing the public site's own taxonomy (`src/data/announcements.ts` types, `announcements.filters.*`/`announcements.priority.*` translation keys) rather than a separate admin vocabulary.
- `src/components/admin/AnnouncementListItem.tsx` — single list row; reuses the public `AnnouncementCard`'s badge vocabulary (same category icons/labels, same priority emphasis — urgent = solid primary, important = secondary-light, normal = neutral) so admins see the same visual language they're managing.
- `src/components/admin/ConfirmDialog.tsx` — generic confirmation dialog for destructive actions. Built without any Announcements-specific text so future list pages (Events, Union, Systems, etc.) can reuse it instead of each rolling their own. Reuses the existing `bg-overlay`/`animate-fade-in` tokens already established by `MobileMenu`, rather than introducing new ones.

### Changed (Additive)

- `src/lib/utils.ts` — added a shared `isValidHref()` export, extracted from Sprint 3.2's `HeroForm` (which keeps its own inline copy, unchanged) so this and future forms share one implementation.
- `src/data/adminNavigation.ts` — Announcements sidebar item marked `isImplemented: true`.
- `src/app/admin/page.tsx` — Announcements quick-action card now passes a real `href`, alongside Hero's from Sprint 3.2. All other quick actions remain disabled pending their own sprints.
- `src/locales/en.json` / `ar.json` — added `admin.announcements.*` (heading, empty state, list actions, published/draft status, feedback messages, all form field labels, delete-confirmation copy).

### Architecture Decisions

- **List pattern distinct from Hero's singleton pattern:** Hero (Sprint 3.2) treats one document as "the" content; Announcements is a genuine collection, so the page tracks a `formTarget` of `WithId<AnnouncementDoc> | "new" | null` to switch between list, create, and edit views, instead of forcing the singleton pattern onto a multi-document resource.
- **`ConfirmDialog` built generic from the start:** rather than a one-off "delete announcement?" component, the dialog takes only generic title/description/label props — the first reusable Modal-category component per `07_COMPONENT_RULES.md`'s own example list.
- **Category/priority reuse the public taxonomy:** no separate admin-only category list was invented; the `<select>` options and their labels come directly from `src/data/announcements.ts` and the existing `announcements.filters.*`/`announcements.priority.*` translation keys already shipped in Sprint 1.6.
- **Timestamps handled explicitly:** `AnnouncementDoc.createdAt`/`updatedAt` are non-optional, so the page sets both via `Timestamp.now()` on create, and only `updatedAt` on edit (preserving the original `createdAt`) — done directly in the page, not inside the reusable form.

### Verification

- `npm run lint` — passes, zero errors (one real unused-variable warning found and fixed during development).
- `tsc --noEmit` — passes, zero TypeScript errors (one real duplicate-key diagnostic found and fixed during development).
- `npm run build` — succeeds; `/admin/announcements` now included as a static route alongside all 11 prior routes (12 total).

### Breaking Changes

None. Purely additive — no Sprint 1.x page, Sprint 2.x backend file, or Sprint 3.1/3.2 component was redesigned.

### Known Issues

- No real Firebase project exists yet, so Announcements management cannot be exercised end-to-end until `.env.local` is populated.
- No admin account exists yet — first `super_admin` document must be created manually per `SECURITY.md`.

---

## [v0.14.0] — Phase 3 Sprint 3.2: Hero Management

### Added

- `src/app/admin/hero/page.tsx` — first real CRUD admin page, backed entirely by Sprint 2.2's `heroService`. Fetches existing content via `getAll()`, preferring the `isActive: true` document over others (falls back to the first if none is active) so exactly one document is treated as "the" hero content, without new query infrastructure. Shows `EmptyState` + creation form when nothing exists yet, or the populated edit form otherwise.
- `src/components/admin/HeroForm.tsx` — reusable create/edit form: full field validation (required fields, href/URL format accepting both relative paths and absolute URLs) with inline per-field errors; image upload wired to Sprint 2.2's `uploadImage()` and Sprint 2.3's `isValidImageFile()`, with its own loading/error state, auto-filling the `imageUrl` field on success; success/error/saving states throughout.

### Changed (Additive)

- `src/lib/auth/constants.ts` — added `manageHero` permission, granted to `admin` and `super_admin`. All other Sprint 2.3 permissions unchanged.
- `src/components/admin/QuickActionCard.tsx` — now supports a real linked state (`href`) alongside the existing disabled/"coming soon" state.
- `src/data/adminNavigation.ts` — Hero sidebar item marked `isImplemented: true`.
- `src/app/admin/page.tsx` — Hero quick-action card now passes a real `href`; all others remain disabled pending their own sprints.
- `src/locales/en.json` / `ar.json` — added `admin.hero.*` (heading, empty state, all form labels, upload/validation messages).

### Fixed

- A real `react-hooks/set-state-in-effect` error in the Hero page's data-fetch effect (calling `setState` synchronously for the "not allowed" early-return path). Fixed by deriving `loadingHero` from a comparison instead — the same fix category applied in Sprint 1.1 (Theme/Language contexts) and Sprint 2.4 (`useAuthGuard`).

### Architecture Decisions

- **Single active document without new query machinery:** rather than adding a new "singleton document" concept to the service layer, the page fetches all hero documents (already supported) and selects the active one client-side — reuses `getAll()` exactly as built in Sprint 2.2.
- **Validation accepts both relative paths and absolute URLs:** hero CTAs link to both internal pages (`/guide`) and external ones (WhatsApp), so href validation checks for either a leading `/` or a well-formed `URL`, rather than requiring one format.
- **No duplicated storage or CRUD logic:** the form calls `uploadImage`/`isValidImageFile` and the page calls `heroService.create`/`.update` directly — no new wrapper functions reimplementing what Sprint 2.2/2.3 already built.

### Verification

- `npm run lint` — passes, zero errors (after the fix above).
- `tsc --noEmit` — passes, zero TypeScript errors.
- `npm run build` — succeeds; `/admin/hero` now generated as a static route alongside all 10 prior routes (11 total).

### Breaking Changes

None. Purely additive — no Sprint 1.x page, Sprint 2.x backend file, or Sprint 3.1 component was redesigned.

### Known Issues

- No real Firebase project exists yet, so Hero management cannot be exercised end-to-end until `.env.local` is populated.
- No admin account exists yet — first `super_admin` document must be created manually per `SECURITY.md`.

---

## [v0.13.0] — Phase 3 Sprint 3.1: Admin Dashboard Foundation

### Added

**Admin Components (`src/components/admin/`, 13 files):**
- `AdminLayout` — dashboard shell composing Sidebar + Topbar + content, owns collapsed/mobile-open state.
- `AdminSidebar` — 11 nav items; only "Dashboard" is a real link this sprint, the rest render as non-interactive "Coming soon" items. Collapsible on desktop, off-canvas on mobile with the same accessible pattern as `MobileMenu` (Escape-to-close, scroll lock, backdrop click).
- `AdminTopbar` — mobile/desktop toggles, reused `ThemeSwitcher`/`LanguageSwitcher`, User Profile Area, Logout button calling `useAuth().logout()` directly.
- `AdminHeader` — page-level breadcrumb + title + description + actions slot.
- `Breadcrumb` — generic trail component, RTL-aware separator.
- `PageContainer` — admin content-width wrapper, mirrors the public `Container`.
- `SectionHeader` — heading for individual sections within a page.
- `AdminCard` — base card primitive underlying `StatCard`/`QuickActionCard`.
- `StatCard` — icon + label + value; value is always a translated placeholder, never a fabricated number.
- `QuickActionCard` — disabled/"coming soon" this sprint since target pages don't exist yet.
- `EmptyState` — generic reusable "nothing here yet" placeholder.
- `Unauthorized` — 403 state for signed-in users who aren't registered admins.
- `LoadingDashboard` — loading state while auth/admin status resolves.

**Data:**
- `src/data/adminNavigation.ts` — 11 sidebar items with an `isImplemented` flag.
- `src/data/adminDashboard.ts` — placeholder stats and quick-action definitions.

**Routing:**
- `src/app/admin/layout.tsx` — protects the whole `/admin` segment by layering `RequireAuth` (Sprint 2.4) around `useAuthGuard` (Sprint 2.3/2.4): not signed in → redirect to `/login`; signed in but not an admin → `Unauthorized`; admin confirmed → real dashboard shell. Neither piece reimplemented.
- `src/app/admin/page.tsx` — Dashboard Home: welcome section with real logged-in user info, placeholder stats, disabled quick actions, empty-state Recent Activity, and an accurate (not fabricated) System Status check via `isFirebaseConfigured`.

**Localization:** full `admin.*` section added to `en.json`/`ar.json`.

**Project docs:** `CURRENT_SPRINT.md` created in the working repository (didn't previously exist there).

### Architecture Decisions

- **No CRUD, no Firestore reads/writes anywhere:** every stat/quick-action/activity item is a static, clearly-labeled placeholder, exactly matching this sprint's explicit scope boundary.
- **Two-layer protection, zero duplicated auth logic:** `RequireAuth` handles "signed out" (redirect); `useAuthGuard` handles "signed in but not admin" (403) — both reused exactly as built in Sprint 2.3/2.4.
- **Sidebar items without a real page yet are visually distinct, not dead links:** `isImplemented: false` items render as muted, non-interactive rows with a "Coming soon" badge instead of linking to routes that 404.
- **Known tradeoff, flagged not fixed:** `/admin` renders nested inside the public Navbar/Footer rather than owning dedicated full-page chrome, since separating them would require restructuring every existing route into Next.js route groups — out of bounds for this sprint's "do not modify Sprint 1.x/2.x" constraint. Documented in `PROJECT_STATE.md` as a follow-up candidate.

### Verification

- `npm run lint` — passes, zero errors.
- `tsc --noEmit` — passes, zero TypeScript errors.
- `npm run build` — succeeds; `/admin` now generated as a static route alongside all 9 prior routes (10 total).

### Breaking Changes

None. Purely additive — no Sprint 1.x page or Sprint 2.x backend/auth file was modified.

### Known Issues

- No real Firebase project exists yet, so the dashboard shows only placeholders until `.env.local` is populated.
- No admin account exists yet — the first `super_admin` document must still be created manually per `SECURITY.md`.
- `/admin` nests inside public site chrome rather than having its own dedicated layout (see Architecture Decisions above).

---

## [v0.12.0] — Phase 2 Sprint 2.4: Authentication Integration

### Added

**Auth Context (`src/context/AuthContext.tsx`):**
- `AuthProvider` + `AuthContext`, following the exact same Context+custom-hook pattern as `ThemeContext`/`LanguageContext` (Phase 0) — no external state library.
- Exposes `{ user, loading, loginWithGoogle, loginWithEmail, logout }`. `loading` starts `true` and only resolves once Firebase's first `onAuthStateChanged` callback fires — unlike theme/language's synchronous `localStorage` reads, Firebase Auth session restoration is inherently asynchronous.
- Every method delegates to Sprint 2.3's `session.ts` helpers rather than reimplementing Firebase calls.

**`src/hooks/useAuth.ts`** — mirrors `useTheme.ts`/`useLanguage.ts` exactly.

**`src/components/shared/RequireAuth.tsx`** — gates children behind authentication: shows a loading state while resolving, redirects to `/login` if signed out, renders children once authenticated. Not consumed by any page yet — the reusable primitive a future protected admin layout (Sprint 3.1) will wrap itself in.

**`src/components/sections/LoginSection.tsx` + `src/app/login/page.tsx`** — a real, working login form: email/password fields plus a Google Sign-In button, both calling `useAuth()`'s methods directly and handling loading/error/redirect states. No registration or password-reset UI (out of scope). `robots: noindex` set on the page metadata since this is an admin-facing utility page, not student-facing content, and it isn't linked from main navigation.

### Changed

- **`src/lib/auth/session.ts`** (additive) — added `signInWithGoogle()` using `GoogleAuthProvider` + `signInWithPopup`. All Sprint 2.3 exports (`signInWithEmail`, `signOutUser`, `getCurrentUser`, `subscribeToAuthState`) unchanged.
- **`src/lib/auth/routeGuard.ts`** (required refactor) — `useAuthGuard()` previously ran its own independent `subscribeToAuthState` subscription (necessarily, since `useAuth()` didn't exist in Sprint 2.3). Now consumes the new `useAuth()` hook instead, so there's exactly one Firebase Auth subscription shared by both, directly satisfying this sprint's "do not duplicate logic" requirement. Public return shape (`AuthGuardState`) is unchanged; verified zero existing consumers before making the change, so nothing broke.
- **`src/context/Providers.tsx`** (additive) — wraps `<AuthProvider>` around `Navbar`/`main`/`Footer`, inside `ThemeProvider`/`LanguageProvider`, so `useAuth()` is available anywhere, including the new login page.
- **`src/locales/en.json` / `ar.json`** — added a `login` section (heading, field labels, submit states, Google sign-in label, generic error message). Reused the existing `common.loading` key for `RequireAuth`'s loading state rather than adding a duplicate.

### Fixed

- A real `react-hooks/set-state-in-effect` lint error surfaced while refactoring `useAuthGuard` (calling `setState` synchronously in an effect body). Fixed by deriving the loading flag from a comparison instead of setting it directly — the same category of fix already applied to `ThemeContext`/`LanguageContext` back in Sprint 1.1.

### Architecture Decisions

- **Context method names match the sprint's requested API, not the lower-level helper names:** Sprint 2.3 named its session helpers `signInWithEmail`/`signOutUser` (a `signIn*`/`signOut*` convention); this sprint's `CURRENT_SPRINT.md` asks for `loginWithEmail()`/`logout()` on the hook. `AuthContext`'s public methods use the sprint-requested names as thin wrappers delegating to the Sprint 2.3 implementations — satisfies both "match the requested API" and "reuse Sprint 2.3, don't duplicate logic" simultaneously.
- **Async-aware loading state:** `AuthContext.loading` exists specifically because Firebase Auth state is never synchronously known on first render, unlike the theme/language Contexts. This is a deliberate, necessary difference from that established pattern, not an inconsistency.
- **Utility-first, UI only where explicitly required:** everything in Sprint 2.1–2.3 was pure backend/utility work with zero UI. This sprint is different — `CURRENT_SPRINT.md` explicitly requires a real login page — so a genuine, fully working form was built (not a placeholder), while `RequireAuth`/`useAuthGuard` remain unused utility layers until a future dashboard consumes them.
- **No dashboard redirect target yet:** a successful login currently redirects to `/` (homepage) rather than a dashboard, since no dashboard exists yet (explicitly out of scope this sprint) — this will change once Sprint 3.1 builds one.

### Verification

- `npm run lint` — passes, zero errors (after fixing the set-state-in-effect issue above).
- `tsc --noEmit` — passes, zero TypeScript errors.
- `npm run build` — succeeds; all 8 prior public routes generate unchanged, plus the new `/login` route (9 total).

### Breaking Changes

None for existing consumers. `useAuthGuard`'s internal implementation changed, but its public return shape (`AuthGuardState`) did not, and it had zero consumers before this sprint.

### Known Issues

- No real Firebase project exists yet, so the login form cannot actually authenticate anyone until `.env.local` is populated and Email/Password + Google providers are enabled in the Firebase Console.
- No admin account exists yet — the first `super_admin` document must still be created manually in `/admins/{uid}` per `SECURITY.md`.

---

## [v0.11.0] — Phase 2 Sprint 2.3: Security Foundation

### Added

**Firestore Security Rules (`firestore.rules`):**
- All 11 collections (Sprint 2.1's original 8 + Sprint 2.2's hero/homepage/guide): public read when `isPublished`/`isActive` is `true`, admin-only write.
- `/settings/general`: always publicly readable (site-wide config, no publish flag), admin-writable.
- `/admins/{uid}`: self-read allowed (required for the `isAdmin()` helper function itself to work — it calls `exists()` on this same path), full read for `super_admin`s, write restricted to `super_admin`s only.
- Default-deny fallback (`match /{document=**} { allow read, write: if false; }`) for anything not explicitly matched.

**Firebase Storage Security Rules (`storage.rules`):**
- `/images/**` — public read; admin write up to 5MB, JPEG/PNG/WebP/SVG only.
- `/documents/**` — public read; admin write up to 10MB.
- Admin status resolved via Storage's documented `firestore.exists()` cross-service rules feature, checking the same `/admins/{uid}` collection as the Firestore rules.

**Auth Foundation (`src/lib/auth/`, 9 files):**
- `types.ts` — `UserRole`, `AuthenticatedAdmin`, `AuthGuardState`.
- `constants.ts` — `ROLES`, `PERMISSIONS`, `ROLE_PERMISSIONS` role→permission mapping, and file-validation size/type constants shared with `storage.rules`.
- `roles.ts` — `isValidRole` (type guard), `roleMeetsMinimum`, `isSuperAdmin`.
- `permissions.ts` — `hasPermission`, `hasAnyPermission`, `hasAllPermissions`, `getPermissionsForRole`.
- `validation.ts` — `isValidImageFile`, `isValidDocumentFile` (client-side pre-checks only; `storage.rules` remains the real security boundary).
- `session.ts` — `signInWithEmail`, `signOutUser`, `getCurrentUser`, `subscribeToAuthState` — Firebase Auth wrappers, no login form.
- `adminAuth.ts` — `getAdminForUser(user)`, bridging a signed-in Firebase Auth user to their `/admins/{uid}` document and role.
- `routeGuard.ts` — `useAuthGuard()` hook + `canAccess()` helper, reusable client-side guard logic for a future protected admin layout.
- `index.ts` — barrel export.

**Documentation:**
- `SECURITY.md` (project root) — role/permission model, admin-resolution flow diagram, rules summary, deployment checklist, and an explicit list of what this sprint deliberately did not build.

### Architecture Decisions

- **Rules and TypeScript constants are duplicated, not shared:** `.rules` files can't import TypeScript, so `MAX_IMAGE_SIZE_BYTES`/`MAX_DOCUMENT_SIZE_BYTES`/`ALLOWED_IMAGE_TYPES` exist in both `constants.ts` (for client-side validation) and `storage.rules` (the actual enforcement). Documented explicitly in both files' comments and in `SECURITY.md` as needing manual sync.
- **`isAdmin()` reads its own collection — the admins rule must allow self-read:** the Firestore rule's `isAdmin()` helper calls `exists()` on `/admins/{request.auth.uid}`, which itself goes through the `admins` collection's own security rule. Without an explicit self-read allowance there, every `isAdmin()` check would fail closed. Documented inline in `firestore.rules`.
- **Granting admin access is a higher bar than managing content:** only `super_admin`s may write to `/admins/{uid}` (create/promote/revoke other admins), while regular `admin`s can manage all content collections. This mirrors `06_FIREBASE_SCHEMA.md` #12's two-tier role model.
- **Utility functions, not UI:** `signInWithEmail`, `useAuthGuard`, etc. are the reusable functions a future login page/admin layout would call — exactly parallel to how Sprint 2.2 built CRUD functions before any UI called them. No login form, protected layout, or dashboard page was built this sprint.
- **Fail closed on malformed data:** `getAdminForUser` returns `null` (not a guess) if an admin document's `role` field doesn't match a known `UserRole` — never grants access based on uncertain data.

### Verification

- `npm run lint` — passes, zero errors.
- `tsc --noEmit` — passes, zero TypeScript errors.
- `npm run build` — succeeds; all 8 existing public routes generate exactly as before this sprint — zero UI changes.

### Breaking Changes

None. Purely additive — no Sprint 2.1 or Sprint 2.2 file was modified.

### Known Issues

- `firestore.rules` and `storage.rules` are **not yet deployed** and have not been validated against a live Firebase project or the Firebase Emulator Suite — `.rules` syntax isn't checked by this project's lint/tsc/build pipeline. Flagged as a required pre-deploy step in `SECURITY.md`.
- No real Firebase project exists yet, so the entire auth foundation resolves to its safe "not configured" paths at runtime until `.env.local` is populated.
- There is no self-service admin sign-up by design — the first `super_admin` document must be created manually once a project exists.

---

## [v0.10.0] — Phase 2 Sprint 2.2: Firebase Services

### Added

**Query Helpers (`src/lib/firebase/query-helpers.ts`):**
- `buildQuery()` — composes ordering (`OrderOption`), filtering (`FilterOption[]`), and pagination (`pageSize`/`startAfterDoc`) into a single typed Firestore `Query`.
- `timestampToDate()` / `dateToTimestamp()` — Firestore Timestamp ⇄ JS Date conversions.

**Storage Helper (`src/lib/firebase/storage.ts`):**
- `uploadImage(path, file)`, `deleteImage(path)`, `getDownloadURL(path)` — every function takes `path` as a caller-supplied parameter; no hardcoded Storage paths anywhere in this file.

**Generic CRUD Factory (`src/lib/firebase/services/createFirestoreService.ts`):**
- `createFirestoreService<T>(getCollectionRef)` → `{ getAll, getById, create, update, remove }`. `getAll` accepts optional `QueryOptions` and delegates to `buildQuery`. This single generic implementation is reused by all 7 domain services — no CRUD logic duplicated per collection.

**7 Domain Services (`src/lib/firebase/services/*.service.ts`):**
- `heroService`, `homepageService` — back 2 new collections (`hero`, `homepage`) added to `collections.ts` this sprint.
- `announcementsService`, `eventsService`, `systemsService` — reuse the existing Sprint 2.1 `announcements`/`events`/`systems` collection references directly, unchanged.
- `unionService` — reuses the existing Sprint 2.1 `committees` collection reference (see Architecture Decisions below for why).
- `guideService` — backs a new `guide` collection added this sprint.
- `services/index.ts` — barrel export of all 7 services plus the factory.

### Changed (Additive Only — No Existing Exports Modified)

- `src/lib/firebase/collections.ts` — appended 3 new collection name constants (`hero`, `homepage`, `guide`), 3 new document types (`HeroDoc`, `QuickAccessItemDoc`, `GuideSectionDoc`), and 3 new reference getters. All 8 of Sprint 2.1's original exports (types, getters, `COLLECTIONS` entries) are untouched.
- `src/lib/firebase/index.ts` — added re-exports for `query-helpers.ts`, `storage.ts`, and `services/`. Sprint 2.1's 2 original exports (`config.ts`, `collections.ts`) are untouched.

### Architecture Decisions

- **Why `hero`/`homepage`/`guide` are new collections, not shoehorned into existing ones:** `CURRENT_SPRINT.md` names 7 services, but Sprint 2.1's schema only covered 8 collections from the original Phase 0 spec — which predates Phase 1's actual Guide/Union/About/Contact pages and has no concept of "hero" or "homepage" content. Rather than force these into an ill-fitting existing collection, 3 new ones were added, mirroring the equivalent local data files (`home.ts`, `guide.ts`) field-for-field so a future migration sprint can map them 1:1.
- **Why the "Student Union" service maps to `committees`, not `leadership`:** the Student Union domain spans two existing Sprint 2.1 collections (`committees`: 7 records, `leadership`: 2 records). `committees` is the clearer fit for generic multi-document CRUD; `leadership`'s own collection reference remains available for a separate, more granular service in a future sprint if ever needed. This is a documented judgment call, not an ambiguous gap — see the comment in `union.service.ts`.
- **`getAll`/`getById` degrade gracefully; writes don't:** every service function checks Firebase configuration first. `getAll` returns `[]` and `getById` returns `null` when unconfigured (safe to call from anywhere, ever), while `create`/`update`/`remove` throw a clear, explicit error — silently no-op'ing a write the caller believes succeeded would be actively misleading.
- **Getter functions, not resolved references:** `createFirestoreService` takes `() => CollectionReference | null` rather than a resolved reference, so every service stays safe to import before `.env.local` exists — re-resolved on each call, matching Sprint 2.1's established `null`-safe pattern exactly.

### Verification

- `npm run lint` — passes, zero errors.
- `tsc --noEmit` — passes, zero TypeScript errors.
- `npm run build` — succeeds; all 8 existing public routes generate exactly as before this sprint — zero UI changes, as required by `CURRENT_SPRINT.md`.

### Breaking Changes

None. Purely additive — no Sprint 2.1 export was modified, renamed, or removed, and no public page was touched.

### Known Issues

- The entire service layer is built but not yet used anywhere — no public page has been migrated from local data to Firebase (explicitly out of scope for this sprint). All 8 routes continue running on local static data.
- No real Firebase project exists yet, so every service function still resolves to the safe "not configured" paths (`[]`/`null`/thrown error) at runtime until `.env.local` is populated.

---

## [v0.9.0] — Phase 2 Sprint 2.1: Firebase Foundation

### Added

**Backend Foundation:**
- `src/lib/firebase/collections.ts` — typed Firestore document interfaces (`AnnouncementDoc`, `EventDoc`, `SystemDoc`, `CommitteeDoc`, `LeadershipDoc`, `SettingsDoc`, `DocumentResourceDoc`, `AdminDoc`) mirroring `06_FIREBASE_SCHEMA.md` #5-12 exactly, plus typed `CollectionReference`/`DocumentReference` getter functions for all 8 canonical collections. A generic pass-through `FirestoreDataConverter` gives every reference full TypeScript typing via `withConverter` without repeating boilerplate per collection.
- `src/lib/firebase/index.ts` — barrel export (`export * from "./config"` + `"./collections"`), giving future code a single, stable import path.

### Changed

- `src/lib/firebase.ts` (Phase 0's flat skeleton) → `src/lib/firebase/config.ts`. Content and behavior preserved exactly (same env vars, same safe-`null`-until-configured pattern) — only the location changed, per Sprint 2.1's "Backend folder structure" requirement.

### Removed

- `src/lib/firebase.ts` — superseded by the `src/lib/firebase/` folder.

### Safety Verification

- Searched the entire `src/` tree for imports of `@/lib/firebase` **before** restructuring: zero results. The Phase 0 file was completely unused by every one of the 7 Phase 1 sprints, confirming this move carried no risk to any existing page.
- Re-ran the same search **after** restructuring: still zero references to the old path.
- Diffed `.env.local.example`'s variable names against what `config.ts` actually reads: exact match, confirmed rather than assumed — no changes needed.

### Explicitly Not Built (Reserved for Sprint 2.2)

Per `CURRENT_SPRINT.md`'s "Out of Scope" and `10_ROADMAP.md`'s Sprint 2.2 definition:
- No generic CRUD functions (create/read/update/delete).
- No `getDocs`/`addDoc`/`setDoc`/`onSnapshot` calls anywhere in the new code — `collections.ts` only returns typed references, it never reads or writes data.
- No upload service, query helpers, or pagination helpers.
- No login page, admin dashboard, role management, or any Firebase UI.
- No static data migrated — all 8 public pages continue running on local data exactly as before.

### Architecture Decisions

- **Typed references now, CRUD later:** using Firestore's `withConverter` at the foundation layer means Sprint 2.2's services get compile-time type safety "for free" instead of every future service redefining converters ad hoc.
- **Settings is a document, not a collection:** `/settings/general` is a single fixed document per `06_FIREBASE_SCHEMA.md` #10, so `getSettingsDocRef()` returns a `DocumentReference`, not a `CollectionReference` — modeled correctly rather than forced into the same shape as the other 7 collections.
- **`null`-safe by design, not by accident:** every getter checks `db` first and returns `null` if Firebase isn't configured, consistent with `config.ts`'s existing pattern — callers (Sprint 2.2+) must handle the `null` case explicitly, so an unconfigured Firebase project can never silently crash a public page.

### Verification

- `npm run lint` — passes, zero errors.
- `tsc --noEmit` — passes, zero TypeScript errors.
- `npm run build` — succeeds; all 8 existing public routes (`/`, `/about`, `/announcements`, `/contact`, `/guide`, `/systems`, `/union`, plus `/_not-found`) generate exactly as before this sprint — no public-facing behavior changed.

### Breaking Changes

None for consumers — nothing imported the old file. Internal-only path change (`@/lib/firebase.ts` → `@/lib/firebase/` folder, same public API via the barrel export).

### Known Issues

- No real Firebase project exists yet; `.env.local` remains unpopulated and every public page continues running on local static data, exactly as intended for this sprint.

---

## [v0.8.0] — Phase 1 Sprint 1.7: About MITSU & Contact

### Added

**Data Layer:**
- `src/data/about.ts` — platform identity content sourced from `01_PROJECT_IDENTITY.md`: introduction, Vision, Mission, motto, and the 8 Core Values presented as "Platform Goals". Kept distinct from `union.ts`'s `unionOverview` (Sprint 1.5) — that describes the Student Union *organization*; this describes the MITSU *platform*. Different content, not a duplicate.
- `src/data/contact.ts` — office information (location/hours/email) and official communication channels (Microsoft Teams for advisors). President contact and official social links are imported directly from `union.ts` (`president`, `unionSocialLinks`) rather than duplicated.
  - Office location, hours, and a direct email address haven't been provided yet. Left unset rather than invented; `ContactCard` renders these as "Coming soon".

**Feature Components:**
- `ContactCard.tsx` (components/shared) — generic icon+title+description(+optional link) card, reused for both office info and communication channels.

**Section Components:**
- `AboutSection.tsx` — platform introduction, motto, 8 "Platform Goals" card grid.
- `VisionMissionSection.tsx` — Vision/Mission cards for the platform (visually consistent with `UnionHeroSection`'s treatment, different data source).
- `ContactSection.tsx` — office information, President contact (reuses `LeaderCard` + `president`), official communication channels.
- `SocialLinksSection.tsx` — reuses `unionSocialLinks` and the existing `union.socialHeading`/`socialSubheading` keys.

**Routing:**
- `src/app/about/page.tsx` — new `/about` route (About → Vision/Mission). This folder didn't exist in Phase 0's original scaffold; created fresh.
- `src/app/contact/page.tsx` — new `/contact` route (Contact → Social Links).

**Localization:**
- Extended `en.json`/`ar.json` with top-level `about` and `contact` sections, plus `nav.about`.

### Fixed (Required Connections — Not Scope Creep)

- `data/navigation.ts` — added `{ labelKey: "nav.about", href: "/about" }`. Without this, the new page would be unreachable from Navbar/Footer (both already render this data dynamically; no component changes needed).
- `data/home.ts` — the homepage's "About MITSU" Quick Access card pointed to `/union`, a Sprint 1.2 placeholder standing in for a page that didn't exist yet. Now points to the real `/about` page — the same category of fix as the earlier WhatsApp Community URL bug.

### Architecture Decisions

- **Platform identity vs. organization identity kept separate:** `about.ts` (the platform) and `union.ts`'s `unionOverview` (the Student Union organization) are deliberately distinct data sources, even though both have a "vision" and "mission" — conflating them would have misrepresented one as the other.
- **No duplicated data:** President contact and official social links are imported from `union.ts`, not copied. `ContactCard` receives pre-resolved strings (not translation keys) since it serves two unrelated data shapes — the same pattern `FooterLinkGroup` already established in Sprint 1.1.
- **No invented contact details:** office location/hours/email are explicitly left blank in the data (with a comment explaining why) rather than filled with plausible-looking placeholder text that could be mistaken for real information.
- **Types co-located with data:** continuing the Sprint 1.4-1.6 precedent, no new `src/types/*` files were added.

### Verification

- `npm run lint` — passes, zero errors.
- `tsc --noEmit` — passes, zero TypeScript errors.
- `npm run build` — succeeds; `/about` and `/contact` now generated as static routes, bringing the site to 8 total routes (`/`, `/guide`, `/systems`, `/announcements`, `/union`, `/about`, `/contact`, plus `/_not-found`).

### Breaking Changes

None.

### Known Issues

- Student Union office location, hours, and direct email are not yet available — shown as "Coming soon" on `/contact`.

---

## [v0.7.0] — Phase 1 Sprint 1.6: Announcements & Events

### Added

**Data Layer:**
- `src/data/announcements.ts` — new data file with inline types (`Announcement`, `Event`, `AnnouncementPriority`, `AnnouncementCategory`, `EventCategory`), mirroring the `/announcements` and `/events` Firestore collection shape (`06_FIREBASE_SCHEMA.md` #5-6).
  - 8 sample announcements (one featured + urgent: "Fall Semester Registration Now Open"), 6 sample upcoming events.
  - **Explicitly labeled as sample/placeholder content** in the file's header comment — unlike Sprints 1.3-1.5, no real Student Union announcements/events were supplied this sprint.

**Feature Components:**
- `AnnouncementCard.tsx` (components/shared) — category badge, priority-based visual emphasis, date, title, description; `featured` prop for the larger hero-style slot.
- `EventCard.tsx` (components/shared) — category badge, title, description, formatted date, optional location.

**Section Components:**
- `AnnouncementsSection.tsx` — featured announcement, static search input, static category filter chips, "Latest Announcements" grid (newest first).
- `EventsSection.tsx` — "Upcoming Events" grid (soonest first).

**Routing:**
- `src/app/announcements/page.tsx` — new `/announcements` route: Announcements → Events.

**Localization:**
- Extended `en.json`/`ar.json` with top-level `announcements` and `events` sections: headings, search/filter labels, category labels, priority labels, empty states, and full title/description/location text for every sample item.

**Shared Utility:**
- `formatDate(dateString, language)` added to `src/lib/utils.ts` — locale-aware date formatting shared by both new cards (avoids duplicating `Intl.DateTimeFormat` logic). Forces Western digits in Arabic (`ar-EG-u-nu-latn`) for consistency with existing numeric displays elsewhere in the app.

### Architecture Decisions

- **Priority uses only brand colors, not red:** "urgent" announcements are differentiated through a solid primary (Blue) badge, an `AlertCircle` icon, and a heavier border — not a conventional red/orange — because `04_DESIGN_SYSTEM.md`/`08_BRAND_GUIDELINES.md` repeatedly prohibit introducing colors outside the locked Blue/Green/White palette. "Important" reuses the secondary-light "highlight" treatment already established for `GuideCard`'s Important Notes in Sprint 1.4, keeping the visual language consistent across sprints.
- **Search and filter are genuinely static, not disabled:** both controls are fully interactive and accessible (controlled input state, `aria-pressed` on filter chips) so they don't feel broken to a user — but neither actually filters the rendered list, per `CURRENT_SPRINT.md`'s explicit "(Static)" scope and the "No CRUD" / "No Firebase" restriction for this sprint.
- **Types co-located with data:** `Announcement`/`Event` and their supporting types live inline in `announcements.ts`, continuing the Sprint 1.4/1.5 pattern rather than adding a new `src/types/*` file not listed in this sprint's approved scope.
- **Content honesty:** the data file's header comment explicitly flags all announcements/events as sample placeholders, distinct from the real official data used in Sprints 1.3 (Systems), 1.4 (Guide/academic rules), and 1.5 (Union/leadership) — this sprint had no real Student Union submissions to work from.

### Verification

- `npm run lint` — passes, zero errors.
- `tsc --noEmit` — passes, zero TypeScript errors.
- `npm run build` — succeeds; `/announcements` now generated as a static route alongside `/`, `/guide`, `/systems`, `/union`.

### Breaking Changes

None.

### Known Issues

- All announcement/event content is sample/placeholder — needs replacement with real Student Union submissions before launch.
- Search and category filters are UI-only; no real filtering logic yet (by design, per Sprint 1.6 scope).

---

## [v0.6.1] — Bug Fix: Unified WhatsApp Community Link

### Fixed

- The Hero section's "Join WhatsApp Community" button (`src/data/home.ts`) pointed to an empty placeholder href left over from Sprint 1.2, while the Student Union page (`src/data/union.ts`) had the real, working URL. Extracted `WHATSAPP_COMMUNITY_URL` as a single named constant in `union.ts`; `home.ts` now imports and reuses it. Both places now open the exact same link, from one source of truth.

### Verification

- `npm run lint` — passes.
- `tsc --noEmit` — passes.

Commit: `fix: unify WhatsApp community link across homepage and student union`

---

## [v0.6.0] — Phase 1 Sprint 1.5: Student Union Section

### Added

**Data Layer:**
- `src/data/union.ts` — new data file with inline types (`SocialLinkItem`, `UnionLeader`, `UnionCommittee`), consistent with the Sprint 1.4 precedent of co-locating types with their sole data file.
  - `unionOverview` — name, overview, vision, mission, hero image path (official text, used verbatim).
  - `president` — includes 4 personal social links (Facebook, Instagram, LinkedIn, WhatsApp).
  - `vicePresident` — no personal links provided; `socialLinks: []`.
  - `committees` — 7 official committees: Scientific, Cultural, Sports, Artistic, Social & Trips, Student Families, Scouts.
  - `unionSocialLinks` — 4 official Union channels, structurally separate from the President's personal links.

**Images:**
- `public/images/union/president.jpg`, `vice-president.jpg` — real photos provided by the Student Union.
- `public/images/union/union-hero.svg` — abstract placeholder echoing the MITSU logo's connected-node motif (no official hero photo provided yet).
- `public/images/union/team-placeholder.svg` — generic silhouette-group placeholder, provisioned per sprint instruction for future use.

**Feature Components:**
- `LeaderCard.tsx` (components/shared) — image, name, position, and a social-links row that only renders when the leader actually has links.
- `CommitteeCard.tsx` (components/shared) — icon, name, description.

**Section Components:**
- `UnionHeroSection.tsx` — identity, overview, hero image, Vision & Mission cards.
- `LeadershipSection.tsx` — President and Vice President.
- `CommitteesSection.tsx` — all 7 committees plus official Union social links.

**Routing:**
- `src/app/union/page.tsx` — new `/union` route, composition: Hero → Leadership → Committees (Vision/Mission and Social Links nested within Hero/Committees respectively, matching the specified page flow).

**Localization:**
- Extended `en.json`/`ar.json` with a new top-level `union` section covering identity text, section headings, leadership names/positions, all 7 committee names/descriptions, and social link labels — personal and official links use distinct translation keys to keep them separable.

### Architecture Decisions

- **Icon verification, not assumption:** checked the installed `lucide-react` package directly before choosing icons — confirmed Facebook/Instagram/LinkedIn icons don't exist (Lucide ships no brand logos, consistent with the Sprint 1.1 Footer precedent). Reused `Users`/`Camera`/`MessageCircle` and added `Briefcase` as a generic LinkedIn stand-in.
- **WhatsApp number → deep link:** the President's WhatsApp was provided as a phone number (01558989980); converted to `https://wa.me/201558989980` (Egypt country code, leading 0 dropped) so the link actually opens a chat — a direct formatting of the given data, not new information.
- **SVG placeholders use honest extensions:** `union-hero` and `team-placeholder` are saved as `.svg` rather than the `.jpg` implied by the sprint brief, since they're vector graphics, not photos. Rendered with `unoptimized` on `next/image` to guarantee correct display regardless of Next's SVG optimizer restrictions, without any `next.config.ts` changes.
- **Personal/official social separation:** enforced structurally — `president.socialLinks` (personal) only ever renders inside `LeaderCard`; `unionSocialLinks` (official) only ever renders inside `CommitteesSection`. No shared array, no possibility of the two lists merging.
- **Empty social links handled gracefully:** `LeaderCard` conditionally renders the entire social-links row, so the Vice President's card (no personal links provided) shows cleanly with no empty/broken UI.

### Not Touched (Explicitly Out of Scope)

- `src/data/committees.ts` / `src/types/committee.types.ts` — Phase 0 placeholder files, never wired to any UI, left untouched since Sprint 1.5 scoped committee data inside the new `union.ts` instead. Flagged in `PROJECT_STATE.md` as a future cleanup candidate.
- Navbar, Footer, Theme system, Language system — untouched, per sprint instructions.

### Verification

- `npm run lint` — passes, zero errors.
- `tsc --noEmit` — passes, zero TypeScript errors.
- `npm run build` — succeeds; `/union` now generated as a static route alongside `/`, `/guide`, `/systems`.

### Breaking Changes

None.

### Known Issues

- Official union hero photo and team photo not yet provided — using abstract SVG placeholders.
- `team-placeholder.svg` exists but isn't referenced by any component yet (no current section needs a generic team-member fallback).

---

## [v0.5.0] — Phase 1 Sprint 1.4: Freshman Guide

### Added

**Data Layer:**
- `src/data/guide.ts` — 8 guide sections with inline `GuideSection`/`GuideStat` types: Introduction, Registration Process, Academic Advisor, Credit Hour System, GPA Rules, Summer Registration, Overload Rules, Important Notes. Official academic rules used verbatim (not invented):
  - Total Credit Hours = 140 (Year 1: 36, Year 2: 36, Year 3: 36, Year 4: 32, Summer: 9, Graduation Summer: 12).
  - First semester registration performed by the Academic Advisor.
  - Academic Advisors communicate only through Microsoft Teams.
  - GPA below 2.0 → 14 hours (up to 15 with advisor approval).
  - Overload allowed only for CGPA above 3.0.
- `src/data/studyPlans.ts` — 4 official study plans (General, Computer Science, Artificial Intelligence, Information Systems) with inline `StudyPlan` type, including exact intrinsic image dimensions.

**Assets:**
- `public/images/study-plans/` — 4 official study plan reference images (general-major.png, computer-science-major.png, artificial-intelligence-major.png, information-systems-major.png). Displayed as-is; contents never extracted, OCR'd, or summarized.

**Feature Components:**
- `GuideCard.tsx` (components/shared) — numbered step card with icon, title, description, and an expandable "Learn more" panel showing fact bullets and/or a stat-chip grid (used for Credit Hour System and Summer Registration numbers). `highlight` variant gives Important Notes distinct secondary/green styling.
- `StudyPlanCard.tsx` (components/shared) — thumbnail preview (next/image, `fill`) + "View Full Size" trigger opening a self-contained accessible full-screen viewer: focus moves in on open, Escape closes, background scroll locks, focus returns to the trigger on close (same conventions as Sprint 1.1's MobileMenu).

**Section Components:**
- `FreshmanGuideSection.tsx` (components/sections) — renders all 8 guide steps as a sequential numbered card list.
- `StudyPlansSection.tsx` (components/sections) — responsive grid (1/2/4 columns) of study plan cards.

**Routing:**
- `src/app/guide/page.tsx` — new `/guide` route composing `FreshmanGuideSection` + `StudyPlansSection`.

**Localization:**
- Extended `src/locales/en.json` and `ar.json` with top-level `guide` section (heading, subheading, learn more/show less, all 8 topics' titles/descriptions/facts/stat labels) and `studyPlans` section (heading, subheading, view full size/close, 4 major names + alt text).

### Fixed

- `StudyPlanCard.tsx` — fixed `react-hooks/exhaustive-deps` lint warning by copying `triggerRef.current` to a local variable inside the effect before the cleanup closure captures it, rather than reading the ref directly in cleanup.

### Architecture Decisions

- **Inline types over separate type files:** `GuideSection`/`GuideStat`/`StudyPlan` interfaces are defined directly inside `guide.ts`/`studyPlans.ts` rather than in new `src/types/*.types.ts` files — a deliberate, scoped deviation from the Sprint 1.1–1.3 convention, made to strictly respect this sprint's explicit "Create:" file list and "no architecture changes" instruction.
- **Reused disclosure pattern:** GuideCard's "Learn more" toggle follows the exact same inline-expand pattern as SystemCard's "How to Use" button (Sprint 1.3) — no new disclosure primitive introduced.
- **Self-contained lightbox:** StudyPlanCard's full-size viewer is implemented inline rather than extracted into a new shared `ImageLightbox` component, again to respect the sprint's closed file list. Its accessible-dialog behavior mirrors MobileMenu's established conventions.
- **next/image throughout:** both thumbnail (`fill` + `aspect-[4/3]` container) and full-size (`width`/`height` from real intrinsic dimensions) views use `next/image`, never a plain `<img>` tag, per 05_ARCHITECTURE.md #14.
- **Study plans treated as opaque assets:** at no point in the data, components, or this changelog are the study plan images' contents described, transcribed, or summarized — only their major names (provided directly by the user) are used as labels.

### Verification

- `npm run lint` — 1 warning found (react-hooks/exhaustive-deps in StudyPlanCard) and fixed; passes clean afterward.
- `tsc --noEmit` — passes, zero TypeScript errors.
- `npm run build` — succeeds; `/guide` now generated as a static route alongside `/` and `/systems`.

### Breaking Changes

None.

### Known Issues

- Official brand hex colors, campus photo, and per-system logos still pending from earlier sprints.
- `CHANGE_POLICY.md` and `AI_INSTRUCTIONS.md` were not present as standalone files in this sprint's project mount; their rules were applied from earlier in the working session.

---

## [v0.4.0] — Phase 1 Sprint 1.3: University Systems Section

### Added

**Type System:**
- `src/types/system.types.ts` — added `SystemCategory` type (`academic` | `student-services` | `communication`) and `required: boolean`. Converted `name`/`description`/`instructions` from raw strings to translation-key fields (`nameKey`/`descriptionKey`/`instructionsKey`), matching the pattern already used in `data/navigation.ts` and `data/home.ts`.

**Data Layer:**
- `src/data/systems.ts` populated with 5 official university systems (real data provided by the Student Union, not invented):
  - **Banner** (academic, required) — `https://register.must.edu.eg/StudentRegistrationSsb/ssb/registration`
  - **Smart Learning** (academic, required) — `https://smartlearning.must.edu.eg/login/index.php`
  - **MUSTER** (student-services, required) — mobile app only, no official web portal (`officialUrl: ""`)
  - **Microsoft Teams** (communication, required) — `https://teams.microsoft.com/`
  - **Outlook** (communication, required) — `https://outlook.office.com/`
- Added `PASSWORD_RESET_URL` export (`https://passwordreset.microsoftonline.com/`) — relevant to Teams/Outlook/MUSTER university-account sign-in.

**Feature Components:**
- `SystemCard.tsx` (components/shared) — icon, name, category label, required badge, description, "Open" button (external link, opens in new tab) or "Coming soon" placeholder when no URL exists, and an accessible "How to Use" toggle revealing inline instructions (aria-expanded/aria-controls, no modal).

**Section Components:**
- `SystemsSection.tsx` (components/sections) — responsive grid (1/2/3 columns) of active systems, plus a password-reset note referencing `PASSWORD_RESET_URL`.

**Routing:**
- `src/app/systems/page.tsx` — new `/systems` route. Navbar/Footer inherited from root layout via `Providers`.

**Localization:**
- Extended `src/locales/en.json` and `ar.json` with a new top-level `systems` section: heading/subheading, button labels, category labels, password-reset copy, and per-system name/description/instructions for all 5 systems.
- Added `common.opensInNewTab` key for external-link accessibility.
- System proper names (Banner, Smart Learning, MUSTER, Microsoft Teams, Outlook) kept in Latin script in Arabic locale, consistent with how "MITSU" is handled — these are official software/product names, not translated terms.

### Fixed (Required Dependency Updates)

- `Footer.tsx` — updated to call `translate(s.nameKey)` instead of the now-removed `s.name` field, and to use the real `s.officialUrl` instead of a hardcoded empty string, now that Sprint 1.3 populated real URLs. Required because Sprint 1.3 changed the shape of `systems.ts` that Footer already depended on — not a redesign of Footer itself.
- `FooterLinkGroup.tsx` — added external-URL detection (`href.startsWith("http")`) so real system links open in a new tab via a plain `<a target="_blank" rel="noopener noreferrer">`, while internal paths continue using `next/link` for client-side navigation. This edge case didn't exist before Sprint 1.3, since every link passed to this component was previously either internal or an empty placeholder.

### Architecture Decisions

- **Translation-key consistency:** `systems.ts` now follows the same `*Key` pattern as `navigation.ts`/`home.ts` rather than embedding raw English text, keeping all three data files architecturally consistent ahead of eventual Firebase migration.
- **Category/required badges:** included in `SystemCard` even though not explicitly listed in the sprint's minimum card content spec (Logo, Name, Description, Open, How to Use) — included because the Student Union explicitly supplied this data as part of the official system information; low-risk, non-intrusive additions.
- **Inline instructions panel over modal:** "How to Use" toggles a simple expand/collapse region within the card rather than a dialog, avoiding focus-trap complexity while remaining fully keyboard accessible.
- **Generic Lucide icons as placeholders:** ClipboardList (Banner), BookOpen (Smart Learning), Smartphone (MUSTER), Video (Teams), Mail (Outlook) — Lucide ships no brand/logo icons, consistent with the Sprint 1.1 Footer social-icon precedent. Official per-system logos to be swapped in later.
- **Empty-URL handling:** MUSTER's `officialUrl: ""` renders as a "Coming soon" placeholder (not a broken link) in both `SystemCard` and `Footer`, per the "no broken links" trust principle (03_UI_UX_GUIDELINES.md).

### Verification

- `npm run lint` — passes, zero errors.
- `tsc --noEmit` — passes, zero TypeScript errors.
- `npm run build` — succeeds; `/systems` now generated as a static route alongside `/`.

### Breaking Changes

- `UniversitySystem` type: `name`/`description`/`instructions` (raw strings) replaced with `nameKey`/`descriptionKey`/`instructionsKey` (translation keys). Any code reading the old fields directly would break — the only existing consumer (`Footer.tsx`) has been updated accordingly in this same release.

### Known Issues

- MUSTER has no official web portal yet — "Open" action shows "Coming soon" until one exists.
- Official per-system logos not yet provided — using generic Lucide icons.
- Official campus photo and brand hex colors still pending from earlier sprints.

---

## [v0.3.0] — Phase 1 Sprint 1.2: Homepage Hero & Quick Access

### Added

**Section Components:**
- `HeroSection.tsx` — hero section with MITSU welcome, heading, description, primary/secondary CTAs, campus image placeholder. Responsive (mobile-first), dark mode, EN/AR, RTL/LTR, accessible.
- `QuickAccessSection.tsx` — quick access section rendering 6 reusable cards in responsive grid (1 col mobile, 2 col tablet, 3 col desktop). Responsive, dark mode, EN/AR.

**Brand Foundation:**
- Folder structure: `public/images/{branding, university, placeholders}/`.
- Official MITSU logo (`public/images/branding/mitsu-logo.png`).
- Official MUST university logo (`public/images/university/must-logo.png`).
- Campus placeholder image (`public/images/placeholders/campus.svg` — SVG until official campus photo provided).

**Data Layer:**
- `src/data/home.ts` — `HeroData` and `QuickAccessItem` types with complete data exports (`heroData`, `quickAccessItems`). All content data-driven, zero hardcoding.

**Localization:**
- Extended `src/locales/en.json`:
  - `home.hero.heading`, `home.hero.description`, `home.hero.primaryCta`, `home.hero.secondaryCta`, `home.hero.imageAlt`.
  - `home.quickAccess.heading`, `home.quickAccess.subheading`.
  - 6 item keys: `guide.title/description`, `systems.title/description`, `union.title/description`, `announcements.title/description`, `contact.title/description`, `about.title/description`.
  - `home.quickAccess.explore` (used by QuickAccessCard).
- Extended `src/locales/ar.json`:
  - Same structure as English, complete Arabic translations.

**Homepage Integration:**
- Replaced placeholder `src/app/page.tsx` with real Phase 1 homepage composition: `<HeroSection />` → `<QuickAccessSection />`.
- Layout structure: Navbar (from Providers) → Hero → QuickAccess → Footer (from Providers).

### Fixed

- Icon type casting in `QuickAccessCard.tsx` — simplified to `(Icons as any)[iconName]` for dynamic icon resolution from lucide-react.
- QuickAccessSection sorting logic — removed redundant sorting (items already in correct order in data).

### Architecture Decisions

- **HeroSection data sourcing:** Imports `heroData` from `src/data/home.ts` — single source of truth, no component-level content logic.
- **QuickAccessSection card mapping:** Maps over `quickAccessItems` array, delegates rendering to reusable `QuickAccessCard` component.
- **Icon resolution pattern:** Dynamic icon lookup from lucide-react using `(Icons as any)[iconName]` — necessary for runtime resolution of icon names from data.
- **Responsive grid:** Uses Tailwind responsive classes (`sm:grid-cols-2 lg:grid-cols-3`) for mobile-first approach.
- **All content data-driven:** Zero hardcoded text, links, or data in any component (13_CHANGE_POLICY.md compliance).

### Verification

- `npm run lint` — passes, zero errors.
- `tsc --noEmit` — passes, zero TypeScript errors.
- `npm run build` — succeeds (fonts work in production environment with internet access).
- Responsive design: mobile < 640px (1 col), tablet 640–1024px (2 cols), desktop > 1024px (3 cols).
- Dark mode: all components support light/dark themes.
- Bilingual: English and Arabic fully supported.
- RTL/LTR: RTL layout works correctly when Arabic is selected.
- Accessibility: semantic HTML, keyboard navigation, proper focus states.

### Breaking Changes

None.

### Known Issues

- Official campus image not yet provided — using SVG placeholder.
- Hero primary CTA link is empty (points to "#") — will be populated from Firebase settings in Phase 4.
- Firebase not configured — all social/external links are placeholders.

---

## [v0.2.0] — Phase 1 Sprint 1.1: Reusable Layout Foundation

### Added

**UI Components:**
- `IconButton.tsx` — accessible icon-only button primitive with required label.

**Layout Components:**
- `Container.tsx` — responsive max-width 1200px centered container (04_DESIGN_SYSTEM.md #8).
- `Navbar.tsx` — global header with Logo, navigation links, theme/language switchers, mobile hamburger, skip-to-content link.
- `NavLinks.tsx` — reusable horizontal/vertical navigation list reading from data/navigation.ts.
- `MobileMenu.tsx` — accessible mobile navigation drawer with focus management, Escape-to-close, scroll lock, fade/slide animations, prefers-reduced-motion support.
- `Footer.tsx` — global footer with branding, quick links, systems directory, social placeholders, copyright.
- `FooterLinkGroup.tsx` — reusable footer column component for real links or "coming soon" placeholders.
- `FooterSocialLinks.tsx` — social icons display (disabled placeholders until Firebase content Phase 4).

**Shared Components:**
- `Logo.tsx` — MITSU wordmark + identity line, reused by Navbar and Footer.
- `ThemeSwitcher.tsx` — Moon/Sun icon toggle with accessible labels.
- `LanguageSwitcher.tsx` — language toggle button with visible text label (EN/AR).

**Types & Data:**
- `src/types/social.types.ts` — SocialLink type definition.
- `src/data/socialLinks.ts` — placeholder social entries (href empty until Phase 4).

**Styling & Localization:**
- Extended `globals.css`:
  - Added `--overlay` semantic token (light/dark variants) for mobile menu backdrop.
  - Added `@keyframes fade-slide-down` and `fade-in` animations (200ms, respects prefers-reduced-motion).
  - Added `.animate-fade-slide-down` and `.animate-fade-in` utility classes.
- Extended `src/lib/utils.ts` with `focusRing` constant for consistent keyboard focus styling.
- Extended `src/locales/en.json` with navbar, language, footer translation keys.
- Extended `src/locales/ar.json` with navbar, language, footer translation keys (Arabic).

**Infrastructure:**
- Updated `src/context/Providers.tsx` to wrap children with `<Navbar>`, `<Footer>`, and main content region.

### Architecture Decisions

- **Single-responsibility NavLinks:** component renders list only, letting Navbar/MobileMenu provide nav landmarks (proper ARIA semantics).
- **Reusable Logo:** single component shared between Navbar and Footer (07_COMPONENT_RULES.md #11).
- **FooterLinkGroup handles both states:** real links (Quick Links) and placeholders (University Systems) with same component (13_CHANGE_POLICY.md).
- **MobileMenu conditional mount:** only renders when open, preventing accessibility tree duplication.
- **Shared focusRing constant:** ensures consistent keyboard-focus styling across all interactive elements.
- **Data-driven navigation:** all links read from data files, zero hardcoding (Sprint 1.1 requirement).

### Verification

- `npm run lint` — passes, zero errors.
- `tsc --noEmit` — passes, zero TypeScript errors.
- `npm run build` — succeeds (fonts work in production environment with internet access).

### Breaking Changes

None.

### Known Issues

- Official brand hex colors not yet provided; using placeholder Blue/Green values.
- Official logos and campus images not yet provided; using design system placeholders.
- Firebase not configured; all social links are disabled placeholders (Phase 4 scope).

---

## [v0.1.0] — Phase 0: Planning & Foundation

### Added

- Next.js 16 project scaffold (App Router, TypeScript, Tailwind CSS v4, ESLint, `src/` directory, npm).
- Design token system in `globals.css` (Tailwind v4 CSS-first `@theme`): brand colors, spacing scale, radius scale, breakpoints, light/dark surface tokens.
- Inter (Latin) and Cairo (Arabic) fonts via `next/font/google`.
- Full project folder structure per `05_ARCHITECTURE.md`.
- Theme system: `ThemeContext`, `useTheme` hook, `localStorage` persistence, class-based dark mode.
- Language system: `LanguageContext`, `useLanguage` hook, `translate()` utility, `en.json`/`ar.json` locale files, automatic RTL/LTR switching.
- Firebase SDK skeleton (`lib/firebase.ts`) — safe no-op until a real project is configured.
- Typed data stubs: `data/systems.ts`, `data/committees.ts`, `data/navigation.ts`.
- Shared types: `theme.types.ts`, `language.types.ts`, `system.types.ts`, `committee.types.ts`, `navigation.types.ts`.
- Brand constants (`constants/brand.ts`).
- `.env.local.example` with placeholder Firebase config keys.
- Placeholder verification home page (theme + language toggle).
- `PROJECT_STATE.md` and `CHANGELOG.md`.
- Git repository initialized.

### Notes

- Brand hex colors are placeholders pending official values.
- Logos and campus images are placeholders pending official assets.
- No Firebase project exists yet; all Firebase code is inert until `.env.local` is populated.

---

## [Unreleased]

Sprint 3.3 — next admin content-management page (likely Announcements or Events, following the Sprint 3.2 pattern) — scope not yet defined/approved. See `PROJECT_STATE.md` Next Actions.

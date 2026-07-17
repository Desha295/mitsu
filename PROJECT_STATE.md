# PROJECT_STATE.md

## MITSU

Tracks current progress, completed work, current sprint, and next actions.
Must be updated at the end of every sprint (00_PROJECT_RULES.md #22, #26).

---

## Current Status

**Phase:** Phase 1 — Core Platform
**Current Sprint:** Sprint 1.6 — Announcements & Events
**Status:** Complete
**Version:** v0.7.0

---

## Completed Work

### Phase 0 — Planning & Foundation (v0.1.0)

- Scaffolded Next.js 16 project (App Router, TypeScript, Tailwind CSS v4, ESLint).
- Design tokens, fonts (Inter/Cairo), theme system, language system with `localStorage` persistence.
- Firebase SDK skeleton and typed data stubs. Git repository initialized.

### Phase 1 — Sprint 1.1: Reusable Layout Foundation (v0.2.0)

- `Navbar.tsx`, `NavLinks.tsx`, `MobileMenu.tsx`, `Footer.tsx`, `FooterLinkGroup.tsx`, `FooterSocialLinks.tsx`.
- `Logo.tsx`, `ThemeSwitcher.tsx`, `LanguageSwitcher.tsx`, `Container.tsx`, `IconButton.tsx`.

### Phase 1 — Sprint 1.2: Homepage Hero & Quick Access (v0.3.0)

- `HeroSection.tsx`, `QuickAccessSection.tsx`, `QuickAccessCard.tsx`, `src/data/home.ts`.
- Homepage composed: `src/app/page.tsx` = Hero + QuickAccess.

### Phase 1 — Sprint 1.3: University Systems Section (v0.4.0)

- `src/data/systems.ts` populated with 5 official systems (Banner, Smart Learning, MUSTER, Teams, Outlook).
- `SystemCard.tsx`, `SystemsSection.tsx`, `/systems` route.

### Phase 1 — Sprint 1.4: Freshman Guide (v0.5.0)

- `src/data/guide.ts` (8 topics, official academic rules), `src/data/studyPlans.ts` (4 official study plan images).
- `GuideCard.tsx`, `StudyPlanCard.tsx`, `FreshmanGuideSection.tsx`, `StudyPlansSection.tsx`, `/guide` route.

### Phase 1 — Sprint 1.5: Student Union Section (v0.6.0)

- `src/data/union.ts` (overview, vision, mission, leadership, 7 committees, social links).
- `LeaderCard.tsx`, `CommitteeCard.tsx`, `UnionHeroSection.tsx`, `LeadershipSection.tsx`, `CommitteesSection.tsx`, `/union` route.

### Post-Sprint 1.5 Bug Fix

- Unified the WhatsApp Community URL: extracted `WHATSAPP_COMMUNITY_URL` as a named constant in `src/data/union.ts`, imported into `src/data/home.ts`'s `heroData.primaryCtaHref` (previously an empty Sprint 1.2 placeholder). Both Hero and Union now share one source of truth.

### Phase 1 — Sprint 1.6: Announcements & Events (v0.7.0)

**Data Layer:**
- `src/data/announcements.ts` — types (`Announcement`, `Event`, `AnnouncementPriority`, `AnnouncementCategory`, `EventCategory`) defined inline, consistent with the Sprint 1.4/1.5 precedent (no new `src/types/*` file, since this sprint's approved file list didn't include one). Mirrors the `/announcements` and `/events` Firestore collection shape (`06_FIREBASE_SCHEMA.md` #5-6) for a clean future migration.
- **Content note:** unlike Sprints 1.3/1.4/1.5, no real Student Union announcements/events were provided this sprint. All 8 announcements and 6 events are clearly-labeled sample/placeholder content demonstrating real page structure (dates, categories, priority, one featured item) — they must be replaced with actual content before this section goes live. This is explicitly documented in the data file's header comment.
- One announcement marked `featured: true` and `priority: "urgent"` (Fall Semester Registration).

**Feature Components:**
- `AnnouncementCard.tsx` (components/shared) — category badge, priority-based emphasis, date, title, description; supports a `featured` prop for the larger hero-style slot. Priority differentiation uses only the locked Blue/Green brand palette (no red/orange), per the repeated "no unrelated colors" rule — "urgent" gets a solid primary badge + `AlertCircle` icon + heavier border, "important" reuses the secondary-light "highlight" treatment established in Sprint 1.4's `GuideCard`, "normal" gets neutral styling.
- `EventCard.tsx` (components/shared) — category badge, title, description, formatted date, optional location.

**Section Components:**
- `AnnouncementsSection.tsx` — featured announcement, static search input, static category filter chips, "Latest Announcements" grid (sorted newest-first per `03_UI_UX_GUIDELINES.md`).
- `EventsSection.tsx` — "Upcoming Events" grid (sorted soonest-first).

**Routing:**
- `src/app/announcements/page.tsx` — new `/announcements` route, composition: Announcements → Events.

**Localization:**
- Extended `en.json`/`ar.json` with new top-level `announcements` and `events` sections: headings, search/filter labels, category labels, priority labels, empty-state messages, and per-item title/description/location text for all 8 announcements and 6 events.

**Shared Utility:**
- Added `formatDate(dateString, language)` to `src/lib/utils.ts` — locale-aware date formatting (`Intl.DateTimeFormat`) shared by both new cards, forcing Western digits in Arabic (`ar-EG-u-nu-latn`) for consistency with the rest of the app's number display (e.g. Sprint 1.4's credit-hour stats).

**Scope Discipline — "Static" UI:**
- Per `CURRENT_SPRINT.md`'s explicit "Search UI (Static)" / "Filter UI (Static)", the search input and category filter chips are fully interactive and accessible (controlled state, `aria-pressed` on filter chips) but do **not** actually filter the rendered announcement list — real filtering is deferred to a future sprint once this is backed by real data/Firebase, consistent with "No CRUD" / "No Firebase" for this sprint.

**Verification:**
- `npm run lint` → passes, zero errors.
- `tsc --noEmit` → passes, zero TypeScript errors.
- `npm run build` → succeeds; `/announcements` now included as a static route alongside `/`, `/guide`, `/systems`, `/union`.

**Not Touched (Out of Scope):**
- Navbar, Footer, Theme system, Language system — untouched.
- No Firebase, Admin Dashboard, AI, notifications, or authentication introduced.

---

## Current Sprint

**Sprint 1.6: Announcements & Events** — CLOSED

Tasks completed:
- [x] `src/data/announcements.ts` — announcements + events data (sample content, clearly labeled)
- [x] `AnnouncementCard.tsx`, `EventCard.tsx`
- [x] `AnnouncementsSection.tsx` (featured + static search/filter + latest grid)
- [x] `EventsSection.tsx` (upcoming grid)
- [x] `/announcements` page route
- [x] EN localization (`announcements.*`, `events.*` keys)
- [x] AR localization (`announcements.*`, `events.*` keys)
- [x] Shared `formatDate` utility (no duplicated date logic)
- [x] Verification: lint passes, TypeScript passes, build succeeds
- [x] PROJECT_STATE.md updated
- [x] CHANGELOG.md updated
- [x] Git commit created
- [x] Project archive created

---

## Next Actions (Sprint 1.7 — not yet scoped/approved)

Per `10_ROADMAP.md` Phase 1, likely candidates for a future sprint:
- Contact page.
- About page.
- Platform polish / SEO (Phase 1 final sprint per roadmap).

**Not yet started — awaiting explicit sprint scope approval before any implementation.**

---

## Outstanding Items / Blockers

- Official brand hex colors not yet provided (using placeholder Blue/Green).
- Official campus/union hero/team photos not yet provided (using placeholders).
- MUSTER has no official web portal yet.
- Firebase project not created; all data remains local/static.
- **Real content needed:** all 8 announcements and 6 events in `src/data/announcements.ts` are sample/placeholder content — must be replaced with real Student Union submissions before launch.
- **Cleanup candidate (carried over from Sprint 1.5):** `src/data/committees.ts` + `src/types/committee.types.ts` (Phase 0 placeholders) remain unused by any component.
- **Future functionality:** Search and category filtering on `/announcements` are currently static (UI only) per Sprint 1.6 scope — real filtering logic is a candidate for a future sprint.

---

## File Summary

### New in Sprint 1.6

**Components (4 files):**
- `src/components/shared/AnnouncementCard.tsx`
- `src/components/shared/EventCard.tsx`
- `src/components/sections/AnnouncementsSection.tsx`
- `src/components/sections/EventsSection.tsx`

**Routes (1 file):**
- `src/app/announcements/page.tsx`

**Data (1 file):**
- `src/data/announcements.ts`

### Modified in Sprint 1.6

- `src/locales/en.json` — added top-level `announcements` and `events` sections
- `src/locales/ar.json` — added top-level `announcements` and `events` sections (Arabic)
- `src/lib/utils.ts` — added `formatDate()` helper

### Removed in Sprint 1.6

- `src/app/announcements/.gitkeep` — superseded by real `page.tsx`

---

## Version History

See `CHANGELOG.md` for detailed change log by version.

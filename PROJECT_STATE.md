# PROJECT_STATE.md

## MITSU

Tracks current progress, completed work, current sprint, and next actions.
Must be updated at the end of every sprint (00_PROJECT_RULES.md #22, #26).

---

## Current Status

**Phase:** Phase 1 — Core Platform
**Current Sprint:** Sprint 1.5 — Student Union Section
**Status:** Complete
**Version:** v0.6.0

---

## Completed Work

### Phase 0 — Planning & Foundation (v0.1.0)

- Scaffolded Next.js 16 project (App Router, TypeScript, Tailwind CSS v4, ESLint).
- Configured design tokens in `src/app/globals.css`.
- Wired Inter (Latin) and Cairo (Arabic) fonts via `next/font/google`.
- Built full folder skeleton per `05_ARCHITECTURE.md`.
- Implemented theme system and language system with `localStorage` persistence.
- Added Firebase SDK skeleton and typed data stubs.
- Initialized Git repository.

### Phase 1 — Sprint 1.1: Reusable Layout Foundation (v0.2.0)

- `IconButton.tsx`, `Container.tsx` — reusable primitives.
- `Navbar.tsx`, `NavLinks.tsx`, `MobileMenu.tsx` — global navigation with accessible mobile drawer.
- `Footer.tsx`, `FooterLinkGroup.tsx`, `FooterSocialLinks.tsx` — global footer.
- `Logo.tsx`, `ThemeSwitcher.tsx`, `LanguageSwitcher.tsx` — shared brand/utility components.

### Phase 1 — Sprint 1.2: Homepage Hero & Quick Access (v0.3.0)

- Official MITSU and MUST logos integrated into `public/images/`.
- `HeroSection.tsx`, `QuickAccessSection.tsx`, `QuickAccessCard.tsx`.
- `src/data/home.ts` — hero and quick access data.
- Homepage composed: `src/app/page.tsx` = Hero + QuickAccess.

### Phase 1 — Sprint 1.3: University Systems Section (v0.4.0)

- Extended `system.types.ts` with category/required/translation-key fields.
- Populated `src/data/systems.ts` with 5 official systems (Banner, Smart Learning, MUSTER, Teams, Outlook).
- `SystemCard.tsx`, `SystemsSection.tsx`, `/systems` route.
- Required dependency fixes to `Footer.tsx`/`FooterLinkGroup.tsx` for real URLs.

### Phase 1 — Sprint 1.4: Freshman Guide (v0.5.0)

- `src/data/guide.ts` — 8 guide topics with official academic rules (credit hours, GPA, overload).
- `src/data/studyPlans.ts` — 4 official study plan reference images.
- `GuideCard.tsx`, `StudyPlanCard.tsx` (with accessible full-size viewer), `FreshmanGuideSection.tsx`, `StudyPlansSection.tsx`.
- `/guide` route composing both sections.

### Phase 1 — Sprint 1.5: Student Union Section (v0.6.0)

**Data Layer:**
- `src/data/union.ts` — types (`SocialLinkItem`, `UnionLeader`, `UnionCommittee`) defined inline, consistent with the Sprint 1.4 precedent (no new `src/types/*` files, since this sprint's approved file list didn't include one).
- `unionOverview` — name, overview, vision, mission, hero image (all official text provided by the Student Union, used verbatim).
- `president` / `vicePresident` — leadership data. President includes 4 personal social links (Facebook, Instagram, LinkedIn, WhatsApp); Vice President has none provided, so her `socialLinks` array is empty.
- `committees` — 7 official committees (Scientific, Cultural, Sports, Artistic, Social & Trips, Student Families, Scouts) with real descriptions.
- `unionSocialLinks` — 4 official Union channels (Facebook, Instagram, Faculty Group, WhatsApp Community), kept structurally and visually separate from the President's personal links per Sprint 1.5's "Personal Information Separation" rule.

**Images:**
- `public/images/union/president.jpg`, `vice-president.jpg` — real photos provided by the Student Union.
- `public/images/union/union-hero.svg`, `team-placeholder.svg` — abstract placeholder graphics (not fake photos) for assets not yet provided. `union-hero.svg` echoes the official MITSU logo's connected-node motif for brand consistency. Saved as `.svg` (not `.jpg` as originally suggested) since they're vector placeholders — using an honest extension rather than mislabeling file type. `team-placeholder.svg` is provisioned per sprint instruction but not yet referenced by any current component (no generic team-member grid exists yet in Sprint 1.5's scope).

**Components:**
- `LeaderCard.tsx` (components/shared) — image, name, position, and a conditionally-rendered social links row (hidden entirely when a leader has none, e.g. the Vice President).
- `CommitteeCard.tsx` (components/shared) — icon, name, description.
- `UnionHeroSection.tsx` — identity, overview, hero image, plus Vision & Mission cards (per the page composition order: Hero → Vision/Mission → Leadership → Committees → Social).
- `LeadershipSection.tsx` — President and Vice President via `LeaderCard`.
- `CommitteesSection.tsx` — all 7 committees via `CommitteeCard`, plus the official Union social links at the end of the page.

**Routing:**
- `src/app/union/page.tsx` — new `/union` route composing Hero → Leadership → Committees in order.

**Localization:**
- Extended `src/locales/en.json` and `ar.json` with a new top-level `union` section: name/overview/vision/mission, section headings, leadership names/positions, all 7 committee names/descriptions, and social link labels (both personal and official, using distinct keys to keep them separable).

**Icon Decisions:**
- Verified via the installed `lucide-react` package (not assumed) that Facebook/Instagram/LinkedIn icons don't exist in Lucide. Reused the Sprint 1.1 precedent (`Users` for Facebook, `Camera` for Instagram, `MessageCircle` for WhatsApp) and added `Briefcase` as a generic LinkedIn stand-in.
- Committee icons: FlaskConical (Scientific), BookOpenText (Cultural), Dumbbell (Sports), Palette (Artistic), Plane (Social & Trips), Users2 (Student Families), Tent (Scouts).

**Data Correction Applied:**
- The President's WhatsApp contact was provided as a phone number (01558989980). Converted to the standard `https://wa.me/201558989980` deep-link format (Egypt country code +20, leading 0 dropped) so it opens a WhatsApp chat correctly — a direct, non-inventive formatting of the number given, not new information.

**Verification:**
- `npm run lint` → passes, zero errors.
- `tsc --noEmit` → passes, zero TypeScript errors.
- `npm run build` → succeeds; `/union` now included as a static route alongside `/`, `/guide`, `/systems`.

**Not Touched (Out of Scope):**
- `src/data/committees.ts` and `src/types/committee.types.ts` (Phase 0 placeholder files, never wired to any UI) were left untouched — Sprint 1.5 explicitly scoped committee data inside the new `union.ts` file instead. These Phase 0 files are now redundant/unused; flagged below for future cleanup.
- Navbar, Footer, Theme system, Language system — untouched, as instructed.

---

## Current Sprint

**Sprint 1.5: Student Union Section** — CLOSED

Tasks completed:
- [x] `src/data/union.ts` — overview, vision, mission, leadership, committees, social links
- [x] Real president/vice-president photos + placeholder hero/team images
- [x] `LeaderCard.tsx`, `CommitteeCard.tsx`
- [x] `UnionHeroSection.tsx`, `LeadershipSection.tsx`, `CommitteesSection.tsx`
- [x] `/union` page route (Hero → Leadership → Committees composition)
- [x] EN localization (`union.*` keys)
- [x] AR localization (`union.*` keys)
- [x] Personal vs. official social link separation maintained
- [x] Verification: lint passes, TypeScript passes, build succeeds
- [x] PROJECT_STATE.md updated
- [x] CHANGELOG.md updated
- [x] Git commit created
- [x] Project archive created

---

## Next Actions (Sprint 1.6 — not yet scoped/approved)

Per `10_ROADMAP.md` Phase 1, likely candidates for a future sprint:
- Announcements section (placeholder until Firebase Phase 4).
- Contact page.
- About page.

**Not yet started — awaiting explicit sprint scope approval before any implementation.**

---

## Outstanding Items / Blockers

- Official brand hex colors not yet provided (using placeholder Blue/Green).
- Official campus photo, union hero photo, and team photo not yet provided (using placeholders).
- Official per-system logos (Sprint 1.3) not yet provided.
- MUSTER has no official web portal yet.
- Firebase project not created; all data remains local/static.
- **Cleanup candidate:** `src/data/committees.ts` + `src/types/committee.types.ts` (Phase 0 placeholders) are now superseded by `src/data/union.ts`'s committee data and are unused by any component — safe to remove in a future sprint if approved.

---

## File Summary

### New in Sprint 1.5

**Components (5 files):**
- `src/components/shared/LeaderCard.tsx`
- `src/components/shared/CommitteeCard.tsx`
- `src/components/sections/UnionHeroSection.tsx`
- `src/components/sections/LeadershipSection.tsx`
- `src/components/sections/CommitteesSection.tsx`

**Routes (1 file):**
- `src/app/union/page.tsx`

**Data (1 file):**
- `src/data/union.ts`

**Images (4 files):**
- `public/images/union/president.jpg`
- `public/images/union/vice-president.jpg`
- `public/images/union/union-hero.svg`
- `public/images/union/team-placeholder.svg`

### Modified in Sprint 1.5

- `src/locales/en.json` — added top-level `union` section
- `src/locales/ar.json` — added top-level `union` section (Arabic)

### Removed in Sprint 1.5

- `src/app/union/.gitkeep` — superseded by real `page.tsx`

---

## Version History

See `CHANGELOG.md` for detailed change log by version.

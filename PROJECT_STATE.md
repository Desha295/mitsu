# PROJECT_STATE.md

## MITSU

Tracks current progress, completed work, current sprint, and next actions.
Must be updated at the end of every sprint (00_PROJECT_RULES.md #22, #26).

---

## Current Status

**Phase:** Phase 1 — Core Platform
**Current Sprint:** Sprint 1.7 — About MITSU & Contact
**Status:** Complete
**Version:** v0.8.0

---

## Completed Work

### Phase 0 — Planning & Foundation (v0.1.0)

- Scaffolded Next.js 16 project, design tokens, fonts, theme/language systems, Firebase skeleton, Git init.

### Phase 1 — Sprint 1.1: Reusable Layout Foundation (v0.2.0)

- `Navbar.tsx`, `NavLinks.tsx`, `MobileMenu.tsx`, `Footer.tsx`, `FooterLinkGroup.tsx`, `FooterSocialLinks.tsx`, `Logo.tsx`, `ThemeSwitcher.tsx`, `LanguageSwitcher.tsx`, `Container.tsx`, `IconButton.tsx`.

### Phase 1 — Sprint 1.2: Homepage Hero & Quick Access (v0.3.0)

- `HeroSection.tsx`, `QuickAccessSection.tsx`, `QuickAccessCard.tsx`, `src/data/home.ts`.

### Phase 1 — Sprint 1.3: University Systems Section (v0.4.0)

- `src/data/systems.ts` (5 official systems), `SystemCard.tsx`, `SystemsSection.tsx`, `/systems` route.

### Phase 1 — Sprint 1.4: Freshman Guide (v0.5.0)

- `src/data/guide.ts`, `src/data/studyPlans.ts`, `GuideCard.tsx`, `StudyPlanCard.tsx`, `FreshmanGuideSection.tsx`, `StudyPlansSection.tsx`, `/guide` route.

### Phase 1 — Sprint 1.5: Student Union Section (v0.6.0)

- `src/data/union.ts` (overview, vision, mission, leadership, 7 committees, social links), `LeaderCard.tsx`, `CommitteeCard.tsx`, `UnionHeroSection.tsx`, `LeadershipSection.tsx`, `CommitteesSection.tsx`, `/union` route.

### Post-Sprint 1.5 Bug Fix (v0.6.1)

- Unified the WhatsApp Community URL via a single named constant in `union.ts`, imported by `home.ts`.

### Phase 1 — Sprint 1.6: Announcements & Events (v0.7.0)

- `src/data/announcements.ts` (sample/placeholder content, clearly labeled), `AnnouncementCard.tsx`, `EventCard.tsx`, `AnnouncementsSection.tsx` (featured + static search/filter), `EventsSection.tsx`, `/announcements` route.
- Added shared `formatDate()` helper to `lib/utils.ts`.

### Phase 1 — Sprint 1.7: About MITSU & Contact (v0.8.0)

**Data Layer:**
- `src/data/about.ts` — platform identity content sourced from `01_PROJECT_IDENTITY.md`: introduction, Vision, Mission, motto, and the 8 Core Values presented as "Platform Goals". Deliberately kept distinct from `union.ts`'s `unionOverview` (Sprint 1.5), which describes the Student Union *organization*, not the *platform* — the two are different content, not duplicates of each other.
- `src/data/contact.ts` — office information (location/hours/email) and official communication channels (Microsoft Teams for advisors). President contact and official social links are **not** duplicated here — imported directly from `union.ts` (`president`, `unionSocialLinks`), keeping one source of truth per DATA_ARCHITECTURE.md.
  - Office location, hours, and a direct email address have not been provided by the Student Union. Rather than inventing plausible-looking details, these fields are left unset in the data and rendered as "Coming soon" by `ContactCard` — consistent with `00_PROJECT_RULES.md` #17/#27 ("never invent — mark for review").

**Feature Components:**
- `ContactCard.tsx` (components/shared) — generic icon+title+description(+optional link) card, reused for both office info and communication channels (receives pre-resolved strings, same pattern as `FooterLinkGroup` from Sprint 1.1, since it serves two unrelated data shapes).

**Section Components:**
- `AboutSection.tsx` — platform introduction, motto, and the 8 "Platform Goals" as a card grid.
- `VisionMissionSection.tsx` — Vision/Mission cards for the platform, visually consistent with `UnionHeroSection`'s Vision/Mission treatment (Sprint 1.5) but sourced from `about.ts`, not `union.ts`.
- `ContactSection.tsx` — office information, President contact (reuses `LeaderCard` + `president` directly — no duplicated component or data), and official communication channels.
- `SocialLinksSection.tsx` — reuses `unionSocialLinks` from `union.ts` directly (same links already shown on `/union`, not a second copy) and the existing `union.socialHeading`/`socialSubheading` translation keys.

**Routing:**
- `src/app/about/page.tsx` — new `/about` route (About → Vision/Mission). This folder didn't exist from Phase 0's original scaffold (only `/contact` did); created fresh.
- `src/app/contact/page.tsx` — new `/contact` route (Contact → Social Links).

**Localization:**
- Extended `en.json`/`ar.json` with new top-level `about` and `contact` sections, plus a new `nav.about` key.

**Required Connections (minimal, closely-related fixes — not scope creep):**
- Added `{ labelKey: "nav.about", href: "/about" }` to `data/navigation.ts` — without this, the new `/about` page would be unreachable from the Navbar/Footer (both already render whatever is in this data file; no component changes needed).
- Fixed the homepage's "About MITSU" Quick Access card (`data/home.ts`): its `href` was `/union`, a Sprint 1.2 placeholder standing in for a page that didn't exist yet. Now points to the real `/about` page — the same category of fix as the earlier WhatsApp URL bug.

**Verification:**
- `npm run lint` → passes, zero errors.
- `tsc --noEmit` → passes, zero TypeScript errors.
- `npm run build` → succeeds; `/about` and `/contact` now included as static routes alongside all 6 existing pages (8 total).

**Not Touched (Out of Scope):**
- Navbar.tsx, Footer.tsx, MobileMenu.tsx (components) — untouched; only their shared data source (`navigation.ts`) gained one entry.
- Theme system, Language system, Firebase, Admin Dashboard, AI — untouched/not introduced.

---

## Current Sprint

**Sprint 1.7: About MITSU & Contact** — CLOSED

Tasks completed:
- [x] `src/data/about.ts` — platform identity, vision, mission, 8 platform goals
- [x] `src/data/contact.ts` — office info (pending items marked, not invented), communication channels
- [x] `AboutSection.tsx`, `VisionMissionSection.tsx`
- [x] `ContactCard.tsx`, `ContactSection.tsx`, `SocialLinksSection.tsx`
- [x] `/about` and `/contact` page routes
- [x] EN localization (`about.*`, `contact.*`, `nav.about`)
- [x] AR localization (`about.*`, `contact.*`, `nav.about`)
- [x] Connected new pages into navigation and the homepage Quick Access card
- [x] Verification: lint passes, TypeScript passes, build succeeds (8 routes)
- [x] PROJECT_STATE.md updated
- [x] CHANGELOG.md updated
- [x] Git commit created
- [x] Project archive created

---

## Next Actions (Sprint 1.8+ — not yet scoped/approved)

Per `10_ROADMAP.md`, Sprint 1.8 (Platform Polish) is the next listed candidate:
- SEO / metadata refinement, performance optimization, accessibility audit, error pages, loading states, empty states, animation polish.

Beyond that, Phase 2 (Dynamic Platform / Firebase) and Phase 3 (Admin Dashboard) remain future work.

**Not yet started — awaiting explicit sprint scope approval before any implementation.**

---

## Outstanding Items / Blockers

- Official brand hex colors, campus/union hero/team photos still pending.
- MUSTER has no official web portal yet.
- Firebase project not created; all data remains local/static.
- All announcements/events content (Sprint 1.6) is sample/placeholder pending real submissions.
- **New this sprint:** Student Union office location, office hours, and a direct contact email have not been provided — currently shown as "Coming soon" on `/contact`. Needs real information before launch.
- Cleanup candidate (carried over): `src/data/committees.ts` + `src/types/committee.types.ts` (Phase 0 placeholders) remain unused by any component.
- Search/category filtering on `/announcements` remains UI-only (static), by design per Sprint 1.6 scope.

---

## File Summary

### New in Sprint 1.7

**Components (5 files):**
- `src/components/shared/ContactCard.tsx`
- `src/components/sections/AboutSection.tsx`
- `src/components/sections/VisionMissionSection.tsx`
- `src/components/sections/ContactSection.tsx`
- `src/components/sections/SocialLinksSection.tsx`

**Routes (2 files):**
- `src/app/about/page.tsx`
- `src/app/contact/page.tsx`

**Data (2 files):**
- `src/data/about.ts`
- `src/data/contact.ts`

### Modified in Sprint 1.7

- `src/locales/en.json` — added top-level `about`, `contact` sections + `nav.about`
- `src/locales/ar.json` — added top-level `about`, `contact` sections (Arabic) + `nav.about`
- `src/data/navigation.ts` — added About MITSU entry
- `src/data/home.ts` — fixed "About MITSU" quick access card href (`/union` → `/about`)

### Removed in Sprint 1.7

- `src/app/contact/.gitkeep` — superseded by real `page.tsx`

---

## Version History

See `CHANGELOG.md` for detailed change log by version.

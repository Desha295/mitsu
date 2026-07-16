# PROJECT_STATE.md

## MITSU

Tracks current progress, completed work, current sprint, and next actions.
Must be updated at the end of every sprint (00_PROJECT_RULES.md #22, #26).

---

## Current Status

**Phase:** Phase 1 — Core Platform
**Current Sprint:** Sprint 1.4 — Freshman Guide
**Status:** Complete
**Version:** v0.5.0

---

## Completed Work

### Phase 0 — Planning & Foundation (v0.1.0)

- Scaffolded Next.js 16 project (App Router, TypeScript, Tailwind CSS v4, ESLint).
- Design tokens, fonts (Inter/Cairo), theme + language systems with `localStorage` persistence.
- Firebase SDK skeleton and typed data stubs. Git repository initialized.

### Phase 1 — Sprint 1.1: Reusable Layout Foundation (v0.2.0)

- `IconButton.tsx`, `Container.tsx` — reusable primitives.
- `Navbar.tsx`, `NavLinks.tsx`, `MobileMenu.tsx` — global navigation with accessible mobile drawer.
- `Footer.tsx`, `FooterLinkGroup.tsx`, `FooterSocialLinks.tsx` — global footer.
- `Logo.tsx`, `ThemeSwitcher.tsx`, `LanguageSwitcher.tsx` — shared brand/utility components.

### Phase 1 — Sprint 1.2: Homepage Hero & Quick Access (v0.3.0)

- Official MITSU and MUST logos integrated into `public/images/`.
- `HeroSection.tsx`, `QuickAccessSection.tsx`, `QuickAccessCard.tsx`.
- `src/data/home.ts` — hero and quick access data. Homepage composed at `src/app/page.tsx`.

### Phase 1 — Sprint 1.3: University Systems Section (v0.4.0)

- Extended `UniversitySystem` type with category/required/translation-key fields.
- Populated `src/data/systems.ts` with 5 official systems (Banner, Smart Learning, MUSTER, Teams, Outlook).
- `SystemCard.tsx`, `SystemsSection.tsx`, `/systems` route.
- Required fixes to `Footer.tsx`/`FooterLinkGroup.tsx` for real URLs and external-link handling.

### Phase 1 — Sprint 1.4: Freshman Guide (v0.5.0)

**Data Layer:**
- `src/data/guide.ts` — 8 guide sections (Introduction, Registration Process, Academic Advisor, Credit Hour System, GPA Rules, Summer Registration, Overload Rules, Important Notes) with inline `GuideSection`/`GuideStat` types. Official academic rules used verbatim, not invented:
  - Total Credit Hours = 140 (Year 1–3: 36 each, Year 4: 32, Summer: 9, Graduation Summer: 12).
  - First semester registration performed by Academic Advisor.
  - Academic Advisors communicate only through Microsoft Teams.
  - GPA below 2.0 → 14 hours (up to 15 with advisor approval).
  - Overload allowed only for CGPA above 3.0.
- `src/data/studyPlans.ts` — 4 official study plans (General, Computer Science, Artificial Intelligence, Information Systems) with inline `StudyPlan` type, including exact intrinsic image dimensions for correct `next/image` usage.

**Brand/Reference Assets:**
- `public/images/study-plans/` — 4 official study plan images (general-major.png, computer-science-major.png, artificial-intelligence-major.png, information-systems-major.png). Copied as-is; contents never extracted, OCR'd, or summarized, per explicit instruction — displayed as reference images only.

**Feature Components:**
- `GuideCard.tsx` (components/shared) — step-numbered card with icon, title, description, expandable "Learn more" panel showing fact bullets and/or stat chips. `highlight` variant for Important Notes (secondary/green styling, per "important notes should be highlighted").
- `StudyPlanCard.tsx` (components/shared) — thumbnail preview + "View Full Size" trigger opening a self-contained accessible full-screen viewer (focus management, Escape-to-close, scroll lock, focus-return-to-trigger — same conventions as Sprint 1.1's MobileMenu).

**Section Components:**
- `FreshmanGuideSection.tsx` (components/sections) — renders guide steps as a numbered card list, step-by-step onboarding feel.
- `StudyPlansSection.tsx` (components/sections) — responsive grid (1/2/4 columns) of study plan cards.

**Routing:**
- `src/app/guide/page.tsx` — new `/guide` route composing FreshmanGuideSection + StudyPlansSection.

**Localization:**
- Extended `src/locales/en.json` and `ar.json` with top-level `guide` and `studyPlans` sections: all 8 guide topics (titles, descriptions, facts, stat labels), study plan names/alt text, and UI labels (Learn more, Show less, View Full Size, Close).

**Verification:**
- `npm run lint` → 1 warning found and fixed (react-hooks/exhaustive-deps ref-in-cleanup issue in StudyPlanCard), then passes with zero errors/warnings.
- `tsc --noEmit` → passes, zero TypeScript errors.
- `npm run build` → succeeds; `/guide` now included as a static route alongside `/` and `/systems`.

**Architecture Decisions:**
- Types for `GuideSection`/`GuideStat`/`StudyPlan` defined inline within their respective data files (`guide.ts`, `studyPlans.ts`) rather than separate `src/types/*.types.ts` files — deliberate deviation from the Sprint 1.1–1.3 convention, to strictly match the sprint's explicit approved file list ("no architecture changes" + a closed "Create:" list that didn't include new type files).
- "Learn more" expandable panel (GuideCard) reuses the same inline-disclosure pattern established by SystemCard's "How to Use" toggle — no new disclosure component needed.
- Full-size image viewer (StudyPlanCard) is self-contained rather than extracted into a shared `ImageLightbox` component, again to respect the sprint's closed file list; the accessible-dialog conventions (focus management, Escape, scroll lock) mirror MobileMenu's existing pattern for consistency.
- Both thumbnail and full-size views use `next/image` (never plain `<img>`), per 05_ARCHITECTURE.md #14 — full-size view uses each image's real intrinsic width/height (stored in data) rather than `fill`, since exact aspect ratios differ slightly per image.
- Study plan images are never analyzed, OCR'd, or have their contents summarized anywhere in the implementation — treated strictly as opaque reference images per explicit instruction.

---

## Current Sprint

**Sprint 1.4: Freshman Guide** — CLOSED

Tasks completed:
- [x] src/data/guide.ts (8 sections, official academic rules)
- [x] src/data/studyPlans.ts (4 official study plans)
- [x] Study plan images placed in public/images/study-plans/
- [x] GuideCard component (expandable, highlight variant)
- [x] StudyPlanCard component (thumbnail + accessible full-size viewer)
- [x] FreshmanGuideSection component
- [x] StudyPlansSection component
- [x] /guide page route
- [x] EN localization (guide.* and studyPlans.* keys)
- [x] AR localization (guide.* and studyPlans.* keys)
- [x] Verification: lint (1 warning fixed), TypeScript passes, build succeeds
- [x] PROJECT_STATE.md updated
- [x] CHANGELOG.md updated
- [x] Git commit created
- [x] Project archive created

---

## Next Actions (Sprint 1.5 — not yet scoped/approved)

Per `PROJECT_STATE.md` (project-level) and `10_ROADMAP.md`:
- Sprint 1.5 — Student Union (About, Leadership, Committees).

**Not yet started — awaiting explicit sprint scope approval before any implementation.**

---

## Outstanding Items / Blockers

- Official brand hex colors not yet provided (using placeholder Blue/Green).
- Official campus photo not yet provided (using SVG placeholder from Sprint 1.2).
- Official per-system logos not provided (using generic Lucide icons, Sprint 1.3).
- MUSTER has no official web portal yet.
- Firebase project not created; `.env.local` not populated; all data remains local/static.
- `CHANGE_POLICY.md` and `AI_INSTRUCTIONS.md` are not currently present as standalone files in the project mount (only referenced from earlier in the working session) — flagged for visibility, not blocking.

---

## File Summary

### New in Sprint 1.4

**Components (4 files):**
- `src/components/shared/GuideCard.tsx`
- `src/components/shared/StudyPlanCard.tsx`
- `src/components/sections/FreshmanGuideSection.tsx`
- `src/components/sections/StudyPlansSection.tsx`

**Data (2 files):**
- `src/data/guide.ts`
- `src/data/studyPlans.ts`

**Routes (1 file):**
- `src/app/guide/page.tsx`

**Assets (4 files):**
- `public/images/study-plans/general-major.png`
- `public/images/study-plans/computer-science-major.png`
- `public/images/study-plans/artificial-intelligence-major.png`
- `public/images/study-plans/information-systems-major.png`

### Modified in Sprint 1.4

- `src/locales/en.json` — added top-level `guide` and `studyPlans` sections
- `src/locales/ar.json` — added top-level `guide` and `studyPlans` sections (Arabic)

### Removed in Sprint 1.4

- `src/app/guide/.gitkeep` — no longer needed, folder now has a real page.tsx

---

## Version History

See `CHANGELOG.md` for detailed change log by version.

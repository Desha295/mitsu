# PROJECT_STATE.md

## MITSU

Tracks current progress, completed work, current sprint, and next actions.
Must be updated at the end of every sprint (00_PROJECT_RULES.md #22, #26).

---

## Current Status

**Phase:** Phase 1 — Core Platform
**Current Sprint:** Sprint 1.3 — University Systems Section
**Status:** Complete
**Version:** v0.4.0

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
- Extended `globals.css`, `lib/utils.ts`, locale files, `context/Providers.tsx`.

### Phase 1 — Sprint 1.2: Homepage Hero & Quick Access (v0.3.0)

- Official MITSU and MUST logos integrated into `public/images/`.
- `HeroSection.tsx`, `QuickAccessSection.tsx`, `QuickAccessCard.tsx`.
- `src/data/home.ts` — hero and quick access data.
- Homepage composed: `src/app/page.tsx` = Hero + QuickAccess.
- Full EN/AR localization for homepage content.

### Phase 1 — Sprint 1.3: University Systems Section (v0.4.0)

**Type System:**
- Extended `src/types/system.types.ts`: added `SystemCategory` type (`academic` | `student-services` | `communication`), `required: boolean`, and converted `name`/`description`/`instructions` from raw strings to translation-key fields (`nameKey`/`descriptionKey`/`instructionsKey`) — consistent with the pattern already used in `data/navigation.ts` and `data/home.ts`.

**Data Layer:**
- Populated `src/data/systems.ts` with 5 official university systems using real data provided by the Student Union:
  - Banner (academic, required) — course registration, schedules, records.
  - Smart Learning (academic, required) — course materials, assignments, quizzes.
  - MUSTER (student-services, required) — mobile app only, no official web portal yet (`officialUrl: ""`).
  - Microsoft Teams (communication, required) — lectures, academic advisor communication.
  - Outlook (communication, required) — official university email.
- Added `PASSWORD_RESET_URL` export (Microsoft account password reset) — relevant to Teams/Outlook/MUSTER sign-in.
- All official URLs sourced directly from Student Union-provided data — none invented.

**Feature Components:**
- `SystemCard.tsx` (components/shared) — icon, name, category label, required badge, description, "Open" button (external link, new tab) or "Coming soon" placeholder when no URL, and a "How to Use" toggle revealing inline instructions (accessible via aria-expanded/aria-controls, no modal needed).

**Section Components:**
- `SystemsSection.tsx` (components/sections) — renders active systems in a responsive grid (1/2/3 columns), plus a password-reset note at the bottom.

**Routing:**
- `src/app/systems/page.tsx` — new /systems route composing SystemsSection. Navbar/Footer inherited from root layout.

**Localization:**
- Extended `src/locales/en.json` and `ar.json` with a new top-level `systems` section: heading/subheading, button labels, category labels, password reset copy, and per-system name/description/instructions for all 5 systems (Arabic translations for descriptions/instructions; system names kept in Latin script as proper nouns, consistent with brand name handling).
- Added `common.opensInNewTab` key (accessibility: signals external links to screen reader users).

**Required Fixes to Sprint 1.1 Components (dependency updates, not redesigns):**
- `Footer.tsx` — updated to call `translate(s.nameKey)` instead of the now-removed `s.name`, and to use the real `s.officialUrl` instead of a hardcoded empty string, now that Sprint 1.3 populated real URLs.
- `FooterLinkGroup.tsx` — added external-URL detection (`href.startsWith("http")`) so real system links (e.g. `https://register.must.edu.eg/...`) open in a new tab via a plain `<a target="_blank">`, while internal paths continue using `next/link`. This edge case was never exercised before Sprint 1.3 since all prior links were either internal or empty placeholders.

**Verification:**
- `npm run lint` → passes, zero errors.
- `tsc --noEmit` → passes, zero TypeScript errors.
- `npm run build` → succeeds; `/systems` now included as a static route alongside `/`.

**Architecture Decisions:**
- Translation-key pattern extended to `systems.ts` for consistency with `navigation.ts`/`home.ts` — all display text resolved via `translate()`, zero hardcoded content.
- Category badge and required badge included in `SystemCard` even though not explicitly listed in the sprint's minimum card spec, since the Student Union explicitly supplied this data — small, low-risk additions that reflect provided data.
- Instructions shown as inline expandable panel (not a modal) to avoid focus-trap complexity while remaining fully keyboard accessible.
- Icons are generic Lucide icons (ClipboardList, BookOpen, Smartphone, Video, Mail) — placeholders until official per-system logos are provided (no brand icons exist in Lucide, consistent with the Sprint 1.1 Footer social-icon decision).
- MUSTER's empty `officialUrl` renders as a "Coming soon" placeholder in both `SystemCard` and `Footer`, consistent with the "no broken links" trust principle (03_UI_UX_GUIDELINES.md).

---

## Current Sprint

**Sprint 1.3: University Systems Section** — CLOSED

Tasks completed:
- [x] Extend UniversitySystem type (category, required, translation keys)
- [x] Populate systems.ts with official Student Union data (5 systems + password reset URL)
- [x] SystemCard component (icon, name, category, required badge, description, Open/How to Use)
- [x] SystemsSection component (responsive grid + password reset note)
- [x] /systems page route
- [x] EN localization (systems.* keys)
- [x] AR localization (systems.* keys)
- [x] Required Footer.tsx fix (nameKey + real officialUrl)
- [x] Required FooterLinkGroup.tsx fix (external link handling)
- [x] Verification: lint passes, TypeScript passes, build succeeds
- [x] PROJECT_STATE.md updated
- [x] CHANGELOG.md updated
- [x] Git commit created
- [x] Project archive created

---

## Next Actions (Sprint 1.4 — not yet scoped/approved)

Per `10_ROADMAP.md` Phase 1/Phase 2, likely candidates for a future sprint:
- Freshman Guide section (orientation journey, step-by-step onboarding).
- Student Union section (About, Leadership, Committees).
- Announcements section (placeholder until Firebase Phase 4).
- Contact page.

**Not yet started — awaiting explicit sprint scope approval before any implementation.**

---

## Outstanding Items / Blockers

- Official brand hex colors not yet provided (using placeholder Blue/Green).
- Official campus photo not yet provided (using SVG placeholder from Sprint 1.2).
- Official per-system logos (Banner/Smart Learning/MUSTER/Teams/Outlook) not provided — using generic Lucide icons.
- MUSTER has no official web portal yet — "Open" button shows "Coming soon" until one exists.
- Firebase project not created; `.env.local` not populated; all data remains local/static.

---

## File Summary

### New in Sprint 1.3

**Components (2 files):**
- `src/components/shared/SystemCard.tsx`
- `src/components/sections/SystemsSection.tsx`

**Routes (1 file):**
- `src/app/systems/page.tsx`

### Modified in Sprint 1.3

- `src/types/system.types.ts` — added SystemCategory type, required field, translation-key fields
- `src/data/systems.ts` — populated with official 5-system data + PASSWORD_RESET_URL
- `src/locales/en.json` — added top-level `systems` section + `common.opensInNewTab`
- `src/locales/ar.json` — added top-level `systems` section (Arabic) + `common.opensInNewTab`
- `src/components/layout/Footer.tsx` — required fix: nameKey + real officialUrl
- `src/components/layout/FooterLinkGroup.tsx` — required fix: external link handling

### Removed in Sprint 1.3

- `src/app/systems/.gitkeep` — no longer needed, folder now has a real page.tsx

---

## Version History

See `CHANGELOG.md` for detailed change log by version.

# CHANGELOG.md

## MITSU

All notable changes to this project are documented in this file, grouped by version.

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

Sprint 1.7 — scope not yet defined/approved (see `PROJECT_STATE.md` Next Actions for candidates).

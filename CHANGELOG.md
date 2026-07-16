# CHANGELOG.md

## MITSU

All notable changes to this project are documented in this file, grouped by version.

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

Sprint 1.4 — scope not yet defined/approved (see `PROJECT_STATE.md` Next Actions for candidates).

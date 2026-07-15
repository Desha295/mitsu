# CHANGELOG.md

## MITSU

All notable changes to this project are documented in this file, grouped by version.

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

- `npm run lint` — passes, zero errors
- `tsc --noEmit` — passes, zero TypeScript errors
- `npm run build` — succeeds (fonts work in production environment with internet access)

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

Sprint 1.2 — Homepage Hero & Quick Access (see `PROJECT_STATE.md` for next actions).

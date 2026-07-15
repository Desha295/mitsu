# PROJECT_STATE.md

## MITSU

Tracks current progress, completed work, current sprint, and next actions.
Must be updated at the end of every sprint (00_PROJECT_RULES.md #22, #26).

---

## Current Status

**Phase:** Phase 1 — Core Platform
**Current Sprint:** Sprint 1.1 — Reusable Layout Foundation
**Status:** Complete
**Version:** v0.2.0

---

## Completed Work

### Phase 0 — Planning & Foundation (v0.1.0)

- Scaffolded Next.js 16 project (App Router, TypeScript, Tailwind CSS v4, ESLint, `src/` directory).
- Configured design tokens (colors, spacing, radius, breakpoints, overlay) in `src/app/globals.css` using Tailwind v4's CSS-first `@theme` config.
- Wired Inter (Latin) and Cairo (Arabic) fonts via `next/font/google`.
- Built full folder skeleton per `05_ARCHITECTURE.md`.
- Implemented theme system: `ThemeContext` + `useTheme` hook, React Context + `localStorage`, no external library, using `useSyncExternalStore`.
- Implemented language system: `LanguageContext` + `useLanguage` hook with `translate(key)` utility, RTL/LTR switching.
- Added Firebase SDK skeleton and typed data stubs.
- Initialized Git repository.

### Phase 1 — Sprint 1.1: Reusable Layout Foundation (v0.2.0)

**UI Components:**
- `IconButton.tsx` — icon-only button with required accessible label.

**Layout Components:**
- `Container.tsx` — responsive max-width 1200px, centered, mobile-safe padding (per 04_DESIGN_SYSTEM.md #8).
- `Navbar.tsx` — global header with Logo, navigation links (desktop + mobile hamburger), theme/language switchers, skip-to-content link.
- `NavLinks.tsx` — reusable navigation list (horizontal/vertical) reading from data/navigation.ts, no hardcoded links.
- `MobileMenu.tsx` — accessible mobile navigation drawer with focus management, Escape-to-close, scroll lock, fade/slide animations, respecting prefers-reduced-motion.
- `Footer.tsx` — global footer with branding, quick links, university systems directory, social placeholders, copyright.
- `FooterLinkGroup.tsx` — reusable footer column for both real links and "coming soon" placeholders.
- `FooterSocialLinks.tsx` — social icons display (placeholder disabled buttons until Firebase content available).

**Shared Components:**
- `Logo.tsx` — MITSU wordmark with optional identity line, reused by Navbar and Footer.
- `ThemeSwitcher.tsx` — Moon/Sun icon toggle, accessible label names next action.
- `LanguageSwitcher.tsx` — language toggle button with visible text label (EN/AR).

**Data & Types:**
- `src/types/social.types.ts` — SocialLink type definition.
- `src/data/socialLinks.ts` — placeholder social entries (href empty until Firebase Phase 4).

**Styling & Infrastructure:**
- Extended `src/app/globals.css`:
  - Added `--overlay` semantic token (light/dark variants).
  - Added fade/slide-down animation keyframes (200ms, respecting prefers-reduced-motion).
  - Added `animate-fade-slide-down`, `animate-fade-in` utility classes.
- Extended `src/lib/utils.ts` with `focusRing` constant (keyboard focus styling).
- Extended `src/locales/en.json` and `ar.json` with navbar, language, footer translation keys.
- Updated `src/context/Providers.tsx` to include `<Navbar>`, `<Footer>`, and main content region.

**Verification:**
- `npm run lint` → passes, zero errors.
- `tsc --noEmit` → passes, zero TypeScript errors.
- `npm run build` → succeeds (fonts temporarily stubbed in sandbox; restore production code includes real font imports).

**Architecture Decisions:**
- Single-responsibility components: `NavLinks` doesn't include nav landmark, leaving that to Navbar and MobileMenu for proper ARIA semantics.
- Reusable Logo to avoid duplication (07_COMPONENT_RULES.md).
- FooterLinkGroup handles both real links (Quick Links) and placeholders (University Systems) with same component (13_CHANGE_POLICY.md "avoid duplicated components").
- MobileMenu only mounts when open (not hidden), so desktop nav never duplicates in accessibility tree.
- Shared focus-ring constant (focusRing) ensures consistent keyboard navigation across all interactive elements.
- All navigation data read from data files, zero hardcoded links (Sprint 1.1 requirement).

---

## Current Sprint

**Sprint 1.1: Reusable Layout Foundation** — CLOSED

Tasks completed:
- [x] Global page container (Container.tsx)
- [x] Responsive layout (CSS via Tailwind, mobile-first design)
- [x] Navbar (desktop + mobile with hamburger menu)
- [x] Footer (branding, links, social placeholders)
- [x] Mobile Navigation (MobileMenu.tsx with focus management, animations)
- [x] Verification: lint passes, build passes
- [x] PROJECT_STATE.md updated
- [x] CHANGELOG.md updated

---

## Next Actions (Sprint 1.2: Homepage Hero & Quick Access)

Per `10_ROADMAP.md` Phase 1:

**Sprint 1.2 tasks:**
- [ ] Build `HeroSection` (`components/sections`) with MITSU identity, campus image placeholder, welcome message, primary actions (Join Community / Explore Guide).
- [ ] Build `QuickAccessSection` cards (WhatsApp, MUSTER, Banner, Smart Learning, Teams, Outlook) using `data/systems.ts`.
- [ ] Build simplified `AnnouncementSection` (placeholder — real Firebase content out of scope).
- [ ] Replace placeholder `src/app/page.tsx` with the real Phase 1 homepage composed of the above sections.
- [ ] Add section-specific translation keys to `locales/en.json` / `ar.json`.
- [ ] Verify: lint, build, responsive on mobile/tablet/desktop.

---

## Outstanding Items / Blockers

- Official brand hex colors not yet provided (using placeholder Blue/Green).
- Official logos and campus images not yet provided (using placeholders per Brand Guidelines).
- No Firebase project created yet — `.env.local` not populated; app runs on placeholder/local data only.
- Real copy for Announcements, Freshman Guide, Committees, Leadership pending (Phase 2+ scope).

---

## File Summary

### New in Sprint 1.1

**Components (11 files):**
- `src/components/ui/IconButton.tsx`
- `src/components/layout/Container.tsx`
- `src/components/layout/Navbar.tsx`
- `src/components/layout/NavLinks.tsx`
- `src/components/layout/MobileMenu.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/FooterLinkGroup.tsx`
- `src/components/layout/FooterSocialLinks.tsx`
- `src/components/shared/Logo.tsx`
- `src/components/shared/ThemeSwitcher.tsx`
- `src/components/shared/LanguageSwitcher.tsx`

**Types & Data (2 files):**
- `src/types/social.types.ts`
- `src/data/socialLinks.ts`

### Modified in Sprint 1.1

- `src/lib/utils.ts` — added `focusRing` constant
- `src/app/globals.css` — added overlay token, animations, keyframes
- `src/locales/en.json` — added navbar, language, footer keys
- `src/locales/ar.json` — added navbar, language, footer keys
- `src/context/Providers.tsx` — wrapped children with Navbar/Footer layout

---

## Version History

See `CHANGELOG.md` for detailed change log by version.

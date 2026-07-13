# PROJECT_STATE.md

## MITSU

Tracks current progress, completed work, current sprint, and next actions.
Must be updated at the end of every sprint (00_PROJECT_RULES.md #22, #26).

---

## Current Status

**Phase:** Phase 0 — Planning & Foundation
**Status:** Complete
**Version:** v0.1.0

---

## Completed Work

### Phase 0 — Planning & Foundation

- Scaffolded Next.js 16 project (App Router, TypeScript, Tailwind CSS v4, ESLint, `src/` directory).
- Configured design tokens (colors, spacing, radius, breakpoints) in `src/app/globals.css` using Tailwind v4's CSS-first `@theme` config, sourced from `04_DESIGN_SYSTEM.md`.
  - **Note:** exact brand hex codes were not provided; placeholder Blue/Green values are in use pending official brand colors.
- Wired Inter (Latin) and Cairo (Arabic) fonts via `next/font/google` in the root layout.
- Built the full folder skeleton per `05_ARCHITECTURE.md` (`components/{ui,layout,sections,shared}`, `data/`, `hooks/`, `lib/`, `context/`, `types/`, `constants/`, `locales/`, and all route folders including reserved ones for later phases).
- Implemented the theme system: `ThemeContext` + `useTheme` hook, React Context + `localStorage` persistence, no external library, using `useSyncExternalStore` (no cascading-render lint issues).
- Implemented the language system: `LanguageContext` + `useLanguage` hook, same pattern, plus a `translate(key, fallback)` utility (`src/lib/translate.ts`) resolving dot-notation keys against `locales/en.json` / `locales/ar.json`. RTL/LTR and `lang`/`dir` attributes switch automatically.
- Added Firebase SDK skeleton (`src/lib/firebase.ts`) that reads config from environment variables and safely no-ops (rather than throwing) until a real Firebase project exists.
- Added typed data stubs (`data/systems.ts`, `data/committees.ts`, `data/navigation.ts`) matching the Firestore schema shapes in `06_FIREBASE_SCHEMA.md`, populated with placeholder content only.
- Added `.env.local.example` with placeholder Firebase config keys (no real credentials).
- Created a minimal placeholder home page (`src/app/page.tsx`) verifying theme toggle, language toggle, and design tokens end-to-end. This is **not** the real Phase 1 Hero/QuickAccess/Announcements homepage.
- Initialized Git repository with an initial commit.
- Verified: `tsc --noEmit` passes, `npm run lint` passes, `npm run build` succeeds (see note below on font fetching).

**Known environment note:** in the sandboxed build/dev environment used to generate this scaffold, `next/font/google` could not reach `fonts.googleapis.com` (network restricted in that sandbox only). The build was verified successfully with fonts temporarily stubbed out, confirming everything else compiles; the real `Inter`/`Cairo` font code is in place and will fetch normally in any environment with standard internet access (local dev machine, CI, Vercel).

---

## Current Sprint

Phase 0 — Planning & Foundation (this sprint). Closed.

---

## Next Actions (Phase 1 — Core Platform)

Per `10_ROADMAP.md` Phase 1:

- [ ] Build `Navbar`, `Footer`, and mobile hamburger menu (`components/layout`).
- [ ] Build `HeroSection` (`components/sections`) with MITSU identity, university branding, and primary actions (Join Community / Explore Guide).
- [ ] Build `QuickAccessSection` cards (WhatsApp, MUSTER, Banner, Smart Learning, Teams, Outlook) using `data/systems.ts` shape.
- [ ] Wire language switcher and theme switcher into the real Navbar (currently only proven on the placeholder page).
- [ ] Replace placeholder `src/app/page.tsx` with the real Phase 1 homepage composed of the above sections.
- [ ] Populate real translation content in `locales/en.json` / `ar.json` beyond the current placeholder keys.

---

## Outstanding Items / Blockers

- Official brand hex colors not yet provided (using placeholder Blue/Green).
- Official logos and campus images not yet provided (using placeholders per Brand Guidelines).
- No Firebase project created yet — `.env.local` is not populated; app runs on placeholder/local data only.
- Real copy for Freshman Guide, Systems, Committees, Leadership, FAQ pending (to be provided section by section per user instruction).

---

## Version History

See `CHANGELOG.md` for versioned changes.

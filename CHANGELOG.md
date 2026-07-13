# CHANGELOG.md

## MITSU

All notable changes to this project are documented in this file, grouped by version.

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

Phase 1 — Core Platform (see `PROJECT_STATE.md` for next actions).

# MITSU

**MUST Information Technology Student Union** — the official digital platform for the Faculty of Information Technology Student Union at Misr University for Science and Technology (MUST).

> One Platform. One Community. One Trusted Start.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4 (CSS-first `@theme` tokens in `src/app/globals.css`)
- Firebase (Firestore, Storage, Authentication)
- Deployed on Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Setup

Copy `.env.local.example` to `.env.local` and fill in Firebase project credentials once a project exists:

```bash
cp .env.local.example .env.local
```

Until then, the app runs fine on placeholder/local data — Firebase calls are inert (see `src/lib/firebase.ts`).

## Project Documentation

Full project specification, architecture, design system, and rules live in the project's planning documents (`00_PROJECT_RULES.md` through `10_ROADMAP.md`). `PROJECT_STATE.md` tracks current progress and next actions; `CHANGELOG.md` tracks versioned changes.

## Folder Structure

See `05_ARCHITECTURE.md` for the full rationale. Summary:

```
src/
├── app/          Routes (App Router)
├── components/   ui / layout / sections / shared
├── data/         Typed placeholder/config data
├── hooks/        useTheme, useLanguage
├── lib/          firebase.ts, translate.ts, utils.ts
├── context/      ThemeContext, LanguageContext, Providers
├── types/        Shared TypeScript interfaces
├── constants/    Brand tokens
└── locales/      en.json, ar.json
```

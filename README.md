# MITSU

**MUST Information Technology Student Union** — the official digital platform for the Faculty of Information Technology Student Union at Misr University for Science and Technology (MUST).

> One Platform. One Community. One Trusted Start.

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4 (CSS-first `@theme` tokens in `src/app/globals.css`)
- Firebase (Firestore, Storage, Authentication)
- Firebase Cloud Messaging (web push notifications)
- Deployed on Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Setup

Copy `.env.local.example` to `.env.local` and fill in the required values:

```bash
cp .env.local.example .env.local
```

Until then, the app runs fine on placeholder/local data — Firebase calls are inert (see `src/lib/firebase.ts`).

### Web push notifications (FCM)

Device push is optional and does not replace the Firestore notification center. To enable it:

1. In Firebase Console, open **Project settings → Cloud Messaging → Web configuration**, generate a Web Push certificate key pair, and copy the public VAPID key.
2. In Firebase Authentication, enable the **Anonymous** provider so visitors without an account can register a device. Existing signed-in users use their current Firebase identity.
3. Confirm the **Firebase Cloud Messaging API** and **FCM Registration API** are enabled for the same Firebase project.
4. Set `NEXT_PUBLIC_FIREBASE_VAPID_KEY` to the public VAPID key in local `.env.local` and in Vercel **Settings → Environment Variables** for Production and Preview. Keep the existing `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, and `FIREBASE_ADMIN_PRIVATE_KEY` server-only in Vercel; the service account must be authorized to send FCM messages.
5. Deploy the updated `firestore.rules` and redeploy the app so the worker and new API routes are live on HTTPS.

On iPhone/iPad, Web Push requires iOS/iPadOS 16.4 or later and the site must be added to the Home Screen before permission can be requested. Notification support also varies by browser; unsupported browsers continue to use the in-site Firestore notification center.

### Production contact form (Vercel)

`.env.local` is intentionally local-only and is never deployed. In the Vercel project, add the following variables under **Settings → Environment Variables**, selecting the **Production** environment, then deploy again:

```txt
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=MITSU <contact@your-verified-domain.com>
RESEND_TO_EMAIL=your-inbox@example.com
```

Keep `RESEND_API_KEY` server-only: do **not** rename it with a `NEXT_PUBLIC_` prefix. The sender address must use a domain verified in [Resend](https://resend.com/domains). Add the same variables to Preview if you want the contact form to work on preview deployments.

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

# CURRENT_SPRINT.md

## MITSU

Tracks the currently active sprint. Companion to `PROJECT_STATE.md` (full
history) and `CHANGELOG.md` (versioned change log).

---

**Version:** v0.24.0
**Current Phase:** Phase 5 — Site Settings Foundation (complete) / Phase 6 — TBD
**Current Sprint:** Sprint 6 — TBD (scope needs explicit confirmation)
**Status:** NOT YET SCOPED

---

## Previous Sprint (Completed)

**Sprint 5.0 — Site Settings Foundation** ✅ COMPLETE (v0.24.0)

Built the first singleton-document admin CRUD page (`/settings/general`) — the architectural piece Sprint 4's own backlog had flagged as needed. New `createFirestoreDocService` factory (parallel to `createFirestoreService`, using `setDoc(..., { merge: true })` so there's no separate create/update path for a singleton document) backs the new `settingsService`; a new `useFirestoreDoc` hook (singleton-doc counterpart to `useFirestoreList`) lets public sections read it. `SettingsDoc` was extended additively with `contactEmail?`/`contactPhone?`/`officeLocation?` — safe, since no admin page or public consumer existed for this collection before this sprint.

The new admin Settings page is simpler than every other admin page: one document, one form, one save handler, no list/create/delete, and deliberately **no `ConfirmDialog`** (nothing to ever delete). `adminNavigation.ts`'s Settings entry — dangling since Sprint 3 — is now implemented.

Three public consumers were wired to Settings, each a deliberately scoped change: `FooterSocialLinks.tsx` (WhatsApp/Facebook/Instagram), `Logo.tsx` (site name, using a flicker-safe instant-default pattern since it's universal above-the-fold chrome), and `ContactSection.tsx` (office location/email, "Coming soon" fallback preserved exactly). Explicitly **not** touched, by design: any image-logo UI (schema/admin-form fields exist, but no public `<img>` consumer to replace), page `<title>`/metadata exports (still the static `BRAND_NAME` constant — converting to async `generateMetadata()` was out of scope), a new phone UI card (no existing slot to replace), and the Union page's separate `unionSocialLinks` block (not what was asked for — "Footer social links" specifically).

Between Sprint 4 and this sprint, a separate infrastructure fix was made and is now finalized alongside it: every public section combining a `filters` equality clause with `orderByField` on a different field was failing at runtime once real Firestore data existed, because no composite index had ever been defined for the project. Root cause was confirmed via actual runtime execution of the real Firestore SDK (not inference) and a full re-trace confirming no code layer swallows errors. Fix: `firestore.indexes.json` (7 composite indexes) and `firebase.json` (didn't exist before). No query, hook, or service code changed. Requires `firebase deploy --only firestore:indexes` against a real project to take effect.

See `CHANGELOG.md` v0.24.0 and `PROJECT_STATE.md`'s Phase 5 entry for full detail.

---

## Current Sprint Scope (pending approval)

Carried forward, unchanged, from the pre-Sprint-5 backlog (Site Settings itself is now done):

1. **Contact / About Management** — no existing collection, schema, or
   service at all for the remaining content (office location/email are
   now Settings-driven; the rest of both pages is still
   translation-key driven). Raises an unresolved
   bilingual-content-in-Firestore question. High complexity — needs
   its own scoping conversation.
2. **Security Foundation** (original Sprint 2.10) — Firestore/Storage
   rules hardening and permission review across all collections.
   Medium complexity, best done as its own dedicated pass.
3. **Student Union remainder** (Vision/Mission/Social Media) — still
   unaddressed; no confirmed schema or collection.
4. **"External Links"** (original Sprint 2.9 remainder) — may already
   be partially covered by Documents' `fileUrl`; needs confirmation.

Carried forward from Sprint 4:

5. **Retire the three temporary compatibility layers** — add
   `category`/`required` to `SystemDoc`, `icon` to `CommitteeDoc`,
   `socialLinks` to `LeadershipDoc`; update the corresponding admin
   forms; remove each static overlay.
6. **Study Plans / Documents content model** — decide whether to
   extend `DocumentResourceDoc` with image/dimension fields, or rework
   the public section into a PDF/download list backed by
   `documentsService` as-is.
7. **Bilingual Firestore content** — every collection (including
   Settings, as of this sprint) stores single-language strings only; a
   future sprint needs to decide and implement the bilingual field
   strategy.

New follow-ups from Sprint 5.0:

8. **Image logo wiring** — `logoUrl`/`universityLogoUrl`/`campusImageUrl`
   have no public `<img>` consumer yet.
9. **Dynamic page metadata** — page titles still use the static
   `BRAND_NAME` constant, not Settings.
10. **Deploy the Firestore composite indexes** and confirm the Site
    Settings rule coverage once a real Firebase project is connected.

**Not yet approved or started — do not implement until explicitly scoped.**

---

See `PROJECT_STATE.md` for full sprint history and `CHANGELOG.md` for
detailed per-version changes.

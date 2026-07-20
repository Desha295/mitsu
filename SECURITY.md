# SECURITY.md

## MITSU — Security Foundation

Documents the authorization model built in Sprint 2.3. This is
infrastructure only: no login page or admin dashboard exists yet to
exercise it (see `CURRENT_SPRINT.md`'s Out of Scope list). This document
explains what was built and how a future sprint should use it.

---

## Role Model

Two roles, matching `AdminDoc.role` in `src/lib/firebase/collections.ts`
(Sprint 2.1) and `06_FIREBASE_SCHEMA.md` #12:

| Role | Can manage content | Can manage other admins |
|---|---|---|
| `admin` | Yes (announcements, events, systems, union, guide, homepage, settings) | No |
| `super_admin` | Yes (everything `admin` can) | Yes |

Defined in `src/lib/auth/constants.ts` (`ROLES`), with helpers in
`src/lib/auth/roles.ts` (`isValidRole`, `roleMeetsMinimum`, `isSuperAdmin`).

## Permission Model

Permissions are named per content area (`src/lib/auth/constants.ts`'s
`PERMISSIONS`), mapped to roles via `ROLE_PERMISSIONS`. Check permissions
with `hasPermission(role, permission)` (`src/lib/auth/permissions.ts`) —
never check `role === "super_admin"` directly in future feature code;
always go through a named permission so the mapping stays centralized
and easy to audit.

## Becoming an Admin

There is no self-service sign-up. An admin is created by manually adding
a document to Firestore's `/admins/{uid}` collection (matching `AdminDoc`:
`email`, `role`, `createdAt`) — `uid` must match the person's Firebase
Auth UID. This is a deliberate manual step; automating it is out of
scope until an admin dashboard exists.

## How Admin Status Is Resolved

```
Firebase Auth (signed in?) → src/lib/auth/session.ts
                ↓
/admins/{uid} lookup        → src/lib/auth/adminAuth.ts (getAdminForUser)
                ↓
AuthenticatedAdmin | null    → src/lib/auth/routeGuard.ts (useAuthGuard hook)
```

A future admin dashboard's protected layout would call `useAuthGuard()`
and redirect to a (not-yet-built) login page if `admin` is `null`.

## Firestore Rules (`firestore.rules`)

- Every public content collection (announcements, events, systems,
  committees, leadership, documents, hero, homepage, guide) is readable
  by anyone when `isPublished`/`isActive` is `true`, or by any signed-in
  admin regardless of that flag (so admins can preview unpublished
  drafts). Writes require `isAdmin()`.
- `/settings/general` is always publicly readable (site-wide config, no
  publish flag) and admin-writable.
- `/admins/{uid}` — a user may read their own document (required for the
  `isAdmin()` check itself to work) or any document if they're a
  `super_admin`. Only `super_admin`s may write to this collection —
  granting/revoking admin access is a deliberately higher bar than
  managing content.
- Everything not explicitly matched is denied by default.

## Storage Rules (`storage.rules`)

- `/images/**` — publicly readable; admin-writable up to 5MB, JPEG/PNG/
  WebP/SVG only.
- `/documents/**` — publicly readable; admin-writable up to 10MB.
- Admin status is resolved via Storage's `firestore.exists()` cross-
  service rules feature, checking the same `/admins/{uid}` collection as
  the Firestore rules.
- Everything else is denied by default.

**Keep in sync:** the size/type limits in `storage.rules` are duplicated
in `src/lib/auth/constants.ts` (`MAX_IMAGE_SIZE_BYTES`,
`MAX_DOCUMENT_SIZE_BYTES`, `ALLOWED_IMAGE_TYPES`) for client-side
validation (`src/lib/auth/validation.ts`). Storage rules can't import
TypeScript, so if you change one, change the other.

## Deployment Status

**Not yet deployed.** No real Firebase project exists (`PROJECT_STATE.md`
Outstanding Items). Before first deploy:

1. Validate both rules files against the Firebase Emulator Suite or a
   real project (`firebase emulators:start` / `firebase deploy --only
   firestore:rules,storage:rules`).
2. Manually create the first `super_admin` document in `/admins/{uid}`.
3. Confirm a signed-in admin can actually read/write as expected — rules
   syntax isn't validated by this project's `tsc`/`eslint`/`next build`
   pipeline, since `.rules` files are a separate Firebase-specific
   language.

## What This Sprint Deliberately Did Not Build

Per `CURRENT_SPRINT.md`'s Out of Scope list: no login page, no admin
dashboard UI, no CRUD screens, no content management, no public page
migration, no dynamic homepage/announcements/events. Everything above is
foundation for those future sprints, not a working feature yet.

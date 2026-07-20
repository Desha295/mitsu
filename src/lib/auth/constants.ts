/**
 * Shared role and permission constants (Sprint 2.3 — Security Foundation).
 *
 * Single source of truth for role names and permission names, so
 * roles.ts/permissions.ts and any future admin UI reference the same
 * strings rather than repeating "admin"/"super_admin" literals.
 */
import type { UserRole } from "./types";

export const ROLES = {
  admin: "admin",
  superAdmin: "super_admin",
} as const satisfies Record<string, UserRole>;

/**
 * Permission names, one per manageable content area (mirrors the
 * Administrator capabilities in 02_REQUIREMENTS.md §3.2 and the Admin
 * Dashboard responsibilities in 00_PROJECT_RULES.md #14). No admin UI
 * exists yet to exercise these — they're the permission vocabulary a
 * future dashboard will check against.
 */
export const PERMISSIONS = {
  manageAnnouncements: "manageAnnouncements",
  manageEvents: "manageEvents",
  manageSystems: "manageSystems",
  manageUnion: "manageUnion",
  manageGuide: "manageGuide",
  manageHomepage: "manageHomepage",
  manageSettings: "manageSettings",
  manageAdmins: "manageAdmins",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * `admin` can manage every content area except other admins;
 * `super_admin` can manage everything, including admin accounts.
 * Mirrors the read/write split in firestore.rules — keep both in sync.
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [ROLES.admin]: [
    PERMISSIONS.manageAnnouncements,
    PERMISSIONS.manageEvents,
    PERMISSIONS.manageSystems,
    PERMISSIONS.manageUnion,
    PERMISSIONS.manageGuide,
    PERMISSIONS.manageHomepage,
    PERMISSIONS.manageSettings,
  ],
  [ROLES.superAdmin]: Object.values(PERMISSIONS),
};

/**
 * File-upload limits. These MUST match storage.rules exactly — Storage
 * rules can't import TypeScript, so the two are kept in sync manually.
 * Client-side validation (validation.ts) uses these for fast, friendly
 * feedback; the Storage rules enforce the same limits server-side as
 * the actual security boundary.
 */
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
] as const;

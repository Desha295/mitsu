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
 * Permission names, one per manageable content area.
 */
export const PERMISSIONS = {
  manageAnnouncements: "manageAnnouncements",
  manageEvents: "manageEvents",
  manageSystems: "manageSystems",
  manageUnion: "manageUnion",
  manageGuide: "manageGuide",
  manageHero: "manageHero",
  manageHomepage: "manageHomepage",
  manageLeadership: "manageLeadership",
  manageFacultyLeadership: "manageFacultyLeadership",
  manageStudyPlans: "manageStudyPlans",
  manageFamilies: "manageFamilies",
  manageSettings: "manageSettings",
  manageSocialLinks: "manageSocialLinks",
  manageAdmins: "manageAdmins",
} as const;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * `admin` can manage every content area except other admins;
 * `super_admin` can manage everything, including admin accounts.
 */
export const ROLE_PERMISSIONS: Record<
  UserRole,
  Permission[]
> = {
  [ROLES.admin]: [
    PERMISSIONS.manageAnnouncements,
    PERMISSIONS.manageEvents,
    PERMISSIONS.manageSystems,
    PERMISSIONS.manageUnion,
    PERMISSIONS.manageGuide,
    PERMISSIONS.manageHero,
    PERMISSIONS.manageHomepage,
    PERMISSIONS.manageLeadership,
    PERMISSIONS.manageFacultyLeadership,
    PERMISSIONS.manageStudyPlans,
    PERMISSIONS.manageFamilies,
    PERMISSIONS.manageSettings,
    PERMISSIONS.manageSocialLinks,
  ],

  [ROLES.superAdmin]:
    Object.values(PERMISSIONS),
};

/**
 * File-upload limits. These MUST match storage.rules exactly.
 */
export const MAX_IMAGE_SIZE_BYTES =
  5 * 1024 * 1024; // 5MB

export const MAX_DOCUMENT_SIZE_BYTES =
  10 * 1024 * 1024; // 10MB

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
] as const;
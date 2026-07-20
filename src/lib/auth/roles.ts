/**
 * Role helpers (Sprint 2.3 — Security Foundation).
 */
import { ROLES } from "./constants";
import type { UserRole } from "./types";

const ROLE_HIERARCHY: Record<UserRole, number> = {
  [ROLES.admin]: 1,
  [ROLES.superAdmin]: 2,
};

/** Type guard: narrows an arbitrary string (e.g. from Firestore) to UserRole. */
export function isValidRole(role: string): role is UserRole {
  return role === ROLES.admin || role === ROLES.superAdmin;
}

/** True if `role` is at least as privileged as `minimum` (super_admin ⊇ admin). */
export function roleMeetsMinimum(role: UserRole, minimum: UserRole): boolean {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[minimum];
}

export function isSuperAdmin(role: UserRole): boolean {
  return role === ROLES.superAdmin;
}

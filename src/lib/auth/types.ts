/**
 * Shared auth types (Sprint 2.3 — Security Foundation).
 *
 * These types describe the security/authorization model only — they do
 * NOT imply any login page or dashboard exists yet (both are explicitly
 * out of scope for this sprint; see CURRENT_SPRINT.md).
 */

/** Matches AdminDoc.role in src/lib/firebase/collections.ts (Sprint 2.1). */
export type UserRole = "admin" | "super_admin";

/**
 * A signed-in Firebase Auth user who is also a registered admin (i.e.
 * has a matching document in the `admins` Firestore collection).
 */
export interface AuthenticatedAdmin {
  uid: string;
  email: string;
  role: UserRole;
}

/** Result of resolving the current auth/admin state — used by route guards. */
export interface AuthGuardState {
  /** True while the initial Firebase Auth state is still resolving. */
  loading: boolean;
  /** Null when signed out, or signed in but not a registered admin. */
  admin: AuthenticatedAdmin | null;
}

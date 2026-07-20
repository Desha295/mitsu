/**
 * Authentication & session helpers (Sprint 2.3 — Security Foundation).
 *
 * Thin wrappers around Firebase Auth. No login page or form exists yet
 * (explicitly out of scope this sprint) — these are the reusable
 * functions a future login page would call, exactly parallel to how
 * Sprint 2.2 built create()/update() functions before any UI called them.
 */
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type Unsubscribe,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";

function requireAuth() {
  if (!auth) {
    throw new Error(
      "[MITSU] Firebase Authentication is not configured yet. Fill in " +
        ".env.local using .env.local.example once a Firebase project exists."
    );
  }
  return auth;
}

/** Signs in with email/password and returns the authenticated user. */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<User> {
  const authInstance = requireAuth();
  const credential = await signInWithEmailAndPassword(
    authInstance,
    email,
    password
  );
  return credential.user;
}

/** Signs the current user out. */
export async function signOutUser(): Promise<void> {
  const authInstance = requireAuth();
  await signOut(authInstance);
}

/** Returns the currently signed-in user, or `null` if signed out / not configured. */
export function getCurrentUser(): User | null {
  return auth?.currentUser ?? null;
}

/**
 * Subscribes to Firebase Auth state changes. Returns an unsubscribe
 * function — callers (e.g. a future `useAuthGuard` hook) are responsible
 * for calling it on cleanup.
 */
export function subscribeToAuthState(
  callback: (user: User | null) => void
): Unsubscribe {
  if (!auth) {
    // Firebase not configured: report "signed out" once and return a
    // no-op unsubscribe, so callers can treat this identically to the
    // configured case rather than needing a special branch.
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

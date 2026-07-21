/**
 * Authentication & session helpers.
 *
 * Originally created in Sprint 2.3 — Security Foundation with email/
 * password sign-in, sign-out, current-user, and auth-state-subscription
 * helpers. Extended in Sprint 2.4 — Authentication Integration with
 * Google Sign-In. All Sprint 2.3 exports are unchanged; this file was
 * only appended to.
 *
 * Thin wrappers around Firebase Auth — these are the reusable functions
 * AuthContext (Sprint 2.4) calls, exactly parallel to how Sprint 2.2
 * built create()/update() functions before any UI called them.
 */
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
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

const googleProvider = new GoogleAuthProvider();

/**
 * Signs in with a Google account via a popup and returns the
 * authenticated user (Sprint 2.4).
 */
export async function signInWithGoogle(): Promise<User> {
  const authInstance = requireAuth();
  const credential = await signInWithPopup(authInstance, googleProvider);
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
 * function — callers (e.g. AuthProvider, Sprint 2.4) are responsible for
 * calling it on cleanup.
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

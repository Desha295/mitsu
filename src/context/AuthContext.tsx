"use client";

/**
 * Auth Context & Provider (Sprint 2.4 — Authentication Integration).
 *
 * Wraps Sprint 2.3's session helpers (src/lib/auth/session.ts) in a
 * React Context, following the exact same pattern as ThemeContext/
 * LanguageContext (Context + custom hook, no external state library).
 *
 * Unlike theme/language (which read synchronously from localStorage),
 * Firebase Auth state resolution is inherently asynchronous — even a
 * persisted session takes a moment to restore — so `loading` starts
 * `true` and only flips to `false` once the first `onAuthStateChanged`
 * callback fires. This loading flag is what `RequireAuth` and any future
 * protected layout use to avoid flashing "signed out" before Firebase
 * has actually finished checking.
 */
import { createContext, useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import {
  getCurrentUser,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  subscribeToAuthState,
} from "@/lib/auth/session";

export interface AuthContextValue {
  /** The signed-in Firebase user, or `null` if signed out. */
  user: User | null;
  /** True until the initial Firebase Auth state has resolved. */
  loading: boolean;
  loginWithGoogle: () => Promise<User>;
  loginWithEmail: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // subscribeToAuthState reports the resolved state exactly once, even
    // when Firebase isn't configured (see session.ts) — this always
    // eventually sets loading to false, never hangs.
    const unsubscribe = subscribeToAuthState((nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = useCallback(() => signInWithGoogle(), []);

  const loginWithEmail = useCallback(
    (email: string, password: string) => signInWithEmail(email, password),
    []
  );

  const logout = useCallback(() => signOutUser(), []);

  return (
    <AuthContext.Provider
      value={{ user, loading, loginWithGoogle, loginWithEmail, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

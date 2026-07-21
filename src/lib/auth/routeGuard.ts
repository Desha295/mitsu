"use client";

/**
 * Route protection utilities.
 *
 * Originally created in Sprint 2.3 — Security Foundation with its own
 * independent `subscribeToAuthState` subscription. Refactored in Sprint
 * 2.4 — Authentication Integration to consume the new `useAuth()` hook
 * instead, once one existed — avoids two separate Firebase Auth
 * subscriptions doing the same job (this sprint's explicit "do not
 * duplicate logic" requirement). The public return shape (`AuthGuardState`)
 * is unchanged, so this is safe: nothing consumed `useAuthGuard` yet
 * (verified before this refactor).
 *
 * `useAuthGuard` is a reusable hook a future admin dashboard's protected
 * layout/pages would call to resolve "is anyone signed in, and are they
 * an admin". No dashboard, layout, or page uses it yet — Admin Dashboard
 * UI is explicitly out of scope for this sprint (CURRENT_SPRINT.md).
 */
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";
import { getAdminForUser } from "./adminAuth";
import { hasPermission } from "./permissions";
import type { AuthenticatedAdmin, AuthGuardState } from "./types";
import type { Permission } from "./constants";

/**
 * Resolves the current signed-in admin (if any), by layering admin-role
 * resolution (Sprint 2.3's `getAdminForUser`) on top of the general auth
 * session from `useAuth()` (Sprint 2.4) — one Firebase Auth subscription
 * shared by both, not two. Intended for a future protected route/layout
 * to call, e.g.:
 *
 *   const { loading, admin } = useAuthGuard();
 *   if (loading) return <Spinner />;
 *   if (!admin) return <redirect to login>;
 */
export function useAuthGuard(): AuthGuardState {
  const { user, loading: authLoading } = useAuth();
  const [admin, setAdmin] = useState<AuthenticatedAdmin | null>(null);
  // Tracks which `user` value `admin` was last resolved for. `undefined`
  // means "not resolved yet for any user". Comparing against the current
  // `user` (below) derives the loading flag instead of setting it
  // synchronously inside the effect body, which avoids the cascading-
  // render lint issue the same way Sprint 1.1's ThemeContext/
  // LanguageContext fix did.
  const [resolvedForUser, setResolvedForUser] = useState<User | null | undefined>(
    undefined
  );

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    getAdminForUser(user).then((resolved) => {
      if (!cancelled) {
        setAdmin(resolved);
        setResolvedForUser(user);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const resolvingAdmin = !authLoading && resolvedForUser !== user;

  return { loading: authLoading || resolvingAdmin, admin };
}

/** Convenience check combining a resolved admin with a specific permission requirement. */
export function canAccess(
  admin: AuthenticatedAdmin | null,
  permission: Permission
): boolean {
  if (!admin) return false;
  return hasPermission(admin.role, permission);
}

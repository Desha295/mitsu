"use client";

/**
 * Route protection utilities (Sprint 2.3 — Security Foundation).
 *
 * `useAuthGuard` is a reusable hook a future admin dashboard's protected
 * layout/pages would call to resolve "is anyone signed in, and are they
 * an admin". No dashboard, layout, or page uses it yet — Admin Dashboard
 * UI is explicitly out of scope for this sprint (CURRENT_SPRINT.md).
 */
import { useEffect, useState } from "react";
import { getAdminForUser } from "./adminAuth";
import { hasPermission } from "./permissions";
import { subscribeToAuthState } from "./session";
import type { AuthenticatedAdmin, AuthGuardState } from "./types";
import type { Permission } from "./constants";

const INITIAL_STATE: AuthGuardState = { loading: true, admin: null };

/**
 * Resolves the current signed-in admin (if any), updating whenever
 * Firebase Auth's state changes. Intended for a future protected
 * route/layout to call, e.g.:
 *
 *   const { loading, admin } = useAuthGuard();
 *   if (loading) return <Spinner />;
 *   if (!admin) return <redirect to login>;
 */
export function useAuthGuard(): AuthGuardState {
  const [state, setState] = useState<AuthGuardState>(INITIAL_STATE);

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = subscribeToAuthState((user) => {
      getAdminForUser(user).then((admin) => {
        if (!cancelled) setState({ loading: false, admin });
      });
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return state;
}

/** Convenience check combining a resolved admin with a specific permission requirement. */
export function canAccess(
  admin: AuthenticatedAdmin | null,
  permission: Permission
): boolean {
  if (!admin) return false;
  return hasPermission(admin.role, permission);
}

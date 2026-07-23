"use client";

import type { ReactNode } from "react";
import { RequireAuth } from "@/components/shared/RequireAuth";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Unauthorized } from "@/components/admin/Unauthorized";
import { LoadingDashboard } from "@/components/admin/LoadingDashboard";
import { useAuth } from "@/hooks/useAuth";
import { useAuthGuard } from "@/lib/auth/routeGuard";

/**
 * Protects the entire /admin route segment (Sprint 3.1). Applies to
 * every current and future page under /admin automatically, since
 * Next.js layouts wrap all nested routes.
 *
 * Two Sprint 2.x pieces are layered, not reimplemented:
 *  - RequireAuth (Sprint 2.4): not signed in at all -> redirect to
 *    /login. Only renders its children once a Firebase user exists.
 *  - useAuthGuard (Sprint 2.3, refactored in 2.4 to share useAuth's
 *    session instead of its own subscription): signed in but not a
 *    registered admin -> Unauthorized (403), instead of the dashboard.
 */
export default function AdminRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RequireAuth>
      <AdminGate>{children}</AdminGate>
    </RequireAuth>
  );
}

function AdminGate({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { loading, admin } = useAuthGuard();

  if (loading) {
    return <LoadingDashboard />;
  }

  if (!admin || !user) {
    return <Unauthorized />;
  }

  return <AdminLayout user={user}>{children}</AdminLayout>;
}

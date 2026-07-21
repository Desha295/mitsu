"use client";

/**
 * RequireAuth (Sprint 2.4 — Authentication Integration).
 *
 * Gates its children behind Firebase Authentication: shows a loading
 * state while auth resolves, redirects to `/login` if no user is
 * signed in, otherwise renders `children`.
 *
 * No dashboard or protected page uses this yet — CURRENT_SPRINT.md
 * explicitly excludes the Admin Dashboard this sprint. This is the
 * reusable primitive a future dashboard layout (Sprint 3.1) will wrap
 * itself in, exactly parallel to how Sprint 2.3's security rules were
 * built before any dashboard existed to exercise them.
 */
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

interface RequireAuthProps {
  children: ReactNode;
  /** Where to send unauthenticated users. Defaults to /login. */
  redirectTo?: string;
}

export function RequireAuth({
  children,
  redirectTo = "/login",
}: RequireAuthProps) {
  const { user, loading } = useAuth();
  const { translate } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(redirectTo);
    }
  }, [loading, user, router, redirectTo]);

  if (loading) {
    return (
      <div
        role="status"
        className="flex min-h-[50vh] items-center justify-center"
      >
        <p className="text-sm text-foreground/60">
          {translate("common.loading")}
        </p>
      </div>
    );
  }

  if (!user) {
    // Redirect is already in flight (see effect above); render nothing
    // rather than a flash of protected content.
    return null;
  }

  return <>{children}</>;
}

"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

/**
 * 403 state (components/admin) — shown when a user is signed in via
 * Firebase Auth but has no matching `/admins/{uid}` document (i.e. they
 * passed RequireAuth's "signed in?" check but fail useAuthGuard's
 * "is an admin?" check). Distinct from RequireAuth's own behavior, which
 * redirects fully signed-out users to /login instead of showing this.
 */
export function Unauthorized() {
  const { translate } = useLanguage();

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-surface p-8 text-center shadow-sm">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary">
          <ShieldAlert className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-xl font-bold text-foreground">
          {translate("admin.unauthorized.heading")}
        </h1>
        <p className="mt-2 text-sm text-foreground/70">
          {translate("admin.unauthorized.description")}
        </p>
        <Link
          href="/"
          className={cx(
            "mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-dark",
            focusRing
          )}
        >
          {translate("admin.unauthorized.backHome")}
        </Link>
      </div>
    </div>
  );
}

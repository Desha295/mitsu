"use client";

import { Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * Loading state (components/admin), shown while RequireAuth/useAuthGuard
 * are still resolving whether anyone is signed in and whether they're a
 * registered admin.
 */
export function LoadingDashboard() {
  const { translate } = useLanguage();

  return (
    <div
      role="status"
      className="flex min-h-[70vh] flex-col items-center justify-center gap-3 bg-background"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      <p className="text-sm text-foreground/60">{translate("admin.loading")}</p>
    </div>
  );
}

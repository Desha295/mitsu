"use client";

import Image from "next/image";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { useLanguage } from "@/hooks/useLanguage";
import { settingsService } from "@/lib/firebase/services";
import { BRAND_NAME } from "@/constants/brand";
import { cx } from "@/lib/utils";

interface LogoProps {
  /** Show the "Faculty of Information Technology, MUST" identity line under the wordmark. */
  showIdentity?: boolean;
  className?: string;
}

/**
 * Brand lockup shared between Navbar and Footer (07_COMPONENT_RULES.md §11
 * "before creating a new component, check if one already exists" — this
 * exists specifically so the two places that need the MITSU wordmark don't
 * duplicate it).
 *
 * Sprint 5.0: site name now comes from Settings (`projectName`) where
 * available. Because this renders on every single page as above-the-fold
 * chrome, it deliberately does NOT show a loading state — `BRAND_NAME`
 * renders instantly (identical to before this sprint), and only silently
 * upgrades if Settings resolves with a different, non-empty value. In
 * practice this means no visible change at all unless an admin
 * deliberately edits the site name in Settings.
 *
 * Sprint 6.1: an optional image mark (`logoUrl`) now renders beside the
 * wordmark once an admin sets one. `unoptimized` is used rather than
 * relying on next.config.ts's remotePatterns allowlist, since this URL
 * is a plain admin-entered value (SettingsForm is a text input, not a
 * guaranteed Storage upload like Hero's image) and could be any domain.
 * When unset, nothing renders here — identical to before this sprint.
 */
export function Logo({ showIdentity = true, className }: LogoProps) {
  const { translate } = useLanguage();
  const { data: settings } = useFirestoreDoc(settingsService);
  const siteName = settings?.projectName || BRAND_NAME;

  return (
    <span className={cx("flex items-center gap-2", className)}>
      {settings?.logoUrl && (
        <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-sm">
          <Image
            src={settings.logoUrl}
            alt=""
            fill
            unoptimized
            className="object-contain"
          />
        </span>
      )}
      <span className="flex flex-col leading-tight">
        <span className="text-lg font-bold tracking-tight text-primary">
          {siteName}
        </span>
        {showIdentity && (
          <span className="text-[11px] font-medium text-foreground/60">
            {translate("navbar.identity")}
          </span>
        )}
      </span>
    </span>
  );
}

"use client";

import { useLanguage } from "@/hooks/useLanguage";
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
 */
export function Logo({ showIdentity = true, className }: LogoProps) {
  const { translate } = useLanguage();

  return (
    <span className={cx("flex flex-col leading-tight", className)}>
      <span className="text-lg font-bold tracking-tight text-primary">
        {BRAND_NAME}
      </span>
      {showIdentity && (
        <span className="text-[11px] font-medium text-foreground/60">
          {translate("navbar.identity")}
        </span>
      )}
    </span>
  );
}

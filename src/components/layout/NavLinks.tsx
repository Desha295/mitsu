"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavigation } from "@/data/navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface NavLinksProps {
  orientation?: "horizontal" | "vertical";
  /** Called after a link is activated — used to close the mobile menu. */
  onNavigate?: () => void;
  className?: string;
}

/**
 * Renders the link list only — no <nav> landmark here, since Navbar and
 * MobileMenu each provide their own <nav aria-label> wrapper around this
 * component. Keeps this component single-responsibility and reusable in
 * both places without duplicating landmark semantics (07_COMPONENT_RULES.md).
 *
 * Data comes from data/navigation.ts — no hardcoded links, per Sprint 1.1
 * Navbar requirements.
 */
export function NavLinks({
  orientation = "horizontal",
  onNavigate,
  className,
}: NavLinksProps) {
  const pathname = usePathname();
  const { translate } = useLanguage();

  return (
    <ul
      className={cx(
        "flex",
        orientation === "horizontal"
          ? "items-center gap-1"
          : "flex-col gap-1",
        className
      )}
    >
      {mainNavigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cx(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                isActive
                  ? "text-primary"
                  : "text-foreground/80 hover:text-foreground hover:bg-surface-muted",
                focusRing
              )}
            >
              {translate(item.labelKey)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

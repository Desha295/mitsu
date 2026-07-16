"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface FooterLinkItem {
  label: string;
  href?: string;
}

interface FooterLinkGroupProps {
  heading: string;
  items: FooterLinkItem[];
}

/**
 * Reusable footer column (components/layout). Handles both real internal
 * links (Quick Links) and placeholder official links (University Systems,
 * whose officialUrl isn't populated yet — Firebase Content is out of
 * Sprint 1.1 scope) with the same component, per the "avoid duplicated
 * components" rule in 13_CHANGE_POLICY.md.
 */
export function FooterLinkGroup({ heading, items }: FooterLinkGroupProps) {
  const { translate } = useLanguage();

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{heading}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => {
          const isExternal = item.href?.startsWith("http");
          const linkClassName = cx(
            "rounded-sm text-sm text-foreground/70 transition-colors duration-150 hover:text-foreground",
            focusRing
          );

          return (
            <li key={item.label}>
              {item.href ? (
                isExternal ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClassName}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href} className={linkClassName}>
                    {item.label}
                  </Link>
                )
              ) : (
                <span className="text-sm text-foreground/40">
                  {item.label} ({translate("common.comingSoon")})
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

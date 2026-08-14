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

export function FooterLinkGroup({ heading, items }: FooterLinkGroupProps) {
  const { translate } = useLanguage();

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{heading}</h3>

      <ul className="mt-3 space-y-2">
        {items.map((item, index) => {
          const isExternal = item.href?.startsWith("http");

          const linkClassName = cx(
            "rounded-sm text-sm text-foreground/70 transition-colors duration-150 hover:text-foreground",
            focusRing
          );

          return (
            <li
              key={`${item.href ?? "placeholder"}-${item.label}-${index}`}
            >
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
"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface QuickAccessCardProps {
  titleKey: string;
  descriptionKey: string;
  href: string;
  iconName: string;
}

/**
 * Quick Access Card (components/shared — project-specific reusable component
 * per 07_COMPONENT_RULES.md §3.4). Used by QuickAccessSection to render
 * each of the 6 quick access items (Freshman Guide, Systems, Union, etc.).
 *
 * All content is data-driven via props; no hardcoding. Icon names come from
 * lucide-react and are dynamically resolved.
 */
export function QuickAccessCard({
  titleKey,
  descriptionKey,
  href,
  iconName,
}: QuickAccessCardProps) {
  const { translate } = useLanguage();

  // Dynamically resolve icon from lucide-react
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[iconName];
  const icon = IconComponent ? <IconComponent className="h-8 w-8" /> : null;

  return (
    <Link
      href={href}
      className={cx(
        "group flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 transition-all duration-200 hover:shadow-md hover:border-primary",
        focusRing
      )}
    >
      <div className="text-primary group-hover:text-primary-dark transition-colors duration-200">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-foreground">
          {translate(titleKey)}
        </h3>
        <p className="mt-1 text-sm text-foreground/70">
          {translate(descriptionKey)}
        </p>
      </div>
      <div className="mt-auto pt-2 text-xs font-medium text-primary group-hover:text-primary-dark transition-colors duration-200">
        {translate("home.quickAccess.explore")} →
      </div>
    </Link>
  );
}

"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface QuickAccessCardProps {
  title: string;
  description: string;
  href: string;
  iconName: string;
}

/**
 * Quick Access Card (components/shared — project-specific reusable component
 * per 07_COMPONENT_RULES.md §3.4). Used by QuickAccessSection to render
 * each quick access item.
 *
 * Sprint 4 — Phase 4.1: content props changed from `titleKey`/
 * `descriptionKey` to resolved `title`/`description` strings, since the
 * caller now reads these from Firestore's QuickAccessItemDoc (plain
 * strings, not translation keys) instead of src/data/home.ts. Only the
 * "explore" label below is still static UI chrome, so it's the only
 * piece still resolved via translate() here.
 */
export function QuickAccessCard({
  title,
  description,
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
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-foreground/70">{description}</p>
      </div>
      <div className="mt-auto pt-2 text-xs font-medium text-primary group-hover:text-primary-dark transition-colors duration-200">
        {translate("home.quickAccess.explore")} →
      </div>
    </Link>
  );
}

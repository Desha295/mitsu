"use client";

import Link from "next/link";
import * as Icons from "lucide-react";
import { cx, focusRing } from "@/lib/utils";

interface QuickActionCardProps {
  icon: string;
  label: string;
  comingSoonLabel: string;
  /** When provided, renders as a real link instead of the disabled state. */
  href?: string;
}

/**
 * Quick action card (components/admin). Renders disabled/"coming soon"
 * when no `href` is given (target page doesn't exist yet — avoids a
 * dead link), or as a real navigable card once one does (Sprint 3.2:
 * Hero is the first to get a real href).
 */
export function QuickActionCard({
  icon,
  label,
  comingSoonLabel,
  href,
}: QuickActionCardProps) {
  const IconComponent = (
    Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>
  )[icon];

  if (href) {
    return (
      <Link
        href={href}
        className={cx(
          "flex flex-col items-start gap-3 rounded-lg border border-border bg-surface p-5 shadow-sm transition-shadow duration-200 hover:shadow-md",
          focusRing
        )}
      >
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary-light text-primary">
          {IconComponent && <IconComponent className="h-5 w-5" aria-hidden="true" />}
        </span>
        <p className="text-sm font-semibold text-foreground">{label}</p>
      </Link>
    );
  }

  return (
    <div
      aria-disabled="true"
      className="flex cursor-not-allowed flex-col items-start gap-3 rounded-lg border border-border bg-surface p-5 opacity-60"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-surface-muted text-foreground/50">
        {IconComponent && <IconComponent className="h-5 w-5" aria-hidden="true" />}
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-foreground/50">{comingSoonLabel}</p>
      </div>
    </div>
  );
}

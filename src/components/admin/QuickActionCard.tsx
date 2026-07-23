"use client";

import * as Icons from "lucide-react";

interface QuickActionCardProps {
  icon: string;
  label: string;
  comingSoonLabel: string;
}

/**
 * Quick action card (components/admin). Rendered as disabled/"coming
 * soon" this sprint — its target admin management pages (announcements,
 * events, etc.) don't exist yet, so this avoids a dead link, consistent
 * with this project's established practice for known future
 * functionality (e.g. MUSTER's missing URL, Sprint 1.7's "Coming soon"
 * contact info). Will become a real link once its target page exists.
 */
export function QuickActionCard({
  icon,
  label,
  comingSoonLabel,
}: QuickActionCardProps) {
  const IconComponent = (
    Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>
  )[icon];

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

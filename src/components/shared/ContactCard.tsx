"use client";

import * as Icons from "lucide-react";
import { cx, focusRing } from "@/lib/utils";

interface ContactCardProps {
  icon: string;
  /** Already-translated display title (label or channel name). */
  title: string;
  /** Already-translated description/value text. */
  description?: string;
  /** When present, the whole card becomes an external link. */
  href?: string;
}

/**
 * Contact card (components/shared — feature component per
 * 07_COMPONENT_RULES.md §3.4). Generic enough to render both office
 * info (icon + label + value, no link) and communication channels
 * (icon + name + description + link), so ContactSection doesn't need
 * two separate card components.
 *
 * Receives already-resolved strings rather than translation keys, since
 * it serves two different data shapes (OfficeInfoItem / CommunicationChannel)
 * with no shared type — the same pattern already used by FooterLinkGroup
 * (Sprint 1.1) for the same reason.
 */
export function ContactCard({
  icon,
  title,
  description,
  href,
}: ContactCardProps) {
  const IconComponent = (
    Icons as unknown as Record<
      string,
      React.ComponentType<{ className?: string }>
    >
  )[icon];

  const content = (
    <>
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
        {IconComponent && <IconComponent className="h-5 w-5" aria-hidden="true" />}
      </span>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-foreground/70">{description}</p>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cx(
          "flex flex-col rounded-lg border border-border bg-surface p-6 shadow-sm transition-shadow duration-200 hover:shadow-md hover:bg-surface-muted",
          focusRing
        )}
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex flex-col rounded-lg border border-border bg-surface p-6 shadow-sm">
      {content}
    </div>
  );
}

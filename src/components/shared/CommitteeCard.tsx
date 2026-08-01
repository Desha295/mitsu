"use client";

import * as Icons from "lucide-react";

interface CommitteeCardProps {
  name: string;
  description: string;
  /**
   * Presentation-only field with no Firestore equivalent yet. Temporary
   * Sprint 4 compatibility: the caller (CommitteesSection) supplies this
   * from the static seed data, matched by `order`, since CommitteeDoc
   * doesn't have an `icon` field. Left optional so a committee with no
   * match simply renders without an icon rather than guessing one.
   */
  icon?: string;
}

/**
 * Committee card (components/shared — feature component per
 * 07_COMPONENT_RULES.md §3.4).
 *
 * Sprint 4 — Phase 4.6: name/description now come as resolved values
 * from Firestore's CommitteeDoc (via unionService) instead of
 * translation keys from the static UnionCommittee type. `icon` remains
 * temporarily sourced from static data by the caller — see the prop
 * comment above and CommitteesSection for the full explanation.
 */
export function CommitteeCard({ name, description, icon }: CommitteeCardProps) {
  const IconComponent = icon
    ? (
        Icons as unknown as Record<
          string,
          React.ComponentType<{ className?: string }>
        >
      )[icon]
    : undefined;

  return (
    <div className="flex flex-col rounded-lg border border-border bg-surface p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
        {IconComponent && (
          <IconComponent className="h-6 w-6" aria-hidden="true" />
        )}
      </span>

      <h3 className="mt-4 text-base font-semibold text-foreground">
        {name}
      </h3>
      <p className="mt-2 text-sm text-foreground/70">{description}</p>
    </div>
  );
}

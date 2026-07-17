"use client";

import * as Icons from "lucide-react";
import type { UnionCommittee } from "@/data/union";
import { useLanguage } from "@/hooks/useLanguage";

interface CommitteeCardProps {
  committee: UnionCommittee;
}

/**
 * Committee card (components/shared — feature component per
 * 07_COMPONENT_RULES.md §3.4). Receives a single UnionCommittee via
 * props; all display text resolved through translate() — no hardcoded
 * content.
 */
export function CommitteeCard({ committee }: CommitteeCardProps) {
  const { translate } = useLanguage();

  const IconComponent = (
    Icons as unknown as Record<
      string,
      React.ComponentType<{ className?: string }>
    >
  )[committee.icon];

  return (
    <div className="flex flex-col rounded-lg border border-border bg-surface p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
        {IconComponent && (
          <IconComponent className="h-6 w-6" aria-hidden="true" />
        )}
      </span>

      <h3 className="mt-4 text-base font-semibold text-foreground">
        {translate(committee.nameKey)}
      </h3>
      <p className="mt-2 text-sm text-foreground/70">
        {translate(committee.descriptionKey)}
      </p>
    </div>
  );
}

"use client";

import { useId, useState } from "react";
import * as Icons from "lucide-react";
import { ExternalLink } from "lucide-react";
import type { UniversitySystem, SystemCategory } from "@/types/system.types";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface SystemCardProps {
  system: UniversitySystem;
}

const CATEGORY_LABEL_KEYS: Record<SystemCategory, string> = {
  academic: "systems.categories.academic",
  "student-services": "systems.categories.studentServices",
  communication: "systems.categories.communication",
};

/**
 * University system card (components/shared — feature component per
 * 07_COMPONENT_RULES.md §3.4, explicitly named "SystemCard" as an example
 * there). Receives a single UniversitySystem via props; all display text
 * resolved through translate() from the system's *Key fields — no
 * hardcoded content (Sprint 1.3 requirement).
 *
 * "How to Use" toggles an inline instructions panel rather than a modal,
 * keeping focus management simple while staying fully keyboard accessible
 * (aria-expanded/aria-controls on the toggle button).
 */
export function SystemCard({ system }: SystemCardProps) {
  const { translate } = useLanguage();
  const [showInstructions, setShowInstructions] = useState(false);
  const instructionsId = useId();

  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
    system.icon
  ];
  const hasOfficialUrl = Boolean(system.officialUrl);

  return (
    <div className="flex flex-col rounded-lg border border-border bg-surface p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Icon + Name + Category */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
            {IconComponent && <IconComponent className="h-6 w-6" aria-hidden="true" />}
          </span>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {translate(system.nameKey)}
            </h3>
            <span className="text-xs font-medium text-foreground/50">
              {translate(CATEGORY_LABEL_KEYS[system.category])}
            </span>
          </div>
        </div>

        {system.required && (
          <span className="shrink-0 rounded-full bg-secondary-light px-2 py-0.5 text-[11px] font-medium text-secondary-dark">
            {translate("systems.requiredBadge")}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="mt-4 flex-1 text-sm text-foreground/70">
        {translate(system.descriptionKey)}
      </p>

      {/* Actions */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        {hasOfficialUrl ? (
          <a
            href={system.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cx(
              "inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-primary-dark",
              focusRing
            )}
          >
            {translate("systems.openButton")}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only"> ({translate("common.opensInNewTab")})</span>
          </a>
        ) : (
          <span className="inline-flex flex-1 items-center justify-center rounded-md bg-surface-muted px-4 py-2 text-sm font-medium text-foreground/40">
            {translate("common.comingSoon")}
          </span>
        )}

        <button
          type="button"
          onClick={() => setShowInstructions((prev) => !prev)}
          aria-expanded={showInstructions}
          aria-controls={instructionsId}
          className={cx(
            "inline-flex flex-1 items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-surface-muted",
            focusRing
          )}
        >
          {translate("systems.howToUseButton")}
        </button>
      </div>

      {/* Instructions panel */}
      {showInstructions && (
        <div
          id={instructionsId}
          className="mt-4 animate-fade-in rounded-md bg-surface-muted p-3 text-sm text-foreground/70"
        >
          {translate(system.instructionsKey)}
        </div>
      )}
    </div>
  );
}

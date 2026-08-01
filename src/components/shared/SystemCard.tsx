"use client";

import { useId, useState } from "react";
import * as Icons from "lucide-react";
import { ExternalLink } from "lucide-react";
import type { SystemCategory } from "@/types/system.types";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface SystemCardProps {
  name: string;
  description: string;
  officialUrl?: string;
  icon?: string;
  instructions?: string;
  /**
   * Presentation-only fields with no Firestore equivalent yet.
   * Temporary Sprint 4 compatibility: the caller (SystemsSection)
   * supplies these from the static seed data, matched by `order`, since
   * SystemDoc doesn't have `category`/`required` fields. Left optional
   * here so a system with no match (e.g. a new one added directly in
   * Firestore, not present in the static seed) simply renders without
   * these two elements rather than guessing a value.
   */
  category?: SystemCategory;
  required?: boolean;
}

const CATEGORY_LABEL_KEYS: Record<SystemCategory, string> = {
  academic: "systems.categories.academic",
  "student-services": "systems.categories.studentServices",
  communication: "systems.categories.communication",
};

/**
 * University system card (components/shared — feature component per
 * 07_COMPONENT_RULES.md §3.4, explicitly named "SystemCard" as an example
 * there).
 *
 * Sprint 4 — Phase 4.4: name/description/instructions/officialUrl/icon
 * now come as resolved values from Firestore's SystemDoc (via
 * systemsService) instead of translation keys from the static
 * UniversitySystem type. `category`/`required` remain temporarily
 * sourced from static data by the caller — see the prop comments above
 * and SystemsSection for the full explanation.
 *
 * "How to Use" toggles an inline instructions panel rather than a modal,
 * keeping focus management simple while staying fully keyboard accessible
 * (aria-expanded/aria-controls on the toggle button).
 */
export function SystemCard({
  name,
  description,
  officialUrl,
  icon,
  instructions,
  category,
  required,
}: SystemCardProps) {
  const { translate } = useLanguage();
  const [showInstructions, setShowInstructions] = useState(false);
  const instructionsId = useId();

  const IconComponent = icon
    ? (
        Icons as unknown as Record<
          string,
          React.ComponentType<{ className?: string }>
        >
      )[icon]
    : undefined;
  const hasOfficialUrl = Boolean(officialUrl);

  return (
    <div className="flex flex-col rounded-lg border border-border bg-surface p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Icon + Name + Category */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
            {IconComponent && (
              <IconComponent className="h-6 w-6" aria-hidden="true" />
            )}
          </span>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              {name}
            </h3>
            {category && (
              <span className="text-xs font-medium text-foreground/50">
                {translate(CATEGORY_LABEL_KEYS[category])}
              </span>
            )}
          </div>
        </div>

        {required && (
          <span className="shrink-0 rounded-full bg-secondary-light px-2 py-0.5 text-[11px] font-medium text-secondary-dark">
            {translate("systems.requiredBadge")}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="mt-4 flex-1 text-sm text-foreground/70">{description}</p>

      {/* Actions */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        {hasOfficialUrl ? (
          <a
            href={officialUrl}
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
      {showInstructions && instructions && (
        <div
          id={instructionsId}
          className="mt-4 animate-fade-in rounded-md bg-surface-muted p-3 text-sm text-foreground/70"
        >
          {instructions}
        </div>
      )}
    </div>
  );
}

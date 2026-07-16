"use client";

import { useId, useState } from "react";
import * as Icons from "lucide-react";
import { ChevronDown } from "lucide-react";
import type { GuideSection } from "@/data/guide";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface GuideCardProps {
  section: GuideSection;
  stepNumber: number;
}

/**
 * Freshman Guide step card (components/shared — feature component per
 * 07_COMPONENT_RULES.md §3.4). Receives a single GuideSection via props;
 * all display text resolved through translate() — no hardcoded content.
 *
 * "Learn more" toggles an inline facts/stats panel rather than a modal,
 * matching the pattern already used in SystemCard's "How to Use" toggle
 * (avoids duplicating a new disclosure pattern — 13_CHANGE_POLICY.md).
 * `highlight` gives Important Notes a distinct look per UI_GUIDELINES.md
 * ("Important notes should be highlighted").
 */
export function GuideCard({ section, stepNumber }: GuideCardProps) {
  const { translate } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();

  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
    section.icon
  ];
  const hasDetails = Boolean(section.factKeys?.length || section.stats?.length);

  return (
    <div
      className={cx(
        "flex flex-col rounded-lg border p-6 shadow-sm transition-shadow duration-200 hover:shadow-md",
        section.highlight
          ? "border-secondary bg-secondary-light"
          : "border-border bg-surface"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Step number */}
        <span
          className={cx(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
            section.highlight
              ? "bg-secondary text-white"
              : "bg-primary-light text-primary"
          )}
          aria-hidden="true"
        >
          {stepNumber}
        </span>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            {IconComponent && (
              <IconComponent
                className={cx(
                  "h-5 w-5",
                  section.highlight ? "text-secondary-dark" : "text-primary"
                )}
                aria-hidden="true"
              />
            )}
            <h3 className="text-base font-semibold text-foreground">
              {translate(section.titleKey)}
            </h3>
          </div>
          <p className="mt-2 text-sm text-foreground/70">
            {translate(section.descriptionKey)}
          </p>
        </div>
      </div>

      {hasDetails && (
        <>
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            aria-controls={detailsId}
            className={cx(
              "mt-4 inline-flex items-center gap-1.5 self-start rounded-md text-sm font-medium text-primary transition-colors duration-150 hover:text-primary-dark",
              focusRing
            )}
          >
            {expanded ? translate("guide.showLess") : translate("guide.learnMore")}
            <ChevronDown
              className={cx(
                "h-4 w-4 transition-transform duration-200",
                expanded && "rotate-180"
              )}
              aria-hidden="true"
            />
          </button>

          {expanded && (
            <div id={detailsId} className="mt-3 animate-fade-in">
              {section.stats && section.stats.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {section.stats.map((stat) => (
                    <div
                      key={stat.labelKey}
                      className="rounded-md bg-surface-muted p-3 text-center"
                    >
                      <div className="text-lg font-bold text-primary">
                        {stat.value}
                      </div>
                      <div className="mt-1 text-xs text-foreground/60">
                        {translate(stat.labelKey)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.factKeys && section.factKeys.length > 0 && (
                <ul className="mt-3 flex flex-col gap-2">
                  {section.factKeys.map((factKey) => (
                    <li
                      key={factKey}
                      className="flex items-start gap-2 text-sm text-foreground/70"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                        aria-hidden="true"
                      />
                      {translate(factKey)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

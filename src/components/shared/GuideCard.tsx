"use client";

import { useId, useState } from "react";
import * as Icons from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface GuideCardProps {
  title: string;
  description: string;
  icon?: string;
  /** Short fact bullets shown when the card is expanded. */
  facts?: string[];
  /** Numeric stat chips shown when expanded (e.g. credit hour breakdown). */
  stats?: Array<{ label: string; value: string }>;
  /** Visually highlighted card — used for Important Notes. */
  highlight?: boolean;
  stepNumber: number;
}

/**
 * Freshman Guide step card (components/shared — feature component per
 * 07_COMPONENT_RULES.md §3.4).
 *
 * Sprint 4 — Phase 4.5: props changed from a whole static `GuideSection`
 * (translation-key based) object to resolved primitives, since the
 * caller now reads these from Firestore's GuideSectionDoc — plain
 * strings/arrays, not translation keys.
 *
 * "Learn more" toggles an inline facts/stats panel rather than a modal,
 * matching the pattern already used in SystemCard's "How to Use" toggle
 * (avoids duplicating a new disclosure pattern — 13_CHANGE_POLICY.md).
 * `highlight` gives Important Notes a distinct look per UI_GUIDELINES.md
 * ("Important notes should be highlighted").
 */
export function GuideCard({
  title,
  description,
  icon,
  facts,
  stats,
  highlight,
  stepNumber,
}: GuideCardProps) {
  const { translate } = useLanguage();
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();

  const IconComponent = icon
    ? (
        Icons as unknown as Record<
          string,
          React.ComponentType<{ className?: string }>
        >
      )[icon]
    : undefined;
  const hasDetails = Boolean(facts?.length || stats?.length);

  return (
    <div
      className={cx(
        "flex flex-col rounded-lg border p-6 shadow-sm transition-shadow duration-200 hover:shadow-md",
        highlight
          ? "border-secondary bg-secondary-light"
          : "border-border bg-surface"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Step number */}
        <span
          className={cx(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
            highlight ? "bg-secondary text-white" : "bg-primary-light text-primary"
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
                  highlight ? "text-secondary-dark" : "text-primary"
                )}
                aria-hidden="true"
              />
            )}
            <h3 className="text-base font-semibold text-foreground">
              {title}
            </h3>
          </div>
          <p className="mt-2 text-sm text-foreground/70">{description}</p>
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
              {stats && stats.length > 0 && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {stats.map((stat, index) => (
                    <div
                      key={`${stat.label}-${index}`}
                      className="rounded-md bg-surface-muted p-3 text-center"
                    >
                      <div className="text-lg font-bold text-primary">
                        {stat.value}
                      </div>
                      <div className="mt-1 text-xs text-foreground/60">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {facts && facts.length > 0 && (
                <ul className="mt-3 flex flex-col gap-2">
                  {facts.map((fact, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-foreground/70"
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                        aria-hidden="true"
                      />
                      {fact}
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

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
  category?: SystemCategory;
  required?: boolean;
}

const CATEGORY_LABEL_KEYS: Record<SystemCategory, string> = {
  academic: "systems.categories.academic",
  "student-services": "systems.categories.studentServices",
  communication: "systems.categories.communication",
};

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

  const renderInstructions = () => {
    if (!instructions?.trim()) return null;

    const lines = instructions
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const cleanText = (text: string) =>
      text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/__(.*?)__/g, "$1")
        .replace(/(?<!\w)\*(.*?)\*(?!\w)/g, "$1")
        .replace(/(?<!\w)_(.*?)_(?!\w)/g, "$1")
        .trim();

    return (
      <div className="space-y-2.5 leading-7">
        {lines.map((line, index) => {
          const bulletMatch = line.match(/^[*-]\s+(.*)$/);
          const numberMatch = line.match(/^\d+[.)]\s+(.*)$/);

          if (bulletMatch) {
            return (
              <div
                key={`${instructionsId}-bullet-${index}`}
                className="flex items-start gap-2"
              >
                <span
                  className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-current"
                  aria-hidden="true"
                />
                <span>{cleanText(bulletMatch[1])}</span>
              </div>
            );
          }

          if (numberMatch) {
            const number = line.match(/^\d+/)?.[0];

            return (
              <div
                key={`${instructionsId}-number-${index}`}
                className="flex items-start gap-2"
              >
                <span className="min-w-[1.25rem] shrink-0 font-medium text-foreground/80">
                  {number}.
                </span>
                <span>{cleanText(numberMatch[1])}</span>
              </div>
            );
          }

          return (
            <p key={`${instructionsId}-text-${index}`}>
              {cleanText(line)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col rounded-lg border border-border bg-surface p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
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

      <p className="mt-4 flex-1 text-sm text-foreground/70">
        {description}
      </p>

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

            <ExternalLink
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />

            <span className="sr-only">
              ({translate("common.opensInNewTab")})
            </span>
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

      {showInstructions && instructions && (
        <div
          id={instructionsId}
          className="mt-4 animate-fade-in rounded-md bg-surface-muted p-4 text-sm text-foreground/70"
        >
          {renderInstructions()}
        </div>
      )}
    </div>
  );
}
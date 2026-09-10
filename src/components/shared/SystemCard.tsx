"use client";

import { useId, useState } from "react";
import * as Icons from "lucide-react";
import {
  ArrowUpRight,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

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

  const [showInstructions, setShowInstructions] =
    useState(false);

  const instructionsId = useId();

  const IconComponent = icon
    ? (
        Icons as unknown as Record<
          string,
          React.ComponentType<{
            className?: string;
          }>
        >
      )[icon]
    : undefined;

  const hasOfficialUrl = Boolean(officialUrl);

  const renderInstructions = () => {
    if (!instructions?.trim()) {
      return null;
    }

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
      <div className="space-y-3 text-sm leading-7 text-muted-foreground">
        {lines.map((line, index) => {
          const bulletMatch = line.match(/^[*-]\s+(.*)$/);
          const numberMatch = line.match(/^\d+[.)]\s+(.*)$/);

          if (bulletMatch) {
            return (
              <div
                key={`${instructionsId}-bullet-${index}`}
                className="flex items-start gap-3"
              >
                <span
                  className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden="true"
                />

                <span>{cleanText(bulletMatch[1])}</span>
              </div>
            );
          }

          if (numberMatch) {
            const number =
              line.match(/^\d+/)?.[0];

            return (
              <div
                key={`${instructionsId}-number-${index}`}
                className="flex items-start gap-3"
              >
                <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                  {number}
                </span>

                <span>
                  {cleanText(numberMatch[1])}
                </span>
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
    <article
      className={[
        "group relative flex h-full flex-col overflow-hidden",
        "rounded-3xl border border-border/70",
        "bg-surface/80 backdrop-blur-xl",
        "shadow-sm",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1",
        "hover:border-primary/25",
        "hover:shadow-xl hover:shadow-primary/5",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-x-0 top-0 h-px",
          "bg-gradient-to-r from-transparent via-primary/50 to-transparent",
          "opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100",
        ].join(" ")}
      />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3.5">
            <div
              className={[
                "flex h-12 w-12 shrink-0 items-center justify-center",
                "rounded-2xl border border-primary/20",
                "bg-primary/5 text-primary",
                "transition-all duration-300",
                "group-hover:border-primary/30",
                "group-hover:bg-primary/10",
                "group-hover:scale-105",
              ].join(" ")}
            >
              {IconComponent ? (
                <IconComponent
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              ) : (
                <Icons.MonitorCog
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="min-w-0 pt-0.5">
              {category ? (
                <span className="mb-1.5 inline-flex text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                  {translate(
                    CATEGORY_LABEL_KEYS[category]
                  )}
                </span>
              ) : null}

              <h3 className="break-words text-base font-semibold leading-6 text-foreground sm:text-lg">
                {name}
              </h3>
            </div>
          </div>

          {required ? (
            <span className="shrink-0 rounded-full border border-secondary/20 bg-secondary/10 px-2.5 py-1 text-[10px] font-semibold text-secondary-dark">
              {translate("systems.requiredBadge")}
            </span>
          ) : null}
        </div>

        <p className="mt-5 flex-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          {hasOfficialUrl ? (
            <a
              href={officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cx(
                [
                  "group/button inline-flex flex-1 items-center justify-center gap-2",
                  "rounded-xl px-4 py-3",
                  "bg-primary text-sm font-semibold text-primary-foreground",
                  "shadow-sm",
                  "transition-all duration-200",
                  "hover:-translate-y-0.5",
                  "hover:shadow-md hover:shadow-primary/15",
                  "active:translate-y-0",
                ].join(" "),
                focusRing
              )}
            >
              <span>
                {translate("systems.openButton")}
              </span>

              <ExternalLink
                className="h-4 w-4 transition-transform duration-200 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
                aria-hidden="true"
              />

              <span className="sr-only">
                (
                {translate(
                  "common.opensInNewTab"
                )}
                )
              </span>
            </a>
          ) : (
            <span className="inline-flex flex-1 items-center justify-center rounded-xl border border-border/70 bg-surface-muted px-4 py-3 text-sm font-medium text-muted-foreground">
              {translate("common.comingSoon")}
            </span>
          )}

          <button
            type="button"
            onClick={() =>
              setShowInstructions((prev) => !prev)
            }
            aria-expanded={showInstructions}
            aria-controls={instructionsId}
            className={cx(
              [
                "inline-flex flex-1 items-center justify-center gap-2",
                "rounded-xl border border-border/70",
                "bg-background/60 px-4 py-3",
                "text-sm font-semibold text-foreground",
                "transition-all duration-200",
                "hover:border-primary/20",
                "hover:bg-primary/5",
                "hover:text-primary",
              ].join(" "),
              focusRing
            )}
          >
            <span>
              {translate(
                "systems.howToUseButton"
              )}
            </span>

            <ChevronDown
              className={cx(
                "h-4 w-4 transition-transform duration-300",
                showInstructions && "rotate-180"
              )}
              aria-hidden="true"
            />
          </button>
        </div>

        {showInstructions && instructions ? (
          <div
            id={instructionsId}
            className={[
              "mt-4 overflow-hidden rounded-2xl",
              "border border-primary/10",
              "bg-primary/[0.035]",
              "p-4 sm:p-5",
              "animate-fade-in",
            ].join(" ")}
          >
            <div className="mb-4 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />

              <span className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
                {translate(
                  "systems.howToUseButton"
                )}
              </span>
            </div>

            {renderInstructions()}
          </div>
        ) : null}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 end-0 h-20 w-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <div className="absolute bottom-5 end-5 h-2 w-2 rounded-full bg-primary/30" />
        <div className="absolute bottom-5 end-9 h-px w-5 bg-primary/20" />
        <div className="absolute bottom-9 end-5 h-5 w-px bg-primary/20" />
      </div>

      {hasOfficialUrl ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute end-5 top-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <ArrowUpRight className="h-4 w-4 text-primary/40" />
        </div>
      ) : null}
    </article>
  );
}

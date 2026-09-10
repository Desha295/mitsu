"use client";

import * as Icons from "lucide-react";
import type { AnnouncementDoc } from "@/lib/firebase/collections";
import type { AnnouncementCategory } from "@/data/announcements";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, formatDate } from "@/lib/utils";

interface AnnouncementCardProps {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  priority: AnnouncementDoc["priority"];
  dateIso: string;
  mediaImageUrl?: string;
  mediaFileUrl?: string;
  mediaVideoUrl?: string;
  featured?: boolean;

  /** Optional DOM id used for deep-linking from notifications. */
  id?: string;

  /** Optional additional classes for temporary notification highlighting. */
  className?: string;
}

const CATEGORY_ICONS: Record<AnnouncementCategory, string> = {
  academic: "GraduationCap",
  deadline: "Clock",
  general: "Megaphone",
  event: "PartyPopper",
  orientation: "Compass",
};

const CATEGORY_LABEL_KEYS: Record<AnnouncementCategory, string> = {
  academic: "announcements.filters.academic",
  deadline: "announcements.filters.deadline",
  general: "announcements.filters.general",
  event: "announcements.filters.event",
  orientation: "announcements.filters.orientation",
};

function isKnownCategory(
  value: string
): value is AnnouncementCategory {
  return value in CATEGORY_ICONS;
}

export function AnnouncementCard({
  title,
  titleEn,
  description,
  descriptionEn,
  category,
  priority,
  dateIso,
  mediaImageUrl,
  mediaFileUrl,
  mediaVideoUrl,
  featured = false,
  id,
  className,
}: AnnouncementCardProps) {
  const { translate, language } = useLanguage();

  const knownCategory = isKnownCategory(category)
    ? category
    : "general";

  const CategoryIcon = (
    Icons as unknown as Record<
      string,
      React.ComponentType<{ className?: string }>
    >
  )[CATEGORY_ICONS[knownCategory]];

  const isEnglish = language === "en";

  const displayTitle = isEnglish ? titleEn : title;
  const displayDescription = isEnglish
    ? descriptionEn
    : description;

  const isUrgent = priority === "urgent";
  const isImportant = priority === "important";

  return (
    <article
      id={id}
      className={cx(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl",
        "border border-border/80 bg-surface/80",
        "shadow-sm backdrop-blur-xl",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.10)]",
        "dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)]",
        isUrgent &&
          "border-primary/40 ring-1 ring-primary/10",
        isImportant &&
          "border-secondary/40 ring-1 ring-secondary/10",
        className
      )}
    >
      {/* Top accent */}
      <div
        aria-hidden="true"
        className={cx(
          "absolute inset-x-0 top-0 h-1",
          isUrgent
            ? "bg-primary"
            : isImportant
              ? "bg-secondary"
              : "bg-primary/20"
        )}
      />

      {/* Ambient hover glow */}
      <div
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute -end-20 -top-20 h-48 w-48 rounded-full blur-3xl",
          "opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100",
          isUrgent
            ? "bg-primary/15"
            : isImportant
              ? "bg-secondary/15"
              : "bg-primary/10"
        )}
      />

      <div className="relative z-10 flex h-full flex-col p-6 sm:p-7">
        {/* Meta row */}
        <div
          className={cx(
            "flex flex-wrap items-center gap-2",
            isEnglish
              ? "justify-start"
              : "justify-start"
          )}
        >
          {isUrgent && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm">
              <Icons.AlertCircle
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />

              {translate(
                "announcements.priority.urgent"
              )}
            </span>
          )}

          {isImportant && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1 text-[11px] font-semibold text-secondary-dark">
              <Icons.Info
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />

              {translate(
                "announcements.priority.important"
              )}
            </span>
          )}

          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] font-medium text-muted-foreground">
            {CategoryIcon ? (
              <CategoryIcon
                className="h-3.5 w-3.5 text-primary"
                aria-hidden="true"
              />
            ) : null}

            {translate(
              CATEGORY_LABEL_KEYS[knownCategory]
            )}
          </span>

          {featured && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
              <Icons.Star
                className="h-3 w-3"
                aria-hidden="true"
              />

              {translate(
                "announcements.featuredLabel"
              )}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="mt-5">
          <h3
            dir={isEnglish ? "ltr" : "rtl"}
            className={cx(
              "tracking-tight text-foreground",
              featured
                ? "text-xl font-bold sm:text-2xl"
                : "text-lg font-bold sm:text-xl",
              isEnglish
                ? "text-left"
                : "text-right"
            )}
          >
            {displayTitle}
          </h3>

          <p
            dir={isEnglish ? "ltr" : "rtl"}
            className={cx(
              "mt-3 leading-7 text-muted-foreground",
              featured
                ? "text-base"
                : "text-sm",
              isEnglish
                ? "text-left"
                : "text-right"
            )}
          >
            {displayDescription}
          </p>
        </div>

        {/* Media */}
        {mediaImageUrl && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-muted">
            <img
              src={mediaImageUrl}
              alt={displayTitle}
              className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            />
          </div>
        )}

        {mediaVideoUrl && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-black">
            <video
              src={mediaVideoUrl}
              controls
              className="w-full"
            />
          </div>
        )}

        {mediaFileUrl && (
          <a
            href={mediaFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cx(
              "mt-6 inline-flex w-fit items-center gap-2 rounded-xl",
              "border border-primary/20 bg-primary/5 px-4 py-2.5",
              "text-sm font-semibold text-primary",
              "transition-all duration-200",
              "hover:border-primary/30 hover:bg-primary/10",
              "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background",
              isEnglish
                ? "self-start"
                : "self-end"
            )}
          >
            {isEnglish
              ? "Open Link"
              : "فتح الرابط"}

            {isEnglish ? (
              <Icons.ArrowUpRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            ) : (
              <Icons.ArrowUpLeft
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            )}
          </a>
        )}

        {/* Footer */}
        <div
          className={cx(
            "mt-auto flex items-center border-t border-border/70 pt-5",
            "text-xs font-medium text-muted-foreground",
            isEnglish
              ? "justify-start"
              : "justify-end"
          )}
        >
          <time dateTime={dateIso}>
            {formatDate(dateIso, language)}
          </time>
        </div>
      </div>

      {/* Bottom hover line */}
      <div
        aria-hidden="true"
        className={cx(
          "absolute bottom-0 start-0 h-1 w-0",
          "transition-all duration-300 group-hover:w-full",
          isUrgent
            ? "bg-primary"
            : isImportant
              ? "bg-secondary"
              : "bg-primary"
        )}
      />
    </article>
  );
}

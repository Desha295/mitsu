"use client";

import * as Icons from "lucide-react";
import {
  CalendarDays,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import type { EventCategory } from "@/data/announcements";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, formatDate } from "@/lib/utils";

interface EventCardProps {
  title: string;
  description: string;
  category?: string;
  dateIso: string;
  location?: string;
  imageUrl?: string;
  mediaVideoUrl?: string;
  mediaFileUrl?: string;
  id?: string;
  className?: string;
  isUpcoming?: boolean;
}

const CATEGORY_ICONS: Record<EventCategory, string> = {
  academic: "GraduationCap",
  orientation: "Compass",
  cultural: "BookOpenText",
  sports: "Trophy",
  social: "Users",
};

const CATEGORY_LABEL_KEYS: Record<EventCategory, string> = {
  academic: "events.categories.academic",
  orientation: "events.categories.orientation",
  cultural: "events.categories.cultural",
  sports: "events.categories.sports",
  social: "events.categories.social",
};

function isKnownCategory(
  value: string | undefined
): value is EventCategory {
  if (!value) return false;

  return value in CATEGORY_ICONS;
}

export function EventCard({
  title,
  description,
  category,
  dateIso,
  location,
  imageUrl,
  mediaVideoUrl,
  mediaFileUrl,
  id,
  className,
  isUpcoming = true,
}: EventCardProps) {
  const { translate, language } = useLanguage();

  const CategoryIcon = isKnownCategory(category)
    ? (
        Icons as unknown as Record<
          string,
          React.ComponentType<{
            className?: string;
          }>
        >
      )[CATEGORY_ICONS[category]]
    : undefined;

  return (
    <article
      id={id}
      className={cx(
        "group relative flex h-full min-h-[540px] flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      {/* Top accent */}
      <div className="h-1 w-full bg-primary" />

      {/* Media */}
      {imageUrl ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

          <div className="absolute start-4 top-4 flex flex-wrap gap-2">
            <span
              className={cx(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur",
                isUpcoming
                  ? "border-primary/20 bg-primary text-white"
                  : "border-white/20 bg-white/95 text-gray-900"
              )}
            >
              <CalendarDays
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />

              {isUpcoming
                ? language === "ar"
                  ? "فعالية قادمة"
                  : "Upcoming Event"
                : language === "ar"
                  ? "فعالية سابقة"
                  : "Past Event"}
            </span>

            {isKnownCategory(category) && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm backdrop-blur">
                {CategoryIcon && (
                  <CategoryIcon
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                )}

                {translate(
                  CATEGORY_LABEL_KEYS[category]
                )}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="relative flex aspect-[16/10] w-full items-end overflow-hidden bg-primary-light p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

          <CalendarDays
            className="absolute -end-4 -top-4 h-28 w-28 text-primary/10"
            aria-hidden="true"
          />

          <div className="relative flex flex-wrap gap-2">
            <span
              className={cx(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm",
                isUpcoming
                  ? "border-primary/20 bg-primary text-white"
                  : "border-border bg-surface text-foreground"
              )}
            >
              <CalendarDays
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />

              {isUpcoming
                ? language === "ar"
                  ? "فعالية قادمة"
                  : "Upcoming Event"
                : language === "ar"
                  ? "فعالية سابقة"
                  : "Past Event"}
            </span>

            {isKnownCategory(category) && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
                {CategoryIcon && (
                  <CategoryIcon
                    className="h-3.5 w-3.5 text-primary"
                    aria-hidden="true"
                  />
                )}

                {translate(
                  CATEGORY_LABEL_KEYS[category]
                )}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-7 sm:p-8">
        {!isKnownCategory(category) && (
          <div className="mb-3 h-1 w-10 rounded-full bg-primary" />
        )}

        <h3 className="break-words text-xl font-bold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary sm:text-2xl">
          {title}
        </h3>

        {description && (
          <p className="mt-4 break-words text-sm leading-7 text-muted-foreground sm:text-base">
            {description}
          </p>
        )}

        {/* Event details */}
        <div className="mt-7 space-y-3 border-t border-border pt-5">
          <div className="flex items-start gap-3 text-sm text-muted-foreground">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CalendarDays
                className="h-4 w-4"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0 pt-1">
              <time dateTime={dateIso}>
                {formatDate(dateIso, language)}
              </time>
            </div>
          </div>

          {location && (
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </div>

              <span className="min-w-0 pt-1 break-words">
                {location}
              </span>
            </div>
          )}
        </div>

        {/* Media actions */}
        {(mediaVideoUrl || mediaFileUrl) && (
          <div className="mt-6 flex flex-wrap gap-2">
            {mediaVideoUrl && (
              <a
                href={mediaVideoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-primary-dark hover:shadow-md"
              >
                <ArrowUpRight
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />

                {language === "ar"
                  ? "مشاهدة الفيديو"
                  : "Watch Video"}
              </a>
            )}

            {mediaFileUrl && (
              <a
                href={mediaFileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-foreground transition-all duration-200 hover:bg-surface-muted hover:shadow-sm"
              >
                <ArrowUpRight
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />

                {language === "ar"
                  ? "فتح الرابط"
                  : "Open Link"}
              </a>
            )}
          </div>
        )}

        {/* Bottom hover line */}
        <div className="mt-6 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full" />
      </div>
    </article>
  );
}

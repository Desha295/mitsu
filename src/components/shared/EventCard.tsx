"use client";

import * as Icons from "lucide-react";
import { CalendarDays, MapPin, FileText, Play } from "lucide-react";
import type { EventCategory } from "@/data/announcements";
import { useLanguage } from "@/hooks/useLanguage";
import { formatDate } from "@/lib/utils";

interface EventCardProps {
  title: string;
  description: string;
  category?: string;
  dateIso: string;
  location?: string;
  imageUrl?: string;
  mediaVideoUrl?: string;
  mediaFileUrl?: string;
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

function isKnownCategory(value: string | undefined): value is EventCategory {
  return Boolean(value) && (value as string) in CATEGORY_ICONS;
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
}: EventCardProps) {
  const { translate, language } = useLanguage();

  const CategoryIcon = isKnownCategory(category)
    ? (
        Icons as unknown as Record<
          string,
          React.ComponentType<{ className?: string }>
        >
      )[CATEGORY_ICONS[category]]
    : undefined;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition-shadow duration-200 hover:shadow-md">

      {/* Image */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="h-48 w-full object-cover"
        />
      )}

      <div className="flex flex-col p-6">
        {isKnownCategory(category) && (
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-secondary-light px-2.5 py-0.5 text-[11px] font-medium text-secondary-dark">
            {CategoryIcon && (
              <CategoryIcon
                className="h-3 w-3"
                aria-hidden="true"
              />
            )}
            {translate(CATEGORY_LABEL_KEYS[category])}
          </span>
        )}

        <h3 className="mt-3 text-base font-semibold text-foreground">
          {title}
        </h3>

        <p className="mt-2 flex-1 text-sm text-foreground/70">
          {description}
        </p>

        {/* Video */}
        {mediaVideoUrl && (
          <div className="mt-4">
            <video
              controls
              className="w-full rounded-md"
              src={mediaVideoUrl}
            >
              Your browser does not support the video element.
            </video>
          </div>
        )}

        {/* File */}
        {mediaFileUrl && (
          <a
            href={mediaFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
          >
            <FileText
              className="h-4 w-4"
              aria-hidden="true"
            />
            {language === "ar" ? "عرض الملف" : "View File"}
          </a>
        )}

        <div className="mt-4 flex flex-col gap-1.5 border-t border-border pt-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/60">
            <CalendarDays
              className="h-3.5 w-3.5 shrink-0"
              aria-hidden="true"
            />
            <time dateTime={dateIso}>
              {formatDate(dateIso, language)}
            </time>
          </div>

          {location && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/60">
              <MapPin
                className="h-3.5 w-3.5 shrink-0"
                aria-hidden="true"
              />
              <span>{location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
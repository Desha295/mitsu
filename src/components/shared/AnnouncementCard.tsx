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

function isKnownCategory(value: string): value is AnnouncementCategory {
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
    <div
      className={cx(
        "flex flex-col rounded-lg border bg-surface p-6 shadow-sm transition-shadow duration-200 hover:shadow-md",
        isUrgent
          ? "border-2 border-primary bg-primary-light"
          : isImportant
            ? "border-secondary"
            : "border-border"
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {isUrgent && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-white">
            <Icons.AlertCircle
              className="h-3 w-3"
              aria-hidden="true"
            />
            {translate("announcements.priority.urgent")}
          </span>
        )}

        {isImportant && (
          <span className="inline-flex items-center rounded-full bg-secondary-light px-2.5 py-0.5 text-[11px] font-semibold text-secondary-dark">
            {translate("announcements.priority.important")}
          </span>
        )}

        <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-0.5 text-[11px] font-medium text-foreground/60">
          {CategoryIcon && (
            <CategoryIcon
              className="h-3 w-3"
              aria-hidden="true"
            />
          )}

          {translate(CATEGORY_LABEL_KEYS[knownCategory])}
        </span>

        {featured && (
          <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-white">
            {translate("announcements.featuredLabel")}
          </span>
        )}
      </div>

      <h3
        dir={isEnglish ? "ltr" : "rtl"}
        className={cx(
          "mt-3 font-semibold text-foreground",
          featured
            ? "text-xl sm:text-2xl"
            : "text-base"
        )}
      >
        {displayTitle}
      </h3>

      <p
        dir={isEnglish ? "ltr" : "rtl"}
        className={cx(
          "mt-2 text-foreground/70",
          featured
            ? "text-base"
            : "text-sm"
        )}
      >
        {displayDescription}
      </p>

      {mediaImageUrl && (
        <img
          src={mediaImageUrl}
          alt={displayTitle}
          className="mt-4 w-full rounded-md object-cover"
        />
      )}

      {mediaVideoUrl && (
        <video
          src={mediaVideoUrl}
          controls
          className="mt-4 w-full rounded-md"
        />
      )}

      {mediaFileUrl && (
        <a
          href={mediaFileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          {isEnglish ? "Open file" : "فتح الملف"}
        </a>
      )}

      <time
        dateTime={dateIso}
        className="mt-4 text-xs font-medium text-foreground/50"
      >
        {formatDate(dateIso, language)}
      </time>
    </div>
  );
}
"use client";

import * as Icons from "lucide-react";
import type { Announcement, AnnouncementCategory } from "@/data/announcements";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, formatDate } from "@/lib/utils";

interface AnnouncementCardProps {
  announcement: Announcement;
  /** Larger layout used for the single featured announcement slot. */
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

/**
 * Announcement card (components/shared — feature component per
 * 07_COMPONENT_RULES.md §3.4). Receives a single Announcement via props;
 * all display text resolved through translate() — no hardcoded content.
 *
 * Priority is communicated through emphasis (fill weight + icon), not a
 * new color, since only Blue (primary) and Green (secondary) are
 * available in the locked brand palette (04_DESIGN_SYSTEM.md §4 "Do not
 * introduce unrelated colors"):
 *   - urgent:    solid primary badge + AlertCircle icon + stronger border
 *   - important: secondary-light badge (the palette's existing
 *                "highlight" semantic, reused from GuideCard's
 *                Important Notes treatment in Sprint 1.4)
 *   - normal:    neutral badge, no special emphasis
 */
export function AnnouncementCard({
  announcement,
  featured = false,
}: AnnouncementCardProps) {
  const { translate, language } = useLanguage();

  const CategoryIcon = (
    Icons as unknown as Record<
      string,
      React.ComponentType<{ className?: string }>
    >
  )[CATEGORY_ICONS[announcement.category]];

  const isUrgent = announcement.priority === "urgent";
  const isImportant = announcement.priority === "important";

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
            <Icons.AlertCircle className="h-3 w-3" aria-hidden="true" />
            {translate("announcements.priority.urgent")}
          </span>
        )}
        {isImportant && (
          <span className="inline-flex items-center rounded-full bg-secondary-light px-2.5 py-0.5 text-[11px] font-semibold text-secondary-dark">
            {translate("announcements.priority.important")}
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-0.5 text-[11px] font-medium text-foreground/60">
          {CategoryIcon && <CategoryIcon className="h-3 w-3" aria-hidden="true" />}
          {translate(CATEGORY_LABEL_KEYS[announcement.category])}
        </span>
        {featured && (
          <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-white">
            {translate("announcements.featuredLabel")}
          </span>
        )}
      </div>

      <h3
        className={cx(
          "mt-3 font-semibold text-foreground",
          featured ? "text-xl sm:text-2xl" : "text-base"
        )}
      >
        {translate(announcement.titleKey)}
      </h3>

      <p
        className={cx(
          "mt-2 text-foreground/70",
          featured ? "text-base" : "text-sm"
        )}
      >
        {translate(announcement.descriptionKey)}
      </p>

      <time
        dateTime={announcement.date}
        className="mt-4 text-xs font-medium text-foreground/50"
      >
        {formatDate(announcement.date, language)}
      </time>
    </div>
  );
}

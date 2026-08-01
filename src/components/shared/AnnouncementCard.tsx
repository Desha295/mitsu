"use client";

import * as Icons from "lucide-react";
import type { AnnouncementDoc } from "@/lib/firebase/collections";
import type { AnnouncementCategory } from "@/data/announcements";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, formatDate } from "@/lib/utils";

interface AnnouncementCardProps {
  title: string;
  description: string;
  /** Firestore stores this as a plain string; guarded below against the known taxonomy. */
  category: string;
  priority: AnnouncementDoc["priority"];
  /** ISO date string derived from Firestore's createdAt Timestamp by the caller. */
  dateIso: string;
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

/** Same guard as components/admin/AnnouncementListItem.tsx, reused here
 * rather than re-invented, since AnnouncementDoc.category is a plain
 * `string` in Firestore even though only 5 values are ever written. */
function isKnownCategory(value: string): value is AnnouncementCategory {
  return value in CATEGORY_ICONS;
}

/**
 * Announcement card (components/shared — feature component per
 * 07_COMPONENT_RULES.md §3.4).
 *
 * Sprint 4 — Phase 4.2: props changed from a whole static `Announcement`
 * (translation-key based) object to resolved primitives, since the
 * caller now reads these from Firestore's AnnouncementDoc — plain
 * strings and a Timestamp, not translation keys.
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
  title,
  description,
  category,
  priority,
  dateIso,
  featured = false,
}: AnnouncementCardProps) {
  const { translate, language } = useLanguage();

  const knownCategory = isKnownCategory(category) ? category : "general";
  const CategoryIcon = (
    Icons as unknown as Record<
      string,
      React.ComponentType<{ className?: string }>
    >
  )[CATEGORY_ICONS[knownCategory]];

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
          {CategoryIcon && (
            <CategoryIcon className="h-3 w-3" aria-hidden="true" />
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
        className={cx(
          "mt-3 font-semibold text-foreground",
          featured ? "text-xl sm:text-2xl" : "text-base"
        )}
      >
        {title}
      </h3>

      <p
        className={cx(
          "mt-2 text-foreground/70",
          featured ? "text-base" : "text-sm"
        )}
      >
        {description}
      </p>

      <time
        dateTime={dateIso}
        className="mt-4 text-xs font-medium text-foreground/50"
      >
        {formatDate(dateIso, language)}
      </time>
    </div>
  );
}

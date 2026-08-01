"use client";

import * as Icons from "lucide-react";
import { CalendarDays, MapPin } from "lucide-react";
import type { EventCategory } from "@/data/announcements";
import { useLanguage } from "@/hooks/useLanguage";
import { formatDate } from "@/lib/utils";

interface EventCardProps {
  title: string;
  description: string;
  /** Firestore stores this as an optional plain string; guarded below against the known taxonomy. */
  category?: string;
  /** ISO date string derived from Firestore's date Timestamp by the caller. */
  dateIso: string;
  location?: string;
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

/** Same guard as components/admin/EventListItem.tsx, reused here rather
 * than re-invented, since EventDoc.category is an optional plain
 * `string` in Firestore even though only 5 values are ever written. */
function isKnownCategory(value: string | undefined): value is EventCategory {
  return Boolean(value) && (value as string) in CATEGORY_ICONS;
}

/**
 * Event card (components/shared — feature component per
 * 07_COMPONENT_RULES.md §3.4).
 *
 * Sprint 4 — Phase 4.3: props changed from a whole static `Event`
 * (translation-key based) object to resolved primitives, since the
 * caller now reads these from Firestore's EventDoc — plain strings and
 * a Timestamp, not translation keys. `category` stays optional, exactly
 * matching EventDoc's schema.
 */
export function EventCard({
  title,
  description,
  category,
  dateIso,
  location,
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
    <div className="flex flex-col rounded-lg border border-border bg-surface p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      {isKnownCategory(category) && (
        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-secondary-light px-2.5 py-0.5 text-[11px] font-medium text-secondary-dark">
          {CategoryIcon && (
            <CategoryIcon className="h-3 w-3" aria-hidden="true" />
          )}
          {translate(CATEGORY_LABEL_KEYS[category])}
        </span>
      )}

      <h3 className="mt-3 text-base font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm text-foreground/70">{description}</p>

      <div className="mt-4 flex flex-col gap-1.5 border-t border-border pt-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/60">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <time dateTime={dateIso}>{formatDate(dateIso, language)}</time>
        </div>
        {location && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/60">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{location}</span>
          </div>
        )}
      </div>
    </div>
  );
}

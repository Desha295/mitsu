"use client";

import * as Icons from "lucide-react";
import { CalendarDays, MapPin } from "lucide-react";
import type { Event, EventCategory } from "@/data/announcements";
import { useLanguage } from "@/hooks/useLanguage";
import { formatDate } from "@/lib/utils";

interface EventCardProps {
  event: Event;
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

/**
 * Event card (components/shared — feature component per
 * 07_COMPONENT_RULES.md §3.4). Receives a single Event via props; all
 * display text resolved through translate() — no hardcoded content.
 */
export function EventCard({ event }: EventCardProps) {
  const { translate, language } = useLanguage();

  const CategoryIcon = (
    Icons as unknown as Record<
      string,
      React.ComponentType<{ className?: string }>
    >
  )[CATEGORY_ICONS[event.category]];

  return (
    <div className="flex flex-col rounded-lg border border-border bg-surface p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <span className="inline-flex w-fit items-center gap-1 rounded-full bg-secondary-light px-2.5 py-0.5 text-[11px] font-medium text-secondary-dark">
        {CategoryIcon && <CategoryIcon className="h-3 w-3" aria-hidden="true" />}
        {translate(CATEGORY_LABEL_KEYS[event.category])}
      </span>

      <h3 className="mt-3 text-base font-semibold text-foreground">
        {translate(event.titleKey)}
      </h3>
      <p className="mt-2 flex-1 text-sm text-foreground/70">
        {translate(event.descriptionKey)}
      </p>

      <div className="mt-4 flex flex-col gap-1.5 border-t border-border pt-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/60">
          <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <time dateTime={event.date}>{formatDate(event.date, language)}</time>
        </div>
        {event.locationKey && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/60">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{translate(event.locationKey)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

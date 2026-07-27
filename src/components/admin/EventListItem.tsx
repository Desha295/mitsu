"use client";

import * as Icons from "lucide-react";
import { Pencil, Trash2, CalendarDays, MapPin } from "lucide-react";
import type { EventDoc } from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";
import type { EventCategory } from "@/data/announcements";
import { timestampToDate } from "@/lib/firebase/query-helpers";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing, formatDate } from "@/lib/utils";

interface EventListItemProps {
  event: WithId<EventDoc>;
  onEdit: () => void;
  onDelete: () => void;
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

/**
 * Single row in the admin Events list (components/admin, Sprint 3.4).
 * Reuses the public EventCard's category vocabulary (same icons/labels)
 * and mirrors Sprint 3.3's AnnouncementListItem structure — same
 * published/draft badge, same edit/delete button style — so the two
 * admin lists feel like the same product per 04_DESIGN_SYSTEM.md #23.
 * Unlike announcements, an event's date is the primary, always-shown
 * fact (not just metadata), and category/location are optional.
 */
export function EventListItem({ event, onEdit, onDelete }: EventListItemProps) {
  const { translate, language } = useLanguage();

  const CategoryIcon = isKnownCategory(event.category)
    ? (
        Icons as unknown as Record<
          string,
          React.ComponentType<{ className?: string }>
        >
      )[CATEGORY_ICONS[event.category]]
    : undefined;

  const eventDate = timestampToDate(event.date);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {isKnownCategory(event.category) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary-light px-2.5 py-0.5 text-[11px] font-medium text-secondary-dark">
              {CategoryIcon && (
                <CategoryIcon className="h-3 w-3" aria-hidden="true" />
              )}
              {translate(CATEGORY_LABEL_KEYS[event.category])}
            </span>
          )}
          <span
            className={cx(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
              event.isPublished
                ? "bg-secondary-light text-secondary-dark"
                : "bg-surface-muted text-foreground/50"
            )}
          >
            {translate(
              event.isPublished
                ? "admin.events.status.published"
                : "admin.events.status.draft"
            )}
          </span>
        </div>

        <h3 className="mt-2 truncate text-sm font-semibold text-foreground">
          {event.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-foreground/70">
          {event.description}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-foreground/60">
          {eventDate && (
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {formatDate(eventDate.toISOString(), language)}
            </span>
          )}
          {event.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {event.location}
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          aria-label={translate("admin.events.list.edit")}
          className={cx(
            "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground/70 transition-colors duration-150 hover:bg-surface-muted",
            focusRing
          )}
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={translate("admin.events.list.delete")}
          className={cx(
            "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-primary transition-colors duration-150 hover:bg-primary-light",
            focusRing
          )}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

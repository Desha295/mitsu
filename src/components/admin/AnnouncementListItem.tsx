"use client";

import * as Icons from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import type { AnnouncementDoc } from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";
import type { AnnouncementCategory } from "@/data/announcements";
import { timestampToDate } from "@/lib/firebase/query-helpers";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing, formatDate } from "@/lib/utils";

interface AnnouncementListItemProps {
  announcement: WithId<AnnouncementDoc>;
  onEdit: () => void;
  onDelete: () => void;
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

/**
 * Single row in the admin Announcements list (components/admin, Sprint
 * 3.3). Mirrors the public AnnouncementCard's badge vocabulary — same
 * category icons/labels, same priority emphasis (urgent = solid primary,
 * important = secondary-light, normal = neutral) — so admins see the
 * exact visual language they're managing, per 04_DESIGN_SYSTEM.md's
 * "no unrelated colors" rule.
 */
export function AnnouncementListItem({
  announcement,
  onEdit,
  onDelete,
}: AnnouncementListItemProps) {
  const { translate, language } = useLanguage();

  const knownCategory = isKnownCategory(announcement.category)
    ? announcement.category
    : "general";
  const CategoryIcon = (
    Icons as unknown as Record<
      string,
      React.ComponentType<{ className?: string }>
    >
  )[CATEGORY_ICONS[knownCategory]];

  const isUrgent = announcement.priority === "urgent";
  const isImportant = announcement.priority === "important";
  const createdDate = timestampToDate(announcement.createdAt);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
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
          <span
            className={cx(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
              announcement.isPublished
                ? "bg-secondary-light text-secondary-dark"
                : "bg-surface-muted text-foreground/50"
            )}
          >
            {translate(
              announcement.isPublished
                ? "admin.announcements.status.published"
                : "admin.announcements.status.draft"
            )}
          </span>
        </div>

        <h3 className="mt-2 truncate text-sm font-semibold text-foreground">
          {announcement.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-foreground/70">
          {announcement.description}
        </p>
        {createdDate && (
          <p className="mt-2 text-xs text-foreground/50">
            {formatDate(createdDate.toISOString(), language)}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          aria-label={translate("admin.announcements.list.edit")}
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
          aria-label={translate("admin.announcements.list.delete")}
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

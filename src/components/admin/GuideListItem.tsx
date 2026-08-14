"use client";

import * as Icons from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import type { GuideSectionDoc } from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface GuideListItemProps {
  section: WithId<GuideSectionDoc>;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Single row in the admin Guide sections list (components/admin, Sprint
 * 3.7). Mirrors SystemListItem/CommitteeListItem's structure — icon,
 * active/inactive + order badges, edit/delete buttons — plus a
 * "Highlighted" badge when `highlight` is set (matching GuideCard's own
 * visual emphasis for Important Notes) and small fact/stat counts so an
 * admin can tell at a glance which sections have expandable detail.
 */
export function GuideListItem({ section, onEdit, onDelete }: GuideListItemProps) {
  const { translate, language } = useLanguage();

  const IconComponent = section.icon
    ? (
        Icons as unknown as Record<
          string,
          React.ComponentType<{ className?: string }> | undefined
        >
      )[section.icon]
    : undefined;

  const factCount = section.facts?.length ?? 0;
  const statCount = section.stats?.length ?? 0;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-1 gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
          {IconComponent && <IconComponent className="h-5 w-5" aria-hidden="true" />}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cx(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                section.isActive
                  ? "bg-secondary-light text-secondary-dark"
                  : "bg-surface-muted text-foreground/50"
              )}
            >
              {translate(
                section.isActive
                  ? "admin.guide.status.active"
                  : "admin.guide.status.inactive"
              )}
            </span>
            {section.highlight && (
              <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold text-white">
                {translate("admin.guide.status.highlighted")}
              </span>
            )}
            <span className="inline-flex items-center rounded-full bg-surface-muted px-2.5 py-0.5 text-[11px] font-medium text-foreground/60">
              {translate("admin.guide.list.orderLabel")} {section.order}
            </span>
          </div>

          <h3 className="mt-2 truncate text-sm font-semibold text-foreground">
            {language === "ar" ? section.titleAr : section.titleEn}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-foreground/70">
            {language === "ar" ? section.descriptionAr : section.descriptionEn}
          </p>

          {(factCount > 0 || statCount > 0) && (
            <p className="mt-2 text-xs font-medium text-foreground/50">
              {factCount > 0 &&
                `${translate("admin.guide.list.factsCount")} ${factCount}`}
              {factCount > 0 && statCount > 0 && " · "}
              {statCount > 0 &&
                `${translate("admin.guide.list.statsCount")} ${statCount}`}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          aria-label={translate("admin.guide.list.edit")}
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
          aria-label={translate("admin.guide.list.delete")}
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
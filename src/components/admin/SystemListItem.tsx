"use client";

import * as Icons from "lucide-react";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import type { SystemDoc } from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface SystemListItemProps {
  system: WithId<SystemDoc>;
  onEdit: () => void;
  onDelete: () => void;
}

export function SystemListItem({
  system,
  onEdit,
  onDelete,
}: SystemListItemProps) {
  const { translate, language } = useLanguage();

  const IconComponent = system.icon
    ? (
        Icons as unknown as Record<
          string,
          React.ComponentType<{ className?: string }> | undefined
        >
      )[system.icon]
    : undefined;

  const name = language === "ar" ? system.nameAr : system.nameEn;
  const description =
    language === "ar" ? system.descriptionAr : system.descriptionEn;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-1 gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
          {IconComponent && (
            <IconComponent className="h-5 w-5" aria-hidden="true" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cx(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                system.isActive
                  ? "bg-secondary-light text-secondary-dark"
                  : "bg-surface-muted text-foreground/50"
              )}
            >
              {translate(
                system.isActive
                  ? "admin.systems.status.active"
                  : "admin.systems.status.inactive"
              )}
            </span>

            <span className="inline-flex items-center rounded-full bg-surface-muted px-2.5 py-0.5 text-[11px] font-medium text-foreground/60">
              {translate("admin.systems.list.orderLabel")} {system.order}
            </span>
          </div>

          <h3 className="mt-2 truncate text-sm font-semibold text-foreground">
            {name}
          </h3>

          <p className="mt-1 line-clamp-2 text-sm text-foreground/70">
            {description}
          </p>

          <div className="mt-2">
            {system.officialUrl ? (
              <a
                href={system.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cx(
                  "inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline",
                  focusRing
                )}
              >
                {translate("admin.systems.list.visitLink")}
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            ) : (
              <span className="text-xs font-medium text-foreground/40">
                {translate("common.comingSoon")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          aria-label={translate("admin.systems.list.edit")}
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
          aria-label={translate("admin.systems.list.delete")}
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

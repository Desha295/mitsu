"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { WithId } from "@/lib/firebase/services";
import type { CommitteeDoc } from "@/lib/firebase/collections";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface CommitteeListItemProps {
  committee: WithId<CommitteeDoc>;
  onEdit: () => void;
  onDelete: () => void;
}

export function CommitteeListItem({
  committee,
  onEdit,
  onDelete,
}: CommitteeListItemProps) {
  const { language, translate } = useLanguage();

  const isArabic = language === "ar";

  const name = isArabic ? committee.nameAr : committee.nameEn;
  const description = isArabic
    ? committee.descriptionAr
    : committee.descriptionEn;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        {committee.imageUrl ? (
          <img
            src={committee.imageUrl}
            alt={name}
            className="h-16 w-16 shrink-0 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-surface-muted text-xs text-foreground/40">
            —
          </div>
        )}

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {name}
            </h3>

            <span
              className={cx(
                "rounded-full px-2 py-0.5 text-[11px] font-medium",
                committee.isActive
                  ? "bg-secondary-light text-secondary-dark"
                  : "bg-surface-muted text-foreground/50"
              )}
            >
              {committee.isActive
                ? translate("common.active")
                : translate("common.inactive")}
            </span>
          </div>

          <p className="mt-1 line-clamp-2 text-sm text-foreground/70">
            {description}
          </p>

          <p className="mt-1 text-xs text-foreground/50">
            {translate("admin.union.form.order")}: {committee.order}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          className={cx(
            "inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted",
            focusRing
          )}
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          {translate("common.edit")}
        </button>

        <button
          type="button"
          onClick={onDelete}
          className={cx(
            "inline-flex items-center gap-2 rounded-md border border-primary px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white",
            focusRing
          )}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          {translate("common.delete")}
        </button>
      </div>
    </div>
  );
}
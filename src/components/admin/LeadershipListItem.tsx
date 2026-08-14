"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { LeadershipDoc } from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface LeadershipListItemProps {
  leader: WithId<LeadershipDoc>;
  onEdit: () => void;
  onDelete: () => void;
}

export function LeadershipListItem({
  leader,
  onEdit,
  onDelete,
}: LeadershipListItemProps) {
  const { translate, language } = useLanguage();

  const name = language === "ar" ? leader.nameAr : leader.nameEn;
  const position =
    language === "ar" ? leader.positionAr : leader.positionEn;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cx(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
              leader.isActive
                ? "bg-secondary-light text-secondary-dark"
                : "bg-surface-muted text-foreground/50"
            )}
          >
            {translate(
              leader.isActive
                ? "admin.leadership.status.active"
                : "admin.leadership.status.inactive"
            )}
          </span>

          <span className="inline-flex items-center rounded-full bg-surface-muted px-2.5 py-0.5 text-[11px] font-medium text-foreground/60">
            {translate("admin.leadership.list.orderLabel")} {leader.order}
          </span>
        </div>

        <h3 className="mt-2 truncate text-sm font-semibold text-foreground">
          {name}
        </h3>

        <p className="mt-0.5 truncate text-xs font-medium text-primary">
          {position}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          aria-label={translate("admin.leadership.list.edit")}
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
          aria-label={translate("admin.leadership.list.delete")}
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
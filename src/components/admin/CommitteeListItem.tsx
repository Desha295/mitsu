"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { CommitteeDoc } from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface CommitteeListItemProps {
  committee: WithId<CommitteeDoc>;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Single row in the admin Committees list (components/admin, Sprint
 * 3.5). Mirrors AnnouncementListItem/EventListItem's structure — same
 * edit/delete buttons, same badge shape — but shows an active/inactive
 * badge (CommitteeDoc.isActive, like Hero) instead of published/draft,
 * plus the `order` field that controls this committee's display
 * sequence on the public site. translate() only supports a static
 * key + fallback (no interpolation), so the order label and its value
 * are concatenated the same way admin/page.tsx already concatenates
 * the welcome heading with the signed-in user's name.
 */
export function CommitteeListItem({
  committee,
  onEdit,
  onDelete,
}: CommitteeListItemProps) {
  const { translate } = useLanguage();

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cx(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
              committee.isActive
                ? "bg-secondary-light text-secondary-dark"
                : "bg-surface-muted text-foreground/50"
            )}
          >
            {translate(
              committee.isActive
                ? "admin.union.status.active"
                : "admin.union.status.inactive"
            )}
          </span>
          <span className="inline-flex items-center rounded-full bg-surface-muted px-2.5 py-0.5 text-[11px] font-medium text-foreground/60">
            {translate("admin.union.list.orderLabel")} {committee.order}
          </span>
        </div>

        <h3 className="mt-2 truncate text-sm font-semibold text-foreground">
          {committee.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-foreground/70">
          {committee.description}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          aria-label={translate("admin.union.list.edit")}
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
          aria-label={translate("admin.union.list.delete")}
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

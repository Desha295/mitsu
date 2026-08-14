"use client";

import { Pencil, Trash2, FileText, ExternalLink } from "lucide-react";
import type { DocumentResourceDoc } from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";
import { timestampToDate } from "@/lib/firebase/query-helpers";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing, formatDate } from "@/lib/utils";

interface DocumentListItemProps {
  document: WithId<DocumentResourceDoc>;
  onEdit: () => void;
  onDelete: () => void;
}

export function DocumentListItem({
  document,
  onEdit,
  onDelete,
}: DocumentListItemProps) {
  const { translate, language } = useLanguage();

  const uploadedDate = timestampToDate(document.uploadedAt);

  const title =
    language === "ar" ? document.titleAr : document.titleEn;

  const description =
    language === "ar"
      ? document.descriptionAr
      : document.descriptionEn;

  const category =
    language === "ar"
      ? document.categoryAr
      : document.categoryEn;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-1 gap-3">
        {/* Icon */}
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          {/* Status + Category */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cx(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                document.isPublished
                  ? "bg-secondary-light text-secondary-dark"
                  : "bg-surface-muted text-foreground/50"
              )}
            >
              {translate(
                document.isPublished
                  ? "admin.studyPlans.status.published"
                  : "admin.studyPlans.status.draft"
              )}
            </span>

            {category && (
              <span className="inline-flex items-center rounded-full bg-surface-muted px-2.5 py-0.5 text-[11px] font-medium text-foreground/60">
                {category}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="mt-2 truncate text-sm font-semibold text-foreground">
            {title}
          </h3>

          {/* Description */}
          <p className="mt-1 line-clamp-2 text-sm text-foreground/70">
            {description}
          </p>

          {/* File + Date */}
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <a
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cx(
                "inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline",
                focusRing
              )}
            >
              {translate("admin.studyPlans.list.openFile")}
              <ExternalLink
                className="h-3 w-3"
                aria-hidden="true"
              />
            </a>

            {uploadedDate && (
              <span className="text-xs text-foreground/50">
                {formatDate(
                  uploadedDate.toISOString(),
                  language
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          aria-label={translate("admin.studyPlans.list.edit")}
          className={cx(
            "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground/70 transition-colors duration-150 hover:bg-surface-muted",
            focusRing
          )}
        >
          <Pencil
            className="h-4 w-4"
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          onClick={onDelete}
          aria-label={translate("admin.studyPlans.list.delete")}
          className={cx(
            "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-primary transition-colors duration-150 hover:bg-primary-light",
            focusRing
          )}
        >
          <Trash2
            className="h-4 w-4"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
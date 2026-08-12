"use client";

import { useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import type { AnnouncementDoc } from "@/lib/firebase/collections";
import type {
  AnnouncementCategory,
  AnnouncementPriority,
} from "@/data/announcements";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing, isValidHref } from "@/lib/utils";

interface AnnouncementFormProps {
  initialValues: AnnouncementDoc;
  onSubmit: (values: AnnouncementDoc) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
  submittingLabel: string;
  cancelLabel?: string;
}

/**
 * Reuses the public site's own taxonomy (src/data/announcements.ts,
 * src/locales "announcements.filters.*"/"announcements.priority.*")
 * instead of inventing a separate admin vocabulary — same values an
 * admin sees on /announcements are the only ones they can pick here.
 */
const CATEGORY_VALUES: AnnouncementCategory[] = [
  "general",
  "academic",
  "deadline",
  "event",
  "orientation",
];

const CATEGORY_LABEL_KEYS: Record<AnnouncementCategory, string> = {
  academic: "announcements.filters.academic",
  deadline: "announcements.filters.deadline",
  general: "announcements.filters.general",
  event: "announcements.filters.event",
  orientation: "announcements.filters.orientation",
};

const PRIORITY_VALUES: AnnouncementPriority[] = [
  "normal",
  "important",
  "urgent",
];

const PRIORITY_LABEL_KEYS: Record<AnnouncementPriority, string> = {
  normal: "announcements.priority.normal",
  important: "announcements.priority.important",
  urgent: "announcements.priority.urgent",
};

/**
 * Announcement content form (components/admin, Sprint 3.3). Reused for
 * both creating and editing (same component, different `onSubmit`) —
 * same shape as Sprint 3.2's HeroForm. Image upload wired to Sprint
 * 2.2's uploadImage() and Sprint 2.3's isValidImageFile(), identical
 * flow to HeroForm's, just a different storage path.
 */
export function AnnouncementForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  submittingLabel,
  cancelLabel,
}: AnnouncementFormProps) {
  const { translate } = useLanguage();
  const [values, setValues] = useState<AnnouncementDoc>(initialValues);
  const [isPublished, setIsPublished] = useState(initialValues.isPublished);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof AnnouncementDoc, string>>
  >({});

  const REQUIRED_FIELDS: Array<keyof AnnouncementDoc> = [
    "title",
    "description",
  ];

  function validate(): boolean {
    const errors: Partial<Record<keyof AnnouncementDoc, string>> = {};

    for (const field of REQUIRED_FIELDS) {
      if (!String(values[field] ?? "").trim()) {
        errors[field] = translate("admin.announcements.form.required");
      }
    }

    const imageUrl = String(values.imageUrl ?? "").trim();
    if (imageUrl && !isValidHref(imageUrl)) {
      errors.imageUrl = translate("admin.announcements.form.invalidUrl");
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

 function updateField(
  name:
    | "title"
    | "description"
    | "imageUrl"
    | "category"
    | "mediaImageUrl"
    | "mediaFileUrl"
    | "mediaVideoUrl",
  value: string
) {
  setValues((prev) => ({ ...prev, [name]: value }));

  setFieldErrors((prev) => {
    if (!prev[name]) return prev;

    const next = { ...prev };
    delete next[name];
    return next;
  });
}{ 
  }

  function updatePriority(value: AnnouncementPriority) {
    setValues((prev) => ({ ...prev, priority: value }));
  }

  

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({ ...values, isPublished });
    } catch {
      setError(translate("admin.announcements.form.error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label
          htmlFor="announcement-title"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.announcements.form.title")}
        </label>
        <input
          id="announcement-title"
          type="text"
          value={values.title}
          onChange={(event) => updateField("title", event.target.value)}
          aria-invalid={Boolean(fieldErrors.title)}
          className={cx(
            "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.title ? "border-primary" : "border-border",
            focusRing
          )}
        />
        {fieldErrors.title && (
          <p role="alert" className="mt-1 text-xs font-medium text-primary">
            {fieldErrors.title}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="announcement-description"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.announcements.form.description")}
        </label>
        <textarea
          id="announcement-description"
          rows={4}
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
          aria-invalid={Boolean(fieldErrors.description)}
          className={cx(
            "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.description ? "border-primary" : "border-border",
            focusRing
          )}
        />
        {fieldErrors.description && (
          <p role="alert" className="mt-1 text-xs font-medium text-primary">
            {fieldErrors.description}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="announcement-category"
            className="text-sm font-medium text-foreground"
          >
            {translate("admin.announcements.form.category")}
          </label>
          <select
            id="announcement-category"
            value={values.category}
            onChange={(event) => updateField("category", event.target.value)}
            className={cx(
              "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              focusRing
            )}
          >
            {CATEGORY_VALUES.map((category) => (
              <option key={category} value={category}>
                {translate(CATEGORY_LABEL_KEYS[category])}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="announcement-priority"
            className="text-sm font-medium text-foreground"
          >
            {translate("admin.announcements.form.priority")}
          </label>
          <select
            id="announcement-priority"
            value={values.priority}
            onChange={(event) =>
              updatePriority(event.target.value as AnnouncementPriority)
            }
            className={cx(
              "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              focusRing
            )}
          >
            {PRIORITY_VALUES.map((priority) => (
              <option key={priority} value={priority}>
                {translate(PRIORITY_LABEL_KEYS[priority])}
              </option>
            ))}
          </select>
        </div>
      </div>

       
<div className="grid gap-5 sm:grid-cols-2">
  <div>
    <label
      htmlFor="announcement-media-image-url"
      className="text-sm font-medium text-foreground"
    >
      رابط الصورة
    </label>
    <input
      id="announcement-media-image-url"
      type="url"
      value={values.mediaImageUrl ?? ""}
      onChange={(event) =>
        updateField("mediaImageUrl", event.target.value)
      }
      className={cx(
        "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
        focusRing
      )}
      placeholder="https://..."
    />
  </div>

  <div>
    <label
      htmlFor="announcement-media-file-url"
      className="text-sm font-medium text-foreground"
    >
      رابط الملف
    </label>
    <input
      id="announcement-media-file-url"
      type="url"
      value={values.mediaFileUrl ?? ""}
      onChange={(event) =>
        updateField("mediaFileUrl", event.target.value)
      }
      className={cx(
        "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
        focusRing
      )}
      placeholder="https://..."
    />
  </div>

  <div className="sm:col-span-2">
    <label
      htmlFor="announcement-media-video-url"
      className="text-sm font-medium text-foreground"
    >
      رابط الفيديو
    </label>
    <input
      id="announcement-media-video-url"
      type="url"
      value={values.mediaVideoUrl ?? ""}
      onChange={(event) =>
        updateField("mediaVideoUrl", event.target.value)
      }
      className={cx(
        "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
        focusRing
      )}
      placeholder="https://..."
    />
  </div>
</div>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(event) => setIsPublished(event.target.checked)}
          className={cx("h-4 w-4 rounded border-border", focusRing)}
        />
        {translate("admin.announcements.form.isPublished")}
      </label>

      {error && (
        <p role="alert" className="text-sm font-medium text-primary">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting }
          className={cx(
            "inline-flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-dark disabled:opacity-60",
            focusRing
          )}
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {submitting ? submittingLabel : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className={cx(
              "rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-surface-muted disabled:opacity-60",
              focusRing
            )}
          >
            {cancelLabel ?? translate("admin.announcements.form.cancel")}
          </button>
        )}
      </div>
    </form>
  );
}

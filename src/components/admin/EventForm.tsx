"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Save, Upload } from "lucide-react";
import type { EventDoc } from "@/lib/firebase/collections";
import {
  timestampToDate,
  dateToTimestamp,
} from "@/lib/firebase/query-helpers";
import type { EventCategory } from "@/data/announcements";
import { uploadImage } from "@/lib/firebase/storage";
import { isValidImageFile } from "@/lib/auth/validation";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing, isValidHref } from "@/lib/utils";

interface EventFormProps {
  initialValues: EventDoc;
  onSubmit: (values: EventDoc) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
  submittingLabel: string;
  cancelLabel?: string;
}

const CATEGORY_VALUES: EventCategory[] = [
  "academic",
  "orientation",
  "cultural",
  "sports",
  "social",
];

const CATEGORY_LABEL_KEYS: Record<EventCategory, string> = {
  academic: "events.categories.academic",
  orientation: "events.categories.orientation",
  cultural: "events.categories.cultural",
  sports: "events.categories.sports",
  social: "events.categories.social",
};

type TextField =
  | "titleAr"
  | "titleEn"
  | "descriptionAr"
  | "descriptionEn"
  | "locationAr"
  | "locationEn"
  | "imageUrl"
  | "category";

export function EventForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  submittingLabel,
  cancelLabel,
}: EventFormProps) {
  const { translate } = useLanguage();

  const [values, setValues] = useState<EventDoc>(initialValues);

  const [dateInput, setDateInput] = useState(() => {
    const date = timestampToDate(initialValues.date);
    return date ? date.toISOString().slice(0, 10) : "";
  });

  const [isPublished, setIsPublished] = useState(
    initialValues.isPublished
  );

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<TextField | "date", string>>
  >({});

  const REQUIRED_FIELDS: TextField[] = [
    "titleAr",
    "titleEn",
    "descriptionAr",
    "descriptionEn",
  ];

  function validate(): boolean {
    const errors: Partial<Record<TextField | "date", string>> = {};

    for (const field of REQUIRED_FIELDS) {
      if (!String(values[field] ?? "").trim()) {
        errors[field] = translate("admin.events.form.required");
      }
    }

    if (!dateInput.trim()) {
      errors.date = translate("admin.events.form.required");
    } else if (Number.isNaN(new Date(dateInput).getTime())) {
      errors.date = translate("admin.events.form.invalidDate");
    }

    const imageUrl = String(values.imageUrl ?? "").trim();

    if (imageUrl && !isValidHref(imageUrl)) {
      errors.imageUrl = translate("admin.events.form.invalidUrl");
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  }

  function updateField(name: TextField, value: string) {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => {
      if (!prev[name]) return prev;

      const next = { ...prev };
      delete next[name];

      return next;
    });
  }

  function updateDate(value: string) {
    setDateInput(value);

    setFieldErrors((prev) => {
      if (!prev.date) return prev;

      const next = { ...prev };
      delete next.date;

      return next;
    });
  }

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    setUploadError(null);

    if (!isValidImageFile(file)) {
      setUploadError(
        translate("admin.events.form.imageInvalid")
      );
      return;
    }

    setUploading(true);

    try {
      const path = `images/events/${Date.now()}-${file.name}`;

      const url = await uploadImage(path, file);

      updateField("imageUrl", url);
    } catch {
      setUploadError(
        translate("admin.events.form.imageUploadError")
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

    if (!validate()) return;

    setSubmitting(true);

    try {
      await onSubmit({
        ...values,
        date: dateToTimestamp(new Date(dateInput)),
        isPublished,
      });
    } catch {
      setError(
        translate("admin.events.form.error")
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Arabic Title */}
      <div>
        <label
          htmlFor="event-title-ar"
          className="text-sm font-medium text-foreground"
        >
          العنوان بالعربية
        </label>

        <input
          id="event-title-ar"
          type="text"
          dir="rtl"
          value={values.titleAr}
          onChange={(event) =>
            updateField("titleAr", event.target.value)
          }
          aria-invalid={Boolean(fieldErrors.titleAr)}
          className={cx(
            "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.titleAr
              ? "border-primary"
              : "border-border",
            focusRing
          )}
        />

        {fieldErrors.titleAr && (
          <p
            role="alert"
            className="mt-1 text-xs font-medium text-primary"
          >
            {fieldErrors.titleAr}
          </p>
        )}
      </div>

      {/* English Title */}
      <div>
        <label
          htmlFor="event-title-en"
          className="text-sm font-medium text-foreground"
        >
          English Title
        </label>

        <input
          id="event-title-en"
          type="text"
          dir="ltr"
          value={values.titleEn}
          onChange={(event) =>
            updateField("titleEn", event.target.value)
          }
          aria-invalid={Boolean(fieldErrors.titleEn)}
          className={cx(
            "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.titleEn
              ? "border-primary"
              : "border-border",
            focusRing
          )}
        />

        {fieldErrors.titleEn && (
          <p
            role="alert"
            className="mt-1 text-xs font-medium text-primary"
          >
            {fieldErrors.titleEn}
          </p>
        )}
      </div>

      {/* Arabic Description */}
      <div>
        <label
          htmlFor="event-description-ar"
          className="text-sm font-medium text-foreground"
        >
          الوصف بالعربية
        </label>

        <textarea
          id="event-description-ar"
          rows={4}
          dir="rtl"
          value={values.descriptionAr}
          onChange={(event) =>
            updateField(
              "descriptionAr",
              event.target.value
            )
          }
          aria-invalid={Boolean(
            fieldErrors.descriptionAr
          )}
          className={cx(
            "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.descriptionAr
              ? "border-primary"
              : "border-border",
            focusRing
          )}
        />

        {fieldErrors.descriptionAr && (
          <p
            role="alert"
            className="mt-1 text-xs font-medium text-primary"
          >
            {fieldErrors.descriptionAr}
          </p>
        )}
      </div>

      {/* English Description */}
      <div>
        <label
          htmlFor="event-description-en"
          className="text-sm font-medium text-foreground"
        >
          English Description
        </label>

        <textarea
          id="event-description-en"
          rows={4}
          dir="ltr"
          value={values.descriptionEn}
          onChange={(event) =>
            updateField(
              "descriptionEn",
              event.target.value
            )
          }
          aria-invalid={Boolean(
            fieldErrors.descriptionEn
          )}
          className={cx(
            "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.descriptionEn
              ? "border-primary"
              : "border-border",
            focusRing
          )}
        />

        {fieldErrors.descriptionEn && (
          <p
            role="alert"
            className="mt-1 text-xs font-medium text-primary"
          >
            {fieldErrors.descriptionEn}
          </p>
        )}
      </div>

      {/* Date + Location */}
      <div className="grid gap-5 sm:grid-cols-2">

        {/* Date */}
        <div>
          <label
            htmlFor="event-date"
            className="text-sm font-medium text-foreground"
          >
            {translate("admin.events.form.date")}
          </label>

          <input
            id="event-date"
            type="date"
            value={dateInput}
            onChange={(event) =>
              updateDate(event.target.value)
            }
            aria-invalid={Boolean(fieldErrors.date)}
            className={cx(
              "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
              fieldErrors.date
                ? "border-primary"
                : "border-border",
              focusRing
            )}
          />

          {fieldErrors.date && (
            <p
              role="alert"
              className="mt-1 text-xs font-medium text-primary"
            >
              {fieldErrors.date}
            </p>
          )}
        </div>

        {/* Arabic Location */}
        <div>
          <label
            htmlFor="event-location-ar"
            className="text-sm font-medium text-foreground"
          >
            المكان بالعربية
          </label>

          <input
            id="event-location-ar"
            type="text"
            dir="rtl"
            value={values.locationAr ?? ""}
            onChange={(event) =>
              updateField(
                "locationAr",
                event.target.value
              )
            }
            className={cx(
              "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              focusRing
            )}
          />
        </div>

        {/* English Location */}
        <div>
          <label
            htmlFor="event-location-en"
            className="text-sm font-medium text-foreground"
          >
            Location in English
          </label>

          <input
            id="event-location-en"
            type="text"
            dir="ltr"
            value={values.locationEn ?? ""}
            onChange={(event) =>
              updateField(
                "locationEn",
                event.target.value
              )
            }
            className={cx(
              "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              focusRing
            )}
          />
        </div>

      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="event-category"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.events.form.category")}
        </label>

        <select
          id="event-category"
          value={values.category ?? ""}
          onChange={(event) =>
            updateField(
              "category",
              event.target.value
            )
          }
          className={cx(
            "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
            focusRing
          )}
        >
          <option value="">
            {translate(
              "admin.events.form.noCategory"
            )}
          </option>

          {CATEGORY_VALUES.map((category) => (
            <option key={category} value={category}>
              {translate(
                CATEGORY_LABEL_KEYS[category]
              )}
            </option>
          ))}
        </select>
      </div>

      {/* Image URL */}
      <div>
        <label
          htmlFor="event-image-url"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.events.form.imageUrl")}
        </label>

        <input
          id="event-image-url"
          type="url"
          value={values.imageUrl ?? ""}
          onChange={(event) =>
            updateField(
              "imageUrl",
              event.target.value
            )
          }
          aria-invalid={Boolean(
            fieldErrors.imageUrl
          )}
          className={cx(
            "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.imageUrl
              ? "border-primary"
              : "border-border",
            focusRing
          )}
        />

        {fieldErrors.imageUrl && (
          <p
            role="alert"
            className="mt-1 text-xs font-medium text-primary"
          >
            {fieldErrors.imageUrl}
          </p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label
          htmlFor="event-image-upload"
          className="text-sm font-medium text-foreground"
        >
          {translate(
            "admin.events.form.uploadImage"
          )}
        </label>

        <div className="mt-1 flex items-center gap-3">

          <label
            htmlFor="event-image-upload"
            className={cx(
              "inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-surface-muted",
              focusRing
            )}
          >
            <Upload
              className="h-4 w-4"
              aria-hidden="true"
            />

            {uploading
              ? translate(
                  "admin.events.form.uploading"
                )
              : translate(
                  "admin.events.form.chooseImage"
                )}
          </label>

          <input
            id="event-image-upload"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            disabled={uploading}
            onChange={handleImageUpload}
            className="sr-only"
          />

          {values.imageUrl && !uploading && (
            <span className="truncate text-xs text-foreground/50">
              {values.imageUrl}
            </span>
          )}

        </div>

        {uploadError && (
          <p
            role="alert"
            className="mt-1 text-sm font-medium text-primary"
          >
            {uploadError}
          </p>
        )}
      </div>

      {/* Published */}
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(event) =>
            setIsPublished(event.target.checked)
          }
          className={cx(
            "h-4 w-4 rounded border-border",
            focusRing
          )}
        />

        {translate(
          "admin.events.form.isPublished"
        )}
      </label>

      {/* Error */}
      {error && (
        <p
          role="alert"
          className="text-sm font-medium text-primary"
        >
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">

        <button
          type="submit"
          disabled={submitting || uploading}
          className={cx(
            "inline-flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-dark disabled:opacity-60",
            focusRing
          )}
        >
          <Save
            className="h-4 w-4"
            aria-hidden="true"
          />

          {submitting
            ? submittingLabel
            : submitLabel}
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
            {cancelLabel ??
              translate(
                "admin.events.form.cancel"
              )}
          </button>
        )}

      </div>
    </form>
  );
}
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Save, Upload } from "lucide-react";
import type { EventDoc } from "@/lib/firebase/collections";
import { timestampToDate, dateToTimestamp } from "@/lib/firebase/query-helpers";
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

/**
 * Reuses the public site's own event taxonomy (src/data/announcements.ts's
 * EventCategory, src/locales "events.categories.*") instead of inventing a
 * separate admin vocabulary — same values an admin sees on /announcements'
 * Events section are the only ones they can pick here. Unlike Announcement's
 * category, EventDoc.category is optional, so an empty "no category" option
 * is offered first.
 */
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

type TextField = "title" | "description" | "location" | "imageUrl" | "category";

/**
 * Event content form (components/admin, Sprint 3.4). Reused for both
 * creating and editing (same component, different `onSubmit`) — same
 * shape as Sprint 3.2's HeroForm / Sprint 3.3's AnnouncementForm.
 *
 * EventDoc.date is a Firestore Timestamp, which an <input type="date">
 * can't bind to directly, so it's tracked as its own `dateInput` string
 * state (mirroring how isActive/isPublished are already tracked outside
 * the generic `values` object in HeroForm/AnnouncementForm) and only
 * converted back via the existing dateToTimestamp() helper on submit.
 */
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
  const [isPublished, setIsPublished] = useState(initialValues.isPublished);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<TextField | "date", string>>
  >({});

  const REQUIRED_FIELDS: TextField[] = ["title", "description"];

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
    setValues((prev) => ({ ...prev, [name]: value }));
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

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadError(null);

    if (!isValidImageFile(file)) {
      setUploadError(translate("admin.events.form.imageInvalid"));
      return;
    }

    setUploading(true);
    try {
      const path = `images/events/${Date.now()}-${file.name}`;
      const url = await uploadImage(path, file);
      updateField("imageUrl", url);
    } catch {
      setUploadError(translate("admin.events.form.imageUploadError"));
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
      setError(translate("admin.events.form.error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="event-title" className="text-sm font-medium text-foreground">
          {translate("admin.events.form.title")}
        </label>
        <input
          id="event-title"
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
          htmlFor="event-description"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.events.form.description")}
        </label>
        <textarea
          id="event-description"
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
          <label htmlFor="event-date" className="text-sm font-medium text-foreground">
            {translate("admin.events.form.date")}
          </label>
          <input
            id="event-date"
            type="date"
            value={dateInput}
            onChange={(event) => updateDate(event.target.value)}
            aria-invalid={Boolean(fieldErrors.date)}
            className={cx(
              "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
              fieldErrors.date ? "border-primary" : "border-border",
              focusRing
            )}
          />
          {fieldErrors.date && (
            <p role="alert" className="mt-1 text-xs font-medium text-primary">
              {fieldErrors.date}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="event-location"
            className="text-sm font-medium text-foreground"
          >
            {translate("admin.events.form.location")}
          </label>
          <input
            id="event-location"
            type="text"
            value={values.location ?? ""}
            onChange={(event) => updateField("location", event.target.value)}
            className={cx(
              "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              focusRing
            )}
          />
        </div>
      </div>

      <div>
        <label htmlFor="event-category" className="text-sm font-medium text-foreground">
          {translate("admin.events.form.category")}
        </label>
        <select
          id="event-category"
          value={values.category ?? ""}
          onChange={(event) => updateField("category", event.target.value)}
          className={cx(
            "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
            focusRing
          )}
        >
          <option value="">{translate("admin.events.form.noCategory")}</option>
          {CATEGORY_VALUES.map((category) => (
            <option key={category} value={category}>
              {translate(CATEGORY_LABEL_KEYS[category])}
            </option>
          ))}
        </select>
      </div>

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
          onChange={(event) => updateField("imageUrl", event.target.value)}
          aria-invalid={Boolean(fieldErrors.imageUrl)}
          className={cx(
            "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.imageUrl ? "border-primary" : "border-border",
            focusRing
          )}
        />
        {fieldErrors.imageUrl && (
          <p role="alert" className="mt-1 text-xs font-medium text-primary">
            {fieldErrors.imageUrl}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="event-image-upload"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.events.form.uploadImage")}
        </label>
        <div className="mt-1 flex items-center gap-3">
          <label
            htmlFor="event-image-upload"
            className={cx(
              "inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-surface-muted",
              focusRing
            )}
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            {uploading
              ? translate("admin.events.form.uploading")
              : translate("admin.events.form.chooseImage")}
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
          <p role="alert" className="mt-1 text-sm font-medium text-primary">
            {uploadError}
          </p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={isPublished}
          onChange={(event) => setIsPublished(event.target.checked)}
          className={cx("h-4 w-4 rounded border-border", focusRing)}
        />
        {translate("admin.events.form.isPublished")}
      </label>

      {error && (
        <p role="alert" className="text-sm font-medium text-primary">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting || uploading}
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
            {cancelLabel ?? translate("admin.events.form.cancel")}
          </button>
        )}
      </div>
    </form>
  );
}

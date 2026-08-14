"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Save, Upload } from "lucide-react";
import type { DocumentResourceDoc } from "@/lib/firebase/collections";
import { uploadDocument } from "@/lib/firebase/storage";
import { isValidDocumentFile } from "@/lib/auth/validation";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing, isValidHref } from "@/lib/utils";

interface DocumentFormProps {
  initialValues: DocumentResourceDoc;
  onSubmit: (values: DocumentResourceDoc) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
  submittingLabel: string;
  cancelLabel?: string;
}

type TextField =
  | "titleAr"
  | "titleEn"
  | "descriptionAr"
  | "descriptionEn"
  | "categoryAr"
  | "categoryEn"
  | "fileUrl";

const PDF_MIME_TYPE = "application/pdf";

export function DocumentForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  submittingLabel,
  cancelLabel,
}: DocumentFormProps) {
  const { translate } = useLanguage();

  const [values, setValues] =
    useState<DocumentResourceDoc>(initialValues);

  const [isPublished, setIsPublished] = useState(
    initialValues.isPublished
  );

  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<TextField, string>>
  >({});

  const REQUIRED_FIELDS: TextField[] = [
    "titleAr",
    "titleEn",
    "descriptionAr",
    "descriptionEn",
    "categoryAr",
    "categoryEn",
  ];

  function validate(): boolean {
    const errors: Partial<Record<TextField, string>> = {};

    for (const field of REQUIRED_FIELDS) {
      if (!String(values[field] ?? "").trim()) {
        errors[field] = translate(
          "admin.studyPlans.form.required"
        );
      }
    }

    const fileUrl = String(values.fileUrl ?? "").trim();

    if (!fileUrl) {
      errors.fileUrl = translate(
        "admin.studyPlans.form.required"
      );
    } else if (!isValidHref(fileUrl)) {
      errors.fileUrl = translate(
        "admin.studyPlans.form.invalidUrl"
      );
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

  async function handleFileUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    setUploadError(null);

    if (
      file.type !== PDF_MIME_TYPE ||
      !isValidDocumentFile(file)
    ) {
      setUploadError(
        translate("admin.studyPlans.form.fileInvalid")
      );
      return;
    }

    setUploading(true);

    try {
      const path = `documents/study-plans/${Date.now()}-${file.name}`;

      const url = await uploadDocument(path, file);

      updateField("fileUrl", url);
    } catch {
      setUploadError(
        translate(
          "admin.studyPlans.form.fileUploadError"
        )
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
        isPublished,
      });
    } catch {
      setError(
        translate("admin.studyPlans.form.error")
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      {/* Arabic title */}
      <div>
        <label
          htmlFor="document-title-ar"
          className="text-sm font-medium text-foreground"
        >
          العنوان بالعربية
        </label>

        <input
          id="document-title-ar"
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

      {/* English title */}
      <div>
        <label
          htmlFor="document-title-en"
          className="text-sm font-medium text-foreground"
        >
          Title in English
        </label>

        <input
          id="document-title-en"
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

      {/* Arabic description */}
      <div>
        <label
          htmlFor="document-description-ar"
          className="text-sm font-medium text-foreground"
        >
          الوصف بالعربية
        </label>

        <textarea
          id="document-description-ar"
          rows={3}
          dir="rtl"
          value={values.descriptionAr}
          onChange={(event) =>
            updateField(
              "descriptionAr",
              event.target.value
            )
          }
          aria-invalid={Boolean(fieldErrors.descriptionAr)}
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

      {/* English description */}
      <div>
        <label
          htmlFor="document-description-en"
          className="text-sm font-medium text-foreground"
        >
          Description in English
        </label>

        <textarea
          id="document-description-en"
          rows={3}
          dir="ltr"
          value={values.descriptionEn}
          onChange={(event) =>
            updateField(
              "descriptionEn",
              event.target.value
            )
          }
          aria-invalid={Boolean(fieldErrors.descriptionEn)}
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

      {/* Arabic category */}
      <div>
        <label
          htmlFor="document-category-ar"
          className="text-sm font-medium text-foreground"
        >
          التصنيف بالعربية
        </label>

        <input
          id="document-category-ar"
          type="text"
          dir="rtl"
          value={values.categoryAr}
          onChange={(event) =>
            updateField("categoryAr", event.target.value)
          }
          placeholder="مثال: خطط دراسية"
          aria-invalid={Boolean(fieldErrors.categoryAr)}
          className={cx(
            "mt-1 w-full max-w-xs rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.categoryAr
              ? "border-primary"
              : "border-border",
            focusRing
          )}
        />

        {fieldErrors.categoryAr && (
          <p
            role="alert"
            className="mt-1 text-xs font-medium text-primary"
          >
            {fieldErrors.categoryAr}
          </p>
        )}
      </div>

      {/* English category */}
      <div>
        <label
          htmlFor="document-category-en"
          className="text-sm font-medium text-foreground"
        >
          Category in English
        </label>

        <input
          id="document-category-en"
          type="text"
          dir="ltr"
          value={values.categoryEn}
          onChange={(event) =>
            updateField("categoryEn", event.target.value)
          }
          placeholder="e.g. Study Plans"
          aria-invalid={Boolean(fieldErrors.categoryEn)}
          className={cx(
            "mt-1 w-full max-w-xs rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.categoryEn
              ? "border-primary"
              : "border-border",
            focusRing
          )}
        />

        {fieldErrors.categoryEn && (
          <p
            role="alert"
            className="mt-1 text-xs font-medium text-primary"
          >
            {fieldErrors.categoryEn}
          </p>
        )}
      </div>

      {/* File URL */}
      <div>
        <label
          htmlFor="document-file-url"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.studyPlans.form.fileUrl")}
        </label>

        <input
          id="document-file-url"
          type="url"
          dir="ltr"
          value={values.fileUrl}
          onChange={(event) =>
            updateField("fileUrl", event.target.value)
          }
          aria-invalid={Boolean(fieldErrors.fileUrl)}
          className={cx(
            "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.fileUrl
              ? "border-primary"
              : "border-border",
            focusRing
          )}
        />

        {fieldErrors.fileUrl && (
          <p
            role="alert"
            className="mt-1 text-xs font-medium text-primary"
          >
            {fieldErrors.fileUrl}
          </p>
        )}
      </div>

      {/* Upload */}
      <div>
        <label
          htmlFor="document-file-upload"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.studyPlans.form.uploadFile")}
        </label>

        <div className="mt-1 flex items-center gap-3">
          <label
            htmlFor="document-file-upload"
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
                  "admin.studyPlans.form.uploading"
                )
              : translate(
                  "admin.studyPlans.form.choosePdf"
                )}
          </label>

          <input
            id="document-file-upload"
            type="file"
            accept="application/pdf"
            disabled={uploading}
            onChange={handleFileUpload}
            className="sr-only"
          />

          {values.fileUrl && !uploading && (
            <span className="truncate text-xs text-foreground/50">
              {values.fileUrl}
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
          "admin.studyPlans.form.isPublished"
        )}
      </label>

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
                "admin.studyPlans.form.cancel"
              )}
          </button>
        )}
      </div>
    </form>
  );
}
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

type TextField = "title" | "description" | "category" | "fileUrl";

const PDF_MIME_TYPE = "application/pdf";

/**
 * Document/Study Plan form (components/admin, Sprint 3.10). Same
 * create/edit shape as AnnouncementForm — a manual URL field
 * (`fileUrl`) plus an upload control that fills it in. `category` has
 * no fixed vocabulary anywhere in the schema or public site (unlike
 * Announcement/Event's category, which reuses an established public
 * taxonomy), so it's a plain required text field rather than a
 * `<select>` — inventing a fixed list here would mean guessing an
 * official taxonomy that doesn't exist yet.
 *
 * Upload reuses Sprint 2.3's already-built `isValidDocumentFile` (size
 * only, 10MB) plus an explicit PDF MIME-type check added here in the
 * form, since the shared validator intentionally stays generic (it may
 * back other document types later). Uploads via the new
 * `uploadDocument()` storage helper, which is otherwise identical to
 * `uploadImage()` — Storage doesn't care about content type, only the
 * name differs for callers' clarity.
 */
export function DocumentForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  submittingLabel,
  cancelLabel,
}: DocumentFormProps) {
  const { translate } = useLanguage();
  const [values, setValues] = useState<DocumentResourceDoc>(initialValues);
  const [isPublished, setIsPublished] = useState(initialValues.isPublished);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<TextField, string>>
  >({});

  const REQUIRED_FIELDS: TextField[] = ["title", "description", "category"];

  function validate(): boolean {
    const errors: Partial<Record<TextField, string>> = {};

    for (const field of REQUIRED_FIELDS) {
      if (!String(values[field] ?? "").trim()) {
        errors[field] = translate("admin.studyPlans.form.required");
      }
    }

    const fileUrl = String(values.fileUrl ?? "").trim();
    if (!fileUrl) {
      errors.fileUrl = translate("admin.studyPlans.form.required");
    } else if (!isValidHref(fileUrl)) {
      errors.fileUrl = translate("admin.studyPlans.form.invalidUrl");
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

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadError(null);

    if (file.type !== PDF_MIME_TYPE || !isValidDocumentFile(file)) {
      setUploadError(translate("admin.studyPlans.form.fileInvalid"));
      return;
    }

    setUploading(true);
    try {
      const path = `documents/study-plans/${Date.now()}-${file.name}`;
      const url = await uploadDocument(path, file);
      updateField("fileUrl", url);
    } catch {
      setUploadError(translate("admin.studyPlans.form.fileUploadError"));
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
      await onSubmit({ ...values, isPublished });
    } catch {
      setError(translate("admin.studyPlans.form.error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="document-title" className="text-sm font-medium text-foreground">
          {translate("admin.studyPlans.form.title")}
        </label>
        <input
          id="document-title"
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
          htmlFor="document-description"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.studyPlans.form.description")}
        </label>
        <textarea
          id="document-description"
          rows={3}
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

      <div>
        <label
          htmlFor="document-category"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.studyPlans.form.category")}
        </label>
        <input
          id="document-category"
          type="text"
          value={values.category}
          onChange={(event) => updateField("category", event.target.value)}
          placeholder={translate("admin.studyPlans.form.categoryPlaceholder")}
          aria-invalid={Boolean(fieldErrors.category)}
          className={cx(
            "mt-1 w-full max-w-xs rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.category ? "border-primary" : "border-border",
            focusRing
          )}
        />
        {fieldErrors.category && (
          <p role="alert" className="mt-1 text-xs font-medium text-primary">
            {fieldErrors.category}
          </p>
        )}
      </div>

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
          value={values.fileUrl}
          onChange={(event) => updateField("fileUrl", event.target.value)}
          aria-invalid={Boolean(fieldErrors.fileUrl)}
          className={cx(
            "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.fileUrl ? "border-primary" : "border-border",
            focusRing
          )}
        />
        {fieldErrors.fileUrl && (
          <p role="alert" className="mt-1 text-xs font-medium text-primary">
            {fieldErrors.fileUrl}
          </p>
        )}
      </div>

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
            <Upload className="h-4 w-4" aria-hidden="true" />
            {uploading
              ? translate("admin.studyPlans.form.uploading")
              : translate("admin.studyPlans.form.choosePdf")}
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
        {translate("admin.studyPlans.form.isPublished")}
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
            {cancelLabel ?? translate("admin.studyPlans.form.cancel")}
          </button>
        )}
      </div>
    </form>
  );
}

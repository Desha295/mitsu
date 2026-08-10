"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Save, Upload } from "lucide-react";
import type { FacultyLeadershipDoc } from "@/lib/firebase/collections";
import { uploadImage } from "@/lib/firebase/storage";
import { isValidImageFile } from "@/lib/auth/validation";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing, isValidHref } from "@/lib/utils";

interface FacultyLeadershipFormProps {
  initialValues: FacultyLeadershipDoc;
  onSubmit: (values: FacultyLeadershipDoc) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
  submittingLabel: string;
  cancelLabel?: string;
}

type TextField = "name" | "role" | "imageUrl";

/**
 * Faculty Leadership member form (components/admin, Sprint 7.0). Same
 * create/edit shape as LeadershipForm — `FacultyLeadershipDoc` is
 * nearly identical (name, role, imageUrl?, order, isActive), minus
 * Leadership's optional `bio` (not part of this schema). `order` stays
 * an isolated string state, `isActive` an isolated boolean — same
 * pattern used in every prior form. Image upload wired to the same
 * `uploadImage()`/`isValidImageFile()` as every other form, just a
 * different storage path.
 */
export function FacultyLeadershipForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  submittingLabel,
  cancelLabel,
}: FacultyLeadershipFormProps) {
  const { translate } = useLanguage();
  const [values, setValues] = useState<FacultyLeadershipDoc>(initialValues);
  const [orderInput, setOrderInput] = useState(String(initialValues.order));
  const [isActive, setIsActive] = useState(initialValues.isActive);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<TextField | "order", string>>
  >({});

  const REQUIRED_FIELDS: TextField[] = ["name", "role"];

  function validate(): boolean {
    const errors: Partial<Record<TextField | "order", string>> = {};

    for (const field of REQUIRED_FIELDS) {
      if (!String(values[field] ?? "").trim()) {
        errors[field] = translate("admin.facultyLeadership.form.required");
      }
    }

    if (!orderInput.trim()) {
      errors.order = translate("admin.facultyLeadership.form.required");
    } else if (
      Number.isNaN(Number(orderInput)) ||
      !Number.isInteger(Number(orderInput)) ||
      Number(orderInput) < 1
    ) {
      errors.order = translate("admin.facultyLeadership.form.invalidOrder");
    }

    const imageUrl = String(values.imageUrl ?? "").trim();
    if (imageUrl && !isValidHref(imageUrl)) {
      errors.imageUrl = translate("admin.facultyLeadership.form.invalidUrl");
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

  function updateOrder(value: string) {
    setOrderInput(value);
    setFieldErrors((prev) => {
      if (!prev.order) return prev;
      const next = { ...prev };
      delete next.order;
      return next;
    });
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadError(null);

    if (!isValidImageFile(file)) {
      setUploadError(translate("admin.facultyLeadership.form.imageInvalid"));
      return;
    }

    setUploading(true);
    try {
      const path = `images/faculty-leadership/${Date.now()}-${file.name}`;
      const url = await uploadImage(path, file);
      updateField("imageUrl", url);
    } catch (error) {
      console.error("[MITSU] Faculty Leadership image upload failed:", error);
      setUploadError(translate("admin.facultyLeadership.form.imageUploadError"));
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
        order: Number(orderInput),
        isActive,
      });
    } catch (error) {
      console.error("[MITSU] Faculty Leadership save failed:", error);
      setError(translate("admin.facultyLeadership.form.error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="faculty-leader-name" className="text-sm font-medium text-foreground">
          {translate("admin.facultyLeadership.form.name")}
        </label>
        <input
          id="faculty-leader-name"
          type="text"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          aria-invalid={Boolean(fieldErrors.name)}
          className={cx(
            "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.name ? "border-primary" : "border-border",
            focusRing
          )}
        />
        {fieldErrors.name && (
          <p role="alert" className="mt-1 text-xs font-medium text-primary">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="faculty-leader-role"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.facultyLeadership.form.role")}
        </label>
        <input
          id="faculty-leader-role"
          type="text"
          value={values.role}
          onChange={(event) => updateField("role", event.target.value)}
          aria-invalid={Boolean(fieldErrors.role)}
          className={cx(
            "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.role ? "border-primary" : "border-border",
            focusRing
          )}
        />
        {fieldErrors.role && (
          <p role="alert" className="mt-1 text-xs font-medium text-primary">
            {fieldErrors.role}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="faculty-leader-order" className="text-sm font-medium text-foreground">
          {translate("admin.facultyLeadership.form.order")}
        </label>
        <input
          id="faculty-leader-order"
          type="number"
          min={1}
          step={1}
          value={orderInput}
          onChange={(event) => updateOrder(event.target.value)}
          aria-invalid={Boolean(fieldErrors.order)}
          className={cx(
            "mt-1 w-full max-w-[10rem] rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.order ? "border-primary" : "border-border",
            focusRing
          )}
        />
        {fieldErrors.order ? (
          <p role="alert" className="mt-1 text-xs font-medium text-primary">
            {fieldErrors.order}
          </p>
        ) : (
          <p className="mt-1 text-xs text-foreground/50">
            {translate("admin.facultyLeadership.form.orderHint")}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="faculty-leader-image-url"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.facultyLeadership.form.imageUrl")}
        </label>
        <input
          id="faculty-leader-image-url"
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
          htmlFor="faculty-leader-image-upload"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.facultyLeadership.form.uploadImage")}
        </label>
        <div className="mt-1 flex items-center gap-3">
          <label
            htmlFor="faculty-leader-image-upload"
            className={cx(
              "inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-surface-muted",
              focusRing
            )}
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            {uploading
              ? translate("admin.facultyLeadership.form.uploading")
              : translate("admin.facultyLeadership.form.chooseImage")}
          </label>
          <input
            id="faculty-leader-image-upload"
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
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
          className={cx("h-4 w-4 rounded border-border", focusRing)}
        />
        {translate("admin.facultyLeadership.form.isActive")}
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
            {cancelLabel ?? translate("admin.facultyLeadership.form.cancel")}
          </button>
        )}
      </div>
    </form>
  );
}

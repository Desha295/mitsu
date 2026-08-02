"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Save, Upload } from "lucide-react";
import type { HeroDoc } from "@/lib/firebase/collections";
import { uploadImage } from "@/lib/firebase/storage";
import { isValidImageFile } from "@/lib/auth/validation";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface HeroFormProps {
  initialValues: HeroDoc;
  onSubmit: (values: HeroDoc) => Promise<void>;
  submitLabel: string;
  submittingLabel: string;
}

const FIELD_KEYS: Array<{ name: keyof HeroDoc; labelKey: string; type: "text" | "url" | "textarea" }> = [
  { name: "heading", labelKey: "admin.hero.form.heading", type: "text" },
  { name: "description", labelKey: "admin.hero.form.description", type: "textarea" },
  { name: "primaryCtaLabel", labelKey: "admin.hero.form.primaryCtaLabel", type: "text" },
  { name: "primaryCtaHref", labelKey: "admin.hero.form.primaryCtaHref", type: "url" },
  { name: "secondaryCtaLabel", labelKey: "admin.hero.form.secondaryCtaLabel", type: "text" },
  { name: "secondaryCtaHref", labelKey: "admin.hero.form.secondaryCtaHref", type: "url" },
  { name: "imageUrl", labelKey: "admin.hero.form.imageUrl", type: "url" },
];

/**
 * Guarantees every HeroDoc field has a defined value before it's ever
 * handed to useState. Firestore documents are schemaless at runtime —
 * an existing document can be missing a field (e.g. it predates that
 * field, or was written by hand) even though HeroDoc types it as
 * required. Without this, an input's `value` prop could start as
 * `undefined` and later become a string once the user types, which is
 * exactly what triggers React's "component is changing an uncontrolled
 * input to be controlled" warning. Normalizing up front means every
 * input is controlled from its very first render, for its entire
 * lifecycle — no functional change, values are identical to whatever
 * was passed in whenever they're actually present.
 */
function normalizeHeroValues(values: HeroDoc): HeroDoc {
  return {
    heading: values.heading ?? "",
    description: values.description ?? "",
    primaryCtaLabel: values.primaryCtaLabel ?? "",
    primaryCtaHref: values.primaryCtaHref ?? "",
    secondaryCtaLabel: values.secondaryCtaLabel ?? "",
    secondaryCtaHref: values.secondaryCtaHref ?? "",
    imageUrl: values.imageUrl ?? "",
    isActive: values.isActive ?? false,
    updatedAt: values.updatedAt,
  };
}

/**
 * Hero content form (components/admin). Reused for both creating the
 * first hero document and editing an existing one — the caller decides
 * which by passing the right `onSubmit` (heroService.create vs .update).
 */
export function HeroForm({
  initialValues,
  onSubmit,
  submitLabel,
  submittingLabel,
}: HeroFormProps) {
  const { translate } = useLanguage();
  const [values, setValues] = useState<HeroDoc>(() =>
    normalizeHeroValues(initialValues)
  );
  const [isActive, setIsActive] = useState(initialValues.isActive ?? false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof HeroDoc, string>>>({});

  const REQUIRED_FIELDS: Array<keyof HeroDoc> = [
    "heading",
    "description",
    "primaryCtaLabel",
    "primaryCtaHref",
    "secondaryCtaLabel",
    "secondaryCtaHref",
  ];
  const HREF_FIELDS: Array<keyof HeroDoc> = [
    "primaryCtaHref",
    "secondaryCtaHref",
    "imageUrl",
  ];

  function isValidHref(value: string): boolean {
    if (value.startsWith("/")) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  function validate(): boolean {
    const errors: Partial<Record<keyof HeroDoc, string>> = {};

    for (const field of REQUIRED_FIELDS) {
      if (!String(values[field] ?? "").trim()) {
        errors[field] = translate("admin.hero.form.required");
      }
    }

    for (const field of HREF_FIELDS) {
      const value = String(values[field] ?? "").trim();
      if (value && !errors[field] && !isValidHref(value)) {
        errors[field] = translate("admin.hero.form.invalidUrl");
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function updateField(name: keyof HeroDoc, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploadError(null);

    if (!isValidImageFile(file)) {
      setUploadError(translate("admin.hero.form.imageInvalid"));
      return;
    }

    setUploading(true);
    try {
      const path = `images/hero/${Date.now()}-${file.name}`;
      const url = await uploadImage(path, file);
      updateField("imageUrl", url);
    } catch {
      setUploadError(translate("admin.hero.form.imageUploadError"));
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
      await onSubmit({ ...values, isActive });
    } catch (error) {
      // Logged for developer visibility (previously this catch block
      // discarded the error entirely with no bound variable, which is
      // exactly why the original bug took this long to diagnose). The
      // UI message stays generic per PROJECT_RULES.md #21 (don't expose
      // technical details to end users) — this is the permanent version,
      // not the diagnostic log-and-rethrow used during root-cause capture.
      console.error("[MITSU] Hero save failed:", error);
      setError(translate("admin.hero.form.error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {FIELD_KEYS.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={`hero-${field.name}`}
            className="text-sm font-medium text-foreground"
          >
            {translate(field.labelKey)}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={`hero-${field.name}`}
              rows={3}
              value={values[field.name] as string}
              onChange={(event) => updateField(field.name, event.target.value)}
              aria-invalid={Boolean(fieldErrors[field.name])}
              className={cx(
                "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
                fieldErrors[field.name] ? "border-primary" : "border-border",
                focusRing
              )}
            />
          ) : (
            <input
              id={`hero-${field.name}`}
              type={field.type}
              value={values[field.name] as string}
              onChange={(event) => updateField(field.name, event.target.value)}
              aria-invalid={Boolean(fieldErrors[field.name])}
              className={cx(
                "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
                fieldErrors[field.name] ? "border-primary" : "border-border",
                focusRing
              )}
            />
          )}
          {fieldErrors[field.name] && (
            <p role="alert" className="mt-1 text-xs font-medium text-primary">
              {fieldErrors[field.name]}
            </p>
          )}
        </div>
      ))}

      <div>
        <label
          htmlFor="hero-image-upload"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.hero.form.uploadImage")}
        </label>
        <div className="mt-1 flex items-center gap-3">
          <label
            htmlFor="hero-image-upload"
            className={cx(
              "inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-surface-muted",
              focusRing
            )}
          >
            <Upload className="h-4 w-4" aria-hidden="true" />
            {uploading
              ? translate("admin.hero.form.uploading")
              : translate("admin.hero.form.chooseImage")}
          </label>
          <input
            id="hero-image-upload"
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
        {translate("admin.hero.form.isActive")}
      </label>

      {error && (
        <p role="alert" className="text-sm font-medium text-primary">
          {error}
        </p>
      )}

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
    </form>
  );
}

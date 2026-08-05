"use client";

import { useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import type { SettingsDoc } from "@/lib/firebase/collections";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing, isValidHref } from "@/lib/utils";

interface SettingsFormProps {
  initialValues: SettingsDoc;
  onSubmit: (values: SettingsDoc) => Promise<void>;
  submitLabel: string;
  submittingLabel: string;
}

type FieldType = "text" | "url" | "email" | "tel";

const FIELD_KEYS: Array<{ name: keyof SettingsDoc; labelKey: string; type: FieldType }> = [
  { name: "projectName", labelKey: "admin.settings.form.projectName", type: "text" },
  { name: "universityName", labelKey: "admin.settings.form.universityName", type: "text" },
  { name: "whatsappCommunityUrl", labelKey: "admin.settings.form.whatsappCommunityUrl", type: "url" },
  { name: "facebookUrl", labelKey: "admin.settings.form.facebookUrl", type: "url" },
  { name: "instagramUrl", labelKey: "admin.settings.form.instagramUrl", type: "url" },
  { name: "contactEmail", labelKey: "admin.settings.form.contactEmail", type: "email" },
  { name: "contactPhone", labelKey: "admin.settings.form.contactPhone", type: "tel" },
  { name: "officeLocation", labelKey: "admin.settings.form.officeLocation", type: "text" },
  { name: "logoUrl", labelKey: "admin.settings.form.logoUrl", type: "url" },
  { name: "universityLogoUrl", labelKey: "admin.settings.form.universityLogoUrl", type: "url" },
  { name: "campusImageUrl", labelKey: "admin.settings.form.campusImageUrl", type: "url" },
];

const REQUIRED_FIELDS: Array<keyof SettingsDoc> = ["projectName", "universityName"];

const URL_FIELDS: Array<keyof SettingsDoc> = [
  "whatsappCommunityUrl",
  "facebookUrl",
  "instagramUrl",
  "logoUrl",
  "universityLogoUrl",
  "campusImageUrl",
];

/** Deliberately light — matches the project's existing pragmatic
 * validation style (isValidHref is a try/catch new URL() check, not a
 * strict RFC validator). Only checked when non-empty, since contactEmail
 * is optional. */
function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Guarantees every SettingsDoc field has a defined string value before
 * it's ever handed to useState — same reasoning as HeroForm's
 * normalizeHeroValues: an existing document can be missing an optional
 * field, and an input's `value` prop must never start `undefined`.
 */
function normalizeSettingsValues(values: SettingsDoc): SettingsDoc {
  return {
    projectName: values.projectName ?? "",
    universityName: values.universityName ?? "",
    logoUrl: values.logoUrl ?? "",
    universityLogoUrl: values.universityLogoUrl ?? "",
    campusImageUrl: values.campusImageUrl ?? "",
    whatsappCommunityUrl: values.whatsappCommunityUrl ?? "",
    facebookUrl: values.facebookUrl ?? "",
    instagramUrl: values.instagramUrl ?? "",
    contactEmail: values.contactEmail ?? "",
    contactPhone: values.contactPhone ?? "",
    officeLocation: values.officeLocation ?? "",
    updatedAt: values.updatedAt,
  };
}

/**
 * Site Settings form (components/admin). A single always-present
 * document — unlike every other admin form, there's no create/edit
 * distinction and no delete action, so this form is always used in
 * "edit" mode and never paired with ConfirmDialog (nothing to confirm
 * deleting for a singleton config document).
 */
export function SettingsForm({
  initialValues,
  onSubmit,
  submitLabel,
  submittingLabel,
}: SettingsFormProps) {
  const { translate } = useLanguage();
  const [values, setValues] = useState<SettingsDoc>(() =>
    normalizeSettingsValues(initialValues)
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof SettingsDoc, string>>
  >({});

  function validate(): boolean {
    const errors: Partial<Record<keyof SettingsDoc, string>> = {};

    for (const field of REQUIRED_FIELDS) {
      if (!String(values[field] ?? "").trim()) {
        errors[field] = translate("admin.settings.form.required");
      }
    }

    for (const field of URL_FIELDS) {
      const value = String(values[field] ?? "").trim();
      if (value && !errors[field] && !isValidHref(value)) {
        errors[field] = translate("admin.settings.form.invalidUrl");
      }
    }

    const email = String(values.contactEmail ?? "").trim();
    if (email && !isValidEmail(email)) {
      errors.contactEmail = translate("admin.settings.form.invalidEmail");
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function updateField(name: keyof SettingsDoc, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("[MITSU] Settings save failed:", error);
      setError(translate("admin.settings.form.error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {FIELD_KEYS.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={`settings-${field.name}`}
            className="text-sm font-medium text-foreground"
          >
            {translate(field.labelKey)}
          </label>
          <input
            id={`settings-${field.name}`}
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
          {fieldErrors[field.name] && (
            <p role="alert" className="mt-1 text-xs font-medium text-primary">
              {fieldErrors[field.name]}
            </p>
          )}
        </div>
      ))}

      {error && (
        <p role="alert" className="text-sm font-medium text-primary">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
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

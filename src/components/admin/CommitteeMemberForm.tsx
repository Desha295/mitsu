"use client";

import { useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import type { CommitteeMemberDoc } from "@/lib/firebase/collections";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface CommitteeMemberFormProps {
  initialValues: CommitteeMemberDoc;
  onSubmit: (values: CommitteeMemberDoc) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
  submittingLabel: string;
  cancelLabel?: string;
}

type TextField =
  | "nameAr"
  | "nameEn"
  | "roleAr"
  | "roleEn";

export function CommitteeMemberForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  submittingLabel,
  cancelLabel,
}: CommitteeMemberFormProps) {
  const { translate } = useLanguage();

  const [values, setValues] =
    useState<CommitteeMemberDoc>(initialValues);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<TextField, string>>
  >({});

  const REQUIRED_FIELDS: TextField[] = [
    "nameAr",
    "nameEn",
    "roleAr",
    "roleEn",
  ];

  function validate(): boolean {
    const errors: Partial<Record<TextField, string>> = {};

    for (const field of REQUIRED_FIELDS) {
      if (!String(values[field] ?? "").trim()) {
        errors[field] = translate(
          "admin.union.form.required"
        );
      }
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  }

  function updateField(
    name: TextField,
    value: string
  ) {
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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

    if (!validate()) return;

    setSubmitting(true);

    try {
      await onSubmit(values);
    } catch {
      setError(
        translate("admin.union.form.error")
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
      {/* Arabic Name */}
      <div>
        <label
          htmlFor="member-name-ar"
          className="text-sm font-medium text-foreground"
        >
          الاسم بالعربية
        </label>

        <input
          id="member-name-ar"
          type="text"
          dir="rtl"
          value={values.nameAr}
          onChange={(event) =>
            updateField(
              "nameAr",
              event.target.value
            )
          }
          aria-invalid={Boolean(fieldErrors.nameAr)}
          className={cx(
            "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.nameAr
              ? "border-primary"
              : "border-border",
            focusRing
          )}
        />

        {fieldErrors.nameAr && (
          <p
            role="alert"
            className="mt-1 text-xs font-medium text-primary"
          >
            {fieldErrors.nameAr}
          </p>
        )}
      </div>

      {/* English Name */}
      <div>
        <label
          htmlFor="member-name-en"
          className="text-sm font-medium text-foreground"
        >
          Name in English
        </label>

        <input
          id="member-name-en"
          type="text"
          dir="ltr"
          value={values.nameEn}
          onChange={(event) =>
            updateField(
              "nameEn",
              event.target.value
            )
          }
          aria-invalid={Boolean(fieldErrors.nameEn)}
          className={cx(
            "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.nameEn
              ? "border-primary"
              : "border-border",
            focusRing
          )}
        />

        {fieldErrors.nameEn && (
          <p
            role="alert"
            className="mt-1 text-xs font-medium text-primary"
          >
            {fieldErrors.nameEn}
          </p>
        )}
      </div>

      {/* Arabic Role */}
      <div>
        <label
          htmlFor="member-role-ar"
          className="text-sm font-medium text-foreground"
        >
          الدور بالعربية
        </label>

        <input
          id="member-role-ar"
          type="text"
          dir="rtl"
          value={values.roleAr}
          onChange={(event) =>
            updateField(
              "roleAr",
              event.target.value
            )
          }
          aria-invalid={Boolean(fieldErrors.roleAr)}
          className={cx(
            "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.roleAr
              ? "border-primary"
              : "border-border",
            focusRing
          )}
        />

        {fieldErrors.roleAr && (
          <p
            role="alert"
            className="mt-1 text-xs font-medium text-primary"
          >
            {fieldErrors.roleAr}
          </p>
        )}
      </div>

      {/* English Role */}
      <div>
        <label
          htmlFor="member-role-en"
          className="text-sm font-medium text-foreground"
        >
          Role in English
        </label>

        <input
          id="member-role-en"
          type="text"
          dir="ltr"
          value={values.roleEn}
          onChange={(event) =>
            updateField(
              "roleEn",
              event.target.value
            )
          }
          aria-invalid={Boolean(fieldErrors.roleEn)}
          className={cx(
            "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.roleEn
              ? "border-primary"
              : "border-border",
            focusRing
          )}
        />

        {fieldErrors.roleEn && (
          <p
            role="alert"
            className="mt-1 text-xs font-medium text-primary"
          >
            {fieldErrors.roleEn}
          </p>
        )}
      </div>

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
          disabled={submitting}
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
              translate("admin.union.form.cancel")}
          </button>
        )}
      </div>
    </form>
  );
}
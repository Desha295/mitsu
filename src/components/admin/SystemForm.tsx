"use client";

import { useState, type FormEvent } from "react";
import * as Icons from "lucide-react";
import { Save } from "lucide-react";
import type { SystemDoc } from "@/lib/firebase/collections";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing, isValidHref } from "@/lib/utils";

interface SystemFormProps {
  initialValues: SystemDoc;
  onSubmit: (values: SystemDoc) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
  submittingLabel: string;
  cancelLabel?: string;
}

type TextField =
  | "name"
  | "description"
  | "purpose"
  | "officialUrl"
  | "icon"
  | "instructions";

/**
 * System content form (components/admin, Sprint 3.6). Same create/edit
 * shape as CommitteeForm/EventForm/AnnouncementForm. Unlike those,
 * SystemDoc has no image field at all — `icon` is a plain Lucide icon
 * name string (matching the public SystemCard's own `system.icon`
 * lookup), so a small live preview is rendered next to the input
 * instead of an upload control.
 *
 * `officialUrl` is typed as a required string in SystemDoc, but the
 * public data (src/data/systems.ts) already stores an empty string for
 * MUSTER — "no official web portal yet, mobile app only" — and
 * SystemCard treats an empty officialUrl as a legitimate "Coming soon"
 * state rather than an error. So this form validates it the same way
 * the other forms validate their optional href fields: format-checked
 * only when non-empty, never required.
 */
export function SystemForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  submittingLabel,
  cancelLabel,
}: SystemFormProps) {
  const { translate } = useLanguage();
  const [values, setValues] = useState<SystemDoc>(initialValues);
  const [orderInput, setOrderInput] = useState(String(initialValues.order));
  const [isActive, setIsActive] = useState(initialValues.isActive);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<TextField | "order", string>>
  >({});

  const REQUIRED_FIELDS: TextField[] = ["name", "description", "purpose"];

  const IconPreview = values.icon
    ? (
        Icons as unknown as Record<
          string,
          React.ComponentType<{ className?: string }> | undefined
        >
      )[values.icon]
    : undefined;

  function validate(): boolean {
    const errors: Partial<Record<TextField | "order", string>> = {};

    for (const field of REQUIRED_FIELDS) {
      if (!String(values[field] ?? "").trim()) {
        errors[field] = translate("admin.systems.form.required");
      }
    }

    if (!orderInput.trim()) {
      errors.order = translate("admin.systems.form.required");
    } else if (
      Number.isNaN(Number(orderInput)) ||
      !Number.isInteger(Number(orderInput)) ||
      Number(orderInput) < 1
    ) {
      errors.order = translate("admin.systems.form.invalidOrder");
    }

    const officialUrl = String(values.officialUrl ?? "").trim();
    if (officialUrl && !isValidHref(officialUrl)) {
      errors.officialUrl = translate("admin.systems.form.invalidUrl");
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
    } catch {
      setError(translate("admin.systems.form.error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="system-name" className="text-sm font-medium text-foreground">
          {translate("admin.systems.form.name")}
        </label>
        <input
          id="system-name"
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
          htmlFor="system-description"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.systems.form.description")}
        </label>
        <textarea
          id="system-description"
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
        <label htmlFor="system-purpose" className="text-sm font-medium text-foreground">
          {translate("admin.systems.form.purpose")}
        </label>
        <textarea
          id="system-purpose"
          rows={2}
          value={values.purpose}
          onChange={(event) => updateField("purpose", event.target.value)}
          aria-invalid={Boolean(fieldErrors.purpose)}
          className={cx(
            "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.purpose ? "border-primary" : "border-border",
            focusRing
          )}
        />
        {fieldErrors.purpose && (
          <p role="alert" className="mt-1 text-xs font-medium text-primary">
            {fieldErrors.purpose}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="system-instructions"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.systems.form.instructions")}
        </label>
        <textarea
          id="system-instructions"
          rows={5}
          value={values.instructions ?? ""}
          onChange={(event) => updateField("instructions", event.target.value)}
          className={cx(
            "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
            focusRing
          )}
        />
        <p className="mt-1 text-xs text-foreground/50">
          {translate("admin.systems.form.instructionsHint")}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="system-official-url"
            className="text-sm font-medium text-foreground"
          >
            {translate("admin.systems.form.officialUrl")}
          </label>
          <input
            id="system-official-url"
            type="url"
            value={values.officialUrl}
            onChange={(event) => updateField("officialUrl", event.target.value)}
            aria-invalid={Boolean(fieldErrors.officialUrl)}
            className={cx(
              "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
              fieldErrors.officialUrl ? "border-primary" : "border-border",
              focusRing
            )}
          />
          {fieldErrors.officialUrl ? (
            <p role="alert" className="mt-1 text-xs font-medium text-primary">
              {fieldErrors.officialUrl}
            </p>
          ) : (
            <p className="mt-1 text-xs text-foreground/50">
              {translate("admin.systems.form.officialUrlHint")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="system-order" className="text-sm font-medium text-foreground">
            {translate("admin.systems.form.order")}
          </label>
          <input
            id="system-order"
            type="number"
            min={1}
            step={1}
            value={orderInput}
            onChange={(event) => updateOrder(event.target.value)}
            aria-invalid={Boolean(fieldErrors.order)}
            className={cx(
              "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
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
              {translate("admin.systems.form.orderHint")}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="system-icon" className="text-sm font-medium text-foreground">
          {translate("admin.systems.form.icon")}
        </label>
        <div className="mt-1 flex items-center gap-3">
          <input
            id="system-icon"
            type="text"
            value={values.icon ?? ""}
            onChange={(event) => updateField("icon", event.target.value)}
            placeholder="ClipboardList"
            className={cx(
              "w-full max-w-xs rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              focusRing
            )}
          />
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-muted text-foreground/60">
            {IconPreview ? (
              <IconPreview className="h-4 w-4" aria-hidden="true" />
            ) : (
              <span className="text-xs">—</span>
            )}
          </span>
        </div>
        <p className="mt-1 text-xs text-foreground/50">
          {translate("admin.systems.form.iconHint")}
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
          className={cx("h-4 w-4 rounded border-border", focusRing)}
        />
        {translate("admin.systems.form.isActive")}
      </label>

      {error && (
        <p role="alert" className="text-sm font-medium text-primary">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
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
            {cancelLabel ?? translate("admin.systems.form.cancel")}
          </button>
        )}
      </div>
    </form>
  );
}

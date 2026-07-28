"use client";

import { useState, type FormEvent } from "react";
import * as Icons from "lucide-react";
import { Save } from "lucide-react";
import type { QuickAccessItemDoc } from "@/lib/firebase/collections";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing, isValidHref } from "@/lib/utils";

interface QuickAccessFormProps {
  initialValues: QuickAccessItemDoc;
  onSubmit: (values: QuickAccessItemDoc) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
  submittingLabel: string;
  cancelLabel?: string;
}

type TextField = "title" | "description" | "href" | "icon";

/**
 * Quick Access item form (components/admin, Sprint 3.8). Same
 * create/edit shape as SystemForm — text inputs, a live icon preview
 * next to the icon field (same convention as the public QuickAccessCard
 * and SystemCard's own icon lookup) — but simpler: every
 * QuickAccessItemDoc field is required (unlike SystemDoc's optional
 * `officialUrl`/`icon`), so all four text fields validate the same way
 * as `title`/`description` everywhere else, and `href` is checked with
 * the same shared `isValidHref()` used by every prior form.
 */
export function QuickAccessForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  submittingLabel,
  cancelLabel,
}: QuickAccessFormProps) {
  const { translate } = useLanguage();
  const [values, setValues] = useState<QuickAccessItemDoc>(initialValues);
  const [orderInput, setOrderInput] = useState(String(initialValues.order));
  const [isActive, setIsActive] = useState(initialValues.isActive);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<TextField | "order", string>>
  >({});

  const REQUIRED_FIELDS: TextField[] = ["title", "description", "href", "icon"];

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
        errors[field] = translate("admin.quickAccess.form.required");
      }
    }

    const href = String(values.href ?? "").trim();
    if (href && !isValidHref(href)) {
      errors.href = translate("admin.quickAccess.form.invalidUrl");
    }

    if (!orderInput.trim()) {
      errors.order = translate("admin.quickAccess.form.required");
    } else if (
      Number.isNaN(Number(orderInput)) ||
      !Number.isInteger(Number(orderInput)) ||
      Number(orderInput) < 1
    ) {
      errors.order = translate("admin.quickAccess.form.invalidOrder");
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
      setError(translate("admin.quickAccess.form.error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label
          htmlFor="quick-access-title"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.quickAccess.form.title")}
        </label>
        <input
          id="quick-access-title"
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
          htmlFor="quick-access-description"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.quickAccess.form.description")}
        </label>
        <textarea
          id="quick-access-description"
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
          htmlFor="quick-access-href"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.quickAccess.form.href")}
        </label>
        <input
          id="quick-access-href"
          type="text"
          value={values.href}
          onChange={(event) => updateField("href", event.target.value)}
          placeholder="/guide"
          aria-invalid={Boolean(fieldErrors.href)}
          className={cx(
            "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
            fieldErrors.href ? "border-primary" : "border-border",
            focusRing
          )}
        />
        {fieldErrors.href ? (
          <p role="alert" className="mt-1 text-xs font-medium text-primary">
            {fieldErrors.href}
          </p>
        ) : (
          <p className="mt-1 text-xs text-foreground/50">
            {translate("admin.quickAccess.form.hrefHint")}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="quick-access-icon"
            className="text-sm font-medium text-foreground"
          >
            {translate("admin.quickAccess.form.icon")}
          </label>
          <div className="mt-1 flex items-center gap-3">
            <input
              id="quick-access-icon"
              type="text"
              value={values.icon}
              onChange={(event) => updateField("icon", event.target.value)}
              placeholder="BookOpen"
              aria-invalid={Boolean(fieldErrors.icon)}
              className={cx(
                "w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
                fieldErrors.icon ? "border-primary" : "border-border",
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
          {fieldErrors.icon && (
            <p role="alert" className="mt-1 text-xs font-medium text-primary">
              {fieldErrors.icon}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="quick-access-order"
            className="text-sm font-medium text-foreground"
          >
            {translate("admin.quickAccess.form.order")}
          </label>
          <input
            id="quick-access-order"
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
              {translate("admin.quickAccess.form.orderHint")}
            </p>
          )}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => setIsActive(event.target.checked)}
          className={cx("h-4 w-4 rounded border-border", focusRing)}
        />
        {translate("admin.quickAccess.form.isActive")}
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
            {cancelLabel ?? translate("admin.quickAccess.form.cancel")}
          </button>
        )}
      </div>
    </form>
  );
}

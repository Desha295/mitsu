"use client";

import { useState, type FormEvent } from "react";
import * as Icons from "lucide-react";
import { Save, Plus, X } from "lucide-react";
import type { GuideSectionDoc } from "@/lib/firebase/collections";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

interface GuideFormProps {
  initialValues: GuideSectionDoc;
  onSubmit: (values: GuideSectionDoc) => Promise<void>;
  onCancel?: () => void;
  submitLabel: string;
  submittingLabel: string;
  cancelLabel?: string;
}

type TextField =
  | "icon"
  | "titleAr"
  | "titleEn"
  | "descriptionAr"
  | "descriptionEn";

type FactRow = {
  ar: string;
  en: string;
};

type StatRow = {
  labelAr: string;
  labelEn: string;
  value: string;
};

function normalizeFacts(
  facts: GuideSectionDoc["facts"]
): FactRow[] {
  if (!Array.isArray(facts)) return [];

  return facts.map((fact) => ({
    ar: typeof fact?.ar === "string" ? fact.ar : "",
    en: typeof fact?.en === "string" ? fact.en : "",
  }));
}

function normalizeStats(
  stats: GuideSectionDoc["stats"]
): StatRow[] {
  if (!Array.isArray(stats)) return [];

  return stats.map((stat) => ({
    labelAr:
      typeof stat?.labelAr === "string" ? stat.labelAr : "",
    labelEn:
      typeof stat?.labelEn === "string" ? stat.labelEn : "",
    value: typeof stat?.value === "string" ? stat.value : "",
  }));
}

export function GuideForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  submittingLabel,
  cancelLabel,
}: GuideFormProps) {
  const { translate } = useLanguage();

  const [values, setValues] = useState<GuideSectionDoc>({
    ...initialValues,
    icon: initialValues.icon ?? "",
    titleAr: initialValues.titleAr ?? "",
    titleEn: initialValues.titleEn ?? "",
    descriptionAr: initialValues.descriptionAr ?? "",
    descriptionEn: initialValues.descriptionEn ?? "",
  });

  const [orderInput, setOrderInput] = useState(
    String(initialValues.order ?? 1)
  );

  const [isActive, setIsActive] = useState(
    initialValues.isActive ?? true
  );

  const [highlight, setHighlight] = useState(
    initialValues.highlight ?? false
  );

  const [facts, setFacts] = useState<FactRow[]>(
    normalizeFacts(initialValues.facts)
  );

  const [stats, setStats] = useState<StatRow[]>(
    normalizeStats(initialValues.stats)
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<TextField | "order", string>>
  >({});

  const REQUIRED_FIELDS: TextField[] = [
    "icon",
    "titleAr",
    "titleEn",
    "descriptionAr",
    "descriptionEn",
  ];

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
        errors[field] = translate("admin.guide.form.required");
      }
    }

    if (!orderInput.trim()) {
      errors.order = translate("admin.guide.form.required");
    } else if (
      Number.isNaN(Number(orderInput)) ||
      !Number.isInteger(Number(orderInput)) ||
      Number(orderInput) < 1
    ) {
      errors.order = translate("admin.guide.form.invalidOrder");
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

  function updateOrder(value: string) {
    setOrderInput(value);

    setFieldErrors((prev) => {
      if (!prev.order) return prev;

      const next = { ...prev };
      delete next.order;
      return next;
    });
  }

  function addFact() {
    setFacts((prev) => [
      ...prev,
      {
        ar: "",
        en: "",
      },
    ]);
  }

  function updateFact(
    index: number,
    language: "ar" | "en",
    value: string
  ) {
    setFacts((prev) =>
      prev.map((fact, i) =>
        i === index
          ? {
              ...fact,
              [language]: value,
            }
          : fact
      )
    );
  }

  function removeFact(index: number) {
    setFacts((prev) => prev.filter((_, i) => i !== index));
  }

  function addStat() {
    setStats((prev) => [
      ...prev,
      {
        labelAr: "",
        labelEn: "",
        value: "",
      },
    ]);
  }

  function updateStat(
    index: number,
    key: keyof StatRow,
    value: string
  ) {
    setStats((prev) =>
      prev.map((stat, i) =>
        i === index
          ? {
              ...stat,
              [key]: value,
            }
          : stat
      )
    );
  }

  function removeStat(index: number) {
    setStats((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!validate()) return;

    setSubmitting(true);

    try {
      const cleanedFacts = facts
        .map((fact) => ({
          ar: fact.ar.trim(),
          en: fact.en.trim(),
        }))
        .filter((fact) => fact.ar || fact.en);

      const cleanedStats = stats
        .map((stat) => ({
          labelAr: stat.labelAr.trim(),
          labelEn: stat.labelEn.trim(),
          value: stat.value.trim(),
        }))
        .filter(
          (stat) =>
            (stat.labelAr || stat.labelEn) && stat.value
        );

      await onSubmit({
        ...values,
        order: Number(orderInput),
        isActive,
        highlight,
        facts: cleanedFacts,
        stats: cleanedStats,
      });
    } catch {
      setError(translate("admin.guide.form.error"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Title AR */}
      <div>
        <label
          htmlFor="guide-title-ar"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.guide.form.title")} (AR)
        </label>

        <input
          id="guide-title-ar"
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

      {/* Title EN */}
      <div>
        <label
          htmlFor="guide-title-en"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.guide.form.title")} (EN)
        </label>

        <input
          id="guide-title-en"
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

      {/* Description AR */}
      <div>
        <label
          htmlFor="guide-description-ar"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.guide.form.description")} (AR)
        </label>

        <textarea
          id="guide-description-ar"
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

      {/* Description EN */}
      <div>
        <label
          htmlFor="guide-description-en"
          className="text-sm font-medium text-foreground"
        >
          {translate("admin.guide.form.description")} (EN)
        </label>

        <textarea
          id="guide-description-en"
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

      {/* Icon + Order */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="guide-icon"
            className="text-sm font-medium text-foreground"
          >
            {translate("admin.guide.form.icon")}
          </label>

          <div className="mt-1 flex items-center gap-3">
            <input
              id="guide-icon"
              type="text"
              value={values.icon}
              onChange={(event) =>
                updateField("icon", event.target.value)
              }
              placeholder="Compass"
              aria-invalid={Boolean(fieldErrors.icon)}
              className={cx(
                "w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
                fieldErrors.icon
                  ? "border-primary"
                  : "border-border",
                focusRing
              )}
            />

            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-muted text-foreground/60">
              {IconPreview ? (
                <IconPreview
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              ) : (
                <span className="text-xs">—</span>
              )}
            </span>
          </div>

          {fieldErrors.icon && (
            <p
              role="alert"
              className="mt-1 text-xs font-medium text-primary"
            >
              {fieldErrors.icon}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="guide-order"
            className="text-sm font-medium text-foreground"
          >
            {translate("admin.guide.form.order")}
          </label>

          <input
            id="guide-order"
            type="number"
            min={1}
            step={1}
            value={orderInput}
            onChange={(event) =>
              updateOrder(event.target.value)
            }
            aria-invalid={Boolean(fieldErrors.order)}
            className={cx(
              "mt-1 w-full rounded-md border bg-surface px-3 py-2 text-sm text-foreground",
              fieldErrors.order
                ? "border-primary"
                : "border-border",
              focusRing
            )}
          />

          {fieldErrors.order ? (
            <p
              role="alert"
              className="mt-1 text-xs font-medium text-primary"
            >
              {fieldErrors.order}
            </p>
          ) : (
            <p className="mt-1 text-xs text-foreground/50">
              {translate("admin.guide.form.orderHint")}
            </p>
          )}
        </div>
      </div>

      {/* Bilingual Facts */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {translate("admin.guide.form.facts")}
          </span>

          <button
            type="button"
            onClick={addFact}
            className={cx(
              "inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground transition-colors duration-150 hover:bg-surface-muted",
              focusRing
            )}
          >
            <Plus
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
            {translate("admin.guide.form.addFact")}
          </button>
        </div>

        <p className="mt-1 text-xs text-foreground/50">
          {translate("admin.guide.form.factsHint")}
        </p>

        {facts.length > 0 && (
          <div className="mt-2 flex flex-col gap-3">
            {facts.map((fact, index) => (
              <div
                key={index}
                className="rounded-md border border-border bg-surface-muted p-3"
              >
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    dir="rtl"
                    value={fact.ar ?? ""}
                    onChange={(event) =>
                      updateFact(
                        index,
                        "ar",
                        event.target.value
                      )
                    }
                    placeholder="النص بالعربية"
                    className={cx(
                      "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
                      focusRing
                    )}
                  />

                  <input
                    type="text"
                    dir="ltr"
                    value={fact.en ?? ""}
                    onChange={(event) =>
                      updateFact(
                        index,
                        "en",
                        event.target.value
                      )
                    }
                    placeholder="English text"
                    className={cx(
                      "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
                      focusRing
                    )}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeFact(index)}
                  aria-label={translate(
                    "admin.guide.form.removeFact"
                  )}
                  className={cx(
                    "mt-2 inline-flex h-8 items-center gap-1 rounded-md border border-border px-2 text-xs text-foreground/60 transition-colors duration-150 hover:bg-surface-muted",
                    focusRing
                  )}
                >
                  <X
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                  {translate(
                    "admin.guide.form.removeFact"
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {translate("admin.guide.form.stats")}
          </span>

          <button
            type="button"
            onClick={addStat}
            className={cx(
              "inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground transition-colors duration-150 hover:bg-surface-muted",
              focusRing
            )}
          >
            <Plus
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
            {translate("admin.guide.form.addStat")}
          </button>
        </div>

        <p className="mt-1 text-xs text-foreground/50">
          {translate("admin.guide.form.statsHint")}
        </p>

        {stats.length > 0 && (
          <div className="mt-2 flex flex-col gap-3">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="rounded-md border border-border bg-surface-muted p-3"
              >
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    dir="rtl"
                    value={stat.labelAr ?? ""}
                    onChange={(event) =>
                      updateStat(
                        index,
                        "labelAr",
                        event.target.value
                      )
                    }
                    placeholder="العنوان بالعربية"
                    className={cx(
                      "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
                      focusRing
                    )}
                  />

                  <input
                    type="text"
                    dir="ltr"
                    value={stat.labelEn ?? ""}
                    onChange={(event) =>
                      updateStat(
                        index,
                        "labelEn",
                        event.target.value
                      )
                    }
                    placeholder="English label"
                    className={cx(
                      "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
                      focusRing
                    )}
                  />
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={stat.value ?? ""}
                    onChange={(event) =>
                      updateStat(
                        index,
                        "value",
                        event.target.value
                      )
                    }
                    placeholder={translate(
                      "admin.guide.form.statValuePlaceholder"
                    )}
                    className={cx(
                      "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
                      focusRing
                    )}
                  />

                  <button
                    type="button"
                    onClick={() => removeStat(index)}
                    aria-label={translate(
                      "admin.guide.form.removeStat"
                    )}
                    className={cx(
                      "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-foreground/60 transition-colors duration-150 hover:bg-surface-muted",
                      focusRing
                    )}
                  >
                    <X
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) =>
              setIsActive(event.target.checked)
            }
            className={cx(
              "h-4 w-4 rounded border-border",
              focusRing
            )}
          />
          {translate("admin.guide.form.isActive")}
        </label>

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={highlight}
            onChange={(event) =>
              setHighlight(event.target.checked)
            }
            className={cx(
              "h-4 w-4 rounded border-border",
              focusRing
            )}
          />
          {translate("admin.guide.form.highlight")}
        </label>
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
              translate("admin.guide.form.cancel")}
          </button>
        )}
      </div>
    </form>
  );
}
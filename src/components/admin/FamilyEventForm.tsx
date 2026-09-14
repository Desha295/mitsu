"use client";

import { FormEvent, useState } from "react";
import type { FamilyEventDoc } from "@/lib/firebase/collections";
import { useLanguage } from "@/hooks/useLanguage";

type FamilyEventFormValues = {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  imageUrl: string;
  date: string;
};

type Props = {
  initialValues?: Partial<FamilyEventDoc>;
  onSubmit: (values: FamilyEventFormValues) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
};

function timestampToDateInput(value?: FamilyEventDoc["date"]) {
  if (!value) return "";

  const date = value.toDate();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function FamilyEventForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: Props) {
  const { language } = useLanguage();

  const isArabic = language === "ar";

  const [values, setValues] = useState<FamilyEventFormValues>({
    titleAr: initialValues?.titleAr ?? "",
    titleEn: initialValues?.titleEn ?? "",
    descriptionAr: initialValues?.descriptionAr ?? "",
    descriptionEn: initialValues?.descriptionEn ?? "",
    imageUrl: initialValues?.imageUrl ?? "",
    date: timestampToDateInput(initialValues?.date),
  });

  const [error, setError] = useState("");

  const updateField = (
    field: keyof FamilyEventFormValues,
    value: string
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!values.titleAr.trim() || !values.titleEn.trim()) {
      setError(
        isArabic
          ? "العنوان بالعربي والإنجليزي مطلوب."
          : "Arabic and English titles are required."
      );
      return;
    }

    if (!values.date) {
      setError(
        isArabic ? "التاريخ مطلوب." : "Date is required."
      );
      return;
    }

    if (!values.imageUrl.trim()) {
      setError(
        isArabic
          ? "رابط صورة الفعالية مطلوب."
          : "Event image URL is required."
      );
      return;
    }

    try {
      new URL(values.imageUrl.trim());
    } catch {
      setError(
        isArabic
          ? "برجاء إدخال رابط صورة صحيح."
          : "Please enter a valid image URL."
      );
      return;
    }

    await onSubmit({
      titleAr: values.titleAr.trim(),
      titleEn: values.titleEn.trim(),
      descriptionAr: values.descriptionAr.trim(),
      descriptionEn: values.descriptionEn.trim(),
      imageUrl: values.imageUrl.trim(),
      date: values.date,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {isArabic ? "بيانات الفعالية" : "Event Details"}
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {isArabic
            ? "أدخل بيانات الفعالية بالعربي والإنجليزي."
            : "Enter the event information in Arabic and English."}
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="titleAr"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            العنوان بالعربي
          </label>

          <input
            id="titleAr"
            value={values.titleAr}
            onChange={(event) =>
              updateField("titleAr", event.target.value)
            }
            dir="rtl"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            placeholder="عنوان الفعالية"
          />
        </div>

        <div>
          <label
            htmlFor="titleEn"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            English Title
          </label>

          <input
            id="titleEn"
            value={values.titleEn}
            onChange={(event) =>
              updateField("titleEn", event.target.value)
            }
            dir="ltr"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            placeholder="Event title"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="descriptionAr"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            الوصف بالعربي
          </label>

          <textarea
            id="descriptionAr"
            value={values.descriptionAr}
            onChange={(event) =>
              updateField("descriptionAr", event.target.value)
            }
            dir="rtl"
            rows={5}
            className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            placeholder="وصف الفعالية"
          />
        </div>

        <div>
          <label
            htmlFor="descriptionEn"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            English Description
          </label>

          <textarea
            id="descriptionEn"
            value={values.descriptionEn}
            onChange={(event) =>
              updateField("descriptionEn", event.target.value)
            }
            dir="ltr"
            rows={5}
            className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            placeholder="Event description"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="date"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {isArabic ? "التاريخ" : "Date"}
          </label>

          <input
            id="date"
            type="date"
            value={values.date}
            onChange={(event) =>
              updateField("date", event.target.value)
            }
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
          />
        </div>

        <div>
          <label
            htmlFor="imageUrl"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {isArabic ? "رابط صورة الفعالية" : "Event Image URL"}
          </label>

          <input
            id="imageUrl"
            type="url"
            value={values.imageUrl}
            onChange={(event) =>
              updateField("imageUrl", event.target.value)
            }
            dir="ltr"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            placeholder="https://..."
          />
        </div>
      </div>

      {values.imageUrl.trim() && (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
          <img
            src={values.imageUrl.trim()}
            alt={values.titleEn || "Event preview"}
            className="h-56 w-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            {isArabic ? "إلغاء" : "Cancel"}
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? isArabic
              ? "جاري الحفظ..."
              : "Saving..."
            : isArabic
              ? "حفظ الفعالية"
              : "Save Event"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { Timestamp } from "firebase/firestore";

import { PageContainer } from "@/components/admin/PageContainer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Unauthorized } from "@/components/admin/Unauthorized";
import { LoadingDashboard } from "@/components/admin/LoadingDashboard";

import { familiesService } from "@/lib/firebase/services";
import type { FamilyDoc } from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";

import { useAuthGuard, canAccess } from "@/lib/auth/routeGuard";
import { PERMISSIONS } from "@/lib/auth/constants";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

const EMPTY_FAMILY: FamilyDoc = {
  nameAr: "",
  nameEn: "",
  descriptionAr: "",
  descriptionEn: "",

  imageUrl: "",

  whatsapp: "",
  email: "",
  phone: "",

  instagram: "",
  facebook: "",
  linkedin: "",

  applicationUrl: "",

  order: 0,
  isActive: true,

  createdAt: undefined as unknown as FamilyDoc["createdAt"],
  updatedAt: undefined as unknown as FamilyDoc["updatedAt"],
};

type FormTarget = WithId<FamilyDoc> | "new" | null;

type Feedback = "created" | "updated" | "deleted" | null;

function stripId(item: WithId<FamilyDoc>): FamilyDoc {
  const { id, ...rest } = item;
  void id;
  return rest;
}

export default function AdminFamiliesPage() {
  const { language } = useLanguage();
  const { loading: authLoading, admin } = useAuthGuard();

  const isArabic = language === "ar";

  const [items, setItems] = useState<Array<WithId<FamilyDoc>>>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [formTarget, setFormTarget] = useState<FormTarget>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<WithId<FamilyDoc> | null>(null);
  const [deleting, setDeleting] = useState(false);

  const allowed = admin
    ? canAccess(admin, PERMISSIONS.manageFamilies)
    : false;

  const loadingList = allowed && !hasFetched;

  useEffect(() => {
    if (!allowed) return;

    let cancelled = false;

    familiesService
      .getAll({
        orderByField: {
          field: "order",
          direction: "asc",
        },
      })
      .then((docs) => {
        if (cancelled) return;

        setItems(docs);
        setHasFetched(true);
      })
      .catch(() => {
        if (cancelled) return;
        setHasFetched(true);
      });

    return () => {
      cancelled = true;
    };
  }, [allowed]);

  if (authLoading || loadingList) {
    return <LoadingDashboard />;
  }

  if (!admin || !allowed) {
    return <Unauthorized />;
  }

  async function handleCreate(values: FamilyDoc) {
    const now = Timestamp.now();

    const payload: FamilyDoc = {
      ...values,
      createdAt: now,
      updatedAt: now,
    };

    const id = await familiesService.create(payload);

    setItems((prev) => [
      {
        id,
        ...payload,
      },
      ...prev,
    ]);

    setFormTarget(null);
    setFeedback("created");
  }

  async function handleUpdate(values: FamilyDoc) {
    if (formTarget === null || formTarget === "new") {
      return;
    }

    const id = formTarget.id;
    const updatedAt = Timestamp.now();

    const payload = {
      ...values,
      updatedAt,
    };

    await familiesService.update(id, payload);

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...payload,
            }
          : item
      )
    );

    setFormTarget(null);
    setFeedback("updated");
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await familiesService.remove(deleteTarget.id);

      setItems((prev) =>
        prev.filter((item) => item.id !== deleteTarget.id)
      );

      setFeedback("deleted");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  const inForm = formTarget !== null;
  const isCreating = formTarget === "new";

  return (
    <PageContainer className="flex flex-col gap-8">
      <AdminHeader
        title={
          !inForm
            ? isArabic
              ? "الأسر الطلابية"
              : "Student Families"
            : isCreating
              ? isArabic
                ? "إضافة أسرة طلابية"
                : "Add Student Family"
              : isArabic
                ? "تعديل الأسرة الطلابية"
                : "Edit Student Family"
        }
        description={
          !inForm
            ? isArabic
              ? "إدارة الأسر الطلابية وبياناتها."
              : "Manage student families and their information."
            : undefined
        }
        breadcrumbs={[
          {
            label: isArabic ? "لوحة التحكم" : "Dashboard",
            href: "/admin",
          },
          {
            label: isArabic ? "الأسر الطلابية" : "Student Families",
            href: inForm ? "/admin/families" : undefined,
          },
          ...(inForm
            ? [
                {
                  label: isCreating
                    ? isArabic
                      ? "إضافة جديدة"
                      : "New"
                    : isArabic
                      ? "تعديل"
                      : "Edit",
                },
              ]
            : []),
        ]}
        actions={
          !inForm ? (
            <button
              type="button"
              onClick={() => setFormTarget("new")}
              className={cx(
                "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-dark",
                focusRing
              )}
            >
              <Plus
                className="h-4 w-4"
                aria-hidden="true"
              />

              {isArabic ? "إضافة أسرة" : "Add Family"}
            </button>
          ) : undefined
        }
      />

      {feedback && (
        <p className="rounded-md border border-secondary/20 bg-secondary-light px-4 py-2 text-sm font-medium text-secondary-dark dark:border-secondary/30 dark:bg-secondary/15 dark:text-secondary-light">
          {feedback === "created"
            ? isArabic
              ? "تمت إضافة الأسرة بنجاح."
              : "Family created successfully."
            : feedback === "updated"
              ? isArabic
                ? "تم تحديث الأسرة بنجاح."
                : "Family updated successfully."
              : isArabic
                ? "تم حذف الأسرة بنجاح."
                : "Family deleted successfully."}
        </p>
      )}

      {!inForm ? (
        items.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-colors"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={isArabic ? item.nameAr : item.nameEn}
                    className="mb-4 h-40 w-full rounded-lg object-cover"
                  />
                ) : null}

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-foreground">
                      {isArabic ? item.nameAr : item.nameEn}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {isArabic ? item.nameEn : item.nameAr}
                    </p>
                  </div>

                  <span
                    className={cx(
                      "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                      item.isActive
                        ? "bg-secondary-light text-secondary-dark dark:bg-secondary/15 dark:text-secondary-light"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {item.isActive
                      ? isArabic
                        ? "نشطة"
                        : "Active"
                      : isArabic
                        ? "غير نشطة"
                        : "Inactive"}
                  </span>
                </div>

                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                  {isArabic
                    ? item.descriptionAr
                    : item.descriptionEn}
                </p>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormTarget(item)}
                    className={cx(
                      "rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted",
                      focusRing
                    )}
                  >
                    {isArabic ? "تعديل" : "Edit"}
                  </button>

                  <a
                    href={`/admin/families/${item.id}/events`}
                    className={cx(
                      "inline-flex items-center justify-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10",
                      focusRing
                    )}
                  >
                    <CalendarDays
                      className="h-4 w-4"
                      aria-hidden="true"
                    />

                    {isArabic ? "الفعاليات" : "Events"}
                  </a>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className={cx(
                      "rounded-md border border-red-200 bg-transparent px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30",
                      focusRing
                    )}
                  >
                    {isArabic ? "حذف" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="UsersRound"
            title={
              isArabic
                ? "لا توجد أسر طلابية"
                : "No student families"
            }
            description={
              isArabic
                ? "ابدأ بإضافة أول أسرة طلابية."
                : "Start by adding your first student family."
            }
          />
        )
      ) : (
        <FamilyForm
          key={
            isCreating
              ? "new"
              : (formTarget as WithId<FamilyDoc>).id
          }
          initialValues={
            isCreating
              ? EMPTY_FAMILY
              : stripId(formTarget as WithId<FamilyDoc>)
          }
          onSubmit={isCreating ? handleCreate : handleUpdate}
          onCancel={() => setFormTarget(null)}
          language={language}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title={
          isArabic
            ? "حذف الأسرة الطلابية"
            : "Delete Student Family"
        }
        description={
          deleteTarget
            ? isArabic
              ? deleteTarget.nameAr
              : deleteTarget.nameEn
            : undefined
        }
        confirmLabel={isArabic ? "حذف" : "Delete"}
        confirmingLabel={
          isArabic ? "جاري الحذف..." : "Deleting..."
        }
        cancelLabel={isArabic ? "إلغاء" : "Cancel"}
        destructive
        confirming={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </PageContainer>
  );
}

type FamilyFormProps = {
  initialValues: FamilyDoc;
  onSubmit: (values: FamilyDoc) => Promise<void>;
  onCancel: () => void;
  language: "ar" | "en";
};

function FamilyForm({
  initialValues,
  onSubmit,
  onCancel,
  language,
}: FamilyFormProps) {
  const [values, setValues] = useState<FamilyDoc>(initialValues);
  const [submitting, setSubmitting] = useState(false);

  function update(
    field: keyof FamilyDoc,
    value: string | number | boolean
  ) {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitting(true);

    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-foreground";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-surface p-6 shadow-sm"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className={labelClass}>
            {language === "ar"
              ? "اسم الأسرة بالعربي"
              : "Family Name (Arabic)"}
          </label>

          <input
            value={values.nameAr}
            onChange={(e) =>
              update("nameAr", e.target.value)
            }
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>
            {language === "ar"
              ? "اسم الأسرة بالإنجليزية"
              : "Family Name (English)"}
          </label>

          <input
            value={values.nameEn}
            onChange={(e) =>
              update("nameEn", e.target.value)
            }
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>
            {language === "ar"
              ? "الوصف بالعربي"
              : "Description (Arabic)"}
          </label>

          <textarea
            value={values.descriptionAr}
            onChange={(e) =>
              update("descriptionAr", e.target.value)
            }
            className={`${inputClass} min-h-32 resize-y`}
            required
          />
        </div>

        <div>
          <label className={labelClass}>
            {language === "ar"
              ? "الوصف بالإنجليزية"
              : "Description (English)"}
          </label>

          <textarea
            value={values.descriptionEn}
            onChange={(e) =>
              update("descriptionEn", e.target.value)
            }
            className={`${inputClass} min-h-32 resize-y`}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>
            {language === "ar"
              ? "رابط صورة الأسرة"
              : "Family Image URL"}
          </label>

          <input
            type="url"
            value={values.imageUrl ?? ""}
            onChange={(e) =>
              update("imageUrl", e.target.value)
            }
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className={labelClass}>WhatsApp</label>

          <input
            type="url"
            value={values.whatsapp ?? ""}
            onChange={(e) =>
              update("whatsapp", e.target.value)
            }
            className={inputClass}
            placeholder="https://wa.me/..."
          />
        </div>

        <div>
          <label className={labelClass}>Email</label>

          <input
            type="email"
            value={values.email ?? ""}
            onChange={(e) =>
              update("email", e.target.value)
            }
            className={inputClass}
            placeholder="family@example.com"
          />
        </div>

        <div>
          <label className={labelClass}>Phone</label>

          <input
            type="tel"
            value={values.phone ?? ""}
            onChange={(e) =>
              update("phone", e.target.value)
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Instagram</label>

          <input
            type="url"
            value={values.instagram ?? ""}
            onChange={(e) =>
              update("instagram", e.target.value)
            }
            className={inputClass}
            placeholder="https://instagram.com/..."
          />
        </div>

        <div>
          <label className={labelClass}>Facebook</label>

          <input
            type="url"
            value={values.facebook ?? ""}
            onChange={(e) =>
              update("facebook", e.target.value)
            }
            className={inputClass}
            placeholder="https://facebook.com/..."
          />
        </div>

        <div>
          <label className={labelClass}>LinkedIn</label>

          <input
            type="url"
            value={values.linkedin ?? ""}
            onChange={(e) =>
              update("linkedin", e.target.value)
            }
            className={inputClass}
            placeholder="https://linkedin.com/..."
          />
        </div>

        <div>
          <label className={labelClass}>
            {language === "ar"
              ? "رابط التقديم"
              : "Application Form URL"}
          </label>

          <input
            type="url"
            value={values.applicationUrl ?? ""}
            onChange={(e) =>
              update("applicationUrl", e.target.value)
            }
            className={inputClass}
            placeholder="https://..."
          />
        </div>

        <div>
          <label className={labelClass}>
            {language === "ar"
              ? "الترتيب"
              : "Display Order"}
          </label>

          <input
            type="number"
            min={0}
            value={values.order}
            onChange={(e) =>
              update("order", Number(e.target.value))
            }
            className={inputClass}
          />
        </div>

        <div className="flex items-center gap-3 md:col-span-2">
          <input
            id="family-active"
            type="checkbox"
            checked={values.isActive}
            onChange={(e) =>
              update("isActive", e.target.checked)
            }
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />

          <label
            htmlFor="family-active"
            className="text-sm font-medium text-foreground"
          >
            {language === "ar"
              ? "الأسرة نشطة وتظهر للطلاب"
              : "Family is active and visible to students"}
          </label>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-end gap-3 border-t border-border pt-5">
        <button
          type="button"
          onClick={onCancel}
          className={cx(
            "rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted",
            focusRing
          )}
        >
          {language === "ar" ? "إلغاء" : "Cancel"}
        </button>

        <button
          type="submit"
          disabled={submitting}
          className={cx(
            "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60",
            focusRing
          )}
        >
          {submitting
            ? language === "ar"
              ? "جاري الحفظ..."
              : "Saving..."
            : language === "ar"
              ? "حفظ الأسرة"
              : "Save Family"}
        </button>
      </div>
    </form>
  );
}
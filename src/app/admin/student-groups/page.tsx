"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Plus } from "lucide-react";
import { Timestamp } from "firebase/firestore";

import { PageContainer } from "@/components/admin/PageContainer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Unauthorized } from "@/components/admin/Unauthorized";
import { LoadingDashboard } from "@/components/admin/LoadingDashboard";

import { studentGroupsService } from "@/lib/firebase/services";
import type { StudentGroupDoc } from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";

import { useAuthGuard, canAccess } from "@/lib/auth/routeGuard";
import { PERMISSIONS } from "@/lib/auth/constants";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

const EMPTY_STUDENT_GROUP: StudentGroupDoc = {
  nameAr: "",
  nameEn: "",
  descriptionAr: "",
  descriptionEn: "",

  level: 1,

  whatsappUrl: "",
  order: 0,
  isActive: true,

  createdAt: undefined as unknown as StudentGroupDoc["createdAt"],
  updatedAt: undefined as unknown as StudentGroupDoc["updatedAt"],
};

const EMPTY_STUDENT_MATERIAL: StudentGroupDoc = {
  ...EMPTY_STUDENT_GROUP,
  kind: "material",
  nameAr: "مواد الفرقة الأولى",
  nameEn: "Level 1 Material",
  materialUrl: "",
};

type FormTarget = WithId<StudentGroupDoc> | "new" | "new-material" | null;

type Feedback = "created" | "updated" | "deleted" | null;

function stripId(item: WithId<StudentGroupDoc>): StudentGroupDoc {
  const { id, ...rest } = item;
  void id;
  return rest;
}

export default function AdminStudentGroupsPage() {
  const { language } = useLanguage();
  const { loading: authLoading, admin } = useAuthGuard();

  const isArabic = language === "ar";

  const [items, setItems] = useState<
    Array<WithId<StudentGroupDoc>>
  >([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [formTarget, setFormTarget] =
    useState<FormTarget>(null);
  const [feedback, setFeedback] =
    useState<Feedback>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<WithId<StudentGroupDoc> | null>(null);
  const [deleting, setDeleting] = useState(false);

  const allowed = admin
    ? canAccess(admin, PERMISSIONS.manageStudentGroups)
    : false;

  const loadingList = allowed && !hasFetched;

  useEffect(() => {
    if (!allowed) return;

    let cancelled = false;

    studentGroupsService
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

  async function handleCreate(values: StudentGroupDoc) {
    const now = Timestamp.now();

    const payload: StudentGroupDoc = {
      ...values,
      createdAt: now,
      updatedAt: now,
    };

    const id = await studentGroupsService.create(payload);

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

  async function handleUpdate(values: StudentGroupDoc) {
    if (formTarget === null || formTarget === "new" || formTarget === "new-material") {
      return;
    }

    const id = formTarget.id;
    const updatedAt = Timestamp.now();

    const payload = {
      ...values,
      updatedAt,
    };

    await studentGroupsService.update(id, payload);

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
      await studentGroupsService.remove(deleteTarget.id);

      setItems((prev) =>
        prev.filter(
          (item) => item.id !== deleteTarget.id
        )
      );

      setFeedback("deleted");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  const inForm = formTarget !== null;
  const isCreating = formTarget === "new" || formTarget === "new-material";
  const isMaterialForm = formTarget === "new-material" ||
    (typeof formTarget === "object" && formTarget?.kind === "material");

  return (
    <PageContainer className="flex flex-col gap-8">
      <AdminHeader
        title={
          !inForm
            ? isArabic
              ? "جروبات الطلاب"
              : "Student Groups"
            : isCreating
              ? isArabic
                ? isMaterialForm ? "إضافة مواد للدفعة" : "إضافة جروب طلابي"
                : isMaterialForm ? "Add Student Material" : "Add Student Group"
              : isArabic
                ? isMaterialForm ? "تعديل مواد الدفعة" : "تعديل الجروب الطلابي"
                : isMaterialForm ? "Edit Student Material" : "Edit Student Group"
        }
        description={
          !inForm
            ? isArabic
              ? "إدارة جروبات الطلاب والمواد التعليمية حسب الفرقة الدراسية."
              : "Manage student groups and learning materials by academic level."
            : undefined
        }
        breadcrumbs={[
          {
            label: isArabic
              ? "لوحة التحكم"
              : "Dashboard",
            href: "/admin",
          },
          {
            label: isArabic
              ? "جروبات الطلاب"
              : "Student Groups",
            href: inForm
              ? "/admin/student-groups"
              : undefined,
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
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFormTarget("new")}
                className={cx("inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-dark", focusRing)}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                {isArabic ? "إضافة جروب" : "Add Group"}
              </button>
              <button
                type="button"
                onClick={() => setFormTarget("new-material")}
                className={cx("inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10", focusRing)}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                {isArabic ? "إضافة مواد" : "Add Material"}
              </button>
            </div>
          ) : undefined
        }
      />

      {feedback && (
        <p className="rounded-md border border-secondary/20 bg-secondary-light px-4 py-2 text-sm font-medium text-secondary-dark dark:border-secondary/30 dark:bg-secondary/15 dark:text-secondary-light">
          {feedback === "created"
            ? isArabic
              ? "تمت إضافة الجروب بنجاح."
              : "Group created successfully."
            : feedback === "updated"
              ? isArabic
                ? "تم تحديث الجروب بنجاح."
                : "Group updated successfully."
              : isArabic
                ? "تم حذف الجروب بنجاح."
                : "Group deleted successfully."}
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
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="mb-2 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {isArabic
                        ? `الفرقة ${item.level}`
                        : `Level ${item.level}`}
                    </span>

                    <h2 className="truncate text-base font-semibold text-foreground">
                      {isArabic
                        ? item.nameAr
                        : item.nameEn}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {isArabic
                        ? item.nameEn
                        : item.nameAr}
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
                        ? "نشط"
                        : "Active"
                      : isArabic
                        ? "غير نشط"
                        : "Inactive"}
                  </span>
                </div>

                {item.descriptionAr ||
                item.descriptionEn ? (
                  <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                    {isArabic
                      ? item.descriptionAr
                      : item.descriptionEn}
                  </p>
                ) : null}

                <div className="mt-4 rounded-lg border border-border bg-background/50 px-3 py-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    {item.kind === "material" ? "Material" : "WhatsApp"}
                  </p>

                  <p className="mt-1 truncate text-sm text-foreground">
                    {item.kind === "material" ? item.materialUrl : item.whatsappUrl}
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormTarget(item)
                    }
                    className={cx(
                      "rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted",
                      focusRing
                    )}
                  >
                    {isArabic ? "تعديل" : "Edit"}
                  </button>

                  <a
                    href={item.kind === "material" ? item.materialUrl : item.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cx(
                      "inline-flex items-center justify-center gap-1.5 rounded-md border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10",
                      focusRing
                    )}
                  >
                    <ExternalLink
                      className="h-4 w-4"
                      aria-hidden="true"
                    />

                    {isArabic ? "فتح" : "Open"}
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      setDeleteTarget(item)
                    }
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
                ? "لا توجد جروبات طلابية"
                : "No student groups"
            }
            description={
              isArabic
                ? "ابدأ بإضافة أول جروب طلابي."
                : "Start by adding your first student group."
            }
          />
        )
      ) : (
        <StudentGroupForm
          key={
            isCreating
              ? "new"
              : (formTarget as WithId<StudentGroupDoc>).id
          }
          initialValues={
            isCreating
              ? isMaterialForm ? EMPTY_STUDENT_MATERIAL : EMPTY_STUDENT_GROUP
              : stripId(
                  formTarget as WithId<StudentGroupDoc>
                )
          }
          onSubmit={
            isCreating ? handleCreate : handleUpdate
          }
          onCancel={() => setFormTarget(null)}
          language={language}
          isMaterial={isMaterialForm}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title={
          deleteTarget?.kind === "material"
            ? isArabic ? "حذف مواد الدفعة" : "Delete Student Material"
            : isArabic ? "حذف الجروب الطلابي" : "Delete Student Group"
        }
        description={
          deleteTarget
            ? isArabic
              ? deleteTarget.nameAr
              : deleteTarget.nameEn
            : undefined
        }
        confirmLabel={
          isArabic ? "حذف" : "Delete"
        }
        confirmingLabel={
          isArabic
            ? "جاري الحذف..."
            : "Deleting..."
        }
        cancelLabel={
          isArabic ? "إلغاء" : "Cancel"
        }
        destructive
        confirming={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </PageContainer>
  );
}

type StudentGroupFormProps = {
  initialValues: StudentGroupDoc;
  onSubmit: (values: StudentGroupDoc) => Promise<void>;
  onCancel: () => void;
  language: "ar" | "en";
  isMaterial: boolean;
};

function StudentGroupForm({
  initialValues,
  onSubmit,
  onCancel,
  language,
  isMaterial,
}: StudentGroupFormProps) {
  const [values, setValues] =
    useState<StudentGroupDoc>(initialValues);
  const [submitting, setSubmitting] =
    useState(false);

  function update(
    field: keyof StudentGroupDoc,
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
        {!isMaterial && <>
        <div>
          <label className={labelClass}>
            {language === "ar"
              ? "اسم الجروب بالعربي"
              : "Group Name (Arabic)"}
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
              ? "اسم الجروب بالإنجليزية"
              : "Group Name (English)"}
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
            value={values.descriptionAr ?? ""}
            onChange={(e) =>
              update(
                "descriptionAr",
                e.target.value
              )
            }
            className={`${inputClass} min-h-32 resize-y`}
          />
        </div>

        <div>
          <label className={labelClass}>
            {language === "ar"
              ? "الوصف بالإنجليزية"
              : "Description (English)"}
          </label>

          <textarea
            value={values.descriptionEn ?? ""}
            onChange={(e) =>
              update(
                "descriptionEn",
                e.target.value
              )
            }
            className={`${inputClass} min-h-32 resize-y`}
          />
        </div>
        </>}

        <div>
          <label className={labelClass}>
            {language === "ar"
              ? "الفرقة الدراسية"
              : "Academic Level"}
          </label>

          <select
            value={values.level}
            onChange={(e) => {
              const level = Number(e.target.value) as StudentGroupDoc["level"];
              update("level", level);
              if (isMaterial) {
                const names = ["الأولى", "الثانية", "الثالثة", "الرابعة"];
                update("nameAr", `مواد الفرقة ${names[level - 1]}`);
                update("nameEn", `Level ${level} Material`);
              }
            }}
            className={inputClass}
          >
            <option value={1}>
              {language === "ar"
                ? "الفرقة الأولى"
                : "Level 1"}
            </option>

            <option value={2}>
              {language === "ar"
                ? "الفرقة الثانية"
                : "Level 2"}
            </option>

            <option value={3}>
              {language === "ar"
                ? "الفرقة الثالثة"
                : "Level 3"}
            </option>

            <option value={4}>
              {language === "ar"
                ? "الفرقة الرابعة"
                : "Level 4"}
            </option>
          </select>
        </div>

        {!isMaterial && <div>
          <label className={labelClass}>
            {language === "ar"
              ? "ترتيب الجروب"
              : "Display Order"}
          </label>

          <input
            type="number"
            min={0}
            value={values.order}
            onChange={(e) =>
              update(
                "order",
                Number(e.target.value)
              )
            }
            className={inputClass}
          />
        </div>}

        {!isMaterial && <div className="md:col-span-2">
          <label className={labelClass}>
            WhatsApp Group URL
          </label>

          <input
            type="url"
            value={values.whatsappUrl}
            onChange={(e) =>
              update(
                "whatsappUrl",
                e.target.value
              )
            }
            className={inputClass}
            placeholder="https://chat.whatsapp.com/..."
            required
          />
        </div>}

        {isMaterial && <div className="md:col-span-2">
          <label className={labelClass}>
            {language === "ar"
              ? "رابط المواد التعليمية"
              : "Material URL"}
          </label>

          <input
            type="url"
            value={values.materialUrl ?? ""}
            onChange={(e) =>
              update("materialUrl", e.target.value)
            }
            className={inputClass}
            placeholder="https://..."
            required
          />
        </div>}

        <div className="flex items-center gap-3 md:col-span-2">
          <input
            id="student-group-active"
            type="checkbox"
            checked={values.isActive}
            onChange={(e) =>
              update(
                "isActive",
                e.target.checked
              )
            }
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />

          <label
            htmlFor="student-group-active"
            className="text-sm font-medium text-foreground"
          >
            {language === "ar"
              ? isMaterial ? "المواد نشطة وتظهر للطلاب" : "الجروب نشط ويظهر للطلاب"
              : isMaterial ? "Material is active and visible to students" : "Group is active and visible to students"}
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
          {language === "ar"
            ? "إلغاء"
            : "Cancel"}
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
              ? isMaterial ? "حفظ المواد" : "حفظ الجروب"
              : isMaterial ? "Save Material" : "Save Group"}
        </button>
      </div>
    </form>
  );
}

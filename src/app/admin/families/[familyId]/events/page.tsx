"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Plus, Pencil, Trash2 } from "lucide-react";
import { Timestamp } from "firebase/firestore";

import { PageContainer } from "@/components/admin/PageContainer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Unauthorized } from "@/components/admin/Unauthorized";
import { LoadingDashboard } from "@/components/admin/LoadingDashboard";

import {
  createFamilyEventsService,
  familiesService,
} from "@/lib/firebase/services";

import type {
  FamilyDoc,
  FamilyEventDoc,
} from "@/lib/firebase/collections";

import type { WithId } from "@/lib/firebase/services";

import { useAuthGuard, canAccess } from "@/lib/auth/routeGuard";
import { PERMISSIONS } from "@/lib/auth/constants";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

import { useParams } from "next/navigation";

type EventWithId = WithId<FamilyEventDoc>;
type FormTarget = EventWithId | "new" | null;

const EMPTY_EVENT: FamilyEventDoc = {
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  imageUrl: "",
  date: undefined as unknown as FamilyEventDoc["date"],
  createdAt: undefined as unknown as FamilyEventDoc["createdAt"],
};

function stripId(item: EventWithId): FamilyEventDoc {
  const { id, ...rest } = item;
  void id;
  return rest;
}

function toDateTimeLocal(timestamp: FamilyEventDoc["date"]) {
  if (!timestamp) return "";

  const date = timestamp.toDate();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function AdminFamilyEventsPage() {
  const params = useParams<{ familyId: string }>();
  const familyId = params.familyId;

  const { language } = useLanguage();
  const isArabic = language === "ar";

  const { loading: authLoading, admin } = useAuthGuard();

  const allowed = admin
    ? canAccess(admin, PERMISSIONS.manageFamilies)
    : false;

  const [family, setFamily] = useState<WithId<FamilyDoc> | null>(null);
  const [events, setEvents] = useState<EventWithId[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  const [formTarget, setFormTarget] = useState<FormTarget>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<EventWithId | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [feedback, setFeedback] = useState<
    "created" | "updated" | "deleted" | null
  >(null);

  const loadingList = allowed && !hasFetched;

  useEffect(() => {
    if (!allowed || !familyId) return;

    let cancelled = false;

    const eventsService = createFamilyEventsService(familyId);

    Promise.all([
      familiesService.getById(familyId),
      eventsService.getAll({
        orderByField: {
          field: "date",
          direction: "asc",
        },
      }),
    ])
      .then(([familyData, eventData]) => {
        if (cancelled) return;

        setFamily(familyData);
        setEvents(eventData);
        setHasFetched(true);
      })
      .catch(() => {
        if (cancelled) return;
        setHasFetched(true);
      });

    return () => {
      cancelled = true;
    };
  }, [allowed, familyId]);

  if (authLoading || loadingList) {
    return <LoadingDashboard />;
  }

  if (!admin || !allowed) {
    return <Unauthorized />;
  }

  if (!family) {
    return (
      <PageContainer>
        <AdminHeader
          title={isArabic ? "الأسرة غير موجودة" : "Family Not Found"}
          breadcrumbs={[
            {
              label: isArabic ? "لوحة التحكم" : "Dashboard",
              href: "/admin",
            },
            {
              label: isArabic
                ? "الأسر الطلابية"
                : "Student Families",
              href: "/admin/families",
            },
          ]}
        />

        <EmptyState
          icon="UsersRound"
          title={
            isArabic
              ? "لم يتم العثور على الأسرة"
              : "Family not found"
          }
          description={
            isArabic
              ? "قد تكون الأسرة قد تم حذفها أو أن الرابط غير صحيح."
              : "The family may have been deleted or the link is invalid."
          }
        />
      </PageContainer>
    );
  }

  const eventsService = createFamilyEventsService(familyId);

  async function handleCreate(values: FamilyEventDoc) {
    const payload: FamilyEventDoc = {
      ...values,
      createdAt: Timestamp.now(),
    };

    const id = await eventsService.create(payload);

    setEvents((prev) =>
      [...prev, { id, ...payload }].sort(
        (a, b) =>
          a.date.toMillis() - b.date.toMillis()
      )
    );

    setFormTarget(null);
    setFeedback("created");
  }

  async function handleUpdate(values: FamilyEventDoc) {
    if (formTarget === null || formTarget === "new") return;

    const id = formTarget.id;

    await eventsService.update(id, values);

    setEvents((prev) =>
      prev
        .map((event) =>
          event.id === id
            ? { ...event, ...values }
            : event
        )
        .sort(
          (a, b) =>
            a.date.toMillis() - b.date.toMillis()
        )
    );

    setFormTarget(null);
    setFeedback("updated");
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await eventsService.remove(deleteTarget.id);

      setEvents((prev) =>
        prev.filter(
          (event) => event.id !== deleteTarget.id
        )
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
          inForm
            ? isCreating
              ? isArabic
                ? "إضافة فعالية"
                : "Add Event"
              : isArabic
                ? "تعديل الفعالية"
                : "Edit Event"
            : isArabic
              ? "فعاليات الأسرة"
              : "Family Events"
        }
        description={
          !inForm
            ? isArabic
              ? `إدارة فعاليات ${family.nameAr}`
              : `Manage events for ${family.nameEn}`
            : undefined
        }
        breadcrumbs={[
          {
            label: isArabic ? "لوحة التحكم" : "Dashboard",
            href: "/admin",
          },
          {
            label: isArabic
              ? "الأسر الطلابية"
              : "Student Families",
            href: "/admin/families",
          },
          {
            label: isArabic
              ? family.nameAr
              : family.nameEn,
            href: "/admin/families",
          },
          ...(inForm
            ? [
                {
                  label: isCreating
                    ? isArabic
                      ? "إضافة فعالية"
                      : "Add Event"
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
                "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark",
                focusRing
              )}
            >
              <Plus
                className="h-4 w-4"
                aria-hidden="true"
              />
              {isArabic ? "إضافة فعالية" : "Add Event"}
            </button>
          ) : undefined
        }
      />

      {feedback && (
        <p className="rounded-md border border-secondary/20 bg-secondary-light px-4 py-2 text-sm font-medium text-secondary-dark dark:border-secondary/30 dark:bg-secondary/15 dark:text-secondary-light">
          {feedback === "created"
            ? isArabic
              ? "تمت إضافة الفعالية بنجاح."
              : "Event created successfully."
            : feedback === "updated"
              ? isArabic
                ? "تم تحديث الفعالية بنجاح."
                : "Event updated successfully."
              : isArabic
                ? "تم حذف الفعالية بنجاح."
                : "Event deleted successfully."}
        </p>
      )}

      {!inForm ? (
        events.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const title = isArabic
                ? event.titleAr
                : event.titleEn;

              const secondaryTitle = isArabic
                ? event.titleEn
                : event.titleAr;

              const description = isArabic
                ? event.descriptionAr
                : event.descriptionEn;

              return (
                <article
                  key={event.id}
                  className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm"
                >
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={title}
                      className="h-44 w-full object-cover"
                    />
                  ) : null}

                  <div className="p-5">
                    <p className="text-xs font-medium text-primary">
                      {event.date
                        .toDate()
                        .toLocaleDateString(
                          isArabic ? "ar-EG" : "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                    </p>

                    <h2 className="mt-2 text-lg font-semibold text-foreground">
                      {title}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {secondaryTitle}
                    </p>

                    {description && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {description}
                      </p>
                    )}

                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFormTarget(event)
                        }
                        className={cx(
                          "inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                          focusRing
                        )}
                      >
                        <Pencil className="h-4 w-4" />
                        {isArabic ? "تعديل" : "Edit"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget(event)
                        }
                        className={cx(
                          "inline-flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30",
                          focusRing
                        )}
                      >
                        <Trash2 className="h-4 w-4" />
                        {isArabic ? "حذف" : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon="Calendar"
            title={
              isArabic
                ? "لا توجد فعاليات"
                : "No events yet"
            }
            description={
              isArabic
                ? "ابدأ بإضافة أول فعالية لهذه الأسرة."
                : "Start by adding the first event for this family."
            }
          />
        )
      ) : (
        <FamilyEventForm
          key={
            isCreating
              ? "new"
              : (formTarget as EventWithId).id
          }
          initialValues={
            isCreating
              ? EMPTY_EVENT
              : stripId(formTarget as EventWithId)
          }
          onSubmit={
            isCreating
              ? handleCreate
              : handleUpdate
          }
          onCancel={() => setFormTarget(null)}
          language={language}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title={
          isArabic
            ? "حذف الفعالية"
            : "Delete Event"
        }
        description={
          deleteTarget
            ? isArabic
              ? deleteTarget.titleAr
              : deleteTarget.titleEn
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

type FamilyEventFormProps = {
  initialValues: FamilyEventDoc;
  onSubmit: (values: FamilyEventDoc) => Promise<void>;
  onCancel: () => void;
  language: "ar" | "en";
};

function FamilyEventForm({
  initialValues,
  onSubmit,
  onCancel,
  language,
}: FamilyEventFormProps) {
  const isArabic = language === "ar";

  const [values, setValues] =
    useState<FamilyEventDoc>(initialValues);

  const [submitting, setSubmitting] =
    useState(false);

  function update(
    field: keyof FamilyEventDoc,
    value: string | Timestamp
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

    if (!values.titleAr.trim() || !values.titleEn.trim()) {
      return;
    }

    if (!values.date) {
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 dark:[color-scheme:dark]";

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
            {isArabic
              ? "عنوان الفعالية بالعربي"
              : "Event Title (Arabic)"}
          </label>

          <input
            type="text"
            value={values.titleAr}
            onChange={(event) =>
              update("titleAr", event.target.value)
            }
            required
            className={inputClass}
            dir="rtl"
          />
        </div>

        <div>
          <label className={labelClass}>
            {isArabic
              ? "عنوان الفعالية بالإنجليزي"
              : "Event Title (English)"}
          </label>

          <input
            type="text"
            value={values.titleEn}
            onChange={(event) =>
              update("titleEn", event.target.value)
            }
            required
            className={inputClass}
            dir="ltr"
          />
        </div>

        <div>
          <label className={labelClass}>
            {isArabic
              ? "الوصف بالعربي"
              : "Description (Arabic)"}
          </label>

          <textarea
            value={values.descriptionAr ?? ""}
            onChange={(event) =>
              update(
                "descriptionAr",
                event.target.value
              )
            }
            rows={5}
            className={inputClass}
            dir="rtl"
          />
        </div>

        <div>
          <label className={labelClass}>
            {isArabic
              ? "الوصف بالإنجليزي"
              : "Description (English)"}
          </label>

          <textarea
            value={values.descriptionEn ?? ""}
            onChange={(event) =>
              update(
                "descriptionEn",
                event.target.value
              )
            }
            rows={5}
            className={inputClass}
            dir="ltr"
          />
        </div>

        <div>
          <label className={labelClass}>
            {isArabic
              ? "رابط صورة الفعالية"
              : "Event Image URL"}
          </label>

          <input
            type="url"
            value={values.imageUrl}
            onChange={(event) =>
              update(
                "imageUrl",
                event.target.value
              )
            }
            required
            className={inputClass}
            dir="ltr"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className={labelClass}>
            {isArabic
              ? "تاريخ ووقت الفعالية"
              : "Event Date & Time"}
          </label>

          <input
            type="datetime-local"
            value={toDateTimeLocal(values.date)}
            onChange={(event) => {
              const value = event.target.value;

              if (!value) return;

              update(
                "date",
                Timestamp.fromDate(
                  new Date(value)
                )
              );
            }}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className={cx(
            "rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
            focusRing
          )}
        >
          {isArabic ? "إلغاء" : "Cancel"}
        </button>

        <button
          type="submit"
          disabled={submitting}
          className={cx(
            "rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60",
            focusRing
          )}
        >
          {submitting
            ? isArabic
              ? "جاري الحفظ..."
              : "Saving..."
            : isArabic
              ? "حفظ"
              : "Save"}
        </button>
      </div>
    </form>
  );
}
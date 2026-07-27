"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { EventForm } from "@/components/admin/EventForm";
import { EventListItem } from "@/components/admin/EventListItem";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { eventsService } from "@/lib/firebase/services";
import type { EventDoc } from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";
import { useAuthGuard, canAccess } from "@/lib/auth/routeGuard";
import { PERMISSIONS } from "@/lib/auth/constants";
import { Unauthorized } from "@/components/admin/Unauthorized";
import { LoadingDashboard } from "@/components/admin/LoadingDashboard";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

const EMPTY_EVENT: EventDoc = {
  title: "",
  description: "",
  date: undefined as unknown as EventDoc["date"],
  location: "",
  imageUrl: "",
  category: "",
  isPublished: false,
  createdAt: undefined as unknown as EventDoc["createdAt"],
};

function stripId(item: WithId<EventDoc>): EventDoc {
  const { id, ...rest } = item;
  void id;
  return rest;
}

type FormTarget = WithId<EventDoc> | "new" | null;
type Feedback = "created" | "updated" | "deleted" | null;

/**
 * Events management page (Sprint 3.4). Third real CRUD admin page,
 * extending Sprint 3.3's Announcements list pattern to `eventsService`
 * (Sprint 2.2, unused until now) and the `manageEvents` permission
 * (Sprint 2.3, unused until now). Reuses the same ConfirmDialog as
 * Announcements rather than a new one.
 *
 * List is ordered by `date` ascending (soonest first) rather than
 * `createdAt` descending — matches how the public EventsSection already
 * sorts events, and is the more useful order for managing upcoming
 * activities.
 */
export default function AdminEventsPage() {
  const { translate } = useLanguage();
  const { loading: authLoading, admin } = useAuthGuard();
  const [items, setItems] = useState<Array<WithId<EventDoc>>>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [formTarget, setFormTarget] = useState<FormTarget>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [deleteTarget, setDeleteTarget] = useState<WithId<EventDoc> | null>(null);
  const [deleting, setDeleting] = useState(false);

  const allowed = admin ? canAccess(admin, PERMISSIONS.manageEvents) : false;
  const loadingList = allowed && !hasFetched;

  useEffect(() => {
    if (!allowed) return;

    let cancelled = false;
    eventsService
      .getAll({ orderByField: { field: "date", direction: "asc" } })
      .then((docs) => {
        if (cancelled) return;
        setItems(docs);
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

  async function handleCreate(values: EventDoc) {
    const payload: EventDoc = { ...values, createdAt: Timestamp.now() };
    const id = await eventsService.create(payload);
    setItems((prev) => [...prev, { id, ...payload }]);
    setFormTarget(null);
    setFeedback("created");
  }

  async function handleUpdate(values: EventDoc) {
    if (formTarget === null || formTarget === "new") return;
    const id = formTarget.id;
    await eventsService.update(id, values);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...values } : item))
    );
    setFormTarget(null);
    setFeedback("updated");
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await eventsService.remove(deleteTarget.id);
      setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
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
            ? translate("admin.events.heading")
            : isCreating
              ? translate("admin.events.form.createHeading")
              : translate("admin.events.form.editHeading")
        }
        description={!inForm ? translate("admin.events.subheading") : undefined}
        breadcrumbs={[
          { label: translate("admin.breadcrumb.root"), href: "/admin" },
          !inForm
            ? { label: translate("admin.events.heading") }
            : {
                label: translate("admin.events.heading"),
                href: "/admin/events",
              },
          ...(inForm
            ? [
                {
                  label: isCreating
                    ? translate("admin.events.breadcrumb.new")
                    : translate("admin.events.breadcrumb.edit"),
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
              <Plus className="h-4 w-4" aria-hidden="true" />
              {translate("admin.events.newButton")}
            </button>
          ) : undefined
        }
      />

      {feedback && (
        <p className="rounded-md bg-secondary-light px-4 py-2 text-sm font-medium text-secondary-dark">
          {translate(`admin.events.feedback.${feedback}`)}
        </p>
      )}

      {!inForm ? (
        items.length > 0 ? (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <EventListItem
                key={item.id}
                event={item}
                onEdit={() => setFormTarget(item)}
                onDelete={() => setDeleteTarget(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="CalendarDays"
            title={translate("admin.events.empty.title")}
            description={translate("admin.events.empty.description")}
          />
        )
      ) : (
        <EventForm
          key={isCreating ? "new" : (formTarget as WithId<EventDoc>).id}
          initialValues={
            isCreating ? EMPTY_EVENT : stripId(formTarget as WithId<EventDoc>)
          }
          onSubmit={isCreating ? handleCreate : handleUpdate}
          onCancel={() => setFormTarget(null)}
          submitLabel={
            isCreating
              ? translate("admin.events.form.create")
              : translate("admin.events.form.saveChanges")
          }
          submittingLabel={translate("admin.events.form.saving")}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title={translate("admin.events.delete.title")}
        description={deleteTarget?.title}
        confirmLabel={translate("admin.events.delete.confirm")}
        confirmingLabel={translate("admin.events.delete.confirming")}
        cancelLabel={translate("admin.events.delete.cancel")}
        destructive
        confirming={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </PageContainer>
  );
}

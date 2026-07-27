"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { AnnouncementForm } from "@/components/admin/AnnouncementForm";
import { AnnouncementListItem } from "@/components/admin/AnnouncementListItem";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { announcementsService } from "@/lib/firebase/services";
import type { AnnouncementDoc } from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";
import { useAuthGuard, canAccess } from "@/lib/auth/routeGuard";
import { PERMISSIONS } from "@/lib/auth/constants";
import { Unauthorized } from "@/components/admin/Unauthorized";
import { LoadingDashboard } from "@/components/admin/LoadingDashboard";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

const EMPTY_ANNOUNCEMENT: AnnouncementDoc = {
  title: "",
  description: "",
  category: "general",
  priority: "normal",
  imageUrl: "",
  isPublished: false,
  createdAt: undefined as unknown as AnnouncementDoc["createdAt"],
  updatedAt: undefined as unknown as AnnouncementDoc["updatedAt"],
};

function stripId(item: WithId<AnnouncementDoc>): AnnouncementDoc {
  const { id, ...rest } = item;
  void id;
  return rest;
}

type FormTarget = WithId<AnnouncementDoc> | "new" | null;
type Feedback = "created" | "updated" | "deleted" | null;

/**
 * Announcements management page (Sprint 3.3). Second real CRUD admin
 * page — reads/writes through Sprint 2.2's announcementsService, gated
 * by the manageAnnouncements permission (already defined in Sprint 2.3's
 * constants, unused until now). Extends Sprint 3.2's Hero pattern to a
 * true list (multiple documents) instead of a singleton: list view with
 * per-item edit/delete, plus a shared create/edit AnnouncementForm and a
 * new reusable ConfirmDialog for delete confirmation.
 */
export default function AdminAnnouncementsPage() {
  const { translate } = useLanguage();
  const { loading: authLoading, admin } = useAuthGuard();
  const [items, setItems] = useState<Array<WithId<AnnouncementDoc>>>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [formTarget, setFormTarget] = useState<FormTarget>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [deleteTarget, setDeleteTarget] = useState<WithId<AnnouncementDoc> | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  const allowed = admin
    ? canAccess(admin, PERMISSIONS.manageAnnouncements)
    : false;
  const loadingList = allowed && !hasFetched;

  useEffect(() => {
    if (!allowed) return;

    let cancelled = false;
    announcementsService
      .getAll({ orderByField: { field: "createdAt", direction: "desc" } })
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

  async function handleCreate(values: AnnouncementDoc) {
    const now = Timestamp.now();
    const payload: AnnouncementDoc = { ...values, createdAt: now, updatedAt: now };
    const id = await announcementsService.create(payload);
    setItems((prev) => [{ id, ...payload }, ...prev]);
    setFormTarget(null);
    setFeedback("created");
  }

  async function handleUpdate(values: AnnouncementDoc) {
    if (formTarget === null || formTarget === "new") return;
    const id = formTarget.id;
    const updatedAt = Timestamp.now();
    const payload = { ...values, updatedAt };
    await announcementsService.update(id, payload);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...payload } : item))
    );
    setFormTarget(null);
    setFeedback("updated");
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await announcementsService.remove(deleteTarget.id);
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
            ? translate("admin.announcements.heading")
            : isCreating
              ? translate("admin.announcements.form.createHeading")
              : translate("admin.announcements.form.editHeading")
        }
        description={!inForm ? translate("admin.announcements.subheading") : undefined}
        breadcrumbs={[
          { label: translate("admin.breadcrumb.root"), href: "/admin" },
          !inForm
            ? { label: translate("admin.announcements.heading") }
            : {
                label: translate("admin.announcements.heading"),
                href: "/admin/announcements",
              },
          ...(inForm
            ? [
                {
                  label: isCreating
                    ? translate("admin.announcements.breadcrumb.new")
                    : translate("admin.announcements.breadcrumb.edit"),
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
              {translate("admin.announcements.newButton")}
            </button>
          ) : undefined
        }
      />

      {feedback && (
        <p className="rounded-md bg-secondary-light px-4 py-2 text-sm font-medium text-secondary-dark">
          {translate(`admin.announcements.feedback.${feedback}`)}
        </p>
      )}

      {!inForm ? (
        items.length > 0 ? (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <AnnouncementListItem
                key={item.id}
                announcement={item}
                onEdit={() => setFormTarget(item)}
                onDelete={() => setDeleteTarget(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="Megaphone"
            title={translate("admin.announcements.empty.title")}
            description={translate("admin.announcements.empty.description")}
          />
        )
      ) : (
        <AnnouncementForm
          key={isCreating ? "new" : (formTarget as WithId<AnnouncementDoc>).id}
          initialValues={
            isCreating
              ? EMPTY_ANNOUNCEMENT
              : stripId(formTarget as WithId<AnnouncementDoc>)
          }
          onSubmit={isCreating ? handleCreate : handleUpdate}
          onCancel={() => setFormTarget(null)}
          submitLabel={
            isCreating
              ? translate("admin.announcements.form.create")
              : translate("admin.announcements.form.saveChanges")
          }
          submittingLabel={translate("admin.announcements.form.saving")}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title={translate("admin.announcements.delete.title")}
        description={deleteTarget?.title}
        confirmLabel={translate("admin.announcements.delete.confirm")}
        confirmingLabel={translate("admin.announcements.delete.confirming")}
        cancelLabel={translate("admin.announcements.delete.cancel")}
        destructive
        confirming={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </PageContainer>
  );
}

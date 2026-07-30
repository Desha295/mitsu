"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { DocumentForm } from "@/components/admin/DocumentForm";
import { DocumentListItem } from "@/components/admin/DocumentListItem";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { documentsService } from "@/lib/firebase/services";
import type { DocumentResourceDoc } from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";
import { useAuthGuard, canAccess } from "@/lib/auth/routeGuard";
import { PERMISSIONS } from "@/lib/auth/constants";
import { Unauthorized } from "@/components/admin/Unauthorized";
import { LoadingDashboard } from "@/components/admin/LoadingDashboard";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

const EMPTY_DOCUMENT: DocumentResourceDoc = {
  title: "",
  description: "",
  fileUrl: "",
  category: "",
  isPublished: false,
  uploadedAt: undefined as unknown as DocumentResourceDoc["uploadedAt"],
};

function stripId(item: WithId<DocumentResourceDoc>): DocumentResourceDoc {
  const { id, ...rest } = item;
  void id;
  return rest;
}

type FormTarget = WithId<DocumentResourceDoc> | "new" | null;
type Feedback = "created" | "updated" | "deleted" | null;

/**
 * Study Plans / Documents management page (Sprint 3.10). Ninth real
 * CRUD admin page, and the second (after Sprint 3.9's Leadership) to
 * require a genuinely new domain service (`documentsService`) rather
 * than wiring up one already built. Reuses the same ConfirmDialog as
 * every prior sprint, unchanged for a seventh sprint running. Gated by
 * the new `manageStudyPlans` permission.
 *
 * Unlike Committees/Systems/Guide/Quick Access (which have an explicit
 * `order` field), `DocumentResourceDoc` has no `order` — it's ordered
 * by `uploadedAt` descending instead, the same recency-based choice
 * made for Announcements, since a document library is a feed of
 * resources rather than a fixed sequence of steps.
 */
export default function AdminStudyPlansPage() {
  const { translate } = useLanguage();
  const { loading: authLoading, admin } = useAuthGuard();
  const [items, setItems] = useState<Array<WithId<DocumentResourceDoc>>>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [formTarget, setFormTarget] = useState<FormTarget>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<WithId<DocumentResourceDoc> | null>(null);
  const [deleting, setDeleting] = useState(false);

  const allowed = admin ? canAccess(admin, PERMISSIONS.manageStudyPlans) : false;
  const loadingList = allowed && !hasFetched;

  useEffect(() => {
    if (!allowed) return;

    let cancelled = false;
    documentsService
      .getAll({ orderByField: { field: "uploadedAt", direction: "desc" } })
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

  async function handleCreate(values: DocumentResourceDoc) {
    const payload: DocumentResourceDoc = {
      ...values,
      uploadedAt: Timestamp.now(),
    };
    const id = await documentsService.create(payload);
    setItems((prev) => [{ id, ...payload }, ...prev]);
    setFormTarget(null);
    setFeedback("created");
  }

  async function handleUpdate(values: DocumentResourceDoc) {
    if (formTarget === null || formTarget === "new") return;
    const id = formTarget.id;
    await documentsService.update(id, values);
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
      await documentsService.remove(deleteTarget.id);
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
            ? translate("admin.studyPlans.heading")
            : isCreating
              ? translate("admin.studyPlans.form.createHeading")
              : translate("admin.studyPlans.form.editHeading")
        }
        description={
          !inForm ? translate("admin.studyPlans.subheading") : undefined
        }
        breadcrumbs={[
          { label: translate("admin.breadcrumb.root"), href: "/admin" },
          !inForm
            ? { label: translate("admin.studyPlans.heading") }
            : {
                label: translate("admin.studyPlans.heading"),
                href: "/admin/study-plans",
              },
          ...(inForm
            ? [
                {
                  label: isCreating
                    ? translate("admin.studyPlans.breadcrumb.new")
                    : translate("admin.studyPlans.breadcrumb.edit"),
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
              {translate("admin.studyPlans.newButton")}
            </button>
          ) : undefined
        }
      />

      {feedback && (
        <p className="rounded-md bg-secondary-light px-4 py-2 text-sm font-medium text-secondary-dark">
          {translate(`admin.studyPlans.feedback.${feedback}`)}
        </p>
      )}

      {!inForm ? (
        items.length > 0 ? (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <DocumentListItem
                key={item.id}
                document={item}
                onEdit={() => setFormTarget(item)}
                onDelete={() => setDeleteTarget(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="FileText"
            title={translate("admin.studyPlans.empty.title")}
            description={translate("admin.studyPlans.empty.description")}
          />
        )
      ) : (
        <DocumentForm
          key={isCreating ? "new" : (formTarget as WithId<DocumentResourceDoc>).id}
          initialValues={
            isCreating
              ? EMPTY_DOCUMENT
              : stripId(formTarget as WithId<DocumentResourceDoc>)
          }
          onSubmit={isCreating ? handleCreate : handleUpdate}
          onCancel={() => setFormTarget(null)}
          submitLabel={
            isCreating
              ? translate("admin.studyPlans.form.create")
              : translate("admin.studyPlans.form.saveChanges")
          }
          submittingLabel={translate("admin.studyPlans.form.saving")}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title={translate("admin.studyPlans.delete.title")}
        description={deleteTarget?.title}
        confirmLabel={translate("admin.studyPlans.delete.confirm")}
        confirmingLabel={translate("admin.studyPlans.delete.confirming")}
        cancelLabel={translate("admin.studyPlans.delete.cancel")}
        destructive
        confirming={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </PageContainer>
  );
}

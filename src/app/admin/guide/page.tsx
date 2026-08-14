"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { GuideForm } from "@/components/admin/GuideForm";
import { GuideListItem } from "@/components/admin/GuideListItem";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { guideService } from "@/lib/firebase/services";
import type { GuideSectionDoc } from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";
import { useAuthGuard, canAccess } from "@/lib/auth/routeGuard";
import { PERMISSIONS } from "@/lib/auth/constants";
import { Unauthorized } from "@/components/admin/Unauthorized";
import { LoadingDashboard } from "@/components/admin/LoadingDashboard";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

const EMPTY_GUIDE_SECTION: GuideSectionDoc = {
  icon: "",
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  facts: [],
  stats: [],
  highlight: false,
  order: 1,
  isActive: true,
};

function stripId(item: WithId<GuideSectionDoc>): GuideSectionDoc {
  const { id, ...rest } = item;
  void id;
  return rest;
}

function nextOrder(items: Array<WithId<GuideSectionDoc>>): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map((item) => item.order)) + 1;
}

type FormTarget = WithId<GuideSectionDoc> | "new" | null;
type Feedback = "created" | "updated" | "deleted" | null;

/**
 * Freshman Guide management page (Sprint 3.7). Sixth real CRUD admin
 * page, extending Sprint 3.3–3.6's list pattern to `guideService`
 * (Sprint 2.2, unused until now). Reuses the same ConfirmDialog as the
 * four prior sprints, unchanged for a fourth sprint running. Gated by
 * the existing `manageGuide` permission (Sprint 2.3, unused until now).
 *
 * List is ordered by `order` ascending, same as Committees/Systems —
 * `order` controls the step sequence students see on /guide.
 */
export default function AdminGuidePage() {
  const { translate } = useLanguage();
  const { loading: authLoading, admin } = useAuthGuard();
  const [items, setItems] = useState<Array<WithId<GuideSectionDoc>>>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [formTarget, setFormTarget] = useState<FormTarget>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [deleteTarget, setDeleteTarget] = useState<WithId<GuideSectionDoc> | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  const allowed = admin ? canAccess(admin, PERMISSIONS.manageGuide) : false;
  const loadingList = allowed && !hasFetched;

  useEffect(() => {
    if (!allowed) return;

    let cancelled = false;
    guideService
      .getAll({ orderByField: { field: "order", direction: "asc" } })
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

  async function handleCreate(values: GuideSectionDoc) {
    const id = await guideService.create(values);
    setItems((prev) =>
      [...prev, { id, ...values }].sort((a, b) => a.order - b.order)
    );
    setFormTarget(null);
    setFeedback("created");
  }

  async function handleUpdate(values: GuideSectionDoc) {
    if (formTarget === null || formTarget === "new") return;
    const id = formTarget.id;
    await guideService.update(id, values);
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, ...values } : item))
        .sort((a, b) => a.order - b.order)
    );
    setFormTarget(null);
    setFeedback("updated");
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await guideService.remove(deleteTarget.id);
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
            ? translate("admin.guide.heading")
            : isCreating
              ? translate("admin.guide.form.createHeading")
              : translate("admin.guide.form.editHeading")
        }
        description={!inForm ? translate("admin.guide.subheading") : undefined}
        breadcrumbs={[
          { label: translate("admin.breadcrumb.root"), href: "/admin" },
          !inForm
            ? { label: translate("admin.guide.heading") }
            : {
                label: translate("admin.guide.heading"),
                href: "/admin/guide",
              },
          ...(inForm
            ? [
                {
                  label: isCreating
                    ? translate("admin.guide.breadcrumb.new")
                    : translate("admin.guide.breadcrumb.edit"),
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
              {translate("admin.guide.newButton")}
            </button>
          ) : undefined
        }
      />

      {feedback && (
        <p className="rounded-md bg-secondary-light px-4 py-2 text-sm font-medium text-secondary-dark">
          {translate(`admin.guide.feedback.${feedback}`)}
        </p>
      )}

      {!inForm ? (
        items.length > 0 ? (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <GuideListItem
                key={item.id}
                section={item}
                onEdit={() => setFormTarget(item)}
                onDelete={() => setDeleteTarget(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="Compass"
            title={translate("admin.guide.empty.title")}
            description={translate("admin.guide.empty.description")}
          />
        )
      ) : (
        <GuideForm
          key={isCreating ? "new" : (formTarget as WithId<GuideSectionDoc>).id}
          initialValues={
            isCreating
              ? { ...EMPTY_GUIDE_SECTION, order: nextOrder(items) }
              : stripId(formTarget as WithId<GuideSectionDoc>)
          }
          onSubmit={isCreating ? handleCreate : handleUpdate}
          onCancel={() => setFormTarget(null)}
          submitLabel={
            isCreating
              ? translate("admin.guide.form.create")
              : translate("admin.guide.form.saveChanges")
          }
          submittingLabel={translate("admin.guide.form.saving")}
        />
      )}

<ConfirmDialog
  open={deleteTarget !== null}
  title={translate("admin.guide.delete.title")}
  description={
    deleteTarget
      ? `${deleteTarget.titleAr}${
          deleteTarget.titleEn
            ? ` / ${deleteTarget.titleEn}`
            : ""
        }`
      : undefined
  }
  confirmLabel={translate("admin.guide.delete.confirm")}
  confirmingLabel={translate("admin.guide.delete.confirming")}
  cancelLabel={translate("admin.guide.delete.cancel")}
  destructive
  confirming={deleting}
  onConfirm={handleDeleteConfirm}
  onCancel={() => setDeleteTarget(null)}
/>
    </PageContainer>
  );
}

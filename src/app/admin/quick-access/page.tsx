"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { QuickAccessForm } from "@/components/admin/QuickAccessForm";
import { QuickAccessListItem } from "@/components/admin/QuickAccessListItem";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { homepageService } from "@/lib/firebase/services";
import type { QuickAccessItemDoc } from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";
import { useAuthGuard, canAccess } from "@/lib/auth/routeGuard";
import { PERMISSIONS } from "@/lib/auth/constants";
import { Unauthorized } from "@/components/admin/Unauthorized";
import { LoadingDashboard } from "@/components/admin/LoadingDashboard";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

const EMPTY_QUICK_ACCESS: QuickAccessItemDoc = {
  titleAr: "",
  titleEn: "",
  descriptionAr: "",
  descriptionEn: "",
  href: "",
  icon: "",
  order: 1,
  isActive: true,
};

function stripId(item: WithId<QuickAccessItemDoc>): QuickAccessItemDoc {
  const { id, ...rest } = item;
  void id;
  return rest;
}

function nextOrder(items: Array<WithId<QuickAccessItemDoc>>): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map((item) => item.order)) + 1;
}

type FormTarget = WithId<QuickAccessItemDoc> | "new" | null;
type Feedback = "created" | "updated" | "deleted" | null;

/**
 * Quick Access management page (Sprint 3.8). Seventh real CRUD admin
 * page, extending Sprint 3.3–3.7's list pattern to `homepageService`
 * (Sprint 2.2, unused until now — the same "service already built,
 * never wired up" situation Systems and Guide were in before their
 * sprints). Reuses the same ConfirmDialog as the five prior sprints,
 * unchanged for a fifth sprint running. Gated by the existing
 * `manageHomepage` permission (Sprint 2.3, unused until now).
 *
 * List is ordered by `order` ascending, same as Committees/Systems/
 * Guide — `order` controls the card sequence on the public homepage.
 */
export default function AdminQuickAccessPage() {
  const { translate } = useLanguage();
  const { loading: authLoading, admin } = useAuthGuard();
  const [items, setItems] = useState<Array<WithId<QuickAccessItemDoc>>>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [formTarget, setFormTarget] = useState<FormTarget>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<WithId<QuickAccessItemDoc> | null>(null);
  const [deleting, setDeleting] = useState(false);

  const allowed = admin ? canAccess(admin, PERMISSIONS.manageHomepage) : false;
  const loadingList = allowed && !hasFetched;

  useEffect(() => {
    if (!allowed) return;

    let cancelled = false;
    homepageService
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

  async function handleCreate(values: QuickAccessItemDoc) {
    const id = await homepageService.create(values);
    setItems((prev) =>
      [...prev, { id, ...values }].sort((a, b) => a.order - b.order)
    );
    setFormTarget(null);
    setFeedback("created");
  }

  async function handleUpdate(values: QuickAccessItemDoc) {
    if (formTarget === null || formTarget === "new") return;
    const id = formTarget.id;
    await homepageService.update(id, values);
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
      await homepageService.remove(deleteTarget.id);
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
            ? translate("admin.quickAccess.heading")
            : isCreating
              ? translate("admin.quickAccess.form.createHeading")
              : translate("admin.quickAccess.form.editHeading")
        }
        description={
          !inForm ? translate("admin.quickAccess.subheading") : undefined
        }
        breadcrumbs={[
          { label: translate("admin.breadcrumb.root"), href: "/admin" },
          !inForm
            ? { label: translate("admin.quickAccess.heading") }
            : {
                label: translate("admin.quickAccess.heading"),
                href: "/admin/quick-access",
              },
          ...(inForm
            ? [
                {
                  label: isCreating
                    ? translate("admin.quickAccess.breadcrumb.new")
                    : translate("admin.quickAccess.breadcrumb.edit"),
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
              {translate("admin.quickAccess.newButton")}
            </button>
          ) : undefined
        }
      />

      {feedback && (
        <p className="rounded-md bg-secondary-light px-4 py-2 text-sm font-medium text-secondary-dark">
          {translate(`admin.quickAccess.feedback.${feedback}`)}
        </p>
      )}

      {!inForm ? (
        items.length > 0 ? (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <QuickAccessListItem
                key={item.id}
                item={item}
                onEdit={() => setFormTarget(item)}
                onDelete={() => setDeleteTarget(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="LayoutGrid"
            title={translate("admin.quickAccess.empty.title")}
            description={translate("admin.quickAccess.empty.description")}
          />
        )
      ) : (
        <QuickAccessForm
          key={isCreating ? "new" : (formTarget as WithId<QuickAccessItemDoc>).id}
          initialValues={
            isCreating
              ? { ...EMPTY_QUICK_ACCESS, order: nextOrder(items) }
              : stripId(formTarget as WithId<QuickAccessItemDoc>)
          }
          onSubmit={isCreating ? handleCreate : handleUpdate}
          onCancel={() => setFormTarget(null)}
          submitLabel={
            isCreating
              ? translate("admin.quickAccess.form.create")
              : translate("admin.quickAccess.form.saveChanges")
          }
          submittingLabel={translate("admin.quickAccess.form.saving")}
        />
      )}
<ConfirmDialog
  open={deleteTarget !== null}
  title={translate("admin.quickAccess.delete.title")}
  description={
    deleteTarget
      ? `${deleteTarget.titleAr}${
          deleteTarget.titleEn
            ? ` / ${deleteTarget.titleEn}`
            : ""
        }`
      : undefined
  }
  confirmLabel={translate("admin.quickAccess.delete.confirm")}
  confirmingLabel={translate("admin.quickAccess.delete.confirming")}
  cancelLabel={translate("admin.quickAccess.delete.cancel")}
  destructive
  confirming={deleting}
  onConfirm={handleDeleteConfirm}
  onCancel={() => setDeleteTarget(null)}
/>
    </PageContainer>
  );
}

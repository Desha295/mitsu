"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { SystemForm } from "@/components/admin/SystemForm";
import { SystemListItem } from "@/components/admin/SystemListItem";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { systemsService } from "@/lib/firebase/services";
import type { SystemDoc } from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";
import { useAuthGuard, canAccess } from "@/lib/auth/routeGuard";
import { PERMISSIONS } from "@/lib/auth/constants";
import { Unauthorized } from "@/components/admin/Unauthorized";
import { LoadingDashboard } from "@/components/admin/LoadingDashboard";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

const EMPTY_SYSTEM: SystemDoc = {
  nameAr: "",
  nameEn: "",
  descriptionAr: "",
  descriptionEn: "",
  purpose: "",
  officialUrl: "",
  icon: "",
instructionsAr: "",
instructionsEn: "",
  order: 1,
  isActive: true,
};
function stripId(item: WithId<SystemDoc>): SystemDoc {
  const { id, ...rest } = item;
  void id;
  return rest;
}

function nextOrder(items: Array<WithId<SystemDoc>>): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map((item) => item.order)) + 1;
}

type FormTarget = WithId<SystemDoc> | "new" | null;
type Feedback = "created" | "updated" | "deleted" | null;

/**
 * University Systems management page (Sprint 3.6). Fifth real CRUD
 * admin page, extending Sprint 3.3/3.4/3.5's list pattern to
 * `systemsService` (Sprint 2.2, unused until now). Reuses the same
 * ConfirmDialog as the three prior sprints, unchanged for a third
 * sprint running. Gated by the existing `manageSystems` permission
 * (Sprint 2.3, unused until now).
 *
 * List is ordered by `order` ascending, same as Committees — `order`
 * is this schema's own field for controlling display sequence too.
 */
export default function AdminSystemsPage() {
  const { translate } = useLanguage();
  const { loading: authLoading, admin } = useAuthGuard();
  const [items, setItems] = useState<Array<WithId<SystemDoc>>>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [formTarget, setFormTarget] = useState<FormTarget>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [deleteTarget, setDeleteTarget] = useState<WithId<SystemDoc> | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  const allowed = admin ? canAccess(admin, PERMISSIONS.manageSystems) : false;
  const loadingList = allowed && !hasFetched;

  useEffect(() => {
    if (!allowed) return;

    let cancelled = false;
    systemsService
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

  async function handleCreate(values: SystemDoc) {
    const id = await systemsService.create(values);
    setItems((prev) =>
      [...prev, { id, ...values }].sort((a, b) => a.order - b.order)
    );
    setFormTarget(null);
    setFeedback("created");
  }

  async function handleUpdate(values: SystemDoc) {
    if (formTarget === null || formTarget === "new") return;
    const id = formTarget.id;
    await systemsService.update(id, values);
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
      await systemsService.remove(deleteTarget.id);
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
            ? translate("admin.systems.heading")
            : isCreating
              ? translate("admin.systems.form.createHeading")
              : translate("admin.systems.form.editHeading")
        }
        description={!inForm ? translate("admin.systems.subheading") : undefined}
        breadcrumbs={[
          { label: translate("admin.breadcrumb.root"), href: "/admin" },
          !inForm
            ? { label: translate("admin.systems.heading") }
            : {
                label: translate("admin.systems.heading"),
                href: "/admin/systems",
              },
          ...(inForm
            ? [
                {
                  label: isCreating
                    ? translate("admin.systems.breadcrumb.new")
                    : translate("admin.systems.breadcrumb.edit"),
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
              {translate("admin.systems.newButton")}
            </button>
          ) : undefined
        }
      />

      {feedback && (
        <p className="rounded-md bg-secondary-light px-4 py-2 text-sm font-medium text-secondary-dark">
          {translate(`admin.systems.feedback.${feedback}`)}
        </p>
      )}

      {!inForm ? (
        items.length > 0 ? (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <SystemListItem
                key={item.id}
                system={item}
                onEdit={() => setFormTarget(item)}
                onDelete={() => setDeleteTarget(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="Laptop"
            title={translate("admin.systems.empty.title")}
            description={translate("admin.systems.empty.description")}
          />
        )
      ) : (
        <SystemForm
          key={isCreating ? "new" : (formTarget as WithId<SystemDoc>).id}
          initialValues={
            isCreating
              ? { ...EMPTY_SYSTEM, order: nextOrder(items) }
              : stripId(formTarget as WithId<SystemDoc>)
          }
          onSubmit={isCreating ? handleCreate : handleUpdate}
          onCancel={() => setFormTarget(null)}
          submitLabel={
            isCreating
              ? translate("admin.systems.form.create")
              : translate("admin.systems.form.saveChanges")
          }
          submittingLabel={translate("admin.systems.form.saving")}
        />
      )}

<ConfirmDialog
  open={deleteTarget !== null}
  title={translate("admin.systems.delete.title")}
  description={
    deleteTarget
      ? `${deleteTarget.nameAr}${
          deleteTarget.nameEn
            ? ` / ${deleteTarget.nameEn}`
            : ""
        }`
      : undefined
  }
  confirmLabel={translate("admin.systems.delete.confirm")}
  confirmingLabel={translate("admin.systems.delete.confirming")}
  cancelLabel={translate("admin.systems.delete.cancel")}
  destructive
  confirming={deleting}
  onConfirm={handleDeleteConfirm}
  onCancel={() => setDeleteTarget(null)}
/>
    </PageContainer>
  );
}

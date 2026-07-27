"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { CommitteeForm } from "@/components/admin/CommitteeForm";
import { CommitteeListItem } from "@/components/admin/CommitteeListItem";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { unionService } from "@/lib/firebase/services";
import type { CommitteeDoc } from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";
import { useAuthGuard, canAccess } from "@/lib/auth/routeGuard";
import { PERMISSIONS } from "@/lib/auth/constants";
import { Unauthorized } from "@/components/admin/Unauthorized";
import { LoadingDashboard } from "@/components/admin/LoadingDashboard";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

const EMPTY_COMMITTEE: CommitteeDoc = {
  name: "",
  description: "",
  imageUrl: "",
  isActive: true,
  order: 1,
};

function stripId(item: WithId<CommitteeDoc>): CommitteeDoc {
  const { id, ...rest } = item;
  void id;
  return rest;
}

function nextOrder(items: Array<WithId<CommitteeDoc>>): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map((item) => item.order)) + 1;
}

type FormTarget = WithId<CommitteeDoc> | "new" | null;
type Feedback = "created" | "updated" | "deleted" | null;

/**
 * Student Union (Committees) management page (Sprint 3.5). Fourth real
 * CRUD admin page, extending Sprint 3.3/3.4's list pattern to
 * `unionService` (Sprint 2.2, unused until now — bound to the
 * `committees` collection specifically; see that service file's own
 * comment on why Leadership isn't included here). Reuses the same
 * ConfirmDialog as Announcements/Events unchanged.
 *
 * List is ordered by `order` ascending — CommitteeDoc's own field for
 * controlling display sequence on the public site, the same
 * per-resource-meaning ordering choice made for Events' `date`.
 */
export default function AdminUnionPage() {
  const { translate } = useLanguage();
  const { loading: authLoading, admin } = useAuthGuard();
  const [items, setItems] = useState<Array<WithId<CommitteeDoc>>>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [formTarget, setFormTarget] = useState<FormTarget>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [deleteTarget, setDeleteTarget] = useState<WithId<CommitteeDoc> | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  const allowed = admin ? canAccess(admin, PERMISSIONS.manageUnion) : false;
  const loadingList = allowed && !hasFetched;

  useEffect(() => {
    if (!allowed) return;

    let cancelled = false;
    unionService
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

  async function handleCreate(values: CommitteeDoc) {
    const id = await unionService.create(values);
    setItems((prev) =>
      [...prev, { id, ...values }].sort((a, b) => a.order - b.order)
    );
    setFormTarget(null);
    setFeedback("created");
  }

  async function handleUpdate(values: CommitteeDoc) {
    if (formTarget === null || formTarget === "new") return;
    const id = formTarget.id;
    await unionService.update(id, values);
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
      await unionService.remove(deleteTarget.id);
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
            ? translate("admin.union.heading")
            : isCreating
              ? translate("admin.union.form.createHeading")
              : translate("admin.union.form.editHeading")
        }
        description={!inForm ? translate("admin.union.subheading") : undefined}
        breadcrumbs={[
          { label: translate("admin.breadcrumb.root"), href: "/admin" },
          !inForm
            ? { label: translate("admin.union.heading") }
            : {
                label: translate("admin.union.heading"),
                href: "/admin/union",
              },
          ...(inForm
            ? [
                {
                  label: isCreating
                    ? translate("admin.union.breadcrumb.new")
                    : translate("admin.union.breadcrumb.edit"),
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
              {translate("admin.union.newButton")}
            </button>
          ) : undefined
        }
      />

      {feedback && (
        <p className="rounded-md bg-secondary-light px-4 py-2 text-sm font-medium text-secondary-dark">
          {translate(`admin.union.feedback.${feedback}`)}
        </p>
      )}

      {!inForm ? (
        items.length > 0 ? (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <CommitteeListItem
                key={item.id}
                committee={item}
                onEdit={() => setFormTarget(item)}
                onDelete={() => setDeleteTarget(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="Users"
            title={translate("admin.union.empty.title")}
            description={translate("admin.union.empty.description")}
          />
        )
      ) : (
        <CommitteeForm
          key={isCreating ? "new" : (formTarget as WithId<CommitteeDoc>).id}
          initialValues={
            isCreating
              ? { ...EMPTY_COMMITTEE, order: nextOrder(items) }
              : stripId(formTarget as WithId<CommitteeDoc>)
          }
          onSubmit={isCreating ? handleCreate : handleUpdate}
          onCancel={() => setFormTarget(null)}
          submitLabel={
            isCreating
              ? translate("admin.union.form.create")
              : translate("admin.union.form.saveChanges")
          }
          submittingLabel={translate("admin.union.form.saving")}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title={translate("admin.union.delete.title")}
        description={deleteTarget?.name}
        confirmLabel={translate("admin.union.delete.confirm")}
        confirmingLabel={translate("admin.union.delete.confirming")}
        cancelLabel={translate("admin.union.delete.cancel")}
        destructive
        confirming={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </PageContainer>
  );
}

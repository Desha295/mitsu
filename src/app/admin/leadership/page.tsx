"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { LeadershipForm } from "@/components/admin/LeadershipForm";
import { LeadershipListItem } from "@/components/admin/LeadershipListItem";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { leadershipService } from "@/lib/firebase/services";
import type { LeadershipDoc } from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";
import { useAuthGuard, canAccess } from "@/lib/auth/routeGuard";
import { PERMISSIONS } from "@/lib/auth/constants";
import { Unauthorized } from "@/components/admin/Unauthorized";
import { LoadingDashboard } from "@/components/admin/LoadingDashboard";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

const EMPTY_LEADER: LeadershipDoc = {
  name: "",
  position: "",
  imageUrl: "",
  bio: "",
  order: 1,
  isActive: true,
};

function stripId(item: WithId<LeadershipDoc>): LeadershipDoc {
  const { id, ...rest } = item;
  void id;
  return rest;
}

function nextOrder(items: Array<WithId<LeadershipDoc>>): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map((item) => item.order)) + 1;
}

type FormTarget = WithId<LeadershipDoc> | "new" | null;
type Feedback = "created" | "updated" | "deleted" | null;

/**
 * Leadership management page (Sprint 3.9). Eighth real CRUD admin
 * page, and the first to require creating its own domain service
 * (`leadershipService`) rather than reusing one already built — every
 * prior sprint since 3.3 found its service sitting unused from Sprint
 * 2.2. Closes the deliberate deferral noted in Sprint 3.5, when
 * `unionService` was scoped to Committees only. Extends Sprint
 * 3.3–3.8's list pattern; reuses the same ConfirmDialog unchanged for
 * a sixth sprint running. Gated by the new `manageLeadership`
 * permission (see lib/auth/constants.ts — no existing permission fit
 * Leadership as its own distinct resource).
 *
 * List is ordered by `order` ascending, same as Committees/Systems/
 * Guide/Quick Access.
 */
export default function AdminLeadershipPage() {
  const { translate } = useLanguage();
  const { loading: authLoading, admin } = useAuthGuard();
  const [items, setItems] = useState<Array<WithId<LeadershipDoc>>>([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [formTarget, setFormTarget] = useState<FormTarget>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [deleteTarget, setDeleteTarget] = useState<WithId<LeadershipDoc> | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  const allowed = admin ? canAccess(admin, PERMISSIONS.manageLeadership) : false;
  const loadingList = allowed && !hasFetched;

  useEffect(() => {
    if (!allowed) return;

    let cancelled = false;
    leadershipService
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

  async function handleCreate(values: LeadershipDoc) {
    const id = await leadershipService.create(values);
    setItems((prev) =>
      [...prev, { id, ...values }].sort((a, b) => a.order - b.order)
    );
    setFormTarget(null);
    setFeedback("created");
  }

  async function handleUpdate(values: LeadershipDoc) {
    if (formTarget === null || formTarget === "new") return;
    const id = formTarget.id;
    await leadershipService.update(id, values);
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
      await leadershipService.remove(deleteTarget.id);
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
            ? translate("admin.leadership.heading")
            : isCreating
              ? translate("admin.leadership.form.createHeading")
              : translate("admin.leadership.form.editHeading")
        }
        description={
          !inForm ? translate("admin.leadership.subheading") : undefined
        }
        breadcrumbs={[
          { label: translate("admin.breadcrumb.root"), href: "/admin" },
          !inForm
            ? { label: translate("admin.leadership.heading") }
            : {
                label: translate("admin.leadership.heading"),
                href: "/admin/leadership",
              },
          ...(inForm
            ? [
                {
                  label: isCreating
                    ? translate("admin.leadership.breadcrumb.new")
                    : translate("admin.leadership.breadcrumb.edit"),
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
              {translate("admin.leadership.newButton")}
            </button>
          ) : undefined
        }
      />

      {feedback && (
        <p className="rounded-md bg-secondary-light px-4 py-2 text-sm font-medium text-secondary-dark">
          {translate(`admin.leadership.feedback.${feedback}`)}
        </p>
      )}

      {!inForm ? (
        items.length > 0 ? (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <LeadershipListItem
                key={item.id}
                leader={item}
                onEdit={() => setFormTarget(item)}
                onDelete={() => setDeleteTarget(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="UserRound"
            title={translate("admin.leadership.empty.title")}
            description={translate("admin.leadership.empty.description")}
          />
        )
      ) : (
        <LeadershipForm
          key={isCreating ? "new" : (formTarget as WithId<LeadershipDoc>).id}
          initialValues={
            isCreating
              ? { ...EMPTY_LEADER, order: nextOrder(items) }
              : stripId(formTarget as WithId<LeadershipDoc>)
          }
          onSubmit={isCreating ? handleCreate : handleUpdate}
          onCancel={() => setFormTarget(null)}
          submitLabel={
            isCreating
              ? translate("admin.leadership.form.create")
              : translate("admin.leadership.form.saveChanges")
          }
          submittingLabel={translate("admin.leadership.form.saving")}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title={translate("admin.leadership.delete.title")}
        description={deleteTarget?.name}
        confirmLabel={translate("admin.leadership.delete.confirm")}
        confirmingLabel={translate("admin.leadership.delete.confirming")}
        cancelLabel={translate("admin.leadership.delete.cancel")}
        destructive
        confirming={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </PageContainer>
  );
}

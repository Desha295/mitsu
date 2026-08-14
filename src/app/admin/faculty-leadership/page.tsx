"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { FacultyLeadershipForm } from "@/components/admin/FacultyLeadershipForm";
import { FacultyLeadershipListItem } from "@/components/admin/FacultyLeadershipListItem";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { facultyLeadershipService } from "@/lib/firebase/services";
import type { FacultyLeadershipDoc } from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";
import { useAuthGuard, canAccess } from "@/lib/auth/routeGuard";
import { PERMISSIONS } from "@/lib/auth/constants";
import { Unauthorized } from "@/components/admin/Unauthorized";
import { LoadingDashboard } from "@/components/admin/LoadingDashboard";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

const EMPTY_FACULTY_LEADER: FacultyLeadershipDoc = {
  nameAr: "",
  nameEn: "",
  roleAr: "",
  roleEn: "",
  imageUrl: "",
  order: 1,
  isActive: true,
};

function stripId(
  item: WithId<FacultyLeadershipDoc>
): FacultyLeadershipDoc {
  const { id, ...rest } = item;
  void id;
  return rest;
}

function nextOrder(
  items: Array<WithId<FacultyLeadershipDoc>>
): number {
  if (items.length === 0) return 1;

  return Math.max(...items.map((item) => item.order)) + 1;
}

type FormTarget = WithId<FacultyLeadershipDoc> | "new" | null;

type Feedback = "created" | "updated" | "deleted" | null;

/**
 * Faculty Leadership management page (Sprint 7.0).
 *
 * Uses the current FacultyLeadershipDoc schema:
 * - nameAr
 * - nameEn
 * - roleAr
 * - roleEn
 * - imageUrl
 * - order
 * - isActive
 *
 * The list is ordered by `order` ascending.
 */
export default function AdminFacultyLeadershipPage() {
  const { translate } = useLanguage();

  const { loading: authLoading, admin } = useAuthGuard();

  const [items, setItems] = useState<
    Array<WithId<FacultyLeadershipDoc>>
  >([]);

  const [hasFetched, setHasFetched] = useState(false);

  const [formTarget, setFormTarget] =
    useState<FormTarget>(null);

  const [feedback, setFeedback] =
    useState<Feedback>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<WithId<FacultyLeadershipDoc> | null>(null);

  const [deleting, setDeleting] = useState(false);

  const allowed = admin
    ? canAccess(
        admin,
        PERMISSIONS.manageFacultyLeadership
      )
    : false;

  const loadingList = allowed && !hasFetched;

  useEffect(() => {
    if (!allowed) return;

    let cancelled = false;

    facultyLeadershipService
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

  async function handleCreate(
    values: FacultyLeadershipDoc
  ) {
    const id = await facultyLeadershipService.create(values);

    setItems((prev) =>
      [...prev, { id, ...values }].sort(
        (a, b) => a.order - b.order
      )
    );

    setFormTarget(null);
    setFeedback("created");
  }

  async function handleUpdate(
    values: FacultyLeadershipDoc
  ) {
    if (
      formTarget === null ||
      formTarget === "new"
    ) {
      return;
    }

    const id = formTarget.id;

    await facultyLeadershipService.update(
      id,
      values
    );

    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, ...values }
            : item
        )
        .sort(
          (a, b) => a.order - b.order
        )
    );

    setFormTarget(null);
    setFeedback("updated");
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await facultyLeadershipService.remove(
        deleteTarget.id
      );

      setItems((prev) =>
        prev.filter(
          (item) =>
            item.id !== deleteTarget.id
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
          !inForm
            ? translate(
                "admin.facultyLeadership.heading"
              )
            : isCreating
              ? translate(
                  "admin.facultyLeadership.form.createHeading"
                )
              : translate(
                  "admin.facultyLeadership.form.editHeading"
                )
        }
        description={
          !inForm
            ? translate(
                "admin.facultyLeadership.subheading"
              )
            : undefined
        }
        breadcrumbs={[
          {
            label: translate(
              "admin.breadcrumb.root"
            ),
            href: "/admin",
          },

          !inForm
            ? {
                label: translate(
                  "admin.facultyLeadership.heading"
                ),
              }
            : {
                label: translate(
                  "admin.facultyLeadership.heading"
                ),
                href: "/admin/faculty-leadership",
              },

          ...(inForm
            ? [
                {
                  label: isCreating
                    ? translate(
                        "admin.facultyLeadership.breadcrumb.new"
                      )
                    : translate(
                        "admin.facultyLeadership.breadcrumb.edit"
                      ),
                },
              ]
            : []),
        ]}
        actions={
          !inForm ? (
            <button
              type="button"
              onClick={() =>
                setFormTarget("new")
              }
              className={cx(
                "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-dark",
                focusRing
              )}
            >
              <Plus
                className="h-4 w-4"
                aria-hidden="true"
              />

              {translate(
                "admin.facultyLeadership.newButton"
              )}
            </button>
          ) : undefined
        }
      />

      {feedback && (
        <p className="rounded-md bg-secondary-light px-4 py-2 text-sm font-medium text-secondary-dark">
          {translate(
            `admin.facultyLeadership.feedback.${feedback}`
          )}
        </p>
      )}

      {!inForm ? (
        items.length > 0 ? (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <FacultyLeadershipListItem
                key={item.id}
                leader={item}
                onEdit={() =>
                  setFormTarget(item)
                }
                onDelete={() =>
                  setDeleteTarget(item)
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="UserRound"
            title={translate(
              "admin.facultyLeadership.empty.title"
            )}
            description={translate(
              "admin.facultyLeadership.empty.description"
            )}
          />
        )
      ) : (
        <FacultyLeadershipForm
          key={
            isCreating
              ? "new"
              : (
                  formTarget as WithId<FacultyLeadershipDoc>
                ).id
          }
          initialValues={
            isCreating
              ? {
                  ...EMPTY_FACULTY_LEADER,
                  order: nextOrder(items),
                }
              : stripId(
                  formTarget as WithId<FacultyLeadershipDoc>
                )
          }
          onSubmit={
            isCreating
              ? handleCreate
              : handleUpdate
          }
          onCancel={() =>
            setFormTarget(null)
          }
          submitLabel={
            isCreating
              ? translate(
                  "admin.facultyLeadership.form.create"
                )
              : translate(
                  "admin.facultyLeadership.form.saveChanges"
                )
          }
          submittingLabel={translate(
            "admin.facultyLeadership.form.saving"
          )}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title={translate(
          "admin.facultyLeadership.delete.title"
        )}
        description={
          deleteTarget
            ? `${deleteTarget.nameAr}${
                deleteTarget.nameEn
                  ? ` / ${deleteTarget.nameEn}`
                  : ""
              }`
            : undefined
        }
        confirmLabel={translate(
          "admin.facultyLeadership.delete.confirm"
        )}
        confirmingLabel={translate(
          "admin.facultyLeadership.delete.confirming"
        )}
        cancelLabel={translate(
          "admin.facultyLeadership.delete.cancel"
        )}
        destructive
        confirming={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() =>
          setDeleteTarget(null)
        }
      />
    </PageContainer>
  );
}
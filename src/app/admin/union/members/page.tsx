"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { CommitteeMemberForm } from "@/components/admin/CommitteeMemberForm";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { LoadingDashboard } from "@/components/admin/LoadingDashboard";
import { Unauthorized } from "@/components/admin/Unauthorized";
import { committeeMembersService, unionService } from "@/lib/firebase/services";
import type {
  CommitteeDoc,
  CommitteeMemberDoc,
} from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";
import { useAuthGuard, canAccess } from "@/lib/auth/routeGuard";
import { PERMISSIONS } from "@/lib/auth/constants";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

type MemberWithId = WithId<CommitteeMemberDoc>;

type FormTarget = MemberWithId | "new" | null;

const EMPTY_MEMBER: CommitteeMemberDoc = {
  nameAr: "",
  nameEn: "",
  roleAr: "عضو",
  roleEn: "Member",
  committeeId: "",
};

function stripId(item: MemberWithId): CommitteeMemberDoc {
  const { id, ...rest } = item;
  void id;
  return rest;
}

export default function AdminCommitteeMembersPage() {
  const { translate, language } = useLanguage();
  const { loading: authLoading, admin } = useAuthGuard();

  const [committees, setCommittees] = useState<
    Array<WithId<CommitteeDoc>>
  >([]);

  const [members, setMembers] = useState<MemberWithId[]>([]);

  const [selectedCommitteeId, setSelectedCommitteeId] =
    useState("");

  const [hasFetched, setHasFetched] = useState(false);
  const [formTarget, setFormTarget] =
    useState<FormTarget>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<MemberWithId | null>(null);

  const [deleting, setDeleting] = useState(false);

  const allowed = admin
    ? canAccess(admin, PERMISSIONS.manageUnion)
    : false;

  useEffect(() => {
    if (!allowed) return;

    let cancelled = false;

    Promise.all([
      unionService.getAll({
        orderByField: {
          field: "order",
          direction: "asc",
        },
      }),

      committeeMembersService.getAll(),
    ]).then(([committeeDocs, memberDocs]) => {
      if (cancelled) return;

      setCommittees(committeeDocs);
      setMembers(memberDocs);

      if (committeeDocs.length > 0) {
        setSelectedCommitteeId(committeeDocs[0].id);
      }

      setHasFetched(true);
    });

    return () => {
      cancelled = true;
    };
  }, [allowed]);

  if (authLoading || (allowed && !hasFetched)) {
    return <LoadingDashboard />;
  }

  if (!admin || !allowed) {
    return <Unauthorized />;
  }

  const selectedCommittee = committees.find(
    (committee) => committee.id === selectedCommitteeId
  );

  const selectedMembers = members.filter(
    (member) => member.committeeId === selectedCommitteeId
  );

  function getCommitteeName(committee: CommitteeDoc) {
    return language === "ar"
      ? committee.nameAr
      : committee.nameEn;
  }

  async function handleCreate(values: CommitteeMemberDoc) {
    const id = await committeeMembersService.create({
      ...values,
      committeeId: selectedCommitteeId,
    });

    setMembers((prev) => [
      ...prev,
      {
        id,
        ...values,
        committeeId: selectedCommitteeId,
      },
    ]);

    setFormTarget(null);
  }

  async function handleUpdate(values: CommitteeMemberDoc) {
    if (
      formTarget === null ||
      formTarget === "new"
    ) {
      return;
    }

    const id = formTarget.id;

    await committeeMembersService.update(id, {
      ...values,
      committeeId: selectedCommitteeId,
    });

    setMembers((prev) =>
      prev.map((member) =>
        member.id === id
          ? {
              ...member,
              ...values,
              committeeId: selectedCommitteeId,
            }
          : member
      )
    );

    setFormTarget(null);
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await committeeMembersService.remove(
        deleteTarget.id
      );

      setMembers((prev) =>
        prev.filter(
          (member) => member.id !== deleteTarget.id
        )
      );
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
              ? "إضافة عضو"
              : "تعديل عضو"
            : "أعضاء اللجان"
        }
        description={
          !inForm
            ? "إدارة أعضاء كل لجنة من لجان اتحاد الطلبة"
            : undefined
        }
        breadcrumbs={[
          {
            label: translate("admin.breadcrumb.root"),
            href: "/admin",
          },
          {
            label: "اتحاد الطلبة",
            href: "/admin/union",
          },
          {
            label: "أعضاء اللجان",
          },
        ]}
        actions={
          !inForm &&
          selectedCommitteeId &&
          selectedMembers.length < 5 ? (
            <button
              type="button"
              onClick={() => setFormTarget("new")}
              className={cx(
                "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-dark",
                focusRing
              )}
            >
              <Plus
                className="h-4 w-4"
                aria-hidden="true"
              />
              إضافة عضو
            </button>
          ) : undefined
        }
      />

      {!inForm ? (
        <>
          {committees.length === 0 ? (
            <EmptyState
              icon="Users"
              title="لا توجد لجان"
              description="قم بإضافة اللجان أولًا من صفحة اتحاد الطلبة."
            />
          ) : (
            <>
              <div>
                <label
                  htmlFor="committee-select"
                  className="text-sm font-medium text-foreground"
                >
                  اختر اللجنة
                </label>

                <select
                  id="committee-select"
                  value={selectedCommitteeId}
                  onChange={(event) =>
                    setSelectedCommitteeId(
                      event.target.value
                    )
                  }
                  className={cx(
                    "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
                    focusRing
                  )}
                >
                  {committees.map((committee) => (
                    <option
                      key={committee.id}
                      value={committee.id}
                    >
                      {getCommitteeName(committee)}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCommittee && (
                <div className="rounded-lg border border-border bg-surface p-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-foreground">
                      {getCommitteeName(
                        selectedCommittee
                      )}
                    </h2>

                    <p className="mt-1 text-sm text-foreground/60">
                      {selectedMembers.length} / 5 أعضاء
                    </p>
                  </div>

                  {selectedMembers.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {selectedMembers.map(
                        (member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between gap-4 rounded-md border border-border bg-surface-muted p-4"
                          >
                            <div>
                              <p className="font-semibold text-foreground">
                                {language === "ar"
                                  ? member.nameAr
                                  : member.nameEn}
                              </p>

                              <p className="mt-1 text-sm text-foreground/60">
                                {language === "ar"
                                  ? member.roleAr
                                  : member.roleEn}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setFormTarget(
                                    member
                                  )
                                }
                                className={cx(
                                  "inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-surface",
                                  focusRing
                                )}
                              >
                                <Pencil
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                                تعديل
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteTarget(
                                    member
                                  )
                                }
                                className={cx(
                                  "inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10",
                                  focusRing
                                )}
                              >
                                <Trash2
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                                حذف
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p className="py-8 text-center text-sm text-foreground/60">
                      لا يوجد أعضاء لهذه اللجنة حتى الآن.
                    </p>
                  )}

                  {selectedMembers.length >= 5 && (
                    <p className="mt-4 text-sm font-medium text-secondary-dark">
                      اكتملت اللجنة — 5 أعضاء.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <CommitteeMemberForm
          key={
            isCreating
              ? "new"
              : (formTarget as MemberWithId).id
          }
          initialValues={
            isCreating
              ? {
                  ...EMPTY_MEMBER,
                  committeeId:
                    selectedCommitteeId,
                }
              : stripId(
                  formTarget as MemberWithId
                )
          }
          onSubmit={
            isCreating
              ? handleCreate
              : handleUpdate
          }
          onCancel={() => setFormTarget(null)}
          submitLabel={
            isCreating ? "إضافة العضو" : "حفظ التعديلات"
          }
          submittingLabel="جاري الحفظ..."
          cancelLabel="إلغاء"
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="حذف العضو"
        description={
          deleteTarget
            ? `${
                language === "ar"
                  ? deleteTarget.nameAr
                  : deleteTarget.nameEn
              } — ${
                language === "ar"
                  ? deleteTarget.roleAr
                  : deleteTarget.roleEn
              }`
            : undefined
        }
        confirmLabel="حذف"
        confirmingLabel="جاري الحذف..."
        cancelLabel="إلغاء"
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
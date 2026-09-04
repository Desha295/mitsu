"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { CommitteeForm } from "@/components/admin/CommitteeForm";
import { CommitteeMemberForm } from "@/components/admin/CommitteeMemberForm";
import { CommitteeListItem } from "@/components/admin/CommitteeListItem";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { unionService, committeeMembersService } from "@/lib/firebase/services";
import type {
  CommitteeDoc,
  CommitteeMemberDoc,
} from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";
import { useAuthGuard, canAccess } from "@/lib/auth/routeGuard";
import { PERMISSIONS } from "@/lib/auth/constants";
import { Unauthorized } from "@/components/admin/Unauthorized";
import { LoadingDashboard } from "@/components/admin/LoadingDashboard";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

const EMPTY_COMMITTEE: CommitteeDoc = {
  nameAr: "",
  nameEn: "",
  descriptionAr: "",
  descriptionEn: "",
  imageUrl: "",
  isActive: true,
  order: 1,
};

type FormTarget = WithId<CommitteeDoc> | "new" | null;
type MemberFormTarget = WithId<CommitteeMemberDoc> | "new" | null;
type Feedback =
  | "created"
  | "updated"
  | "deleted"
  | "memberCreated"
  | "memberUpdated"
  | "memberDeleted"
  | null;

function stripId(item: WithId<CommitteeDoc>): CommitteeDoc {
  const { id, ...rest } = item;
  void id;
  return rest;
}

function stripMemberId(
  item: WithId<CommitteeMemberDoc>
): CommitteeMemberDoc {
  const { id, ...rest } = item;
  void id;
  return rest;
}

function nextOrder(items: Array<WithId<CommitteeDoc>>): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map((item) => item.order)) + 1;
}

function emptyMember(committeeId: string): CommitteeMemberDoc {
  return {
    nameAr: "",
    nameEn: "",
    roleAr: "عضو",
    roleEn: "Member",
    committeeId,
    order: 0,
  };
}

export default function AdminUnionPage() {
  const { translate, language } = useLanguage();
  const { loading: authLoading, admin } = useAuthGuard();

  const [items, setItems] = useState<Array<WithId<CommitteeDoc>>>([]);
  const [hasFetched, setHasFetched] = useState(false);

  const [formTarget, setFormTarget] = useState<FormTarget>(null);

  const [members, setMembers] = useState<
    Array<WithId<CommitteeMemberDoc>>
  >([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [memberFormTarget, setMemberFormTarget] =
    useState<MemberFormTarget>(null);

  const [feedback, setFeedback] = useState<Feedback>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<WithId<CommitteeDoc> | null>(null);

  const [deleteMemberTarget, setDeleteMemberTarget] =
    useState<WithId<CommitteeMemberDoc> | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deletingMember, setDeletingMember] = useState(false);

  const allowed = admin
    ? canAccess(admin, PERMISSIONS.manageUnion)
    : false;

  const loadingList = allowed && !hasFetched;

  useEffect(() => {
    if (!allowed) return;

    let cancelled = false;

    unionService
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

  useEffect(() => {
    if (!allowed) return;

    if (
      formTarget === null ||
      formTarget === "new"
    ) {
      setMembers([]);
      setMemberFormTarget(null);
      return;
    }

    let cancelled = false;

    setMembersLoading(true);
    setMemberFormTarget(null);

    committeeMembersService
      .getAll({
        filters: [
          {
            field: "committeeId",
            op: "==",
            value: formTarget.id,
          },
        ],
      })
      .then((docs) => {
        if (cancelled) return;

        setMembers(docs);
      })
      .finally(() => {
        if (!cancelled) {
          setMembersLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [allowed, formTarget]);

  if (authLoading || loadingList) {
    return <LoadingDashboard />;
  }

  if (!admin || !allowed) {
    return <Unauthorized />;
  }

  async function handleCreate(values: CommitteeDoc) {
    const id = await unionService.create(values);

    const createdCommittee: WithId<CommitteeDoc> = {
      id,
      ...values,
    };

    setItems((prev) =>
      [...prev, createdCommittee].sort(
        (a, b) => a.order - b.order
      )
    );

    setFormTarget(createdCommittee);
    setFeedback("created");
  }

  async function handleUpdate(values: CommitteeDoc) {
    if (
      formTarget === null ||
      formTarget === "new"
    ) {
      return;
    }

    const id = formTarget.id;

    await unionService.update(id, values);

    const updatedCommittee: WithId<CommitteeDoc> = {
      ...formTarget,
      ...values,
    };

    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? updatedCommittee
            : item
        )
        .sort((a, b) => a.order - b.order)
    );

    setFormTarget(updatedCommittee);
    setFeedback("updated");
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await unionService.remove(deleteTarget.id);

      setItems((prev) =>
        prev.filter(
          (item) => item.id !== deleteTarget.id
        )
      );

      if (
        formTarget !== null &&
        formTarget !== "new" &&
        formTarget.id === deleteTarget.id
      ) {
        setFormTarget(null);
      }

      setFeedback("deleted");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  async function handleMemberCreate(
  values: CommitteeMemberDoc
) {
  if (
    formTarget === null ||
    formTarget === "new"
  ) {
    return;
  }

  const committeeMembers = members.filter(
    (member) =>
      member.committeeId === formTarget.id
  );

  const nextOrder =
    committeeMembers.length > 0
      ? Math.max(
          ...committeeMembers.map(
            (member) => member.order
          )
        ) + 1
      : 1;

  const memberValues: CommitteeMemberDoc = {
    ...values,
    committeeId: formTarget.id,
    order: nextOrder,
  };

  const id =
    await committeeMembersService.create(
      memberValues
    );

  setMembers((prev) => [
    ...prev,
    {
      id,
      ...memberValues,
    },
  ]);

  setMemberFormTarget(null);
  setFeedback("memberCreated");
}

  async function handleMemberUpdate(
    values: CommitteeMemberDoc
  ) {
    if (
      memberFormTarget === null ||
      memberFormTarget === "new"
    ) {
      return;
    }

    const id = memberFormTarget.id;

    const memberValues: CommitteeMemberDoc = {
      ...values,
      committeeId: memberFormTarget.committeeId,
    };

    await committeeMembersService.update(
      id,
      memberValues
    );

    setMembers((prev) =>
      prev.map((member) =>
        member.id === id
          ? {
              id,
              ...memberValues,
            }
          : member
      )
    );

    setMemberFormTarget(null);
    setFeedback("memberUpdated");
  }

  async function handleMemberDeleteConfirm() {
    if (!deleteMemberTarget) return;

    setDeletingMember(true);

    try {
      await committeeMembersService.remove(
        deleteMemberTarget.id
      );

      setMembers((prev) =>
        prev.filter(
          (member) =>
            member.id !== deleteMemberTarget.id
        )
      );

      if (
        memberFormTarget !== null &&
        memberFormTarget !== "new" &&
        memberFormTarget.id ===
          deleteMemberTarget.id
      ) {
        setMemberFormTarget(null);
      }

      setFeedback("memberDeleted");
    } finally {
      setDeletingMember(false);
      setDeleteMemberTarget(null);
    }
  }

  const inForm = formTarget !== null;
  const isCreating = formTarget === "new";

  const isEditingCommittee =
    formTarget !== null &&
    formTarget !== "new";

  const memberFormOpen =
    memberFormTarget !== null;

  return (
    <PageContainer className="flex flex-col gap-8">
      <AdminHeader
        title={
          !inForm
            ? translate("admin.union.heading")
            : isCreating
              ? translate(
                  "admin.union.form.createHeading"
                )
              : translate(
                  "admin.union.form.editHeading"
                )
        }
        description={
          !inForm
            ? translate(
                "admin.union.subheading"
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
                  "admin.union.heading"
                ),
              }
            : {
                label: translate(
                  "admin.union.heading"
                ),
                href: "/admin/union",
              },
          ...(inForm
            ? [
                {
                  label: isCreating
                    ? translate(
                        "admin.union.breadcrumb.new"
                      )
                    : translate(
                        "admin.union.breadcrumb.edit"
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
                "admin.union.newButton"
              )}
            </button>
          ) : undefined
        }
      />

      {feedback && (
        <p className="rounded-md bg-secondary-light px-4 py-2 text-sm font-medium text-secondary-dark">
          {feedback === "memberCreated"
            ? "تم إضافة العضو بنجاح."
            : feedback === "memberUpdated"
              ? "تم تحديث بيانات العضو بنجاح."
              : feedback === "memberDeleted"
                ? "تم حذف العضو بنجاح."
                : translate(
                    `admin.union.feedback.${feedback}`
                  )}
        </p>
      )}

      {!inForm ? (
        items.length > 0 ? (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <CommitteeListItem
                key={item.id}
                committee={item}
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
            icon="Users"
            title={translate(
              "admin.union.empty.title"
            )}
            description={translate(
              "admin.union.empty.description"
            )}
          />
        )
      ) : (
        <div className="flex flex-col gap-8">
          <CommitteeForm
            key={
              isCreating
                ? "new"
                : (
                    formTarget as WithId<CommitteeDoc>
                  ).id
            }
            initialValues={
              isCreating
                ? {
                    ...EMPTY_COMMITTEE,
                    order: nextOrder(items),
                  }
                : stripId(
                    formTarget as WithId<CommitteeDoc>
                  )
            }
            onSubmit={
              isCreating
                ? handleCreate
                : handleUpdate
            }
            onCancel={() => {
              setFormTarget(null);
              setMemberFormTarget(null);
            }}
            submitLabel={
              isCreating
                ? translate(
                    "admin.union.form.create"
                  )
                : translate(
                    "admin.union.form.saveChanges"
                  )
            }
            submittingLabel={translate(
              "admin.union.form.saving"
            )}
          />

          {isEditingCommittee && (
            <section className="border-t border-border pt-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Users
                        className="h-5 w-5 text-primary"
                        aria-hidden="true"
                      />

                      <h2 className="text-xl font-bold text-foreground">
                        {language === "ar"
                          ? "أعضاء اللجنة"
                          : "Committee Members"}
                      </h2>
                    </div>

                    <p className="mt-2 text-sm text-foreground/60">
                      {language === "ar"
                        ? "أضف رئيس اللجنة ونائب الرئيس والأعضاء."
                        : "Add the committee head, vice head, and members."}
                    </p>
                  </div>

                  {!memberFormOpen &&
                    members.length < 5 && (
                      <button
                        type="button"
                        onClick={() =>
                          setMemberFormTarget(
                            "new"
                          )
                        }
                        className={cx(
                          "inline-flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-dark",
                          focusRing
                        )}
                      >
                        <Plus
                          className="h-4 w-4"
                          aria-hidden="true"
                        />
                        {language === "ar"
                          ? "إضافة عضو"
                          : "Add Member"}
                      </button>
                    )}
                </div>

                {membersLoading ? (
                  <div className="rounded-md border border-border bg-surface p-6 text-center text-sm text-foreground/60">
                    {translate(
                      "common.loading"
                    )}
                  </div>
                ) : (
                  <>
                    {!memberFormOpen &&
                      members.length === 0 && (
                        <div className="rounded-md border border-dashed border-border bg-surface p-8 text-center">
                          <Users
                            className="mx-auto h-8 w-8 text-foreground/30"
                            aria-hidden="true"
                          />

                          <p className="mt-3 text-sm font-medium text-foreground">
                            {language === "ar"
                              ? "لا يوجد أعضاء مضافون لهذه اللجنة."
                              : "No members have been added to this committee yet."}
                          </p>

                          <p className="mt-1 text-xs text-foreground/50">
                            {language === "ar"
                              ? "يمكنك إضافة حتى 5 أعضاء."
                              : "You can add up to 5 members."}
                          </p>
                        </div>
                      )}

                    {!memberFormOpen &&
                      members.length > 0 && (
                        <div className="flex flex-col gap-3">
                          {members.map(
                            (
                              member,
                              index
                            ) => {
                              const memberName =
                                language ===
                                "ar"
                                  ? member.nameAr
                                  : member.nameEn;

                              const memberRole =
                                language ===
                                "ar"
                                  ? member.roleAr
                                  : member.roleEn;

                              return (
                                <div
                                  key={
                                    member.id
                                  }
                                  className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
                                        {index +
                                          1}
                                      </span>

                                      <h3 className="text-sm font-semibold text-foreground">
                                        {memberName}
                                      </h3>
                                    </div>

                                    <p className="mt-2 text-sm text-foreground/60">
                                      {memberRole}
                                    </p>
                                  </div>

                                  <div className="flex shrink-0 items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setMemberFormTarget(
                                          member
                                        )
                                      }
                                      className={cx(
                                        "inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted",
                                        focusRing
                                      )}
                                    >
                                      <Pencil
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                      />
                                      {translate(
                                        "common.edit"
                                      )}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        setDeleteMemberTarget(
                                          member
                                        )
                                      }
                                      className={cx(
                                        "inline-flex items-center gap-2 rounded-md border border-primary px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white",
                                        focusRing
                                      )}
                                    >
                                      <Trash2
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                      />
                                      {translate(
                                        "common.delete"
                                      )}
                                    </button>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      )}

                    {!memberFormOpen &&
                      members.length >= 5 && (
                        <p className="text-xs text-foreground/50">
                          {language === "ar"
                            ? "تم الوصول إلى الحد الأقصى: 5 أعضاء."
                            : "Maximum of 5 members reached."}
                        </p>
                      )}

                    {memberFormOpen && (
                      <div className="rounded-lg border border-border bg-surface p-5">
                        <div className="mb-5">
                          <h3 className="text-base font-semibold text-foreground">
                            {memberFormTarget ===
                            "new"
                              ? language ===
                                "ar"
                                ? "إضافة عضو جديد"
                                : "Add New Member"
                              : language ===
                                  "ar"
                                ? "تعديل بيانات العضو"
                                : "Edit Member"}
                          </h3>
                        </div>

                        <CommitteeMemberForm
                          key={
                            memberFormTarget ===
                            "new"
                              ? "new-member"
                              : (
                                  memberFormTarget as WithId<CommitteeMemberDoc>
                                ).id
                          }
                          initialValues={
                            memberFormTarget ===
                            "new"
                              ? emptyMember(
                                  formTarget.id
                                )
                              : stripMemberId(
                                  memberFormTarget as WithId<CommitteeMemberDoc>
                                )
                          }
                          onSubmit={
                            memberFormTarget ===
                            "new"
                              ? handleMemberCreate
                              : handleMemberUpdate
                          }
                          onCancel={() =>
                            setMemberFormTarget(
                              null
                            )
                          }
                          submitLabel={
                            memberFormTarget ===
                            "new"
                              ? language ===
                                "ar"
                                ? "إضافة العضو"
                                : "Add Member"
                              : language ===
                                  "ar"
                                ? "حفظ التعديلات"
                                : "Save Changes"
                          }
                          submittingLabel={
                            language ===
                            "ar"
                              ? "جارٍ الحفظ..."
                              : "Saving..."
                          }
                          cancelLabel={
                            language ===
                            "ar"
                              ? "إلغاء"
                              : "Cancel"
                          }
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>
          )}
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title={translate(
          "admin.union.delete.title"
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
          "admin.union.delete.confirm"
        )}
        confirmingLabel={translate(
          "admin.union.delete.confirming"
        )}
        cancelLabel={translate(
          "admin.union.delete.cancel"
        )}
        destructive
        confirming={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() =>
          setDeleteTarget(null)
        }
      />

      <ConfirmDialog
        open={deleteMemberTarget !== null}
        title={
          language === "ar"
            ? "حذف عضو اللجنة"
            : "Delete Committee Member"
        }
        description={
          deleteMemberTarget
            ? `${
                language === "ar"
                  ? deleteMemberTarget.nameAr
                  : deleteMemberTarget.nameEn
              }`
            : undefined
        }
        confirmLabel={
          language === "ar"
            ? "حذف العضو"
            : "Delete Member"
        }
        confirmingLabel={
          language === "ar"
            ? "جارٍ الحذف..."
            : "Deleting..."
        }
        cancelLabel={
          language === "ar"
            ? "إلغاء"
            : "Cancel"
        }
        destructive
        confirming={deletingMember}
        onConfirm={
          handleMemberDeleteConfirm
        }
        onCancel={() =>
          setDeleteMemberTarget(null)
        }
      />
    </PageContainer>
  );
}
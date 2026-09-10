"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  ShieldCheck,
  Crown,
  UserRound,
  Sparkles,
} from "lucide-react";

import { PageContainer } from "@/components/admin/PageContainer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EmptyState } from "@/components/admin/EmptyState";
import { CommitteeForm } from "@/components/admin/CommitteeForm";
import { CommitteeMemberForm } from "@/components/admin/CommitteeMemberForm";
import { CommitteeListItem } from "@/components/admin/CommitteeListItem";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  unionService,
  committeeMembersService,
} from "@/lib/firebase/services";
import type {
  CommitteeDoc,
  CommitteeMemberDoc,
} from "@/lib/firebase/collections";
import type { WithId } from "@/lib/firebase/services";
import {
  useAuthGuard,
  canAccess,
} from "@/lib/auth/routeGuard";
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
type MemberFormTarget =
  | WithId<CommitteeMemberDoc>
  | "new"
  | null;

type Feedback =
  | "created"
  | "updated"
  | "deleted"
  | "memberCreated"
  | "memberUpdated"
  | "memberDeleted"
  | null;

function stripId(
  item: WithId<CommitteeDoc>
): CommitteeDoc {
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

function nextOrder(
  items: Array<WithId<CommitteeDoc>>
): number {
  if (items.length === 0) return 1;

  return (
    Math.max(...items.map((item) => item.order)) + 1
  );
}

function emptyMember(
  committeeId: string
): CommitteeMemberDoc {
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
  const isArabic = language === "ar";

  const { loading: authLoading, admin } =
    useAuthGuard();

  const [items, setItems] = useState<
    Array<WithId<CommitteeDoc>>
  >([]);

  const [hasFetched, setHasFetched] =
    useState(false);

  const [formTarget, setFormTarget] =
    useState<FormTarget>(null);

  const [members, setMembers] = useState<
    Array<WithId<CommitteeMemberDoc>>
  >([]);

  const [membersLoading, setMembersLoading] =
    useState(false);

  const [memberFormTarget, setMemberFormTarget] =
    useState<MemberFormTarget>(null);

  const [feedback, setFeedback] =
    useState<Feedback>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<WithId<CommitteeDoc> | null>(null);

  const [deleteMemberTarget, setDeleteMemberTarget] =
    useState<WithId<CommitteeMemberDoc> | null>(
      null
    );

  const [deleting, setDeleting] = useState(false);
  const [deletingMember, setDeletingMember] =
    useState(false);

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

  async function handleCreate(
    values: CommitteeDoc
  ) {
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

  async function handleUpdate(
    values: CommitteeDoc
  ) {
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

    const nextMemberOrder =
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
      order: nextMemberOrder,
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
      committeeId:
        memberFormTarget.committeeId,
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
                [
                  "inline-flex min-h-11 items-center gap-2",
                  "rounded-xl bg-primary px-4 py-2.5",
                  "text-sm font-semibold text-primary-foreground",
                  "shadow-sm",
                  "transition-all duration-200",
                  "hover:-translate-y-0.5",
                  "hover:bg-primary-dark",
                  "hover:shadow-md",
                ].join(" "),
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

      {feedback ? (
        <div
          role="status"
          className="relative overflow-hidden rounded-2xl border border-secondary/20 bg-secondary-light/60 px-5 py-4 shadow-sm"
        >
          <div
            aria-hidden="true"
            className="absolute inset-y-0 start-0 w-1 bg-secondary"
          />

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary-dark">
              <ShieldCheck
                className="h-5 w-5"
                aria-hidden="true"
              />
            </div>

            <p className="text-sm font-semibold text-secondary-dark">
              {feedback === "memberCreated"
                ? isArabic
                  ? "تم إضافة العضو بنجاح."
                  : "Member added successfully."
                : feedback === "memberUpdated"
                  ? isArabic
                    ? "تم تحديث بيانات العضو بنجاح."
                    : "Member updated successfully."
                  : feedback === "memberDeleted"
                    ? isArabic
                      ? "تم حذف العضو بنجاح."
                      : "Member deleted successfully."
                    : translate(
                        `admin.union.feedback.${feedback}`
                      )}
            </p>
          </div>
        </div>
      ) : null}

      {!inForm ? (
        items.length > 0 ? (
          <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-surface/70 p-5 shadow-sm backdrop-blur-xl sm:p-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            />

            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 text-primary">
                <Users
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>

              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {translate(
                    "admin.union.heading"
                  )}
                </h2>

                <p className="mt-0.5 text-sm text-muted-foreground">
                  {items.length}{" "}
                  {isArabic
                    ? "لجان مسجلة"
                    : "registered committees"}
                </p>
              </div>
            </div>

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
          </section>
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
          <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-surface/70 p-1 shadow-sm backdrop-blur-xl">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            />

            <div className="rounded-[1.8rem] bg-background/30 p-4 sm:p-6">
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
            </div>
          </section>

          {isEditingCommittee ? (
            <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-surface/70 p-5 shadow-sm backdrop-blur-xl sm:p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
              />

              <div className="relative">
                <div className="flex flex-col gap-5 border-b border-border/70 pb-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 text-primary">
                      <Users
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                          {language === "ar"
                            ? "أعضاء اللجنة"
                            : "Committee Members"}
                        </h2>

                        <span className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[10px] font-bold text-primary">
                          {members.length}/5
                        </span>
                      </div>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                        {language === "ar"
                          ? "أضف رئيس اللجنة ونائب الرئيس وثلاثة أعضاء."
                          : "Add the committee head, vice head, and three members."}
                      </p>
                    </div>
                  </div>

                  {!memberFormOpen &&
                  members.length < 5 ? (
                    <button
                      type="button"
                      onClick={() =>
                        setMemberFormTarget("new")
                      }
                      className={cx(
                        [
                          "inline-flex min-h-11 w-fit items-center gap-2",
                          "rounded-xl bg-primary px-4 py-2.5",
                          "text-sm font-semibold text-primary-foreground",
                          "shadow-sm transition-all duration-200",
                          "hover:-translate-y-0.5",
                          "hover:bg-primary-dark",
                          "hover:shadow-md",
                        ].join(" "),
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
                  ) : null}
                </div>

                {membersLoading ? (
                  <div className="mt-6 flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-border/70 bg-background/40">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/5">
                      <Sparkles
                        className="h-5 w-5 animate-pulse text-primary"
                        aria-hidden="true"
                      />
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {translate(
                        "common.loading"
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="mt-6">
                    {!memberFormOpen &&
                    members.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-border bg-background/40 px-6 py-12 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary/60">
                          <Users
                            className="h-7 w-7"
                            aria-hidden="true"
                          />
                        </div>

                        <p className="mt-4 text-sm font-semibold text-foreground">
                          {language === "ar"
                            ? "لا يوجد أعضاء مضافون لهذه اللجنة."
                            : "No members have been added to this committee yet."}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {language === "ar"
                            ? "يمكنك إضافة حتى 5 أعضاء."
                            : "You can add up to 5 members."}
                        </p>
                      </div>
                    ) : null}

                    {!memberFormOpen &&
                    members.length > 0 ? (
                      <div className="grid gap-3 lg:grid-cols-2">
                        {members
                          .sort(
                            (a, b) =>
                              a.order - b.order
                          )
                          .map(
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

                              const isHead =
                                index === 0;

                              const isVice =
                                index === 1;

                              return (
                                <div
                                  key={
                                    member.id
                                  }
                                  className="group/member relative overflow-hidden rounded-2xl border border-border/70 bg-background/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/[0.025] hover:shadow-md"
                                >
                                  <div
                                    aria-hidden="true"
                                    className={cx(
                                      "absolute inset-y-0 start-0 w-1",
                                      isHead
                                        ? "bg-primary"
                                        : isVice
                                          ? "bg-secondary"
                                          : "bg-border"
                                    )}
                                  />

                                  <div className="flex items-center gap-3 ps-1">
                                    <div
                                      className={cx(
                                        [
                                          "flex h-10 w-10 shrink-0 items-center justify-center",
                                          "rounded-xl border text-xs font-bold",
                                        ].join(
                                          " "
                                        ),
                                        isHead
                                          ? "border-primary/20 bg-primary/10 text-primary"
                                          : isVice
                                            ? "border-secondary/20 bg-secondary/10 text-secondary-dark"
                                            : "border-border/70 bg-surface-muted text-muted-foreground"
                                      )}
                                    >
                                      {isHead ? (
                                        <Crown
                                          className="h-4 w-4"
                                          aria-hidden="true"
                                        />
                                      ) : isVice ? (
                                        <ShieldCheck
                                          className="h-4 w-4"
                                          aria-hidden="true"
                                        />
                                      ) : (
                                        <UserRound
                                          className="h-4 w-4"
                                          aria-hidden="true"
                                        />
                                      )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                                          {isHead
                                            ? language ===
                                              "ar"
                                              ? "رئيس اللجنة"
                                              : "Committee Head"
                                            : isVice
                                              ? language ===
                                                "ar"
                                                ? "نائب رئيس اللجنة"
                                                : "Vice Committee Head"
                                              : language ===
                                                  "ar"
                                                ? `عضو ${index - 1}`
                                                : `Member ${index - 1}`}
                                        </span>
                                      </div>

                                      <h3 className="mt-1 break-words text-sm font-bold leading-5 text-foreground">
                                        {memberName}
                                      </h3>

                                      <p className="mt-0.5 break-words text-xs leading-5 text-muted-foreground">
                                        {memberRole}
                                      </p>
                                    </div>

                                    <span className="hidden shrink-0 rounded-full border border-border/70 bg-surface px-2 py-1 text-[10px] font-bold text-muted-foreground sm:inline-flex">
                                      #{index + 1}
                                    </span>
                                  </div>

                                  <div className="mt-4 flex items-center justify-end gap-2 border-t border-border/60 pt-3">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setMemberFormTarget(
                                          member
                                        )
                                      }
                                      className={cx(
                                        [
                                          "inline-flex min-h-9 items-center gap-2 rounded-lg",
                                          "border border-border/70 bg-surface px-3 py-2",
                                          "text-xs font-semibold text-foreground",
                                          "transition-all duration-200",
                                          "hover:border-primary/20",
                                          "hover:bg-primary/5",
                                          "hover:text-primary",
                                        ].join(
                                          " "
                                        ),
                                        focusRing
                                      )}
                                    >
                                      <Pencil
                                        className="h-3.5 w-3.5"
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
                                        [
                                          "inline-flex min-h-9 items-center gap-2 rounded-lg",
                                          "border border-border/70 bg-surface px-3 py-2",
                                          "text-xs font-semibold text-primary",
                                          "transition-all duration-200",
                                          "hover:bg-primary",
                                          "hover:text-primary-foreground",
                                          "hover:shadow-sm",
                                        ].join(
                                          " "
                                        ),
                                        focusRing
                                      )}
                                    >
                                      <Trash2
                                        className="h-3.5 w-3.5"
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
                    ) : null}

                    {!memberFormOpen &&
                    members.length >= 5 ? (
                      <div className="mt-4 flex items-center gap-2 rounded-xl border border-secondary/20 bg-secondary-light/40 px-4 py-3">
                        <ShieldCheck
                          className="h-4 w-4 shrink-0 text-secondary-dark"
                          aria-hidden="true"
                        />

                        <p className="text-xs font-medium text-secondary-dark">
                          {language === "ar"
                            ? "تم الوصول إلى الحد الأقصى: 5 أعضاء."
                            : "Maximum of 5 members reached."}
                        </p>
                      </div>
                    ) : null}

                    {memberFormOpen ? (
                      <div className="rounded-2xl border border-primary/15 bg-background/40 p-4 sm:p-6">
                        <div className="mb-6 flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/5 text-primary">
                            {memberFormTarget ===
                            "new" ? (
                              <Plus
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <Pencil
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-foreground">
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

                            <p className="mt-1 text-xs text-muted-foreground">
                              {language ===
                              "ar"
                                ? "أدخل بيانات العضو باللغتين."
                                : "Enter the member information in both languages."}
                            </p>
                          </div>
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
                    ) : null}
                  </div>
                )}
              </div>
            </section>
          ) : null}
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
            ? language === "ar"
              ? deleteMemberTarget.nameAr
              : deleteMemberTarget.nameEn
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


"use client";

import * as Icons from "lucide-react";
import {
  ArrowUpRight,
  UsersRound,
} from "lucide-react";

import type { CommitteeMemberDoc } from "@/lib/firebase/collections";
import { useLanguage } from "@/hooks/useLanguage";
import { cx } from "@/lib/utils";

interface CommitteeCardProps {
  name: string;
  description: string;
  /**
   * Presentation-only field with no Firestore equivalent yet.
   * Sourced from the static seed data by CommitteesSection.
   */
  icon?: string;
  members?: Array<CommitteeMemberDoc & { id: string }>;
}

/**
 * Committee card.
 *
 * Displays the committee information and its members.
 * Members are stored separately in the `committeeMembers`
 * Firestore collection and linked through `committeeId`.
 */
export function CommitteeCard({
  name,
  description,
  icon,
  members = [],
}: CommitteeCardProps) {
  const { language } = useLanguage();

  const isArabic = language === "ar";

  const IconComponent = icon
    ? (
        Icons as unknown as Record<
          string,
          React.ComponentType<{
            className?: string;
          }>
        >
      )[icon]
    : undefined;

  const sortedMembers = [...members].sort(
    (a, b) => a.order - b.order
  );

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-surface/80 p-5 backdrop-blur-xl sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />

      <div className="flex items-start gap-4">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 text-primary transition-all duration-300 group-hover:scale-105 group-hover:border-primary/30 group-hover:bg-primary/10">
          {IconComponent ? (
            <IconComponent
              className="h-7 w-7"
              aria-hidden="true"
            />
          ) : (
            <UsersRound
              className="h-7 w-7"
              aria-hidden="true"
            />
          )}

          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-surface bg-primary"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
              {isArabic ? "اتحاد الطلاب" : "Student Union"}
            </span>
          </div>

          <h3 className="break-words text-lg font-bold leading-6 text-foreground sm:text-xl">
            {name}
          </h3>
        </div>

        <ArrowUpRight
          className="mt-1 h-4 w-4 shrink-0 text-primary/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
          aria-hidden="true"
        />
      </div>

      <p className="mt-5 text-sm leading-7 text-muted-foreground">
        {description}
      </p>

      {sortedMembers.length > 0 ? (
        <div className="mt-6 border-t border-border/70 pt-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-foreground">
              {isArabic
                ? "أعضاء اللجنة"
                : "Committee Members"}
            </h4>

            <span className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[10px] font-bold text-primary">
              {sortedMembers.length}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {sortedMembers.map((member, index) => {
              const memberName = isArabic
                ? member.nameAr
                : member.nameEn;

              const memberRole = isArabic
                ? member.roleAr
                : member.roleEn;

              const isHead = index === 0;
              const isVice = index === 1;

              return (
                <div
                  key={member.id}
                  className={cx(
                    [
                      "group/member flex items-center gap-3",
                      "rounded-xl border border-border/60",
                      "bg-background/60 px-3.5 py-3",
                      "transition-all duration-200",
                      "hover:border-primary/20",
                      "hover:bg-primary/[0.035]",
                    ].join(" ")
                  )}
                >
                  <div
                    className={cx(
                      [
                        "flex h-9 w-9 shrink-0 items-center justify-center",
                        "rounded-lg border text-xs font-bold",
                        "transition-colors duration-200",
                      ].join(" "),
                      isHead
                        ? "border-primary/20 bg-primary/10 text-primary"
                        : isVice
                          ? "border-secondary/20 bg-secondary/10 text-secondary-dark"
                          : "border-border/70 bg-surface-muted text-muted-foreground"
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-semibold leading-5 text-foreground">
                      {memberName}
                    </p>

                    <p className="mt-0.5 break-words text-xs leading-5 text-muted-foreground">
                      {memberRole}
                    </p>
                  </div>

                  <div
                    aria-hidden="true"
                    className={cx(
                      "h-1.5 w-1.5 shrink-0 rounded-full",
                      isHead
                        ? "bg-primary"
                        : isVice
                          ? "bg-secondary"
                          : "bg-border"
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed border-border/70 bg-background/40 px-4 py-5 text-center">
          <p className="text-xs text-muted-foreground">
            {isArabic
              ? "لا توجد بيانات للأعضاء حاليًا."
              : "No member information available."}
          </p>
        </div>
      )}
    </article>
  );
}
"use client";

import * as Icons from "lucide-react";
import type { CommitteeMemberDoc } from "@/lib/firebase/collections";
import { useLanguage } from "@/hooks/useLanguage";

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
          React.ComponentType<{ className?: string }>
        >
      )[icon]
    : undefined;

  const sortedMembers = [...members].sort(
    (a, b) => a.order - b.order
  );

  return (
    <div className="flex flex-col rounded-lg border border-border bg-surface p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
        {IconComponent && (
          <IconComponent
            className="h-6 w-6"
            aria-hidden="true"
          />
        )}
      </span>

      <h3 className="mt-4 text-base font-semibold text-foreground">
        {name}
      </h3>

      <p className="mt-2 text-sm text-foreground/70">
        {description}
      </p>

      {sortedMembers.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <h4 className="text-sm font-semibold text-foreground">
            {isArabic
              ? "أعضاء اللجنة"
              : "Committee Members"}
          </h4>

          <div className="mt-3 flex flex-col gap-3">
            {sortedMembers.map((member) => {
              const memberName = isArabic
                ? member.nameAr
                : member.nameEn;

              const memberRole = isArabic
                ? member.roleAr
                : member.roleEn;

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-3 rounded-md bg-surface-muted px-3 py-2"
                >
                  <span className="min-w-0 text-sm font-medium text-foreground">
                    {memberName}
                  </span>

                  <span className="shrink-0 rounded-full bg-primary-light px-2 py-1 text-[11px] font-medium text-primary">
                    {memberRole}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

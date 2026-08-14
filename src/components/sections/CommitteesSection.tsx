"use client";

import * as Icons from "lucide-react";
import { Loader2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { CommitteeCard } from "@/components/shared/CommitteeCard";
import { committees, unionSocialLinks } from "@/data/union";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { unionService } from "@/lib/firebase/services";
import type { CommitteeDoc } from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";
import { cx, focusRing } from "@/lib/utils";

const ACTIVE_COMMITTEES_ORDERED: QueryOptions<CommitteeDoc> = {
  filters: [{ field: "isActive", op: "==", value: true }],
  orderByField: { field: "order", direction: "asc" },
};

const STATIC_ICON_BY_ORDER: Record<number, string> = Object.fromEntries(
  committees.map((committee) => [committee.order, committee.icon])
);

export function CommitteesSection() {
  const { translate, language } = useLanguage();

  const {
    data: sortedCommittees,
    loading,
    error,
  } = useFirestoreList(unionService, ACTIVE_COMMITTEES_ORDERED);

  return (
    <section className="bg-background py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col gap-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            {translate("union.committeesHeading")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            {translate("union.committeesSubheading")}
          </p>
        </div>

        {loading && (
          <div
            role="status"
            className="flex min-h-[16rem] flex-col items-center justify-center gap-3"
          >
            <Loader2
              className="h-8 w-8 animate-spin text-primary"
              aria-hidden="true"
            />
            <p className="text-sm text-foreground/60">
              {translate("common.loading")}
            </p>
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="flex min-h-[16rem] flex-col items-center justify-center gap-3 text-center"
          >
            <p className="text-sm font-medium text-foreground">
              {translate("union.committeesErrorState")}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {sortedCommittees.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sortedCommittees.map((committee) => {
                  const name =
                    language === "ar"
                      ? committee.nameAr
                      : committee.nameEn;

                  const description =
                    language === "ar"
                      ? committee.descriptionAr
                      : committee.descriptionEn;

                  return (
                    <CommitteeCard
                      key={committee.id}
                      name={name}
                      description={description}
                      icon={STATIC_ICON_BY_ORDER[committee.order]}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-foreground/60">
                {translate("union.committeesEmptyState")}
              </p>
            )}
          </>
        )}

        <div className="border-t border-border pt-10 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            {translate("union.socialHeading")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-foreground/70">
            {translate("union.socialSubheading")}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {unionSocialLinks.map((social) => {
              const IconComponent = (
                Icons as unknown as Record<
                  string,
                  React.ComponentType<{ className?: string }>
                >
              )[social.icon];

              const label = translate(social.labelKey);

              return (
                <a
                  key={social.labelKey}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cx(
                    "inline-flex items-center gap-2 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-surface-muted",
                    focusRing
                  )}
                >
                  {IconComponent && (
                    <IconComponent className="h-4 w-4" aria-hidden="true" />
                  )}
                  {label}
                </a>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
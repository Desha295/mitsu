"use client";

import { Loader2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { LeaderCard } from "@/components/shared/LeaderCard";
import { president, vicePresident, type SocialLinkItem } from "@/data/union";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { leadershipService } from "@/lib/firebase/services";
import type { LeadershipDoc } from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";

const ACTIVE_LEADERS_ORDERED: QueryOptions<LeadershipDoc> = {
  filters: [{ field: "isActive", op: "==", value: true }],
  orderByField: { field: "order", direction: "asc" },
};

const STATIC_SOCIAL_LINKS_BY_ORDER: Record<number, SocialLinkItem[]> = {
  1: president.socialLinks,
  2: vicePresident.socialLinks,
};

export function LeadershipSection() {
  const { translate, language } = useLanguage();

  const {
    data: activeLeaders,
    loading,
    error,
  } = useFirestoreList(leadershipService, ACTIVE_LEADERS_ORDERED);

  return (
    <section className="bg-surface-muted py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col gap-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            {translate("union.leadershipHeading")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            {translate("union.leadershipSubheading")}
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div
            role="status"
            className="flex min-h-[14rem] flex-col items-center justify-center gap-3"
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

        {/* Error state */}
        {!loading && error && (
          <div
            role="alert"
            className="flex min-h-[14rem] flex-col items-center justify-center gap-3 text-center"
          >
            <p className="text-sm font-medium text-foreground">
              {translate("union.leadershipErrorState")}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeLeaders.length > 0 ? (
              <div className="mx-auto grid w-full max-w-2xl gap-6 sm:grid-cols-2">
                {activeLeaders.map((leader) => {
                  const name =
                    language === "ar" ? leader.nameAr : leader.nameEn;

                  const position =
                    language === "ar"
                      ? leader.positionAr
                      : leader.positionEn;

                  return (
                    <LeaderCard
                      key={leader.id}
                      name={name}
                      position={position}
                      imageUrl={leader.imageUrl}
                      imageAlt={`${name}, ${position}`}
                      socialLinks={STATIC_SOCIAL_LINKS_BY_ORDER[leader.order]}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-foreground/60">
                {translate("union.leadershipEmptyState")}
              </p>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
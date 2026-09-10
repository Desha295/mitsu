"use client";

import { Loader2, Crown, ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { LeaderCard } from "@/components/shared/LeaderCard";
import {
  president,
  vicePresident,
  type SocialLinkItem,
} from "@/data/union";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { leadershipService } from "@/lib/firebase/services";
import type { LeadershipDoc } from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";

const ACTIVE_LEADERS_ORDERED: QueryOptions<LeadershipDoc> = {
  filters: [{ field: "isActive", op: "==", value: true }],
  orderByField: { field: "order", direction: "asc" },
};

const STATIC_SOCIAL_LINKS_BY_ORDER: Record<
  number,
  SocialLinkItem[]
> = {
  1: president.socialLinks,
  2: vicePresident.socialLinks,
};

export function LeadershipSection() {
  const { translate, language } = useLanguage();

  const {
    data: activeLeaders,
    loading,
    error,
  } = useFirestoreList(
    leadershipService,
    ACTIVE_LEADERS_ORDERED
  );

  return (
    <section className="relative overflow-hidden bg-surface-muted py-16 sm:py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
      />

      <Container className="relative">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
            <Crown
              className="h-4 w-4"
              aria-hidden="true"
            />
            <span>
              {translate("union.leadershipHeading")}
            </span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {translate("union.leadershipHeading")}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {translate("union.leadershipSubheading")}
          </p>
        </div>

        {loading ? (
          <div
            role="status"
            className="flex min-h-[20rem] flex-col items-center justify-center gap-4 rounded-3xl border border-border/70 bg-surface/70"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5">
              <Loader2
                className="h-7 w-7 animate-spin text-primary"
                aria-hidden="true"
              />
            </div>

            <p className="text-sm text-muted-foreground">
              {translate("common.loading")}
            </p>
          </div>
        ) : null}

        {!loading && error ? (
          <div
            role="alert"
            className="flex min-h-[20rem] flex-col items-center justify-center rounded-3xl border border-border/70 bg-surface/70 px-6 text-center"
          >
            <ShieldCheck
              className="mb-4 h-8 w-8 text-muted-foreground"
              aria-hidden="true"
            />

            <p className="text-sm font-medium text-foreground">
              {translate("union.leadershipErrorState")}
            </p>
          </div>
        ) : null}

        {!loading && !error ? (
          activeLeaders.length > 0 ? (
            <div className="mx-auto grid w-full max-w-4xl gap-6 sm:grid-cols-2">
              {activeLeaders.map((leader) => {
                const name =
                  language === "ar"
                    ? leader.nameAr
                    : leader.nameEn;

                const position =
                  language === "ar"
                    ? leader.positionAr
                    : leader.positionEn;

                return (
                  <div
                    key={leader.id}
                    className="group relative"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                    />

                    <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-surface/80 p-2 shadow-sm backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/25 group-hover:shadow-xl group-hover:shadow-primary/5">
                      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                      <LeaderCard
                        name={name}
                        position={position}
                        imageUrl={leader.imageUrl}
                        imageAlt={`${name}, ${position}`}
                        socialLinks={
                          STATIC_SOCIAL_LINKS_BY_ORDER[
                            leader.order
                          ]
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
              <p className="text-sm text-muted-foreground">
                {translate(
                  "union.leadershipEmptyState"
                )}
              </p>
            </div>
          )
        ) : null}
      </Container>
    </section>
  );
}
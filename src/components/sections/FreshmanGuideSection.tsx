"use client";

import { Loader2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { GuideCard } from "@/components/shared/GuideCard";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { guideService } from "@/lib/firebase/services";
import type { GuideSectionDoc } from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";

const ACTIVE_SECTIONS_ORDERED: QueryOptions<GuideSectionDoc> = {
  filters: [{ field: "isActive", op: "==", value: true }],
  orderByField: { field: "order", direction: "asc" },
};

export function FreshmanGuideSection() {
  const { translate, language } = useLanguage();

  const {
    data: sortedSections,
    loading,
    error,
  } = useFirestoreList(guideService, ACTIVE_SECTIONS_ORDERED);

  return (
    <section className="bg-background py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col gap-12">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            {translate("guide.heading")}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            {translate("guide.subheading")}
          </p>
        </div>

        {/* Loading state */}
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

        {/* Error state */}
        {!loading && error && (
          <div
            role="alert"
            className="flex min-h-[16rem] flex-col items-center justify-center gap-3 text-center"
          >
            <p className="text-sm font-medium text-foreground">
              {translate("guide.errorState")}
            </p>
          </div>
        )}

        {/* Step-by-step cards */}
        {!loading && !error && (
          <>
            {sortedSections.length > 0 ? (
              <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
                {sortedSections.map((section, index) => {
                  const title =
                    language === "ar"
                      ? section.titleAr
                      : section.titleEn;

                  const description =
                    language === "ar"
                      ? section.descriptionAr
                      : section.descriptionEn;

                  const facts = section.facts?.map((fact) =>
                    language === "ar" ? fact.ar : fact.en
                  );

                  return (
                    <GuideCard
                      key={section.id}
                      title={title}
                      description={description}
                      icon={section.icon}
                      facts={facts}
                      stats={section.stats}
                      highlight={section.highlight}
                      stepNumber={index + 1}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-foreground/60">
                {translate("guide.emptyState")}
              </p>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
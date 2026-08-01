"use client";

import { Loader2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { GuideCard } from "@/components/shared/GuideCard";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { guideService } from "@/lib/firebase/services";
import type { GuideSectionDoc } from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";

/**
 * Module-level constant (not recreated per render) so useFirestoreList's
 * effect dependency stays referentially stable — same convention as
 * Phases 4.0–4.4. Matches the deployed security rule for /guide
 * (`isActive == true`) and the project's established "order ascending"
 * convention for this list.
 */
const ACTIVE_SECTIONS_ORDERED: QueryOptions<GuideSectionDoc> = {
  filters: [{ field: "isActive", op: "==", value: true }],
  orderByField: { field: "order", direction: "asc" },
};

/**
 * Freshman Guide section (components/sections — large page section per
 * 07_COMPONENT_RULES.md §3.3). Renders a sequential list of numbered
 * GuideCard steps — a step-by-step onboarding feel per UI_GUIDELINES.md,
 * without long paragraphs (each card leads with a short description and
 * reveals detail on demand).
 *
 * Sprint 4 — Phase 4.5: sections now read live from Firestore via
 * guideService instead of src/data/guide.ts (left in place as historical
 * reference only). facts/stats/title/description are plain values in
 * GuideSectionDoc (no bilingual fields yet — future sprint per the
 * approved Sprint 4 plan), so they render as-is.
 */
export function FreshmanGuideSection() {
  const { translate } = useLanguage();
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
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
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
                {sortedSections.map((section, index) => (
                  <GuideCard
                    key={section.id}
                    title={section.title}
                    description={section.description}
                    icon={section.icon}
                    facts={section.facts}
                    stats={section.stats}
                    highlight={section.highlight}
                    stepNumber={index + 1}
                  />
                ))}
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

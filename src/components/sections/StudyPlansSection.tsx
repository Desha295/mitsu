"use client";

import { Container } from "@/components/layout/Container";
import { StudyPlanCard } from "@/components/shared/StudyPlanCard";
import { studyPlans } from "@/data/studyPlans";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * Study Plans section (components/sections — large page section per
 * 07_COMPONENT_RULES.md §3.3). Displays official study plan images as
 * reference documents only (UI_GUIDELINES.md: "Study Plans should be
 * displayed as official reference documents") — no extracted or
 * summarized content, just the images themselves via StudyPlanCard.
 *
 * SPRINT 4 — INTENTIONAL EXCEPTION (Phase 4.8, not migrated):
 * Every other public section was migrated to Firestore in Sprint 4.
 * This one deliberately was not, and stays on src/data/studyPlans.ts as
 * a live runtime source, not just historical reference.
 *
 * Reason: this section is an image gallery with a zoom viewer (each
 * item is a raster image with required intrinsic width/height for
 * next/image). Firestore's `documents` collection / documentsService
 * models something different in kind — generic downloadable PDF
 * resources (DocumentForm.tsx enforces `accept="application/pdf"` on
 * upload; there's no width/height anywhere in DocumentResourceDoc).
 * These are two different content models, not two representations of
 * the same data, so there's no reasonable field-level mapping the way
 * Systems/Committees/Leadership had for their missing presentational
 * fields — forcing one would mean either fabricating a correspondence
 * between unrelated items or redesigning this section's UI into a
 * document/download list, both of which were explicitly ruled out.
 *
 * To be revisited in a future sprint once the content model itself is
 * decided (e.g. adding image/dimension fields to the schema, or
 * deciding this section should become a PDF list backed by
 * documentsService as-is). Until then this has no Firestore dependency
 * and no loading/empty/error states, unlike every other Phase 4 section.
 */
export function StudyPlansSection() {
  const { translate } = useLanguage();

  const sortedPlans = [...studyPlans].sort((a, b) => a.order - b.order);

  return (
    <section className="bg-surface-muted py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col gap-12">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            {translate("studyPlans.heading")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            {translate("studyPlans.subheading")}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sortedPlans.map((plan) => (
            <StudyPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </Container>
    </section>
  );
}

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

"use client";

import { Container } from "@/components/layout/Container";
import { GuideCard } from "@/components/shared/GuideCard";
import { guideSections } from "@/data/guide";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * Freshman Guide section (components/sections — large page section per
 * 07_COMPONENT_RULES.md §3.3). Renders guideSections from data/guide.ts
 * as a sequential list of numbered GuideCard steps — a step-by-step
 * onboarding feel per UI_GUIDELINES.md, without long paragraphs (each
 * card leads with a short description and reveals detail on demand).
 */
export function FreshmanGuideSection() {
  const { translate } = useLanguage();

  const sortedSections = [...guideSections].sort((a, b) => a.order - b.order);

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

        {/* Step-by-step cards */}
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
          {sortedSections.map((section, index) => (
            <GuideCard key={section.id} section={section} stepNumber={index + 1} />
          ))}
        </div>
      </Container>
    </section>
  );
}

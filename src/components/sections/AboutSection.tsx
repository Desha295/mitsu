"use client";

import * as Icons from "lucide-react";
import { Container } from "@/components/layout/Container";
import { aboutContent, platformGoals } from "@/data/about";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * About section (components/sections). Renders the platform introduction
 * and the 8 core-value "Platform goals" as a card grid. Distinct from
 * VisionMissionSection, which handles Vision/Mission separately per the
 * Sprint 1.7 component list.
 */
export function AboutSection() {
  const { translate } = useLanguage();

  return (
    <section className="bg-gradient-to-b from-surface to-background py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col gap-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {translate(aboutContent.headingKey)}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-foreground/70">
            {translate(aboutContent.introductionKey)}
          </p>
          <p className="mt-5 text-base font-semibold text-primary">
            {translate(aboutContent.mottoKey)}
          </p>
        </div>

        <div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {translate(aboutContent.goalsHeadingKey)}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-foreground/70">
              {translate(aboutContent.goalsSubheadingKey)}
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {platformGoals.map((goal) => {
              const IconComponent = (
                Icons as unknown as Record<
                  string,
                  React.ComponentType<{ className?: string }>
                >
              )[goal.icon];

              return (
                <div
                  key={goal.id}
                  className="flex flex-col rounded-lg border border-border bg-surface p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
                    {IconComponent && (
                      <IconComponent className="h-5 w-5" aria-hidden="true" />
                    )}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {translate(goal.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm text-foreground/70">
                    {translate(goal.descriptionKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

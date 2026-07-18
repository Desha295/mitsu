"use client";

import { Eye, Target } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { aboutContent } from "@/data/about";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * Vision & Mission section (components/sections) for the MITSU platform
 * itself — visually consistent with UnionHeroSection's Vision/Mission
 * cards (Sprint 1.5), but sourced from about.ts (platform identity),
 * not union.ts (Student Union organization identity).
 */
export function VisionMissionSection() {
  const { translate } = useLanguage();

  return (
    <section className="bg-surface-muted py-12 sm:py-16 md:py-20">
      <Container className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col rounded-lg border border-border bg-surface p-6 shadow-sm">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
            <Eye className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            {translate(aboutContent.visionHeadingKey)}
          </h2>
          <p className="mt-2 text-sm text-foreground/70">
            {translate(aboutContent.visionKey)}
          </p>
        </div>

        <div className="flex flex-col rounded-lg border border-border bg-surface p-6 shadow-sm">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-secondary-light text-secondary-dark">
            <Target className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            {translate(aboutContent.missionHeadingKey)}
          </h2>
          <p className="mt-2 text-sm text-foreground/70">
            {translate(aboutContent.missionKey)}
          </p>
        </div>
      </Container>
    </section>
  );
}

"use client";

import Image from "next/image";
import { Eye, Target } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { unionOverview } from "@/data/union";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * Union Hero section (components/sections). Renders the Union's identity,
 * overview, hero image, and — per the page composition order in
 * Sprint 1.5 (Hero → Vision & Mission → Leadership → Committees → Social)
 * — the Vision and Mission cards directly beneath the hero.
 */
export function UnionHeroSection() {
  const { translate } = useLanguage();

  return (
    <section className="bg-gradient-to-b from-surface to-background py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col gap-12">
        {/* Identity + Overview + Hero Image */}
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-8">
          <div className="flex flex-col gap-5">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {translate(unionOverview.nameKey)}
            </h1>
            <p className="text-lg leading-relaxed text-foreground/70">
              {translate(unionOverview.overviewKey)}
            </p>
          </div>

          <div className="relative aspect-[2/1] w-full overflow-hidden rounded-lg border border-border shadow-sm">
            <Image
              src={unionOverview.heroImagePath}
              alt={translate(unionOverview.heroImageAltKey)}
              fill
              className="object-cover"
              // Local placeholder SVG — bypasses the image optimizer so it
              // always renders correctly regardless of SVG restrictions.
              unoptimized={unionOverview.heroImagePath.endsWith(".svg")}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col rounded-lg border border-border bg-surface p-6 shadow-sm">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-light text-primary">
              <Eye className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              {translate("union.visionHeading")}
            </h2>
            <p className="mt-2 text-sm text-foreground/70">
              {translate(unionOverview.visionKey)}
            </p>
          </div>

          <div className="flex flex-col rounded-lg border border-border bg-surface p-6 shadow-sm">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-secondary-light text-secondary-dark">
              <Target className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              {translate("union.missionHeading")}
            </h2>
            <p className="mt-2 text-sm text-foreground/70">
              {translate(unionOverview.missionKey)}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

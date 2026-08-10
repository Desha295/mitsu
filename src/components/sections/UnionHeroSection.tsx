"use client";

import Image from "next/image";
import { Eye, Target } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { unionOverview } from "@/data/union";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { useLanguage } from "@/hooks/useLanguage";
import { settingsService } from "@/lib/firebase/services";

/**
 * Union Hero section (components/sections). Renders the Union's identity,
 * overview, hero image, and — per the page composition order in
 * Sprint 1.5 (Hero → Vision & Mission → Leadership → Committees → Social)
 * — the Vision and Mission cards directly beneath the hero.
 *
 * Sprint 6.1: the hero image now prefers Settings' `unionLogoUrl` when
 * set, falling back to the original static placeholder exactly as
 * before this sprint when unset — reuses this existing image slot
 * rather than adding a new one, per "do not redesign any page".
 */
export function UnionHeroSection() {
  const { translate } = useLanguage();
  const { data: settings } = useFirestoreDoc(settingsService);

  const heroImageSrc = settings?.unionLogoUrl || unionOverview.heroImagePath;
  const usingSettingsImage = Boolean(settings?.unionLogoUrl);

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

          <div className="relative h-[520px] rounded-lg overflow-hidden border border-border shadow-sm bg-surface-muted">
            <Image
              src={heroImageSrc}
              alt={translate(unionOverview.heroImageAltKey)}
              fill
              className="object-contain p-4"
              // Settings-driven URLs are plain admin-entered values (not
              // a guaranteed Storage upload), so always unoptimized;
              // the local placeholder SVG needs the same treatment for
              // its own, unrelated reason (SVG restrictions).
              unoptimized={usingSettingsImage || heroImageSrc.endsWith(".svg")}
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

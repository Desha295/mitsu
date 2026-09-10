"use client";

import Image from "next/image";
import { Eye, Target, ArrowUpRight } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { unionOverview } from "@/data/union";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { useLanguage } from "@/hooks/useLanguage";
import { settingsService } from "@/lib/firebase/services";

export function UnionHeroSection() {
  const { translate } = useLanguage();
  const { data: settings } = useFirestoreDoc(settingsService);

  const heroImageSrc =
    settings?.unionLogoUrl || unionOverview.heroImagePath;

  const usingSettingsImage = Boolean(settings?.unionLogoUrl);

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-28">
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
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="flex flex-col">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {translate("union.heading")}
            </div>

            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {translate(unionOverview.nameKey)}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {translate(unionOverview.overviewKey)}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-surface/70 px-4 py-2.5 text-sm font-medium text-foreground backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {translate("union.visionHeading")}
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-surface/70 px-4 py-2.5 text-sm font-medium text-foreground backdrop-blur-xl">
                <span className="h-2 w-2 rounded-full bg-secondary" />
                {translate("union.missionHeading")}
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2.5rem] border border-primary/10"
            />

            <div
              aria-hidden="true"
              className="absolute -inset-1 rounded-[2.25rem] bg-gradient-to-br from-primary/15 via-transparent to-secondary/10 blur-xl"
            />

            <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-surface/80 p-3 shadow-2xl shadow-primary/5 backdrop-blur-xl">
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[1.5rem] border border-border/60 bg-surface-muted">
                <Image
                  src={heroImageSrc}
                  alt={translate(unionOverview.heroImageAltKey)}
                  fill
                  className="object-contain p-8 transition-transform duration-500 hover:scale-[1.025] sm:p-12"
                  unoptimized={
                    usingSettingsImage ||
                    heroImageSrc.endsWith(".svg")
                  }
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-primary/50"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-primary/50"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-primary/50"
                />

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-primary/50"
                />
              </div>
            </div>

            <div className="absolute -bottom-5 start-6 rounded-2xl border border-border/70 bg-surface/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:start-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ArrowUpRight
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                    MITSU
                  </p>

                  <p className="text-xs font-medium text-foreground">
                    {translate(unionOverview.nameKey)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:mt-24">
          <div className="group relative overflow-hidden rounded-3xl border border-border/70 bg-surface/80 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5 sm:p-7">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            />

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 text-primary transition-transform duration-300 group-hover:scale-105">
                <Eye
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                  MITSU
                </p>

                <h2 className="text-lg font-semibold text-foreground sm:text-xl">
                  {translate("union.visionHeading")}
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {translate(unionOverview.visionKey)}
                </p>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl border border-border/70 bg-surface/80 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5 sm:p-7">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent"
            />

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-secondary/20 bg-secondary/5 text-secondary-dark transition-transform duration-300 group-hover:scale-105">
                <Target
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-secondary-dark">
                  MITSU
                </p>

                <h2 className="text-lg font-semibold text-foreground sm:text-xl">
                  {translate("union.missionHeading")}
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {translate(unionOverview.missionKey)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

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
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {translate(unionOverview.nameKey)}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {translate(unionOverview.overviewKey)}
            </p>
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
      </Container>
    </section>
  );
}
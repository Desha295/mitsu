"use client";

import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { useFirestoreDoc } from "@/hooks/useFirestoreDoc";
import { useLanguage } from "@/hooks/useLanguage";
import { settingsService } from "@/lib/firebase/services";

export function CampusSection() {
  const { translate } = useLanguage();
  const { data: settings } = useFirestoreDoc(settingsService);

  if (!settings?.campusImageUrl) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-surface-muted py-16 sm:py-20 lg:py-24">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
      />

      <Container className="relative">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center gap-5 text-center sm:mb-12">
          {settings.universityLogoUrl ? (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface p-3 shadow-sm sm:h-20 sm:w-20">
              <Image
                src={settings.universityLogoUrl}
                alt={
                  settings.universityName ||
                  translate("home.campus.universityLogoAlt")
                }
                width={64}
                height={64}
                unoptimized
                className="h-full w-full object-contain"
              />
            </div>
          ) : null}

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {translate("home.campus.heading")}
            </h2>

            {settings.universityName ? (
              <p className="mt-3 text-base text-muted-foreground sm:text-lg">
                {settings.universityName}
              </p>
            ) : null}
          </div>
        </div>

        {/* Campus Image */}
        <div className="group relative mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[28px] border border-border/70 bg-surface p-2 shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.25)] sm:p-3">
            {/* Decorative corners */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-6 top-6 z-10 h-10 w-10 rounded-tl-xl border-l-2 border-t-2 border-primary/70 sm:left-8 sm:top-8"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-6 right-6 z-10 h-10 w-10 rounded-br-xl border-b-2 border-r-2 border-primary/70 sm:bottom-8 sm:right-8"
            />

            <div className="relative aspect-[16/8] overflow-hidden rounded-[20px] bg-muted">
              <Image
                src={settings.campusImageUrl}
                alt={
                  settings.universityName ||
                  translate("home.campus.imageAlt")
                }
                fill
                unoptimized
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                sizes="(max-width: 768px) 100vw, 1400px"
              />

              {/* Image overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
              />

              {/* University name on image */}
             
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

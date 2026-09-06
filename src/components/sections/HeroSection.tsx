"use client";

import Image from "next/image";
import Link from "next/link";
import { ImageOff, Loader2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/shared/Logo";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { heroService } from "@/lib/firebase/services";
import type { HeroDoc } from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";
import { cx, focusRing } from "@/lib/utils";

const ACTIVE_HERO: QueryOptions<HeroDoc> = {
  filters: [{ field: "isActive", op: "==", value: true }],
};

export function HeroSection() {
  const { translate, language } = useLanguage();

  const {
    data: heroDocs,
    loading,
    error,
  } = useFirestoreList(heroService, ACTIVE_HERO);

  const hero = heroDocs.find((doc) => doc.isActive) ?? heroDocs[0];

  if (loading) {
    return (
      <section className="relative bg-gradient-to-b from-surface to-background py-12 sm:py-16 md:py-20">
        <Container>
          <div
            role="status"
            className="flex min-h-[24rem] flex-col items-center justify-center gap-3"
          >
            <Loader2
              className="h-8 w-8 animate-spin text-primary"
              aria-hidden="true"
            />
            <p className="text-sm text-foreground/60">
              {translate("common.loading")}
            </p>
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative bg-gradient-to-b from-surface to-background py-12 sm:py-16 md:py-20">
        <Container>
          <div
            role="alert"
            className="flex min-h-[24rem] flex-col items-center justify-center gap-3 text-center"
          >
            <Logo showIdentity={false} />
            <p className="text-sm font-medium text-foreground">
              {translate("home.hero.error")}
            </p>
          </div>
        </Container>
      </section>
    );
  }

  if (!hero) {
    return (
      <section className="relative bg-gradient-to-b from-surface to-background py-12 sm:py-16 md:py-20">
        <Container>
          <div className="flex min-h-[24rem] flex-col items-center justify-center gap-3 text-center">
            <Logo showIdentity={true} />
            <p className="text-sm text-foreground/60">
              {translate("home.hero.empty")}
            </p>
          </div>
        </Container>
      </section>
    );
  }

  const heading = language === "ar" ? hero.headingAr : hero.headingEn;
  const description =
    language === "ar" ? hero.descriptionAr : hero.descriptionEn;
  const primaryCtaLabel =
    language === "ar"
      ? hero.primaryCtaLabelAr
      : hero.primaryCtaLabelEn;
  const secondaryCtaLabel =
    language === "ar"
      ? hero.secondaryCtaLabelAr
      : hero.secondaryCtaLabelEn;

   return (
    <section className="relative bg-gradient-to-b from-surface to-background py-10 sm:py-14 md:py-16">
      <Container className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
        {/* Left: Content */}
        <div className="flex flex-col gap-5">
          {/* Heading */}
          <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-[2.7rem]">
            {heading}
          </h1>

          {/* Description */}
          <p className="max-w-2xl text-base leading-7 text-foreground/70 sm:text-lg">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 pt-3 sm:flex-row">
            {/* Primary CTA */}
            <Link
              href={hero.primaryCtaHref || "#"}
              className={cx(
                "inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-primary-dark active:scale-95",
                focusRing
              )}
            >
              {primaryCtaLabel}
            </Link>

            {/* Secondary CTA */}
            <Link
              href={hero.secondaryCtaHref || "#"}
              className={cx(
                "inline-flex items-center justify-center rounded-lg border-2 border-primary px-6 py-3 text-base font-semibold text-primary transition-all duration-200 hover:bg-primary/10 active:scale-95",
                focusRing
              )}
            >
              {secondaryCtaLabel}
            </Link>
          </div>
        </div>

        {/* Right: Hero Image */}
        <div className="relative mx-auto h-[360px] w-full max-w-[420px] overflow-hidden rounded-xl bg-transparent sm:h-[400px] lg:h-[420px]">
          {hero.imageUrl ? (
            <Image
              src={hero.imageUrl}
              alt={translate("home.hero.imageAlt")}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 420px"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-foreground/40">
              <ImageOff className="h-8 w-8" aria-hidden="true" />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
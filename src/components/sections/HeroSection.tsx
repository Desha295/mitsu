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
    <section className="relative bg-gradient-to-b from-surface to-background py-12 sm:py-16 md:py-20">
      <Container className="grid gap-12 lg:grid-cols-2 lg:gap-8 lg:items-center">
        {/* Left: Content */}
        <div className="flex flex-col gap-6">
          {/* Logo & Branding */}
          <div>
            <Logo showIdentity={true} />
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            {heading}
          </h1>

          {/* Description */}
          <p className="text-lg text-foreground/70 leading-relaxed">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
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
        <div className="relative h-[520px] rounded-lg overflow-hidden border border-border shadow-sm bg-surface-muted">
          {hero.imageUrl ? (
            <Image
              src={hero.imageUrl}
              alt={translate("home.hero.imageAlt")}
              fill
              className="object-contain p-4"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
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
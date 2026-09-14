"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ImageOff,
  Loader2,
  Sparkles,
} from "lucide-react";

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
      <section className="relative min-h-[calc(100svh-6.5rem)] overflow-hidden bg-background py-16 sm:py-20 md:py-24">
        <Container>
          <div
            role="status"
            className="flex min-h-[24rem] flex-col items-center justify-center gap-3"
          >
            <Loader2
              className="h-8 w-8 animate-spin text-primary"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {translate("common.loading")}
            </p>
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative min-h-[calc(100svh-6.5rem)] overflow-hidden bg-background py-16 sm:py-20 md:py-24">
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
      <section className="relative min-h-[calc(100svh-6.5rem)] overflow-hidden bg-background py-16 sm:py-20 md:py-24">
        <Container>
          <div className="flex min-h-[24rem] flex-col items-center justify-center gap-3 text-center">
            <Logo showIdentity={true} />
            <p className="text-sm text-muted-foreground">
              {translate("home.hero.empty")}
            </p>
          </div>
        </Container>
      </section>
    );
  }

  const isArabic = language === "ar";

  const heading = isArabic ? hero.headingAr : hero.headingEn;

  const description = isArabic
    ? hero.descriptionAr
    : hero.descriptionEn;

  const primaryCtaLabel = isArabic
    ? hero.primaryCtaLabelAr
    : hero.primaryCtaLabelEn;

  const secondaryCtaLabel = isArabic
    ? hero.secondaryCtaLabelAr
    : hero.secondaryCtaLabelEn;

  return (
    <section className="relative min-h-[calc(100svh-6.5rem)] overflow-hidden bg-background">
      {/* Background atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -start-32 -top-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

        <div className="absolute -end-32 top-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.035] dark:opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <Container className="relative py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          {/* Content */}
          <div
            className={cx(
              "relative flex flex-col gap-6",
              isArabic ? "lg:order-2" : "lg:order-1"
            )}
          >
            {/* Identity badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-2 text-sm font-medium text-primary">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                <Sparkles
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </span>

              <span>
                {isArabic
                  ? "البوابة الرقمية لكلية تكنولوجيا المعلومات  "
                  : "Digital Gateway to Information Technology "}
              </span>
            </div>

            {/* Heading */}
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.025em] text-foreground sm:text-5xl lg:text-[3.65rem]">
              {heading}
            </h1>

            {/* Description */}
            <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {description}
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link
                href={hero.primaryCtaHref || "#"}
                className={cx(
                  "group inline-flex items-center justify-center gap-2",
                  "rounded-xl bg-primary px-6 py-3.5",
                  "text-base font-semibold text-primary-foreground",
                  "shadow-[0_8px_24px_rgba(0,0,0,0.10)]",
                  "transition-all duration-200",
                  "hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.14)]",
                  "active:translate-y-0",
                  focusRing
                )}
              >
                {primaryCtaLabel}

                {isArabic ? (
                  <ArrowLeft
                    className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                )}
              </Link>

              <Link
                href={hero.secondaryCtaHref || "#"}
                className={cx(
                  "inline-flex items-center justify-center gap-2",
                  "rounded-xl border border-border",
                  "bg-surface/70 px-6 py-3.5",
                  "text-base font-semibold text-foreground",
                  "shadow-sm backdrop-blur-sm",
                  "transition-all duration-200",
                  "hover:-translate-y-0.5 hover:border-primary/30",
                  "hover:bg-surface hover:shadow-md",
                  focusRing
                )}
              >
                {secondaryCtaLabel}
              </Link>
            </div>

            {/* Small identity line */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-2 text-xs font-medium text-muted-foreground">
              <span>
                {isArabic
                  ? "تعلم • تواصل • استكشف • شارك"
                  : "Learn • Connect • Explore • Lead"}
              </span>

              <span
                aria-hidden="true"
                className="hidden h-1 w-1 rounded-full bg-primary/50 sm:block"
              />

              <span>
                {isArabic
                  ? "بوابة طلاب IT"
                  : "IT Student Portal"}
              </span>
            </div>
          </div>

          {/* Visual */}
          <div
            className={cx(
              "relative",
              isArabic ? "lg:order-1" : "lg:order-2"
            )}
          >
            {/* Glow */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl"
            />

            {/* Visual frame */}
            <div className="relative mx-auto aspect-square w-full max-w-[500px]">
              <div className="absolute inset-5 rounded-[2.5rem] border border-primary/10 bg-primary/[0.035] rotate-3 transition-transform duration-500 hover:rotate-2" />

              <div className="absolute inset-2 rounded-[2.5rem] border border-border/70 bg-surface/70 shadow-[0_24px_70px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:shadow-[0_24px_70px_rgba(0,0,0,0.24)]" />

              {/* Corner accents */}
              <div
                aria-hidden="true"
                className="absolute start-7 top-7 z-20 h-10 w-10 rounded-tl-xl border-s-2 border-t-2 border-primary/50"
              />

              <div
                aria-hidden="true"
                className="absolute bottom-7 end-7 z-20 h-10 w-10 rounded-br-xl border-b-2 border-e-2 border-primary/50"
              />

              {/* Image */}
              <div className="absolute inset-6 overflow-hidden rounded-[2rem]">
                {hero.imageUrl ? (
                  <Image
                    src={hero.imageUrl}
                    alt={translate("home.hero.imageAlt")}
                    fill
                    className="object-contain p-5 transition-transform duration-500 hover:scale-[1.025]"
                    loading="eager"
                    fetchPriority="high"
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 500px"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                    <ImageOff
                      className="h-10 w-10"
                      aria-hidden="true"
                    />

                    <span className="text-sm">
                      {translate("home.hero.imageAlt")}
                    </span>
                  </div>
                )}
              </div>

              {/* Floating status card */}
              <div className="absolute bottom-5 start-0 z-30 hidden items-center gap-3 rounded-2xl border border-border/70 bg-surface/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:flex">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {isArabic
                      ? "بوابتك الرقمية"
                      : "Your Digital Portal"}
                  </p>

                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {isArabic
                      ? "كل ما تحتاجه في مكان واحد"
                      : "Everything in one place"}
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

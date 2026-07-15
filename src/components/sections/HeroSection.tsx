"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Logo } from "@/components/shared/Logo";
import { heroData } from "@/data/home";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

/**
 * Hero Section (components/sections — large page section per 07_COMPONENT_RULES.md §3.3).
 * Receives data through props indirectly via heroData import — no hardcoding.
 * Renders: MITSU branding, welcome heading, description, two CTA buttons, campus image.
 * Supports: responsive (mobile-first), dark mode, EN/AR, RTL/LTR, keyboard navigation.
 */
export function HeroSection() {
  const { translate } = useLanguage();

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
            {translate(heroData.headingKey)}
          </h1>

          {/* Description */}
          <p className="text-lg text-foreground/70 leading-relaxed">
            {translate(heroData.descriptionKey)}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {/* Primary CTA */}
            <Link
              href={heroData.primaryCtaHref || "#"}
              className={cx(
                "inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-primary-dark active:scale-95",
                focusRing
              )}
            >
              {translate(heroData.primaryCtaKey)}
            </Link>

            {/* Secondary CTA */}
            <Link
              href={heroData.secondaryCtaHref}
              className={cx(
                "inline-flex items-center justify-center rounded-lg border-2 border-primary px-6 py-3 text-base font-semibold text-primary transition-all duration-200 hover:bg-primary/10 active:scale-95",
                focusRing
              )}
            >
              {translate(heroData.secondaryCtaKey)}
            </Link>
          </div>
        </div>

        {/* Right: Hero Image */}
        <div className="relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden border border-border shadow-sm">
          <Image
            src={heroData.imagePath}
            alt={translate(heroData.imageAltKey)}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          />
        </div>
      </Container>
    </section>
  );
}

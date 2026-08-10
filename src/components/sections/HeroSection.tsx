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

/**
 * Module-level constant (not recreated per render) so useFirestoreList's
 * effect dependency stays referentially stable — same convention as
 * Phase 4.1's ACTIVE_ITEMS_ORDERED.
 *
 * Required, not optional: firestore.rules only allows public reads on
 * /hero where `resource.data.isActive == true`. A list query can't omit
 * this and still succeed for a signed-out visitor — Firestore rejects a
 * filter-less `list` outright rather than silently returning fewer
 * documents, since it can't verify every possible result satisfies the
 * rule without the constraint being part of the query itself.
 */
const ACTIVE_HERO: QueryOptions<HeroDoc> = {
  filters: [{ field: "isActive", op: "==", value: true }],
};

/**
 * Hero Section (components/sections — large page section per 07_COMPONENT_RULES.md §3.3).
 *
 * Sprint 4 — Phase 4.0: now reads its content live from Firestore via
 * heroService instead of src/data/home.ts. The static file is left in
 * place as historical reference only and is no longer imported here.
 *
 * "Current" hero selection intentionally mirrors the admin Hero page's
 * own logic (Sprint 3.2): the doc flagged `isActive`, or the first doc
 * if none is flagged, so the public site and the dashboard always agree
 * on which hero content is live. (In practice, once the isActive filter
 * below is applied, every returned doc already has isActive === true —
 * the fallback to heroDocs[0] only matters when nothing is active at
 * all, in which case the query returns no docs and the empty state
 * below is shown, same as before this fix.)
 *
 * Firestore's HeroDoc stores plain, single-language strings today (no
 * bilingual fields yet — that's a future sprint per the approved Sprint
 * 4 plan), so heading/description/CTA labels render as-is. Only the
 * surrounding UI chrome (loading/empty/error copy, image alt text)
 * still goes through translate(), since that text isn't part of the
 * Firestore document.
 *
 * Supports: responsive (mobile-first), dark mode, EN/AR, RTL/LTR, keyboard navigation.
 */
export function HeroSection() {
  const { translate } = useLanguage();
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
            {hero.heading}
          </h1>

          {/* Description */}
          <p className="text-lg text-foreground/70 leading-relaxed">
            {hero.description}
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
              {hero.primaryCtaLabel}
            </Link>

            {/* Secondary CTA */}
            <Link
              href={hero.secondaryCtaHref || "#"}
              className={cx(
                "inline-flex items-center justify-center rounded-lg border-2 border-primary px-6 py-3 text-base font-semibold text-primary transition-all duration-200 hover:bg-primary/10 active:scale-95",
                focusRing
              )}
            >
              {hero.secondaryCtaLabel}
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

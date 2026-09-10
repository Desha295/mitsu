"use client";

import { useEffect, useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { GuideCard } from "@/components/shared/GuideCard";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { guideService } from "@/lib/firebase/services";
import type { GuideSectionDoc } from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";

const ACTIVE_SECTIONS_ORDERED: QueryOptions<GuideSectionDoc> = {
  filters: [{ field: "isActive", op: "==", value: true }],
  orderByField: { field: "order", direction: "asc" },
};

export function FreshmanGuideSection() {
  const { translate, language } = useLanguage();

  const {
    data: sortedSections,
    loading,
    error,
  } = useFirestoreList(
    guideService,
    ACTIVE_SECTIONS_ORDERED
  );

  const [highlightedId, setHighlightedId] =
    useState<string | null>(null);

  useEffect(() => {
    if (loading || error || sortedSections.length === 0) {
      return;
    }

    const params = new URLSearchParams(
      window.location.search
    );

    const highlightId = params.get("highlight");

    if (!highlightId) {
      return;
    }

    const targetId = `guide-${highlightId}`;
    const target = document.getElementById(targetId);

    if (!target) {
      return;
    }

    setHighlightedId(highlightId);

    const scrollTimer = window.setTimeout(() => {
      target.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);

    const highlightTimer = window.setTimeout(() => {
      setHighlightedId(null);
    }, 4000);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(highlightTimer);
    };
  }, [loading, error, sortedSections]);

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 lg:py-28">
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
      />

      <Container className="relative">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            <BookOpen
              className="h-4 w-4"
              aria-hidden="true"
            />
            <span>{translate("guide.heading")}</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {translate("guide.heading")}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {translate("guide.subheading")}
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div
            role="status"
            className="flex min-h-[20rem] flex-col items-center justify-center gap-4 rounded-3xl border border-border/70 bg-surface/60"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5">
              <Loader2
                className="h-7 w-7 animate-spin text-primary"
                aria-hidden="true"
              />
            </div>

            <p className="text-sm text-muted-foreground">
              {translate("common.loading")}
            </p>
          </div>
        ) : null}

        {/* Error */}
        {!loading && error ? (
          <div
            role="alert"
            className="flex min-h-[20rem] flex-col items-center justify-center rounded-3xl border border-border/70 bg-surface/60 px-6 text-center"
          >
            <p className="text-sm font-medium text-foreground">
              {translate("guide.errorState")}
            </p>
          </div>
        ) : null}

        {/* Content */}
        {!loading && !error ? (
          sortedSections.length > 0 ? (
            <div className="relative mx-auto w-full max-w-4xl">
              {/* Timeline line */}
              <div
                aria-hidden="true"
                className="absolute start-5 top-8 bottom-8 hidden w-px bg-gradient-to-b from-primary/40 via-border to-transparent sm:block"
              />

              <div className="flex flex-col gap-6 sm:gap-7">
                {sortedSections.map((section, index) => {
                  const title =
                    language === "ar"
                      ? section.titleAr
                      : section.titleEn;

                  const description =
                    language === "ar"
                      ? section.descriptionAr
                      : section.descriptionEn;

                  const facts = section.facts?.map((fact) =>
                    language === "ar" ? fact.ar : fact.en
                  );

                  const stats = section.stats?.map((stat) => ({
                    label:
                      language === "ar"
                        ? stat.labelAr
                        : stat.labelEn,
                    value: stat.value,
                  }));

                  const isNotificationTarget =
                    highlightedId === section.id;

                  return (
                    <div
                      key={section.id}
                      className="relative sm:ps-14"
                    >
                      {/* Step marker */}
                      <div
                        aria-hidden="true"
                        className={[
                          "absolute start-0 top-7 hidden h-10 w-10",
                          "items-center justify-center rounded-xl",
                          "border border-primary/20 bg-background",
                          "text-xs font-bold text-primary shadow-sm sm:flex",
                          isNotificationTarget
                            ? "ring-4 ring-primary/10"
                            : "",
                        ].join(" ")}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <GuideCard
                        id={`guide-${section.id}`}
                        title={title}
                        description={description}
                        icon={section.icon}
                        facts={facts}
                        stats={stats}
                        highlight={section.highlight}
                        stepNumber={index + 1}
                        className={
                          isNotificationTarget
                            ? "relative z-10 scale-[1.01] ring-2 ring-primary ring-offset-4 ring-offset-background shadow-xl"
                            : undefined
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
              <p className="text-sm text-muted-foreground">
                {translate("guide.emptyState")}
              </p>
            </div>
          )
        ) : null}
      </Container>
    </section>
  );
}

"use client";

import { FileImage, Loader2 } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { StudyPlanCard } from "@/components/shared/StudyPlanCard";
import { studyPlans } from "@/data/studyPlans";
import { useLanguage } from "@/hooks/useLanguage";

export function StudyPlansSection() {
  const { translate } = useLanguage();

  const sortedPlans = [...studyPlans].sort(
    (a, b) => a.order - b.order
  );

  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-surface-muted py-16 sm:py-20 lg:py-28">
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
        className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
      />

      <Container className="relative">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
            <FileImage
              className="h-4 w-4"
              aria-hidden="true"
            />
            <span>{translate("studyPlans.heading")}</span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {translate("studyPlans.heading")}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {translate("studyPlans.subheading")}
          </p>
        </div>

        {/* Plans */}
        {sortedPlans.length > 0 ? (
          <div className="mx-auto grid w-full max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {sortedPlans.map((plan) => (
              <StudyPlanCard
                key={plan.id}
                plan={plan}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
            <Loader2
              className="mx-auto mb-3 h-6 w-6 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              {translate("common.loading")}
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}
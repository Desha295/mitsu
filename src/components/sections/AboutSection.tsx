"use client";

import * as Icons from "lucide-react";
import { ArrowDown, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { aboutContent, platformGoals } from "@/data/about";
import { useLanguage } from "@/hooks/useLanguage";

export function AboutSection() {
  const { translate, language } = useLanguage();
  const isArabic = language === "ar";

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -start-32 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -end-32 top-1/3 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <Container className="relative flex flex-col gap-20">
        {/* Hero */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3.5 py-2 text-xs font-bold tracking-wide text-primary">
            <Sparkles
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
            {isArabic ? "عن MITSU" : "ABOUT MITSU"}
          </div>

          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {translate(aboutContent.headingKey)}
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg sm:leading-9">
            {translate(aboutContent.introductionKey)}
          </p>

          <div className="mx-auto mt-8 flex max-w-2xl items-center justify-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/30" />

            <span className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-bold text-primary">
              {translate(aboutContent.mottoKey)}
            </span>

            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/30" />
          </div>

          <div className="mt-10 flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/80 text-muted-foreground shadow-sm">
              <ArrowDown
                className="h-4 w-4 animate-bounce"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Platform Goals */}
        <div>
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                {isArabic ? "ما الذي نقدمه؟" : "WHAT WE DO"}
              </div>

              <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl md:text-4xl">
                {translate(aboutContent.goalsHeadingKey)}
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-end">
              {translate(aboutContent.goalsSubheadingKey)}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {platformGoals.map((goal, index) => {
              const IconComponent = (
                Icons as unknown as Record<
                  string,
                  React.ComponentType<{
                    className?: string;
                  }>
                >
              )[goal.icon];

              return (
                <article
                  key={goal.id}
                  className={[
                    "group relative overflow-hidden rounded-[1.6rem]",
                    "border border-border/70 bg-surface/75 p-6",
                    "backdrop-blur-xl shadow-sm",
                    "transition-all duration-300",
                    "hover:-translate-y-1.5 hover:border-primary/20",
                    "hover:shadow-xl hover:shadow-primary/5",
                  ].join(" ")}
                >
                  {/* Number */}
                  <span className="absolute end-5 top-5 text-[11px] font-black tracking-widest text-muted-foreground/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Glow */}
                  <div
                    aria-hidden="true"
                    className="absolute -end-10 -top-10 h-28 w-28 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/10">
                      {IconComponent ? (
                        <IconComponent
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      ) : null}
                    </div>

                    <h3 className="mt-5 text-base font-bold leading-6 text-foreground">
                      {translate(goal.titleKey)}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {translate(goal.descriptionKey)}
                    </p>
                  </div>

                  <div
                    aria-hidden="true"
                    className="absolute inset-x-6 bottom-0 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-primary/60 to-transparent transition-transform duration-300 group-hover:scale-x-100"
                  />
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
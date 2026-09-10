"use client";

import { Eye, Target, ArrowUpRight, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { aboutContent } from "@/data/about";
import { useLanguage } from "@/hooks/useLanguage";

export function VisionMissionSection() {
  const { translate, language } = useLanguage();
  const isArabic = language === "ar";

  const items = [
    {
      icon: Eye,
      title: translate(aboutContent.visionHeadingKey),
      description: translate(aboutContent.visionKey),
      label: isArabic ? "رؤيتنا" : "OUR VISION",
      type: "vision",
    },
    {
      icon: Target,
      title: translate(aboutContent.missionHeadingKey),
      description: translate(aboutContent.missionKey),
      label: isArabic ? "رسالتنا" : "OUR MISSION",
      type: "mission",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -start-40 top-24 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-40 bottom-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
      />

      {/* Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      <Container className="relative">
        {/* Section Header */}
        <div className="mx-auto mb-10 max-w-3xl sm:mb-14">
          <div
            className={`mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary ${
              isArabic ? "justify-end" : ""
            }`}
          >
            <span className="h-px w-8 bg-primary/50" />
            <span>
              {isArabic
                ? "إلى أين نتجه؟"
                : "WHERE WE ARE HEADING"}
            </span>
          </div>

          <div
            className={`flex flex-col gap-5 md:flex-row md:items-end md:justify-between ${
              isArabic ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className={isArabic ? "text-end" : "text-start"}>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Eye
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
                <span>
                  {isArabic
                    ? "رؤية ورسالة MITSU"
                    : "MITSU Vision & Mission"}
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {isArabic
                  ? "رؤية ورسالة MITSU"
                  : "MITSU Vision & Mission"}
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {isArabic
                  ? "التوجه الذي يشكل مستقبل MITSU ويحدد ما نسعى إلى تحقيقه."
                  : "The direction that shapes MITSU’s future and defines what we strive to achieve."}
              </p>
            </div>

            <div className="hidden shrink-0 rounded-2xl border border-border bg-surface/70 px-4 py-3 shadow-sm backdrop-blur-xl md:block">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <Sparkles
                  className="h-4 w-4 text-primary"
                  aria-hidden="true"
                />
                <span>
                  {isArabic
                    ? "رؤية ورسالة واحدة"
                    : "One Vision. One Mission."}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 md:hidden">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span>
                {isArabic
                  ? "رؤية ورسالة واحدة"
                  : "One Vision. One Mission."}
              </span>
            </div>
          </div>
        </div>

        {/* Vision + Mission */}
        <div className="grid gap-6 lg:grid-cols-2">
          {items.map((item, index) => {
            const Icon = item.icon;

            return (
              <article
                key={item.type}
                className="group relative flex min-h-[24rem] flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Accent */}
                <div className="h-1 w-full bg-primary" />

                {/* Decorative number */}
                <span
                  aria-hidden="true"
                  className="absolute end-6 top-7 text-7xl font-black leading-none text-foreground/[0.035] sm:text-8xl"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Hover glow */}
                <div
                  aria-hidden="true"
                  className="absolute -end-20 -top-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />

                <div className="relative flex flex-1 flex-col p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                      <Icon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </div>

                    <ArrowUpRight
                      className="h-5 w-5 text-muted-foreground/40 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="mt-auto pt-12">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                      {item.label}
                    </span>

                    <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {item.title}
                    </h3>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom hover line */}
                  <div
                    aria-hidden="true"
                    className="mt-6 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
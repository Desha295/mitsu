"use client";

import { Eye, Target, ArrowUpRight } from "lucide-react";

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
    <section className="relative overflow-hidden bg-surface-muted py-16 sm:py-20 md:py-24">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute start-1/4 top-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 end-1/4 h-64 w-64 rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <Container className="relative">
        {/* Section heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
            {isArabic
              ? "إلى أين نتجه؟"
              : "WHERE WE ARE HEADING"}
          </span>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            {isArabic
              ? "رؤية ورسالة MITSU"
              : "MITSU Vision & Mission"}
          </h2>
        </div>

        {/* Vision + Mission */}
        <div className="grid gap-5 lg:grid-cols-2">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.type}
                className="group relative min-h-[300px] overflow-hidden rounded-[2rem] border border-border/70 bg-surface/80 p-7 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl sm:p-9"
              >
                {/* Decorative number */}
                <span className="absolute end-7 top-6 text-6xl font-black leading-none text-foreground/[0.035] sm:text-7xl">
                  {item.type === "vision" ? "01" : "02"}
                </span>

                {/* Glow */}
                <div
                  aria-hidden="true"
                  className="absolute -end-16 -top-16 h-44 w-44 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />

                <div className="relative flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary transition-transform duration-300 group-hover:scale-105">
                      <Icon
                        className="h-6 w-6"
                        aria-hidden="true"
                      />
                    </div>

                    <ArrowUpRight
                      className="h-5 w-5 text-muted-foreground/40 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </div>

                  <div className="mt-auto pt-12">
                    <span className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                      {item.label}
                    </span>

                    <h3 className="mt-2 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                      {item.title}
                    </h3>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className="absolute inset-x-8 bottom-0 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-primary/60 to-transparent transition-transform duration-500 group-hover:scale-x-100"
                />
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

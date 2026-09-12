"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Layers3,
  Trophy,
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

const LEVELS = [
  {
    number: "01",
    icon: GraduationCap,
    href: "/student-groups/level-1",
    titleAr: "الفرقة الأولى",
    titleEn: "Level 1",
    descriptionAr:
      "جروبات ومجتمعات طلاب الفرقة الأولى",
    descriptionEn:
      "Student groups and communities for Level 1",
  },
  {
    number: "02",
    icon: BookOpen,
    href: "/student-groups/level-2",
    titleAr: "الفرقة الثانية",
    titleEn: "Level 2",
    descriptionAr:
      "جروبات ومجتمعات طلاب الفرقة الثانية",
    descriptionEn:
      "Student groups and communities for Level 2",
  },
  {
    number: "03",
    icon: Layers3,
    href: "/student-groups/level-3",
    titleAr: "الفرقة الثالثة",
    titleEn: "Level 3",
    descriptionAr:
      "جروبات ومجتمعات طلاب الفرقة الثالثة",
    descriptionEn:
      "Student groups and communities for Level 3",
  },
  {
    number: "04",
    icon: Trophy,
    href: "/student-groups/level-4",
    titleAr: "الفرقة الرابعة",
    titleEn: "Level 4",
    descriptionAr:
      "جروبات ومجتمعات طلاب الفرقة الرابعة",
    descriptionEn:
      "Student groups and communities for Level 4",
  },
];

export default function StudentGroupsPage() {
  const { language } = useLanguage();

  const isArabic = language === "ar";

  return (
    <main>
      <section className="relative min-h-[calc(100vh-6rem)] overflow-hidden bg-background py-16 sm:py-20 lg:py-28">
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
          className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 bottom-10 h-[28rem] w-[28rem] rounded-full bg-primary/5 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/[0.025] blur-3xl"
        />

        <Container className="relative">
          {/* Header */}
          <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              <GraduationCap
                className="h-4 w-4"
                aria-hidden="true"
              />

              <span>
                {isArabic
                  ? "جروبات الطلاب"
                  : "Student Groups"}
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {isArabic
                ? "جروبات الطلاب"
                : "Student Groups"}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {isArabic
                ? "الوصول إلى جروبات الطلاب الرسمية بسهولة، مرتبة حسب الفرقة الدراسية."
                : "Find official student groups easily, organized by academic level."}
            </p>
          </div>

          {/* Levels */}
          <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">
            {LEVELS.map((level) => {
              const Icon = level.icon;

              return (
                <Link
                  key={level.number}
                  href={level.href}
                  className={cx(
                    "group relative min-h-[18rem] overflow-hidden rounded-[2rem]",
                    "border border-border/70",
                    "bg-surface/70 backdrop-blur-xl",
                    "shadow-lg shadow-primary/[0.03]",
                    "transition-all duration-500",
                    "hover:-translate-y-1",
                    "hover:border-primary/30",
                    "hover:shadow-2xl hover:shadow-primary/10",
                    focusRing
                  )}
                >
                  {/* Card glow */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />

                  {/* Giant level number */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-10 -end-2 select-none text-[11rem] font-black leading-none tracking-tighter text-primary/[0.045] transition-all duration-500 group-hover:text-primary/[0.08] sm:text-[13rem]"
                  >
                    {level.number}
                  </div>

                  {/* Decorative lines */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-70"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-0 h-24 w-px bg-gradient-to-b from-primary/40 to-transparent"
                  />

                  {/* Content */}
                  <div className="relative flex h-full min-h-[18rem] flex-col justify-between p-7 sm:p-9">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/5 text-primary transition-all duration-500 group-hover:scale-105 group-hover:bg-primary/10">
                        <Icon
                          className="h-7 w-7"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-background/60 text-muted-foreground transition-all duration-500 group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary">
                        <ArrowUpRight
                          className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    <div className="mt-10">
                      <div className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                        {level.number} ·{" "}
                        {isArabic ? "الفرقة الدراسية" : "Academic Level"}
                      </div>

                      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {isArabic
                          ? level.titleAr
                          : level.titleEn}
                      </h2>

                      <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
                        {isArabic
                          ? level.descriptionAr
                          : level.descriptionEn}
                      </p>
                    </div>

                    <div className="mt-7 flex items-center gap-2 text-sm font-semibold text-primary">
                      <span>
                        {isArabic
                          ? "عرض الجروبات"
                          : "View Groups"}
                      </span>

                      <ArrowUpRight
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>
    </main>
  );
}
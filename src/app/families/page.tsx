"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  UsersRound,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { familiesService } from "@/lib/firebase/services";
import type { FamilyDoc } from "@/lib/firebase/collections";

export default function FamiliesPage() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const { data: allFamilies, loading } = useFirestoreList<FamilyDoc>(
    familiesService,
    {
      orderByField: {
        field: "order",
        direction: "asc",
      },
    }
  );

  const families = allFamilies.filter((family) => family.isActive);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -start-40 top-24 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -end-40 bottom-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
        />

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
          <div className="mx-auto max-w-3xl">
            <div
              className={`mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary ${
                isArabic ? "justify-end" : ""
              }`}
            >
              <span className="h-px w-8 bg-primary/50" />
              <span>{isArabic ? "الحياة الطلابية" : "Student Life"}</span>
            </div>

            <div
              className={`flex flex-col gap-5 md:flex-row md:items-end md:justify-between ${
                isArabic ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className={isArabic ? "text-end" : "text-start"}>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <UsersRound className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {isArabic ? "مجتمع الطلاب" : "Student Community"}
                  </span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  {isArabic ? "الأسر الطلابية" : "Student Families"}
                </h1>

                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {isArabic
                    ? "اكتشف الأسر الطلابية، أنشطتها، والفرص التي تتيحها للطلاب لبناء مجتمع جامعي أكثر تفاعلًا."
                    : "Discover student families, their activities, and the opportunities they offer to build a more connected campus community."}
                </p>
              </div>

              <div className="hidden shrink-0 rounded-2xl border border-border bg-surface/70 px-4 py-3 shadow-sm backdrop-blur-xl md:block">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <Sparkles
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                  <span>
                    {families.length}{" "}
                    {isArabic ? "أسر متاحة" : "Families Available"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 md:hidden">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>
                  {families.length}{" "}
                  {isArabic ? "أسر متاحة" : "Families Available"}
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Families */}
      <section className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -start-40 top-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
        />

        <Container className="relative">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="min-h-[30rem] animate-pulse rounded-3xl border border-border bg-surface/50 shadow-sm"
                />
              ))}
            </div>
          ) : families.length === 0 ? (
            <div className="mx-auto flex min-h-[18rem] max-w-2xl flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/50 px-6 py-12 text-center shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                <UsersRound className="h-8 w-8" aria-hidden="true" />
              </div>

              <h2 className="mt-5 text-xl font-bold tracking-tight text-foreground">
                {isArabic
                  ? "لا توجد أسر طلابية متاحة حاليًا"
                  : "No student families available"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {isArabic
                  ? "سيتم إضافة الأسر الطلابية قريبًا."
                  : "Student families will be added soon."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {families.map((family) => {
                const name = isArabic ? family.nameAr : family.nameEn;
                const secondaryName = isArabic
                  ? family.nameEn
                  : family.nameAr;
                const description = isArabic
                  ? family.descriptionAr
                  : family.descriptionEn;

                return (
                  <article
                    key={family.id}
                    className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="h-1 w-full bg-primary" />

                    {/* Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted">
                      {family.imageUrl ? (
                        <>
                          <img
                            src={family.imageUrl}
                            alt={name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          />

                          <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                          />
                        </>
                      ) : (
                        <div className="relative flex h-full items-center justify-center bg-primary-light">
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"
                          />

                          <UsersRound
                            className="relative h-16 w-16 text-primary/20 transition-transform duration-300 group-hover:scale-110"
                            aria-hidden="true"
                          />
                        </div>
                      )}

                      <div className="absolute start-4 top-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm backdrop-blur">
                          <UsersRound
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                          {isArabic ? "أسرة طلابية" : "Student Family"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                          <UsersRound
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h2 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary sm:text-xl">
                            {name}
                          </h2>

                          <p className="mt-1 line-clamp-1 text-xs leading-5 text-muted-foreground">
                            {secondaryName}
                          </p>
                        </div>

                        <ArrowUpRight
                          className="mt-1 h-4 w-4 shrink-0 text-primary/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                          aria-hidden="true"
                        />
                      </div>

                      <p className="mt-4 line-clamp-4 flex-1 text-sm leading-6 text-muted-foreground">
                        {description}
                      </p>

                      <div className="mt-6 border-t border-border pt-5">
                        <Link
                          href={`/families/${family.id}`}
                          className="group/link inline-flex w-full items-center justify-between rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-dark hover:shadow-md"
                        >
                          <span>
                            {isArabic ? "عرض الأسرة" : "View Family"}
                          </span>

                          {isArabic ? (
                            <ArrowLeft
                              className="h-4 w-4 transition-transform duration-200 group-hover/link:-translate-x-1"
                              aria-hidden="true"
                            />
                          ) : (
                            <ArrowRight
                              className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-1"
                              aria-hidden="true"
                            />
                          )}
                        </Link>
                      </div>

                      <div className="mt-6 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full" />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}

"use client";

import { Loader2 } from "lucide-react";

import { Container } from "@/components/layout/Container";
import { QuickAccessCard } from "@/components/shared/QuickAccessCard";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { homepageService } from "@/lib/firebase/services";
import type { QuickAccessItemDoc } from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";
import { cx } from "@/lib/utils";

const ACTIVE_ITEMS_ORDERED: QueryOptions<QuickAccessItemDoc> = {
  filters: [{ field: "isActive", op: "==", value: true }],
  orderByField: { field: "order", direction: "asc" },
};

export function QuickAccessSection() {
  const { translate, language } = useLanguage();

  const {
    data: items,
    loading,
    error,
  } = useFirestoreList(homepageService, ACTIVE_ITEMS_ORDERED);

  const isArabic = language === "ar";

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -start-32 top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -end-32 bottom-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Container className="relative">
        <div
          className={cx(
            "mb-10 flex flex-col gap-4 sm:mb-12",
            isArabic ? "text-right" : "text-left"
          )}
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {isArabic ? "استكشف" : "Explore"}
            </span>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
            <div>
              <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {translate("home.quickAccess.heading")}
              </h2>

              <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {translate("home.quickAccess.subheading")}
              </p>
            </div>

            <div className="hidden shrink-0 rounded-full border border-border bg-surface/70 px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm md:block">
              {isArabic
                ? "كل ما تحتاجه في مكان واحد"
                : "Everything you need in one place"}
            </div>
          </div>
        </div>

        {loading && (
          <div
            role="status"
            className="flex min-h-[16rem] flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-surface/50"
          >
            <Loader2
              className="h-8 w-8 animate-spin text-primary"
              aria-hidden="true"
            />

            <p className="text-sm text-muted-foreground">
              {translate("common.loading")}
            </p>
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            className="flex min-h-[16rem] items-center justify-center rounded-3xl border border-border bg-surface/50 px-6 text-center"
          >
            <p className="text-sm font-medium text-foreground">
              {translate("home.quickAccess.error")}
            </p>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="flex min-h-[16rem] items-center justify-center rounded-3xl border border-border bg-surface/50 px-6 text-center">
            <p className="text-sm text-muted-foreground">
              {translate("home.quickAccess.empty")}
            </p>
          </div>
        )}

        {/* Quick Access Grid */}
        {!loading && !error && items.length > 0 && (
          <div className="flex flex-wrap justify-center gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="w-full min-w-0 sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)]"
              >
                <QuickAccessCard
                  title={
                    language === "ar"
                      ? item.titleAr
                      : item.titleEn
                  }
                  description={
                    language === "ar"
                      ? item.descriptionAr
                      : item.descriptionEn
                  }
                  href={item.href}
                  iconName={item.icon}
                />
              </div>
            ))}
          </div>
        )}

        
      </Container>
    </section>
  );
}
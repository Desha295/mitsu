"use client";

import { Loader2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { QuickAccessCard } from "@/components/shared/QuickAccessCard";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { homepageService } from "@/lib/firebase/services";
import type { QuickAccessItemDoc } from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";

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

  return (
    <section className="bg-background py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col gap-12">
        {/* Section heading */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            {translate("home.quickAccess.heading")}
          </h2>

          <p className="mt-4 text-lg text-foreground/70">
            {translate("home.quickAccess.subheading")}
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div
            role="status"
            className="flex min-h-[12rem] flex-col items-center justify-center gap-3"
          >
            <Loader2
              className="h-8 w-8 animate-spin text-primary"
              aria-hidden="true"
            />

            <p className="text-sm text-foreground/60">
              {translate("common.loading")}
            </p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div
            role="alert"
            className="flex min-h-[12rem] flex-col items-center justify-center gap-3 text-center"
          >
            <p className="text-sm font-medium text-foreground">
              {translate("home.quickAccess.error")}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && items.length === 0 && (
          <div className="flex min-h-[12rem] flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-foreground/60">
              {translate("home.quickAccess.empty")}
            </p>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && items.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6">
            {items.map((item) => {
              const title =
                language === "ar" ? item.titleAr : item.titleEn;

              const description =
                language === "ar"
                  ? item.descriptionAr
                  : item.descriptionEn;

              return (
                <div
                  key={item.id}
                  className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <QuickAccessCard
                    title={title}
                    description={description}
                    href={item.href}
                    iconName={item.icon}
                  />
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
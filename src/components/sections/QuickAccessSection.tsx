"use client";

import { Loader2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { QuickAccessCard } from "@/components/shared/QuickAccessCard";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { homepageService } from "@/lib/firebase/services";
import type { QuickAccessItemDoc } from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";

/**
 * Module-level constant (not recreated per render) so useFirestoreList's
 * effect dependency stays referentially stable — matches the same
 * "stable service/options reference" assumption documented on the hook.
 * Mirrors the public read rule for /homepage (`isActive == true`) and
 * the project's established "order ascending" convention for this list.
 */
const ACTIVE_ITEMS_ORDERED: QueryOptions<QuickAccessItemDoc> = {
  filters: [{ field: "isActive", op: "==", value: true }],
  orderByField: { field: "order", direction: "asc" },
};

/**
 * Quick Access Section (components/sections — large page section per 07_COMPONENT_RULES.md §3.3).
 *
 * Sprint 4 — Phase 4.1: cards now read live from Firestore via
 * homepageService instead of src/data/home.ts's quickAccessItems. The
 * static file is left in place as historical reference only and is no
 * longer imported here.
 *
 * The section heading/subheading are static UI chrome (not Firestore
 * content), so they stay visible via translate() at all times; only the
 * cards grid — the actual Firestore-backed content — has loading/empty/
 * error states, following the same principle established in Phase 4.0
 * (chrome vs. data separated; only the data-dependent part reacts to
 * fetch state).
 *
 * Supports: responsive grid (mobile: 1 col, tablet: 2 cols, desktop: 3 cols), dark mode, EN/AR.
 */
export function QuickAccessSection() {
  const { translate } = useLanguage();
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
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
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

        {/* Cards Grid */}
        {!loading && !error && items.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <QuickAccessCard
                key={item.id}
                title={item.title}
                description={item.description}
                href={item.href}
                iconName={item.icon}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

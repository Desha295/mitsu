"use client";

import { Loader2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SystemCard } from "@/components/shared/SystemCard";
import { systems, PASSWORD_RESET_URL } from "@/data/systems";
import type { SystemCategory } from "@/types/system.types";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { systemsService } from "@/lib/firebase/services";
import type { SystemDoc } from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";
import { cx, focusRing } from "@/lib/utils";

/**
 * Module-level constant (not recreated per render) so useFirestoreList's
 * effect dependency stays referentially stable — same convention as
 * Phases 4.0–4.3. Matches the deployed security rule for /systems
 * (`isActive == true`) and the project's established "order ascending"
 * convention for this list.
 *
 * Exported (Sprint 4.4 cleanup) so Footer.tsx's University Systems
 * column can reuse this exact query instead of duplicating it — Footer
 * independently listed active systems from the same static data this
 * section used to read from, and needed the same fix once this section
 * moved to Firestore.
 */
export const ACTIVE_SYSTEMS_ORDERED: QueryOptions<SystemDoc> = {
  filters: [{ field: "isActive", op: "==", value: true }],
  orderByField: { field: "order", direction: "asc" },
};

/**
 * TEMPORARY Sprint 4 compatibility shim — not a permanent pattern.
 *
 * `category` and `required` are presentation-only fields that don't
 * exist in Firestore's SystemDoc (confirmed against collections.ts and
 * SystemForm.tsx — this isn't a missing type, the data genuinely isn't
 * there). Per your direction, the current UI must not lose these two
 * elements during Sprint 4, so they're temporarily still sourced from
 * the static seed data in src/data/systems.ts, joined to each Firestore
 * doc by `order` — the only field both models share that's expected to
 * stay in sync across them (Firestore docs don't carry the static
 * "banner"/"teams"/etc. slugs as their document ID, so `order` is the
 * only reliable join key available without inventing one).
 *
 * A Firestore system whose `order` doesn't match any static entry (e.g.
 * a genuinely new system added only in the dashboard) simply renders
 * without a category label or Required badge — graceful, not guessed.
 *
 * To be migrated properly into Firestore in a future content-model
 * revision, once the rest of the public site is on Firebase.
 */
const STATIC_PRESENTATION_BY_ORDER: Record<
  number,
  { category: SystemCategory; required: boolean }
> = Object.fromEntries(
  systems.map((system) => [
    system.order,
    { category: system.category, required: system.required },
  ])
);

/**
 * University Systems section (components/sections — large page section
 * per 07_COMPONENT_RULES.md §3.3).
 *
 * Sprint 4 — Phase 4.4: name/description/instructions/officialUrl/icon/
 * order/isActive now come live from Firestore via systemsService instead
 * of src/data/systems.ts's `systems` array (left in place as historical
 * reference, and as the temporary source for category/required — see
 * STATIC_PRESENTATION_BY_ORDER above). PASSWORD_RESET_URL has no
 * Firestore field anywhere (checked SettingsDoc too) and stays sourced
 * from the same static file, unchanged.
 */
export function SystemsSection() {
  const { translate } = useLanguage();
  const {
    data: activeSystems,
    loading,
    error,
  } = useFirestoreList(systemsService, ACTIVE_SYSTEMS_ORDERED);

  return (
    <section className="bg-background py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col gap-12">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {translate("systems.heading")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            {translate("systems.subheading")}
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div
            role="status"
            className="flex min-h-[16rem] flex-col items-center justify-center gap-3"
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
            className="flex min-h-[16rem] flex-col items-center justify-center gap-3 text-center"
          >
            <p className="text-sm font-medium text-foreground">
              {translate("systems.errorState")}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeSystems.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {activeSystems.map((system) => {
                  const presentation = STATIC_PRESENTATION_BY_ORDER[system.order];
                  return (
                    <SystemCard
                      key={system.id}
                      name={system.name}
                      description={system.description}
                      officialUrl={system.officialUrl}
                      icon={system.icon}
                      instructions={system.instructions}
                      category={presentation?.category}
                      required={presentation?.required}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-foreground/60">
                {translate("systems.emptyState")}
              </p>
            )}

            {/* Password reset note — relevant to Teams/Outlook/MUSTER accounts */}
            <p className="text-center text-sm text-foreground/60">
              {translate("systems.passwordReset.label")}{" "}
              <a
                href={PASSWORD_RESET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cx(
                  "rounded-sm font-medium text-primary underline-offset-2 hover:underline",
                  focusRing
                )}
              >
                {translate("systems.passwordReset.linkText")}
              </a>
            </p>
          </>
        )}
      </Container>
    </section>
  );
}

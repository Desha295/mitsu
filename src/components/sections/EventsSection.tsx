"use client";

import { Loader2 } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { EventCard } from "@/components/shared/EventCard";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { eventsService } from "@/lib/firebase/services";
import type { EventDoc } from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";
import { timestampToDate } from "@/lib/firebase/query-helpers";
import type { WithId } from "@/lib/firebase/services";

/**
 * Module-level constant (not recreated per render) so useFirestoreList's
 * effect dependency stays referentially stable — same convention as
 * Phases 4.0–4.2. Matches the deployed security rule for /events
 * (`isPublished == true`) and the project's existing "soonest first"
 * sort (previously a client-side sort on the static array; the query
 * now does this ordering itself).
 */
const PUBLISHED_SOONEST_FIRST: QueryOptions<EventDoc> = {
  filters: [{ field: "isPublished", op: "==", value: true }],
  orderByField: { field: "date", direction: "asc" },
};

/** Firestore's date is a Timestamp; EventCard takes a plain ISO string
 * (kept Firestore-agnostic), so this converts it once here. */
function toDateIso(doc: WithId<EventDoc>): string {
  return (timestampToDate(doc.date) ?? new Date(0)).toISOString();
}

/**
 * Events section (components/sections). Renders events sorted
 * soonest-first, via the reusable EventCard component.
 *
 * Sprint 4 — Phase 4.3: the list now reads live from Firestore via
 * eventsService instead of src/data/announcements.ts's `events` export
 * (left in place as historical reference only). The query is already
 * ordered soonest-first, so no client-side re-sort is needed.
 *
 * No date-based "only future events" filtering is added here — the
 * original section never filtered by date either (it only ever sorted
 * ascending), so this preserves that exact behavior rather than
 * introducing new business logic.
 */
export function EventsSection() {
  const { translate } = useLanguage();
  const {
    data: items,
    loading,
    error,
  } = useFirestoreList(eventsService, PUBLISHED_SOONEST_FIRST);

  return (
    <section className="bg-surface-muted py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            {translate("events.upcomingHeading")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            {translate("events.subheading")}
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
              {translate("events.errorState")}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {items.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((event) => (
                  <EventCard
                    key={event.id}
                    title={event.title}
                    description={event.description}
                    category={event.category}
                    dateIso={toDateIso(event)}
                    location={event.location}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-foreground/60">
                {translate("events.emptyState")}
              </p>
            )}
          </>
        )}
      </Container>
    </section>
  );
}

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

const PUBLISHED_SOONEST_FIRST: QueryOptions<EventDoc> = {
  filters: [{ field: "isPublished", op: "==", value: true }],
  orderByField: { field: "date", direction: "asc" },
};

function toDateIso(doc: WithId<EventDoc>): string {
  return (timestampToDate(doc.date) ?? new Date(0)).toISOString();
}

export function EventsSection() {
  const { translate, language } = useLanguage();

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
                {items.map((event) => {
                  const title =
                    language === "ar" ? event.titleAr : event.titleEn;

                  const description =
                    language === "ar"
                      ? event.descriptionAr
                      : event.descriptionEn;

                  const location =
                    language === "ar"
                      ? event.locationAr
                      : event.locationEn;

                  return (
                    <EventCard
                      key={event.id}
                      title={title}
                      description={description}
                      category={event.category}
                      dateIso={toDateIso(event)}
                      location={location}
                      imageUrl={event.imageUrl}
                      mediaVideoUrl={event.mediaVideoUrl}
                      mediaFileUrl={event.mediaFileUrl}
                    />
                  );
                })}
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
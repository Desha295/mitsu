"use client";

import { useEffect, useState } from "react";
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

  const [highlightedId, setHighlightedId] =
    useState<string | null>(null);

  const {
    data: items,
    loading,
    error,
  } = useFirestoreList(eventsService, PUBLISHED_SOONEST_FIRST);

  useEffect(() => {
    if (loading || error || items.length === 0) {
      return;
    }

    const params = new URLSearchParams(
      window.location.search
    );

    const highlightId =
      params.get("highlight");

    if (!highlightId) {
      return;
    }

    const targetId =
      `event-${highlightId}`;

    const target =
      document.getElementById(targetId);

    if (!target) {
      return;
    }

    setHighlightedId(highlightId);

    const scrollTimer = window.setTimeout(() => {
      target.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);

    const highlightTimer =
      window.setTimeout(() => {
        setHighlightedId(null);
      }, 4000);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(highlightTimer);
    };
  }, [loading, error, items]);

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
                    language === "ar"
                      ? event.titleAr
                      : event.titleEn;

                  const description =
                    language === "ar"
                      ? event.descriptionAr
                      : event.descriptionEn;

                  const location =
                    language === "ar"
                      ? event.locationAr
                      : event.locationEn;

                  const isNotificationTarget =
                    highlightedId === event.id;

                  return (
                    <EventCard
                      key={event.id}
                      id={`event-${event.id}`}
                      className={
                        isNotificationTarget
                          ? "relative z-10 ring-2 ring-primary ring-offset-4 ring-offset-background shadow-xl scale-[1.01]"
                          : undefined
                      }
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
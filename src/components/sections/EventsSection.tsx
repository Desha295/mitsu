"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Loader2,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { EventCard } from "@/components/shared/EventCard";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { eventsService } from "@/lib/firebase/services";

import type { EventDoc } from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";
import { timestampToDate } from "@/lib/firebase/query-helpers";
import type { WithId } from "@/lib/firebase/services";
import { cx } from "@/lib/utils";

const PUBLISHED_SOONEST_FIRST: QueryOptions<EventDoc> = {
  filters: [
    {
      field: "isPublished",
      op: "==",
      value: true,
    },
  ],
  orderByField: {
    field: "date",
    direction: "asc",
  },
};

function toDateIso(doc: WithId<EventDoc>): string {
  return (
    timestampToDate(doc.date) ??
    new Date(0)
  ).toISOString();
}

export function EventsSection() {
  const { translate, language } = useLanguage();

  const [highlightedId, setHighlightedId] =
    useState<string | null>(null);

  const {
    data: items,
    loading,
    error,
  } = useFirestoreList(
    eventsService,
    PUBLISHED_SOONEST_FIRST
  );

  useEffect(() => {
    if (
      loading ||
      error ||
      items.length === 0
    ) {
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
      document.getElementById(
        targetId
      );

    if (!target) {
      return;
    }

    setHighlightedId(highlightId);

    const scrollTimer =
      window.setTimeout(() => {
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
      window.clearTimeout(
        scrollTimer
      );

      window.clearTimeout(
        highlightTimer
      );
    };
  }, [loading, error, items]);

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -start-40 top-24 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

        <div className="absolute -end-40 bottom-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <Container className="relative">
        {/* Header */}
        <div className="mb-10 sm:mb-12">
          <div
            className={cx(
              "mb-5 flex items-center gap-3",
              language === "ar" &&
                "justify-end"
            )}
          >
            {language === "ar" ? (
              <>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {language === "ar"
                    ? "الفعاليات القادمة"
                    : "Upcoming Events"}
                </span>

                <span className="h-px w-8 bg-primary" />
              </>
            ) : (
              <>
                <span className="h-px w-8 bg-primary" />

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Upcoming Events
                </span>
              </>
            )}
          </div>

          <div
            className={cx(
              "flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10",
              language === "ar" &&
                "md:flex-row-reverse"
            )}
          >
            <div
              className={cx(
                "max-w-3xl",
                language === "ar" &&
                  "text-right"
              )}
            >
              <div
                className={cx(
                  "mb-3 flex items-center gap-3",
                  language === "ar" &&
                    "justify-end"
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                  <CalendarDays
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </div>

                <span className="rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                  {language === "ar"
                    ? "مركز الفعاليات"
                    : "Events Center"}
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {translate(
                  "events.upcomingHeading"
                )}
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {translate(
                  "events.subheading"
                )}
              </p>
            </div>

            <div className="hidden shrink-0 items-center gap-2 rounded-2xl border border-border bg-surface/70 px-4 py-3 shadow-sm backdrop-blur-xl md:flex">
              <Sparkles
                className="h-4 w-4 text-primary"
                aria-hidden="true"
              />

              <span className="text-xs font-medium text-muted-foreground">
                {language === "ar"
                  ? "لا تفوّت فعالياتنا"
                  : "Stay up to date"}
              </span>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div
            role="status"
            className="flex min-h-[18rem] flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-surface/50 shadow-sm backdrop-blur-sm"
          >
            <Loader2
              className="h-8 w-8 animate-spin text-primary"
              aria-hidden="true"
            />

            <p className="text-sm text-muted-foreground">
              {translate(
                "common.loading"
              )}
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            role="alert"
            className="flex min-h-[18rem] flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-surface/50 px-6 text-center shadow-sm"
          >
            <CalendarDays
              className="h-8 w-8 text-muted-foreground"
              aria-hidden="true"
            />

            <p className="text-sm font-medium text-foreground">
              {translate(
                "events.errorState"
              )}
            </p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Results heading */}
            <div
              className={cx(
                "mb-6 flex items-center justify-between gap-4",
                language === "ar" &&
                  "flex-row-reverse"
              )}
            >
              <div
                className={cx(
                  "flex items-center gap-3",
                  language === "ar" &&
                    "flex-row-reverse"
                )}
              >
                <span className="h-8 w-1 rounded-full bg-primary" />

                <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {translate(
                    "events.upcomingHeading"
                  )}
                </h3>
              </div>

              <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                {items.length}
              </span>
            </div>

            {/* Events */}
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
                      className={cx(
                        "transition-all duration-300",
                        isNotificationTarget &&
                          "relative z-10 scale-[1.01] shadow-xl ring-2 ring-primary ring-offset-4 ring-offset-background"
                      )}
                      title={title}
                      description={description}
                      category={event.category}
                      dateIso={toDateIso(event)}
                      location={location}
                      imageUrl={event.imageUrl}
                      mediaVideoUrl={
                        event.mediaVideoUrl
                      }
                      mediaFileUrl={
                        event.mediaFileUrl
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-[14rem] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/50 px-6 text-center">
                <CalendarDays
                  className="h-8 w-8 text-muted-foreground"
                  aria-hidden="true"
                />

                <p className="mt-4 text-sm font-medium text-foreground">
                  {translate(
                    "events.emptyState"
                  )}
                </p>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
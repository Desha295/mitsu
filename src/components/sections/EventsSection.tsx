"use client";

import { useEffect, useMemo, useState } from "react";
import {
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

const PUBLISHED_EVENTS: QueryOptions<EventDoc> = {
  filters: [
    {
      field: "isPublished",
      op: "==",
      value: true,
    },
  ],
};

function getEventDate(event: WithId<EventDoc>): Date {
  const converted = timestampToDate(event.date);

  if (
    converted &&
    !Number.isNaN(converted.getTime())
  ) {
    return converted;
  }

  const raw = event.date as unknown;

  if (
    typeof raw === "string" ||
    typeof raw === "number"
  ) {
    const parsed = new Date(raw);

    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  if (raw && typeof raw === "object") {
    const value = raw as {
      seconds?: unknown;
      toDate?: unknown;
    };

    if (typeof value.toDate === "function") {
      const parsed = value.toDate();

      if (
        parsed instanceof Date &&
        !Number.isNaN(parsed.getTime())
      ) {
        return parsed;
      }
    }

    if (typeof value.seconds === "number") {
      return new Date(value.seconds * 1000);
    }
  }

  return new Date(0);
}

function toDateIso(event: WithId<EventDoc>): string {
  return getEventDate(event).toISOString();
}

function EventGrid({
  events,
  language,
  highlightedId,
  now,
}: {
  events: WithId<EventDoc>[];
  language: "ar" | "en";
  highlightedId: string | null;
  now: number;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      {events.map((event) => {
        const eventDate = getEventDate(event);
        const eventTime = eventDate.getTime();

        const isUpcoming = eventTime >= now;
        const isNotificationTarget =
          highlightedId === event.id;

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

        return (
          <div
            key={event.id}
            className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333333%-1.333rem)]"
          >
            <EventCard
              id={`event-${event.id}`}
              className={cx(
                "h-full transition-all duration-300",
                isNotificationTarget &&
                  "relative z-10 scale-[1.01] shadow-xl ring-2 ring-primary ring-offset-4 ring-offset-background"
              )}
              title={title}
              description={description}
              category={event.category}
              dateIso={toDateIso(event)}
              location={location}
              imageUrl={event.imageUrl}
              mediaVideoUrl={event.mediaVideoUrl}
              mediaFileUrl={event.mediaFileUrl}
              isUpcoming={isUpcoming}
            />
          </div>
        );
      })}
    </div>
  );
}

export function EventsSection() {
  const { language } = useLanguage();
  const [now] = useState(() => Date.now());

  const [highlightedId, setHighlightedId] =
    useState<string | null>(null);

  const {
    data: items,
    loading,
    error,
  } = useFirestoreList(
    eventsService,
    PUBLISHED_EVENTS
  );

  const { upcomingEvents, pastEvents } =
    useMemo(() => {
      const sortedEvents = [...items].sort(
        (a, b) =>
          getEventDate(a).getTime() -
          getEventDate(b).getTime()
      );

      return {
        upcomingEvents: sortedEvents
          .filter(
            (event) =>
              getEventDate(event).getTime() >= now
          )
          .sort(
            (a, b) =>
              getEventDate(a).getTime() -
              getEventDate(b).getTime()
          ),

        pastEvents: sortedEvents
          .filter(
            (event) =>
              getEventDate(event).getTime() < now
          )
          .sort(
            (a, b) =>
              getEventDate(b).getTime() -
              getEventDate(a).getTime()
          ),
      };
    }, [items, now]);

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

    const target = document.getElementById(
      `event-${highlightId}`
    );

    if (!target) {
      return;
    }

    const scrollTimer = window.setTimeout(() => {
      setHighlightedId(highlightId);
      target.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);

    const highlightTimer = window.setTimeout(() => {
      setHighlightedId(null);
    }, 4000);

    return () => {
      window.clearTimeout(scrollTimer);
      window.clearTimeout(highlightTimer);
    };
  }, [loading, error, items]);

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24">
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
        <div
          className={cx(
            "mb-10 sm:mb-12",
            language === "ar" && "text-right"
          )}
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          <div
            className={cx(
              "mb-5 flex items-center gap-3",
              language === "ar" && "justify-end"
            )}
          >
            {language === "ar" ? (
              <>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  الفعاليات
                </span>

                <span className="h-px w-8 bg-primary" />
              </>
            ) : (
              <>
                <span className="h-px w-8 bg-primary" />

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Events
                </span>
              </>
            )}
          </div>

          <div
            className={cx(
              "flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10",
              language === "ar" && "md:flex-row-reverse"
            )}
          >
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {language === "ar"
                  ? "فعاليات MITSU"
                  : "MITSU Events"}
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {language === "ar"
                  ? "تعرّف على فعاليات MITSU القادمة والسابقة، وابقَ على اطلاع بكل ما يحدث داخل مجتمعنا الطلابي."
                  : "Explore upcoming and past MITSU events and stay connected with everything happening across our student community."}
              </p>
            </div>

            <div className="hidden shrink-0 items-center gap-2 rounded-2xl border border-border bg-surface/70 px-4 py-3 shadow-sm backdrop-blur-xl md:flex">
              <Sparkles
                className="h-4 w-4 text-primary"
                aria-hidden="true"
              />

              <span className="text-xs font-medium text-muted-foreground">
                {language === "ar"
                  ? "فعالياتنا وذكرياتنا"
                  : "Events & Memories"}
              </span>
            </div>
          </div>
        </div>

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
              {language === "ar"
                ? "جاري تحميل الفعاليات..."
                : "Loading events..."}
            </p>
          </div>
        )}

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
              {language === "ar"
                ? "تعذر تحميل الفعاليات حاليًا."
                : "Unable to load events right now."}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {items.length === 0 ? (
              <div className="flex min-h-[14rem] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/50 px-6 text-center">
                <CalendarDays
                  className="h-8 w-8 text-muted-foreground"
                  aria-hidden="true"
                />

                <p className="mt-4 text-sm font-medium text-foreground">
                  {language === "ar"
                    ? "لا توجد فعاليات متاحة حاليًا."
                    : "No events available at the moment."}
                </p>
              </div>
            ) : (
              <div className="space-y-14">
                {upcomingEvents.length > 0 && (
                  <div>
                    <div
                      className={cx(
                        "mb-6 flex items-center justify-between gap-4",
                        language === "ar" &&
                          "flex-row-reverse"
                      )}
                      dir={
                        language === "ar"
                          ? "rtl"
                          : "ltr"
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-8 w-1 rounded-full bg-primary" />

                        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                          {language === "ar"
                            ? "الفعاليات القادمة"
                            : "Upcoming Events"}
                        </h3>
                      </div>

                      <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                        {upcomingEvents.length}
                      </span>
                    </div>

                    <EventGrid
                      events={upcomingEvents}
                      language={language}
                      highlightedId={highlightedId}
                      now={now}
                    />
                  </div>
                )}

                {pastEvents.length > 0 && (
                  <div>
                    <div
                      className={cx(
                        "mb-6 flex items-center justify-between gap-4",
                        language === "ar" &&
                          "flex-row-reverse"
                      )}
                      dir={
                        language === "ar"
                          ? "rtl"
                          : "ltr"
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-8 w-1 rounded-full bg-primary" />

                        <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                          {language === "ar"
                            ? "الفعاليات السابقة"
                            : "Past Events"}
                        </h3>
                      </div>

                      <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                        {pastEvents.length}
                      </span>
                    </div>

                    <EventGrid
                      events={pastEvents}
                      language={language}
                      highlightedId={highlightedId}
                      now={now}
                    />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
}

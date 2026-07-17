"use client";

import { Container } from "@/components/layout/Container";
import { EventCard } from "@/components/shared/EventCard";
import { events } from "@/data/announcements";
import { useLanguage } from "@/hooks/useLanguage";

/**
 * Events section (components/sections). Renders upcoming events sorted
 * soonest-first, via the reusable EventCard component.
 */
export function EventsSection() {
  const { translate } = useLanguage();

  const upcoming = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

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

        {upcoming.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-center text-foreground/60">
            {translate("events.emptyState")}
          </p>
        )}
      </Container>
    </section>
  );
}

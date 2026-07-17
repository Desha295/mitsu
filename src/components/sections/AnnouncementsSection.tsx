"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { AnnouncementCard } from "@/components/shared/AnnouncementCard";
import { announcements, type AnnouncementCategory } from "@/data/announcements";
import { useLanguage } from "@/hooks/useLanguage";
import { cx, focusRing } from "@/lib/utils";

const FILTER_CATEGORIES: Array<AnnouncementCategory | "all"> = [
  "all",
  "academic",
  "deadline",
  "general",
  "event",
  "orientation",
];

const FILTER_LABEL_KEYS: Record<AnnouncementCategory | "all", string> = {
  all: "announcements.filters.all",
  academic: "announcements.filters.academic",
  deadline: "announcements.filters.deadline",
  general: "announcements.filters.general",
  event: "announcements.filters.event",
  orientation: "announcements.filters.orientation",
};

/**
 * Announcements section (components/sections). Renders the featured
 * announcement, a static search input, static category filter chips, and
 * the latest-announcements grid (sorted newest first, per
 * 03_UI_UX_GUIDELINES.md "Latest announcements first").
 *
 * Search and filters are intentionally static per Sprint 1.6 scope
 * ("Search UI (Static)", "Filter UI (Static)") — both are fully
 * interactive, accessible controls, but neither actually filters the
 * rendered list yet. Real filtering is deferred to a future sprint once
 * this is backed by real/Firebase data.
 */
export function AnnouncementsSection() {
  const { translate } = useLanguage();
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState<AnnouncementCategory | "all">(
    "all"
  );

  const featured = announcements.find((a) => a.featured);
  const latest = [...announcements]
    .filter((a) => !a.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <section className="bg-background py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col gap-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            {translate("announcements.heading")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            {translate("announcements.subheading")}
          </p>
        </div>

        {/* Featured announcement */}
        {featured && (
          <AnnouncementCard announcement={featured} featured />
        )}

        {/* Search + Filter (static UI per Sprint 1.6 scope) */}
        <div className="flex flex-col gap-4">
          <label htmlFor="announcements-search" className="sr-only">
            {translate("announcements.searchLabel")}
          </label>
          <div className="relative w-full sm:max-w-sm">
            <Search
              className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40 ltr:left-3 rtl:right-3"
              aria-hidden="true"
            />
            <input
              id="announcements-search"
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder={translate("announcements.searchPlaceholder")}
              className={cx(
                "w-full rounded-md border border-border bg-surface py-2 text-sm text-foreground placeholder:text-foreground/40 ltr:pl-9 ltr:pr-3 rtl:pr-9 rtl:pl-3",
                focusRing
              )}
            />
          </div>

          <div
            role="group"
            aria-label={translate("announcements.filterLabel")}
            className="flex flex-wrap gap-2"
          >
            {FILTER_CATEGORIES.map((category) => {
              const isActive = activeFilter === category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveFilter(category)}
                  className={cx(
                    "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-150",
                    isActive
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-surface text-foreground/70 hover:bg-surface-muted",
                    focusRing
                  )}
                >
                  {translate(FILTER_LABEL_KEYS[category])}
                </button>
              );
            })}
          </div>
        </div>

        {/* Latest announcements */}
        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-foreground">
            {translate("announcements.latestHeading")}
          </h2>

          {latest.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-foreground/60">
              {translate("announcements.emptyState")}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}

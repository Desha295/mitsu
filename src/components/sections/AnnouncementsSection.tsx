"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { AnnouncementCard } from "@/components/shared/AnnouncementCard";
import { type AnnouncementCategory } from "@/data/announcements";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import { announcementsService } from "@/lib/firebase/services";
import type { AnnouncementDoc } from "@/lib/firebase/collections";
import type { QueryOptions } from "@/lib/firebase/query-helpers";
import { timestampToDate } from "@/lib/firebase/query-helpers";
import type { WithId } from "@/lib/firebase/services";
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
 * Module-level constant (not recreated per render) so useFirestoreList's
 * effect dependency stays referentially stable — same convention as
 * Phases 4.0/4.1. Matches the deployed security rule for /announcements
 * (`isPublished == true`) and the project's established "announcements
 * by createdAt descending" ordering convention.
 */
const PUBLISHED_NEWEST_FIRST: QueryOptions<AnnouncementDoc> = {
  filters: [{ field: "isPublished", op: "==", value: true }],
  orderByField: { field: "createdAt", direction: "desc" },
};

/** Firestore's createdAt is a Timestamp; AnnouncementCard takes a plain
 * ISO string (kept Firestore-agnostic), so this converts it once here. */
function toDateIso(doc: WithId<AnnouncementDoc>): string {
  return (timestampToDate(doc.createdAt) ?? new Date(0)).toISOString();
}

/**
 * Announcements section (components/sections). Renders a static search
 * input, static category filter chips, and the announcements grid
 * (sorted newest first, per 03_UI_UX_GUIDELINES.md "Latest announcements
 * first").
 *
 * Sprint 4 — Phase 4.2: the list now reads live from Firestore via
 * announcementsService instead of src/data/announcements.ts (left in
 * place as historical reference only). The query is already ordered
 * newest-first, so no client-side re-sort is needed.
 *
 * AnnouncementDoc has no `featured` flag, and none is inferred from any
 * other field (not `createdAt`, not `priority`) — the schema is reused
 * exactly as-is, per the approved Sprint 4 plan, with no invented
 * business rules. There is currently no featured-announcement slot on
 * this page as a result; every published announcement renders in the
 * grid below, newest first. AnnouncementCard's `featured` layout variant
 * still exists on the component for when/if a real `featured` field is
 * added to the schema in a future sprint — it's simply never passed
 * `true` from here today.
 *
 * Search and filters remain intentionally static/non-functional, exactly
 * as before Phase 4.2 — both are fully interactive, accessible controls,
 * but neither filters the rendered list. This is unchanged behavior, not
 * a regression: real filtering is still deferred to a future sprint.
 */
export function AnnouncementsSection() {
  const { translate } = useLanguage();
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState<AnnouncementCategory | "all">(
    "all"
  );
  const {
    data: items,
    loading,
    error,
  } = useFirestoreList(announcementsService, PUBLISHED_NEWEST_FIRST);

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
              {translate("announcements.errorState")}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Search + Filter (static UI per Sprint 1.6 scope, unchanged by Phase 4.2) */}
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

            {/* Announcements */}
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-foreground">
                {translate("announcements.latestHeading")}
              </h2>

              {items.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((announcement) => (
                    <AnnouncementCard
                      key={announcement.id}
                      title={announcement.title}
                      description={announcement.description}
                      category={announcement.category}
                      priority={announcement.priority}
                      dateIso={toDateIso(announcement)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-foreground/60">
                  {translate("announcements.emptyState")}
                </p>
              )}
            </div>
          </>
        )}
      </Container>
    </section>
  );
}

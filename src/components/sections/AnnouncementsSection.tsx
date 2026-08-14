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

const PUBLISHED_NEWEST_FIRST: QueryOptions<AnnouncementDoc> = {
  filters: [
    {
      field: "isPublished",
      op: "==",
      value: true,
    },
  ],
  orderByField: {
    field: "createdAt",
    direction: "desc",
  },
};

function toDateIso(doc: WithId<AnnouncementDoc>): string {
  return (timestampToDate(doc.createdAt) ?? new Date(0)).toISOString();
}

export function AnnouncementsSection() {
  const { translate, language } = useLanguage();

  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<AnnouncementCategory | "all">("all");

  const {
    data: items,
    loading,
    error,
  } = useFirestoreList(
    announcementsService,
    PUBLISHED_NEWEST_FIRST
  );

  const filteredItems = items.filter((announcement) => {
    const title =
      language === "en"
        ? announcement.titleEn
        : announcement.title;

    const description =
      language === "en"
        ? announcement.descriptionEn
        : announcement.description;

    const search = searchValue.trim().toLowerCase();

    const matchesSearch =
      !search ||
      title.toLowerCase().includes(search) ||
      description.toLowerCase().includes(search);

    const matchesCategory =
      activeFilter === "all" ||
      announcement.category === activeFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="bg-background py-12 sm:py-16 md:py-20">
      <Container className="flex flex-col gap-12">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            {translate("announcements.heading")}
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/70">
            {translate("announcements.subheading")}
          </p>
        </div>

        {/* Loading */}
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

        {/* Error */}
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

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Search + Filters */}
            <div className="flex flex-col gap-4">
              <label
                htmlFor="announcements-search"
                className="sr-only"
              >
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
                  onChange={(event) =>
                    setSearchValue(event.target.value)
                  }
                  placeholder={translate(
                    "announcements.searchPlaceholder"
                  )}
                  className={cx(
                    "w-full rounded-md border border-border bg-surface py-2 text-sm text-foreground placeholder:text-foreground/40",
                    "ltr:pl-9 ltr:pr-3 rtl:pr-9 rtl:pl-3",
                    focusRing
                  )}
                />
              </div>

              <div
                role="group"
                aria-label={translate(
                  "announcements.filterLabel"
                )}
                className="flex flex-wrap gap-2"
              >
                {FILTER_CATEGORIES.map((category) => {
                  const isActive =
                    activeFilter === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() =>
                        setActiveFilter(category)
                      }
                      className={cx(
                        "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-150",
                        isActive
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-surface text-foreground/70 hover:bg-surface-muted",
                        focusRing
                      )}
                    >
                      {translate(
                        FILTER_LABEL_KEYS[category]
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Announcements */}
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-foreground">
                {translate(
                  "announcements.latestHeading"
                )}
              </h2>

              {filteredItems.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredItems.map((announcement) => {
                    const title =
                      language === "en"
                        ? announcement.titleEn
                        : announcement.title;

                    const description =
                      language === "en"
                        ? announcement.descriptionEn
                        : announcement.description;

                    return (
                      <AnnouncementCard
                        key={announcement.id}
                        title={title}
                        titleEn={announcement.titleEn}
                        description={description}
                        descriptionEn={announcement.descriptionEn}
                        category={announcement.category}
                        priority={announcement.priority}
                        dateIso={toDateIso(announcement)}
                        mediaImageUrl={
                          announcement.mediaImageUrl
                        }
                        mediaFileUrl={
                          announcement.mediaFileUrl
                        }
                        mediaVideoUrl={
                          announcement.mediaVideoUrl
                        }
                      />
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-foreground/60">
                  {translate(
                    "announcements.emptyState"
                  )}
                </p>
              )}
            </div>
          </>
        )}
      </Container>
    </section>
  );
}
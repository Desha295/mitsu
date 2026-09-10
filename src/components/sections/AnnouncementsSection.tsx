"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";

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

interface AnnouncementsSectionProps {
  homePreview?: boolean;
}

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

export function AnnouncementsSection({
  homePreview = false,
}: AnnouncementsSectionProps) {
  const { translate, language } = useLanguage();

  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<AnnouncementCategory | "all">("all");

  const [highlightedId, setHighlightedId] =
    useState<string | null>(null);

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

  const visibleItems = homePreview
    ? items.slice(0, 3)
    : filteredItems;

  useEffect(() => {
    if (loading || error || items.length === 0) {
      return;
    }

    const params = new URLSearchParams(
      window.location.search
    );

    const highlightId = params.get("highlight");

    if (!highlightId) {
      return;
    }

    const targetId = `announcement-${highlightId}`;
    const target = document.getElementById(targetId);

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
              language === "ar" && "justify-end"
            )}
          >
            {language === "ar" ? (
              <>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {translate("announcements.latestHeading")}
                </span>

                <span className="h-px w-8 bg-primary" />
              </>
            ) : (
              <>
                <span className="h-px w-8 bg-primary" />

                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Latest Updates
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
            <div
              className={cx(
                "max-w-3xl",
                language === "ar" && "text-right"
              )}
            >
              <div
                className={cx(
                  "mb-3 flex items-center gap-3",
                  language === "ar" && "justify-end"
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                  <BellRing
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </div>

                <span className="rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                  {language === "ar"
                    ? "مركز الإعلانات"
                    : "Announcement Center"}
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                {translate("announcements.heading")}
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {translate("announcements.subheading")}
              </p>
            </div>

            <div className="hidden shrink-0 items-center gap-2 rounded-2xl border border-border bg-surface/70 px-4 py-3 shadow-sm backdrop-blur-xl md:flex">
              <Sparkles
                className="h-4 w-4 text-primary"
                aria-hidden="true"
              />

              <span className="text-xs font-medium text-muted-foreground">
                {language === "ar"
                  ? "ابقَ على اطلاع"
                  : "Stay informed"}
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
              {translate("common.loading")}
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            role="alert"
            className="flex min-h-[18rem] flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-surface/50 px-6 text-center shadow-sm"
          >
            <BellRing
              className="h-8 w-8 text-muted-foreground"
              aria-hidden="true"
            />

            <p className="text-sm font-medium text-foreground">
              {translate("announcements.errorState")}
            </p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Search + Filters — Full announcements page only */}
            {!homePreview ? (
              <div className="mb-10 rounded-3xl border border-border/80 bg-surface/70 p-4 shadow-sm backdrop-blur-xl sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                  <div className="relative w-full lg:max-w-md">
                    <label
                      htmlFor="announcements-search"
                      className="sr-only"
                    >
                      {translate(
                        "announcements.searchLabel"
                      )}
                    </label>

                    <Search
                      className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground ltr:left-4 rtl:right-4"
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
                        "h-11 w-full rounded-2xl border border-border bg-background/80 text-sm text-foreground",
                        "placeholder:text-muted-foreground",
                        "transition-colors duration-200",
                        "focus:border-primary/40",
                        "ltr:pl-11 ltr:pr-4 rtl:pr-11 rtl:pl-4",
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
                            "rounded-xl border px-3.5 py-2 text-sm font-medium",
                            "transition-all duration-200",
                            isActive
                              ? "border-primary bg-primary text-primary-foreground shadow-sm"
                              : "border-border bg-background/60 text-muted-foreground hover:border-primary/20 hover:bg-primary/5 hover:text-foreground",
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
              </div>
            ) : null}

            {/* Results heading */}
            <div
              className={cx(
                "mb-6 flex items-center justify-between gap-4",
                language === "ar" && "flex-row-reverse"
              )}
            >
              <div
                className={cx(
                  "flex items-center gap-3",
                  language === "ar" && "flex-row-reverse"
                )}
              >
                <span className="h-8 w-1 rounded-full bg-primary" />

                <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  {translate("announcements.latestHeading")}
                </h3>
              </div>

              <span className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                {homePreview
                  ? items.length
                  : filteredItems.length}
              </span>
            </div>

            {/* Announcements */}
            {visibleItems.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {visibleItems.map((announcement) => {
                    const title =
                      language === "en"
                        ? announcement.titleEn
                        : announcement.title;

                    const description =
                      language === "en"
                        ? announcement.descriptionEn
                        : announcement.description;

                    const isNotificationTarget =
                      highlightedId === announcement.id;

                    return (
                      <AnnouncementCard
                        key={announcement.id}
                        id={`announcement-${announcement.id}`}
                        className={cx(
                          "transition-all duration-300",
                          isNotificationTarget &&
                            "relative z-10 scale-[1.01] shadow-xl ring-2 ring-primary ring-offset-4 ring-offset-background"
                        )}
                        title={title}
                        titleEn={announcement.titleEn}
                        description={description}
                        descriptionEn={
                          announcement.descriptionEn
                        }
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

                {/* View All — Home only */}
                {homePreview && items.length > 3 ? (
                  <div
                    className={cx(
                      "mt-10 flex",
                      language === "ar"
                        ? "justify-start"
                        : "justify-end"
                    )}
                  >
                    <Link
                      href="/announcements"
                      className={cx(
                        "group inline-flex items-center gap-2 rounded-2xl",
                        "border border-primary/20 bg-primary/5",
                        "px-5 py-3",
                        "text-sm font-semibold text-primary",
                        "shadow-sm backdrop-blur-sm",
                        "transition-all duration-200",
                        "hover:-translate-y-0.5",
                        "hover:border-primary/30 hover:bg-primary/10",
                        "hover:shadow-md",
                        focusRing
                      )}
                    >
                      <span>
                        {language === "ar"
                          ? "عرض جميع الإعلانات"
                          : "View All Announcements"}
                      </span>

                      <ArrowRight
                        className={cx(
                          "h-4 w-4 transition-transform duration-200",
                          language === "ar"
                            ? "rotate-180 group-hover:-translate-x-1"
                            : "group-hover:translate-x-1"
                        )}
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="flex min-h-[14rem] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/50 px-6 text-center">
                <Search
                  className="h-8 w-8 text-muted-foreground"
                  aria-hidden="true"
                />

                <p className="mt-4 text-sm font-medium text-foreground">
                  {translate("announcements.emptyState")}
                </p>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
}
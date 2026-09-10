"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock,
  ExternalLink,
  Mail,
  MessageCircle,
  Phone,
  UsersRound,
} from "lucide-react";

import { Container } from "@/components/layout/Container";
import { useLanguage } from "@/hooks/useLanguage";
import {
  familiesService,
  createFamilyEventsService,
} from "@/lib/firebase/services";
import type { FamilyEventDoc } from "@/lib/firebase/collections";

export default function FamilyDetailsPage() {
  const params = useParams<{ familyId: string }>();
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const [family, setFamily] = React.useState<
    Awaited<ReturnType<typeof familiesService.getById>>
  >(null);

  const [events, setEvents] = React.useState<
    Array<FamilyEventDoc & { id: string }>
  >([]);

  const [loading, setLoading] = React.useState(true);
  const [eventsLoading, setEventsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!params.familyId) return;

    let cancelled = false;

    const eventsService = createFamilyEventsService(params.familyId);

    Promise.all([
      familiesService.getById(params.familyId),
      eventsService.getAll({
        orderByField: {
          field: "date",
          direction: "asc",
        },
      }),
    ])
      .then(([familyData, eventsData]) => {
        if (cancelled) return;

        setFamily(familyData);
        setEvents(eventsData);
        setLoading(false);
        setEventsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;

        setFamily(null);
        setEvents([]);
        setLoading(false);
        setEventsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [params.familyId]);

  const formatDate = (date: FamilyEventDoc["date"]) => {
    const eventDate = date.toDate();

    return eventDate.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: FamilyEventDoc["date"]) => {
    const eventDate = date.toDate();

    return eventDate.toLocaleTimeString(isArabic ? "ar-EG" : "en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <section className="relative overflow-hidden bg-background py-16 sm:py-20 md:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -start-40 top-24 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -end-40 bottom-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />

          <Container className="relative">
            <div className="animate-pulse space-y-5">
              <div className="h-5 w-40 rounded-full bg-muted" />
              <div className="h-12 w-2/3 rounded-xl bg-muted" />
              <div className="h-6 w-full max-w-2xl rounded bg-muted" />
            </div>
          </Container>
        </section>

        <Container className="relative py-12 sm:py-16">
          <div className="animate-pulse overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
            <div className="h-72 bg-muted md:h-96" />

            <div className="space-y-4 p-6 md:p-8">
              <div className="h-8 w-1/3 rounded bg-muted" />
              <div className="h-5 w-1/4 rounded bg-muted" />
              <div className="h-24 rounded bg-muted" />
            </div>
          </div>
        </Container>
      </main>
    );
  }

  if (!family || !family.isActive) {
    return (
      <main className="min-h-screen bg-background py-16 sm:py-20 md:py-24">
        <Container>
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center shadow-sm backdrop-blur-sm">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            />

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
              <UsersRound className="h-8 w-8" aria-hidden="true" />
            </div>

            <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {isArabic
                ? "الأسرة الطلابية غير موجودة"
                : "Student family not found"}
            </h1>

            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {isArabic
                ? "قد تكون الأسرة غير متاحة حاليًا."
                : "This family may no longer be available."}
            </p>

            <Link
              href="/families"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              {isArabic ? "العودة للأسر الطلابية" : "Back to Student Families"}

              {isArabic ? (
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              )}
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  const name = isArabic ? family.nameAr : family.nameEn;

  const description = isArabic
    ? family.descriptionAr
    : family.descriptionEn;

  const hasContactOptions =
    family.whatsapp ||
    family.email ||
    family.phone ||
    family.instagram ||
    family.facebook ||
    family.linkedin ||
    family.applicationUrl;

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-background py-12 sm:py-16 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -start-40 top-24 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -end-40 bottom-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        <Container className="relative">
          <Link
            href="/families"
            className="mb-8 inline-flex items-center gap-2 rounded-xl border border-border bg-surface/70 px-3.5 py-2.5 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
          >
            {isArabic ? (
              <>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                العودة للأسر الطلابية
              </>
            ) : (
              <>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to Student Families
              </>
            )}
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="order-2 lg:order-1">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                <UsersRound
                  className="h-3.5 w-3.5 text-primary"
                  aria-hidden="true"
                />
                <span>
                  {isArabic ? "أسرة طلابية" : "Student Family"}
                </span>
              </div>

              <h1 className="break-words text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                {name}
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                {description}
              </p>
            </div>

            <div className="order-1 lg:order-2">
              <div className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-2 shadow-sm transition-all duration-300 hover:shadow-xl">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-surface-muted">
                  {family.imageUrl ? (
                    <>
                      <img
                        src={family.imageUrl}
                        alt={name}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />

                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                      />
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center bg-primary/5 text-primary">
                      <UsersRound
                        className="h-24 w-24 transition-transform duration-500 group-hover:scale-110"
                        aria-hidden="true"
                      />
                    </div>
                  )}

                  <div className="absolute bottom-4 start-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    <span>
                      {isArabic ? "الحياة الطلابية" : "Student Life"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="relative pb-16 sm:pb-20 md:pb-24">
        {/* Contact */}
        {hasContactOptions ? (
          <section className="relative overflow-hidden rounded-3xl border border-border bg-surface/70 p-6 shadow-sm backdrop-blur-sm sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -start-20 -top-20 h-48 w-48 rounded-full bg-primary/5 blur-3xl"
            />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                  <MessageCircle
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  <span>
                    {isArabic ? "ابقَ على تواصل" : "Stay Connected"}
                  </span>
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {isArabic
                    ? "تواصل مع الأسرة"
                    : "Connect with the Family"}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {family.whatsapp ? (
                  <a
                    href={family.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    WhatsApp
                  </a>
                ) : null}

                {family.email ? (
                  <a
                    href={`mailto:${family.email}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Email
                  </a>
                ) : null}

                {family.phone ? (
                  <a
                    href={`tel:${family.phone}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {isArabic ? "اتصال" : "Call"}
                  </a>
                ) : null}

                {family.instagram ? (
                  <a
                    href={family.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Instagram
                  </a>
                ) : null}

                {family.facebook ? (
                  <a
                    href={family.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Facebook
                  </a>
                ) : null}

                {family.linkedin ? (
                  <a
                    href={family.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    LinkedIn
                  </a>
                ) : null}

                {family.applicationUrl ? (
                  <a
                    href={family.applicationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <ArrowUpRight
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                    {isArabic ? "التقديم" : "Apply"}
                  </a>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {/* Events */}
        <section className="mt-16 sm:mt-20 md:mt-24">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <div
                className={`mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-primary ${
                  isArabic ? "justify-end" : ""
                }`}
              >
                <span className="h-px w-8 bg-primary/40" />

                <span>
                  {isArabic
                    ? "الأنشطة والفعاليات"
                    : "Activities & Events"}
                </span>
              </div>

              <div
                className={
                  isArabic ? "text-right" : "text-left"
                }
              >
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                  <CalendarDays
                    className="h-3.5 w-3.5 text-primary"
                    aria-hidden="true"
                  />
                  <span>
                    {isArabic ? "فعاليات الأسرة" : "Family Events"}
                  </span>
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  {isArabic
                    ? "فعاليات الأسرة"
                    : "Family Events"}
                </h2>

                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {isArabic
                    ? "تابع أحدث الفعاليات والأنشطة الخاصة بالأسرة."
                    : "Stay updated with the latest family events and activities."}
                </p>
              </div>
            </div>

            <div className="hidden shrink-0 items-center gap-2 rounded-2xl border border-border bg-surface/70 px-4 py-3 shadow-sm backdrop-blur-sm md:flex">
              <CalendarDays
                className="h-4 w-4 text-primary"
                aria-hidden="true"
              />

              <span className="text-xs font-semibold text-muted-foreground">
                {isArabic ? "أنشطة وفعاليات" : "Events & Activities"}
              </span>
            </div>
          </div>

          {eventsLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-3xl border border-border bg-surface shadow-sm"
                >
                  <div className="aspect-[16/10] bg-muted" />

                  <div className="space-y-4 p-6">
                    <div className="h-6 w-3/4 rounded bg-muted" />
                    <div className="h-4 w-1/2 rounded bg-muted" />
                    <div className="h-16 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center shadow-sm backdrop-blur-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                <CalendarDays
                  className="h-8 w-8"
                  aria-hidden="true"
                />
              </div>

              <h3 className="mt-5 text-xl font-bold tracking-tight text-foreground">
                {isArabic
                  ? "لا توجد فعاليات متاحة حاليًا"
                  : "No events available"}
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {isArabic
                  ? "سيتم إضافة فعاليات الأسرة قريبًا."
                  : "Family events will be added soon."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const eventTitle = isArabic
                  ? event.titleAr
                  : event.titleEn;

                const eventDescription = isArabic
                  ? event.descriptionAr
                  : event.descriptionEn;

                return (
                  <article
                    key={event.id}
                    className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="h-1 w-full bg-primary" />

                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted">
                      <img
                        src={event.imageUrl}
                        alt={eventTitle}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />

                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
                      />

                      <div className="absolute bottom-4 start-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm backdrop-blur">
                        <CalendarDays
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />

                        <span>{formatDate(event.date)}</span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                          <CalendarDays
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 break-words text-lg font-bold leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary sm:text-xl">
                            {eventTitle}
                          </h3>
                        </div>

                        <ArrowUpRight
                          className="mt-1 h-4 w-4 shrink-0 text-primary/30 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                          aria-hidden="true"
                        />
                      </div>

                      <div className="mt-5 space-y-3 border-t border-border pt-5">
                        <div className="flex items-start gap-3 text-sm text-muted-foreground">
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <CalendarDays
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </div>

                          <div className="min-w-0 pt-1">
                            <time>
                              {formatDate(event.date)}
                            </time>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 text-sm text-muted-foreground">
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Clock
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </div>

                          <div className="min-w-0 pt-1">
                            {formatTime(event.date)}
                          </div>
                        </div>
                      </div>

                      {eventDescription ? (
                        <p className="mt-5 line-clamp-3 flex-1 text-sm leading-6 text-muted-foreground">
                          {eventDescription}
                        </p>
                      ) : (
                        <div className="flex-1" />
                      )}

                      <div className="mt-6 h-px w-0 bg-primary transition-all duration-500 group-hover:w-full" />
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
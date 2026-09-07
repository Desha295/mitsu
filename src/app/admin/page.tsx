"use client";

import { Loader2 } from "lucide-react";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { PageContainer } from "@/components/admin/PageContainer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { SectionHeader } from "@/components/admin/SectionHeader";
import { StatCard } from "@/components/admin/StatCard";
import { QuickActionCard } from "@/components/admin/QuickActionCard";
import { EmptyState } from "@/components/admin/EmptyState";
import { dashboardStats } from "@/data/adminDashboard";
import { adminNavigation } from "@/data/adminNavigation";
import { useAuth } from "@/hooks/useAuth";
import { useFirestoreList } from "@/hooks/useFirestoreList";
import { useLanguage } from "@/hooks/useLanguage";
import {
  announcementsService,
  eventsService,
  systemsService,
  unionService,
  leadershipService,
  guideService,
} from "@/lib/firebase/services";
import type { AnnouncementDoc, EventDoc } from "@/lib/firebase/collections";
import { timestampToDate } from "@/lib/firebase/query-helpers";
import type { WithId } from "@/lib/firebase/services";
import { cx, focusRing, formatDate } from "@/lib/utils";

/** Shared shape for merging Announcements + Events into one feed —
 * these are the only two of the six required collections whose
 * schemas have a genuine timestamp field to sort "recent" by
 * (SystemDoc/CommitteeDoc/LeadershipDoc/GuideSectionDoc have none). */
interface ActivityItem {
  id: string;
  title: string;
  collectionLabelKey: string;
  dateIso: string;
}

const RECENT_ACTIVITY_LIMIT = 6;

function announcementToActivity(
  doc: WithId<AnnouncementDoc>
): ActivityItem {
  const date =
    timestampToDate(doc.updatedAt) ??
    timestampToDate(doc.createdAt);

  return {
    id: doc.id,
    title: doc.title,
    collectionLabelKey: "admin.nav.announcements",
    dateIso: (date ?? new Date(0)).toISOString(),
  };
}

function eventToActivity(
  doc: WithId<EventDoc>
): ActivityItem {
  const date = timestampToDate(doc.createdAt);

  return {
    id: doc.id,
    title: doc.titleAr,
    collectionLabelKey: "admin.nav.events",
    dateIso: (date ?? new Date(0)).toISOString(),
  };
}

/**
 * Dashboard home (Sprint 6.0 — Dashboard Improvements).
 *
 * The dashboard reuses the existing admin navigation for implemented
 * quick actions and also exposes the Academic Advisors / Student Data
 * importer directly so admins can easily access the Excel import page.
 */
export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { translate, language } = useLanguage();

  const displayName =
    user?.displayName || user?.email || "";

  const announcements =
    useFirestoreList(announcementsService);
  const events = useFirestoreList(eventsService);
  const systems = useFirestoreList(systemsService);
  const committees = useFirestoreList(unionService);
  const leadership = useFirestoreList(leadershipService);
  const guide = useFirestoreList(guideService);

  const loading =
    announcements.loading ||
    events.loading ||
    systems.loading ||
    committees.loading ||
    leadership.loading ||
    guide.loading;

  const error =
    announcements.error ||
    events.error ||
    systems.error ||
    committees.error ||
    leadership.error ||
    guide.error;

  const statValues: Record<string, number> = {
    announcements: announcements.data.length,
    events: events.data.length,
    committees: committees.data.length,
    systems: systems.data.length,
    leadership: leadership.data.length,
    guide: guide.data.length,
  };

  const quickActionItems = adminNavigation.filter(
    (item) =>
      item.isImplemented &&
      item.id !== "dashboard" &&
      item.href !== "/admin/academic-advisors"
  );

  const recentActivity: ActivityItem[] =
    !loading && !error
      ? [
          ...announcements.data.map(
            announcementToActivity
          ),
          ...events.data.map(eventToActivity),
        ]
          .sort(
            (a, b) =>
              new Date(b.dateIso).getTime() -
              new Date(a.dateIso).getTime()
          )
          .slice(0, RECENT_ACTIVITY_LIMIT)
      : [];

  const publishedAnnouncements =
    announcements.data.filter(
      (a) => a.isPublished
    ).length;

  const publishedEvents = events.data.filter(
    (e) => e.isPublished
  ).length;

  const activeCollectionsCount =
    !loading && !error
      ? [
          announcements.data.some(
            (a) => a.isPublished
          ),
          events.data.some((e) => e.isPublished),
          systems.data.some((s) => s.isActive),
          committees.data.some((c) => c.isActive),
          leadership.data.some((l) => l.isActive),
          guide.data.some((g) => g.isActive),
        ].filter(Boolean).length
      : 0;

  const firebaseStatus = !isFirebaseConfigured
    ? "notConnected"
    : error
      ? "error"
      : "connected";

  const firebaseStatusColor =
    firebaseStatus === "connected"
      ? "text-secondary-dark"
      : firebaseStatus === "error"
        ? "text-primary"
        : "text-foreground/50";

  return (
    <PageContainer className="flex flex-col gap-8">
      <AdminHeader
        title={translate("admin.dashboard.heading")}
        breadcrumbs={[
          {
            label: translate("admin.breadcrumb.root"),
          },
          {
            label: translate(
              "admin.dashboard.heading"
            ),
          },
        ]}
      />

      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {translate(
            "admin.dashboard.welcomeHeading"
          )}
          {displayName ? `, ${displayName}` : ""}
        </h2>

        <p className="mt-1 text-sm text-foreground/70">
          {translate(
            "admin.dashboard.welcomeSubheading"
          )}
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
            {translate("admin.dashboard.error")}
          </p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div>
            <SectionHeader
              title={translate(
                "admin.dashboard.statsHeading"
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dashboardStats.map((stat) => (
                <StatCard
                  key={stat.id}
                  icon={stat.icon}
                  label={translate(stat.labelKey)}
                  value={String(
                    statValues[stat.id] ?? 0
                  )}
                />
              ))}
            </div>
          </div>

          <div>
            <SectionHeader
              title={translate(
                "admin.dashboard.quickActionsHeading"
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickActionItems.map((item) => (
                <QuickActionCard
                  key={item.id}
                  icon={item.icon}
                  label={translate(item.labelKey)}
                  comingSoonLabel={translate(
                    "admin.sidebar.comingSoon"
                  )}
                  href={item.href}
                />
              ))}

              <QuickActionCard
                icon="GraduationCap"
                label={
                  language === "ar"
                    ? "المرشدون والطلاب"
                    : "Academic Advisors & Students"
                }
                comingSoonLabel={translate(
                  "admin.sidebar.comingSoon"
                )}
                href="/admin/academic-advisors"
              />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <SectionHeader
                title={translate(
                  "admin.dashboard.recentActivityHeading"
                )}
              />

              {recentActivity.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {recentActivity.map((item) => (
                    <li
                      key={`${item.collectionLabelKey}-${item.id}`}
                      className={cx(
                        "flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3",
                        focusRing
                      )}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {item.title}
                        </p>

                        <p className="text-xs text-foreground/60">
                          {translate(
                            item.collectionLabelKey
                          )}
                        </p>
                      </div>

                      <time
                        dateTime={item.dateIso}
                        className="shrink-0 text-xs text-foreground/50"
                      >
                        {formatDate(
                          item.dateIso,
                          language
                        )}
                      </time>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  title={translate(
                    "admin.dashboard.recentActivityEmpty"
                  )}
                />
              )}
            </div>

            <div>
              <SectionHeader
                title={translate(
                  "admin.dashboard.systemStatusHeading"
                )}
              />

              <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">
                    {translate(
                      "admin.dashboard.systemStatus.firebase"
                    )}
                  </span>

                  <span
                    className={cx(
                      "font-medium",
                      firebaseStatusColor
                    )}
                  >
                    {translate(
                      `admin.dashboard.systemStatus.${firebaseStatus}`
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">
                    {translate(
                      "admin.dashboard.systemStatus.activeCollections"
                    )}
                  </span>

                  <span className="font-medium text-foreground">
                    {activeCollectionsCount}/6
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">
                    {translate(
                      "admin.dashboard.systemStatus.publishedAnnouncements"
                    )}
                  </span>

                  <span className="font-medium text-foreground">
                    {publishedAnnouncements}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground/70">
                    {translate(
                      "admin.dashboard.systemStatus.publishedEvents"
                    )}
                  </span>

                  <span className="font-medium text-foreground">
                    {publishedEvents}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </PageContainer>
  );
}
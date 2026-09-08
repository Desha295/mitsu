"use client";

import { useState } from "react";
import { Bell, Loader2, Trash2 } from "lucide-react";
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
  deleteAllNotifications,
} from "@/lib/firebase/services";
import type {
  AnnouncementDoc,
  EventDoc,
} from "@/lib/firebase/collections";
import { timestampToDate } from "@/lib/firebase/query-helpers";
import type { WithId } from "@/lib/firebase/services";
import { cx, focusRing, formatDate } from "@/lib/utils";

/** Shared shape for merging Announcements + Events into one feed. */
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
 * Dashboard home.
 *
 * The dashboard reuses the existing admin navigation for quick actions
 * and also provides direct access to the Academic Advisors / Student Data
 * importer and notification management.
 */
export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { translate, language } = useLanguage();

  const [clearingNotifications, setClearingNotifications] =
    useState(false);

  const [notificationActionMessage, setNotificationActionMessage] =
    useState<string | null>(null);

  const displayName =
    user?.displayName || user?.email || "";

  const announcements =
    useFirestoreList(announcementsService);

  const events =
    useFirestoreList(eventsService);

  const systems =
    useFirestoreList(systemsService);

  const committees =
    useFirestoreList(unionService);

  const leadership =
    useFirestoreList(leadershipService);

  const guide =
    useFirestoreList(guideService);

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

  const quickActionItems =
    adminNavigation.filter(
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
          ...events.data.map(
            eventToActivity
          ),
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

  const publishedEvents =
    events.data.filter(
      (e) => e.isPublished
    ).length;

  const activeCollectionsCount =
    !loading && !error
      ? [
          announcements.data.some(
            (a) => a.isPublished
          ),
          events.data.some(
            (e) => e.isPublished
          ),
          systems.data.some(
            (s) => s.isActive
          ),
          committees.data.some(
            (c) => c.isActive
          ),
          leadership.data.some(
            (l) => l.isActive
          ),
          guide.data.some(
            (g) => g.isActive
          ),
        ].filter(Boolean).length
      : 0;

  const firebaseStatus =
    !isFirebaseConfigured
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

  async function handleClearNotifications() {
    const confirmationMessage =
      language === "ar"
        ? "هل أنت متأكد من مسح جميع إشعارات الجرس؟\n\nسيتم حذف جميع الإشعارات الحالية نهائيًا ولن تظهر للطلاب مرة أخرى."
        : "Are you sure you want to clear all bell notifications?\n\nAll current notifications will be permanently deleted and will no longer appear to students.";

    if (!window.confirm(confirmationMessage)) {
      return;
    }

    setClearingNotifications(true);
    setNotificationActionMessage(null);

    try {
      await deleteAllNotifications();

      setNotificationActionMessage(
        language === "ar"
          ? "تم مسح جميع إشعارات الجرس بنجاح."
          : "All bell notifications have been cleared successfully."
      );
    } catch (error) {
      console.error(
        "[MITSU] Failed to clear notifications:",
        error
      );

      setNotificationActionMessage(
        language === "ar"
          ? "تعذر مسح إشعارات الجرس. حاول مرة أخرى."
          : "Failed to clear bell notifications. Please try again."
      );
    } finally {
      setClearingNotifications(false);
    }
  }

  return (
    <PageContainer className="flex flex-col gap-8">
      <AdminHeader
        title={translate("admin.dashboard.heading")}
        breadcrumbs={[
          {
            label: translate(
              "admin.breadcrumb.root"
            ),
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
          {displayName
            ? `, ${displayName}`
            : ""}
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
            {translate(
              "admin.dashboard.error"
            )}
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
              {dashboardStats.map(
                (stat) => (
                  <StatCard
                    key={stat.id}
                    icon={stat.icon}
                    label={translate(
                      stat.labelKey
                    )}
                    value={String(
                      statValues[
                        stat.id
                      ] ?? 0
                    )}
                  />
                )
              )}
            </div>
          </div>

          <div>
            <SectionHeader
              title={translate(
                "admin.dashboard.quickActionsHeading"
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickActionItems.map(
                (item) => (
                  <QuickActionCard
                    key={item.id}
                    icon={item.icon}
                    label={translate(
                      item.labelKey
                    )}
                    comingSoonLabel={translate(
                      "admin.sidebar.comingSoon"
                    )}
                    href={item.href}
                  />
                )
              )}

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

          {/* Notification management */}
          <div>
            <SectionHeader
              title={
                language === "ar"
                  ? "إدارة إشعارات الجرس"
                  : "Notification Management"
              }
            />

            <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Bell
                      className="h-5 w-5"
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground">
                      {language === "ar"
                        ? "إشعارات الموقع"
                        : "Site Notifications"}
                    </h3>

                    <p className="mt-1 max-w-2xl text-sm leading-6 text-foreground/65">
                      {language === "ar"
                        ? "استخدم هذا الزر لمسح جميع الإشعارات الحالية من جرس الطلاب. الإشعارات الجديدة التي يتم إنشاؤها بعد ذلك ستظهر بشكل طبيعي."
                        : "Use this button to clear all current notifications from the students' bell. New notifications created afterward will appear normally."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    handleClearNotifications
                  }
                  disabled={
                    clearingNotifications ||
                    !isFirebaseConfigured
                  }
                  className={cx(
                    "inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all",
                    "bg-primary text-white shadow-sm",
                    "hover:bg-primary/90",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    focusRing
                  )}
                >
                  {clearingNotifications ? (
                    <>
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />

                      <span>
                        {language === "ar"
                          ? "جاري المسح..."
                          : "Clearing..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <Trash2
                        className="h-4 w-4"
                        aria-hidden="true"
                      />

                      <span>
                        {language === "ar"
                          ? "مسح إشعارات الجرس"
                          : "Clear Bell Notifications"}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {notificationActionMessage && (
                <div
                  role="status"
                  className="mt-4 rounded-lg border border-border bg-surface-muted px-4 py-3 text-sm text-foreground/80"
                >
                  {notificationActionMessage}
                </div>
              )}
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
                  {recentActivity.map(
                    (item) => (
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
                          dateTime={
                            item.dateIso
                          }
                          className="shrink-0 text-xs text-foreground/50"
                        >
                          {formatDate(
                            item.dateIso,
                            language
                          )}
                        </time>
                      </li>
                    )
                  )}
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
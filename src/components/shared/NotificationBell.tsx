"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  ExternalLink,
  Loader2,
} from "lucide-react";

import { useLanguage } from "@/hooks/useLanguage";
import {
  getPublishedNotifications,
} from "@/lib/firebase/services/notificationService";
import type { NotificationDoc } from "@/lib/firebase/collections";

type NotificationWithId = NotificationDoc & {
  id: string;
};

const READ_NOTIFICATIONS_KEY = "mitsu_read_notifications";

function getReadNotificationIds(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(
      READ_NOTIFICATIONS_KEY
    );

    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed)
      ? parsed.filter(
          (value): value is string =>
            typeof value === "string"
        )
      : [];
  } catch {
    return [];
  }
}

function saveReadNotificationIds(ids: string[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      READ_NOTIFICATIONS_KEY,
      JSON.stringify(ids)
    );
  } catch {
    // Ignore localStorage errors.
  }
}

function getNotificationTitle(
  notification: NotificationWithId,
  language: string
) {
  if (language === "ar") {
    return (
      notification.titleAr ||
      notification.titleEn ||
      "إشعار"
    );
  }

  return (
    notification.titleEn ||
    notification.titleAr ||
    "Notification"
  );
}

function getNotificationDescription(
  notification: NotificationWithId,
  language: string
) {
  if (language === "ar") {
    return (
      notification.descriptionAr ||
      notification.descriptionEn ||
      ""
    );
  }

  return (
    notification.descriptionEn ||
    notification.descriptionAr ||
    ""
  );
}

function formatNotificationDate(
  createdAt: NotificationDoc["createdAt"],
  language: string
) {
  if (!createdAt) return "";

  try {
    const date = createdAt.toDate();

    return new Intl.DateTimeFormat(
      language === "ar" ? "ar-EG" : "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    ).format(date);
  } catch {
    return "";
  }
}

export function NotificationBell() {
  const { language } = useLanguage();

  const [notifications, setNotifications] = useState<
    NotificationWithId[]
  >([]);

  const [readIds, setReadIds] = useState<string[]>(getReadNotificationIds);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function loadNotifications() {
    try {
      setLoading(true);
      setError(false);

      console.log(
        "[MITSU] Loading published notifications..."
      );

      const data = await getPublishedNotifications(30);

      console.log(
        "[MITSU] Published notifications:",
        data
      );

      const published = data.filter(
        (notification) =>
          notification.isPublished === true
      );

      published.sort((a, b) => {
        const aTime =
          a.createdAt?.toMillis?.() ?? 0;

        const bTime =
          b.createdAt?.toMillis?.() ?? 0;

        return bTime - aTime;
      });

      setNotifications(published);
    } catch (error) {
      console.error(
        "[MITSU] Failed to load notifications:",
        error
      );

      setNotifications([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;

      if (
        !target.closest(
          "[data-notification-center]"
        )
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [open]);

  const unreadCount = useMemo(() => {
    const readSet = new Set(readIds);

    return notifications.filter(
      (notification) =>
        !readSet.has(notification.id)
    ).length;
  }, [notifications, readIds]);

  function markAsRead(id: string) {
    setReadIds((current) => {
      if (current.includes(id)) {
        return current;
      }

      const updated = [...current, id];

      saveReadNotificationIds(updated);

      return updated;
    });
  }

  function markAllAsRead() {
    const allIds = notifications.map(
      (notification) => notification.id
    );

    setReadIds(allIds);
    saveReadNotificationIds(allIds);
  }

  const notificationLabel =
    language === "ar"
      ? "الإشعارات"
      : "Notifications";

  const emptyMessage =
    language === "ar"
      ? "لا توجد إشعارات حاليًا"
      : "No notifications yet";

  const errorMessage =
    language === "ar"
      ? "تعذر تحميل الإشعارات"
      : "Unable to load notifications";

  const retryLabel =
    language === "ar"
      ? "إعادة المحاولة"
      : "Try again";

  const markAllLabel =
    language === "ar"
      ? "تحديد الكل كمقروء"
      : "Mark all as read";

  return (
    <div
      className="relative"
      data-notification-center
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <button
        type="button"
        onClick={() => {
          const nextOpen = !open;
          setOpen(nextOpen);
          if (nextOpen && notifications.length === 0 && !loading) {
            void loadNotifications();
          }
        }}
        aria-label={notificationLabel}
        aria-expanded={open}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 ? (
          <span
            aria-label={`${unreadCount} ${
              language === "ar"
                ? "إشعارات غير مقروءة"
                : "unread notifications"
            }`}
            className="absolute -right-0.5 -top-0.5 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-white ring-2 ring-surface"
          >
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        ) : null}
      </button>

      {open && (
        <div className="fixed inset-x-3 top-16 z-50 w-auto overflow-hidden rounded-xl border border-border bg-surface shadow-xl sm:absolute sm:inset-x-auto sm:end-0 sm:top-12 sm:w-[min(24rem,calc(100vw-2rem))]">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-foreground">
                {notificationLabel}
              </h2>

              {unreadCount > 0 ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {unreadCount}{" "}
                  {language === "ar"
                    ? "غير مقروء"
                    : "unread"}
                </p>
              ) : null}
            </div>

            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={markAllAsRead}
                className="shrink-0 text-xs font-medium text-primary transition-colors hover:opacity-80"
              >
                {markAllLabel}
              </button>
            ) : null}
          </div>

          <div className="max-h-[70vh] overflow-y-auto sm:max-h-[28rem]">
            {loading ? (
              <div className="flex min-h-32 items-center justify-center">
                <Loader2
                  className="h-5 w-5 animate-spin text-primary"
                  aria-label={
                    language === "ar"
                      ? "جاري التحميل"
                      : "Loading"
                  }
                />
              </div>
            ) : error ? (
              <div className="flex min-h-40 flex-col items-center justify-center px-6 text-center">
                <Bell
                  className="mb-2 h-8 w-8 text-muted-foreground"
                  aria-hidden="true"
                />

                <p className="text-sm text-muted-foreground">
                  {errorMessage}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    void loadNotifications()
                  }
                  className="mt-3 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {retryLabel}
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex min-h-32 flex-col items-center justify-center px-6 text-center">
                <Bell
                  className="mb-2 h-8 w-8 text-muted-foreground"
                  aria-hidden="true"
                />

                <p className="text-sm text-muted-foreground">
                  {emptyMessage}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map(
                  (notification) => {
                    const isRead =
                      readIds.includes(
                        notification.id
                      );

                    const title =
                      getNotificationTitle(
                        notification,
                        language
                      );

                    const description =
                      getNotificationDescription(
                        notification,
                        language
                      );

                    const date =
                      formatNotificationDate(
                        notification.createdAt,
                        language
                      );

                    return (
                      <Link
                        key={notification.id}
                        href={notification.href}
                        onClick={() => {
                          markAsRead(
                            notification.id
                          );
                          setOpen(false);
                        }}
                        className={`block px-4 py-3 transition-colors hover:bg-muted ${
                          !isRead
                            ? "bg-primary/5"
                            : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="mt-1 shrink-0">
                            <span
                              className={`block h-2.5 w-2.5 rounded-full ${
                                isRead
                                  ? "bg-muted-foreground/30"
                                  : "bg-primary"
                              }`}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <h3
                                className={`min-w-0 break-words text-sm ${
                                  isRead
                                    ? "font-medium text-foreground"
                                    : "font-semibold text-foreground"
                                }`}
                              >
                                {title}
                              </h3>

                              {!isRead ? (
                                <Check
                                  className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                                  aria-hidden="true"
                                />
                              ) : null}
                            </div>

                            {description ? (
                              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">
                                {description}
                              </p>
                            ) : null}

                            {date ? (
                              <p className="mt-2 break-words text-[11px] text-muted-foreground">
                                {date}
                              </p>
                            ) : null}

                            <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-primary">
                              <span>
                                {language === "ar"
                                  ? "عرض التفاصيل"
                                  : "View details"}
                              </span>

                              <ExternalLink
                                className="h-3 w-3 shrink-0"
                                aria-hidden="true"
                              />
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

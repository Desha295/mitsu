/**
 * Admin dashboard home data (Sprint 3.1 — Admin Dashboard Foundation).
 *
 * `dashboardStats` still just supplies icon/labelKey per stat card —
 * the dashboard page (Sprint 6.0) now fetches real counts from each
 * collection's own service instead of a placeholder value.
 *
 * `quickActions` below is no longer imported by the dashboard page as
 * of Sprint 6.0 — Quick Actions are now derived directly from
 * `adminNavigation.ts` (filtered to `isImplemented: true`), so the list
 * of shortcuts can't silently drift out of sync with real navigation
 * the way this separate, hand-maintained array had (it only ever
 * listed 4 of the 10 implemented admin pages). Left in place as
 * historical reference, not deleted.
 */

export interface DashboardStat {
  id: string;
  icon: string;
  labelKey: string;
}

export const dashboardStats: DashboardStat[] = [
  { id: "announcements", icon: "Megaphone", labelKey: "admin.stats.announcements" },
  { id: "events", icon: "CalendarDays", labelKey: "admin.stats.events" },
  { id: "committees", icon: "Users", labelKey: "admin.stats.committees" },
  { id: "systems", icon: "Laptop", labelKey: "admin.stats.systems" },
  { id: "leadership", icon: "UserRound", labelKey: "admin.stats.leadership" },
  { id: "guide", icon: "Compass", labelKey: "admin.stats.guide" },
];

export interface QuickAction {
  id: string;
  icon: string;
  labelKey: string;
  href: string;
}

export const quickActions: QuickAction[] = [
  {
    id: "announcements",
    icon: "Megaphone",
    labelKey: "admin.quickActions.announcements",
    href: "/admin/announcements",
  },
  {
    id: "events",
    icon: "CalendarDays",
    labelKey: "admin.quickActions.events",
    href: "/admin/events",
  },
  {
    id: "hero",
    icon: "Image",
    labelKey: "admin.quickActions.hero",
    href: "/admin/hero",
  },
  {
    id: "settings",
    icon: "Settings",
    labelKey: "admin.quickActions.settings",
    href: "/admin/settings",
  },
];

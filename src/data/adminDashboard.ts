/**
 * Admin dashboard home data (Sprint 3.1 — Admin Dashboard Foundation).
 *
 * Static placeholders only — no Firestore reads yet (explicitly out of
 * scope this sprint). Stat values are intentionally not shown as fake
 * numbers; StatCard renders a "—" placeholder instead, consistent with
 * this project's established practice of never fabricating data that
 * could be mistaken for real (e.g. Sprint 1.7's "Coming soon" contact
 * info). Quick Actions link to future /admin/* routes that don't exist
 * yet this sprint, so QuickActionCard renders them as disabled/"coming
 * soon" rather than dead links.
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

/**
 * Admin sidebar navigation data (Sprint 3.1 — Admin Dashboard Foundation).
 *
 * Only "Dashboard" (`/admin`) is a real, working route this sprint —
 * every other item is structural/placeholder, marked `isImplemented:
 * false` so AdminSidebar can render them as "Coming soon" rather than
 * linking to routes that don't exist yet (they'll become real as future
 * sprints build /admin/announcements, /admin/events, etc.).
 */

export interface AdminNavItem {
  id: string;
  icon: string;
  labelKey: string;
  href: string;
  isImplemented: boolean;
}

export const adminNavigation: AdminNavItem[] = [
  {
    id: "dashboard",
    icon: "LayoutDashboard",
    labelKey: "admin.nav.dashboard",
    href: "/admin",
    isImplemented: true,
  },
  {
    id: "hero",
    icon: "Image",
    labelKey: "admin.nav.hero",
    href: "/admin/hero",
    isImplemented: true,
  },
  {
    id: "announcements",
    icon: "Megaphone",
    labelKey: "admin.nav.announcements",
    href: "/admin/announcements",
    isImplemented: true,
  },
  {
    id: "events",
    icon: "CalendarDays",
    labelKey: "admin.nav.events",
    href: "/admin/events",
    isImplemented: true,
  },
  {
    id: "union",
    icon: "Users",
    labelKey: "admin.nav.union",
    href: "/admin/union",
    isImplemented: true,
  },
  {
    id: "systems",
    icon: "Laptop",
    labelKey: "admin.nav.systems",
    href: "/admin/systems",
    isImplemented: true,
  },
  {
    id: "guide",
    icon: "Compass",
    labelKey: "admin.nav.guide",
    href: "/admin/guide",
    isImplemented: true,
  },
  {
    id: "studyPlans",
    icon: "FileText",
    labelKey: "admin.nav.studyPlans",
    href: "/admin/study-plans",
    isImplemented: false,
  },
  {
    id: "contact",
    icon: "Mail",
    labelKey: "admin.nav.contact",
    href: "/admin/contact",
    isImplemented: false,
  },
  {
    id: "about",
    icon: "Info",
    labelKey: "admin.nav.about",
    href: "/admin/about",
    isImplemented: false,
  },
  {
    id: "settings",
    icon: "Settings",
    labelKey: "admin.nav.settings",
    href: "/admin/settings",
    isImplemented: false,
  },
];

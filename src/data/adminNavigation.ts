/**
 * Admin sidebar navigation data.
 *
 * All items marked as implemented point to working admin routes.
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
    id: "quickAccess",
    icon: "LayoutGrid",
    labelKey: "admin.nav.quickAccess",
    href: "/admin/quick-access",
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
    id: "leadership",
    icon: "UserRound",
    labelKey: "admin.nav.leadership",
    href: "/admin/leadership",
    isImplemented: true,
  },
  {
    id: "facultyLeadership",
    icon: "GraduationCap",
    labelKey: "admin.nav.facultyLeadership",
    href: "/admin/faculty-leadership",
    isImplemented: true,
  },
  {
    id: "families",
    icon: "UsersRound",
    labelKey: "admin.nav.families",
    href: "/admin/families",
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
    isImplemented: true,
  },
  {
    id: "socialLinks",
    icon: "Share2",
    labelKey: "admin.nav.socialLinks",
    href: "/admin/social-links",
    isImplemented: true,
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
    isImplemented: true,
  },
];

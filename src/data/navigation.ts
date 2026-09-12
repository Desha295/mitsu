import type { NavigationItem } from "@/types/navigation.types";

/**
 * Main navigation, per 03_UI_UX_GUIDELINES.md #6.
 * Labels are resolved at render time via translate(item.labelKey) so no
 * text is hardcoded into layout components.
 */
export const mainNavigation: NavigationItem[] = [
  { labelKey: "nav.home", href: "/" },
  { labelKey: "nav.guide", href: "/guide" },
  { labelKey: "nav.systems", href: "/systems" },
  { labelKey: "nav.advisors", href: "/academic-advisors" },
  { labelKey: "nav.studentGroups", href: "/student-groups" },
  { labelKey: "nav.announcements", href: "/announcements" },
  { labelKey: "nav.events", href: "/events" },
  { labelKey: "nav.union", href: "/union" },
  { labelKey: "nav.families", href: "/families" },
  { labelKey: "nav.about", href: "/about" },
  { labelKey: "nav.contact", href: "/contact" },
];
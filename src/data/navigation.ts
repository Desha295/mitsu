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
  { labelKey: "nav.announcements", href: "/announcements" },
  { labelKey: "nav.union", href: "/union" },
  { labelKey: "nav.contact", href: "/contact" },
];

/**
 * Homepage data (src/data/home.ts)
 * Contains all content for Hero and Quick Access sections.
 * Data-driven per CHANGE_POLICY.md — no hardcoded content in components.
 */

import { WHATSAPP_COMMUNITY_URL } from "@/data/union";

export interface HeroData {
  /** Translation key for main heading */
  headingKey: string;
  /** Translation key for description text */
  descriptionKey: string;
  /** Translation key for primary CTA button */
  primaryCtaKey: string;
  /** Primary CTA link target */
  primaryCtaHref: string;
  /** Translation key for secondary CTA button */
  secondaryCtaKey: string;
  /** Secondary CTA link target */
  secondaryCtaHref: string;
  /** Path to hero image (from public/images/) */
  imagePath: string;
  /** Alt text translation key */
  imageAltKey: string;
}

export interface QuickAccessItem {
  id: string;
  /** Translation key for card title */
  titleKey: string;
  /** Translation key for card description */
  descriptionKey: string;
  /** Link target */
  href: string;
  /** Icon name from lucide-react */
  icon: string;
}

export const heroData: HeroData = {
  headingKey: "home.hero.heading",
  descriptionKey: "home.hero.description",
  primaryCtaKey: "home.hero.primaryCta",
  primaryCtaHref: WHATSAPP_COMMUNITY_URL,
  secondaryCtaKey: "home.hero.secondaryCta",
  secondaryCtaHref: "/guide",
  imagePath: "/images/placeholders/campus.svg",
  imageAltKey: "home.hero.imageAlt",
};

export const quickAccessItems: QuickAccessItem[] = [
  {
    id: "guide",
    titleKey: "home.quickAccess.guide.title",
    descriptionKey: "home.quickAccess.guide.description",
    href: "/guide",
    icon: "BookOpen",
  },
  {
    id: "systems",
    titleKey: "home.quickAccess.systems.title",
    descriptionKey: "home.quickAccess.systems.description",
    href: "/systems",
    icon: "Laptop",
  },
  {
    id: "union",
    titleKey: "home.quickAccess.union.title",
    descriptionKey: "home.quickAccess.union.description",
    href: "/union",
    icon: "Users",
  },
  {
    id: "announcements",
    titleKey: "home.quickAccess.announcements.title",
    descriptionKey: "home.quickAccess.announcements.description",
    href: "/announcements",
    icon: "Bell",
  },
  {
    id: "contact",
    titleKey: "home.quickAccess.contact.title",
    descriptionKey: "home.quickAccess.contact.description",
    href: "/contact",
    icon: "MessageSquare",
  },
  {
    id: "about",
    titleKey: "home.quickAccess.about.title",
    descriptionKey: "home.quickAccess.about.description",
    href: "/union",
    icon: "Info",
  },
];

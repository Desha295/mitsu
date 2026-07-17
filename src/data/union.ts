/**
 * Student Union data (Sprint 1.5).
 * All content below is official information provided directly by the
 * Student Union — used verbatim, not invented (00_PROJECT_RULES.md #17).
 * Text fields are translation keys; actual EN/AR copy lives in
 * src/locales/en.json and ar.json under "union.*".
 *
 * Types are defined inline here (not in src/types/) to match the pattern
 * established in Sprint 1.4 for guide.ts/studyPlans.ts, since this
 * sprint's approved file list does not include new type files.
 */

export interface SocialLinkItem {
  labelKey: string;
  href: string;
  /** Lucide icon name. Lucide ships no brand/logo icons, so these are
   * generic stand-ins, consistent with the Sprint 1.1 Footer decision. */
  icon: string;
}

export interface UnionLeader {
  id: string;
  nameKey: string;
  positionKey: string;
  imagePath: string;
  imageAltKey: string;
  /** Personal social links — kept separate from official Union social
   * links per Sprint 1.5's "Personal Information Separation" rule. */
  socialLinks: SocialLinkItem[];
}

export interface UnionCommittee {
  id: string;
  icon: string;
  nameKey: string;
  descriptionKey: string;
  order: number;
}

/** Union identity: overview, vision, mission, hero image. */
export const unionOverview = {
  nameKey: "union.name",
  overviewKey: "union.overview",
  visionKey: "union.vision",
  missionKey: "union.mission",
  heroImagePath: "/images/union/union-hero.svg",
  heroImageAltKey: "union.heroImageAlt",
};

/**
 * President — includes personal social links, used ONLY within the
 * President's profile card. These must never replace or be confused
 * with the official Union social links below.
 */
export const president: UnionLeader = {
  id: "president",
  nameKey: "union.leadership.president.name",
  positionKey: "union.leadership.president.position",
  imagePath: "/images/union/president.jpg",
  imageAltKey: "union.leadership.president.imageAlt",
  socialLinks: [
    {
      labelKey: "union.social.facebook",
      href: "https://www.facebook.com/share/1CtMLbAjUi/?mibextid=wwXIfr",
      icon: "Users",
    },
    {
      labelKey: "union.social.instagram",
      href: "https://www.instagram.com/_moustafa_hani?igsh=dGN6cmRla2F5b2ow&utm_source=qr",
      icon: "Camera",
    },
    {
      labelKey: "union.social.linkedin",
      href: "https://www.linkedin.com/in/mustafa-hani-2443b4365",
      icon: "Briefcase",
    },
    {
      // Provided as a phone number (01558989980); converted to the
      // standard WhatsApp deep-link format with Egypt's country code.
      labelKey: "union.social.whatsapp",
      href: "https://wa.me/201558989980",
      icon: "MessageCircle",
    },
  ],
};

/**
 * Vice President — no personal social links were provided, so this list
 * is intentionally empty. LeaderCard renders no social row in that case
 * rather than showing broken/empty links.
 */
export const vicePresident: UnionLeader = {
  id: "vice-president",
  nameKey: "union.leadership.vicePresident.name",
  positionKey: "union.leadership.vicePresident.position",
  imagePath: "/images/union/vice-president.jpg",
  imageAltKey: "union.leadership.vicePresident.imageAlt",
  socialLinks: [],
};

export const committees: UnionCommittee[] = [
  {
    id: "scientific",
    icon: "FlaskConical",
    nameKey: "union.committees.scientific.name",
    descriptionKey: "union.committees.scientific.description",
    order: 1,
  },
  {
    id: "cultural",
    icon: "BookOpenText",
    nameKey: "union.committees.cultural.name",
    descriptionKey: "union.committees.cultural.description",
    order: 2,
  },
  {
    id: "sports",
    icon: "Dumbbell",
    nameKey: "union.committees.sports.name",
    descriptionKey: "union.committees.sports.description",
    order: 3,
  },
  {
    id: "artistic",
    icon: "Palette",
    nameKey: "union.committees.artistic.name",
    descriptionKey: "union.committees.artistic.description",
    order: 4,
  },
  {
    id: "social-trips",
    icon: "Plane",
    nameKey: "union.committees.socialTrips.name",
    descriptionKey: "union.committees.socialTrips.description",
    order: 5,
  },
  {
    id: "student-families",
    icon: "Users2",
    nameKey: "union.committees.studentFamilies.name",
    descriptionKey: "union.committees.studentFamilies.description",
    order: 6,
  },
  {
    id: "scouts",
    icon: "Tent",
    nameKey: "union.committees.scouts.name",
    descriptionKey: "union.committees.scouts.description",
    order: 7,
  },
];

/**
 * Official Student Union social links — distinct from the President's
 * personal social links above (Sprint 1.5 "Personal Information
 * Separation" rule).
 */
export const unionSocialLinks: SocialLinkItem[] = [
  {
    labelKey: "union.social.officialFacebook",
    href: "https://www.facebook.com/it.must1",
    icon: "Users",
  },
  {
    labelKey: "union.social.officialInstagram",
    href: "https://www.instagram.com/informationtechnology_su",
    icon: "Camera",
  },
  {
    labelKey: "union.social.facultyGroup",
    href: "https://www.facebook.com/groups/271864861322223?locale=ar_AR",
    icon: "Users",
  },
  {
    labelKey: "union.social.whatsappCommunity",
    href: "https://chat.whatsapp.com/KlzgjQmRqGd1fAq6VwqCrd",
    icon: "MessageCircle",
  },
];
